import { Component, OnInit, Directive, Input, ViewChild } from '@angular/core';


@Directive({
  selector: '[var]',
  exportAs: 'var'
})
export class NodeDirective {
  @Input() var:Node;
}

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css'],
  template: `
  <h1>Angular 2 Recursive List</h1>
  <div class = "tree">
  <ul>
    <ng-template #recursiveList let-list>
      <li *ngFor="let item of list">
        <div id={{item.id}} class="node dropzone"  (click) = "item.toggleShowChildren()" 
        draggable="true" (dragover) = "item.handleDragOver($event)" (dragstart) = "item.handleDragStart($event)" (dragend) = "item.handleDragEnd($event)"
        (dragenter) = "item.handleDragEnter($event)" (dragleave)="item.handleDragLeave($event)"> 
          {{item.name}} 
        </div>
        <ul *ngIf="item.children.length > 0 && item.showChildren">
          <ng-container *ngTemplateOutlet="recursiveList; context:{ $implicit: item.children }"></ng-container>
        </ul>
      </li>
    </ng-template>
    <ng-container *ngTemplateOutlet="recursiveList; context:{ $implicit: root.children }"></ng-container>
  </ul>
  </div>
`
})

export class TreeViewComponent implements OnInit {
  //https://www.html5rocks.com/en/tutorials/dnd/basics/
  @Input('ngModel')
  model: any
  root: Node;
  constructor() {
    this.root = new Node(null,"root");
}

  dragged:any;
  ngOnInit() {
    let node1 = new Node(this.root);
    let node2 = new Node(node1);
    let node3 = new Node(node1);
    let node4 = new Node(node3);
    for(let i =0;i<10;i++){
      new Node(node2);
    }
   // document.addEventListener("dragstart", this.handleDragStart);
   // document.addEventListener("dragend", this.handleDragEnd);
   // document.addEventListener("drop", this.handleDrop);
    //document.addEventListener("dragover",this.handleDragOver);
  }

}


class Node {
  static dragged:Node = null;
  static currentId = 0;
  parent: Node;
  children: Node[] = []
  id:number;
  showChildren:boolean = false;
  name: string;
  classes: string[] = []

  constructor(parent:Node = null, name:string = "Node"){
    this.parent = parent;
    if( parent != null){
      this.parent.children.push(this);//[this.id] = this;
    }
    if(name =="Node"){
      this.name = name+Node.currentId;
    }
    else{
      this.name = name;
    }
    this.classes.push("node");
    this.id = Node.currentId;
    Node.currentId +=1;
  }
  toggleShowChildren(){
    this.showChildren= !this.showChildren;
  }
  grabStart(event){
    //console.log(event);
  }
  addChild(child:Node){
    if(child.parent != null){
     // console.log("Child has already parent");
      return;
    }
    this.children[child.id] = child;
    child.parent = this;
  }
 
  removeChild(child:Node){
    child.parent = null;
    delete this.children[child.id];
  }

  //CALLBACKS
  handleDragStart(event){
    Node.dragged = this;
    event.srcElement.style.borderColor = "green";
    event.dataTransfer.setData("Powitanie", this)
    console.log(event);
  }
  handleDragEnd(event){
    Node.dragged = null;
    event.srcElement.style.borderColor = "red";
  }
  handleDragOver(event){
    // return;
    // console.log(this.id, ",",event.dataTransfer);
    // document.getElementById(this.id.toString()).style.borderColor = "black";
    // if(Node.dragged.id != this.id){
    //   document.getElementById(this.id.toString()).style.borderColor = "black";
    // }
  }
  handleDragEnter(event){
    if(!event.target.classList){
      return;
    }
    if(event.target.classList.contains("dropzone")){
      event.srcElement.style.borderColor = "purple";
    }
  }
  handleDragLeave(event){
    if(!event.target.classList){
      return;
    }
    if(event.target.classList.contains("dropzone")){
      event.srcElement.style.borderColor = "red";
    }
  }
}

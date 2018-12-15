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
  <div class = "tree" (window:resize)="onResize($event)">
  <ul>
    <ng-template #recursiveList let-list>
      <li *ngFor="let item of list"  >
        <div id={{item.id}} class="dropzone node"  (click) = "item.toggleShowChildren()" 
        draggable="true"  > 
        {{item.name}} 
        </div>
        <ul id = {{-item.id}} class ="dropzone" *ngIf="item.children.length > 0 && item.showChildren">
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
    document.addEventListener("dragstart", this.handleDragStart);
    document.addEventListener("dragend", this.handleDragEnd);
    document.addEventListener("drop", this.handleDrop);
    document.addEventListener("dragenter",this.handleDragEnter);
    document.addEventListener("dragleave",this.handleDragLeave);
    document.addEventListener("dragover",this.handleDragOver);
  }
  onResize(event) {
    this.collapseNodes(this.root);
  }
  handleDragStart(event){
    event.dataTransfer.setData("text/plain", event.target.id);
  }
  collapseNodes(node:Node){
    for(let i=0;i<node.children.length;i++){
      node.children[i].showChildren = false;
      if(node.children[i].children.length>0){
        this.collapseNodes(node.children[i]);
      }
    }
  }
  handleDragEnter(event){
    
    if(!event.srcElement.classList){
      return;
    }
    if(event.srcElement.classList.contains("dropzone")){
      event.srcElement.style.backgroundColor="yellow";
    }
  }
  handleDrop(event){
    //console.log(event.srcElement);
    event.srcElement.style.backgroundColor="";
    event.preventDefault();
  }
  handleDragOver(event){
    event.preventDefault();
    if(!event.srcElement.classList){
      return;
    }
    if(event.srcElement.classList.contains("dropzone")){
      event.srcElement.style.backgroundColor="yellow";
    }
  }
  handleDragLeave(event){
    if(!event.srcElement.classList){
      return;
    }
    if(event.srcElement.classList.contains("dropzone")){
      event.srcElement.style.backgroundColor="";
    }
  }
  handleDragEnd(event){
    event.preventDefault();
    event.srcElement.style.backgroundColor="";
  }

}


class Node {
  static dragged:Node = null;
  static currentId = 0;
  static allNodes = {};
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
    Node.allNodes[this.id] = this;
    Node.currentId +=1;
  }
  toggleShowChildren(){
    this.showChildren = !this.showChildren;
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
}

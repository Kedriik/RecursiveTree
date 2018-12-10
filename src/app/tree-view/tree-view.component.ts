import { Component, OnInit,ElementRef,Inject } from '@angular/core';

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
        <div id={{item.id}} class="node"  (click) = "item.toggleShowChildren()" draggable="true"> 
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
  root: Node;
  elementRef: ElementRef;

  constructor(@Inject(ElementRef) elementRef: ElementRef) {
    this.elementRef = elementRef;
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

  }
  onClick(event) {
    console.log(event);
  }
  addTestNode(){
    let node = new Node(this.root);
  }

  handleDragStart(e) {
    this.dragged = e.target;
    this.dragged.style.borderColor = "green";
    e.dataTransfer.setData("Powitanie", e.target.id)
   // console.log(e.srcElement);
  }
  handleDragEnd(e){
    e.target.style.borderColor = "red";
    console.log(e.srcElement);
    this.dragged = null;
  }
  



}

class Node {
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
    console.log(event);
  }
  addChild(child:Node){
    if(child.parent != null){
      console.log("Child has already parent");
      return;
    }
    this.children[child.id] = child;
    child.parent = this;
  }
  dragStart(event){
    console.log(event);
  }
  removeChild(child:Node){
    child.parent = null;
    delete this.children[child.id];
  }
}

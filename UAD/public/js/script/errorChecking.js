/*
1. iteration如果为空，是否会调用其.each()方法；
2. 
*/

/*
This JS file is to Detect whether the diagram is regularized or not. 
*/
var inLinkCategories = [];
var outLinkCategories = [];
var errIdArray = [];
let NoEmptinessChecking = ["InitialNode", "ActivityFinalNode", "connector", "FlowFinalNode"];
/*
以下数组用于存储对应Node，针对不同类型进行不同的 检测处理；
*/
let nodeArray_start = [];
let nodeArray_end = [];
let nodeArray_decision = [];
let nodeArray_merge = [];
let nodeArray_parallel = [];
let nodeArray_action = [];
let nodeArray_object = [];

let nodeArray_fork = [];
let nodeArray_join = [];

/*
1. node： 无input、无output、孤立节点√；
*/
function errorChecking() {
  var allNodes = activityDiagram.nodes;
  // var gmodel = activityDiagram.model;

  classifyNodes(allNodes);

  checkAction();
  checkDecision();
  checkNodeOnput();
  checkMerge();
  checkParallel();
  checkNodeInput();
 
  // errorObject(nodeArray_action);
  // console.log(gmodel.nodeKeyProperty(nodeArray_action[2]));
  show(errIdArray);
  // clear(errIdArray);
}

function isArrayEmpty(array) {
  return array.length > 0 ? true : false;
}

function isGroupEmpty(gp) {
  if (gp.memberParts.iterator.count < 1) {
    errIdArray.push(29);
  }
}

function countOutLinks(node) {
  node.findLinksOutOf().iterator.each(inlk => {
    outLinkCategories.push(inlk["category"]);
  });

  return outLinkCategories.length;
}

function countInLinks(node) {
  node.findLinksInto().iterator.each(inlk => {
    inLinkCategories.push(inlk["category"]);
  });

  return inLinkCategories.length;
}

function resetFlowsArray() {
  inLinkCategories = [];
  outLinkCategories = [];
}

function errorObject(array) {
  for (let i = 0; i < array.length; i++) {
    // console.log(array[i]);
    let keys = activityDiagram.model.getKeyForNodeData(array[i]);
  }
}

/*
@Function: this funtion provides filtering of 'set' according to 'type'
@Parameteres: 
  'set' as source iterator of collections;
@Return: subset of 'set'                                                    */
function classifyNodes(allNodes) {
  var it = allNodes.iterator;

  /* Groups are ahead of Nodes, Links*/
  while (it.next()) {
    if (!(it.value instanceof go.Group)) {
      break;
    }
  }

  /* go.Node part */
  do {
    switch (it.value.category) {
      case "DecisionNode":
        nodeArray_decision.push(it.value);
        break;
      case "MergeNode":
        nodeArray_merge.push(it.value);
        break;
      case "InitialNode":
        nodeArray_start.push(it.value);
        break;
      case "ActivityFinalNode":
        nodeArray_end.push(it.value);
        break;
      case "FlowFinalNode":
        nodeArray_end.push(it.value);
        break;
      case "Connector":
        nodeArray_end.push(it.value);
        break;   
      case "parallel":
        nodeArray_parallel.push(it.value);
        break;
      case "Action":
        nodeArray_action.push(it.value);
        break;
      case "Object":
        nodeArray_object.push(it.value);
        break;
      default:
        break;
    }
  } while (it.next());
}

// step 1
function isAnyEmptySide(ins, outs) {
  if (ins == 0 && outs == 0) {
    errIdArray.push(12);
  } else if (ins == 0) {
    errIdArray.push(15);
  } else if (outs == 0) {
    errIdArray.push(16);
  } else {
    return ;
  }
}

/* step 2. 
This ignores special Link_Node pair such as <comment>_Behavior */
function typeCheck_LinkNode(nd) {
  let ct = nd.category;
  let tmp = new Set();

  if (ct != "Action" || ct != "DecisionNode") {
    nd.findLinksInto().iterator.each(inlk => {
      tmp.add(inlk["category"]);
    });
    nd.findLinksOutOf().iterator.each(inlk => {
      tmp.add(inlk["category"]);
    });

    if(tmp.size > 1){
      errIdArray.push(9);
    }
  }
}

// step 3, flows
function mergeFlowsQuantity(ins, outs) {
  if(outs > 1){
    errIdArray.push(4);
  }
}

function decisionFlowsQuantity(ins, outs) {
  let tmp = new Set(outLinkCategories);

  if (ins > 3) {
    errIdArray.push(3);
  }
  if ( tmp.size == 2 || tmp.size != ins) {
    inputFlow_2();
  }
  if ( ins == 1) {
    inputFlow_1();
  }
}

function parallelFlowsQuantity(ins, outs) {
  let tmp = ins*outs;
  
  if (tmp != ins && tmp != outs) {
    errIdArray.push(27);
  }
}

// step 4.
function checkAction() {
  for (let i = 0; i < nodeArray_action.length; i++) {
    let ins = countInLinks(nodeArray_action[i]);
    let outs = countOutLinks(nodeArray_action[i]);
    let x = 0;

    isAnyEmptySide(ins, outs);

    // is there any other type of link such as <comment> 
    if (0 < outLinkCategories.indexOf("CommentFlow") ) {
      errIdArray.push(9);
    }

    // is its <control> flow multiple 
    for (let j = 0; j < inLinkCategories.length; j++) {
      if (inLinkCategories[j] == "ControlFlow"){
        x++;
      }      
    }
    if (x > 1) {
      errIdArray.push(3);
    }

    // TYPE of Output flow when <control> and <object>(s) come into 

    resetFlowsArray();
  }
}

function checkDecision() {
  for (let i = 0; i < nodeArray_decision.length; i++) {
    let ins = countInLinks(nodeArray_decision[i]);
    let outs = countOutLinks(nodeArray_decision[i]);

    isAnyEmptySide(nodeArray_decision[i]);

    // quantity of flows
    decisionFlowsQuantity(ins, outs);
    // text on Guards
    // decisionGuard(nodeArray_decision[i]);

    resetFlowsArray();
  }
}

// nodes are such as {InitialNode, CommentNode, TextNode}
function checkNodeInput() {
  for (let i = 0; i < nodeArray_start.length; i++) {
    let outs = countOutLinks(nodeArray_start[i]);
    if (outs > 1) {
      errIdArray.push(21);
    }
    resetFlowsArray();
  }
}

// nodes are such as {Connector, FinalFlowNode, ActivityFinalNode }
function checkNodeOnput() {
  for (let i = 0; i < nodeArray_end.length; i++) {
    let ins = countInLinks(nodeArray_end[i]);
    if (ins > 1) {
      errIdArray.push(22);
    }
    resetFlowsArray();
  }
}

function checkMerge() {
  for (let i = 0; i < nodeArray_merge.length; i++) {
    let nd = nodeArray_merge[i];
    let ins = countInLinks(nd);
    let outs = countOutLinks(nd);

    isAnyEmptySide(nodeArray_merge[i]);

    mergeFlowsQuantity(ins, outs);
    
    resetFlowsArray();
  }
}

function checkParallel() {
  for (let i = 0; i < nodeArray_parallel.length; i++) {
    let nd = nodeArray_parallel[i];
    let ins = countInLinks(nd);
    let outs = countOutLinks(nd);

    isAnyEmptySide(nodeArray_parallel[i]);

    /*  the below part used while transferring to Unified Structure. */
    if (ins == 1) {
      nodeArray_fork.push(nd);
    } else if (outs == 1) {
      nodeArray_join.push(nd);
    } else {
      parallelFlowsQuantity(ins, outs);  
    }

    resetFlowsArray();
  }
}

/*
@Function: this funtion matches <Guard> of <DecisionNode> with Regex
@Parameteres: 
  'dn' as one <DecisionNode>;                                               */
function decisionGuard(dn) {
  dn.findLinksOutOf().iterator.each(lk => {
    console.log(lk["text"]);
    let gt = lk["label"].match(/(\[\w{1,200}])/g);

    if (!gt) {
      errIdArray.push(5);
    }
  })
}

/*
@Function: this funtion deals with the Number of <InputFlow> of <DecisionNode>
@Parameteres: 
  'dn' as one <DecisionNode>;                                               */
function inputFlow_1(){
	outLinkCategories.push(inLinkCategories[0]);
  let tmp = new Set(outLinkCategories);
  if (tmp.size > 1) {
    errIdArray.push(9);
  }
}

function inputFlow_2(){
	let cntCtrlFlows = 0;
	for (var i = inLinkCategories.length - 1; i >= 0; i--) {
		if (inLinkCategories[i] == "ControlFlow") {
			cntCtrlFlows++;
		}
	}
	if (cntCtrlFlows > 1) {
		errIdArray.push(3);
	}
}

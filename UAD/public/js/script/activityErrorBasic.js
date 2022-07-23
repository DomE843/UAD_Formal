/*
  This JS file is to Detect whether the diagram is regularized or not. 
  @Note:
    Basic Error starts from ErrId:1 to ErrId:100;
    Consistency Error starts from ErrId:101 to ErrId:200;
*/
var inLinkCategories = [];
var outLinkCategories = [];
var basicErrors = [];
/*
以下数组用于存储对应Node，针对不同类型进行不同的 检测处理；
*/
var nodeArray_Group = [];
var nodeArray_initial = [];
var nodeArray_end = [];
var nodeArray_decision = [];
var nodeArray_merge = [];
var nodeArray_action = [];
var nodeArray_object = [];
var nodeArray_fork = [];
var nodeArray_join = [];
var nodeArray_cntor = [];

/*
@Function:    This is main funciton to check all errors of Diagram;
*/
function activityErrorChecking() {
  basicErrors.length = 0;
  customClearSelections();

  let linkCount = mySubDiagram.links.count;
  const nodes = mySubDiagram.nodes; // include 'Group' nodes

  if (nodes.count + linkCount == 0) {
    custAlert("Nothing...");
    $("#ADBasicError").text("");
    return;
  }

  /*  Links-checking    */
  checkActivityLinks(mySubDiagram);

  // IF nodes cannot be classified, then the diagram has 0 nodes;
  if (classifyNodes(nodes)) {
    /*  Nodes-checking only examines Degrees and Categories   */
    checkInitialNode();
    checkFinalNode();
    checkActionNode();
    checkObjectNode();
    checkDecisionNode();
    checkMergeNode();
    checkForkNode();
    checkJoinNode();
  }

  alertErrorInfo("ADBasicError", basicErrors);
  resetNodeArrays();
}

function alertErrorInfo(id, arr) {
  let len = arr.length;
  var sLen;

  if (len == 0) {
    $("#" + id).text("");
    $("#ADErrorDetails li").remove();
    custAlert("Congratulations!");
  } else {
    sLen = String(len);
    custAlert(sLen + " Errors detected");
    $("#" + id).text("(" + sLen + ")");
    /// IF #Menu_0 is Folded, Expand it ;
    showErrorDetail(arr);
  }
}

function isGroupEmpty(gp) {
  if (gp.memberParts.iterator.count < 1) {
    let x = errorPairObj(gp.key, 3);
    addErrorItem(x, basicErrors);
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
  inLinkCategories.length = 0;
  outLinkCategories.length = 0;
}

function resetNodeArrays() {
  nodeArray_Group.length = 0;
  nodeArray_initial.length = 0;
  nodeArray_end.length = 0;
  nodeArray_decision.length = 0;
  nodeArray_merge.length = 0;
  nodeArray_action.length = 0;
  nodeArray_object.length = 0;
  nodeArray_fork.length = 0;
  nodeArray_join.length = 0;
  nodeArray_cntor.length = 0;
}

function checkIOFlowsType() {
  let tmpArr = inLinkCategories.concat(outLinkCategories);
  let tmp = new Set(tmpArr);

  return (tmp.size === 1 ? 0 : 6);
}

function emptyErrorType(ins, outs) {
  let x = 0;

  if (ins == 0 && outs == 0) {
    x = 8;
  } else if (ins == 0) {
    x = 9;
  } else if (outs == 0) {
    x = 10;
  }

  return x;
}

/*
@Function: this funtion provides filtering of 'set' according to 'type'
@Parameteres: 
  'set' as source iterator of collections;
@Return: subset of 'set'                                                      */
function classifyNodes(allNodes) {
  if (!allNodes.count) return false;

  var it = allNodes.iterator;
  it.next(); //@NOTE: Necessary !!!

  while (it.value instanceof go.Group) {
    // nodeArray_Group.push(it.value);
    it.next();
  }
  /* go.Node part */
  do {
    switch (it.value.category) {
      /*    Diagram Nodes   */
      case NodeCategories[0]:
        nodeArray_initial.push(it.value);
        break;
      case NodeCategories[1]:
        nodeArray_end.push(it.value);
        break;
      case NodeCategories[2]:
        nodeArray_end.push(it.value); // nodeArray_end has 2 types of end node
        break;
      case NodeCategories[3]:
        nodeArray_cntor.push(it.value);
        break;
      case NodeCategories[4]:
        nodeArray_action.push(it.value);
        break;
      case NodeCategories[5]:
        nodeArray_object.push(it.value);
        break;
      case NodeCategories[6]:
        nodeArray_decision.push(it.value);
        break;
      case NodeCategories[7]:
        nodeArray_merge.push(it.value);
        break;
      case NodeCategories[8]:
        nodeArray_fork.push(it.value);
        break;
      case NodeCategories[9]:
        nodeArray_join.push(it.value);
        break;
      default:
        break;
    }
  } while (it.next());

  return true;
}

function checkActionNode() {
  for (let i = 0; i < nodeArray_action.length; i++) {
    const ele = nodeArray_action[i];
    let ins = countInLinks(ele);
    let outs = countOutLinks(ele);
    let x = errorPairObj(ele.key, 0);

    if (ins > 1 && outs > 0) {
      x.rule = 15;
    } else if (ins == 1 && outs > 1) {
      x.rule = 16;
    } else if (ins == 1 && outs == 1) {
      /*
        单入单出 可以是 Control || Object
        通过 Set() 的唯一性判断 输入/输出 流是否为不允许的category；
      */
      let tmpSet = new Set(LinkCategories.slice(0, 2));
      const tmpSetSize = tmpSet.size;
      tmpSet.add(inLinkCategories[0]);
      if (tmpSet.size > tmpSetSize) {
        x.rule = 17;
      } else {
        tmpSet.add(outLinkCategories[0]);
        if (tmpSet.size > tmpSetSize) {
          x.rule = 18;
        }
      }
    } else if (ins > 0 && outs == 0) {
      x.rule = 10;
    } else if (ins == 0 && outs > 0) {
      x.rule = 9;
    } else {
      x.rule = 8;
    }
    addErrorItem(x, basicErrors);

    resetFlowsArray();
  }
}

/*
@Function:  Examing errors of Decision Node in Quantity of FLows, and Text 
            on Guard
@Condition: Suppose DecisionNode has only 1 incoming
*/
function checkDecisionNode() {
  for (let i = 0; i < nodeArray_decision.length; i++) {
    const ele = nodeArray_decision[i];
    let ins = countInLinks(ele);
    let outs = countOutLinks(ele);

    let savedError = [];

    /*  Quantity of Flows */
    if (ins * outs == 0) {
      let n = emptyErrorType(ins, outs);
      savedError.push(n);
    } else if (outs * ins > outs) {
      savedError.push(15);
    } else {
      let n = checkIOFlowsType();
      savedError.push(n);
    }

    /*  text on Guards  */
    const outLinksIter = ele.findLinksOutOf().iterator;
    let tmpSet = checkDecisionGuard(outLinksIter);

    //  Combine errorIds of Set() as ONE array;
    if (tmpSet.size > 0) {
      let tmpArr = Array.from(tmpSet);
      savedError = savedError.concat(tmpArr);
    }
    addAllErrorsOfNode(savedError, ele.key);

    savedError = [];
    tmpSet.clear();
    resetFlowsArray();
  }
}

/*
@Function:   Matches [Guard] of <DecisionNode> with Regex
*/
function checkDecisionGuard(lkIter) {
  let errorSet = new Set();

  lkIter.each(lk => {
    let s = lk.findObject("LABEL").text;
    /*  除双引号” 和单引号’之外的所有字符的匹配结果  */
    let match = s.match(/\[[^\"\']+\]/g);

    if (!s) {
      /*  If Guards on Link doesn't exist, then ignore them */
    } else if (!match) {
      errorSet.add(19);
    }
  });

  return errorSet;
}

/*
@Instruction: Each single node may have many errors
@Function:    This add ALL errors of one node into array that will output
*/
function addAllErrorsOfNode(array, key) {
  for (let i = 0; i < array.length; i++) {
    const e = array[i];
    if (e > 0) {
      let x = errorPairObj(key, e);
      addErrorItem(x, basicErrors);
    }
  }
}

function checkMergeNode() {
  for (let i = 0; i < nodeArray_merge.length; i++) {
    const ele = nodeArray_merge[i];
    let ins = countInLinks(ele);
    let outs = countOutLinks(ele);
    let x = errorPairObj(ele.key, 0);

    if (ins * outs == 0) {
      x.rule = emptyErrorType(ins, outs);
    } else if (ins * outs == ins) {
      x.rule = checkIOFlowsType();
    } else if (outs > 1) {
      x.rule = 16;
    }
    addErrorItem(x, basicErrors);

    resetFlowsArray();
  }
}

function checkJoinNode() {
  for (let i = 0; i < nodeArray_join.length; i++) {
    const ele = nodeArray_join[i];
    let ins = countInLinks(ele);
    let outs = countOutLinks(ele);
    let x = errorPairObj(ele.key, 0);

    if (ins * outs == 0) {
      x.rule = emptyErrorType(ins, outs);
    } else if (ins * outs == ins && outs == 1) {
      x.rule = checkIOFlowsType();
      addErrorItem(x, basicErrors);
      // if any of Incoming are ObjectFlows, outgoing all be ObjectFLows;
      if (inLinkCategories.includes(LinkCategories[1]) && outLinkCategories[0] !== LinkCategories[1]) {
        x.rule = 28;
        addErrorItem(x, basicErrors);
      }

      resetFlowsArray();
      return;
    } else if (outs > 1) {
      x.rule = 16;
    }
    addErrorItem(x, basicErrors);


    resetFlowsArray();
  }
}

function checkForkNode() {
  for (let i = 0; i < nodeArray_fork.length; i++) {
    const ele = nodeArray_fork[i];
    let ins = countInLinks(ele);
    let outs = countOutLinks(ele);
    let x = errorPairObj(ele.key, 0);

    if (ins * outs == 0) {
      x.rule = emptyErrorType(ins, outs);
    } else if (ins * outs == outs && ins == 1) {
      x.rule = checkIOFlowsType();
    } else if (ins > 1) {
      x.rule = 15;
    }
    addErrorItem(x, basicErrors);

    resetFlowsArray();
  }
}

/*
@Function:  Object node is roughly detected
@Note:      Object can own multiple flows in both sides itself, but if all flows
            have Non-ObjectFlow category, warn shows;
*/
function checkObjectNode() {
  for (let i = 0; i < nodeArray_object.length; i++) {
    const ele = nodeArray_object[i];
    let ins = countInLinks(ele);
    let outs = countOutLinks(ele);
    let x = errorPairObj(ele.key, 0);

    x.rule = checkIOFlowsType();
    addErrorItem(x, basicErrors);

    resetFlowsArray();
  }
}

function checkInitialNode() {
  emptyArray(nodeArray_initial, 1);

  for (let i = 0; i < nodeArray_initial.length; i++) {
    const ele = nodeArray_initial[i];
    let outs = countOutLinks(ele);
    let x = errorPairObj(ele.key, 0);

    if (outs > 1) {
      x.rule = 16;
    } else if (outs == 1) {
      if (outLinkCategories[0] != LinkCategories[0]) {
        x.rule = 18;
      }
    } else {
      x.rule = 10;
    }
    addErrorItem(x, basicErrors);

    resetFlowsArray();
  }
}

/*
@Function:  Examing Final-alike nodes with 2 steps: NodesCountChecking, FlowsChecking
*/
function checkFinalNode() {
  emptyArray(nodeArray_end, 2);

  for (let i = 0; i < nodeArray_end.length; i++) {
    const ele = nodeArray_end[i];
    let ins = countInLinks(ele);
    let x = errorPairObj(ele.key, 0);

    if (ins > 1) {
      x.rule = 15;
    } else if (ins == 1) {
      if (inLinkCategories[0] !== LinkCategories[0] && inLinkCategories[0] !== LinkCategories[1]) {
        x.rule = 17;
      }
    } else {
      x.rule = 9;
    }
    addErrorItem(x, basicErrors);

    resetFlowsArray();
  }
}

/*
@Function:  Check if the Initial Array, and Final Array are Empty;
@Parameter: 
    'array': refers to Node_dataArray
    'errId': refers to Particular fixed rule id; 1 means 'lack Initial' error
    array and errId is FIXEDLY connected;
*/
function emptyArray(array, errId) {
  let x = errorPairObj(0, 0);

  if (array.length < 1) {
    x.rule = errId;
    addErrorItem(x, basicErrors);
  }
}

function checkGroups() {
  console.log(nodeArray_Group);
  /*
  1. Link quantitiesk, in & out;
  2. memberparts, is this checking excluding ParameterNode>
  3. parameterNode, special property of <Object Node>
  4. textTitle, [optional]
  */
  for (let i = 0; i < nodeArray_Group.length; i++) {
    const ele = nodeArray_Group[i];
    let x = errorPairObj(ele.key, 0);

    var mem = ele.memberParts();
    x.rule = examineMemebers(mem);

    // ele.preConditions = [];
    // ele.postConditions = [];


  }
}

function checkConnetor(){
  var nameIdxArr = [];
  for (let j = 0; j < nodeArray_cntor.length; j++) {
    const eTxt = nodeArray_cntor[j].text;
    var idx = isExistedInObject(eTxt, nameIdxArr);

    if(nameIdxArr.length <= 0 || idx === -1) {
      var nameIdxObj = {"index": [], "name": eTxt};

      nameIdxObj.index.push(j);
      nameIdxArr.push(nameIdxObj);
    } else {
      nameIdxArr[idx].index.push(j)
    }
  }
  console.log(nameIdxArr);

  for (let i = 0; i < nameIdxArr.length; i++) {
    const e = nameIdxArr[i];
    if (e.index.length <= 1) {
      // unpaired.
    }
    
    // degree
    examingInAndOut(e, nodeArray_cntor); // find node := findNodeForKey(nodeArray_cntor[idx].key);
  }

}

function examingInAndOut(e, srcArr) {
  const eIndexes = [...e.index];
  var countFLowCategories = [];

  for (let i = 0; i < eIndexes.length; i++) {
    let idx = Number(eIndexes[i]);
    const eNode = srcArr[idx];

    var ins = countInLinks(eNode);
    var outs = countOutLinks(eNode);

    if ((ins + outs) !== 1) {
      // link num wrong;
    }

    let tmp = inLinkCategories.concat(outLinkCategories);
    if (tmp instanceof Array) {
      for (let k = 0; k < tmp.length; k++) {
        countFLowCategories.push(tmp[k]);
      }
    }

    resetFlowsArray();
  }

  var tmpSet = new Set(countFLowCategories);
  if (tmpSet.size > 1) {
    // in out categories UNmatch.
  }
}

function isExistedInObject(str, array) {
  for (let j = 0; j < array.length; j++) {
    const object = array[j];
    
    for (const key in object) {
      if (Object.hasOwnProperty.call(object, key)) {
        if (str == key) {
          return j;
        }
      }
    }
  }

  return -1;
}

// .memberParts() contains Node, Link, Part, Group
function examineMemebers(mem) {
  var x = 0;

  // const m = mem's nodes array;

  if (m.count < 1) {
    x = 3; // no members of Group
  } else if (m.count < 3) {
    x = 4;
    // @TODO: if <go.Group>Activity requires at least 3 nodes including Initil, Action, FinalEnd
  } else {
    // more memberparts checking;
  }

  return x;
}

/*
@Function:    Loop ckecking 
*/
function loopChecking(list) {
  list.each(function (nd) {
    var lk = nd.findLinksOutOf().first();
    var label = lk.findObject("LABEL").text;
    if (label) {
      return true;
    }
  });

  return false;
}

function checkActivityLinks(diagram) {
  const links = diagram.links;

  links.each(function (lk) {
    var fNodes = lk.fromNode;
    var tNodes = lk.toNode;
    let x = {
      rule: -1
    };

    if (!fNodes && !tNodes) {
      x = errorPairObj(0, 23);
    } else if (!fNodes) {
      x = errorPairObj(tNodes.key, 24);
    } else if (!tNodes) {
      x = errorPairObj(fNodes.key, 25);
    }
    // else {} // link is normally connected;
    addErrorItem(x, basicErrors);
  });
}

function addErrorItem(x, arr) {
  if (x.rule > 0) {
    arr.push(x);
  }
}

/*************************** Convert to Unified Structure - S ****************/
// Unified Structure declaration;
var usStruct = {
  // global elements & relations
  "ME":undefined,
  "RE":undefined,

  // constraints
  "CME":undefined,
  "CRE":undefined,

  // nodes
  "Nodes":{},
  "Links":{}
};


/*
@Function:    This is outter shell with Non-Parameter
@NOTE:        Changes are needed if this function is invoked in other diagrams;
*/
function activitySaveUS() {
  valueForUS(usStruct);
   
  const textDivId = "myActivitySavedModel";     // This may change
  var convertedStr = JSON.stringify(usStruct);

  $("#" + textDivId).text(convertedStr);
}

/*
@Function:    The US structure will be valued here.
*/
function valueForUS(usStruct) {
  const modelJsonStr = mySubDiagram.model.toJson();

  // global
  usStruct.ME = parsePartialJson(modelJsonStr, "nodeDataArray");
  usStruct.RE = parsePartialJson(modelJsonStr, "linkDataArray");

  // constraints

  // Node categories;
  createObjByArray(usStruct.Nodes, usStruct.ME);
  createObjByArray(usStruct.Links, usStruct.RE);
}

/*
@Function:    Parse partial string of JSONStr to a JSON object;
*/
function parsePartialJson(jsonStr, key) {
  const obj = JSON.parse(jsonStr);
  
  return obj[key];
}

/*
@Function:    An JSON Object with type will created by Node as element of NodeDataArray;
*/
function createObjByArray(obj, array) {
  for (let i = 0; i < array.length; i++) {
    const el = array[i];
    var nCate = el.category;

    // if Node type doesn't exist, then create one 
    if (!Object.hasOwnProperty.call(obj, nCate)) {
      obj[nCate] = new Array();
    }

    // if Node type existed already, append its elements;
    obj[nCate].push(el);
  }
}

/*************************** Convert to Unified Structure - E ****************/
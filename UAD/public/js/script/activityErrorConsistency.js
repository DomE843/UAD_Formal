const { toNamespacedPath } = require("path/posix");

var consistentErrors = [];

/// Activity Diagrams VS Activity Diagrams


/// Activity Diagrams VS Class Diagrams
function getClassNameOfActivity(classNames) {
  classNames.length = 0;

  for (let i = 0; i < nodeArray_object.length; i++) {
    classNames.push(nodeArray_object[i].text); 
    // classNames.push(nodeArray_object[i].data.text); 
  }
  console.log(classNames.length + " Classes Found.\n");
}

/// Activity Diagrams VS Use Case Diagrams

/**************** Activity Diagram Refinement Checking ----S *****************/
// this file must be put after actvitiyTrace.js 

function tracesInDiagram(diagram, traceList){
  /*  Begin/End node may has many ones; */
  var begins = diagram.findNodesByExample({
    category: NodeCategories[0]
  });
  var ends = [];
  getEnds(ends);

  begins.each(begin => {
    setPathsDistance(begin);

    for (let i = 0; i < ends.length; ++i) {
      collectAllPaths(begin, ends[i], traceList);
    }
  });

  console.log(">>>Paths from diagram: \n");
  console.log(pathsList_before);
}

function getBeginIterator() {
  let begin = mySubDiagram.findNodesByExample({
    category: NodeCategories[0]
  });
  return begin;
}

function getEnds(ends) {
  mySubDiagram.nodes.iterator.each(nd => {
    const cat = nd.category;
    if (cat === NodeCategories[1] || cat === NodeCategories[2]) {
      ends.push(nd);
    }
  });
}

function restsss(){
  // keyBefore, keyAfter
  // var dataBeforeRef = myUmlDiagram.findNodeForKey(keyBefore).data.umlDiagramData;
  // var dataAfterRef = myUmlDiagram.findNodeForKey(keyAfter).data.umlDiagramData;

  var copiedKeysBefore = [];
  var copiedKeysAfter = [];

  var refinePairing = {
    "BRefDiagramNodes": copyKeysFromNodes(copiedKeysBefore, dataBeforeRef),
    "ARefDiagramNodes": copyKeysFromNodes(copiedKeysAfter, dataAfterRef),
    "Reflection":[
      { bRef: "0", aRef:[2, 3, 6, 7] },
      { bRef: "1", aRef:[8, 9] },
      { bRef: "2", aRef:[] },
      { bRef: "4", aRef:[4, 5] }
    ]
  };

  // Element(s) that cannot be refined further in dataBeforeRef
  var unRefinedNodes = [];  // <string>
  getKeysFromObjArray(unRefinedNodes, refinePairing);
  console.log(unRefinedNodes.length + " Nodes unrefined.");

  var missedRefs = [];
  hasRefined(refinePairing, missedRefs);
  console.log(missedRefs.length + " Nodes missing refinement.");
}

function copyKeysFromNodes(res, nodeDataArray){
  for (let i = 0; i < nodeDataArray.length; i++) {
    res.push(nodeDataArray[i].key);
  }
}

function getKeysFromObjArray(intersec, obj){
  for (let i = 0; i < obj.Reflection.length; i++) {
    const object = obj.Reflection[i];
    if (!obj.BRefDiagramNodes.includes(object.bRef)) {
      intersec.push(object.bRef);
    }
  }
}

function hasRefined(obj, res) {
  const afterRef = obj.ARefDiagramNodes;
  const array = obj.Reflection;
  
  var tmpArray = [];
  for (let i = 0; i < array.length; i++) {
    tmpArray = tmpArray.concat(array[i].aRef);
  }
  console.log(tmpArray.length);

  // Complexity of O2
  for (let j = 0; j < tmpArray.length; j++) {
    const e = tmpArray[j];
    if (!afterRef.includes(e)) {
      res.push(e);
    }
  }
  
}




function sequenceApproximate() {
  /*  ActivityDiagram cannot be displayed in multiple DiagramDiv at same time
      variable below must be Global in UML level                          */
  var pathsList_before = new go.List(); // List or Array?
  var pathsList_after = new go.List();

  // the Path _before and _after is differed from DiagramJsonData
  tracesInDiagram(mySubDiagram, pathsList_before);
  tracesInDiagram(mySubDiagram, pathsList_after);
  
  // 上近似对应的 source - targets[]
  var keysPairArr = [];
  refKeysReflection(keysPairArr);

  // 获取上近似路径
  nodesOnPathList.each(function (path) {
    var subSeq = [];
    
    path.each(function (node) {
      var idx = isNodeRefined(keysPairArr, node.key);

      if (idx >= 0) {
        subSeq.push(keysPairArr[idx].parent);
      }
    });
    
    pathsList_before.push(subSeq);
    subSeq.length = 0;
  });

  // 上近似路径去重
  var strSequence = new Set();
  sequenceFilter(pathsList_before);
  stringSeqOfList(strSequence, pathsList_before);

  var src = new Set();
  // call path function to get traces of a diagram
  // beside, make pathFunction paramed with @Param: PathsList & Diagram
  sequenceFilter(src);
  
  var matching = compRefSequence(src, strSequence);
  if (matching === src.size) {
    console.log("Full match");
  // } else if (matching === 0) {
  //   console.log("No match found");
  } else {
    console.log("No Match found");
  }
}

function sequenceFilter(pathsList) {
  pathsList.each(function (path) {
    for (let i = 0; i < path.length; i++) {
      var e1 = path.get(i);
      var e2 = path.get(i+1);

      if (e1 === e2) {
        path.removeAt(i);
      }
    }
  });
}

function compRefSequence(src, dest){
  var x = 0;

  dest.iterator.each(function (d) {
    if (src.has(d)) {
      x++;
    }
  });
  
  return x;
}

function stringSeqOfList(strSet, list){
  list.each(function (l){
    strSet.add(l.toArray().join("").toString());
  });
}

function isNodeRefined(array, key) {
  for (let i = 0; i < array.length; i++) {
    const e = array[i];
    if (e.child.includes(key)) {
     return i;
    }
  }
}

function refKeysReflection(array){
  // read json configuration locally
  var edges = consisObj.consistency.Edge;
  for (let i = 0; i < edges.length; i++) {
    const e = edges[i];
    const idx = isStringInObjArray(e.source, array);
    
    if ( idx > -1) {
      array[idx].child.push(e.target);
    } else {
      var refObj = {"parent": e.source, "child": [] };
      refObj.child.push(e.target);

      array.push(refObj);
    }
  }
}

function isStringInObjArray(str, objArr){
  if (objArr.length <= 0) {
    return -1;
  }

  var matchedIdx = -1;
  for (let i = 0; i < objArr.length; i++) {
    if (objArr[i].parent === str) {   // 严格 字符串 比较，类型必须一致
      matchedIdx = i;
      break;
    }
  }

  return matchedIdx;
}

function traceExaming(srcTrace) {
  var mainTraces = [];

  // get possible main traces from upBound_init & dnBound_final; dicard
  crossTraces(mainTraces);

  // upperApproximation of each possible main trace
  var approxTraces = [];
  upwardApproximation(mainTraces, approxTraces);

  // match the upperApproximation, and make a basical checking results
  var restTraces = [];
  basicApproxTraceCheck(srcTrace, approxTraces, restTraces);

  // for each matched trace, do further checking in particular brach in refined diagram
}

/**************** Activity Diagram Refinement Checking ----E *****************/
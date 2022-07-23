/*
  @NOTE:  The diagram trace is from one of Initialnodes to one of other FinalNodes
  and the trace has conditions such as :
    1. Loop
    2. Bad ends( not finished by FinalNodes )
    3. Bad starts(vnot finished by InitialNodes )
*/

// A collection of all of the paths between a pair of nodes, a List of Lists of Nodes
var paths = null;
var nodesOnPathList = new Array();
var loopPathList = new go.List();

function subDiagramTrace() {
  var bLst = new go.List();
  var eLst = new go.List();

  /*  Begin/End node may has many ones; */
  getBegins(bLst);
  getEnds(eLst);

  cleanSubDiagramTrace();
  pathForTwoList(bLst, eLst);
}

function subDiagramLoop() {
  var bLst = new go.List();
  var eLst = new go.List();

  /*  Begin/End node may has many ones; */
  getBegins(bLst);
  getEnds(eLst);

  cleanSubDiagramTrace();
  subDiagLoopForLists(bLst, eLst);
}

function getBegins(list) {
  let begin = mySubDiagram.findNodesByExample({
    category: NodeCategories[0]
  });
  list = new go.List(begin);
  console.log("Iterator to go.List for begin :" + list.length);
}

function getEnds(list) {
  mySubDiagram.nodes.iterator.each(nd => {
    const cat = nd.category;
    if (cat === NodeCategories[1] || cat === NodeCategories[2]) {
      list.push(nd);
    }
  });
  console.log("Push to go.List for end :" + list.length);
}

function cleanSubDiagramTrace() {
  /*  Cleaning at first */
  popDiv('ADdiv_trace');
  $("#activityDiagramPath").find("option").remove();

  paths = null;
  nodesOnPathList.length = 0;
  loopPathList.clear();
}

function subDiagLoopForLists(bLst, eLst) {
  bLst.iterator.each(begin => {
    setPathsDistance(begin);

    for (let i = 0; i < eLst.length; ++i) {
      listLoop(begin, eLst.get(i));

      /*  Set '.distance' of each Node to 0 in case that 
          node has different distance in different paths;  */
      // changeNodeDistance(0);
    }
  });
}

// Have each node show how far it is from the BEGIN node.
// This sets the "distance" property on each node.data.
function setPathsDistance(begin) {
  // compute and remember the distance of each node from the BEGIN node
  degree = findDistances(begin);

  // show the distance on each node
  var it = degree.iterator;
  while (it.next()) {
    var n = it.key;
    var deg = it.value;
    mySubDiagram.model.setDataProperty(n.data, "distance", deg);
    // set flag of isTraversed = false. If it is true, the path ends;
  }
}

// List all paths from BEGIN to END
function listLoop(begin, end) {
  collectAllPaths(begin, end, nodesOnPathList);

  const Global_sel = document.getElementById("activityDiagramPath");
  Global_sel.innerHTML = "";

  /*  Simplify the Loops  */
  loopsSimplify(loopPathList);

  loopPathList.each(function (p) {
    var opt = document.createElement("option");
    opt.text = pathToString(p);
    Global_sel.add(opt, null);
  });

  Global_sel.onchange = highlightSelectedPath;
}

// List all paths from BEGIN to END
function listPathsOption(begin, end, list) {
  collectAllPaths(begin, end, list);
  console.log(list.length + " Paths collected");

  const Global_sel = document.getElementById("activityDiagramPath");
  Global_sel.innerHTML = ""; // clear out any old Option elements
  nodesOnPathList.iterator.each(function (p) {
    var opt = document.createElement("option");
    opt.text = pathToString(p);

    Global_sel.add(opt, null);
  });
  Global_sel.onchange = highlightSelectedPath;
}

// Return a string representation of a path for humans to read.
function pathToString(path) {
  var s = 'Length：' + path.length + ' | Path：';
  for (var i = 0; i < path.length; i++) {
    if (i > 0) s += " -> ";
    s += path.get(i).data.text;
  }
  return s;
}
// This is only used for listing all paths for the selection onchange event.

// When the selected item changes in the Selection element,
// highlight the corresponding path of nodes.
function highlightSelectedPath() {
  const Global_sel = document.getElementById("activityDiagramPath");
  if (Global_sel.selectedIndex < 0) {
    Global_sel.selectedIndex = 0;
  }
  highlightPath(loopPathList.elt(Global_sel.selectedIndex));
}

// Highlight a particular path, a List of Nodes.
function highlightPath(path) {
  mySubDiagram.clearHighlighteds();
  for (var i = 0; i < path.count - 1; i++) {
    var f = path.get(i);
    var t = path.get(i + 1);
    f.findLinksTo(t).each(function (l) {
      l.isHighlighted = true;
    });
  }
}


// There are three bits of functionality here:
// 1: findDistances(Node) computes the distance of each Node from the given Node.
//    This function is used by setPathsDistance to update the model data.
// 2: findShortestPath(Node, Node) finds a shortest path from one Node to another.
//    This uses findDistances.  This is used by highlightShortestPath.
// 3: collectAllPaths(Node, Node) produces a collection of all paths from one Node to another.
//    This is used by listPathsOption.  The result is remembered in a global variable
//    which is used by highlightSelectedPath.  This does not depend on findDistances.

// Returns a Map of Nodes with distance values from the given source Node.
// Assumes all links are directional.
function findDistances(source) {
  var diagram = source.diagram;
  var degree = new go.Map( /*go.Node, "number"*/ );

  var nit = diagram.nodes;
  while (nit.next()) {
    var n = nit.value;
    degree.set(n, Infinity);
  }
  // the source node starts with distance 0
  degree.set(source, 0);
  // keep track of nodes for which we have set a non-Infinity distance,
  // but which we have not yet finished examining
  var seen = new go.Set( /*go.Node*/ );
  seen.add(source);

  // keep track of nodes we have finished examining;
  // this avoids unnecessary traversals and helps keep the SEEN collection small
  var finished = new go.Set( /*go.Node*/ );
  while (seen.count > 0) {
    // look at the unfinished node with the shortest distance so far
    var clstNode = getClosestNode(seen, degree);
    var leastdist = degree.get(clstNode);

    // by the end of this loop we will have finished examining this clstNode node
    seen.delete(clstNode);
    finished.add(clstNode);
    // look at all Links connected with this node
    var it = clstNode.findLinksOutOf();

    while (it.next()) {
      var link = it.value;
      var neighbor = link.getOtherNode(clstNode);
      // skip nodes that we have finished
      if (finished.has(neighbor)) continue;
      var neighbordist = degree.get(neighbor);
      // assume "distance" along a link is unitary, but could be any non-negative number.
      var deg = leastdist + 1; //Math.sqrt(clstNode.location.distanceSquaredPoint(neighbor.location));
      if (deg < neighbordist) {
        // if haven't seen that node before, add it to the SEEN collection
        if (neighbordist === Infinity) {
          seen.add(neighbor);
        }
        // record the new best distance so far to that node
        degree.set(neighbor, deg);
      } else if (deg == leastdist - 1) {
        custAlert("Equal distance of neighbor minus");
      } else if (deg == leastdist) {
        custAlert("Equal distance of neighbor");
      }
    }
  }

  return degree;
}

// This helper function finds a Node in the given collection that has the smallest distance.
function getClosestNode(nodesOnPathList, degree) {
  var bestdist = Infinity;
  var bestnode = null;

  var it = nodesOnPathList.iterator;
  while (it.next()) {
    var n = it.value;
    var deg = degree.get(n);
    if (deg < bestdist) {
      bestdist = deg;
      bestnode = n;
    }
  }

  return bestnode;
}

// Find a path that is shortest from the BEGIN node to the END node.
// (There might be more than one, and there might be none.)
function findShortestPath(begin, end) {
  //   // compute and remember the distance of each node from the BEGIN node
    degree = findDistances(begin);

    // now find a path from END to BEGIN, always choosing the adjacent Node with the lowest distance
    var path = new go.List();
    path.add(end);
    while (end !== null) {
      var next = getClosestNode(end.findNodesInto(), degree);
      if (next !== null) {
        if (degree.get(next) < degree.get(end)) {
          path.add(next); // making progress towards the beginning
        } else {
          next = null; // nothing better found -- stop looking
        }
      }
      end = next;
    }
    // reverse the list to start at the node closest to BEGIN that is on the path to END
    // NOTE: if there's no path from BEGIN to END, the first node won't be BEGIN!
    path.reverse();
    return path;
}

// Recursively walk the graph starting from the BEGIN node;
// when reaching the END node remember the list of nodes along the current path.
// Finally return the collection of paths, which may be empty.
// This assumes all links are directional.
function collectAllPaths(begin, end, nodesOnPathList) {
  var nodeList = new go.List();   

  function findPathsByLinks(source, end) {
    source.findNodesOutOf().each(function (n) {
      if (n === source) return; // ignore reflexive links
      if (n === end) { // success
        var path = nodeList.copy();
        path.add(end); // finish the path at the end node
        nodesOnPathList.push(path); // remember the whole path
      } else if (!nodeList.has(n)) { // inefficient way to check having visited
        nodeList.add(n); // remember that we've been here for this path (but not forever)
        findPathsByLinks(n, end);
        nodeList.removeAt(nodeList.count - 1);
      } else {
      // if (n === end && nodeList.has(n)) {
        var loop = nodeList.copy();
        loop.add(n);
        loopPathList.add(loop);
      }
    });
  }

  nodeList.add(begin); // start the path at the begin node
  findPathsByLinks(begin, end);
  // return nodesOnPathList;
}


/*
@Function:  Extract Loop from the Global path from BeginNode
*/
function loopFromPath(lst) {
  /*  index of the Last Element fistly appear in the list */
  var index = lst.indexOf(lst.last());
  lst.removeRange(0, index - 1);
}

/*
@Function:  Clean all duplicated loops by Loop's Length and Loop's Node
*/
function loopsSimplify(glst) {
  const len = glst.length;

  /*  1. 从完整路径中提取出循环的那一段路径(相同元素之间即是)   */
  for (i = 0; i < len; i++) {
    loopFromPath(glst.get(i));
  }

  var delListIndex = new Set();

  /*  2. 找出重复的Loop路径在list中的位置  */
  ///@NOTE: here "i < Math.floor(len / 2)" is SUPPOSED, inaccurately Stop this Loop
  for (var i = 0; i < Math.floor(len / 2); i++) {
    for (var j = i + 1; j < len; j++) {
      var base = glst.get(i);
      var comp = glst.get(j);

      if (base.length != comp.length) {
        continue;
      } else {
        var flag = isListsHaveSame(base, comp);

        if (flag) {
          delListIndex.add(j);
        }
      }
    }
  }

  /*  3. 根据索引删除重复的Loop路径 */
  let tmpArr = Array.from(delListIndex);
  removeFromLists(glst, tmpArr);

  /*  4. (Optional)删除Loop中无条件终止的 */
}

/*
@Function:  Remove list by Given index in array
*/
function removeFromLists(glst, array) {
  heapSort(array);

  for (let i = 0; i < array.length; i++) {
    glst.removeAt(array[i] - i); // (<go.List>gLst的长度会动态变化)
  }
}

/*
@Function:    Compare Two lists without ordering
*/
function isListsHaveSame(lista, listb) {
  var len = lista.length;

  // len--; // list最后一个元素与第一个元素相同，舍去比较
  var s = 0;
  /// WARN: 'i - j < len' is NOT a good termination
  // for (var i = 0, j = 0; i - j < len;) {
  //   const x = lista.get(i).key;
  //   const y = listb.get(j).key;
  //   if (x == y) {
  //     s++;
  //     j++;
  //     j %= len;
  //     console.log(i + "|" + j);
  //   }
  //   i++;
  //   i %= len;
  // }
  /// WARN: this is too much Time-Costing!!! To be optimized
  lista.each(function (la) {
    if (listb.has(la)) {
      s++;
    }
  });

  return (s == len ? true : false);
}

function isLoopConditional(loop) {
  loop.each(nd => {
    // check Link between Loop Nodes only;
  });

  return 0;
}

function loopCheck(loop) {
  const ndCat = loop.first().category;
  var x = errorPairObj(x.key, 0);

  if (ndCat == NodeCategories[7]) {        // MergeNode
    x.rule = isLoopConditional(loop);
    /// return safe loop for LoopsList to delete
  } else if (ndCat == NodeCategories[9]) { // JoinNode
    x.rule = 12;
  }
  addErrorItem(x, basicErrors);
}

function loopsChecking(loops) {
  loops.forEach(loop => {
    loopCheck(loop);    
  });
}

/*************************** Heap Sort Algorithm - S ************************/
function swapInArray(arr, a, b) {
  let tmp = arr[a];
  arr[a] = arr[b];
  arr[b] = tmp;
}

function heapShiftDown(arr, i, len) {
  let tmp = arr[i];

  for (var j = (i << 1) + 1; j < len; j = (j << 1) + 1) {
    tmp = arr[i];

    /*  Find the Largest one of Children nodes, then compare with Father Node */
    if (j < len - 1 && arr[j] < arr[j + 1]) {
      j++;
    }

    if (tmp < arr[j]) { // if father node LT child node
      swapInArray(arr, i, j);
      i = j;
    } else {
      break;
    }
  }
}

function heapSort(arr) {
  const len = arr.length;

  /*  Initialize as Big Heap, and Start with first Non-Leaf node  */
  for (let i = Math.floor(len / 2 - 1); i >= 0; i--) {
    heapShiftDown(arr, i, len);
  }

  for (let j = Math.floor(len - 1); j > 0; j--) {
    swapInArray(arr, 0, j); // swap root with last node;
    heapShiftDown(arr, 0, j); // j means that The comparison continues until the very last node
  }
}
/*************************** Heap Sort Algorithm - E ************************/
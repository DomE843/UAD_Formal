/**
 * This file mainly copes with paths in UML diagrams, and it is origninally de-
 * signed for Activity diagram to find:
 *  1). normal paths between given types of nodes (By default, between Initial
 *      Nodes and Final Nodes); 
 *  2). loops in this entire diagram.
 * Besides, getting the shortest path is also enabled.
 */
var normPaths = new go.List();
var loopPaths = new go.List();

function findPathsBetweenTypes(bLst, eLst) {
  bLst.iterator.each(begin => {

    for (let i = 0; i < eLst.length; ++i) {
      listPaths(begin, eLst.get(i));
    }
  });
}

function findLoopsBetweenTypes(bLst, eLst) {
  bLst.iterator.each(begin => {

    for (let i = 0; i < eLst.length; ++i) {
      listLoop(begin, eLst.get(i));
    }
  });
}

/********************  Show all paths results --- Start  ********************/
function listLoop(begin, end) {
  collectAllPaths(begin, end, normPaths);

  const pathsDiv = document.getElementById(pathsDivId);
  pathsDiv.innerHTML = "";

  /*  Simplify the Loops  */
  loopsSimplify(loopPaths);

  loopPaths.each(function (p) {
    var opt = document.createElement("option");
    opt.text = printPath(p);
    pathsDiv.add(opt, null);
  });

  pathsDiv.onchange = () => {
    highlightSelectedPath(loopPaths);
  };
}

function listPaths(begin, end) {
  collectAllPaths(begin, end, normPaths);

  const pathsDiv = document.getElementById(pathsDivId);
  pathsDiv.innerHTML = ""; 
  normPaths.iterator.each(function (p) {
    var opt = document.createElement("option");
    opt.text = printPath(p);

    pathsDiv.add(opt, null);
  });
  pathsDiv.onchange = () => {
    highlightSelectedPath(normPaths);
  };
}
/********************  Show all paths results --- End  ********************/

function collectAllPaths(begin, end, totalPaths) {
  var visited = new go.List();

  function findPathsByLinks(source, end) {
    source.findNodesOutOf().each(function (n) {
      if (n === source) return; 
      if (n === end) {
        var path = visited.copy();
        path.add(n); 
        totalPaths.push(path);
      } else if (!visited.has(n)) {
        visited.push(n); 
        findPathsByLinks(n, end);
        visited.pop();
      } else {
        var loop = visited.copy();
        loop.add(n);
        loopPaths.add(loop);
      }
    });
  }

  visited.add(begin); 
  findPathsByLinks(begin, end);
}

function printPath(path) {
  var s = 'Size：' + path.length + ' | Sequence: ';
  for (var i = 0; i < path.length; i++) {
    if (i > 0) s += ", ";
    s += path.get(i).data.text;
  }
  return s;
}

function highlightSelectedPath(paths) {
  const pathsDiv = document.getElementById(pathsDivId);
  if (pathsDiv.selectedIndex < 0) {
    pathsDiv.selectedIndex = 0;
  }
  highlightPath(paths.elt(pathsDiv.selectedIndex));
}

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
    glst.removeAt(array[i] - i);
  }
}

/*
@Function:    Compare Two lists without ordering
*/
function isListsHaveSame(lista, listb) {
  var len = lista.length;

  var s = 0;
  lista.each(function (la) {
    if (listb.has(la)) {
      s++;
    }
  });

  return (s == len ? true : false);
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

    if (tmp < arr[j]) {
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
    swapInArray(arr, 0, j); heapShiftDown(arr, 0, j);
  }
}
/*************************** Heap Sort Algorithm - E ************************/


/********************  Find shortest path --- Start  ********************/
function findDistances(source) {
  var diagram = source.diagram;
  var degree = new go.Map( /*go.Node, "number"*/);

  var nit = diagram.nodes;
  while (nit.next()) {
    var n = nit.value;
    degree.set(n, Infinity);
  }
  degree.set(source, 0);
  var seen = new go.Set( /*go.Node*/);
  seen.add(source);

  var finished = new go.Set( /*go.Node*/);
  while (seen.count > 0) {
    var clstNode = getClosestNode(seen, degree);
    var leastdist = degree.get(clstNode);

    seen.delete(clstNode);
    finished.add(clstNode);
    var it = clstNode.findLinksOutOf();

    while (it.next()) {
      var link = it.value;
      var neighbor = link.getOtherNode(clstNode);
      if (finished.has(neighbor)) continue;
      var neighbordist = degree.get(neighbor);
      var deg = leastdist + 1; if (deg < neighbordist) {
        if (neighbordist === Infinity) {
          seen.add(neighbor);
        }
        degree.set(neighbor, deg);
      }
    }
  }

  return degree;
}

function setPathsDistance(begin) {
  degree = findDistances(begin);

  var it = degree.iterator;
  while (it.next()) {
    var n = it.key;
    var deg = it.value;
    mySubDiagram.model.setDataProperty(n.data, "distance", deg);
  }
}

function getClosestNode(normPaths, degree) {
  var bestdist = Infinity;
  var bestnode = null;

  var it = normPaths.iterator;
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

function findShortestPath(begin, end) {
  let degree = findDistances(begin);

  var path = new go.List();
  path.add(end);
  while (end !== null) {
    var next = getClosestNode(end.findNodesInto(), degree);
    if (next !== null) {
      if (degree.get(next) < degree.get(end)) {
        path.add(next);
      } else {
        next = null;
      }
    }
    end = next;
  }
  path.reverse();
  return path;
}
/********************  Find shortest path --- End  ********************/

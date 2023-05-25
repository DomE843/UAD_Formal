// /***************************************Context Menu InitialNode************************************/
/*
@Instructions:  This file offers functions to generate Ports&its functions on Action node
Here are several parts that requires changing:
  1. ActionNode in NodeTemplateMap
  2. ActionNode by dragging on Palette(model.addData())
  3. "nodeMenu" and "portMenu" must be put in file: activityDiagram.js
*/


function makeDiagramContextButton(text, action, visiblePredicate) {
  return $$("ContextMenuButton",
    $$(go.TextBlock, text), { click: action },
    // don't bother with binding GraphObject.visible if there's no predicate
    visiblePredicate ? new go.Binding("visible", "", function(o, e) { return o.diagram ? visiblePredicate(o, e) : false; }).ofObject() : {});
}

// Add a port to the specified side of the selected nodes.
function addPort(side) {
  mySubDiagram.startTransaction("addPort");
  mySubDiagram.selection.each(function(node) {
    // skip any selected Links
    if (!(node instanceof go.Node)) return;
    // compute the next available index number for the side
    var i = 0;
    while (node.findPort(side + i.toString()) !== node) i++;
    // now this new port name is unique within the whole Node because of the side prefix
    var name = side + i.toString();
    // get the Array of port data to be modified
    var arr = node.data[side + "SidePorts"];
    if (arr) {
      // create a new port data object
      var newportdata = {
        portId: name,
        portColor: "blue"
      };
      // and add it to the Array of port data
      mySubDiagram.model.insertArrayItem(arr, -1, newportdata);
    }
  });
  mySubDiagram.commitTransaction("addPort");
}

// Exchange the position/order of the given port with the next one.
// If it's the last one, swap with the previous one.
function swapOrder(port) {
  var arr = port.panel.itemArray;
  if (arr.length >= 2) { // only if there are at least two ports!
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].portId === port.portId) {
        mySubDiagram.startTransaction("swap ports");
        if (i >= arr.length - 1) i--; // now can swap I and I+1, even if it's the last port
        var newarr = arr.slice(0); // copy Array
        newarr[i] = arr[i + 1]; // swap items
        newarr[i + 1] = arr[i];
        // remember the new Array in the model
        mySubDiagram.model.setDataProperty(port.part.data, port._side + "SidePorts", newarr);
        mySubDiagram.commitTransaction("swap ports");
        break;
      }
    }
  }
}

// Remove the clicked port from the node.
// Links to the port will be redrawn to the node's shape.
function removePort(port) {
  mySubDiagram.startTransaction("removePort");
  var pid = port.portId;
  var arr = port.panel.itemArray;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].portId === pid) {
      mySubDiagram.model.removeArrayItem(arr, i);
      break;
    }
  }
  mySubDiagram.commitTransaction("removePort");
}

// Remove all ports from the same side of the node as the clicked port.
function removeAll(port) {
  mySubDiagram.startTransaction("removePorts");
  var nodedata = port.part.data;
  var side = port._side; // there are four property names, all ending in "SidePorts"
  mySubDiagram.model.setDataProperty(nodedata, side + "SidePorts", []); // an empty SidePorts
  mySubDiagram.commitTransaction("removePorts");

  // return true;
}

function portPanel() {
  return [{
    fromLinkable: true,
    toLinkable: true,
    cursor: "pointer",
    contextMenu: portMenu
  }];
}

function portShape(mrgV, mrgH) {
  return [{
    fill: null,
    stroke: "gray",
    strokeWidth: 0.8,
    desiredSize: new go.Size(6, 6),
    margin: new go.Margin(mrgV, mrgH)
  }];
}

/***************************************Context Menu end************************************/
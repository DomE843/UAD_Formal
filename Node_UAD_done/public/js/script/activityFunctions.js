function folderLinks(group) {
  group.findExternalLinksConnected().each(function(l) {
    l.visible = (l.fromNode.isVisible() && l.toNode.isVisible());
  });
}

function highlightGroup(e, grp, show) {
  if (!grp) return;
  e.handled = true;
  if (show) {
    var tool = grp.diagram.toolManager.draggingTool;
    var map = tool.draggedParts || tool.copiedParts;
    if (grp.canAddMembers(map.toKeySet())) {
      grp.isHighlighted = true;
      return;
    }
  }
  grp.isHighlighted = false;
}

function finishDrop(e, grp) {
  var ok = (grp !== null ?
    grp.addMembers(grp.diagram.selection, true) :
    e.diagram.commandHandler.addTopLevelParts(e.diagram.selection, true));
  if (!ok) e.diagram.currentTool.doCancel();
}

function addLane(obj) {
  var fromNode = obj.part.adornedPart;
  var from_loc = fromNode.location.copy();
  var from_bnds = fromNode.findObject("SHAPE").actualBounds;

  activityDiagram.beginTransaction("Create A Lane");

  var objNode = {
    text: "New Lane",
    color: "transparent",
    isGroup: true
  };
  objNode.loc = String(from_loc.x + from_bnds.width) + " " + String(from_loc.y);
  var Grp_sz = String(from_bnds.width - strkWdth) + " " + String(from_bnds.height - strkWdth);
  activityDiagram.model.setDataProperty(objNode, "size", Grp_sz);
  objNode.key = Number(fromNode.key) + 1;
  activityDiagram.model.addNodeData(objNode);

  activityDiagram.commitTransaction("Create A Lane");
}

function makeLinkTemplate(typename, strokeArray, toArrowShape) {
  var link = $$(go.Link, {
      routing: go.Link.Normal,
      toShortLength: 4,
      relinkableFrom: true,
      relinkableTo: true,
      reshapable: true,
      // selectable: false, // for path selecting
      resegmentable: true
    }, {
      doubleClick: function(e, lk) {
        e.diagram.commandHandler.editTextBlock(lk.findObject("LABEL"));
      }
    },
    new go.Binding("points").makeTwoWay(),
    /* Line of LINK */
    $$(go.Shape, {
        isPanelMain: true,
        strokeDashArray: strokeArray
      }, new go.Binding("stroke", "isHighlighted", function(h) {
        return h ? "pink" : blackPure;
      })
      .ofObject(),
      new go.Binding("strokeWidth", "isHighlighted", function(h) {
        return h ? 3 : 1;
      })
      .ofObject()),
    /* ToArrowShape of LINK */
    $$(go.Shape, {
        toArrow: toArrowShape
      }, new go.Binding("fill", "isHighlighted", function(h) {
        return h ? "pink" : blackPure;
      })
      .ofObject()),
    /* Text on LINK */
    $$(go.Panel, "Auto",
      $$(go.Shape, "RoundedRectangle", {
        strokeWidth: 0.5,
        fill: null,
        stroke: null,
        fromLinkable: false,
        toLinkable: false
      }),
      $$(go.TextBlock, {
        editable: true,
        name: "LABEL",
        wrap: go.TextBlock.WrapFit,
        alignment: go.Spot.Center
      }),
      new go.Binding("text", "label").makeTwoWay())); // doesn't save to json;

  activityDiagram.linkTemplateMap.set(typename, link);
}

// Define a function for creating a "port" that is normally transparent.
// The "name" is used as the GraphObject.portId,
// the "align" is used to determine where to position the port relative to the body of the node,
// the "spot" is used to control how links connect with the port and whether the port
// stretches along the side of the node,
// and the boolean "output" and "input" arguments control whether the user can draw links from or to the port.
function makePort(name, align, spot, output, input) {
  var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
  // the port is basically just a transparent rectangle that stretches along the side of the node,
  // and becomes colored when the mouse passes over it
  return $$(go.Shape, {
    fill: "transparent",
    strokeWidth: 0,
    width: horizontal ? NaN : 8, // if not stretching horizontally, just 8 wide
    height: !horizontal ? NaN : 8, // if not stretching vertically, just 8 tall
    alignment: align,
    stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical),
    portId: name,
    fromSpot: spot,
    fromLinkable: output,
    toSpot: spot,
    toLinkable: input,
    cursor: "pointer",
    mouseEnter: function(e, port) { // the PORT argument will be this Shape
      if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
    },
    mouseLeave: function(e, port) {
      port.fill = "transparent";
    }
  });
}

function setShape() {
  return [{
      cursor: "pointer",
      stroke: blackPure,
      strokeWidth: 2,
      fill: defaultPure,
      portId: "",
      name: "SHAPE",
      minSize: new go.Size(10, 10),
      maxSize: new go.Size(400, 400)
    },
    new go.Binding("angle").makeTwoWay(),
    new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
    new go.Binding("stroke", "isHighlighted", function(h) {
      return h ? "red" : blackPure;
    })
    .ofObject()
  ];
}

function setNode() {
  return [{
      locationSpot: go.Spot.Center,
      selectable: true,
      resizable: true,
      resizeObjectName: "SHAPE",
      rotatable: true,
      contextMenu: activityContextMenu,
    },
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify)
  ];
}

function setPanel() {
  return [{
      name: "PANEL"
    },
    new go.Binding("angle").makeTwoWay()
  ];
}

function setGroup() {
  return [{
      layerName: "Background",
      background: "transparent",
      movable: true,
      copyable: false,
      avoidable: false
    },
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify)
  ];
}

function setText() {
  return [{
    text: "",
    editable: true,
    wrap: go.TextBlock.WrapFit,
    alignment: go.Spot.Center
  }, new go.Binding("text").makeTwoWay()];
}
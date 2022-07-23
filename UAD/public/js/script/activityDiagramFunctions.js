function folderLinks(group) {
  group.findExternalLinksConnected().each(l => {
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

/*
@Function: Shape in <go.Group>Partition is Rectangle without .linkbable
*/
function shapeWithoutLinks(null_x, null_y) {
  const nodeShape = $$(go.Shape, "Rectangle", {
      name: "SHAPE",
      fill: null,
      strokeWidth: 1,
      maxSize: new go.Size(5000, 5000),
      minSize: new go.Size(400, 300),
      fromLinkableDuplicates: false,
      toLinkableDuplicates: false,
      fromLinkableSelfNode: false,
      toLinkableSelfNode: false,
      fromLinkable: false,
      toLinkable: false
    },
    new go.Binding("fill", "isHighlighted", function (h) {
      return h ? "rgba(119,136,153,0.1)" : "transparent";
    }).ofObject(),
    new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify));

  return nodeShape;
}

/*
@Function: Shape in <go.Group>Other is RoundedRectangle with .linkbable
*/
function shapeWithLinks(fillColor, dsh) {
  const nodeShape = $$(go.Shape, "RoundedRectangle", {
      name: "SHAPE",
      fill: fillColor,
      strokeWidth: 1,
      strokeDashArray: dsh,
      parameter1: 14, // set the Corner-radius of border
      maxSize: new go.Size(5000, 5000),
      minSize: new go.Size(400, 300),
      fromLinkableDuplicates: false,
      toLinkableDuplicates: false,
      fromLinkableSelfNode: false,
      toLinkableSelfNode: false,
      fromLinkable: true,
      toLinkable: true,
      portId: "",
      cursor: "pointer"
    },
    new go.Binding("fill", "isHighlighted", function (h) {
      return h ? "rgba(119,136,153,0.1)" : "transparent";
    }).ofObject(),
    new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify));

  return nodeShape;
}

/*
@Function:  Make serveral Group node for ActivityDiagram
@Parameter: 
  setShapeFunc: A function name which will be invoked in makeGroupTemplate();
  dsh:          shape's 'strokeDashArray' property, as para of setShapeFunc()
  fillColor:    shape's 'fill' property, as para of setShapeFunc()
*/
function makeGroupTemplate(setShapeFunc, dsh, fillColor) {
  const grp = $$(go.Group, "Vertical", setGroup(), {
      /* Decide group's location which also affects placeholder by its alignment */
      locationSpot: go.Spot.TopLeft,
      background: "transparent",
      handlesDragDropForMembers: true, // true to declare three mouseEvents below
      mouseDragEnter: function (e, grp, prev) {
        highlightGroup(e, grp, true);
      },
      mouseDragLeave: function (e, grp, next) {
        highlightGroup(e, grp, false);
      },
      mouseDrop: function (e, grp) {
        if (!e.diagram.selection.any(function (n) {
            return n instanceof go.Group;
          })) {
          var ok = grp.addMembers(grp.diagram.selection, true);
          if (ok) {
            folderLinks(grp);
          } else {
            e.diagram.commandHandler.addTopLevelParts(e.diagram.selection, true);
          }
        } else {
          e.diagram.currentTool.doCancel();
        }
      },
      subGraphExpandedChanged: function (grp) {
        var shp = grp.resizeObject;
        if (grp.diagram.undoManager.isUndoingRedoing) return;
        /* 
        Modified the Group so that Group can Fold/Expand 
        both Horizontally/Vertically   
        */
        if (grp.isSubGraphExpanded) {
          shp.width = grp.data.savedWidth;
          shp.height = grp.data.savedHeight;
        } else {
          if (!(isNaN(shp.height) || isNaN(shp.width))) {
            grp.diagram.model.set(grp.data, "savedWidth", shp.width);
            grp.diagram.model.set(grp.data, "savedHeight", shp.height);
          }
          shp.width = NaN;
          shp.height = NaN;
        }
        folderLinks(grp);
      }
    }, {
      selectable: true,
      selectionObjectName: "SHAPE",
      resizable: true,
      resizeObjectName: "SHAPE"
    },
    new go.Binding("isSubGraphExpanded", "expanded").makeTwoWay(),
    // the lane HEADER
    $$(go.Panel, "Horizontal", {
        name: "HEADER",
        angle: 0,
        margin: new go.Margin(10, 0, 0, 0),
        alignment: go.Spot.Center
      },
      $$(go.Panel, "Auto", new go.Binding("visible", "isSubGraphExpanded").ofObject(),
        $$(go.TextBlock, "NewLane", {
            name: "LANETITLE",
            font: "bold 13pt sans-serif",
            editable: true,
            margin: new go.Margin(2, 0, 0, 0)
          },
          new go.Binding("text", "text").makeTwoWay())),
      $$("SubGraphExpanderButton", {
        margin: 5
      })
    ),
    // the CONTAINER
    $$(go.Panel, "Auto", {
        name: "CONTAINER",
        margin: new go.Margin(0, 0, 10, 0)
      },
      setShapeFunc(dsh, fillColor),
      $$(go.TextBlock, {
          font: "bold 13pt sans-serif",
          editable: true,
          angle: 90,
          alignment: go.Spot.TopLeft,
          margin: new go.Margin(4, 0, 0, 2)
        },
        new go.Binding("visible", "isSubGraphExpanded", function (e) {
          return !e;
        }).ofObject(),
        new go.Binding("text", "text").makeTwoWay())
    )
  );
  return grp;
}

/*
@Function:  to make linkTemplate 
*/
function makeLinkTemplate(strokeArray, fillColor, toArrowShape) {
  var link = $$(go.Link, {
      routing: go.Link.Normal,
      relinkableFrom: true,
      relinkableTo: true,
      reshapable: true,
      resegmentable: true
    }, {
      doubleClick: function (e, lk) {
        e.diagram.commandHandler.editTextBlock(lk.findObject("LABEL"));
      }
    },
    new go.Binding("points").makeTwoWay(),
    /* Line of LINK */
    $$(go.Shape, {
        isPanelMain: true,
        strokeDashArray: strokeArray
      }, new go.Binding("stroke", "isHighlighted", function (h) {
        return h ? "red" : blackPure;
      })
      .ofObject(),
      new go.Binding("strokeWidth", "isHighlighted", function (h) {
        return h ? 3 : 1;
      })
      .ofObject()),
    /* ToArrowShape of LINK */
    $$(go.Shape, {
        toArrow: toArrowShape
      }, new go.Binding("fill", "isHighlighted", function (h) {
        return h ? "red" : fillColor;
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
      $$(go.TextBlock, setText(), {
        name: "LABEL"
      })
    ));

  return link;
}

function addLinkTemplates(diagram, linkTemplateArray) {
  for (let i = 0; i < linkTemplateArray.length; i++) {
    diagram.linkTemplateMap.set(LinkCategories[i], linkTemplateArray[i]);
  }
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
    new go.Binding("fill"),
    new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
    new go.Binding("stroke", "isHighlighted", function (h) {
      return h ? "red" : blackPure;
    })
    .ofObject()
  ];
}

function setNode() {
  return [{
      locationSpot: go.Spot.Center,
      selectable: true,
      selectionObjectName: "SHAPE",
      resizable: true,
      resizeObjectName: "SHAPE",
      rotatable: true,
      // contextMenu: nodeMenu
    },
    new go.Binding("angle").makeTwoWay(),
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    new go.Binding("fill", "isSelected", function (s, obj) {
      return s ? "DogerBlue" : obj.part.data.color;
    }).ofObject(),
    new go.Binding("visible", "isVisible", function (isV) {
      if (isV == "") {
        return "true";
      }
    }).makeTwoWay()
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
      // layerName: "Background",
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
    }, new go.Binding("text").makeTwoWay(),
    new go.Binding("font")
  ];
}

/*  Customize a Frament shape */
go.Shape.defineFigureGenerator('FunctionBar', function(shape, w, h) {
  var p1 = 5;
  if (shape !== null) {
      var param1 = shape.parameter1;
      if (!isNaN(param1) && param1 >= 0) p1 = param1; // can't be negative or NaN
  }
  p1 = Math.min(p1, w / 2);
  p1 = Math.min(p1, h / 2); // limit by whole height or by half height?
  var geo = new go.Geometry();
  // a single figure consisting of straight lines and quarter-circle arcs
  geo.add(new go.PathFigure(0, 0)
      .add(new go.PathSegment(go.PathSegment.Line, w, 0))
      .add(new go.PathSegment(go.PathSegment.Line, w, h - p1))
      // .add(new go.PathSegment(go.PathSegment.Arc, 0, 90, w - p1, h - p1, p1, p1))
      .add(new go.PathSegment(go.PathSegment.Line, w * 0.7, h))
      .add(new go.PathSegment(go.PathSegment.Line, 0, h).close()));
  // don't intersect with two bottom corners when used in an "Auto" Panel
  geo.spot1 = new go.Spot(0, 0, 0.3 * p1, 0);
  geo.spot2 = new go.Spot(1, 1, -0.3 * p1, -0.3 * p1);
  return geo;
});

/*
@Function:  Solution of dragging HTML element into go.Group in GoJS
            The key is to Add group.key to the property of node
*/
function nodeDraggingToGroup(nd, ad) {
  const draggingNode = new go.Point.parse(nd.loc);

  /*  @NOTE:  Finding Groups below NOT supports Embedded groups */
  ad.findTopLevelGroups().iterator.each(gp => {
    const grpBounds = gp["actualBounds"];
    if (
      draggingNode.x >= grpBounds.x &&
      draggingNode.x < (grpBounds.x + grpBounds.width) &&
      draggingNode.y >= grpBounds.y &&
      draggingNode.y < (grpBounds.y + grpBounds.height)
    ) {
      nd.group = gp.key;
    }
  });

  return nd;
}
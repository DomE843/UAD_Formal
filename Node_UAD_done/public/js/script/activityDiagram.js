/******************************Diagram Initial*************************************/
/* Global Adornments here */
var grpResizingAdornment = $$(go.Adornment, "Spot",
  $$(go.Placeholder),
  /* Below these are resizing shape and their location */
  $$(go.Shape, {
      alignment: go.Spot.BottomRight,
      desiredSize: new go.Size(6, 6),
      fill: defaultPure,
      stroke: "dodgerblue",
      cursor: "se-resize"
    },
    new go.Binding("visible", "", function (ad) {
      if (ad.adornedPart === null) return false;
      return ad.adornedPart.isSubGraphExpanded;
    }).ofObject()),
  $$(go.Shape, {
      alignment: go.Spot.Bottom,
      desiredSize: new go.Size(6, 6),
      fill: defaultPure,
      stroke: "dodgerblue",
      cursor: "s-resize"
    },
    new go.Binding("visible", "", function (ad) {
      if (ad.adornedPart === null) return false;
      return ad.adornedPart.isSubGraphExpanded;
    }).ofObject()),
  $$(go.Shape, {
      alignment: go.Spot.Right,
      desiredSize: new go.Size(6, 6),
      fill: defaultPure,
      stroke: "dodgerblue",
      cursor: "e-resize"
    },
    new go.Binding("visible", "", function (ad) {
      if (ad.adornedPart === null) return false;
      return ad.adornedPart.isSubGraphExpanded;
    }).ofObject())
);

var grpSelectionAdornment = $$(go.Adornment, "Spot",
  $$(go.Panel, "Auto",
    $$(go.Shape, {
      fill: null,
      stroke: "lightblue",
      strokeWidth: 4
    }),
    $$(go.Placeholder)
  ),
  $$("Button", {
      alignmentFocus: go.Spot.TopLeft,
      alignment: go.Spot.TopRight,
      click: addLane
    },
    $$(go.Shape, "PlusLine", {
      stroke: "Orange",
      strokeWidth: 1.5,
      desiredSize: new go.Size(4, 14)
    })
  )
);

function diagramInit() {
  /*  Diagram Configuration Initially  */
  activityDiagram =
    $$(go.Diagram, "myDiagramDiv", {
      allowDrop: true,
      initialContentAlignment: go.Spot.TopLeft,
      mouseDrop: function (e) {
        finishDrop(e, null);
      },
      grid: $$(go.Panel, "Grid",
        $$(go.Shape, "LineH", {
          stroke: "lightgray",
          strokeWidth: 0.5
        }),
        $$(go.Shape, "LineV", {
          stroke: "lightgray",
          strokeWidth: 0.5
        })
      ),
      // defaultCursor: "Grab",
      "grid.visible": true,
      "draggingTool.dragsLink": true,
      "draggingTool.isGridSnapEnabled": true,
      /*  Linking management */
      "linkingTool.isUnconnectedLinkValid": true,
      "linkingTool.portGravity": 20,
      "relinkingTool.isUnconnectedLinkValid": true,
      "relinkingTool.portGravity": 20,
      /*  Rotating management */
      "rotatingTool.snapAngleMultiple": 10,
      "rotatingTool.snapAngleEpsilon": 10,

      "commandHandler.copiesGroupKey": true,
      "animationManager.isEnabled": false,
      // enable undo & redo
      "undoManager.isEnabled": true
    });

  /*  NodeTemplates of Diagram    */
  // from 'makeNodeTemple()' to realize the Simplicity!!!
  activityDiagram.nodeTemplate =
    $$(go.Node, "Auto", setNode(), {
        mouseDrop: function (e, node) {
          if (!e.diagram.selection.any(function (n) {
              return n instanceof go.Group;
            })) {
            var ok = node.containingGroup.addMembers(node.containingGroup.diagram.selection, true);
            if (ok) {
              folderLinks(node.containingGroup);
            } else {
              e.diagram.commandHandler.addTopLevelParts(e.diagram.selection, true);
            }
          } else {
            e.diagram.currentTool.doCancel();
          }
        }
      },
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
      $$(go.Shape, "Rectangle", setShape()),
      $$(go.TextBlock, setText(),{
          margin: 4,
          fromLinkable: false,
          toLinkable: false
        })
    );
  activityDiagram.nodeTemplateMap.add("parallel",
    $$(go.Node, "Spot", setNode(),
      $$(go.Panel, "Auto", setPanel(),
        $$(go.Shape, "RoundedRectangle", setShape(), {
          strokeWidth: 1,
          stroke: blackPure,
          fill: blackPure,
          fromLinkable: true,
          toLinkable: true,
          margin: new go.Margin(5, 3, 5, 3),
          toSpot: go.Spot.TopSide,
          fromSpot: go.Spot.BottomSide,
        }),
        $$(go.TextBlock, setText(), {
          text:"This hidden text is for Cursor"
        }))
    ));
  activityDiagram.nodeTemplateMap.add("ActivityFinalNode",
    $$(go.Node, "Spot", setNode(),
      $$(go.Panel, "Spot", setPanel(),
        // new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
        $$(go.Shape, "Circle", setShape(), {
          fromLinkable: false,
          toLinkable: true,
          toLinkableDuplicates: false,
          toLinkableSelfNode: false,
          desiredSize: new go.Size(40, 40)
        }),
        $$(go.Shape, "Circle", {
          fill: blackPure,
          stroke: blackPure,
          desiredSize: new go.Size(20, 20)
        })
      )
    ));
  activityDiagram.nodeTemplateMap.add("InitialNode",
    $$(go.Node, "Auto", setNode(),
      $$(go.Panel, "Auto", setPanel(),
        $$(go.Shape, "Ellipse", setShape(), {
          fromLinkable: true,
          toLinkable: false,
          fill: blackPure
        }),
        $$(go.TextBlock, setText())
      )
    ));
  activityDiagram.nodeTemplateMap.add("FlowFinalNode",
    $$(go.Node, "Auto", setNode(),
      $$(go.Panel, "Auto", setPanel(),
        $$(go.Shape, "Junction", setShape(), {
          fromLinkable: false,
          toLinkable: true,
          toLinkableDuplicates: false,
          toLinkableSelfNode: false,
          fill: defaultPure,
          strokeWidth: 2
        }),
        $$(go.TextBlock, "", setText())
      )
    ));
  activityDiagram.nodeTemplateMap.add("Connector",
    $$(go.Node, "Auto", setNode(),
      $$(go.Panel, "Auto", setPanel(),
        $$(go.Shape, "Circle", setShape(), {
          fromLinkable: true,
          toLinkable: true,
          fill: null,
          strokeDashArray: [3, 2]
        }),
        $$(go.TextBlock, setText())
      )
    ));
  activityDiagram.nodeTemplateMap.add("Action",
    $$(go.Node, "Auto", setNode(),
      // { doubleClick: function(e, node) { console.log("Double clicked."); } },
      $$(go.Panel, "Auto", setPanel(),
        $$(go.Shape, "RoundedRectangle", setShape(), {
          fromLinkable: true,
          fromLinkableDuplicates: false,
          fromLinkableSelfNode: false,
          toLinkable: true,
          toLinkableDuplicates: false,
          toLinkableSelfNode: false,
          fill: blackLinear
        }),
        // $$("SubGraphExpanderButton", {
        //   margin: 5
        // }),
        $$(go.TextBlock, setText(),{
          font: "bold 10pt Arial Black",
          margin: 3
        })
      )
    ));
  activityDiagram.nodeTemplateMap.add("Object",
    $$(go.Node, "Auto", setNode(),{isVisible: false},
      $$(go.Panel, "Auto", setPanel(),
        $$(go.Shape, setShape(), {
          fromLinkable: true,
          fromLinkableDuplicates: false,
          fromLinkableSelfNode: false,
          toLinkable: true,
          toLinkableDuplicates: false,
          toLinkableSelfNode: false,
          fill: "white",
          strokeWidth: 1
        }),
        $$(go.TextBlock, setText(),{
            font: "10pt Consolas",
            margin: 3
          })
      )
    ));
  activityDiagram.nodeTemplateMap.add("DecisionNode",
    $$(go.Node, "Spot", setNode(),
      $$(go.Panel, "Auto", setPanel(),
        $$(go.Shape, "Diamond", setShape(), {
          fill: "white",
          fromLinkable: true,
          toLinkable: true,
          minSize: new go.Size(20, 10),
          maxSize: new go.Size(1000, 800)
        }),
        $$(go.TextBlock, setText())
      )
    ));
  activityDiagram.nodeTemplateMap.add("MergeNode",
    $$(go.Node, "Spot", setNode(),
      $$(go.Panel, "Auto", setPanel(),
        $$(go.Shape, "Diamond", setShape(), {
          fill: "lightgray",
          fromLinkable: true,
          toLinkable: true,
          minSize: new go.Size(20, 10),
          maxSize: new go.Size(1000, 800)
        }),
        $$(go.TextBlock, setText())
      )
    ));
  activityDiagram.nodeTemplateMap.add("SendCall",
    $$(go.Node, "Auto", setNode(),
      $$(go.Panel, "Auto", setPanel(),
        $$(go.Shape, "PrimitiveFromCall", setShape(), {
          angle: 180,
          fromLinkable: true,
          fromLinkableDuplicates: false,
          fromLinkableSelfNode: false,
          toLinkable: true,
          toLinkableDuplicates: false,
          toLinkableSelfNode: false,
        }),
        $$(go.TextBlock, setText(),{
          alignment: go.Spot.Right
        })
      )
    ));
  activityDiagram.nodeTemplateMap.add("ReceiveCall",
    $$(go.Node, "Auto", setNode(),
      $$(go.Panel, "Auto", setPanel(),
        $$(go.Shape, "PrimitiveToCall", setShape(), {
          fromLinkable: true,
          fromLinkableDuplicates: false,
          fromLinkableSelfNode: false,
          toLinkable: true,
          toLinkableDuplicates: false,
          toLinkableSelfNode: false,
        }),
        $$(go.TextBlock, setText())
      )
    ));
  activityDiagram.nodeTemplateMap.add("Behavior",
    $$(go.Node, "Auto", setNode(),
      $$(go.Panel, "Auto", setPanel(),
        $$(go.Shape, "Card", setShape(), {
          angle: 90,
          fill: yellowLinear,
          fromLinkable: true,
          toLinkable: false,
          strokeWidth: 0.5,
        }),
        $$(go.TextBlock, setText())
      )
    ));
  activityDiagram.nodeTemplateMap.add("Text",
    $$(go.Node, "Auto", {
        selectable: true,
        resizable: true,
        locationSpot: go.Spot.Center
      },
      $$(go.Panel, "Auto",
        $$(go.Shape, "Rectangle", {
            stroke: null,
            strokeWidth: 0,
            fill: null,
            portId: "",
            fromLinkable: true,
            fromLinkableDuplicates: false,
            fromLinkableSelfNode: false,
            toLinkable: true,
            toLinkableDuplicates: false,
            toLinkableSelfNode: false
          },
          new go.Binding("desiredSize", "size").makeTwoWay()
        ),
        $$(go.TextBlock, setText(),{
            margin: new go.Margin(15, 3, 15, 3),
            font: "italic 12pt Consolas"
          })
      )
    ));

  activityDiagram.groupTemplate =
    $$(go.Group, "Vertical", setGroup(), {
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
          if (grp.isSubGraphExpanded) {
            shp.width = grp.savedBreadth;
            shp.height = grp.savedBreadth;
          } else {
            // what does 'savedBreadth' means ???
            // how to get height data
            grp.savedBreadth = shp.width;
            shp.width = NaN;
          }
          folderLinks(grp);
        }
      }, {
        selectable: true,
        selectionObjectName: "SHAPE",
        selectionAdornmentTemplate: grpSelectionAdornment
      }, {
        resizable: true,
        resizeObjectName: "SHAPE",
        resizeAdornmentTemplate: grpResizingAdornment
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
          $$(go.TextBlock, {
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
        $$(go.Shape, "Rectangle", {
            name: "SHAPE",
            fill: defaultPure,
            strokeWidth: 1,
            maxSize: new go.Size(1000, 2000)
          },
          new go.Binding("fill", "isHighlighted", function (h) {
            return h ? "rgba(119,136,153,0.1)" : "transparent";
          }).ofObject(),
          new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)),
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
    ); // end Group
  // activityDiagram.groupTemplateMap.add("Group_Activity",
  //   $$(go.Group, "Auto", setGroup(), {
  //       /* Decide group's location which also affects placeholder by its alignment */
  //       locationSpot: go.Spot.TopLeft,
  //       background: "transparent",
  //       handlesDragDropForMembers: true, // true to declare three mouseEvents below
  //       mouseDragEnter: function (e, grp, prev) {
  //         highlightGroup(e, grp, true);
  //       },
  //       mouseDragLeave: function (e, grp, next) {
  //         highlightGroup(e, grp, false);
  //       },
  //       mouseDrop: function (e, grp) {
  //         if (!e.diagram.selection.any(function (n) {
  //             return n instanceof go.Group;
  //           })) {
  //           var ok = grp.addMembers(grp.diagram.selection, true);
  //           if (ok) {
  //             folderLinks(grp);
  //           } else {
  //             e.diagram.commandHandler.addTopLevelParts(e.diagram.selection, true);
  //           }
  //         } else {
  //           e.diagram.currentTool.doCancel();
  //         }
  //       },  // when Folded resize it to size like <Action> node
  //       subGraphExpandedChanged: function (grp) {
  //         var shp = grp.resizeObject;
  //         if (grp.diagram.undoManager.isUndoingRedoing) return;
  //         if (grp.isSubGraphExpanded) {
  //           shp.width = grp.savedBreadth;
  //         } else {
  //           // what if I get a Height? 
  //           grp.savedBreadth = shp.width;  
  //           shp.width = NaN;
  //         }
  //         folderLinks(grp);
  //       }
  //     }, {
  //       selectable: true,
  //       selectionObjectName: "SHAPE",
  //       selectionAdornmentTemplate: grpSelectionAdornment
  //     }, {
  //       resizable: true,
  //       resizeObjectName: "SHAPE",
  //       resizeAdornmentTemplate: grpResizingAdornment
  //     },
  //     new go.Binding("isSubGraphExpanded", "expanded").makeTwoWay(),

  //     // the header {groupName, button};
  //     $$(go.Panel, "Horizontal", 
  //       {
  //         name: "ActivityHeader",
  //         locationSpot: go.Spot.TopLeft,  // members aligned from TopLeft corner
  //         alignment: go.Spot.TopRight     // Header is located in the TopRight corner of Group
  //       },
  //       $$(go.TextBlock, {
  //         alignment: go.Spot.Bottom,
  //         name: "ActivityName",
  //         editable: true
  //       },
  //       new go.Binding("text").makeTwoWay()),
  //       /*
  //       1. when 'Folded', re-size both Width&Height;
  //       2. when 'isGroup=false', reset to be a <go.Node>
  //       */
  //       $$("SubGraphExpanderButton", {
  //         margin: 5
  //       }),
  //     ),
  //     // the CONTAINER
  //     $$(go.Panel, "Auto", {
  //         name: "CONTAINER",
  //         margin: new go.Margin(0, 0, 10, 0)
  //       },
  //       $$(go.Shape, "Rectangle", {
  //           name: "SHAPE",
  //           fill: defaultPure,
  //           strokeWidth: 1,
  //           maxSize: new go.Size(1000, 2000)
  //         },
  //         new go.Binding("fill", "isHighlighted", function (h) {
  //           return h ? "rgba(200,136,153,0.1)" : "transparent";
  //         }).ofObject(),
  //         new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify))
  //     )
  //   ));

  // activityDiagram.linkTemplate = ControlFlow;
  makeLinkTemplate("ControlFlow",[0,0],"Standard");
  makeLinkTemplate("ObjectFlow",[0,0],"OpenTriangle");
  makeLinkTemplate("CommentFlow",[3,2],"Circle");

  // load();

  // Get a copy of activityDiagram for function defining.
  // myDiagram = activityDiagram;
}
/******************************Diagram Initial*************************************/
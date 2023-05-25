/******************************Diagram Initial*************************************/
function gojsInit() {
  /*  Diagram Configuration Initially  */
  mySubDiagram =
    $$(go.Diagram, "activityDiagramDiv", {
      allowDrop: true,
      initialContentAlignment: go.Spot.Center,
      mouseDrop: function (e) {
        finishDrop(e, null);
      },
      "grid.visible": false,

      // defaultCursor: "Grab",
      // "LinkDrawn": maybeChangeLinkCategory,     // these two DiagramEvents call a
      // "LinkRelinked": maybeChangeLinkCategory,  // function that is defined below

      "clickCreatingTool.archetypeNodeData": {
        text: ' ',
        category: NodeCategories[4]
      },
      // have mouse wheel events zoom in and out instead of scroll up and down
      "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
      "allowTextEdit": true,

      /*  DraggingTools */
      "draggingTool.dragsLink": true,
      "draggingTool.isGridSnapEnabled": true,
      /*  LinkingTools */
      "linkingTool.isUnconnectedLinkValid": true,
      "linkingTool.archetypeLinkData": {
        category: LinkCategories[0],
      },
      "linkingTool.portGravity": 20,
      "relinkingTool.isUnconnectedLinkValid": true,
      "relinkingTool.portGravity": 20,

      "commandHandler.copiesGroupKey": true,
      "animationManager.isEnabled": false,
      // enable undo & redo
      "undoManager.isEnabled": true
    });

  /* 
    customLinkingTool defined in PolylineLinkingTool.js, and save the Points data
    Unless activitySave() changed  
  */
  // var customLinkingTool = new PolylineLinkingTool();
  // mySubDiagram.toolManager.linkingTool = customLinkingTool;

  mySubDiagram.model.modelData = {
  }; //添加一个对象用于在json中存放额外数据

  /********************************* Diagram Listener S***********************/
  mySubDiagram.addDiagramListener("Modified", function (e) {
    var button = document.getElementById("btn_save");
    if (button) button.disabled = !mySubDiagram.isModified;
    var idx = document.title.indexOf("*");
    if (mySubDiagram.isModified) {
      if (idx < 0) document.title += "*";
    } else {
      if (idx >= 0) document.title = document.title.substr(0, idx);
    }
  });

  mySubDiagram.addDiagramListener("BackgroundSingleClicked", function (e) {
    customClearSelections();
    //@NOTE 单击 go.Diagram 背景，清除所有高亮/选择； 已迁到 背景DrawingBoard的Click 事件上 ；
  });
  /********************************* Diagram Listener E***********************/

  /*  NodeTemplates of Diagram    */
  // from 'makeNodeTemple()' to realize the Simplicity!!!
  mySubDiagram.nodeTemplate =
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
      $$(go.TextBlock, setText(), {
        margin: 4,
        fromLinkable: false,
        toLinkable: false
      })
    );
  mySubDiagram.nodeTemplateMap.add(NodeCategories[0],
    $$(go.Node, "Auto", setNode(),
      $$(go.Panel, "Auto", setPanel(),
        $$(go.Shape, "Ellipse", setShape(), {
          fromLinkable: true,
          toLinkable: false,
          minSize: new go.Size(20, 20),
          fill: "black"
        }),
        $$(go.TextBlock, setText())
      )
    ));
  mySubDiagram.nodeTemplateMap.add(NodeCategories[1],
    $$(go.Node, "Spot", setNode(),
      $$(go.Panel, "Spot", setPanel(),
        // new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
        $$(go.Shape, "Circle", setShape(), {
          fromLinkable: false,
          toLinkable: true,
          toLinkableDuplicates: false,
          toLinkableSelfNode: false,
          minSize: new go.Size(20, 20),
          maxSize: new go.Size(40, 40)
        }),
        $$(go.Shape, "Circle", {
          fill: "black",
          stroke: "black",
          desiredSize: new go.Size(10, 10)
        }),
        $$(go.TextBlock, setText())
      )
    ));
  mySubDiagram.nodeTemplateMap.add(NodeCategories[2],
    $$(go.Node, "Auto", setNode(),
      $$(go.Panel, "Auto", setPanel(),
        $$(go.Shape, "Junction", setShape(), {
          fromLinkable: false,
          toLinkable: true,
          toLinkableDuplicates: false,
          toLinkableSelfNode: false,
          fill: "white",
          minSize: new go.Size(20, 20),
          strokeWidth: 2
        }),
        $$(go.TextBlock, setText())
      )
    ));
  mySubDiagram.nodeTemplateMap.add(NodeCategories[3],
    $$(go.Node, "Auto", setNode(),
      $$(go.Panel, "Auto", setPanel(),
        $$(go.Shape, "Circle", setShape(), {
          fromLinkable: true,
          toLinkable: true,
          fill: null,
          minSize: new go.Size(20, 20),
          strokeDashArray: [3, 2]
        }),
        $$(go.TextBlock, setText())
      )
    ));
  mySubDiagram.nodeTemplateMap.add(NodeCategories[4],
    $$(go.Node, "Auto", setNode(),
      $$(go.Panel, "Auto", setPanel(),
        $$(go.Shape, "RoundedRectangle", setShape(), {
          fromLinkable: true,
          fromLinkableDuplicates: false,
          fromLinkableSelfNode: false,
          toLinkable: true,
          toLinkableDuplicates: false,
          toLinkableSelfNode: false,
          fill: $$(go.Brush, "Linear", {
            0: "lightgray",
            0.5: "white",
            1: "lightgray"
          }),
          minSize: new go.Size(50, 25)
        }),
        $$(go.TextBlock, setText(), {
          font: "bold 10pt Arial Black",
          margin: 3
        })
      )
    ));

  mySubDiagram.nodeTemplateMap.add(NodeCategories[5], // Object
    $$(go.Node, "Auto", setNode(), {
      isVisible: true,
      // contextMenu: objMenu
    },
      $$(go.Panel, "Auto", setPanel(), {
        padding: 3
      },
        $$(go.Shape, setShape(), {
          fromLinkable: true,
          fromLinkableDuplicates: false,
          fromLinkableSelfNode: false,
          toLinkable: true,
          toLinkableDuplicates: false,
          toLinkableSelfNode: false,
          fill: "white",
          minSize: new go.Size(50, 25),
          strokeWidth: 1
        }),
        $$(go.TextBlock, setText(), {
          font: "9pt Consolas",
          margin: 3
        })
      )
    ));
  mySubDiagram.nodeTemplateMap.add(NodeCategories[6],
    $$(go.Node, "Spot", setNode(),
      $$(go.Panel, "Auto", setPanel(),
        $$(go.Shape, "Diamond", setShape(), {
          fill: "white",
          fromLinkable: true,
          toLinkable: true,
          minSize: new go.Size(50, 25)
        }),
        $$(go.TextBlock, setText())
      )
    ));
  mySubDiagram.nodeTemplateMap.add(NodeCategories[7],
    $$(go.Node, "Spot", setNode(),
      $$(go.Panel, "Auto", setPanel(),
        $$(go.Shape, "Diamond", setShape(), {
          fill: "lightgray",
          fromLinkable: true,
          toLinkable: true,
          minSize: new go.Size(50, 25)
        }),
        $$(go.TextBlock, setText())
      )
    ));
  mySubDiagram.nodeTemplateMap.add(NodeCategories[8],
    $$(go.Node, "Spot", setNode(),
      $$(go.Panel, "Auto", setPanel(),
        $$(go.Shape, "RoundedRectangle", setShape(), {
          strokeWidth: 1,
          stroke: "black",
          fill: "black",
          fromLinkable: true,
          toLinkable: true,
          minSize: new go.Size(80, 10),
          maxSize: new go.Size(NaN, 10),
          // Fork feature
          toSpot: go.Spot.Top,
          fromSpot: go.Spot.BottomSide,
        }),
        $$(go.TextBlock, setText()))
    ));
  mySubDiagram.nodeTemplateMap.add(NodeCategories[9],
    $$(go.Node, "Spot", setNode(),
      $$(go.Panel, "Auto", setPanel(),
        $$(go.Shape, "RoundedRectangle", setShape(), {
          strokeWidth: 1,
          stroke: "black",
          fill: "black",
          fromLinkable: true,
          toLinkable: true,
          minSize: new go.Size(80, 10),
          maxSize: new go.Size(NaN, 10),
          // Join feature
          toSpot: go.Spot.TopSide,
          fromSpot: go.Spot.Bottom,
        }),
        $$(go.TextBlock, setText()))
    ));
  mySubDiagram.nodeTemplateMap.add(NodeCategories[10],
    $$(go.Node, "Auto", setNode(), {
      selectable: true,
      resizable: true,
      locationSpot: go.Spot.Center
    },
      $$(go.Panel, "Auto",
        $$(go.Shape, "Rectangle", {
          stroke: null,
          strokeWidth: 0,
          fill: null,
          minSize: new go.Size(50, 25),
          portId: "",
          fromLinkable: true,
          fromLinkableDuplicates: false,
          fromLinkableSelfNode: false,
          toLinkable: false,
          toLinkableDuplicates: false,
          toLinkableSelfNode: false
        },
          new go.Binding("desiredSize", "size").makeTwoWay()
        ),
        $$(go.TextBlock, setText(), {
          margin: new go.Margin(5, 3, 5, 3),
          font: "italic 12pt Consolas"
        })
      )
    ));
  mySubDiagram.nodeTemplateMap.add(NodeCategories[11],
    $$(go.Node, "Auto", setNode(),
      $$(go.Panel, "Auto", setPanel(),
        $$(go.Shape, "PrimitiveToCall", setShape(), {
          minSize: new go.Size(50, 25),
          fromLinkable: true,
          fromLinkableDuplicates: false,
          fromLinkableSelfNode: false,
          toLinkable: true,
          toLinkableDuplicates: false,
          toLinkableSelfNode: false,
        }),
        $$(go.TextBlock, setText(), {
          textAlign: "right"
        })
      )
    ));
  mySubDiagram.nodeTemplateMap.add(NodeCategories[12],
    $$(go.Node, "Auto", setNode(),
      $$(go.Panel, "Auto", setPanel(),
        $$(go.Shape, "PrimitiveFromCall", setShape(), {
          angle: 180,
          minSize: new go.Size(50, 25),
          fromLinkable: true,
          fromLinkableDuplicates: false,
          fromLinkableSelfNode: false,
          toLinkable: true,
          toLinkableDuplicates: false,
          toLinkableSelfNode: false,
        }),
        $$(go.TextBlock, setText(), {
          textAlign: "left"
        })
      )
    ));
  mySubDiagram.nodeTemplateMap.add(NodeCategories[13],
    $$(go.Node, "Auto", setNode(),
      $$(go.Panel, "Auto", setPanel(),
        $$(go.Shape, "Card", setShape(), {
          angle: 90,
          minSize: new go.Size(50, 25),
          fill: "beige",
          fromLinkable: true,
          toLinkable: false,
          strokeWidth: 0.5,
        }),
        $$(go.TextBlock, setText())
      )
    ));
  // 时间事件节点定义
  mySubDiagram.nodeTemplateMap.add(NodeCategories[14],
    $$(go.Node, "Vertical", setNode(),
      $$(go.Panel, "Auto", setPanel(),
        $$(go.Shape, "Collate", setShape(), {
          name: "SHAPE",
          minSize: new go.Size(25, 25),
          fill: '#FFF',
          fromLinkable: true,
          toLinkable: true,
          strokeWidth: 1,
        })
      ),
      $$(go.TextBlock, setText(), { margin: new go.Margin(5, 0, 2, 0) })
    ));

  mySubDiagram.nodeTemplateMap.add(NodeCategories[15],
    $$(go.Node, "Auto", setNode(),
      // define the node's outer shape
      {
        doubleClick: function (e, pnl) {
          e.diagram.commandHandler.editTextBlock(pnl.findObject("TYPE"));
        }
      },
      $$(go.Shape, "Rectangle", setShape(),
        {
          name: "SHAPE",
          fill: "lightgray",
          strokeWidth: 0.5,
          maxSize: new go.Size(300, 50),
          fromLinkable: true,
          fromLinkableSelfNode: false,
          fromLinkableDuplicates: false,
          toLinkable: true,
          toLinkableSelfNode: false,
          toLinkableDuplicates: false,
        }),
      // define the panel where the text will appear
      $$(go.Panel, "Vertical",
        {
          // maxSize: new go.Size(100, 200),
          defaultAlignment: go.Spot.Left
        },
        $$(go.TextBlock,
          {
            font: "Italic 12pt Segoe UI,sans-serif",
            editable: true,
            isMultiline: false,
            margin: new go.Margin(2, 10, 5, 0),
          },
          new go.Binding("text", "type", function (str) {
            return String("@" + str);
          }).makeTwoWay()),
        $$(go.TextBlock,
          {
            name: "TYPE",
            editable: true,
            isMultiline: false,
            wrap: go.TextBlock.WrapFit
          },
          new go.Binding("text", "text").makeTwoWay()),
      )
    ));

  mySubDiagram.nodeTemplateMap.add(NodeCategories[16],    // value specification
    $$(go.Node, "Auto", setNode(),
      // define the node's outer shape
      {
        doubleClick: function (e, pnl) {
          e.diagram.commandHandler.editTextBlock(pnl.findObject("TYPE"));
        }
      },
      $$(go.Shape, "File", setShape(),
        {
          name: "SHAPE",
          fill: "rgb(250,250,210)",
          strokeWidth: 0.5,
          maxSize: new go.Size(900, 900),
          fromLinkable: true,
          fromLinkableSelfNode: false,
          fromLinkableDuplicates: false,
          toLinkable: false,
          toLinkableSelfNode: false,
          toLinkableDuplicates: false,
        }),
      // define the panel where the text will appear
      $$(go.Panel, "Vertical",
        $$(go.TextBlock,
          {
            font: "Italic 12pt Segoe UI,sans-serif",
            editable: true,
            isMultiline: false,
            margin: new go.Margin(0, 0, 10, 0),
            textAlign: "center",
          },
          new go.Binding("text", "type").makeTwoWay()),
        $$(go.TextBlock,
          {
            name: "TYPE",
            editable: true,
            isMultiline: true,
            wrap: go.TextBlock.WrapFit,
            textAlign: "left",
          },
          new go.Binding("text", "text").makeTwoWay()),
      )
    ));

  // mySubDiagram.nodeTemplateMap.add("linkLabelNode", 
  //   $$("Node",
  //     {
  //       selectable: false, avoidable: false, resizable: false, movable: false,
  //       layerName: "Foreground"
  //     },  // always have link label nodes in front of Links
  //     $$("Shape", "Ellipse",
  //       {
  //         width: 3, height: 3, stroke: null,
  //         portId: "", fromLinkable: true, toLinkable: true, cursor: "pointer",
  //       })
  //   ));

  mySubDiagram.groupTemplateMap.add(GroupCategories[0], // Partition
    $$(go.Group, "Vertical", setGroup(), {
      selectionObjectName: "SHAPE", // selecting a lane causes the body of the lane to be highlit, not the label
      resizable: true,
      resizeObjectName: "SHAPE", // the custom resizeAdornmentTemplate only permits two kinds of resizing
      layout: $$(go.LayeredDigraphLayout, // automatically lay out the lane's subgraph
        {
          isInitial: false, // don't even do initial layout
          isOngoing: false, // don't invalidate layout when nodes or links are added or removed
          direction: 90,
          columnSpacing: 10,
          layeringOption: go.LayeredDigraphLayout.LayerLongestPathSource
        }),
      computesBoundsAfterDrag: true, // needed to prevent recomputing Group.placeholder bounds too soon
      computesBoundsIncludingLinks: false, // to reduce occurrences of links going briefly outside the lane
      computesBoundsIncludingLocation: true, // to support empty space at top-left corner of lane
      handlesDragDropForMembers: true, // don't need to define handlers on member Nodes and Links
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
      subGraphExpandedChanged: grp => {
        const shp = grp.resizeObject;
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
    },
      new go.Binding("isSubGraphExpanded", "expanded").makeTwoWay(),
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
        $$(go.Shape, "Rectangle", setShape(),{
          strokeWidth: 1,
          maxSize: new go.Size(5000, 5000),
        },
          new go.Binding("fill", "isHighlighted", function (h) {
            return h ? "rgba(119,136,153,0.1)" : "transparent";
          }).ofObject(),
        ),
        $$(go.TextBlock, {
          font: "bold 13pt sans-serif",
          editable: true,
          angle: 90,
          alignment: go.Spot.TopLeft,
          margin: new go.Margin(3),
        },
          new go.Binding("visible", "isSubGraphExpanded", function (e) {
            return !e;
          }).ofObject()
        )
      )
    )
  ); // end Group

  mySubDiagram.groupTemplateMap.add(GroupCategories[1], // Interruption
    $$(go.Group, "Vertical", {
      locationSpot: go.Spot.TopLeft,
      selectable: true,
      selectionObjectName: "SHAPE",
      resizable: true,
      resizeObjectName: "SHAPE",
      defaultStretch: go.GraphObject.Horizontal
    }, {
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
    }, {
      doubleClick: function (e, pnl) {
        e.diagram.commandHandler.editTextBlock(pnl.findObject("Title"));
      }
    }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      // header
      $$(go.Panel, "Auto",
        $$(go.Shape, "RoundedTopRectangle", {
          fill: "rgb(119,136,153)",
          stroke: null,
          parameter1: 20,
          maxSize: new go.Size(NaN, 30),
          minSize: new go.Size(300, 30)
        }),
        $$(go.TextBlock, setText(), {
          name: "Title",
          text: " Interruptible Activity Region",
          font: "bold 12pt sans-serif",
          alignment: go.Spot.Left,
          textAlign: "left"
        })
      ),
      // container
      $$(go.Panel, "Auto",
        $$(go.Shape, "RoundedBottomRectangle", {
          name: "SHAPE",
          fill: "whitesmoke",
          strokeWidth: 2,
          strokeDashArray: [10, 4],
          parameter1: 20,
          portId: "",
          fromLinkable: true,
          toLinkable: true,
          maxSize: new go.Size(5000, 5000),
          minSize: new go.Size(300, 200)
        },
          new go.Binding("fill", "isHighlighted", function (h) {
            return h ? "rgba(119,136,153,0.4)" : "whitesmoke";
          }).ofObject(),
          new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)
        )
      )
    ));
  mySubDiagram.groupTemplateMap.add(GroupCategories[2], // Activity
    $$(go.Group, "Vertical", {
      locationSpot: go.Spot.TopLeft,
      selectable: true,
      selectionObjectName: "SHAPE",
      resizable: true,
      resizeObjectName: "SHAPE"
    }, {
      toSpot: go.Spot.LeftSide,
      fromSpot: go.Spot.RightSide,
      defaultStretch: go.GraphObject.Horizontal
    }, {
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
    }, {
      doubleClick: function (e, pnl) {
        e.diagram.commandHandler.editTextBlock(pnl.findObject("Title"));
      }
    }, new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      // header
      $$(go.Panel, "Auto",
        $$(go.Shape, "RoundedTopRectangle", {
          fill: "rgb(119,136,153)",
          parameter1: 20,
          maxSize: new go.Size(NaN, 30),
          minSize: new go.Size(300, 30)
        }),
        $$(go.Panel, "Horizontal",
          $$(go.TextBlock, {
            text: "Act:",
            font: "bold 12pt sans-serif",
            alignment: go.Spot.Left,
            textAlign: "left",
            editable: false
          }),
          $$(go.TextBlock, setText(), {
            isPanelMain: true,
            name: "Title",
            alignment: go.Spot.Left,
            textAlign: "left"
          })
        )
      ),
      // container
      $$(go.Panel, "Auto",
        $$(go.Shape, "RoundedBottomRectangle", {
          name: "SHAPE",
          fill: "white",
          parameter1: 20,
          portId: "",
          fromLinkable: true,
          toLinkable: true,
          maxSize: new go.Size(5000, 5000),
          minSize: new go.Size(300, 200)
        },
          new go.Binding("fill", "isHighlighted", function (h) {
            return h ? "rgba(119,136,153,0.1)" : "transparent";
          }).ofObject(),
          new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify)
        )
      )
    ));

  //################ 画图区域Part样式 Start ################ by:ljq//
  // The background Part showing the sheet of paper;
  // it includes the fixed bounds of the diagram contents
  const pageSize = new go.Size(1000, 1000); // landscape, or new go.Size(width, height) for portrait
  const usableMargin = new go.Margin(16); // padding inside sheet border
  const pageBounds = new go.Rect(-usableMargin.left, -usableMargin.top, pageSize.width, pageSize.height);

  mySubDiagram.add(
    $$(go.Part, {
      mouseDrop: function (e) {
        finishDrop(e, null);
      }
    },
      {
        selectable: true,
        resizable: true,
        resizeObjectName: "PANEL",
        copyable: false,
        movable: false,
        layerName: "DrawingBoard",
        position: pageBounds.position,
        desiredSize: pageSize,
        isShadowed: true,
        background: "white",
        click: customClearSelections
      },
      $$(go.Shape, "LineH", {
        stroke: "lightgray",
        strokeWidth: 0.5
      }),
      $$(go.Shape, "LineV", {
        stroke: "lightgray",
        strokeWidth: 0.5
      })
    ));
  //################ 画图区域Part End ################//

  /*        Set the diagram's link templates  
  @Optimization:  Set 'default' linkTemplate(ControlFlow), and then change the link
            type by HTML elements. This also solves Link's text unsaving problem
  */
  mySubDiagram.linkTemplate = makeLinkTemplate([0, 0], "white", "Triangle");
  var linkTemplateArray = new Array(3);
  linkTemplateArray[0] = makeLinkTemplate([0, 0], "black", "Standard");
  linkTemplateArray[1] = makeLinkTemplate([0, 0], "black", "OpenTriangle");
  linkTemplateArray[2] = makeLinkTemplate([3, 2], null, "");
  addLinkTemplates(mySubDiagram, linkTemplateArray);

  /*  The model is restricted to go.GraphlinkModel here */
  mySubDiagram.model.linkKeyProperty = "id";
  // mySubDiagram.model.linkLabelKeyProperty = "lkLabel";

  /*  Set draggable li HTMLElements corresponding to the GoJS nodes */
  $('.navContent li').draggable({
    stack: "#activityDiagramDiv",
    revert: true,
    revertDuration: 0
  });
  //#html标签拖到gojs画板#//
  $("#activityDiagramDiv").droppable({
    // activeClass: "ui-state-highlight", //拖动时高亮显示
    // tolerance: 'touch', //拖动就会显示到界面，取消后需要拖到画板上才显示
    accept: '.draggableElement', //允许拖入的元素类型
    drop: function (event, ui) {
      var elt = ui.draggable.first();
      /*  HTML鼠标的位置XY  */
      var x = ui.offset.left - $(this).offset().left;
      var y = ui.offset.top - $(this).offset().top;
      /*  
      1. 节点与鼠标之间的偏移量: p适合节点
      2. P的坐标偏移量值 与 HTML img有关；
      */
      var p = new go.Point(x + 30, y + 30);
      var p2 = new go.Point(x + 90, y + 45);
      /*  线条的长度和位置  From:BR, To:TL  */
      var TL = mySubDiagram.transformViewToDoc(p);
      var BR = mySubDiagram.transformViewToDoc(p2);

      var model = mySubDiagram.model;
      var liCategory = elt[0].attributes["category"].value;
      let ndData = null;
      let lkData = null;
      let isLink = false;

      model.startTransaction("drop");

      switch (liCategory) {
        //node部分
        case NodeCategories[0]:
          ndData = generatePartData(false, 20, 20, TL, 0, liCategory, "");
          break;
        case NodeCategories[1]:
          ndData = generatePartData(false, 20, 20, TL, 0, liCategory, "");
          break;
        case NodeCategories[2]:
          ndData = generatePartData(false, 20, 20, TL, 0, liCategory, "");
          break;
        case NodeCategories[3]:
          ndData = generatePartData(false, 20, 20, TL, 0, liCategory, "");
          break;
        case NodeCategories[4]:
          ndData = generatePartData(false, 50,25, TL, 0, liCategory, "");
          break;
        case NodeCategories[5]:
          ndData = generatePartData(false, 50,25, TL, 0, liCategory, "");
          break;
        case NodeCategories[6]:
          ndData = generatePartData(false, 50,25, TL, 0, liCategory, "");
          break;
        case NodeCategories[7]:
          ndData = generatePartData(false, 50,25, TL, 0, liCategory, "");
          break;
        case NodeCategories[8]:
          ndData = generatePartData(false, 80,10, TL, 0, liCategory, "");
          break;
        case NodeCategories[9]:
          ndData = generatePartData(false, 80,10, TL, 0, liCategory, "");
          break;
        case NodeCategories[10]:
          ndData = generatePartData(false, 50, 25, TL, 0, liCategory, "text");
          break;
        case NodeCategories[11]:
          ndData = generatePartData(false, 50, 25, TL, 0, liCategory, "");
          break;
        case NodeCategories[12]:
          ndData = generatePartData(false, 50,25, TL, 0, liCategory, "");
          break;
        case NodeCategories[13]:
          ndData = generatePartData(false, 20, 20, TL, 0, liCategory, "");
          break;
        case NodeCategories[14]:
          ndData = generatePartData(false, 20, 20, TL, 0, liCategory, "TimeEvent");
          break;
        case NodeCategories[15]:
          ndData = generatePartData(false, 140, 40, TL, 0, liCategory, "", "Param | Return");
          break;
        case NodeCategories[16]:
          ndData = generatePartData(false, 170,60, TL, 0, liCategory, "", "<<selection>>");
          break;

        /** Group **/
        case GroupCategories[0]:
          ndData = generatePartData(true, 300,600, TL, 0, liCategory, "Partition_0");
          break;
        case GroupCategories[1]:
          ndData = generatePartData(true, 300,200, TL, 0, liCategory, "Interruption_0");
          break;
        case GroupCategories[2]:
          ndData = generatePartData(true, 300,200, TL, 0, liCategory, "");
          break;
        case GroupCategories[3]:
          ndData = generatePartData(true, 300,200, TL, 0, liCategory, "");
          break;

        /** Link **/
        default:
          isLink = true;
          lkData = generateLinkData(liCategory, "", BR, TL);
          break;
      }

      if (isLink){ 
        model.addLinkData(lkData);
      } else {
        if (ndData["isGroup"])  ndData = nodeDraggingToGroup(ndData, mySubDiagram);
        model.addNodeData(ndData);
      }

      model.commitTransaction("drop");
    }
  });

  activityOverview =
    $$(go.Overview, "myOverviewDiv", {
      observed: mySubDiagram,
      contentAlignment: go.Spot.Center
    });

  // Create a part to highlight the error node
  highlighter =
    $$(go.Part, "Auto", {
      layerName: "HighlighterBackground",
      selectable: false,
      isInDocumentBounds: false,
      locationSpot: go.Spot.Center,
      visible: false
    },
      $$(go.Shape, "Ellipse", {
        fill: $$(go.Brush, "Radial", {
          0.0: "yellow",
          1.0: "white"
        }),
        stroke: null,
        desiredSize: new go.Size(100, 100)
      })
    );
  mySubDiagram.add(highlighter);

  /*  actInspector of Activity Diagram   S   */
  activityInspector = new Inspector("activityInspectorDiv", mySubDiagram, {
    multipleSelection: true,
    //   showSize: 10,
    showAllProperties: true,
    includesOwnProperties: true,
    properties: {
      "text": {},
      "key": {
        readOnly: true,
        show: Inspector.showIfPresent
      },
      "Color": {
        show: Inspector.showIfPresent,
        type: 'color'
      },
      "Category": {
        show: Inspector.showIfPresent
      },
      "isGroup": {
        readOnly: true,
        show: Inspector.showIfPresent
      },
      "Members": {
        readOnly: true,
        type: "number",
        show: (nd) => {
          if (nd.isGroup) {
            return nd.memberParts.iterator.count;
          }
        }
      },
      "Comments": {
        show: Inspector.showIfNode
      },
      "Version": {
        show: Inspector.showIfNode,
        type: "time",
        show: (nd) => {
          /// WARN: version is Customized for nodes
          return nd.version;
        }
      },
      "Rules": {
        show: Inspector.showIfLink
      },
      "distance": {
        show: Inspector.showIfNode
      }
    }
  });
  /*  actInspector of Activity Diagram   E   */
  /*  
  @Override 
  @Note:  if you didn’t give diagram focus, you wouldn’t be able to drop a 
          node and then press Delete, or CTRL+C, or F2 to Edit its text etc.
  */
  mySubDiagram.doFocus = function () {
    var x = window.scrollX || window.pageXOffset;
    var y = window.scrollY || window.pageYOffset;
    go.Diagram.prototype.doFocus.call(this);
    window.scrollTo(x, y);
  }
}
/******************************Diagram Initial*************************************/

/*
 * @author ljq
 * 将Ifram父页面传过来的json数据加载到活动图画板中
 * */
function jsonDataToSubDiagram(jsonData) {
  $("#myActivitySavedModel").text(jsonData);
  activityLoad();
}
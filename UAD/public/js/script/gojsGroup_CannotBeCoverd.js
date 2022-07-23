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
            $$(go.Shape, "Rectangle", {
                    name: "SHAPE",
                    fill: defaultPure,
                    strokeWidth: 1,
                    maxSize: new go.Size(5000, 5000)
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
    )
); // end Group
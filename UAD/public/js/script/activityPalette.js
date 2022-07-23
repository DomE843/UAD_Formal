/*
palette 节点采用图片显示的方式； ----尺寸相同；
参考traceabilitysystem

*/

let activityPalette = undefined;

var paletteNodes = [{
    category: "InitialNode",
    size: "50 50"
  },
  {
    category: "ActivityFinalNode",
    size: "50 50"
  },
  {
    category: "FlowFinalNode",
    size: "50 50"
  },
  {
    category: "Connector",
    text: "x",
    size: "50 50"
  }, {
    category: "Text",
    text: "文本",
    size: "85 45"
  },
  {
    category: "Action",
    text: "Step",
    size: "70 35"
  },
  {
    category: "Object",
    text: "Object",
    size: "70 35"
  },
  {
    category: "DecisionNode",
    size: "80 45"
  },
  {
    category: "MergeNode",
    size: "80 45"
  },
  {
    category: "parallel",
    size: "80 10"
  },
  {
    category: "ReceiveCall",
    size: "70 35"
  },
  {
    category: "SendCall",
    size: "70 35"
  }, {
    category: "Behavior",
    text: "",
    size: "35 70"
  },
  {
    text: "New Lane",
    size: "300 730",
    isGroup: true,
    color: "white"
  }
];

var paletteLinks = [{
  category: "ControlFlow",
  points: new go.List().addAll([new go.Point(0, 0), new go.Point(80, 0)])
},
{
  category: "ObjectFlow",
  points: new go.List().addAll([new go.Point(0, 10), new go.Point(80, 10)])
}];

let paletteLink = $$(go.Link, {
    locationSpot: go.Spot.Center,
    selectionAdornmentTemplate: $$(go.Adornment, "Link", {
        locationSpot: go.Spot.Center
      },
      $$(go.Shape, {
        isPanelMain: true,
        fill: null,
        stroke: "deepskyblue",
        strokeWidth: 0
      }),
      $$(go.Shape, {
        toArrow: "standard",
        stroke: null
      })
    )
  }, {
    routing: go.Link.Normal,
    reshapable: true,
    corner: 5,
    toShortLength: 4
  },
  new go.Binding("points"),
  $$(go.Shape, {
    isPanelMain: true,
    strokeWidth: 2
  }),
  $$(go.Shape, {
    toArrow: "Standard",
    stroke: null
  })
);

// let linePre = "../../src/images/toolBarIcon/Lines/line";

// activityPalette.linkTemplateMap.add("_Control", 
// $$(go.Link, {
//   routing: go.Link.Normal,
// },
// $$(go.Panel, "Auto", 
// $$(go.Picture, {
//   source: "../../src/images/toolBarIcon/Lines/"
// })))
// );

function paletteInit() {
  activityPalette =
    $$(go.Palette, "myPaletteDiv", {
      scale: 0.9,
      layout: $$(go.GridLayout,{
        alignment: go.GridLayout.Position
      }),
      maxSelectionCount: 1,
      nodeTemplateMap: mySubDiagram.nodeTemplateMap,
      linkTemplateMap: mySubDiagram.linkTemplateMap,
      model: new go.GraphLinksModel(paletteNodes, paletteLinks)
      //the order keeps with GraphModel(GridLayout) accordingly;
    });
}
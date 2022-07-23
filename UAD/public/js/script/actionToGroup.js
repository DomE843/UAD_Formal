
/*
The diagram is to Save/Load/Print the sub diagram of UML AD;
*/

var subDiagram = undefined;

subDiagram = $$(go.Diagram, "subDiagramDiv", {
  allowDrop: false,

});


/*  How the locations in the Sub Diagram connect to the Group's member       */
/*---------------------------------------------------------------------------*/

/*
@Function:  The function calculates the OFFSET of Group's coordinate and 
            Diagram's coordinate
@Parameter: Group's TopLeft, Diagram's TopLeft;
@Return:    An <Integer> offset                                              */
function locationOffsetX(gpx, dmx) {
  // calculation is not confirmed.
}

/*
// Fit location
1. Get group's coordinate(TopLeft);
2. Calculate the diagram's Width and Height that is Perfect to contain nodes
   in json files;
3. re-size the group the Right width and height;
4. make all Location in json node add the Group's TopLeft.

// Group location
1. Group.addMembers();
2. Group.ungroupable = true; // false;

*/

subDiagram.groupTemplateMap.add("activity", 
$$(go.Group, "Auto", {
  fromSpot: go.Spot.AllSides,
  toSpot: go.Spot.AllSides,
  fromEndSegmentLength: 30, 
  toEndSegmentLength: 30
},{
  selectionAdornmentTemplate: grpSelectionAdornment
},
$$(go.Panel, "Auto", {

}, 
$$(go.Shape, "RoundedRectangle", {
  stroke: blackPure, 
  strokeWidth: 1.5,
  fill: "rgba(245, 245, 245, 0.2)",
}), 
$$(go.Placeholder, { padding: 10 })),
$$(go.TextBlock, "GroupTitle", {
  name: "ActivityTextBlock",
  font: "bold 11pt Arial Black",
  editable: true, 
  wrap: go.TextBlock.WrapFit
})
));

function loadSub(e){
  var grp = e.diagram.selection.iterator.first();
  if (grp instanceof go.Group){
    //subDiagram.model.fromJson(document.getElementById("mySavedModel").innerHTML);

  }
}

function fitDiagramIntoGroup(jsonData, gploc){
  var obj = JSON.parse(jsonData);
  
}

/********************************Activity Group setting***********************/
function groupProperty(nd, val) {

  let tmp = "false";
  if (val) {
    tmp = "true";
  }
  activityDiagram.model.setDataProperty(nd, "isGroup", tmp);
}

function setActivityName(fp){
  // get name from FileName
}

function isActivity(nd){
  
}
/********************************Activity Group setting***********************/

/****************************Sub Activity diagram start***********************/
var subDiv = document.createElement('div');
function createDiv(w, h){
  // sub diagram div 
  subDiv.setAttribute("width", w);
  subDiv.setAttribute("height", h);
  subDiv.setAttribute("display", "none");
  subDiv.setAttribute("id", "subDiagramDiv");
}

var widthArr = [], heightArr = [];
function getSizeArray(arr){
  for (var i = arr.length - 1; i >= 0; i--) {
    let str_size = arr[i].size;
    let idx = str_size.indexOf(" ");
    
    let tmpw = str_size.subStr(0, idx);
    let tmph = str_size.subStr(-1, idx);

    widthArr.push(+tmpw);
    heightArr.push(+tmph);
  }
}


// Sub Diagram inherits from main ActivityDiagram 
function createDiagram(jsonObj){
  var subDiagram =  $$(go.diagram, "subDiagramDiv", {

  });

  subDiagram.model = jsonObj;

  // save();
  // load();
  // print();
}

function createSubDiagram(obj){ 
  getSizeArray(obj.nodeDataArray);
  let max_width = Math.max(...widthArr);
  let max_height = Math.max(...heightArr);

  createDiv(max_width, max_height);
  createDiagram(obj);
}
/****************************Sub Activity diagram end*************************/

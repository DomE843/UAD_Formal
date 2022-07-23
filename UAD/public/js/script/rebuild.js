function UMLDiagram(cls, fPort, tPort, nodes, links){
  this.class = cls;
  this.linkFromPortIdProperty = fPort;

  // initFunc is never same!
}

UMLDiagram.prototype = {
  constructor: UMLDiagram,
  
  // Public function for all UMLDiagram instances;
  importJson: function(){

  },
  exportJson: function(){

  },
  saveJsonData: function(div){

  },
  activityLoad: function () {
  /*  JsonData text in html MUST be Json-Format string  */
  var srcJson = $("#myActivitySavedModel").text();

  if (srcJson != "") {
    // const nodesLinks = getNodesLinks("ClaDiagram");

    // let jsonObj = JSON.parse(srcJson);
    // jsonObj.nodeDataArray.push(nodesLinks.nodeDataArray);
    // jsonObj.linkDataArray.push(nodesLinks.linkDataArray);
    // srcJson = JSON.stringify(jsonObj);

    mySubDiagram.model = go.Model.fromJson(srcJson);

    //### 更新画板大小 Start ###by:ljq//
    let drawingBoard = mySubDiagram.model.modelData.DrawingBoard;
    if (drawingBoard != undefined) {
      let parts = mySubDiagram.parts;
      while (parts.next()) {
        let data = parts.value;
        if (data.layerName === "DrawingBoard") {
          data.width = drawingBoard.width;
          data.height = drawingBoard.height;
          break;
        }
      }
    }
    //### 更新画板大小 End ###by:ljq//
  } else {
    activityCaseStudy();
  }

  mySubDiagram.isModified = true;
},
  toggleMap: function(div){

  },
  toggleOverview: function(div){

  }
}

function subDiagram(nodes, links){
  
  this.subDiagram = {
    "modelData":{"DrawingBoard":{"width":1000, "height":1000}}, 
    "nodeDataArray": nodes,
    "linkDataArray": links
  };
  this.categorized = {};
}

subDiagram.prototype = {
  constructor: subDiagram,

  initDiagram: function (diagramDivId, savedDivId ) {
    gojsInit(); // No parameter as Default!
  },
  structureUnified: function () {
    for (let i = 0; i < this.subDiagram["nodeDataArray"].length; i++) {
      const node = this.subDiagram["nodeDataArray"][i];
      var category = String(node.category); // for sake of <String>

      var isExisted = false; 
      var nodeArr = undefined;

      // iterate existing in json;
      for (const cate in this.categorized) {
        if (this.categorized.hasOwnProperty.call(this.categorized, cate)) {
          nodeArr = this.categorized[cate];
          
          if (cate === category) {
            isExisted = true;
            break;
          }
        }
      }
      
      if (isExisted) {
        nodeArr.push(node);
      } else {
        // if not exists, add
        this.categorized[category] = [];
        this.categorized[category].push(node);
      }
    }
  },
  basicErrorChecking: function () {
    
  },
  consistencyErrorChecking: function (params) {
    
  }
}

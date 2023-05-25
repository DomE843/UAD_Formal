/* ToolBar functions S */

// /*  Set a link type which contains 4 factors:　stroke, strokWidth, fromArrow, toArrow */
// function setLink(ad, lineType) {
//   ad.selection.iterator.each(pt => {
//     ad.startTransaction("set part type");
//     if (pt instanceof go.Link) {
//       ad.model.setDataProperty(pt, "category", lineType);
//     } else if (pt instanceof go.Node) {
//       // ad.model.setDataProperty(pt, "category", lineType);
//     } else if (pt instanceof go.Group) {
//       ad.model.setDataProperty(pt, "category", lineType);
//     }
//     ad.commitTransaction("set part type");
//   });
// }

// /*
// @Function:  Both link-setting functions below are covered by Non-Parameter 
//             function in case of being invoked in HTML Element's attribute
// */
// function setControl() {
//   setLink(mySubDiagram, LinkCategories[0]);
// }

// function setObject() {
//   setLink(mySubDiagram, LinkCategories[1]);
// }

function showMapButton() {
  if ($("#myButton").css("display") === "none") {
    $("#myButton").css("display", "block");
  } else {
    $("#myButton").css("display", "none");
  }
}

//##打开文件 Start ##//
//前端读取本地文件的内容   下面代码中的this.result即为获取到的内容
function actImportJsonFile() {
  $("#importFile").click();
}
function actUploadJson(input) {  //支持chrome IE10
  if (window.FileReader) {
    let file = input.files[0];
    let reader = new FileReader();
    reader.onload = function() {
      $("#myActivitySavedModel").text(this.result);
      activityLoad();
    }
    reader.readAsText(file);
  }
  //支持IE 7 8 9 10
  else if (typeof window.ActiveXObject != 'undefined'){
    let xmlDoc;
    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    xmlDoc.async = false;
    xmlDoc.activityLoad(input.value);
    $("#myActivitySavedModel").text(xmlDoc.xml);
    activityLoad();
  }
  //支持FF
  else if (document.implementation && document.implementation.createDocument) {
    let xmlDoc;
    xmlDoc = document.implementation.createDocument("", "", null);
    xmlDoc.async = false;
    xmlDoc.activityLoad(input.value);
    $("#myActivitySavedModel").text(xmlDoc.xml);
    activityLoad();
  } else {
    alert('error');
  }
}
//##打开文件 End ##//

//Export
function actExportJsonFile() {
  let content = mySubDiagram.model.toJson();
  let blob = new Blob([content], {
    type: "text/json; charset=utf-8"
  });
  saveAs(blob, "mySubDiagram.json");
}

//画板内容截图
function actPrintscreen() {
  let svgWindow = window.open();
  if (!svgWindow) return; // failure to open a new Window
  let printSize = new go.Size(1080, 700);
  let bnds = mySubDiagram.documentBounds;
  let x = bnds.x;
  let y = bnds.y;

  let svg = mySubDiagram.makeSvg({
    scale: 1.0,
    position: new go.Point(x, y),
    size: printSize
  });
  svgWindow.document.body.appendChild(svg);
  x += printSize.width;

  setTimeout(function () {
    svgWindow.print();
  }, 1);
}


/*  Toolbar 2  S  */
//Undo
function actUndo() {
  mySubDiagram.commandHandler.undo();
}

//Redo
function actRedo() {
  mySubDiagram.commandHandler.redo();
}

//cut
function actCutElements() {
  if (mySubDiagram.commandHandler.canCutSelection) {
    mySubDiagram.commandHandler.cutSelection();
  }
}
//copy
function actCopyElements() {
  if (mySubDiagram.commandHandler.canCopySelection) {
    mySubDiagram.commandHandler.copySelection();
  }
}
//paste
function actPasteElements() {
  if (mySubDiagram.commandHandler.canPasteSelection) {
    mySubDiagram.commandHandler.pasteSelection();
  }
}
/*  Toolbar 2  E  */


//delete
function actDeleteElements() {
  if (mySubDiagram.commandHandler.canDeleteSelection) {
    mySubDiagram.commandHandler.deleteSelection();
  }
}
//lock
function actLockElements() {
  mySubDiagram.commandHandler.lockCurrentNode();
}
//unlock
function actUnlockElements() {
  mySubDiagram.commandHandler.unlockCurrentNode();
}
/* ToolBar functions E */
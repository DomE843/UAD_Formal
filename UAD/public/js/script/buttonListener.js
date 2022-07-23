var reader = new FileReader();


function load() {
  // activityDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
  const srcJson = "../../../public/src/json/test.json";
  $.getJSON(srcJson, function (result) {
    activityDiagram.model = go.Model.fromJson(result);
  });
}

function save() {
  document.getElementById("mySavedModel").value = activityDiagram.model.toJson();
  activityDiagram.isModified = false;
}

/*************************************Print Image Start **********************************/
function printImage() {
  var svg = activityDiagram.makeSvg({
    scale: 1,
    // background: "white"  //如果设置，则 背景色区域大小 小于 完整的图区域；
  });

  var divSvg = document.createElement("div");
  divSvg.setAttribute("id", "divSvg");
  divSvg.appendChild(svg);
  document.body.appendChild(divSvg);

  var svgTag = document.getElementById("divSvg").childNodes[0];

  // 打印PNG的核心函数, ./svgToPng.js
  pngDownload(svgTag, "ActivitySample");

  document.body.removeChild(divSvg);
}
/**********************************Print Image End**********************************/

/********************************** Dragging Properties ***********************************/
function darg(obj) {
  //鼠标按下 
  obj.onmousedown = function (ev) {
    e = e || window.event;
    var x = e.pageX || e.clientX + (document.body.scrollLeft || document.documentElement.scrollLeft);
    var y = e.pageY || e.clientY + (document.body.scrollTop || document.documentElement.scrollTop);

    var box_x = box.offsetLeft;
    var box_y = box.offsetTop;
    var mouse_in_box_x = x - box_x;
    var mouse_in_box_y = y - box_y;

    document.onmousemove = function (e) {
      e = e || window.event;
      x = e.pageX || e.clientX + (document.body.scrollLeft || document.documentElement.scrollLeft);
      y = e.pageY || e.clientY + (document.body.scrollTop || document.documentElement.scrollTop);

      var boxX = x - mouse_in_box_x;
      var boxY = y - mouse_in_box_y;
      box.style.left = boxX + 'px';
      box.style.top = boxY + 'px';
    }
  };

  obj.onmousedown = function () {
    document.onmousemove = null;
  }
}

/*
@Function: this function shows the Div of Properties of Node in Diagram;
@Parameter: (maybe) an <Event>e, or NULL;
*/
function clickOperation() {
  /* Conditionally launch the dragging operation  */
  var drg_a = document.getElementById("infoDraggable");
  var drg_b = document.getElementById('property');

  // click the diagram blank to recover all

  if (activityDiagram.selection.first() !== null
    // || e.diagram.selection.first().category !== "backgound"
  ) {
    drg_a.style.display = 'inline-block';
    darg(drg_a);
  } else {
    drg_a.style.display = 'none';
  }
}

/********************************** Dragging Properties ***********************************/
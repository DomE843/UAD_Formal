var reader = new FileReader();


function load() {
  activityDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
}

//❌not well tested!!!
function readerOfFile() {
  // file reading started
  reader.addEventListener('loadstart', function () {
    document.querySelector("#file-input-label").style.display = 'none';
  });

  // file reading finished successfully
  reader.addEventListener('load', function (e) {
    var text = e.target.result;
    document.querySelector("#contents").innerHTML = text;
    document.querySelector("#contents").style.display = 'block';
    document.querySelector("#file-input-label").style.display = 'block';
  });

  // file reading failed
  reader.addEventListener('error', function () {
    alert('Error : Failed to read file');
  });

  // file read progress 
  reader.addEventListener('progress', function (e) {
    if (e.lengthComputable == true) {
      document.querySelector("#file-progress-percent").innerHTML = Math.floor((e.loaded / e.total) * 100);
      document.querySelector("#file-progress-percent").style.display = 'block';
    }
  });

  return reader;
}

function loadLocal(files) {
  /* get 1st file */
  var all_files = files; // how to get all files ???
  if (all_files.length == 0) {
    alert('Error : No file selected');
    return;
  }
  var fp = all_files[0];

  /* set maxSize of a file */
  var maxFileSize = 20 * 1024 * 1024;
  if (fp.size > maxFileSize) {
    alert("The File is too large");
    return;
  }

  /* get Reader of file */
  let fReader = readerOfFile(); //parameters ??
  fReader.readAsText(fp);
}

function save() {
  document.getElementById("mySavedModel").value = activityDiagram.model.toJson();
  activityDiagram.isModified = false;
}

/*************************************Print Image **********************************/
function imgCallback(blob) {
  var url = window.URL.createObjectURL(blob);
  var dt = new Date();
  var filename = dt.toLocaleDateString();

  var a = document.createElement("a");
  a.style = "display: none";
  a.href = url;
  a.download = filename;

  // IE 11
  if (window.navigator.msSaveBlob !== undefined) {
    window.navigatoar.msSaveBlob(blob, filename);
    return;
  }

  document.body.appendChild(a);
  requestAnimationFrame(function () {
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  });
}

function exportImage() {
  activityDiagram.startTransaction("Export Image");
  var blob = activityDiagram.makeImageData({
    background: "white",
    returnType: "blob",
    callback: imgCallback
  });
  activityDiagram.commitTransaction("Export Image");
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

function checkAction(nd) {
  var linksIn = nd.findLinksOutOf();
  if (linksIn.size > 1) {
    linksIn.each(function (lk) {
      lk.isHighlighted = true;
    });
  }
}

/********************************** Dragging Properties ***********************************/
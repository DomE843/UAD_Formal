/* ToDO:
  1. one node may have many errors;
  2. click the error description, the node will be highlighted & recover. L: 33
  3. make a 'Examing' function, if it starts, RE-Check the diagram;
*/

function showLog(id, jsonObj) {
  var tr = document.createElement('tr');

  var errIcon = document.createElement('td');
  var errID = document.createElement('td');
  errID.setAttribute('class', 'id');
  var errDescription = document.createElement('td');
  errDescription.setAttribute("align", "left");
  var img = document.createElement('img');
  img.setAttribute('class', 'LogIcon');

  img.src = '../../public/src/images/log/warning.jfif';
  errIcon.appendChild(img);
  
  errID.innerHTML = id;
  
  /*  id从1开始计数， 数组从0开始计数，因此下方语句（id-1） */
  var ele = (jsonObj.rules[id-1]);
  //-----------------------------------------------------
  errDescription.innerHTML = '<a href="javascript:;">' + ele["description"] + '</a>';
  var oA = errDescription.children[0];
  // oA.onclick = function () {
  //   var nd = activityDiagram.findNodeForKey();
  //   activityDiagram.setProperty("node", "highlight", "true");
  //   // if a Click happens in the diagram, set 'highlight' to FALSE;
  // };
  //-----------------------------------------------------

  tr.appendChild(errIcon);
  tr.appendChild(errID);
  tr.appendChild(errDescription);
  
  let tbl = document.getElementById('errorLogTbl');
  tbl.appendChild(tr);
};

function show(idArr) {
  $.getJSON("../../public/src/json/errorRules.json", function (data) {
    for (let index = 0; index < idArr.length; index++) {
        showLog(idArr[index], data);
    }
  });  
}

function addErrorObject(code, key) {
  
}
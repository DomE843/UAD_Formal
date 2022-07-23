/// WARN: 数组去0后，进行计算，保证 {总数= basic + consistency}
/*
@Function:    Show errors in @Param:Array
@Parameter:   Each single element of Array is LT 0;
*/
function showErrorDetail(array){
  $("#ADErrorDetails li").remove();
  
  $.getJSON("../../public/configures/errorRules.json", function (data) {
    var count = 0;
    for (let i = 0; i < array.length; i++) {
      activityAddErrorItem(++count, array[i], data);
    }
  });
}

function activityAddErrorItem(order, errObj, jsonObj) {
  var tr = document.createElement('li');

  var errIcon = document.createElement('img');
  var errID = document.createElement('span');
  var errDescription = document.createElement('span');
  
  errIcon.src = '../../public/images/Icon_debug/warn_yellow_triangle.png';

  errID.innerHTML = ' ' + String(order) + '. ';

  /*  id从1开始计数， 数组从0开始计数，因此下方语句（id-1） */
  var ele = (jsonObj.rules[errObj.rule-1]);
  errDescription.innerHTML = getErrorDescr(errObj.node, ele["description"]);

  tr.appendChild(errIcon);
  tr.appendChild(errID);
  tr.appendChild(errDescription);

  $('#ADErrorDetails').append(tr);
};

/*
@Function:  Highlight node in the diagram by given Key value
*/
function highlightErrorPart(key) {
  let node = mySubDiagram.findNodeForKey(key);
  mySubDiagram.highlight(node);
  highlighter.location = node.location;
  highlighter.visible = true;
  mySubDiagram.scale = 1.6;
  mySubDiagram.commandHandler.scrollToPart(node);
}

function getErrorDescr(nodeId, text) {
  return ('<a href="javascript:void(0)" onclick="highlightErrorPart('+nodeId+')">' + text + '</a>');
}

/*
@Function:  Create an <Object> with NodeId and RuleId, this object connects node with 
            linked error description;
*/
function errorPairObj(nodeId, ruleId) {
  return {node: nodeId, rule: ruleId};
}
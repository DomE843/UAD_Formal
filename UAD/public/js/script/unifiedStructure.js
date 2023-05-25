/*************************** Convert to Unified Structure - S ****************/
// Unified Structure declaration;
var usStruct = {
  // global elements & relations
  "ME":undefined,
  "RE":undefined,

  // constraints
  "CME":undefined,
  "CRE":undefined,

  // nodes
  "Nodes":{},
  "Links":{}
};


/*
@Function:    This is outter shell with Non-Parameter
@NOTE:        Changes are needed if this function is invoked in other diagrams;
*/
function subDiagramSaveUS() {
  valueForUS(usStruct);
   
  const textDivId = "myActivitySavedModel";     // This may change
  var convertedStr = JSON.stringify(usStruct);

  document.getElementById(textDivId).value = convertedStr;
}

/*
@Function:    The US structure will be valued here.
*/
function valueForUS(usStruct) {
  const modelJsonStr = mySubDiagram.model.toJson();

  // global
  usStruct.ME = getObjValueByCategory(modelJsonStr, "nodeDataArray");
  usStruct.RE = getObjValueByCategory(modelJsonStr, "linkDataArray");

  // constraints, @TODO

  // Node categories;
  createObjByArray(usStruct.Nodes, usStruct.ME);
  createObjByArray(usStruct.Links, usStruct.RE);
}

/*
@Function:    Parse partial string of JSONStr to a JSON object;
*/
function getObjValueByCategory(jsonStr, key) {
  var obj = null;
  var paramType = Object.prototype.toString.call(jsonStr);

  if (paramType === "[object String]") {
    obj = JSON.parse(jsonStr);
  } else if (paramType === "[object Object]") {
    obj = jsonStr;
  } else {
    alert("Undefined type of Object.");
    return;
  }
  
  return obj[key];
}

/*
@Function:    An JSON Object with type will created by Node as element of NodeDataArray;
*/
function createObjByArray(obj, array) {
  for (let i = 0; i < array.length; i++) {
    const el = array[i];
    var nCate = el.category;

    // if Node type doesn't exist, then create one 
    if (!Object.hasOwnProperty.call(obj, nCate)) {
      obj[nCate] = new go.List();
    }

    // if Node type existed already, append its elements;
    obj[nCate].push(el);
  }
}
/*************************** Convert to Unified Structure - E ****************/
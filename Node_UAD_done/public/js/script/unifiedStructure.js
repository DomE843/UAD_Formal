let st = {
  "class": "go.GraphLinksModel",
  "linkDataArray": [{
      "category": "ObjectFlow",
      "from": -6,
      "to": -7
    },
    {
      "category": "ObjectFlow",
      "from": -7,
      "to": -2
    },
    {
      "category": "ControlFlow",
      "from": -9,
      "to": -4
    }
  ]
};

var flowArray_control = [];
var flowArray_object = [];

var conn = "{\"from\": \"0\", \"to\": \"0\"}";
var connSet = [];

function connObject(obj, from, to) {
  obj.from = String(from);
  obj.to = String(to);
  return obj;
}

function getConnection(json) {
  let linksArray = json.linkDataArray;
  for (let lk in linksArray) {
    const lkObj = linksArray[lk];
    
    var biRelation = {
      "from": "0",
      "to": "0"
    };
    biRelation = connObject(biRelation, lkObj.from, lkObj.to);

    if (lkObj.category == "ControlFlow") {
      flowArray_control.push(biRelation);
    } else {
      flowArray_object.push(biRelation);
    }
  }
}

getConnection(st);
console.log(flowArray_object);
console.log(flowArray_control);

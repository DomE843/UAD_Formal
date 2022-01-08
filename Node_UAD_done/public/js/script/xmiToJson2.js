const xml2js = require('xml2js');
const fs = require('fs');
const fstr = fs.readFileSync("../../src/json/xmiToJson.json");
const XMIJson = JSON.parse(fstr);
const XMIPath = "../../src/xmi/a.xmi";

var XMIDiagrams;

parseXMIFile(XMIPath);
addNodesToArray(XMIDiagrams.node, XMIJson.nodeDataArray);
addLinksToArray(XMIDiagrams.edge, XMIJson.linkDataArray);
writeJson(XMIJson);

function parseXMIFile(path) {
  var XMIdata = fs.readFileSync(path);
  const xmlParser = new xml2js.Parser({
    explicitArray: false,
    ignoreAttrs: false
  });

  xmlParser.parseString(XMIdata, function (err, result) {
    XMIDiagrams = result["xmi:XMI"]["uml:Model"].packagedElement[1];
  });
}

function addLinksToArray(object, linksObj) {
  for (var i in object) {
    if (Object.hasOwnProperty.call(object, i)) {
      const tmpTag = object[i]["$"];
      // 每次重新定义对象才能正确添加，否则数组之前的所有元素都将被覆盖
      var tmpLink = {
        "category": "",
        "points": [],
        "from": 0,
        "to": 0
      };
      tmpLink.category = tmpTag["xmi:type"];
      tmpLink.from = tmpTag.source;
      tmpLink.to = tmpTag.target;

      if (tmpTag.name) {
        tmpLink["name"] = tmpTag.name;
      }

      linksObj.push(tmpLink);
    }
  }
}

function addNodesToArray(object, nodesObj) {
  for (var i in object) {
    if (Object.hasOwnProperty.call(object, i)) {
      const tmpTag = object[i]["$"];
      // 每次重新定义对象才能正确添加，否则数组之前的所有元素都将被覆盖
      var tmpNode = {
        "category": "",
        "key": "0",
        "size": "",
        "loc": "",
        "visibility": "",
        "text": ""
      };

      tmpNode.category = tmpTag["xmi:type"];
      tmpNode.key = tmpTag["xmi:id"];
      tmpNode.visibility = tmpTag.visibility;
      tmpNode.text = tmpTag.name;
      // loc, size

      nodesObj.push(tmpNode);
    }
  }
}

function writeJson(obj) {
  var w = fs.writeFileSync("../../src/output/b.json", JSON.stringify(obj));
}
/* XMI */


let xmlVer = "2.1";
let xmlUML = "http://schema.omg.org/spec/UML/";
let xmlXMI = "http://schema.omg.org/spec/XMI/";
var destFilePath = "../../output/xmi/a.xmi";
var srcFilePath = "../../src/json/test.json"; // matches XMI of uad by EA

/*---------------------------------------------------------------------------*/
var basicAttr = [" xmi:type=", " xmi:id=", " visibility=", " name=",
  " source=", " target=", " xmi:idref=", " scope="
];
var xmlElementsArray = [];

/**************************Start writing xml*******************************/
let idx_attr = 0,
  idx_tag = 0;
var tmpId = "";

let fileInfo = xmlFileInfo("1.0");
xmlElementsArray.push(fileInfo);
//xmi:XMI 
let xmiLabel = createCoupleTag("xmi:XMI");
idx_attr = indexOfInsert(xmiLabel, '>');
let xmiInfoStr = xmiInfo(xmlVer, xmlUML + xmlVer, xmlXMI + xmlVer);
xmiLabel = insertIntoTag(xmiLabel, xmiInfoStr, idx_attr);
xmlElementsArray.push(xmiLabel);

/*  <Model attrs>*/
let umlLabel = createCoupleTag("uml:Model");
idx_attr = indexOfInsert(umlLabel, '>');
umlLabel = insertIntoTag(umlLabel, basicAttr[0] + "\"uml:Model\"", idx_attr);
umlLabel = insertIntoTag(umlLabel, basicAttr[3] + "\"MyModel\"", idx_attr);
umlLabel = insertIntoTag(umlLabel, basicAttr[2] + "\"public\"", idx_attr);
xmlElementsArray.push(umlLabel);

/*  packagedElement for UAD projects */
let pkgProject = createCoupleTag("packagedElement");
idx_attr = indexOfInsert(pkgProject, ">");
tmpId = "\"" + randStrWithLength(randStr(), 10) + "\"";
pkgProject = insertIntoTag(pkgProject, basicAttr[0] + "\"uml:Package\"", idx_attr);
pkgProject = insertIntoTag(pkgProject, basicAttr[1] + tmpId, idx_attr);
pkgProject = insertIntoTag(pkgProject, basicAttr[2] + "\"public\"", idx_attr);
pkgProject = insertIntoTag(pkgProject, basicAttr[3] + "\"My Activity Diagram XMI\"", idx_attr);
xmlElementsArray.push(pkgProject);

/*  packagedElement for Activity diagram */
let pkgActivity = createCoupleTag("packagedElement");
idx_attr = indexOfInsert(pkgActivity, ">");
tmpId = "\"" + randStrWithLength(randStr(), 10) + "\"";
pkgActivity = insertIntoTag(pkgActivity, basicAttr[0] + "\"uml:Activity\"", idx_attr);
pkgActivity = insertIntoTag(pkgActivity, basicAttr[1] + tmpId, idx_attr);
pkgActivity = insertIntoTag(pkgActivity, basicAttr[2] + "\"public\"", idx_attr);
pkgActivity = insertIntoTag(pkgActivity, basicAttr[3] + "\"Activity_01\"", idx_attr);
xmlElementsArray.push(pkgActivity);

/****************************End writing xml*******************************/
function setTagWithValue(tag, values) {
}

/*
@Function:    XML string is converted from JSON data exported by GoJS
@Parameters:  
  sourceFile
  callback
@Return:      returns XML String                                             */
$.getJSON(srcFilePath, function (jsData) {
  var tmpArr = [];
  let headStr, tmpStr, jsonStr;

  tmpStr = nodesElement(jsData["nodeDataArray"]);
  tmpArr.push(tmpStr);

  tmpStr = linksElement(jsData["linkDataArray"]);
  tmpArr.push(tmpStr);

  jsonStr = tmpArr.join("");
  xmlElementsArray.push(jsonStr);

  jsonStr = integrateElements(xmlElementsArray);
  tmpStr = xmlElementsArray[0] + jsonStr;

  console.log(tmpStr);
  // var fp = new File(xmlElementsArray, destFilePath, {
  //   type: 'text/plain'
  // });
});
/*---------------------------------------------------------------------------*/

function integrateElements(array) {
  let idx = 0;
  let res = array[array.length - 1];
  for (let i = array.length - 1; i >= 2; i--) {
    idx = indexOfInsert(array[i - 1], "<");
    res = insertIntoTag(array[i - 1], res, idx);
  }
  return res;
}

/*
@Function:    XMI file information of publication
@Parameters:  
  version:  the file version, times of publishing
@Return:      returns XML String                                             */
function xmlFileInfo(version) {
  return ("<?xml version=\"" + version + "\" encoding=\"UTF-8\"?>");
}

/*
@Function:    XML file head tage information
@Parameters:
  xmiVer: XMI version
  umlStd: UML version
  xmiStd: Standard XMI file reference
@Return:      returns XML String                                             */
function xmiInfo(xmiVer, umlStd, xmiStd) {
  let str = " xmi:version=\"" + xmiVer +
    "\" xmlns:uml=\"" + umlStd + "\"" +
    " xmlns:xmi=\"" + xmiStd + "\"";

  return str;
}

/*
@Function:  create a PAIR of label
@Parameters:  
  nm: label name
@Return:      returns XML label String                                      */
function createCoupleTag(nm) {
  return ("<" + nm + "></" + nm + ">");
}

/*
@Function:  create a SINGLE label tag
@Parameters:  
  nm: label name
@Return:      returns XML label String                                      */
function createSingleTag(nm) {
  return ("<" + nm + "/>");
}

/*
@Function:  get index of inserting in tag
@Parameters:  
  od: old string
  mk: a Mark character of inserting location in string
@Return:      returns Integer                                               */
function indexOfInsert(od, mk) {
  for (var i = (od.length - 2); i >= 0; i--) {
    if (od[i] == mk) {
      break;
    }
  }
  return (i);
}


//字符串调整为len位
function randStr() {
  return Math.random().toString(36).substr(2)
};

function randStrWithLength(str, len) {
  if (str.length > len) return str.substr(0, len);
  if (str.length < len) return randStrWithLength(str + randStr(), len);
  return str;
}

/*
@Function:  insert NEW string into OLD string at location 'idx'
*/
function insertIntoTag(od, nw, idx) {
  od = od.slice(0, idx) + nw + od.slice(idx);
  return od;
}

/*
@Function:    This is about creating element of <nodeDataArray>
@Parameters:  an Object of nodeDataArray
@Return:      returns XML String                                             */
function nodesElement(nodesArr) {
  let ele = "";
  for (let i in nodesArr) {
    if (nodesArr[i].isGroup) {
      ele += groupElement(nodesArr[i].text, nodesArr[i].key);
    } else {
      ele += nodeElement(nodesArr[i].text, nodesArr[i].category, nodesArr[i].key);
    }
  }
  return ele;
}

function groupElement(nm, id) {
  let ele = createSingleTag("group");
  let idx_attr = indexOfInsert(ele, "/");

  let idStr = "\"" + String(id) + "\"";

  ele = insertIntoTag(ele, basicAttr[0] + "\"uml:ActivityPartition\"", idx_attr);
  ele = insertIntoTag(ele, basicAttr[1] + idStr, idx_attr);
  ele = insertIntoTag(ele, basicAttr[2] + "\"public\"", idx_attr);
  ele = insertIntoTag(ele, basicAttr[3] + "\"" + nm + "\"", idx_attr);

  return ele;
}

function nodeElement(nm, tp, id) {
  let ele = createCoupleTag("node");
  let idx_attr = indexOfInsert(ele, ">");

  let xtp = basicAttr[0] + "\"uml:" + tp + "\"";
  let idStr = "\"" + String(id) + "\"";

  ele = insertIntoTag(ele, xtp, idx_attr);
  ele = insertIntoTag(ele, basicAttr[1] + idStr, idx_attr);
  ele = insertIntoTag(ele, basicAttr[2] + "\"public\"", idx_attr);
  ele = insertIntoTag(ele, basicAttr[3] + "\"" + nm + "\"", idx_attr);

  return ele;
}

function linksElement(linkArr) {
  let ele = "";

  for (let i in linkArr) {
    var lk = linkArr[i];
    ele += linkElement(lk.category, lk.from, lk.to);
  }

  return ele;
}

function linkElement(tp, src, tar) {
  let lk = createCoupleTag("edge");
  let idx_attr = indexOfInsert(lk, ">");

  let idStr = "\"" + randStrWithLength(randStr(), 10) + "\"";
  let xtp = basicAttr[0] + "\"uml:" + tp + "\"";
  let srcStr = basicAttr[4] + "\"" + src + "\"";
  let tarStr = basicAttr[5] + "\"" + tar + "\"";

  lk = insertIntoTag(lk, xtp, idx_attr);
  lk = insertIntoTag(lk, basicAttr[1] + idStr, idx_attr);
  lk = insertIntoTag(lk, basicAttr[2] + "\"public\"", idx_attr);
  lk = insertIntoTag(lk, srcStr, idx_attr);
  lk = insertIntoTag(lk, tarStr, idx_attr);

  return lk;
}

function isArray(obj) {
  return Object.prototype.toString.call(obj) === "[object Array]";
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}
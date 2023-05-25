function isFuncNameEqual(src, tar) {
  var name1 = String(src.match(/[a-zA-Z_]{1}[a-zA-Z_0-9]+[ ]*\(/g)).replace("(", "");
  var name2 = String(tar.match(/[a-zA-Z_]{1}[a-zA-Z_0-9]+[ ]*\(/g)).replace("(", "");
  return name1 === name2;
}

function findInCustomProp(obj, prop, key) {
  for (const i in obj) {
    if (Object.hasOwnProperty.call(obj, i)) {
      const ei = obj[i];
     
      if (isFuncNameEqual(ei[prop],key)) return ei;
    }
  } 

  return null;
}



OCLValidationMapping.append(3, _inter_seqcla_msgOperation);


function _inter_actcla_specifyOperation(srcKey, tarKey, oclID) {
  const actNode = myUmlDiagarm.findNodeForKey(srcKey);
  const claGroup = myUmlDiagarm.findNodeForKey(tarKey);
  const actName = actNode.text;

  let objs = new Array();

  actNode.findLinksOutOf().each(olk => {
    if (olk.category === "dependency" && olk.text === "trace") {    // Specifying relation
      let toNode = olk.toNode;

      // Activity diagram name matches operations 
      if (toNode.isMemberOf(claGroup) && findInCustomProp(toNode.data.methods, "name", actName)) { 
        objs.push({
          from: toNode.key,
          to: tarKey,
        });
      }
    }
  });

  return (objs.length > 0);
}

// Condition: trace between act and class && _inter_seqcla_msgOperation
function _inter_actseq_specifyMessage(srcKey, tarKey, oclID) {
  const seqNode = myUmlDiagarm.findNodeForKey(tarKey);
  const actName = myUmlDiagarm.findNodeForKey(srcKey).text;

  let seqLinks = seqNode.data.umlDiagramData["linkDataArray"];
  for (let i = seqLinks.length - 1; i >= 0; i--) {
    const lk = seqLinks[i];
    
    if (isFuncNameEqual(lk.text, actName))  return true;
  }

  return false;
}


/*********************************** Use Case Diagram *********************************/


/*********************************** Diagram *********************************/
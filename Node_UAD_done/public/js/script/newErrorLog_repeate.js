(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw a.code = "MODULE_NOT_FOUND", a
        }
        var p = n[i] = {
          exports: {}
        };
        e[i][0].call(p.exports, function (r) {
          var n = e[i][1][r];
          return o(n || r)
        }, p, p.exports, r, e, n, t)
      }
      return n[i].exports
    }
    for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
    return o
  }
  return r
})()({
  1: [function (require, module, exports) {

  }, {}],
  2: [function (require, module, exports) {

    const fs = require('fs');
    var errIdArray = [];

    function showLog(id, jsonObj) {
      var tr = document.createElement('tr');

      var errIcon = document.createElement('td');
      var errID = document.createElement('td');
      errID.setAttribute('class', 'id');
      var errDescription = document.createElement('td');
      errDescription.setAttribute("align", "left");
      var img = document.createElement('img');
      img.setAttribute('class', 'LogIcon');

      img.src = '../../src/images/log/warning.jfif';
      errIcon.appendChild(img);

      errID.innerHTML = id;

      /*  id从1开始计数， 数组从0开始计数，因此下方语句（id-1） */
      var ele = (jsonObj.rules[id - 1]);
      //-----------------------------------------------------
      errDescription.innerHTML = '<a href="javascript:;">' + ele["description"] + '</a>';
      var oA = errDescription.children[0];
      oA.onclick = function () {
        var nd = activityDiagram.findNodeForKey();
        activityDiagram.setProperty("node", "highlight", "true");
        // if a Click happens in the diagram, set 'highlight' to FALSE;

      };
      //-----------------------------------------------------

      tr.appendChild(errIcon);
      tr.appendChild(errID);
      tr.appendChild(errDescription);

      let tbl = document.getElementById('errorLogTbl');
      tbl.appendChild(tr);
    };

    function show(idArr) {
      $.getJSON("./src/json/errorRules.json", function (data) {
        for (let index = 0; index < idArr.length; index++) {
          showLog(idArr[index], data);
        }
      });
    }

    function addErrorObject(code, key) {
      var tmp = fs.readFileSync('../../src/json/errorObj.json');
      let obj = JSON.parse(tmp);

      obj.Code = code;
      obj.Key = key;
      console.log("Object error: " + obj);
      errIdArray.push(obj);
    }

  }, {
    "fs": 1
  }]
}, {}, [2]);
},{"fs":2}],2:[function(require,module,exports){

},{}]},{},[1]);

/*
@Note: this .js file has only 'LF' (End of line sequence)

@Instruction： 
1. 把 svg 转成 .svg格式的base64
2. 创建一个 图片容器 存放 1. 中内容
3. 创建一个 canvas容器 存放 2.
4. 把 3. 转成 .png格式的base64
*/

var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" [<!ENTITY nbsp " ">]>';

function convertToPng(src, w, h) {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  canvas.width = w;
  canvas.height = h;
  context.drawImage(src, 0, 0);
  var png;
  try {
    png = canvas.toDataURL("image/png");
  } catch (e) {
    if ((typeof SecurityError !== 'undefined' && e instanceof SecurityError) || e.name == "SecurityError") {
      console.error("Rendered SVG images cannot be downloaded in this browser.");
      return;
    } else {
      throw e;
    }
  }
  return png;
}

function isElement(obj) {
  return obj instanceof HTMLElement || obj instanceof SVGElement;
}

function reEncode(data) {
  data = encodeURIComponent(data);
  data = data.replace(/%([0-9A-F]{2})/g, function (match, p1) {
    var c = String.fromCharCode('0x' + p1);
    return c === '%' ? '%25' : c;
  });
  return decodeURIComponent(data);
}

function uriToBlob(uri) {
  var byteString = window.atob(uri.split(',')[1]);
  var mimeString = uri.split(',')[0].split(':')[1].split(';')[0]
  var buffer = new ArrayBuffer(byteString.length);
  var intArray = new Uint8Array(buffer);
  for (var i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i);
  }
  return new Blob([buffer], {
    type: mimeString
  });
}

/*
@Function: download the .png file converted into URI from .svg, and Name the .png file;
@Param: el as the <svg> label in the document;
@Param: name as the PNG File name (without .png suffix)
*/
function pngDownload(el, name) {
  if (!isElement(el)) {
    throw new Error('an HTMLElement or SVGElement is required; got ' + el);
  }
  if (!name) {
    console.error("文件名为空!");
    return;
  }
  var xmlns = "http://www.w3.org/2000/xmlns/";
  var clone = el.cloneNode(true);
  clone.setAttribute("version", "1.1");

  // set Namespace of SVG xml below;
  if (!clone.getAttribute('xmlns')) {
    clone.setAttributeNS(xmlns, "xmlns", "http://www.w3.org/2000/svg");
  }
  if (!clone.getAttribute('xmlns:xlink')) {
    clone.setAttributeNS(xmlns, "xmlns:xlink", "http://www.w3.org/1999/xlink");
  }

  var svg = clone.outerHTML;
  // SVG converts to PNG by 'Base64' Format
  var uri = 'data:image/svg+xml;base64,' + window.btoa(reEncode(doctype + svg));
  var image = new Image();
  image.onload = function () {
    var png = convertToPng(image, el["width"]["baseVal"].value, el["height"]["baseVal"].value);
    var saveLink = document.createElement('a');
    var downloadSupported = 'download' in saveLink;
    if (downloadSupported) {
      saveLink.download = name + ".png";
      saveLink.style.display = 'none';
      document.body.appendChild(saveLink);
      try {
        var blob = uriToBlob(png);
        var url = URL.createObjectURL(blob);
        saveLink.href = url;
        saveLink.onclick = function () {
          requestAnimationFrame(function () {
            URL.revokeObjectURL(url);
          })
        };
      } catch (e) {
        saveLink.href = uri;
      }
      saveLink.click();
      document.body.removeChild(saveLink);
    }
  };
  image.src = uri;
}
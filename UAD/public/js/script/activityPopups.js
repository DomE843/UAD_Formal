/*修改alert样式-Start*/
function custAlert(e) {
  $("body").append("<div id='alertMsg'><span>" + e + "</span></div>");
  clearmsg();
}

function clearmsg() {
  var t = setTimeout(function () {
    $("#alertMsg").remove();
  }, 2000)
};
/*修改alert样式-End*/

/*
  @Function:  To pop up a DIV by parameter
  @Parameter: a valid string of HTML element's ID
*/
function popDiv(divstr) {
  $(divstr).css("display", "block");
}

/*
  @Function:  To close up a DIV by parameter
  @Parameter: a valid string of HTML element's ID
*/
function closeDiv(divstr) {
  $(divstr).css("display", "none");
}


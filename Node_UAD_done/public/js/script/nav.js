/*左右导航栏Start*/
function navExhibit(Obj){
  //左侧菜单栏收展
  $(function(){
      $(".subNav").click(function() {
          $(this).toggleClass("currentDd").siblings(".subNav").removeClass("currentDd");
          $(this).toggleClass("currentDt").siblings(".subNav").removeClass("currentDt");
          
          // 修改数字控制速度， slideUp(500)控制卷起速度
          $(this).next(".navContent").slideToggle(400).siblings(".navContent").slideUp(500);
      });
  });
  
  //左侧菜单栏隐藏
  $('#FunctionDiv .delete').click(function() {
    $("#FunctionDiv").css("display", "none");
  });
  //左侧菜单栏显示
  $('#recoverButton').click(function() {
    $("#FunctionDiv").css("display", "block");
  });
  
  
  //右侧菜单栏隐藏
  $("#rightMenuCloseButton").click(function() {
    $(".rightMenu").css("display", "none");
    $("#btn_map").css("right", "8.5px");
    $(".myOverviewDiv").css("right", "8.5px");
  });
}
/*左右侧导航栏End*/

/*右侧导航栏Start*/
function ExChgClsName(Obj){
  let label = $('#' + Obj);
  if(label.hasClass("MenuBoxOpen")) {
    label.removeClass("MenuBoxOpen");
    label.addClass("MenuBoxClose");
  } else {
    label.removeClass("MenuBoxClose");
    label.addClass("MenuBoxOpen");
  }
}
function showMenu(iNo){
  ExChgClsName("Menu_"+iNo);
}
 /*右侧导航栏End*/
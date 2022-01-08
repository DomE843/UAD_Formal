//服务端文件管理器

//读文件
function readServerFile(e) {
  let fileName = e.innerText;
  $.ajax({
    type: "POST",
    url: `http://${hostName}:3000/readServerFile`,
    crossDomain: true,
    dataType: "json", //返回的数据
    contentType: "application/json",
    data: JSON.stringify({
      "fileName": fileName
    }),
    success: function(data) {
      $("#mySavedModel").html(data);
      load();
    },
    error: function(err) {
      alert("File opening failed Please try again!");
    }
  });
}

function readServerFileManager(relativePath) {
  $.ajax({
    type: "POST",
    url: `http://${hostName}:3000/readServerDirectory`,
    crossDomain: true,
    dataType: "json",
    contentType: "application/json",
    data: "",
    success: function(files) {
      let content;
      
      for (let num in files) {
        content += `
          <tr>
            <td data-value="apple/"><a class="icon dir" onclick='readServerFile(this)'">${files[num]}</a></td>
          </tr>
        `;
      }
      $("#readServerFileTbody").html('');
      $("#readServerFileTbody").html(content);
      
      $("#readServerFileDraggable").css("display", "block");
      setTimeout(function(){
        $("#readServerFileDraggable").addClass("infoDraggable-click-transiton");
      }, 300);   
      $("#readServerFileDraggable").draggable({ handle: "#readServerFileDraggableHandle" });
    },
    error: function(err) {
      alert("Failed to read!");
    }
  });
}

//写文件
function writeServerFileManager() {
  
}
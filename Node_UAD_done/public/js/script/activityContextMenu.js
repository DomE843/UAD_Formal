/***************************************Context Menu InitialNode************************************/

var contextMenuElement = document.getElementById("contextMenu").addEventListener("contextmenu", function (e) {
  e.preventDefault();
  return false;
}, false);

function hideCX() {
  if (myDiagram.currentTool instanceof go.ContextMenuTool) {
    myDiagram.currentTool.doCancel();
  }
}

function showContextMenu(obj, diagram, tool) {
  // Show only the relevant buttons given the current state.
  var cmd = diagram.commandHandler;
  var hasMenuItem = false;

  function maybeShowItem(elt, pred) {
    if (pred) {
      elt.style.display = "block";
      hasMenuItem = true;
    } else {
      elt.style.display = "none";
    }
  }
  /*
  here to customize the options of ContextMenu;
  */
  maybeShowItem(document.getElementById("cut"), cmd.canCutSelection());
  maybeShowItem(document.getElementById("copy"), cmd.canCopySelection());
  maybeShowItem(document.getElementById("paste"), cmd.canPasteSelection(diagram.toolManager.contextMenuTool.mouseDownPoint));
  maybeShowItem(document.getElementById("delete"), cmd.canDeleteSelection());
  
  /* Action node ONLY*/
  maybeShowItem(document.getElementById("isActivity"), obj !== null);

  /* Object node ONLY*/
  maybeShowItem(document.getElementById("isParameterNode"), obj !== null);  // input, or output


  // Now show the whole context menu element
  if (hasMenuItem) {
    contextMenuElement.classList.add("show-menu");
    // we don't bother overriding positionContextMenu, we just do it here:
    var mousePt = diagram.lastInput.viewPoint;
    contextMenuElement.style.left = mousePt.x + 5 + "px";
    contextMenuElement.style.top = mousePt.y + "px";
  }

  // Optional: Use a `window` click listener with event capture to
  //           remove the context menu if the user clicks elsewhere on the page
  window.addEventListener("click", hideCX, true);
}

function hideContextMenu() {
  contextMenuElement.classList.remove("show-menu");
  // Optional: Use a `window` click listener with event capture to
  //           remove the context menu if the user clicks elsewhere on the page
  window.removeEventListener("click", hideCX, true);
}

// This is the general menu command handler, parameterized by the name of the command.
/*
<li id="color" class="menu-item">Color
      <ul class="menu">
        <li class="menu-item" style="background-color: #f38181;" onclick="cxcommand(event, 'color')">Red</li>
*/
function cxcommand(event, val) {
  if (val === undefined) val = event.currentTarget.id;
  var diagram = myDiagram;
  switch (val) {
    case "cut":
      diagram.commandHandler.cutSelection();
      break;
    case "copy":
      diagram.commandHandler.copySelection();
      break;
    case "paste":
      diagram.commandHandler.pasteSelection(diagram.toolManager.contextMenuTool.mouseDownPoint);
      break;
    case "delete":
      diagram.commandHandler.deleteSelection();
      break;
      /*------------------------------------------------*/
    case "isActivity": 
      isActivity();
      break;
  }
  diagram.currentTool.stopTool();
}

// A custom command, for changing the color of the selected node(s).
function changeColor(diagram, color) {
  // Always make changes in a transaction, except when initializing the diagram.
  diagram.startTransaction("change color");
  diagram.selection.each(function (node) {
    if (node instanceof go.Node) { // ignore any selected Links and simple Parts
      // Examine and modify the data, not the Node directly.
      var data = node.data;
      // Call setDataProperty to support undo/redo as well as
      // automatically evaluating any relevant bindings.
      diagram.model.setDataProperty(data, "color", color);
    }
  });
  diagram.commitTransaction("change color");
}

function contextMenuInit() {
  activityContextMenu = $$(go.HTMLInfo, {
    show: showContextMenu,
    hide: hideContextMenu
  });

  activityDiagram.contextMenu = activityContextMenu;
}
/***************************************Context Menu end************************************/
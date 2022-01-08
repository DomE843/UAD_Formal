/*
Copyright @Michael

Statement: this file provides all declarations that will be defined with GoJS library;
*/
var $$ = go.GraphObject.make;

/* Main view by GoJS    */
let activityDiagram = undefined;
let myDiagram = undefined;
let activityOverview = undefined;
let activityContextMenu = undefined;

/* Fill color of all nodes in the diagram */
var blackPure = "black";
var defaultPure = "white";
var yellowLinear = "beige";
var blackLinear = $$(go.Brush, "Linear", {
    0: "lightgray",
    0.5: defaultPure,
    1: "lightgray"
});

var strkWdth = 1;



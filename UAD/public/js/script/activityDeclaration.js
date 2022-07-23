/*
Copyright @Michael

Statement: this file provides all declarations that will be defined with GoJS library;
*/
const $$ = go.GraphObject.make;
//  Note nodes below is connected to Html elements' category
const NodeCategories = [
    'InitialNode', 'ActivityFinalNode', 'FlowFinalNode', 'Connector',
    'Action', 'Object', 'DecisionNode', 'MergeNode', 'ForkNode', 'JoinNode','TextNode',
    'SendCall', 'ReceiveCall', 'Comment'
];
const GroupCategories = ['Partition', 'Interruption', 'Activity'];
const LinkCategories = ['ControlFlow', 'ObjectFlow', 'CommentFlow'];
/* Main view by GoJS    */
var highlighter = undefined;
var mySubDiagram = undefined;
var activityOverview = undefined;
var activityContextMenu = undefined;
var activityInspector = undefined;

/*  HTML elements that is used frequently  */
const div_ActivityDiagram = "activityDiagramDiv";
const divId_activityDiagram = '#' + div_ActivityDiagram;


/* Fill color of all nodes in the diagram */
var blackPure = "black";
var defaultPure = "white";
var yellowLinear = "beige";

var strkWdth = 1;
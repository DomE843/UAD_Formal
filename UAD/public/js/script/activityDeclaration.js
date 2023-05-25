/*
Copyright @Michael

Statement: this file provides all declarations that will be defined with GoJS library;
*/
const $$ = go.GraphObject.make;
//  Note nodes below is connected to Html elements' category
const NodeCategories = [
    'InitialNode', 'ActivityFinalNode', 'FlowFinalNode', 'Connector',   // 0-3
    'Action', 'Object', 'DecisionNode', 'MergeNode', 'ForkNode', 'JoinNode','TextNode', // 4-10
    'SendCall', 'ReceiveCall', 'Comment', 'TimeEvent', 'ActivityParameterNode', // 11-15
    'ValueSpecification' // 16
];
const GroupCategories = ['Partition', 'Interruption', 'Activity'];
const LinkCategories = ['ControlFlow', 'ObjectFlow', 'CommentFlow'];
/* Main view by GoJS    */
var highlighter = undefined;
var mySubDiagram = undefined;
let mySubDiagUS = undefined;
var activityOverview = undefined;
var activityContextMenu = undefined;
var activityInspector = undefined;

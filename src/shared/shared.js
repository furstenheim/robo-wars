/* Shared variables and global js variables (better here than global so they can be minified */
var socket
// global variable
var g = {}
function clone (object){return JSON.parse(JSON.stringify(object))}
// Half PI
var P = Math.PI / 2
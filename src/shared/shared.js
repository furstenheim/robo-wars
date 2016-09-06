/* Shared variables and global js variables (better here than global so they can be minified */
// TODO move this to client so there are no conflicts
var socket
// global variable
var g = {}
var movements = ['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown']
function clone (object){return JSON.parse(JSON.stringify(object))}
// Half PI
var P = Math.PI / 2
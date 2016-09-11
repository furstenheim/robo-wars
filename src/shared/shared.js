/* Shared variables and global js variables (better here than global so they can be minified */
// global variable
var g = {}
var MOVEMENTS = ['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown']
function clone (object){return JSON.parse(JSON.stringify(object))}
// Half PI
var P = Math.PI / 2

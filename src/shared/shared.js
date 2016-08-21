/* Shared variables and global js variables (better here than global so they can be minified */
var GUESS_NO = 0;
var GUESS_ROCK = 1;
var GUESS_PAPER = 2;
var GUESS_SCISSORS = 3;

// global variable
var g = {}
function clone (object){return JSON.parse(JSON.stringify(object))}
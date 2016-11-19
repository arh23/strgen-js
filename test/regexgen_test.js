"use strict";

//import createString from "";

function script() {
	var generate = require('regexgen_v2.js');
	return generate.createString("[a-z]{10}", false);
}

function output() {
	console.log('this is it:');
	console.log(script())
}
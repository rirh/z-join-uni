'use strict';

plus.push.addEventListener("click", function(e) {
	console.group();
	console.log("=============click broad===========");
	console.log(e);
	console.log("=============click broad end===========");
	console.groupEnd();
}, true);


plus.push.addEventListener("receive", function(e) {
	console.group();
	console.log("=============click broad===========");
	console.log(e);
	console.log("=============click broad end===========");
	console.groupEnd();
}, true);

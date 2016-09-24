"use strict";

function show(id){
	var element = document.getElementById(id);

	if(element.style.display === "none"){
		element.style.display = "block";
		element.backgroundPosition = "top";
	} else {
		element.style.display = "none";
	}
}

"use strict";
var Dialog 		= new Dialog(),
	Responsive 	= new Responsive(),
	SideMenu 	= new SideMenu(),
	Ripple 		= new Ripple();

function init() {
	var sm = document.getElementById("navigation-sidemenu");
	var smitems = sm.querySelectorAll(".menu > li:not(.divider) > a");

	function clickHandler() {
		return function() {
			if (Responsive.device != "desktop") {
				SideMenu.hide(sm);
			}
			for (var ind = 0; ind < smitems.length; ind++) {
				smitems[ind].parentNode.className = "";
			}
			this.parentNode.className = "selected color-blue-500";
			document.querySelector(".main-content").scrollTop = 0;
		};
	}

	for (var i = 0, len = smitems.length; i < len; i++) {
		smitems[i].addEventListener("click", clickHandler());
	}
}

window.addEventListener("DOMContentLoaded", function() {
	Dialog.init();
	Responsive.init();
	SideMenu.init();
	Ripple.init();
	if ((window.location.hash === "") || (document.querySelector(".navigation-section" + window.location.hash) === null)) {
		window.location.hash = "#introduction";
	}
	document.querySelector("#navigation-sidemenu a[href='" + window.location.hash + "']").parentNode.className = "selected color-blue-500";
	init();
});

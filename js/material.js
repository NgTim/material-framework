"use strict";
/* Util */
var console = (window.console = window.console || {});

function Material(params) {
	this.initialised = false;
	var modules = params && params.hasOwnProperty("modules") ? params.modules : null;
	this.init(modules);
}
Material.prototype.init = function(modules) {
	if (this.initialised) return;
	if (!modules) {
		Dialog.init();
		Responsive.init();
		SideMenu.init();
		Ripple.init();
		FancyHeader.init();
	}
	else {
		for (var i = 0, len = modules.length; i < len; i++) {
			var module = modules[i];
			if (!window.hasOwnProperty(module) || !window[module].hasOwnProperty("init") || !window[module].isMaterialModule) {
				console.warn("[material.init] Module not found");
				return;
			}
			window[module].init();
		}
	}
	this.initialised = true;
};

/* Responsive code */
var Responsive = {
	initialised: false,
	isMaterialModule: true,
	constructor: Responsive,
	init: function() {
		if (this.initialised) return;
		this.onResize();
		window.addEventListener("resize", this.onResize.bind(this));
		this.initialised = true;
	},
	onResize: function() {
		var width     = window.innerWidth,
		    oldDevice = this.device;
		if (width > 1000) {
			this.device = "desktop";
		}
		else if (width > 450) {
			this.device = "tablet";
		}
		else {
			this.device = "phone";
		}
		document.body.classList.remove(oldDevice);
		document.body.classList.add(this.device);
	},
	addResizeHandler: function(handler) {
		window.addEventListener("resize", handler);
	},
	removeResizeHandler: function(handler) {
		window.removeEventListener("resize", handler);
	}
};

/* Theme code */
var Theme = {
	isMaterialModule: true,
	toggle: function(element) {
		var el = element || document.body;
		if (el.classList.contains("dark-theme")) {
			el.classList.remove("dark-theme");
		}
		else {
			el.classList.add("dark-theme");
		}
	},
	setTheme: function(theme, element) {
		var el = element || document.body;
		switch (theme) {
			case "light":
				el.classList.remove("dark-theme");
				break;
			case "dark":
				el.classList.add("dark-theme");
				break;
			default:
				console.log("[Theme.setTheme] Unknown theme : " + theme);
				break;
		}
	}
};

/* SideMenu code */
var SideMenu = {
	initialised: false,
	isMaterialModule: true,
	constructor: SideMenu,
	init: function(params) {
		if (this.initialised) return;
		this.createOverlay();
		if (params && params.overlay) {
			this.setOverlay(params.overlay);
		}
		this.overlay.addEventListener("click", function() {
			var sidemenus = document.querySelectorAll(".sidemenu");
			for (var i = 0, len = sidemenus.length; i < len; i++) {
				var sidemenu = sidemenus[i];
				if (!sidemenu.hidden && (!sidemenu.classList.contains("sidebar") || (typeof Responsive == "undefined" || Responsive.device !== "desktop"))) {
					this.hide(sidemenu);
				}
			}
		}.bind(this));
		if (typeof Responsive != "undefined") {
			Responsive.addResizeHandler(this.onResize.bind(this));
		}
		this.onResize();
		this.initialised = true;
	},
	createOverlay: function() {
		if (document.querySelector(".sidemenu-overlay")) {
			this.overlay = document.querySelectorAll(".sidemenu-overlay")[0];
			return;
		}
		var overlay = document.createElement("div");
		overlay.className = "overlay sidemenu-overlay";
		overlay.hidden = true;
		overlay.setAttribute("id", "mf_overlay_" + Math.floor(Math.random() * 100000));
		document.body.appendChild(overlay);
		this.overlay = overlay;
	},
	toggle: function(sm) {
		if (!sm.classList.contains("sidebar") || (typeof Responsive == "undefined" || Responsive.device !== "desktop")) {
			this.overlay.hidden = !sm.hidden;
		}
		sm.hidden = !sm.hidden;
	},
	show: function(sm) {
		if (!sm.classList.contains("sidebar") || (typeof Responsive == "undefined" || Responsive.device !== "desktop")) {
			this.overlay.hidden = false;
		}
		sm.hidden = false;
	},
	hide: function(sm) {
		this.overlay.hidden = true;
		sm.hidden = true;
	},
	onResize: function() {
		var sidebars = document.querySelectorAll(".sidebar");
		for (var i = 0, len = sidebars.length; i < len; i++) {
			if (Responsive.device == "desktop") {
				this.show(sidebars[i]);
			}
			else {
				this.hide(sidebars[i]);
			}
		}
	}
};

/* Dialog code */
var Dialog = {
	initialised: false,
	isMaterialModule: true,
	constructor: Dialog,
	init: function() {
		if (this.initialised) return;
		this.createOverlay();
		var buttons = document.querySelectorAll(".dialog-confirm, .dialog-close");
		for (var i = 0, len = buttons.length; i < len; i++) {
			buttons[i].addEventListener("click", this.hideCurrentDialog.bind(this));
		}
		this.initialised = true;
	},
	createOverlay: function() {
		if (document.querySelector(".dialog-overlay")) {
			this.overlay = document.querySelectorAll(".dialog-overlay")[0];
			return;
		}
		var overlay = document.createElement("div");
		overlay.className = "overlay dialog-overlay";
		overlay.hidden = true;
		overlay.setAttribute("id", "mf_overlay_" + Math.floor(Math.random() * 100000));
		document.body.appendChild(overlay);
		this.overlay = overlay;
	},
	show: function(dialog) {
		this.overlay.hidden = false;
		dialog.hidden = false;
	},
	hide: function(dialog) {
		this.overlay.hidden = true;
		dialog.hidden = true;
	},
	toggle: function(dialog) {
		this.overlay.hidden = !dialog.hidden;
		dialog.hidden = !dialog.hidden;
	},
	getCurrentDialog: function() {
		return document.querySelector(".dialog:not([hidden])");
	},
	hideCurrentDialog: function() {
		this.hide(this.getCurrentDialog());
	}
};

/* Ripple code */
var Ripple = {
	isMaterialModule: true,
	initialised: false,
	constructor : Ripple,
	init: function() {
		if(this.initialised) return;
		// var rippleitems = document.querySelectorAll(".button:not(.no-ripple):not([ripple='none']), .fab:not(.no-ripple):not([ripple='none']), [ripple]:not([ripple='none']), .ripple");
		// for (var i = 0; i < rippleitems.length; i++) {
		// 	rippleitems[i].addEventListener("mousedown", this.onClick, false);
		// 	rippleitems[i].addEventListener("touchstart", this.onClick, false);
		// }
		// Hack to enable :active state on iOS
		document.addEventListener("touchstart", function() {}, false);
		this.initialised = true;
	},
	onClick: function(event) {
		/* FIXME : This needs fixing */
		var x     = event.pageX - this.offsetLeft - (this.clientWidth / 2),
		    y     = event.pageY - this.offsetTop - (this.clientHeight / 2),
		    style = document.createElement("style"),
		    id    = "data-mf-ripple_" + Math.floor(Math.random() * 1000000),
		    value = Math.floor(Math.random() * 1000000);
		this.setAttribute(id, value);
		style.innerHTML = "[" + id + "='" + value + "']::after {\n"+
		                  "left: " + x + "px;\n"+
		                  "top: " + y + "px;}";
		document.body.appendChild(style);
		setTimeout(function() {
			style.remove();
			this.removeAttribute(id);
		}.bind(this), 2000);
	}
};

/* FanzyHeader Experimental*/
var FancyHeader = {
	element: document.querySelector(".toolbar"),
	scroller: document.querySelector(".main-content"),
	state: "show",
	initialised: false,
	isMaterialModule: true,
	constructor: FancyHeader,
	init: function(){
		if(this.initialised) return;
		this.lastY = this.scroller.scrollY;
		this.scroller.addEventListener("scroll", this.update.bind(this), false);
		this.element.style.position = "fixed";
		this.element.style.width = "100%";
		//Fix for Paddings
		var sections = document.querySelectorAll(".navigation-section");
		for (var i = 0, len = sections.length; i < len; i++) {
			var height = Math.max(this.element.scrollHeight, this.element.offsetHeight, this.element.clientHeight);
			sections[i].style.paddingTop = height + "px";
		}
		this.initialised = true;
	},
	hide: function(){
		if(this.state == "show" || this.state === null){
			this.element.classList.toggle("hide");
			this.state = "hide";
		}
	},
	show: function(){
		if(this.state == "hide" || this.state === null){
			this.element.classList.toggle("hide");
			this.state = "show";
		}
	},
	getY: function(cb){
		cb((this.scroller.pageYOffset !== undefined) ? this.scroller.pageYOffset
		: (this.scroller.scrollTop !== undefined) ? this.scroller.scrollTop
		: (document.documentElement || document.body.parentNode || document.body).scrollTop);
	},
	update: function(){
		var self = this;
		this.getY(function(y){
			var direction = y > self.lastY ? "down" : "up";
			if(direction == "down"){
				self.hide();
			}else if(direction == "up"){
				self.show();
			}
			self.lastY = y;
		});
	}
};

sap.ui.define([
	"sap/m/MenuButton",
    "sap/ui/core/Control"
], function(
	MenuButton,
    Control
) {
	"use strict";

	return MenuButton.extend("com.resulto.hcfi.controls.CustomMenuButton", {
        meetadata: {
            properties: {},
            events: {
                "mouseover":{}
            }
        },

        onAfterRendering: function () {
            MenuButton.prototype.onAfterRendering.apply(this, arguments);
            var $this = this.$();
            $this.on("mouseover", this.onMouseOver.bind(this));
        },
        
        onMouseOver: function(event) {
            var button = this.fireEvent("mouseover");
            var menu = button.getMenu();
            if (!menu.getVisible()) { // Si el menú no está abierto
                menu.openBy(button);
            }
        },

        renderer: {}
	});
});
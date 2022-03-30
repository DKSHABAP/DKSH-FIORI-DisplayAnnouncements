sap.ui.define(function() {
	"use strict";

	var Formatter = {

		status :  function (sStatus) {
				if (sStatus === "new") {
					return "newlyAddedItem";
				} else {
					return "None";
				}
		}
	};

	return Formatter;

},  /* bExport= */ true);

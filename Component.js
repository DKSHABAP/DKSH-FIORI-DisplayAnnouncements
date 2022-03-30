sap.ui.define([
	"sap/ui/core/Component",
	"sap/m/Button",
	"sap/m/Bar",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"com/dksh/announcments/model/Formatter"
], function (Component, Button, Bar, MessageToast, Fragment, Formatter) {
	var oModel1;
	return Component.extend("com.dksh.announcments.Component", {

		metadata: {
			"manifest": "json"
		},
		init: function () {
			var rendererPromise = this._getRenderer();

			// This is example code. Please replace with your implementation!
			/**
			 * Add item to the header
			 */
			rendererPromise.then(function (oRenderer) {
				oRenderer.addHeaderEndItem({
					icon: "sap-icon://bell",
					tooltip: "Click Here for Announcments",
					press: this.onOpenPopover.bind(this)
				}, true).addStyleClass("sapCustomBtn");
			}.bind(this));

		},
		onOpenPopover: function (oEvent) {
			var oButton = oEvent.getSource();
			if (!this._pPopover) {
				this._pPopover = Fragment.load({
					// id: oView.getId(),
					name: "com.dksh.announcments.fragment.Popover",
					controller: this
				}).then(function (oPopover) {
					// oView.addDependent(oPopover);
					return oPopover;
				});
			}

			this._pPopover.then(function (oPopover) {
				this.reloadData(oPopover);
				oPopover.openBy(oButton);
			}.bind(this));

		},
		handleAnnouncmentFilter: function (oEvent) {
			var selectedKey = oEvent.getSource().getSelectedKey();
			var announcments = oModel1.getProperty("/aitems");
			var resultProductData = [];
			if (selectedKey === "date") {

				resultProductData = announcments.filter(function (user) {
					var date = new Date(user.ExpDate).toLocaleDateString();
					return (date === new Date().toLocaleDateString());
				});
			} else {
				resultProductData = announcments.filter(function (user) {
					return ("1" === user.Priority);
				});
			}
			oModel1.setProperty("/aitems", resultProductData);
		},
		onReload: function () {
			this._pPopover.then(function (oPopover) {
				this.reloadData(oPopover);
			}.bind(this));
		},
		reloadData: function (oPopover) {
			oModel1 = new sap.ui.model.json.JSONModel();
			if (oPopover) {
				oPopover.setModel(oModel1);
			}

			/* Assign the model to the view */
			/* Load the data */
			// oModel.loadData("sap/fiori/connectclientreturncreate/services/userapi/currentUser");
			// oModel1.loadData("/XSJSAPI/TestXSJS/test.xsjs");
			// oModel1.loadData("/XSJSAPI/ANNOUNCEMENTS_ASSOCIATIONS/services.xsodata/announcement_assosciations");
			// oModel1.attachRequestCompleted(function onCompleted(oEventData) {
			// 	if (oEventData.getParameter("success")) {
			// 		var announcments = oEventData.getSource().getData().d.results;
			// 		oModel1.setProperty("/aitems", announcments);
			// 		var resultProductData = announcments.filter(function (user) {
			// 			var date = new Date(user.ExpDate).toLocaleDateString();
			// 			return (date === new Date().toLocaleDateString());
			// 		});
			// 		oModel1.setProperty("/countDate", announcments.length);
			// 		var resultProductData1 = announcments.filter(function (user) {
			// 			return ("1" === user.Announce_priority);
			// 		});
			// 		oModel1.setProperty("/countPriorty", announcments.length);
			// 		// this.getLoggedInUserName(oEvent.getSource().getData().name);
			// 	}
			// }.bind(this));

			jQuery.ajax({
				type: "GET",
				contentType: "application/json",
				url: "/XSJSAPI/ANNOUNCEMENTS_ASSOCIATIONS/services.xsodata/announcement_assosciations",
				dataType: "json",
				crossDomain: true,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("Authorization", "Basic " + btoa("XYASHASVIS" + ":" + "Yashasvi@1234567891"));
				},
				async: false,
				success: function (data, textStatus, jqXHR) {
					// oModel.setData(data);
					alert("success to post");
				},
				error: function (response) {
					alert("Error to post");
				}
			});

		},
		/**
		 * Returns the shell renderer instance in a reliable way,
		 * i.e. independent from the initialization time of the plug-in.
		 * This means that the current renderer is returned immediately, if it
		 * is already created (plug-in is loaded after renderer creation) or it
		 * listens to the &quot;rendererCreated&quot; event (plug-in is loaded
		 * before the renderer is created).
		 *
		 *  @returns {object}
		 *      a jQuery promise, resolved with the renderer instance, or
		 *      rejected with an error message.
		 */
		_getRenderer: function () {
			var that = this,
				oDeferred = new jQuery.Deferred(),
				oRenderer;

			that._oShellContainer = jQuery.sap.getObject("sap.ushell.Container");
			if (!that._oShellContainer) {
				oDeferred.reject(
					"Illegal state: shell container not available; this component must be executed in a unified shell runtime context.");
			} else {
				oRenderer = that._oShellContainer.getRenderer();
				if (oRenderer) {
					oDeferred.resolve(oRenderer);
				} else {
					// renderer not initialized yet, listen to rendererCreated event
					that._onRendererCreated = function (oEvent) {
						oRenderer = oEvent.getParameter("renderer");
						if (oRenderer) {
							oDeferred.resolve(oRenderer);
						} else {
							oDeferred.reject("Illegal state: shell renderer not available after recieving 'rendererLoaded' event.");
						}
					};
					that._oShellContainer.attachRendererCreatedEvent(that._onRendererCreated);
				}
			}
			return oDeferred.promise();
		}
	});
});
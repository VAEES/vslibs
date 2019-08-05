sap.ui.define([], function () {
	"use strict";

	return {
		defaultTheme: "sap_belize",
		themeServiceUrl: "/VS_HANA/vaees/procurementxp/punchouthubservice/services/getUI5Theme.xsjs",
		
		getAvailableUI5ThemesPromise: function () {
			return sap.ushell.Container.getService("UserInfo").getThemeList();
		},
		
		getUI5ThemeFromDB: function (sSupplierId) {
			console.log("Gerrit Test");
			return jQuery.ajax({
				url: this.themeServiceUrl,
				contentType: "application/json",
				method: "GET",
				data: {
					"supplierId": sSupplierId ? sSupplierId : ""
				}
			});
		},
		
		getValidTheme: function(oUserTheme, aThemeList) {
			var sTheme = this.defaultTheme;
			if(oUserTheme && oUserTheme.ui5Theme && aThemeList.options && this.isValidTheme(oUserTheme.ui5Theme, aThemeList.options)) {
				sTheme = oUserTheme.ui5Theme;
			}
			
			return sTheme;
		},
		
		isValidTheme: function(sThemeId, aThemeList) {
			var oFoundTheme = aThemeList.find(function(oTheme) {
				return oTheme.id === sThemeId;
			});
			
			if(oFoundTheme) {
				return true;
			}
			
			return false;
		}, 

		setUserUI5Theme: function (sSupplierId) {
			var aPromises = [];
			aPromises.push(this.getUI5ThemeFromDB(sSupplierId));
			aPromises.push(this.getAvailableUI5ThemesPromise());
			$.when.apply($, aPromises
			).done(function(oUserTheme, aThemeList) {
				var sTheme = this.getValidTheme(oUserTheme[0], aThemeList);
				if(window.location.host.indexOf("webide") < 0) {
					sap.ui.getCore().applyTheme(sTheme, "/api/theming/UI5/");
				} else {
					sap.ui.getCore().applyTheme(sTheme);	
				}
			}.bind(this)
			).fail(function() {
				var sTheme = this.getDefaultTheme();
				if(window.location.host.indexOf("webide") < 0) {
					sap.ui.getCore().applyTheme(sTheme, "/api/theming/UI5/");
				} else {
					sap.ui.getCore().applyTheme(sTheme);	
				}
			}.bind(this));
		},

		getDefaultTheme: function () {
			return this.defaultTheme;
		}
	};
});
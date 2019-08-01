sap.ui.define([], function() {
	"use strict";

	return {

		getSessionLanguage: function() {
			var sLanguage = sap.ui.getCore().getConfiguration().getLanguage().toLowerCase();
			return sLanguage.substring(0, 2);
		},
		validateCurrency: function(sAmount) {
			var sLanguage = this.getSessionLanguage();
			var regex;
			switch (sLanguage) {
				case "pt":
					regex = /^(\d+|\d{1,3}(\.\d{3})*)(\,\d{1,2})?$/;
					break;

				default:
					regex = /^(\d+|\d{1,3}(,\d{3})*)(\.\d{1,2})?$/;
			}
			return regex.test(sAmount.trim());
		},
		formatFloat: function(fNumber) {
			var oNumberInstance = sap.ui.core.format.NumberFormat.getFloatInstance({
				minIntegerDigits: 1,
				minFractionDigits: 2,
				maxFractionDigits: 2
			});

			if (!fNumber) {
				return oNumberInstance.format(0);
			}

			return oNumberInstance.format(fNumber);
		},

		parseFloat: function(sNumber) {
			var oNumberInstance = sap.ui.core.format.NumberFormat.getFloatInstance({
				minIntegerDigits: 1,
				minFractionDigits: 2,
				maxFractionDigits: 2,
				groupingSeparator: ",",
				decimalSeparator: "."
			});

			if (!sNumber) {
				return oNumberInstance.parse("0");
			}

			return oNumberInstance.parse(sNumber);
		},

		formatInteger: function(fNumber) {
			var oNumberInstance = sap.ui.core.format.NumberFormat.getIntegerInstance();

			if (!fNumber) {
				return oNumberInstance.format(0);
			}

			return oNumberInstance.format(fNumber);
		},

		getBrowserToHanaLanguage: function() {
			var browserToHanaLanguage = {
				"en": "E",
				"es": "S",
				"pt": "P"
			};
			var sBrowserLang = sap.ui.getCore().getConfiguration().getLanguage().toLowerCase();
			if (sBrowserLang.indexOf("-") > -1) {
				sBrowserLang = sBrowserLang.split("-")[0];
			}

			var sHanaLang = browserToHanaLanguage[sBrowserLang];
			if (!sHanaLang) {
				return "E";
			}

			return sHanaLang;
		},

		// Solution proposed on:
		// https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
		getDistinctArray: function(a) {
			var seen = {};
			return a.filter(function(item) {
				return seen.hasOwnProperty(item) ? false : (seen[item] = true);
			});
		},

		displayInternalErrorMsg: function(oError) {
			var sTitle = this.getResourceBundle().getText("MSG_ERROR_INTERNALERROR_TITLE");
			var sMsg = this.getResourceBundle().getText("MSG_ERROR_INTERNALERROR_DESC");

			sap.m.MessageBox.show(sMsg, {
				icon: sap.m.MessageBox.Icon.ERROR,
				title: sTitle,
				actions: [sap.m.MessageBox.Action.CLOSE],
				details: oError,
				styleClass: "sapUiSizeCompact"
			});
		},

		getText: function(sText, aParameters) {
			var oComponent = this.getOwnerComponent();
			var oResourceBundle = oComponent.getModel("i18n").getResourceBundle();

			if (aParameters) {
				return oResourceBundle.getText(sText, aParameters);
			}

			return oResourceBundle.getText(sText);
		},

		getFormattedDateFromDats: function(sContractValidity) {
			var sFormattedDate = sContractValidity;

			if (sContractValidity) {

				var oAbapDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: 'yyyyMMdd'
				});

				var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					style: 'medium'
				});

				var oContractDate = oAbapDateFormat.parse(sContractValidity);
				sFormattedDate = oDateFormat.format(oContractDate);

			}

			return sFormattedDate;
		},
		removeLeadingCharacter: function(sText, sLeadChar) {
			var oRegExp = new RegExp('^' + sLeadChar + '+');
			return sText.replace(oRegExp, '');
		}
	};

});
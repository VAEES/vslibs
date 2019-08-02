/*global QUnit */
sap.ui.define([
	"vslibs/ui5ThemeManager"
], function (ui5ThemeManager) {
	"use strict";

	QUnit.module("SAPUI5 Theme", {

		beforeEach: function () {

			this._supplierId = "vaees";

		sap.ushell.Container = {
				getService: function (sId) {}
			};

			this.stub = sinon.stub(sap.ushell.Container, "getService", function () {
				return {
					getThemeList: function () {
						var oDeferred = jQuery.Deferred();
						oDeferred.resolve({
							options: [{
								id: "sap_belize",
								name: "SAP Belize"
							}, {
								id: "vaeesupplyhub",
								name: "Vaees Supply Hub"
							}]
						});
						return oDeferred.promise();
					}
				};
			});
		},
		afterEach: function () {
			this.stub.restore();
		}
	});

	QUnit.test("Theme list: should return at least one theme", function (assert) {
		var done = assert.async();
		jQuery.when(ui5ThemeManager.getAvailableUI5ThemesPromise()).then(function (oThemeList) {
			assert.ok(oThemeList.options.length >= 1, "UI5 Theme List service completed!");
			done();
		});
	});

	QUnit.test("User Theme: should return theme nortel when supplier nortel is informed", function (assert) {
		var done = assert.async();
		jQuery.when(ui5ThemeManager.getUI5ThemeFromDB("nortel")).then(function (oTheme) {
			assert.equal(oTheme.ui5Theme, "nortel", "Nortel theme selected");
			done();
		});
	});

	QUnit.test("User Theme: should return theme vaees when invalid supplier is informed", function (assert) {
		var done = assert.async();
		jQuery.when(ui5ThemeManager.getUI5ThemeFromDB("zzzzz")).then(function (oTheme) {
			assert.equal(oTheme.ui5Theme, "vaeesupplyhub", "VAEES theme selected");
			done();
		});
	});

	QUnit.test("User Theme: should return a theme when no supplier is informed", function (assert) {
		var done = assert.async();
		jQuery.when(ui5ThemeManager.getUI5ThemeFromDB()).then(function (oTheme) {
			assert.ok(oTheme.ui5Theme, "Theme selected");
			done();
		});
	});

	QUnit.test("User Theme: verify valid theme", function (assert) {
		var sTheme = "vaeesupplyhub";
		var aThemeList = [{
			id: "sap_belize",
			name: "SAP Belize"
		}, {
			id: "vaeesupplyhub",
			name: "VAEES Belize Theme"
		}];

		assert.ok(ui5ThemeManager.isValidTheme(sTheme, aThemeList));
	});

	QUnit.test("User Theme: verify invalid theme", function (assert) {
		var sTheme = "invalidTheme";
		var aThemeList = [{
			id: "sap_belize",
			name: "SAP Belize"
		}, {
			id: "vaeesupplyhub",
			name: "VAEES Belize Theme"
		}];

		assert.notOk(ui5ThemeManager.isValidTheme(sTheme, aThemeList));
	});

	QUnit.test("Get user theme when it is valid ", function (assert) {
		var aThemeList = {
			options: [{
				id: "sap_belize",
				name: "SAP Belize"
			}, {
				id: "vaeesupplyhub",
				name: "VAEES Belize Theme"
			}, {
				id: "nortel",
				name: "Nortel"
			}]
		};

		var done = assert.async();
		jQuery.when(ui5ThemeManager.getUI5ThemeFromDB("nortel")).then(function (oTheme) {
			assert.equal(ui5ThemeManager.getValidTheme(oTheme, aThemeList), "nortel", "Valid theme selected");
			done();
		});
	});

	QUnit.test("Set VAEES theme when user theme is not valid ", function (assert) {
		var aThemeList = {
			options: [{
				id: "sap_belize",
				name: "SAP Belize"
			}, {
				id: "vaeesupplyhub",
				name: "VAEES Belize Theme"
			}]
		};

		var done = assert.async();
		jQuery.when(ui5ThemeManager.getUI5ThemeFromDB("nortel")).then(function (oTheme) {
			assert.equal(ui5ThemeManager.getValidTheme(oTheme, aThemeList), ui5ThemeManager.defaultTheme, "Default theme selected");
			done();
		});
	});

	/*QUnit.test("Theme list: should return at least one theme", function (assert) {
		var done = assert.async();
		jQuery.when(ui5ThemeManager.getAvailableUI5ThemesPromise()).then(function (oThemeList) {
			assert.ok(oThemeList.options.length >= 1, "UI5 Theme List service completed!");
			done();
		});
	});

	QUnit.test("Theme list: should assume theme sap_belize if service call fails", function (assert) {
		var sDefaultTheme = ui5ThemeManager.getDefaultTheme();
		assert.equal(sDefaultTheme, "sap_belize", "SAPUI5 default theme should be 'sap_belize'");
	});

	QUnit.test("Theme list: should assume theme sap_belize if service theme call returns undefined", function (assert) {
		var sDefaultTheme = ui5ThemeManager.getUserUI5Theme();
		assert.equal(sDefaultTheme, "sap_belize", "SAPUI5 theme is defaulted to 'sap_belize'");
	});

	QUnit.test("Theme list: should assume theme sap_belize if service theme call returns null", function (assert) {
		var sDefaultTheme = ui5ThemeManager.getUserUI5Theme(null, null);
		assert.equal(sDefaultTheme, "sap_belize", "SAPUI5 theme is defaulted to 'sap_belize'");
	});

	QUnit.test("Theme list: should assume theme sap_belize if array theme is empty", function (assert) {
		var sDefaultTheme = ui5ThemeManager.getUserUI5Theme(null, []);
		assert.equal(sDefaultTheme, "sap_belize", "SAPUI5 theme is defaulted to 'sap_belize'");
	});

	QUnit.test("Customer view: theme should be determined based on customer when supplier id is undefined", function (assert) {
		assert.expect(1);
		var oStub = sinon.stub(dbUtil, "getSAPUI5ThemeByCustomer", function (sSupplierId) {
			assert.step("Customer Logic reached!");
		});

		var sUndefinedSupplier;
		ui5ThemeManager.getUserUI5Theme(sUndefinedSupplier, [{
			id: "sap_belize",
			name: "SAP Belize"
		}]);

		oStub.restore();
	});

	QUnit.test("Customer view: theme should be determined based on customer when supplier id is null", function (assert) {
		assert.expect(1);
		var oStub = sinon.stub(dbUtil, "getSAPUI5ThemeByCustomer", function () {
			assert.step("Customer Logic reached!");
			sinon.restore();
		});

		var sNullSupplier = null;
		ui5ThemeManager.getUserUI5Theme(sNullSupplier, [{
			id: "sap_belize",
			name: "SAP Belize"
		}]);

		oStub.restore();
	});

	QUnit.test("Customer view: Should return VAEES theme when supplier is null", function (assert) {
		var sSupplier = null;
		assert.equal(ui5ThemeManager.getSAPUI5ThemeByCustomer(sSupplier), "vaeesupplyhub", "SAPUI5 theme should be 'vaeesupplyhub'");
	});

	QUnit.test("Customer view: Should return VAEES theme when supplier is undefined", function (assert) {
		var sSupplier;
		assert.equal(ui5ThemeManager.getSAPUI5ThemeByCustomer(sSupplier), "vaeesupplyhub", "SAPUI5 theme should be 'vaeesupplyhub'");
	});

	QUnit.test("Customer view: Should return VAEES theme when supplier is blank", function (assert) {
		var sSupplier = "";
		assert.equal(ui5ThemeManager.getSAPUI5ThemeByCustomer(sSupplier), "vaeesupplyhub", "SAPUI5 theme should be 'vaeesupplyhub'");
	});*/
});
sap.ui.define(["sap/ui/test/Opa5"], function (Opa5) {
  "use strict";

  return Opa5.extend("com.resulto.hcfi.test.integration.arrangements.Startup", {
    iStartMyApp: function () {
      this.iStartMyUIComponent({
        componentConfig: {
          name: "com.resulto.hcfi",
          async: true,
          manifest: true
        }
      });
    }
  });
});

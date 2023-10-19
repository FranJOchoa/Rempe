sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/routing/History",
  "sap/ui/core/UIComponent",
  "sap/m/MessageBox",
  "com/resulto/hcfi/model/formatter"
], function (Controller, History, UIComponent, MessageBox, formatter) {
  "use strict";

  /**
   * Create a base controller.
   * @class com.resulto.hcfi.controller.Base
   */
  return Controller.extend("com.resulto.hcfi.controller.BaseController", {
    formatter: formatter,

    /**
     * Convenience method for getting the view model by name in every controller of the application.
     * @public
     * @param {string} sName the model name
     * @returns {sap.ui.model.Model} the model instance
     * @memberOf com.resulto.hcfi.controller.Base
     */
    getModel: function (sName) {
      return this.getView().getModel(sName);
    },

    /**
     * Convenience method for setting the view model in every controller of the application.
     * @public
     * @param {sap.ui.model.Model} oModel the model instance
     * @param {string} sName the model name
     * @returns {sap.ui.mvc.View} the view instance
     * @memberOf com.resulto.hcfi.controller.Base
     */
    setModel: function (oModel, sName) {
      return this.getView().setModel(oModel, sName);
    },

    /**
     * Method for navigation to specific view
     * @public
     * @param {string} psTarget Parameter containing the string for the target navigation
     * @param {Object.<string, string>} pmParameters? Parameters for navigation
     * @param {boolean} pbReplace? Defines if the hash should be replaced (no browser history entry) or set (browser history entry)
     * @memberOf com.resulto.hcfi.controller.Base
     */
    navTo: function (psTarget, pmParameters, pbReplace) {
      this.getRouter().navTo(psTarget, pmParameters, pbReplace);
    },

    /**
     * Get the router for the current view.
     * @returns {sap.ui.core.routing.Router} The router for the current view
     * @memberOf com.resulto.hcfi.controller.Base
     */
    getRouter: function () {
      return UIComponent.getRouterFor(this);
    },

    /**
     * Update splitter height.
     * @memberOf com.resulto.hcfi.controller.Base
     */
    updateCss: function () {
      let objectHeader = jQuery(".sapUxAPObjectPageHeaderTitle").height();

      this.byId("Splitter").setHeight(`calc(100vh - ${objectHeader}px)`);

      this.setScrollInPages(objectHeader)

    },
    setScrollInPages(headerSize) {
      const styleSheet = Array.from(document.styleSheets).find(s => s.href?.indexOf("style.css") > 0);
      let secondHeader = headerSize + 5
      let thirdHeader = headerSize + (headerSize / 2);

      //Curso Clinico Scroller
      styleSheet.insertRule(`
      #container-hcfi---Main--Timeline-scroll{
        height: calc(100vh - ${headerSize - 18}px - ${secondHeader - 18}px);
        overflow: auto!important;
      }`
      );

      //Consultas Scroller
      styleSheet.insertRule(`
      #__vbox1{
        height: calc(100vh - ${headerSize}px - ${secondHeader}px);
        overflow: auto!important;
      }`
      );
      //Urgencias Scroller
      styleSheet.insertRule(`
      #__vbox9{
        height: calc(100vh - ${headerSize}px - ${secondHeader}px);
        overflow: auto!important;
      }`
      );
      //Informe Consulta Gine Pruebas Complementarias
      styleSheet.insertRule(`
         #__layout2-sectionsContainer{
           height: calc(100vh - ${thirdHeader}px - ${headerSize + 5}px)!important;
           overflow: auto!important;
         }`
      );
      //Informe Consulta Gine Otros Datos
      styleSheet.insertRule(`
          #__section4-innerGrid{
            height: calc(100vh - ${thirdHeader}px - ${headerSize + 5}px)!important;
            overflow: auto!important;
          }`
      );
      //Informe Consulta Ginecologica Scrolle
      styleSheet.insertRule(`
         #container-hcfi---Main--headerOfCAD_GINE-innerGrid{
           height: calc(100vh - ${thirdHeader}px - ${headerSize + 5}px)!important;
           overflow: auto!important;
         }`
      );

      //Control de Embarazo Datos Generales Scroller
      styleSheet.insertRule(`
        #container-hcfi---Main--headerOfCAD_CTREMB-innerGrid{
          height: calc(100vh - ${thirdHeader}px - ${headerSize - 15}px)!important;
          overflow: auto!important;
        }`
      );
      //Control de Embarazo Primer Trimestre Scroller
      styleSheet.insertRule(`
        #__section7-innerGrid{
          height: calc(100vh - ${thirdHeader}px - ${headerSize - 15}px)!important;
          overflow: auto!important;
        }`
      );
      //Control de Embarazo Segundo Trimestre Scroller
      styleSheet.insertRule(`
        #__section9-innerGrid{
          height: calc(100vh - ${thirdHeader}px - ${headerSize - 15}px)!important;
          overflow: auto!important;
        }`
      );
      //Control de Embarazo Tercer Trimestre Scroller
      styleSheet.insertRule(`
        #__section11-innerGrid{
          height: calc(100vh - ${thirdHeader}px - ${headerSize - 15}px)!important;
          overflow: auto!important;
        }`
      );
      //Control de Embarazo Monitores Scroller
      styleSheet.insertRule(`
        #__section13-innerGrid{
          height: calc(100vh - ${thirdHeader}px - ${headerSize - 15}px)!important;
          overflow: auto!important;
        }`
      );
      //Control de Embarazo Parto Scroller
      styleSheet.insertRule(`
        #__section15-innerGrid{
          height: calc(100vh - ${thirdHeader}px - ${headerSize - 15}px)!important;
          overflow: auto!important;
        }`
      );
      //Control de Embarazo Revisión Post Parto Scroller
      styleSheet.insertRule(`
        #__section17-innerGrid{
          height: calc(100vh - ${thirdHeader}px - ${headerSize - 15}px)!important;
          overflow: auto!important;
        }`
      );
      //Control de Embarazo Alta Scroller
      styleSheet.insertRule(`
       #__section19-innerGrid{
         height: calc(100vh - ${thirdHeader}px - ${headerSize - 15}px)!important;
         overflow: auto!important;
       }`
      );
      //Control de Embarazo Otros Datos Scroller
      styleSheet.insertRule(`
       #__section21-innerGrid{
         height: calc(100vh - ${thirdHeader}px - ${headerSize - 15}px)!important;
         overflow: auto!important;
       }`
      );
      //Consulta Mamaria Exploración/Revisión Scroller
      styleSheet.insertRule(`
        #container-hcfi---Main--cadmam--headerOfCAD_MAM-innerGrid{
          height: calc(100vh - ${thirdHeader}px - ${headerSize + 5}px)!important;
          overflow: auto!important;
        }`
      );
      //Consulta Mamaria Pruebas Complementarias Scroller
      styleSheet.insertRule(`
        #__section24-innerGrid{
          height: calc(100vh - ${thirdHeader}px - ${headerSize + 5}px)!important;
          overflow: auto!important;
        }`
      );
      //Consulta Mamaria Otros Datos Scroller
      styleSheet.insertRule(`
        #__section26-innerGrid{
          height: calc(100vh - ${thirdHeader}px - ${headerSize + 5}px)!important;
          overflow: auto!important;
        }`
      );
    },

    /**
     * Display a MessageBox error.
     * @param {string} serviceName Title for MessageBox
     * @param {string} message Text for MessageBox
     * @memberOf com.resulto.hcfi.controller.Base
     */
    displayOdataError(serviceName, message) {
      MessageBox.error(message, { title: serviceName });
    },

    /**
     * Groups the elements of an array of objects according to a given key.
     * @param {array} array - Array of objects
     * @param {String} key - Key by which to group
     * @returns {object} Object with the elements ordered by the value of the key
     * @memberOf com.resulto.hcfi.controller.Base
     */
    groupBy: function (array, key) {
      return array.reduce((result, currentValue) => {
        if (currentValue.Line !== undefined && currentValue.Line === 0) result[currentValue[key]] = currentValue;
        else (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
        return result;
      }, {});
    },

    /**
     * Generate UUID v4.
     * @returns {string} Generated UUID v4
     * @memberOf com.resulto.hcfi.controller.Base
     */
    uuidv4: function () {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },

    /**
     * Add icons to sap icon pool.
     * @memberOf com.resulto.hcfi.controller.Base
     */
    addIcons: function () {
      this.getFontAwesomeIcons().forEach(icon => {
        sap.ui.core.IconPool.addIcon(icon.name, "fa", "awesome", icon.id);
      });
    },

    /**
     * Create an array of icons from FontAwesome.
     * @returns {object[]} Array of icons
     * @memberOf com.resulto.hcfi.controller.Base
     */
    getFontAwesomeIcons: function () {
      return [{
        "name": "vial",
        "id": "f492"
      }, {
        "name": "x-ray",
        "id": "f497"
      },];
    },

  });

});
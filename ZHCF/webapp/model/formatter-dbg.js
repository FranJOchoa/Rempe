sap.ui.define([
  "sap/ui/core/format/DateFormat"
], function (DateFormat) {
  "use strict";

  /**
   * @class com.resulto.hcfi.model.formatter
   */
  return {

    /**
     * Search the sap icon by type.
     * @param {string} sType - Type for the icon
     * @returns {string} The icon URI
     * @memberOf com.resulto.hcfi.model.formatter
     */
    summaryIcon: function (sType) {
      return this.getModel("SummaryType").getProperty("/results").filter(x => x.type === sType)[0].icon;
    },

    /**
     * Search the description by type.
     * @param {string} sType - Type for the description
     * @returns {string} The description of the type
     * @memberOf com.resulto.hcfi.model.formatter
     */
    summaryType: function (sType) {
      return this.getModel("SummaryType").getProperty("/results").filter(x => x.type === sType)[0].description;
    },

    /**
     * Show "more" link to show the text complete.
     * @param {string} summaryText - Text to show
     * @returns {boolean} If show the link or not
     * @memberOf com.resulto.hcfi.model.formatter
     */
    readMore: function (summaryText) {
      if (!summaryText) return false;
      return summaryText.split("\n").length > 4 || summaryText.length > 700;
    },

    /**
     * Set the max lines to show if the text is long.
     * @param {string} summaryText - Text to check if is long
     * @returns {number} Number of lines to show
     * @memberOf com.resulto.hcfi.model.formatter
     */
    maxLines: function (summaryText) {
      if (!summaryText) return 4;
      return summaryText.split("\n").length > 4 || summaryText.length > 700 ? 4 : 0;
    },

    /**
     * Format process text.
     * @param {string} processText - Process text
     * @returns {string} Process text formatted
     * @memberOf com.resulto.hcfi.model.formatter
     */
    processText: function (processText) {
      return processText ? processText : "Sin proceso";
    },

    /**
     * Calculate grid height.
     * @returns {string} Calculated grid height
     * @memberOf com.resulto.hcfi.model.formatter
     */
    gridHeight: function () {
      let objectHeader = jQuery(".sapUxAPObjectPageHeaderTitle").height();
      let tabBarHeader = jQuery(".sapMITBHead").height();
      return objectHeader && tabBarHeader ? `calc((100vh - ${objectHeader}px - ${tabBarHeader}px - 1px - 2rem) / 3)` : "";
    },

    /**
     * Format title with counter.
     * @param {string} title - Title
     * @param {string[]} list - List to count
     * @param {string} filter - Model name
     * @param {string[]} types - Document types
     * @returns {string} Title formatted
     * @memberOf com.resulto.hcfi.model.formatter
     */
    getTitleWithCount: function (title, list, filter, types = []) {
      if (list.length && filter) list = list.filter(i => i[filter] === true);
      if (types.length) list = list.filter(i => types.includes(i.RN2DOCDATA.Dtid));
      return `${title} (${list.length})`;
    },

    /**
     * Format title with counter.
     * @param {string[]} list - List to count
     * @param {string} filter - Model name
     * @param {string[]} types - Document types
     * @returns {boolean} If is visible
     * @memberOf com.resulto.hcfi.model.formatter
     */
    isDocumentVisible: function (list, filter, types = []) {
      if (list.length && filter) list = list.filter(i => i[filter] === true);
      if (types.length) list = list.filter(i => types.includes(i.RN2DOCDATA.Dtid));
      return Boolean(list.length);
    },

    /**
     * Format notes title with counter.
     * @param {string} title - Title
     * @param {string[]} list - Type for the icon
     * @returns {string} Title formatted
     * @memberOf com.resulto.hcfi.model.formatter
     */
    getNotesTitleWithCount: function (title, list) {
      const length = list.length > 5 ? 5 : list.length;
      const last = list.length > 5 ? this.getModel("i18n").getProperty("Last") + " " : "";
      return `${title} (${last}${length})`;
    },

    /**
     * Check if is this case.
     * @param {string} Falnr - Falnr of the case
     * @returns {boolean} If is this case
     * @memberOf com.resulto.hcfi.model.formatter
     */
    isThisCase: function (Falnr) {
      return parseInt(this.headers.Case) === parseInt(Falnr) ? "true" : "false";
    },

    /**
     * Get initial case date.
     * @param {number} Begdt - Date
     * @param {number} Erdat - Date
     * @returns {Date} Initial date
     * @memberOf com.resulto.hcfi.model.formatter
     */
    getInitialCaseDate: function (Begdt, Erdat) {
      if (Begdt) return DateFormat.getDateInstance().format(Begdt);
      return DateFormat.getDateInstance().format(Erdat);
    },

    /**
     * Find the range the value is in and return its css class.
     * @param {number} value - The cell value
     * @param {string} code - The id of the vital sign
     * @param {number} rangeAlarmHigh - The maximum value of the alarm range
     * @param {number} rangeAlarmLow - The minimum value of the alarm range
     * @param {number} rangeNormalHigh - The maximum value of the normal range
     * @param {number} rangeNormalLow - The minimum value of the normal range
     * @param {number} rangeWarningHigh - The maximum value of the warning range
     * @param {number} rangeWarningLow - The minimum value of the warning range
     * @returns {string} The css class for this range
     * @memberOf com.resulto.hcfi.model.formatter
     */
    getRangeColor: function (value, code, rangeAlarmHigh, rangeAlarmLow, rangeNormalHigh, rangeNormalLow, rangeWarningHigh, rangeWarningLow) {
      let range = "";
      if (value) {
        if (value.value >= rangeAlarmLow && value.value <= rangeAlarmHigh) range = "catalog_" + code + "_Alert";
        if (value.value >= rangeWarningLow && value.value <= rangeWarningHigh) range = "catalog_" + code + "_Warning";
        if (value.value >= rangeNormalLow && value.value <= rangeNormalHigh) range = "";
      }
      return range;
    },

    /**
     * Search if item is selected.
     * @param {string} key - Object key
     * @param {string} value - Object value
     * @param {string} list - List of objects
     * @returns {string} If is selected
     * @memberOf com.resulto.hcfi.model.formatter
     */
    dialogSelectedItem: function (key, value, list) {
      return Boolean(list.find(i => i[key] === value));
    },

    /**
     * Check if is editable.
     * @param {string} dokst - Document status
     * @param {string} selected - Value if selected
     * @returns {boolean} If is editable
     * @memberOf com.resulto.hcfi.model.formatter
     */
    isEditable: function (dokst, selected = "X", allowedPMD = [], model = "") {  
      var exclusive = ""
      if(allowedPMD.length>0 && allowedPMD.find(doc => doc.Dtid == model))
        exclusive = allowedPMD.find(doc => doc.Dtid == model).Exclusive
      if (dokst === "FR" && exclusive === "") return false;      
      return selected === "X";
    },

    //Check if is editable and checkbox is checked
    isEditableAndChecked: function (dokst, selected = "X", checked = "F") {
      if (dokst === "FR") return false;
      return selected === "X" && checked === "X";      
    },

    isEditableAndEnabled: function (dokst, selected = "X", enabled) {
      if (dokst === "FR") return false;
      return selected === "X"  && enabled === "02";      
    },


    /**
     * Check if is printable.
     * @param {string} dokst - Document status
     * @param {string} selected - Value if selected
     * @returns {boolean} If is editable
     * @memberOf com.resulto.hcfi.model.formatter
     */
     isPrintable: function (dokst, selected = "X") {
      if (dokst === "") return false;
      return selected === "X";
    },

    /**
     * Check if can display save allergy button
     * @param {boolean} noAllergy Has referred allergy
     * @param {Object} allergy Allergy data
     * @returns {boolean} Can display save button
     */
    canSaveAllergy: function (noAllergy, allergy) {
      return noAllergy || !jQuery.isEmptyObject(allergy);
    },

    antecedentVisible: function(children, isSelectable) {
      return children !== undefined || isSelectable;
    }

  };
});

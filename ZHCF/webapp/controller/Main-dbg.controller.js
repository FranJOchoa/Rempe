sap.ui.define([
  "com/resulto/hcfi/controller/BaseController",
  "sap/base/strings/formatMessage",
  "sap/m/IconTabFilter",
  "sap/m/MessageBox",
  "sap/m/MessageToast",
  "sap/m/PDFViewer",
  "sap/ui/model/Filter",
  "sap/ui/core/format/DateFormat",
  "com/resulto/hcfi/model/formatter",
  "com/resulto/hcfi/model/models",
  "sap/ui/model/json/JSONModel",
  "sap/m/Dialog",
  "sap/m/Button"
], function (Controller, formatMessage, IconTabFilter, MessageBox, MessageToast, PDFViewer, Filter, DateFormat, formatter, models, JSONModel, Dialog, Button) {
  "use strict";

  /**
   * Create a controller from Main view.
   * @class com.resulto.hcfi.controller.Main
   */
  return Controller.extend("com.resulto.hcfi.controller.Main", {
    formatMessage: formatMessage,
    previousDateRange: "",
    vitalSignBatchID: "",
    noAllergy: false,
    oServiceResultsDialog: null,
    _itemsToUpload: [],

    /**
     * Called when the controller is instantiated and its View controls (if available) are already created.
     * Attach pattern matched event.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onInit: function () {
      this.addIcons();
      this._pdfViewer = new PDFViewer();
      this.getView().addDependent(this._pdfViewer);
      this.getInitialModels();
      this.getRouter().getRoute("Main").attachPatternMatched(this.onObjectMatched, this);
      this.byId("vitalSignsTable").onAfterRendering = this.onAfterTableRendering;
      jQuery.sap.addUrlWhitelist("blob");
    },

    /**
     * Called when the pattern is matched.
     * Get the url params.
     * Call oData services depending on the recieved parameters.
     * Set main page busy.
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onObjectMatched: function (oEvent) {
      this.headers = {};
      try {
        this.headers = oEvent.getParameter("arguments")["?query"] || JSON.parse("{\"" + window.location.href.split("?")[1].replace(/"/g, "\\\"").replace(/&/g, "\",\"").replace(/=/g, "\":\"") + "\"}") || {};
        if (this.headers.Institution && this.headers.Case && this.headers.Patient) this.getData();
        else this.goToErrorPage();
      } catch (e1) {
        try {
          this.headers = JSON.parse("{\"" + window.location.href.split("#")[1].split("?")[1].replace(/"/g, "\\\"").replace(/&/g, "\",\"").replace(/=/g, "\":\"") + "\"}") || {};
          if (this.headers.Institution && this.headers.Case && this.headers.Patient) this.getData();
          else this.goToErrorPage();
        } catch (e2) {
          this.goToErrorPage();
        }
      }
    },

    /**
     * Call all initial services
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getData: function () {
      this.getMainData();
      this.getFieldKeyValues();
      this.getSummaryTypes();
      //this.getREMPeUrl();
      this.getRadUrl();
      this.getLabUrl();
      this.getMedicalDataOverview();
      this.getPatientAllergyData();
      this.getNotesCategories();
      this.getClinicalOrders();
      this.getServiceTree();
      this.getRiskFactors();
      this.getAllergies();
      this.getProfessionalData();
      this.getAntecedents();
      this.getPatientRiskFactor();
      this.getPatientSocialHabits();
      //this.getPatientAllergy();
      this.getPatientProcesses();
      this.getDiagnosticsSet();
      this.getOrganizationUnits();
    },

    /**
     * Create initial models.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getInitialModels: function () {
      this.setModel(models.createMainModel(), "MainData");
      this.setModel(models.createLinksModel(), "Links");
      this.setModel(models.createAllowedPMDModel(), "AllowedPMD");
      this.setModel(models.createOPDModel(), "CAD_OPD");
      this.setModel(models.createAEModel(), "CAD_AE");
      this.setModel(models.createGINEModel(), "CAD_GINE");
      this.setModel(models.createCADMAMModel(), "CAD_MAM");
      this.setModel(models.createCTREMBModel(), "CAD_CTREMB");
      this.setModel(models.createResultsModel(), "PatientAllergy");
      this.setModel(models.createResultsModel(), "PatientRiskFactor");
      this.setModel(models.createResultsModel(), "PatientMedicalHistory");
      this.setModel(models.createResultsModel(), "PatientSurgeryHistory");
      this.setModel(models.createResultsModel(), "PatientFamilyHistory");
      this.setModel(models.createResultsModel(), "PatientSocialHabitsHistory");
      this.setModel(models.createResultsModel(), "MedicalDataOverview");
      this.setModel(models.createResultsModel(), "Documents");
      this.setModel(models.createResultsModel(), "Services");
      this.setModel(models.createResultsModel(), "ServiceTree");
      this.setModel(models.createResultsModel(), "ProcessCases");
      this.setModel(models.createResultsModel(), "NotesCategories");
      this.setModel(models.createResultsModel(), "SummaryType");
      this.setModel(models.createResultsModel(), "Summary");
      this.setModel(models.createResultsModel(), "TypesReduced");
      this.setModel(models.createResultsModel(), "DocumentationUnitsReduced");
      this.setModel(models.createResultsModel(), "ResponsiblesReduced");
      this.setModel(models.createResultsModel(), "ResponsiblesGroupReduced");
      this.setModel(models.createResultsModel(), "Config");
      this.setModel(models.createResultsModel(), "TimeFilter");
      this.setModel(models.createResultsModel(), "RiskFactor");
      this.setModel(models.createResultsModel(), "Allergy");
      this.setModel(models.createResultsModel(), "DiagnosticsSet");
      this.setModel(models.createResultsModel(), "GetCaseDiagnostics");
      this.setModel(models.createResultsModel(), "GetOrganizationUnits");
      this.setModel(models.createAntecedentsModel(), "Antecedent");
      this.setModel(models.createEmptyModel(), "KeyValue");
      this.setModel(models.createEmptyModel(), "ProfessionalData");
      this.setModel(models.createNewAllergyModel(), "NewAllergy");
      this.setModel(models.createNewFamilyHistoryModel(), "NewFamilyHistory");
      this.setModel(models.createNewMedicalHistoryModel(), "NewMedicalHistory");
      this.setModel(models.createNewSurgeryHistoryModel(), "NewSurgeryHistory");
      this.setModel(models.createNewHabitModel(), "NewHabit");
      this.setModel(models.createVitalSignsModel(), "VitalSigns");
      this.setModel(models.createResultsModel(), "PatientProcess");
      this.setModel(models.createResultsModel(), "RiskFactorFiltered");
      this.setModel(new JSONModel({
        ov: true,
        al: true,
        rf: true,
        sh: true,
        mh: true,
        fh: true,
        oh: true,
      }), "BusyModel");
      this.setModel(models.createResultsModel(),"ClinicalOrders");
    },
    /**
     * Update css rules after App render
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onAfterRendering: function () {
      this.updateCss();
    },

    /**
     * Get main data from service.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getMainData: function () {
      this.getModel("ZISH_HCFI_SRV").callFunction("/GetMainData", {
        urlParameters: {
          Institution: this.headers.Institution,
          Case: this.headers.Case,
          Movement: this.headers.Movement,
          Patient: this.headers.Patient,
        },
        success: function (oResponse) {
          this.getModel("MainData").setProperty("/", oResponse.GetMainData);
          document.title = this.getModel("MainData").getProperty("/PatientData/PatientNameAgeSex");
          // this.getModel("CAD_OPD").setProperty("/Allergies",[]);
          // this.getModel("CAD_AE").setProperty("/Allergies",[]);
          this.getCatalog();
          this.getValues();
          this.getCasesInProcess(oResponse.GetMainData.CaseData.Einri, oResponse.GetMainData.CaseData.Falnr, this.headers.Movement);
          this.getDocuments();
          this.getServices();
          var defaultData = oResponse.GetMainData.DefaultData.Dtid;
          if (defaultData) {
            this.byId("IconTabBar").setSelectedKey(defaultData);
          }
          // if(this.byId("IconTabBar").getSelectedKey() == "CAD_OPD"){
          //   var naopd = this.getView().getModel("CAD_OPD").getData().content.PAT_FALLST.Value;
          //   if(naopd == "Ninguna alergia"){
          //     var al = this.getModel("CAD_OPD").getProperty("/Allergies");
          //     al.push({
          //       PAT_FALLDS: "No refiere",
          //       PAT_FALLGR: "",
          //       PAT_FALLID: "00000",
          //       PAT_FALLRA: "",
          //       PAT_FALLSE: "",
          //       PAT_FALLTY: "",
          //     })
          //     this.fillDroppedHistoryModel("CAD_OPD");
          //     naopd = "Ninguna alergia"
          // }}else if(this.byId("IconTabBar").getSelectedKey() == "CAD_AE"){
          //   var naae = this.getView().getModel("CAD_AE").getData().content.PAT_FALLST.Value;
          //   if(naae == "Ninguna alergia"){
          //     var al = this.getModel("CAD_AE").getProperty("/Allergies");
          //     al.push({
          //       PAT_FALLDS: "No refiere",
          //       PAT_FALLGR: "",
          //       PAT_FALLID: "00000",
          //       PAT_FALLRA: "",
          //       PAT_FALLSE: "",
          //       PAT_FALLTY: "",
          //     })
          //     this.fillDroppedHistoryModel("CAD_AE");
          // }}
          this.byId("MainPage").setBusy(false);
        }.bind(this),
        error: function (oError) {
          this.byId("MainPage").setBusy(false);
          try {
            this.displayOdataError("GetMainData", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("GetMainData", oError.message);
          }

        }.bind(this)
      });
    },
    getDescriptionOfDiagnostics: function () {
      //this.setModel(models.createResultsModel(),"CaseDiagnostics");
      //var caseDiagnostics = this.getModel("CaseDiagnostics");
      //caseDiagnostics.setProperty("/results", [])

      var getCaseDiagnostics = this.getModel("GetCaseDiagnostics").getProperty("/results");
      var diagnosticsSet = this.getModel("DiagnosticsSet").getProperty("/results");
      getCaseDiagnostics.forEach(cD => {
        cD.Description = diagnosticsSet.find(d => d.Code == cD.Dkey1).Description;
      })
    },

    getDiagnosticsSet: function () {
      this.getModel("ZISH_HCFI_SRV").read("/DiagnosticsSet", {
        success: function (oResponse) {
          this.getModel("DiagnosticsSet").setProperty("/results", oResponse.results);
          this.getCaseDiagnostics();
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("DiagnosticsSet", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("DiagnosticsSet", oError.message);
          }
        }.bind(this)
      });
    },

    getCaseDiagnostics: function () {
      this.getModel("ZISH_HCFI_SRV").callFunction("/GetCaseDiagnostics", {
        urlParameters: {
          Case: this.headers.Case,
          Institution: this.headers.Institution,
        },
        success: function (oResponse) {
          this.getModel("GetCaseDiagnostics").setProperty("/results", oResponse.results);
          this.getDescriptionOfDiagnostics();
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("GetCaseDiagnostics", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("GetCaseDiagnostics", oError.message);
          }
        }.bind(this)
      });
    },
    getOrganizationUnits: function () {
      this.getModel("ZISH_HCFI_SRV").callFunction("/GetOrganizationUnits", {
        urlParameters: {
          Institution: this.headers.Institution,
        },
        success: function (oResponse) {
          this.getModel("GetOrganizationUnits").setProperty("/results", oResponse.results);
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("GetOrganizationUnits", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("GetOrganizationUnits", oError.message);
          }
        }.bind(this)
      });
    },

    /**
     * Get REMPe url from service.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getREMPeUrl: function () {
      this.byId("MainPage").setBusy(true)
      this.byId("rempeBtn").setEnabled(false)
      this.getModel("ZISH_HCFI_SRV").callFunction("/GetREMPeUrl", {
        urlParameters: {
          Institution: this.headers.Institution,
          Case: this.headers.Case,
          Patient: this.headers.Patient,
        },
        success: function (oResponse) {
          this.getModel("Links").setProperty("/REMPe", oResponse.GetREMPeUrl.link);
          this.byId("MainPage").setBusy(false)
          this.byId("rempeBtn").setEnabled(true)
          this.onHeaderLinkPressed('REMPe');
        }.bind(this),
        error: function(oError){
          try {
            this.displayOdataError("getREMPeUrl", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("getREMPeUrl", oError.message);
          }
          this.byId("MainPage").setBusy(false)
          this.byId("rempeBtn").setEnabled(true)
        }.bind(this)
      });
    },

    /**
     * Get radiology url from service.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getRadUrl: function () {
      this.getModel("ZISH_HCFI_SRV").callFunction("/GetRadUrl", {
        urlParameters: {
          Institution: this.headers.Institution,
          Case: this.headers.Case,
          Patient: this.headers.Patient,
        },
        success: function (oResponse) {
          this.getModel("Links").setProperty("/Rad", oResponse.GetRadUrl.link);
        }.bind(this),
      });
    },

    /**
     * Get laboratory url from service.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getLabUrl: function () {
      this.getModel("ZISH_HCFI_SRV").callFunction("/GetLabUrl", {
        urlParameters: {
          Institution: this.headers.Institution,
          Case: this.headers.Case,
          Patient: this.headers.Patient,
        },
        success: function (oResponse) {
          this.getModel("Links").setProperty("/Lab", oResponse.GetLabUrl.link);
        }.bind(this),
      });
    },

    /**
     * Get medical data overview from service.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getMedicalDataOverview: function () {

      this.getModel("BusyModel").setProperty("/ov", true);

      this.getModel("ZISH_HCFI_SRV").callFunction("/GetMedicalDataOverview", {
        urlParameters: {
          Institution: this.headers.Institution,
          Patient: this.headers.Patient,
        },
        success: function (oResponse) {
          this.getModel("BusyModel").setProperty("/ov", false);
          this.getModel("MedicalDataOverview").setSizeLimit(oResponse.results.length);
          this.getModel("MedicalDataOverview").setProperty("/results", this.filterAllegiesList(oResponse.results));
          
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("GetMedicalDataOverview", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("GetMedicalDataOverview", oError.message);
          }
          this.getModel("BusyModel").setProperty("/ov", false);
          
        }.bind(this)
      });

      this.getAntecedents();
      this.getPatientRiskFactor();
      this.getPatientAllergy();

    },

    getPatientAllergyData: function () {
      this.getModel("ZISH_HCFI_SRV").callFunction("/GetPatientAllergyData", {
        urlParameters: {
          Patient: this.headers.Patient,
        },
        success: function (oResponse) {
          this.noAllergy = oResponse.GetPatientAllergyData.StateTotal === "1";
          this.getModel("Allergy").setProperty("/NoAllergy", oResponse.GetPatientAllergyData.StateTotal === "1");
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("GetPatientAllergyData", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("GetPatientAllergyData", oError.message);
          }
        }.bind(this)
      });
    },

    setNoReferredAllergy: function () {
      this.getModel("ZISH_HCFI_SRV").callFunction("/SetNoReferredAllergy", {
        method: "POST",
        urlParameters: {
          Patient: this.headers.Patient,
          State: this.getModel("Allergy").getProperty("/NoAllergy") ? "1" : "3"
        },
        success: function (oResponse) {
          this.noAllergy = oResponse.SetNoReferredAllergy.StateTotal === "1";
          this.getModel("Allergy").setProperty("/NoAllergy", oResponse.SetNoReferredAllergy.StateTotal === "1");
          this.getMedicalDataOverview();
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("SetNoReferredAllergy", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("SetNoReferredAllergy", oError.message);
          }
        }.bind(this)
      });
    },

    /**
     * Get documents from service.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getDocuments: function (dtid, dtvers, avoidRefill = false) {

      let filteredBySpeciality = this.getModel("MainData").getProperty("/DefaultData/FilteredBySpeciality");

      this.getModel("ZISH_HCFI_SRV").callFunction("/GetDocuments", {
        urlParameters: {
          Institution: filteredBySpeciality ? this.headers.Institution : '',
          Case: filteredBySpeciality ? this.headers.Case : '',
          Movement: filteredBySpeciality ? this.headers.Movement : '',
          Patient: this.headers.Patient,
          Process: filteredBySpeciality ? this.getModel("MainData").getProperty("/ProcessData/ID") : ''
        },
        success: function (oResponse) {
          this.getModel("Documents").setProperty("/results", oResponse.results);
          this.byId("MedDocuments").setBusy(false);
          this.byId("OtherDocuments").setBusy(false);
          this.byId("ResultsDocuments").setBusy(false);
          if(!avoidRefill){
            if (dtid && dtvers) this.getDocumentForFill(dtid, dtvers);
            else this.getAllowedPMD();
          }
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("GetDocuments", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("GetDocuments", oError.message);
          }
          this.byId("MedDocuments").setBusy(false);
          this.byId("OtherDocuments").setBusy(false);
          this.byId("RadiologyDocuments").setBusy(false);
          this.byId("AnalysisDocuments").setBusy(false);
          this.byId("APADocuments").setBusy(false);
        }.bind(this)
      });
    },

    /**
     * Get services from service.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getServices: function () {
      this.getModel("ZISH_HCFI_SRV").callFunction("/GetServices", {
        urlParameters: {
          Institution: this.headers.Institution,
          Case: this.headers.Case,
          Movement: this.headers.Movement,
          Patient: this.headers.Patient,
          Process: this.getModel("MainData").getProperty("/ProcessData/ID")
        },
        success: function (oResponse) {
          this.getModel("Services").setProperty("/results", oResponse.results);
          this.byId("Services").setBusy(false);
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("GetServices", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("GetServices", oError.message);
          }
        }.bind(this)
      });
    },

    /**
     * Get service tree from service.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getServiceTree: function () {
      this.getModel("ZISH_HCFI_SRV").callFunction("/GetServiceTree", {
        urlParameters: {
          Institution: this.headers.Institution,
          Case: this.headers.Case
        },
        success: function (oResponse) {
          var results = oResponse.results.filter(i => i.Tgrkz || !i.Tgrkz && i.Parent == "").map(function (parent) {
            parent.children = this.filter(child => child.Parent === parent.Talst);
            return parent;
          }, oResponse.results);
          this.getModel("ServiceTree").setProperty("/results", results);
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("GetServiceTree", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("GetServiceTree", oError.message);
          }
        }.bind(this)
      });
    },

    /**
     * Get cases in process from service.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getCasesInProcess: function (institution, caseid, movement) {
      this.getModel("ZISH_HCFI_SRV").callFunction("/GetRelatedCases", {
        urlParameters: {
          Institution: institution,
          Case: caseid,
          Movement: movement
        },
        success: function (oResponse) {
          this.getModel("ProcessCases").setProperty("/results", oResponse.results);
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("GetRelatedCases", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("GetRelatedCases", oError.message);
          }
        }.bind(this)
      });
    },

    /**
     * Get notes categories from service.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getNotesCategories: function () {
      this.getModel("ZISH_HCFI_SRV").callFunction("/GetNotesCategories", {
        urlParameters: {
          Institution: this.headers.Institution,
          Case: this.headers.Case
        },
        success: function (oResponse) {
          this.getModel("NotesCategories").setProperty("/results", oResponse.results);
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("NotesCategories", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("NotesCategories", oError.message);
          }
        }.bind(this)
      });
    },
    /**
    * Get clinical Orders from service
    * @memberOf com.resulto.hcfi.controller.Main
    */
   getClinicalOrders: function(){
    this.getModel("ZISH_HCFI_SRV").callFunction("/GetClinicalOrders",{
      urlParameters:{
        Institution: this.headers.Institution,
        Patient: this.headers.Patient
      },
      success: function(oResponse){
        var resultsArray = oResponse.results;
        resultsArray.forEach(r =>{
          r.CreationDate = new Date(r.CreationDate);
          r.CreationDate = r.CreationDate.toLocaleDateString();
        })
        this.getModel("ClinicalOrders").setProperty("/results", resultsArray);
        this.getModel("ClinicalOrders").refresh();
      if(this.getView().byId("clinicalOrders").getBusy()){
        this.getView().byId("clinicalOrders").setBusy(false); 
      }
      }.bind(this),
      error:function (oError){
        try{
          this.displayOdataError("ClinicalOrders", JSON.parse(oError.responseText).error.message.value);
        } catch {
          this.displayOdataError("NotesCategories", oError.message);
        }
      }.bind(this)
    });
   },
    /**
     * Get risk factors from service.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getRiskFactors: function () {
      this.getModel("ZISH_HCFI_SRV").read("/RiskFactorMasterDataSet", {
        success: function (oResponse) {
          this.getModel("RiskFactor").setProperty("/results", oResponse.results);
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("RiskFactorMasterDataSet", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("RiskFactorMasterDataSet", oError.message);
          }
        }.bind(this)
      });
    },

    /**
     * Get allergies from service.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getAllergies: function () {
      this.getModel("ZISH_HCFI_SRV").read("/AllergyMasterDataSet", {
        filters: [new Filter("Einri", "EQ", this.headers.Institution)],
        success: function (oResponse) {
          let results = oResponse.results.filter(i => i.IsGroup).map(function (parent) {
            parent.children = this.filter(child => child.ParentBchid === parent.Bchid && child.ParentBcpid === parent.Bcpid);
            return parent;
          }, oResponse.results).map((parent, index, list) => {
            parent.children = [...parent.children, ...list.filter(child => child.ParentBchid === parent.Bchid && child.ParentBcpid === parent.Bcpid)];
            return parent;
          }).filter(p => !p.BchidAgr && !p.BcpidAgr);
          results.unshift({
            Agr: "",
            AgrText: "",
            Bchextid: "",
            Bchid: "",
            BchidAgr: "",
            Bchname: "",
            Bcpdescription: "",
            Bcpid: "",
            BcpidAgr: "",
            Bcpname: this.getModel("i18n").getProperty("OtherAllergies"),
            BcpnameAgr: "",
            BcpnameN: "",
            Bctypename: "",
            Einri: "",
            Extid: "",
            ExtidN: "",
            IsGroup: false,
            ParentBchid: "",
            ParentBcpid: "",
            Spras: "ES",
          });
          this.getModel("Allergy").setProperty("/results", results);
          this.getModel("Allergy").setProperty("/loading", false);
          this.getPatientAllergy();
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("AllergyMasterDataSet", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("AllergyMasterDataSet", oError.message);
          }
        }.bind(this)
      });
    },
    /**
     * Get antecedents from service.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getAntecedents: function () {
      this.getBCHierarchy("ZMFH");
      this.getBCHierarchy("ZPMH");
      this.getBCHierarchy("ZPSH");
      this.getBCHierarchy("ZSHA");
    },

    /**
     * Get antecedents hierarchy from service.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getBCHierarchy: function (Bctypeid) {
      this.getModel("ZISH_HCFI_SRV").read("/CustomBCHierarchySet", {
        filters: [
          new Filter("Institution", "EQ", this.headers.Institution),
          new Filter("Bcareaid", "EQ", "ZP"),
          new Filter("Bctypeid", "EQ", Bctypeid),
        ],
        success: function (oResponse) {
          if (oResponse.results[0]) {
            const results = oResponse.results.filter(i => !i.BchidParent && !i.BcpidParent).map(function (parent) {
              parent.children = this.filter(child => child.BchidParent === parent.BchidChild && child.BcpidParent === parent.BcpidChild);
              return parent;
            }, oResponse.results).map((parent, index, list) => {
              parent.children = [...parent.children, ...list.filter(child => child.BchidParent === parent.BchidChild && child.BcpidParent === parent.BcpidChild)];
              return parent;
            });
            this.getModel("Antecedent").setSizeLimit(oResponse.results.length);
            this.getModel("Antecedent").setProperty(`/${oResponse.results[0].Bctypeid}`, results.length ? results : oResponse.results);
          }
          switch (Bctypeid) {
            case "ZMFH":
              this.getPatientFamilyHistory();
              break;
            case "ZPMH":
              this.getPatientMedicalHistory();
              break;
            case "ZPSH":
              this.getPatientSurgeryHistory();
              break;
            case "ZSHA":
              this.getPatientSocialHabits();
            break;
          }
        }.bind(this),
        error: function (oError) {

          switch(Bctypeid){
            case "ZMFH":
              this.getModel("BusyModel").setProperty("/fh", false);
              break;
            case "ZPMH":
              this.getModel("BusyModel").setProperty("/mh", false);
              break;
            case "ZPSH":
              this.getModel("BusyModel").setProperty("/sh", false);
              break;
            case "ZSHA":
              this.getModel("BusyModel").setProperty("/oh", false);
              break;
            default:
              break;
          }

          try {
            this.displayOdataError("CustomBCHierarchySet", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("CustomBCHierarchySet", oError.message);
          }
        }.bind(this)
      });
    },

    /**
     * Get key-values from service.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getFieldKeyValues: function () {
      this.getModel("ZISH_HCFI_SRV").read("/FieldKeyValueSet", {
        success: function (oResponse) {
          const fields = this.groupBy(oResponse.results, "Field");
          Object.values(fields).map(f => f.sort((a, b) => {
            if (a.Field === "MOV_FDTYPE" ||
              a.Field === "MOV_CSTRAS" ||
              a.Field === "MOV_FSTYDA")
              return 1;
            if (a.KeyValue === "") return -1;
            return a.KeyValue > b.KeyValue ? 1 : -1;
          }));
          this.getModel("KeyValue").setProperty("/", fields);
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("FieldKeyValueSet", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("FieldKeyValueSet", oError.message);
          }
        }.bind(this)
      });
    },

    /**
     * Get professional data from service.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getProfessionalData: function () {
      this.getModel("ZISH_HCFI_SRV").read("/GetProfessionalData", {
        success: function (oResponse) {
          this.getModel("ProfessionalData").setProperty("/", oResponse.GetProfessionalData);
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("GetProfessionalData", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("GetProfessionalData", oError.message);
          }
        }.bind(this)
      });
    },

    /**
     * Get catalogs from service.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getCatalog: function () {
      const movement = this.getModel("MainData").getProperty("/MovementData");
      this.getModel("MVS_VITAL_SIGNS_SRV").read("/catalogSet", {
        urlParameters: {
          caseid: this.headers.Case,
          deptunit: movement.Orgpf,
          institutionid: this.headers.Institution,
          movementid: movement.Lfdnr,
          nursunit: movement.Orgfa,
          patientid: this.headers.Patient,
        },
        success: function (oResponse) {
          const catalog = oResponse.results.filter(x => x.dataType === "N" || x.dataType === "T");
          this.createCustomTableCss(catalog);
          this.getModel("VitalSigns").setSizeLimit(1000);
          this.getModel("VitalSigns").setProperty("/catalogs/results", catalog);
          this.getConfig();
          this.getTimeFilter();
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("catalogSet", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("catalogSet", oError.message);
          }
        }.bind(this)
      });
    },

    /**
     * Get configs from the service.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getConfig: function () {
      const movement = this.getModel("MainData").getProperty("/MovementData");
      this.getModel("MVS_VITAL_SIGNS_SRV").read("/configurationSet", {
        urlParameters: {
          caseid: this.headers.Case,
          deptunit: movement.Orgpf,
          institutionid: this.headers.Institution,
          movementid: movement.Lfdnr,
          nursunit: movement.Orgfa,
          patientid: this.headers.Patient,
          $expand: "configurationToPositions"
        },
        success: function (oResponse) {
          this.getModel("Config").setProperty("/results", oResponse.results);
          const defaultConfig = oResponse.results.find(x => x.default) || oResponse.results[0];
          if (defaultConfig) this.byId("sConfigs").fireChange({ selectedItem: this.byId("sConfigs").getItemByKey(defaultConfig.id) });
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("configurationSet", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("configurationSet", oError.message);
          }
        }
      });
    },

    /**
     * Get time filter from service.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getTimeFilter: function () {
      const movement = this.getModel("MainData").getProperty("/MovementData");
      this.getModel("MVS_VITAL_SIGNS_SRV").read("/timeFilterSet", {
        urlParameters: {
          caseid: this.headers.Case,
          deptunit: movement.Orgpf,
          institutionid: this.headers.Institution,
          movementid: movement.Lfdnr,
          nursunit: movement.Orgfa,
          patientid: this.headers.Patient
        },
        success: function (oResponse) {
          const headers = this.headers;
          const cases = this.getModel("ProcessCases").getProperty("/results").map(c => c.Falnr);
          const results = oResponse.results.filter(f => f.id.indexOf(headers.Institution) === -1 || cases.find(c => f.id.indexOf(c) >= 0));
          results.forEach(i => {
            if(i.description == "Hoy"){
              i.start= new Date(new Date().setHours(0,0,0,0));
              i.end= new Date(new Date().setHours(23,59,59,59));
            }
          })
          this.getModel("TimeFilter").setProperty("/results", results);
          const defaultConfig = results.find(f => f.default) || results.find(f => f.id === headers.Institution + headers.Case) || results[0];
          this.byId("sTimeFilter").setSelectedKey(defaultConfig.id);
          if (defaultConfig) this.byId("sTimeFilter").fireChange({ selectedItem: this.byId("sTimeFilter").getItemByKey(defaultConfig.id) });
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("timeFilterSet", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("timeFilterSet", oError.message);
          }
        }
      });
    },

    /**
     * Get measured values from service.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getValues: function (update = false) {
      const movement = this.getModel("MainData").getProperty("/MovementData");
      this.getModel("MVS_VITAL_SIGNS_SRV").read("/measuredValueSet", {
        urlParameters: {
          caseid: this.headers.Case,
          deptunit: movement.Orgpf,
          institutionid: this.headers.Institution,
          movementid: movement.Lfdnr,
          nursunit: movement.Orgfa,
          patientid: this.headers.Patient
        },
        success: function (oResponse) {
          this.getModel("VitalSigns").setProperty("/values/results", oResponse.results);
          this.byId("vitalSignsTable").setBusy(false);
          this.getModel("VitalSigns").setProperty("/CAD_AETable/results", oResponse.results.map(function (v) {
            v.catalog = this.getModel("VitalSigns").getProperty("/catalogs/results").find(c => c.catalogId === v.catalogId && c.positionId === v.positionId);
            v.valueId = v.valueId.split("|")[0];
            return v;
          }, this).sort((a, b) => a.dateTime.getTime() < b.dateTime.getTime() ? 1 : -1));
          if (update) {
            this.getTimeFilter()
            const timeFilter = this.byId("sTimeFilter").getSelectedItem().getBindingContext("TimeFilter").getObject();
            this.addTableColumns(this.byId("cbVitalSigns").getSelectedItems().map(x => x.getAdditionalText()), [timeFilter.start, timeFilter.end]);
          }
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("measuredValueSet", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("measuredValueSet", oError.message);
          }
        }
      });
    },

    /**
     * Get summary from service.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getSummary: function () {
      this.getModel("ISH_PAT_SUMM_SRV").read("/summarySet", {
        urlParameters: {
          institutionId: this.headers.Institution,
          patientId: this.headers.Patient,
          caseId: this.headers.Case
        },
        success: this.getSummarySuccess.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("summarySet", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("summarySet", oError.message);
          }
          this.byId("Timeline").setBusy(false);
          this.byId("Summary").setBusy(false);
        }.bind(this)
      });
    },

    /**
     * Create filter values.
     * @param {Object} oResponse Response from service
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getSummarySuccess: function (oResponse) {
      const summaryResults = oResponse.results.map(function (x) {
        x.typeText = this.getModel("SummaryType").getProperty("/results").filter(y => x.type === y.type)[0].description;
        return x;
      }.bind(this));
      this.getModel("Summary").setProperty("/results", summaryResults);
      this.byId("Timeline").setBusy(false);
      this.byId("Summary").setBusy(false);
      const typesReducedResults = oResponse.results.filter((item, pos, array) => array.map(mapItem => mapItem.type).indexOf(item.type) === pos).map(mapItem => {
        return { type: mapItem.type };
      });
      this.getModel("TypesReduced").setProperty("/results", typesReducedResults);
      const documentationUnitsReducedResults = oResponse.results.filter((item, pos, array) => array.map(mapItem => mapItem.documentationUnit).indexOf(item.documentationUnit) === pos).map(mapItem => {
        return { unit: mapItem.documentationUnit };
      });
      this.getModel("DocumentationUnitsReduced").setProperty("/results", documentationUnitsReducedResults);
      const responsiblesReducedResults = oResponse.results.filter((item, pos, array) => array.map(mapItem => mapItem.responsible).indexOf(item.responsible) === pos).map((mapItem) => {
        return { responsible: mapItem.responsible };
      });
      this.getModel("ResponsiblesReduced").setProperty("/results", responsiblesReducedResults);
      const responsiblesGroupReducedResults = oResponse.results.filter((item, pos, array) => array.map(mapItem => mapItem.responsibleGroup).indexOf(item.responsibleGroup) === pos).map((mapItem) => {
        return { responsibleGroup: mapItem.responsibleGroup };
      });
      this.getModel("ResponsiblesGroupReduced").setProperty("/results",responsiblesGroupReducedResults);
    },

    /**
     * Get summary types from service.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getSummaryTypes: function () {
      this.getModel("ISH_PAT_SUMM_SRV").read("/summaryTypeSet", {
        success: function (oResponse) {
          this.getModel("SummaryType").setProperty("/results", oResponse.results);
          this.getSummary();
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("summaryTypeSet", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("summaryTypeSet", oError.message);
          }
        }.bind(this)
      });
    },

    /**
     * Get allowed PMD from service.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getAllowedPMD: function () {
      this.getModel("ZISH_HCFI_SRV").read("/AllowedPMDSet", {
        filters: [
          new Filter("Einri", "EQ", this.headers.Institution),
          new Filter("Case", "EQ", this.headers.Case)
        ],
        success: function (oResponse) {
          this.getModel("AllowedPMD").setProperty("/results", oResponse.results.sort(function(a, b){
            if(a.Dtid < b.Dtid) { return -1; }
            if(a.Dtid > b.Dtid) { return 1; }
            return 0;
        }));
          oResponse.results.forEach(pmd => {
            this.byId("IconTabBar").setBusy(false);
            this.byId(pmd.Dtid).setText(pmd.Dkbez);
            try {
              this.byId(pmd.Dtid).getContent()[0].getHeaderTitle().getExpandedHeading().setText(pmd.Dkbez);
            } catch { }
            this.getDocumentForFill(pmd.Dtid, pmd.Dtvers);
          }, this);
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("AllowedPMDSet", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("AllowedPMDSet", oError.message);
          }
        }.bind(this)
      });
    },

    /**
     * Get patient allergies from service.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getPatientAllergy: function () {

      this.getModel("BusyModel").setProperty("/al", true);

      this.getModel("ZISH_HCFI_SRV").read("/AllergySet", {
        urlParameters: {
          "$expand": "reactions"
        },
        filters: [new Filter("Patnr", "EQ", this.headers.Patient)],
        success: function (oResponse) {
          oResponse.results.map(function (pa) {
            pa.parent = this.getModel("Allergy").getProperty("/results").find(a => a.Bchid === pa.BchidAgr && a.Bcpid === pa.BcpidAgr);
            return pa;
          }, this);
          this.getModel("PatientAllergy").setProperty("/results", oResponse.results);
          this.getModel("BusyModel").setProperty("/al", false);
        }.bind(this),
        error: function (oError) {
          this.getModel("BusyModel").setProperty("/al", false);
          try {
            this.displayOdataError("AllergySet", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("AllergySet", oError.message);
          }
        }.bind(this)
      });
    },

    /**
     * Get patient risk factors from service.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getPatientRiskFactor: function () {
      this.getModel("BusyModel").setProperty("/rf", true);
      this.getModel("ZISH_HCFI_SRV").read("/RiskFactorSet", {
        filters: [new Filter("Patnr", "EQ", this.headers.Patient)],
        success: function (oResponse) {
          this.getModel("BusyModel").setProperty("/rf", false);
          this.getModel("PatientRiskFactor").setProperty("/results", oResponse.results);          
        }.bind(this),
        error: function (oError) {
          this.getModel("BusyModel").setProperty("/rf", false);
          try {
            this.displayOdataError("RiskFactorSet", JSON.parse(oError.responseText).error.message.value);            
          } catch {
            this.displayOdataError("RiskFactorSet", oError.message);
          }
        }.bind(this)
      });
    },

    /**
     * Get patient medical history from service.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getPatientMedicalHistory: function () {
      this.getModel("BusyModel").setProperty("/mh", true);
      this.getModel("ZISH_HCFI_SRV").read("/MedicalHistorySet", {
        filters: [new Filter("Patnr", "EQ", this.headers.Patient)],
        success: function (oResponse) {
          this.getModel("BusyModel").setProperty("/mh", false);
          oResponse.results.map(function (pmh) {
            this.getModel("Antecedent").getProperty("/ZPMH").forEach(mh => {
              if (mh.children.find(sh => sh.BchidChild === pmh.Bchid && sh.BcpidChild === pmh.Bcpid)) {
                var zpmh = mh.children.find(sh => sh.BchidChild === pmh.Bchid && sh.BcpidChild === pmh.Bcpid);
                pmh.ZPMH = zpmh ? zpmh : pmh.ZPMH;
              } else if (mh.BchidChild === pmh.Bchid && mh.BcpidChild === pmh.Bcpid) {
                var zpmh = mh
                pmh.ZPMH = zpmh ? zpmh : pmh.ZPMH;
              }
            });
            return pmh;
          }, this);
          this.getModel("PatientMedicalHistory").setProperty("/results", oResponse.results.map(pmh => {
            if (pmh.MedHistguid == undefined) { pmh.MedHistguid = pmh.MedHistid.toString() };
            pmh.MedHistid = pmh.MedHistid.replaceAll("-", "").toUpperCase();
            return pmh;
          }));          
        }.bind(this),
        error: function (oError) {
          this.getModel("BusyModel").setProperty("/mh", false);
          try {
            this.displayOdataError("MedicalHistorySet", JSON.parse(oError.responseText).error.message.value);            
          } catch {
            this.displayOdataError("MedicalHistorySet", oError.message);
          }
        }.bind(this)
      });
    },

    /**
     * Get patient surgery history from service.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getPatientSurgeryHistory: function () {
      this.getModel("BusyModel").setProperty("/sh", true);
      this.getModel("ZISH_HCFI_SRV").read("/SurgeryHistorySet", {
        filters: [new Filter("Patnr", "EQ", this.headers.Patient)],
        success: function (oResponse) {
          this.getModel("BusyModel").setProperty("/sh", false);
          oResponse.results.map(function (psh) {
            psh.ZPSH = this.getModel("Antecedent").getProperty("/ZPSH").find(sh => sh.BchidChild === psh.Bchid && sh.BcpidChild === psh.Bcpid);
            return psh;
          }, this);
          this.getModel("PatientSurgeryHistory").setProperty("/results", oResponse.results.map(psh => {
            if(psh.SurgHistguid == undefined) 
            psh.SurgHistguid = psh.SurgHistid;
            psh.SurgHistid = psh.SurgHistid.replaceAll("-", "").toUpperCase();
            return psh;
          }));         
        }.bind(this),
        error: function (oError) {
          this.getModel("BusyModel").setProperty("/sh", false);
          try {
            this.displayOdataError("SurgeryHistorySet", JSON.parse(oError.responseText).error.message.value);            
          } catch {
            this.displayOdataError("SurgeryHistorySet", oError.message);
          }
        }.bind(this)
      });
    },

    /**
     * Get patient family history from service.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getPatientFamilyHistory: function () {
      this.getModel("BusyModel").setProperty("/fh", true);
      this.getModel("ZISH_HCFI_SRV").read("/FamilyHistorySet", {
        filters: [new Filter("Patnr", "EQ", this.headers.Patient)],
        success: function (oResponse) {
          this.getModel("BusyModel").setProperty("/fh", false);
          oResponse.results.map(function (pfh) {
            this.getModel("Antecedent").getProperty("/ZMFH").forEach(fh => {
              if (fh.children.find(children => children.BchidChild === pfh.Bchid && children.BcpidChild === pfh.Bcpid)) {
                var zmfh = fh.children.find(children => children.BchidChild === pfh.Bchid && children.BcpidChild === pfh.Bcpid);
                pfh.ZMFH = zmfh ? zmfh : pfh.ZMFH;
              } else if (fh.BchidChild === pfh.Bchid && fh.BcpidChild === pfh.Bcpid) {
                var zmfh = fh;
                pfh.ZMFH = zmfh ? zmfh : pfh.ZMFH;
              }

            });
            return pfh;
          }, this);
          this.getModel("PatientFamilyHistory").setProperty("/results", oResponse.results.map(pfh => {
            if(pfh.FamilyHistguid == undefined) 
            pfh.FamilyHistguid = pfh.FamilyHistid
            pfh.FamilyHistid = pfh.FamilyHistid.replaceAll("-", "").toUpperCase();
            return pfh;
          }));          
        }.bind(this),
        error: function (oError) {
          this.getModel("BusyModel").setProperty("/fh", false);
          try {
            this.displayOdataError("FamilyHistorySet", JSON.parse(oError.responseText).error.message.value);           
          } catch {
            this.displayOdataError("FamilyHistorySet", oError.message);
          }
        }.bind(this)
      });
    },

    getPatientSocialHabits: function () {
      this.getModel("BusyModel").setProperty("/oh", true);
      this.getModel("ZISH_HCFI_SRV").read("/HabitSet", {
        filters: [new Filter("Patient", "EQ", this.headers.Patient)],
        success: function (oResponse) {  
          this.getModel("BusyModel").setProperty("/oh", false);        
          this.getModel("PatientSocialHabitsHistory").setProperty("/results", oResponse.results);          
        }.bind(this),
        error: function (oError) {
          this.getModel("BusyModel").setProperty("/oh", false);
          try {
            this.displayOdataError("SocialHabitSet", JSON.parse(oError.responseText).error.message.value);           
          } catch {
            this.displayOdataError("SocialHabitSet", oError.message);
          }
        }.bind(this)
      });
    },

    /**
     * Get documents for fill from service.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getDocumentForFill: function (dtid, dtvers) {
      const header = this.byId(dtid).getContent()[0];
      const layout = this.byId(dtid).getContent()[1] ? this.byId(dtid).getContent()[1] : this.byId(dtid).getContent()[0];
      this.getModel("ZISH_HCFI_SRV").callFunction("/GetDocumentForFill", {
        urlParameters: {
          Institution: this.headers.Institution,
          Case: this.headers.Case,
          Patient: this.headers.Patient,
          Dtid: dtid,
          Dtvers: dtvers,
        },
        success: function (oResponse) {
          const doc = this.getModel("Documents").getProperty("/results").find(d => d.RN2DOCDATA.Dokar === oResponse.Dokar && parseInt(d.RN2DOCDATA.Doknr) === parseInt(oResponse.Doknr) && d.RN2DOCDATA.Dokvr === oResponse.Dokvr && d.RN2DOCDATA.Doktl === oResponse.Doktl);
          if (oResponse.Doknr !== "9999999999999999999999999") {
            try {
              header.getHeaderTitle().getExpandedContent()[0].setText(doc && doc.StatusText ? doc.StatusText : this.getModel("i18n").getProperty("New"));
            } catch { }
            this.getDocument(oResponse);
          } else {
            try {
              header.getHeaderTitle().getExpandedContent()[0].setText(this.getModel("i18n").getProperty("New"));
            } catch { }
            oResponse.RiskFactors = [];
            oResponse.Allergies = [];
            oResponse.SurgicalAntecedents = [];
            oResponse.MedicalAntecedents = [];
            oResponse.FamilyAntecedents = [];
            oResponse.Signs = [];
            oResponse.VitalSignsExamTable = [];
            oResponse.Services = [];
            oResponse.Diagnoses = [];
            oResponse.FirstTrimester = [];
            oResponse.SexT2 = [];
            oResponse.SexT3 = [];
            oResponse.SecondTrimester = [];
            oResponse.ThirdTrimester = [];
            oResponse.Monitors = [];
            oResponse.Births = [];
            oResponse.AfterbirthReview = [];
            oResponse.content = this.getModel(oResponse.Dtid).getProperty("/content");
            if (oResponse.content) Object.values(oResponse.content).map(c => {
              c.Dokar = oResponse.Dokar;
              c.Doknr = oResponse.Doknr;
              c.Doktl = oResponse.Doktl;
              c.Dokvr = oResponse.Dokvr;
              return c;
            });
            this.getModel(oResponse.Dtid).setProperty("/", oResponse);
            this.createNewDocument(oResponse.Dtid);
            this.prefillDefaultData(oResponse);
            try {

              header.setBusy(false).getHeaderTitle().getActions().forEach(button => {
                button.setEnabled(true);
              });
              layout.setBusy(false);
            } catch { }
          }
        }.bind(this),
        error: function () {
          try {
            header.setBusy(false).getHeaderTitle().getExpandedContent()[0].setText(this.getModel("i18n").getProperty("New"));
            layout.setBusy(false);
          } catch { }
          // this.displayOdataError("GetDocumentForFill", JSON.parse(oError.responseText).error.message.value);
        }.bind(this)
      });
    },

    /**
     * Get document from service.
     * @param {Object} document Document initial data
     * @memberOf com.resulto.hcfi.controller.Main
     */
    getDocument: function (document) {
      this.getModel("ZISH_HCFI_SRV").read(`/DocumentSet(Dokar='${document.Dokar}',Doknr='${document.Doknr}',Dokvr='${document.Dokvr}',Doktl='${document.Doktl}')`, {
        urlParameters: { $expand: "content" },
        success: function (oResponse) {
          this.getModel(oResponse.Dtid).setProperty("/", oResponse);

          if (oResponse.Dtid === "CAD_AE") {
            let fasst = oResponse.content.results.find(x => x.Alias === 'ORD_FASST');
            let opc = oResponse.content.results.find(x => x.Alias === 'ORD_OPC');

            if (fasst?.Value === "" && opc?.Value !== undefined && opc?.Value !== "") {
              fasst.Value = opc.Value;
            }
          }

          this.getModel(oResponse.Dtid).setProperty("/content", this.groupBy(oResponse.content.results, "Alias"));
          this.createAntecedentsTab(oResponse.Dtid, oResponse.content);
          this.createVitalSignsExamTab(oResponse.Dtid, oResponse.content);
          this.createServicesTab(oResponse.Dtid, oResponse.content);
          this.createDiagnosesProceduresTab(oResponse.Dtid, oResponse.content);
          this.createDischargeTab(oResponse.Dtid, oResponse.content);
          this.createCAD_GINEView(oResponse.Dtid, oResponse.content);
          this.createCAD_MAMView(oResponse.Dtid, oResponse.content);
          this.createCAD_CTREMBView(oResponse.Dtid, oResponse.content);
          this.setRadioButtomSelectedIndex();
          this.byId(oResponse.Dtid).getContent()[0].setBusy(false).getHeaderTitle().getActions().forEach(button => {
            button.setEnabled(true);
          });
          
          try { this.byId(oResponse.Dtid).getContent()[1].setBusy(false); } catch { }
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("DocumentSet", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("DocumentSet", oError.message);
          }
        }.bind(this)
      });
    },

    getPatientProcesses: function () {
      this.getModel("ZISH_HCFI_SRV").callFunction("/GetPatientProcesses", {
        urlParameters: {
          Institution: this.headers.Institution,
          Patient: this.headers.Patient
        },
        success: function (oResponse) {
          this.getModel("PatientProcess").setProperty("/results", oResponse.results);
          this.getModel("PatientProcess").setProperty("/loading", false);
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("GetPatientProcesses", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("GetPatientProcesses", oError.message);
          }
        }.bind(this)
      });
    },

    /**
     * Fix data to display it in controls.
     * @param {string} model Model name
     * @param {Object} content Document content
     * @memberOf com.resulto.hcfi.controller.Main
     */
    createAntecedentsTab: function (model, content) {
      if (content.MOV_FFEING) content.MOV_FFEING.Value = `${content.MOV_FFEING.Value.substr(6, 2)}.${content.MOV_FFEING.Value.substr(4, 2)}.${content.MOV_FFEING.Value.substr(0, 4)}`;
      if (content.MOV_FHRING) content.MOV_FHRING.Value = `${content.MOV_FHRING.Value.substr(0, 2)}:${content.MOV_FHRING.Value.substr(2, 2)}:${content.MOV_FHRING.Value.substr(4, 2)}`;
      // Risk Factors
      const riskFactors = [];
      if (content.PAT_FRFDSC) content.PAT_FRFDSC.forEach((v, i) => {
        riskFactors[i] = {};
        riskFactors[i][v.Alias] = v.Value;
      });
      if (content.PAT_FRFCOD) content.PAT_FRFCOD.forEach((v, i) => riskFactors[i][v.Alias] = v.Value);
      if (content.PAT_FRFCOM) content.PAT_FRFCOM.forEach((v, i) => riskFactors[i][v.Alias] = v.Value);
      if (content.PAT_FRFID) content.PAT_FRFID.forEach((v, i) => riskFactors[i][v.Alias] = v.Value);
      this.getModel(model).setProperty("/RiskFactors", riskFactors);
      // Allergies
      const allergies = [];
      // if(this.getView().getModel(model).getData().content.PAT_FALLST != undefined){
      //   if(this.getView().getModel(model).getData().content.PAT_FALLST.Value != "Ninguna alergia"){
          if (content.PAT_FALLGR) content.PAT_FALLGR.forEach((v, i) => {
            allergies[i] = {};
            allergies[i][v.Alias] = v.Value;
          });
          if (content.PAT_FALLDS) content.PAT_FALLDS.forEach((v, i) => allergies[i][v.Alias] = v.Value);
          if (content.PAT_FALLID) content.PAT_FALLID.forEach((v, i) => allergies[i][v.Alias] = v.Value);
          if (content.PAT_FALLRA) content.PAT_FALLRA.forEach((v, i) => allergies[i][v.Alias] = v.Value);
          if (content.PAT_FALLSE) content.PAT_FALLSE.forEach((v, i) => allergies[i][v.Alias] = v.Value);
          if (content.PAT_FALLTY) content.PAT_FALLTY.forEach((v, i) => allergies[i][v.Alias] = v.Value);
          if (content.PAT_FALLCE) content.PAT_FALLCE.forEach((v, i) => allergies[i][v.Alias] = v.Value);
          if (content.PAT_FALLVA) content.PAT_FALLVA.forEach((v, i) => allergies[i][v.Alias] = v.Value);
          if (content.PAT_FALLOB) content.PAT_FALLOB.forEach((v, i) => allergies[i][v.Alias] = v.Value);
          this.getModel(model).setProperty("/Allergies", allergies);
        // }else{
        //   var allergy = [({
        //     PAT_FALLDS: "No refiere",
        //     PAT_FALLGR: "",
        //     PAT_FALLID: "00000",
        //     PAT_FALLRA: "",
        //     PAT_FALLSE: "",
        //     PAT_FALLTY: "",
        //   })];
        //   this.getModel(model).setProperty("/Allergies" , allergy)
        // }
      // }

      // Surgical Antecedents
      const surgicalAntecedents = [];
      if (content.PAT_FSURNA) content.PAT_FSURNA.forEach((v, i) => {
        surgicalAntecedents[i] = {};
        surgicalAntecedents[i][v.Alias] = v.Value;
      });
      if (content.PAT_FSURDT) content.PAT_FSURDT.forEach((v, i) => {
        if (v.Value != "00000000")
          surgicalAntecedents[i][v.Alias] = new Date(v.Value.substr(0, 4), v.Value.substr(4, 2) - 1, v.Value.substr(6, 2))
      });
      if (content.PAT_FSURRM) content.PAT_FSURRM.forEach((v, i) => surgicalAntecedents[i][v.Alias] = v.Value);
      if (content.PAT_FSURAN) content.PAT_FSURAN.forEach((v, i) => surgicalAntecedents[i][v.Alias] = v.Value);
      if (content.PAT_FSURID) content.PAT_FSURID.forEach((v, i) => surgicalAntecedents[i][v.Alias] = v.Value);
      if (content.PAT_FSURCM) content.PAT_FSURCM.forEach((v, i) => surgicalAntecedents[i][v.Alias] = v.Value);

      this.getModel(model).setProperty("/SurgicalAntecedents", surgicalAntecedents);

      // Medical Antecedents
      const medicalAntecedents = [];
      if (content.PAT_FDISNA) content.PAT_FDISNA.forEach((v, i) => {
        medicalAntecedents[i] = {};
        medicalAntecedents[i][v.Alias] = v.Value;
      });
      if (content.PAT_FDISDA) content.PAT_FDISDA.forEach((v, i) => {
        if (v.Value != "00000000")
          medicalAntecedents[i][v.Alias] = new Date(v.Value.substr(0, 4), v.Value.substr(4, 2) - 1, v.Value.substr(6, 2))
      });
      if (content.PAT_FDISTR) content.PAT_FDISTR.forEach((v, i) => medicalAntecedents[i][v.Alias] = v.Value);
      if (content.PAT_FDISRM) content.PAT_FDISRM.forEach((v, i) => medicalAntecedents[i][v.Alias] = v.Value);
      if (content.PAT_FDISID) content.PAT_FDISID.forEach((v, i) => medicalAntecedents[i][v.Alias] = v.Value);
      if (content.PAT_FDISCM) content.PAT_FDISCM.forEach((v, i) => medicalAntecedents[i][v.Alias] = v.Value);
      this.getModel(model).setProperty("/MedicalAntecedents", medicalAntecedents);

      // Family Antecedents
      const familyAntecedents = [];
      if (content.PAT_FFHNAM) content.PAT_FFHNAM.forEach((v, i) => {
        familyAntecedents[i] = {};
        familyAntecedents[i][v.Alias] = v.Value;
      });
      if (content.PAT_FFHID) content.PAT_FFHID.forEach((v, i) => familyAntecedents[i][v.Alias] = v.Value);
      if (content.PAT_FRFAT) content.PAT_FRFAT.forEach((v, i) => familyAntecedents[i][v.Alias] = v.Value === "X");
      if (content.PAT_FRMOM) content.PAT_FRMOM.forEach((v, i) => familyAntecedents[i][v.Alias] = v.Value === "X");
      if (content.PAT_FRBRO) content.PAT_FRBRO.forEach((v, i) => familyAntecedents[i][v.Alias] = v.Value === "X");
      if (content.PAT_FRSIS) content.PAT_FRSIS.forEach((v, i) => familyAntecedents[i][v.Alias] = v.Value === "X");
      if (content.PAT_FRGRA) content.PAT_FRGRA.forEach((v, i) => familyAntecedents[i][v.Alias] = v.Value === "X");
      if (content.PAT_FRPAGP) content.PAT_FRPAGP.forEach((v, i) => familyAntecedents[i][v.Alias] = v.Value === "X");
      if (content.PAT_FRMAGP) content.PAT_FRMAGP.forEach((v, i) => familyAntecedents[i][v.Alias] = v.Value === "X");
      if (content.PAT_FRSON) content.PAT_FRSON.forEach((v, i) => familyAntecedents[i][v.Alias] = v.Value === "X");
      if (content.PAT_FFHRMK) content.PAT_FFHRMK.forEach((v, i) => familyAntecedents[i][v.Alias] = v.Value);
      if (content.PAT_FRSIB) content.PAT_FRSIB.forEach((v, i) => familyAntecedents[i][v.Alias] = v.Value);
      if (content.PAT_FFHROB) content.PAT_FFHROB.forEach((v, i) => familyAntecedents[i][v.Alias] = v.Value);
      this.getModel(model).setProperty("/FamilyAntecedents", familyAntecedents);
      // Social Habits
      const socialHabits = [];
      if (content.P_HABIT_ID) content.P_HABIT_ID.forEach((v, i) => {
        socialHabits[i] = {};
        socialHabits[i][v.Alias] = v.Value;
      });
      if (content.P_HABIT_D) content.P_HABIT_D.forEach((v, i) => socialHabits[i][v.Alias] = v.Value);
      this.getModel(model).setProperty("/SocialHabits", socialHabits);

      this.fillDocumentHistoryModel(model);
    },

    /**
     * Fix data to display it in controls.
     * @param {string} model Model name
     * @param {Object} content Document content
     * @memberOf com.resulto.hcfi.controller.Main
     */
    createVitalSignsExamTab: function (model, content) {
      const vitalSignsExamTable = [];
      if (content.CLI_FVSDSC) content.CLI_FVSDSC.forEach((v, i) => {
        vitalSignsExamTable[i] = {};
        vitalSignsExamTable[i][v.Alias] = v.Value;
      });
      if (content.CLI_FVSID) content.CLI_FVSID.forEach((v, i) => vitalSignsExamTable[i][v.Alias] = v.Value);
      if (content.CLI_FVSVAL) content.CLI_FVSVAL.forEach((v, i) => vitalSignsExamTable[i][v.Alias] = v.Value);
      if (content.CLI_FVSNRA) content.CLI_FVSNRA.forEach((v, i) => vitalSignsExamTable[i][v.Alias] = v.Value);
      if (content.CLI_FVSUNI) content.CLI_FVSUNI.forEach((v, i) => vitalSignsExamTable[i][v.Alias] = v.Value);
      if (content.CLI_FVSTIM) content.CLI_FVSTIM.forEach((v, i) => vitalSignsExamTable[i][v.Alias] = v.Value);
      this.getModel(model).setProperty("/VitalSignsExamTable", vitalSignsExamTable);
    },

    createServicesTab: function (model, content) {
      const services = [];
      if (content.ORD_FASSCD) content.ORD_FASSCD.forEach((v, i) => {
        services[i] = {};
        services[i][v.Alias] = `${v.Value.substr(6, 2)}.${v.Value.substr(4, 2)}.${v.Value.substr(0, 4)}`;
      });
      if (content.SRV_FIDPSR) content.SRV_FIDPSR.forEach((v, i) => services[i][v.Alias] = v.Value);
      if (content.ORD_FASSD) content.ORD_FASSD.forEach((v, i) => services[i][v.Alias] = v.Value);
      if (content.PMD_FREST) content.PMD_FREST.forEach((v, i) => services[i][v.Alias] = v.Value);
      if (content.ORD_FERNAM) content.ORD_FERNAM.forEach((v, i) => services[i][v.Alias] = v.Value);


      this.getModel(model).setProperty("/Services", services);
    },

    /**
     * Fix data to display it in controls.
     * @param {string} model Model name
     * @param {Object} content Document content
     * @memberOf com.resulto.hcfi.controller.Main
     */
    createDiagnosesProceduresTab: function (model, content) {
      const diagnoses = [];
      if (content.PAT_FDIAD) content.PAT_FDIAD.forEach((v, i) => {
        diagnoses[i] = {};
        diagnoses[i][v.Alias] = v.Value;
      });
      if (content.PAT_FDIACO) content.PAT_FDIACO.forEach((v, i) => diagnoses[i][v.Alias] = v.Value);
      if (content.PAT_FDIACT) content.PAT_FDIACT.forEach((v, i) => diagnoses[i][v.Alias] = v.Value);
      if (content.PAT_FDIAFT) content.PAT_FDIAFT.forEach((v, i) => diagnoses[i][v.Alias] = v.Value);
      if (content.PAT_FDIAID) content.PAT_FDIAID.forEach((v, i) => diagnoses[i][v.Alias] = v.Value);
      if (content.PAT_FDIAO) content.PAT_FDIAO.forEach((v, i) => diagnoses[i][v.Alias] = v.Value);
      this.getModel(model).setProperty("/Diagnoses", diagnoses);
    },

    /**
     * Fix data to display it in controls.
     * @param {string} model Model name
     * @param {Object} content Document content
     * @memberOf com.resulto.hcfi.controller.Main
     */
    createDischargeTab: function (model, content) {
      const signs = [];
      if (content.PMD_FERNUM) content.PMD_FERNUM.forEach((v, i) => {
        signs[i] = {};
        signs[i][v.Alias] = v.Value;
      });
      if (content.PMD_FERNAM) content.PMD_FERNAM.forEach((v, i) => signs[i][v.Alias] = v.Value);
      if (content.PMD_FERMLN) content.PMD_FERMLN.forEach((v, i) => signs[i][v.Alias] = v.Value);
      this.getModel(model).setProperty("/Signs", signs);
      const documents = [];
      if (content.PMD_FDOCV) content.PMD_FDOCV.forEach((v, i) => {
        documents[i] = {};
        documents[i][v.Alias] = v.Value;
      });
      if (content.PMD_FDCVRD) content.PMD_FDCVRD.forEach((v, i) => documents[i][v.Alias] = v.Value);
      if (content.PMD_FDCVRT) content.PMD_FDCVRT.forEach((v, i) => documents[i][v.Alias] = v.Value);
      if (content.PMD_FDOCER) content.PMD_FDOCER.forEach((v, i) => documents[i][v.Alias] = v.Value);
      this.getModel(model).setProperty("/Documents", documents);
    },

    /**
     * Fix data to display it in controls.
     * @param {string} model Model name
     * @param {Object} content Document content
     * @memberOf com.resulto.hcfi.controller.Main
     */
    createCAD_GINEView: function (model, content) {
      ["FUR_GIN", "ECO_DAT"].forEach(key => {
        if (content[key]) content[key].Value = content[key].Value !== "00000000" ? `${content[key].Value.substr(6, 2)}.${content[key].Value.substr(4, 2)}.${content[key].Value.substr(0, 4)}` : "";
      });
      const reports = [];
      if (content.GINE_INFOR) content.GINE_INFOR.forEach((v, i) => {
        reports[i] = {};
        reports[i][v.Alias] = v.Value;
      });
      if (content.DIA_INFORM) content.DIA_INFORM.forEach((v, i) => reports[i][v.Alias] = v.Value !== "00000000" ? `${v.Value.substr(6, 2)}.${v.Value.substr(4, 2)}.${v.Value.substr(0, 4)}` : "");
      if (content.VIA_GINE) content.VIA_GINE.forEach((v, i) => reports[i][v.Alias] = v.Value);
      if (content.PROF_GINE) content.PROF_GINE.forEach((v, i) => reports[i][v.Alias] = v.Value);
      if (content.ENTR_INF) content.ENTR_INF.forEach((v, i) => reports[i][v.Alias] = v.Value);
      if (content.VIA_GINE2) content.VIA_GINE2.forEach((v, i) => reports[i][v.Alias] = v.Value);
      if (content.DIA_INFOR2) content.DIA_INFOR2.forEach((v, i) => reports[i][v.Alias] = v.Value !== "00000000" ? `${v.Value.substr(6, 2)}.${v.Value.substr(4, 2)}.${v.Value.substr(0, 4)}` : "");
      if (content.DIAG_GIN) this.byId("DIAG_GIN").setValue(content.DIAG_GIN.Value);
      if (content.DERIV_GIN) this.byId("DERIV_GIN").setValue(content.DERIV_GIN.Value);
      this.getModel(model).setProperty("/Reports", reports);
    },

    /**
     * Fix data to display it in controls.
     * @param {string} model Model name
     * @param {Object} content Document content
     * @memberOf com.resulto.hcfi.controller.Main
     */
    createCAD_MAMView: function (model, content) {
      ["FUR_MAM"].forEach(key => {
        if (content[key]) content[key].Value = content[key].Value !== "00000000" ? `${content[key].Value.substr(6, 2)}.${content[key].Value.substr(4, 2)}.${content[key].Value.substr(0, 4)}` : "";
      });
      const reports = [];
      if (content.GINE_INFOR) content.GINE_INFOR.forEach((v, i) => {
        reports[i] = {};
        reports[i][v.Alias] = v.Value;
      });
      if (content.DIA_INFORM) content.DIA_INFORM.forEach((v, i) => reports[i][v.Alias] = v.Value !== "00000000" ? `${v.Value.substr(6, 2)}.${v.Value.substr(4, 2)}.${v.Value.substr(0, 4)}` : "");
      if (content.VIA_GINE) content.VIA_GINE.forEach((v, i) => reports[i][v.Alias] = v.Value);
      if (content.PROF_GINE) content.PROF_GINE.forEach((v, i) => reports[i][v.Alias] = v.Value);
      if (content.ENTR_INF) content.ENTR_INF.forEach((v, i) => reports[i][v.Alias] = v.Value);
      if (content.VIA_GINE2) content.VIA_GINE2.forEach((v, i) => reports[i][v.Alias] = v.Value);
      if (content.DIA_INFOR2) content.DIA_INFOR2.forEach((v, i) => reports[i][v.Alias] = v.Value !== "00000000" ? `${v.Value.substr(6, 2)}.${v.Value.substr(4, 2)}.${v.Value.substr(0, 4)}` : "");

      this.getModel(model).setProperty("/Reports", reports);
    },

    /**
     * Fix data to display it in controls.
     * @param {string} model Model name
     * @param {Object} content Document content
     * @memberOf com.resulto.hcfi.controller.Main
     */
    createCAD_CTREMBView: function (model, content) {

      if (model !== 'CAD_CTREMB') return;

      // General Data
      [
        "EMB_CTRFPP", "EMB_CTRFUR", "EMB_FURCOR", "PARTOFECHA", "PAT_FADM", "PAT_FDOB", "MOV_FDATDI",
      ].forEach(key => {
        if (content[key]) content[key].Value = content[key].Value !== "00000000" ? `${content[key].Value.substr(6, 2)}.${content[key].Value.substr(4, 2)}.${content[key].Value.substr(0, 4)}` : "";
      });

      [
        "MOV_FTIMDI",
      ].forEach(key => {
        if (content[key]) content[key].Value = content[key].Value !== "000000" ? `${content[key].Value.substr(0, 5)}` : "";
      });

      // First Trimester
      const firstTrimester = [];
      if (content.CTRECOID) content.CTRECOID.forEach((v, i) => {
        firstTrimester[i] = {};
        firstTrimester[i][v.Alias] = v.Value;
      });
      if (content.X02_EMBID) content.X02_EMBID.forEach((v, i) => firstTrimester[i][v.Alias] = v.Value);
      if (content.CTRECOFECH) content.CTRECOFECH.forEach((v, i) => firstTrimester[i][v.Alias] = v.Value !== "00000000" ? `${v.Value.substr(6, 2)}.${v.Value.substr(4, 2)}.${v.Value.substr(0, 4)}` : "");
      if (content.EGSEMANAS) content.EGSEMANAS.forEach((v, i) => firstTrimester[i][v.Alias] = v.Value);
      if (content.EGDIAS) content.EGDIAS.forEach((v, i) => firstTrimester[i][v.Alias] = v.Value);
      if (content.CTRECOTA) content.CTRECOTA.forEach((v, i) => firstTrimester[i][v.Alias] = v.Value);
      if (content.CTRECOKG) content.CTRECOKG.forEach((v, i) => firstTrimester[i][v.Alias] = v.Value);
      if (content.CTRECOCOM) content.CTRECOCOM.forEach((v, i) => firstTrimester[i][v.Alias] = v.Value);
      if (content.CTRECOTROB) content.CTRECOTROB.forEach((v, i) => firstTrimester[i][v.Alias] = v.Value);
      if (content.CREATED_BY) content.CREATED_BY.forEach((v, i) => firstTrimester[i][v.Alias] = v.Value);
      this.getModel(model).setProperty("/FirstTrimester", firstTrimester);
      // Second Trimester
      const secondTrimester = [];
      if (content.X00ECOID) content.X00ECOID.forEach((v, i) => {
        secondTrimester[i] = {};
        secondTrimester[i][v.Alias] = v.Value;
      });
      if (content.X03_EMBID) content.X03_EMBID.forEach((v, i) => secondTrimester[i][v.Alias] = v.Value);
      if (content.X00ECOFECH) content.X00ECOFECH.forEach((v, i) => secondTrimester[i][v.Alias] = v.Value !== "00000000" ? `${v.Value.substr(6, 2)}.${v.Value.substr(4, 2)}.${v.Value.substr(0, 4)}` : "");
      if (content.X00EMANAS) content.X00EMANAS.forEach((v, i) => secondTrimester[i][v.Alias] = v.Value);
      if (content.X00IAS) content.X00IAS.forEach((v, i) => secondTrimester[i][v.Alias] = v.Value);
      if (content.X00ECOTA) content.X00ECOTA.forEach((v, i) => secondTrimester[i][v.Alias] = v.Value);
      if (content.X00ECOKG) content.X00ECOKG.forEach((v, i) => secondTrimester[i][v.Alias] = v.Value);
      if (content.X00ECOTROB) content.X00ECOTROB.forEach((v, i) => secondTrimester[i][v.Alias] = v.Value);
      if (content.X00ATED_BY) content.X00ATED_BY.forEach((v, i) => secondTrimester[i][v.Alias] = v.Value);
      if (content.CTRECOPRES) content.CTRECOPRES.forEach((v, i) => secondTrimester[i][v.Alias] = v.Value);
      if (content.CTRECOFC) content.CTRECOFC.forEach((v, i) => secondTrimester[i][v.Alias] = v.Value);
      if (content.CTRECOPFE) content.CTRECOPFE.forEach((v, i) => secondTrimester[i][v.Alias] = v.Value);
      if (content.CTRECOACOR) content.CTRECOACOR.forEach((v, i) => secondTrimester[i][v.Alias] = v.Value);
      if (content.CTRECOLA) content.CTRECOLA.forEach((v, i) => secondTrimester[i][v.Alias] = v.Value);
      if (content.CTRECOPLAC) content.CTRECOPLAC.forEach((v, i) => secondTrimester[i][v.Alias] = v.Value);
      if (content.CTRECODOPP) content.CTRECODOPP.forEach((v, i) => secondTrimester[i][v.Alias] = v.Value);
      if (content.CTRECOMORF) content.CTRECOMORF.forEach((v, i) => secondTrimester[i][v.Alias] = v.Value);
      this.getModel(model).setProperty("/SecondTrimester", secondTrimester);
      // Third Trimester
      const thirdTrimester = [];
      if (content.X01ECOID) content.X01ECOID.forEach((v, i) => {
        thirdTrimester[i] = {};
        thirdTrimester[i][v.Alias] = v.Value;
      });
      if (content.X04_EMBID) content.X04_EMBID.forEach((v, i) => thirdTrimester[i][v.Alias] = v.Value);
      if (content.X01ECOFECH) content.X01ECOFECH.forEach((v, i) => thirdTrimester[i][v.Alias] = v.Value !== "00000000" ? `${v.Value.substr(6, 2)}.${v.Value.substr(4, 2)}.${v.Value.substr(0, 4)}` : "");
      if (content.X01EMANAS) content.X01EMANAS.forEach((v, i) => thirdTrimester[i][v.Alias] = v.Value);
      if (content.X01IAS) content.X01IAS.forEach((v, i) => thirdTrimester[i][v.Alias] = v.Value);
      if (content.X01ECOTA) content.X01ECOTA.forEach((v, i) => thirdTrimester[i][v.Alias] = v.Value);
      if (content.X01ECOKG) content.X01ECOKG.forEach((v, i) => thirdTrimester[i][v.Alias] = v.Value);
      if (content.X01ECOTROB) content.X01ECOTROB.forEach((v, i) => thirdTrimester[i][v.Alias] = v.Value);
      if (content.X01ATED_BY) content.X01ATED_BY.forEach((v, i) => thirdTrimester[i][v.Alias] = v.Value);
      if (content.X00ECOPRES) content.X00ECOPRES.forEach((v, i) => thirdTrimester[i][v.Alias] = v.Value);
      if (content.X00ECOFC) content.X00ECOFC.forEach((v, i) => thirdTrimester[i][v.Alias] = v.Value);
      if (content.X00ECOPFE) content.X00ECOPFE.forEach((v, i) => thirdTrimester[i][v.Alias] = v.Value);
      if (content.X00ECOACOR) content.X00ECOACOR.forEach((v, i) => thirdTrimester[i][v.Alias] = v.Value);
      if (content.X00ECOLA) content.X00ECOLA.forEach((v, i) => thirdTrimester[i][v.Alias] = v.Value);
      if (content.X00ECOPLAC) content.X00ECOPLAC.forEach((v, i) => thirdTrimester[i][v.Alias] = v.Value);
      if (content.X00ECODOPP) content.X00ECODOPP.forEach((v, i) => thirdTrimester[i][v.Alias] = v.Value);
      if (content.X00ECOMORF) content.X00ECOMORF.forEach((v, i) => thirdTrimester[i][v.Alias] = v.Value);
      this.getModel(model).setProperty("/ThirdTrimester", thirdTrimester);
      // Sex T2
      const sexT2 = [];
      if (content.EMB_EMBID) content.EMB_EMBID.forEach((v, i) => {
        sexT2[i] = {};
        sexT2[i][v.Alias] = v.Value;
      });
      if (content.EMB_SEXO) content.EMB_SEXO.forEach((v, i) => sexT2[i][v.Alias] = v.Value);
      this.getModel(model).setProperty("/SexT2", sexT2);
      // Sex T3
      const sexT3 = [];
      if (content.X00_EMBID) content.X00_EMBID.forEach((v, i) => {
        sexT3[i] = {};
        sexT3[i][v.Alias] = v.Value;
      });
      if (content.X00_SEXO) content.X00_SEXO.forEach((v, i) => sexT3[i][v.Alias] = v.Value);
      this.getModel(model).setProperty("/SexT3", sexT3);
      // Monitors
      const monitors = [];
      if (content.EMBMONFECH) content.EMBMONFECH.forEach((v, i) => {
        monitors[i] = {};
        monitors[i][v.Alias] = v.Value;
      });
      if (content.X02EMANAS) content.X02EMANAS.forEach((v, i) => monitors[i][v.Alias] = v.Value);
      if (content.X02IAS) content.X02IAS.forEach((v, i) => monitors[i][v.Alias] = v.Value);
      if (content.EMBMONREG) content.EMBMONREG.forEach((v, i) => monitors[i][v.Alias] = v.Value);
      if (content.EMBMONTACT) content.EMBMONTACT.forEach((v, i) => monitors[i][v.Alias] = v.Value);
      this.getModel(model).setProperty("/Monitors", monitors);
      // if (content.PARTOHORA) content.PARTOHORA.Value = content.PARTOHORA.Value !== "000000" ? `${content.PARTOHORA.Value.substr(0, 2)}:${content.PARTOHORA.Value.substr(2, 2)}` : "";
      // if (content.PARTOTIPO) this.byId("PARTOTIPO").setValue(content.PARTOTIPO.Value);
      // Births
      const births = [];
      if (content.X01_EMBID) content.X01_EMBID.forEach((v, i) => {
        births[i] = {
          X01_EMBID: "",
          X00TOFECHA: "",
          X00TOHORA: "",
          EGAMPLIADA: "",
          X00TOTIPO: "",
          X00TOCESAR: "",
          DECESO: "",
          NACPESO: "",
          NACSEXO: "",
          APGAR: "",
          ALUMBRA: "",
          CORDON: "",
          PH: "",
          X00TOFINTP: "",
        };
        births[i][v.Alias] = v.Value;
      });
      /*  BirthV2 -->  */
      if (content.X00TOFECHA) content.X00TOFECHA.forEach((v, i) => births[i][v.Alias] = v.Value);
      if (content.X00TOHORA) content.X00TOHORA.forEach((v, i) => births[i][v.Alias] = `${v.Value.substr(0, 2)}:${v.Value.substr(2, 2)}`);
      if (content.EGAMPLIADA) content.EGAMPLIADA.forEach((v, i) => births[i][v.Alias] = v.Value);
      if (content.X00TOTIPO) content.X00TOTIPO.forEach((v, i) => births[i][v.Alias] = v.Value);
      if (content.X00TOCESAR) content.X00TOCESAR.forEach((v, i) => births[i][v.Alias] = v.Value);
      if (content.DECESO) content.DECESO.forEach((v, i) => births[i][v.Alias] = v.Value);
      if (content.NACPESO) content.NACPESO.forEach((v, i) => births[i][v.Alias] = parseFloat(v.Value));
      if (content.NACSEXO) content.NACSEXO.forEach((v, i) => births[i][v.Alias] = v.Value);
      if (content.APGAR) content.APGAR.forEach((v, i) => births[i][v.Alias] = v.Value);
      if (content.ALUMBRA) content.ALUMBRA.forEach((v, i) => births[i][v.Alias] = v.Value);
      if (content.CORDON) content.CORDON.forEach((v, i) => births[i][v.Alias] = v.Value);
      if (content.PH) content.PH.forEach((v, i) => births[i][v.Alias] = parseFloat(v.Value));
      if (content.X00TOFINTP) content.X00TOFINTP.forEach((v, i) => births[i][v.Alias] = v.Value);

      /*  <-- BirthV2  */

      this.getModel(model).setProperty("/Births", births);
      // AfterbirthReview
      const afterbirthReview = [];
      if (content.REVPPFECHA) content.REVPPFECHA.forEach((v, i) => {
        afterbirthReview[i] = {};
        afterbirthReview[i][v.Alias] = v.Value;
      });
      if (content.REVPPESTGN) content.REVPPESTGN.forEach((v, i) => afterbirthReview[i][v.Alias] = v.Value);
      if (content.REVPPECO) content.REVPPECO.forEach((v, i) => afterbirthReview[i][v.Alias] = v.Value);
      if (content.REVPPOBS) content.REVPPOBS.forEach((v, i) => afterbirthReview[i][v.Alias] = v.Value);
      this.getModel(model).setProperty("/AfterbirthReview", afterbirthReview);
    },

    /**
     * Open import dialog.
     * @param {string} dialog Model name
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onImportDialogPressed: function (dialog) {
      if (dialog == 'CAD_AE.CreateDiag' || dialog == 'CAD_OPD.CreateDiag') {
        this.setModel(models.createResultsModel(), "DiagnosticsSetFiltered");
        this.getModel("DiagnosticsSetFiltered").setProperty("/results", this.getModel("DiagnosticsSet").getProperty("/results"));
      }
      if (dialog == 'CAD_AE.ImportDiag' || dialog == 'CAD_OPD.ImportDiag') {
        this.setModel(models.createResultsModel(), "GetCaseDiagnosticsFiltered");
        this.getModel("GetCaseDiagnosticsFiltered").setProperty("/results", this.getModel("GetCaseDiagnostics").getProperty("/results"));
      }
      this.loadFragment({ type: "XML", name: `com.resulto.hcfi.view.${dialog}` }).then(oDialog => oDialog.open());
    },

    /**
     * Close Import dialog.
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onCancelImportDialog: function (oEvent) {
      oEvent.getSource().getParent().close();
      oEvent.getSource().getParent().destroy();
    },


    // Risk Factor
    /**
     * Save new risk factor.
     * @param {sap.ui.base.Event} oEvent Event caller
     * @param {string} model Model name
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onSaveImportRiskFactorDialog: function (oEvent, model) {
      const list = [];
      oEvent.getSource().getParent().getContent()[0].getSelectedItems().forEach(item => {
        const prf = item.getBindingContext("PatientRiskFactor").getObject();
        list.push({
          PAT_FRFDSC: prf.Rsfna,
          PAT_FRFCOD: prf.Rsfnr,
          PAT_FRFCOM: "",
          PAT_FRFID: "000",
        });
      });
      this.getModel(model).setProperty("/RiskFactors", list);
      this.onCancelImportDialog(oEvent);
    },
    onDeleteDroppedHistoryModelPressed: function (oEvent, model) {
      let rf = this.getModel(model).getProperty("/RiskFactors");
      let al = this.getModel(model).getProperty("/Allergies");
      let mh = this.getModel(model).getProperty("/MedicalAntecedents");
      let fh = this.getModel(model).getProperty("/FamilyAntecedents");
      let sa = this.getModel(model).getProperty("/SurgicalAntecedents");
      let sh = this.getModel(model).getProperty("/SocialHabits");

      var deleteItemID = this.getModel(model).getProperty(oEvent.getParameter("listItem").getBindingContextPath()).ID

      //Search in all model to find the coincidence and delete
      if (rf.find(r => r.PAT_FRFCOD == deleteItemID)) {
        this.getModel(model).setProperty("/RiskFactors", rf.filter(r => r.PAT_FRFCOD != deleteItemID));
      }
      if (al.find(a => a.PAT_FALLID == deleteItemID)) {
        this.getModel(model).setProperty("/Allergies", al.filter(a => a.PAT_FALLID != deleteItemID));
        if (al.find(a => a.PAT_FALLDS == 'No refiere' && a.PAT_FALLID == deleteItemID)) {
          this.getView().getModel("CAD_OPD").getData().content.PAT_FALLST.Value = "";
        }
      }
      if (mh.find(m => m.PAT_FDISID == deleteItemID)) {
        this.getModel(model).setProperty("/MedicalAntecedents", mh.filter(m => m.PAT_FDISID != deleteItemID));
      }
      if (fh.find(f => f.PAT_FFHID == deleteItemID)) {
        this.getModel(model).setProperty("/FamilyAntecedents", fh.filter(f => f.PAT_FFHID != deleteItemID));
      }
      if (sa.find(s => s.PAT_FSURID == deleteItemID)) {
        this.getModel(model).setProperty("/SurgicalAntecedents", sa.filter(s => s.PAT_FSURID != deleteItemID));
      }
      if (sh.find(s => s.P_HABIT_ID == deleteItemID)) {
        this.getModel(model).setProperty("/SocialHabits", sh.filter(s => s.P_HABIT_ID != deleteItemID));
      }
      this.getModel(model).setProperty(oEvent.getParameter("listItem").getBindingContextPath(), null);
      this.getModel(model).setProperty("/DroppedHistoryModel", this.getModel(model).getProperty("/DroppedHistoryModel").filter(Boolean));
      this.getModel(model).setSizeLimit(1000);
      this.getModel(model).refresh();
    },

    /**
     * Delete selected risk factor.
     * @param {sap.ui.base.Event} oEvent Event caller
     * @param {string} model Model name
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onDeleteRiskFactorPressed: function (oEvent, model) {
      this.getModel(model).setProperty(oEvent.getParameter("listItem").getBindingContextPath(), null);
      this.getModel(model).setProperty("/RiskFactors", this.getModel(model).getProperty("/RiskFactors").filter(Boolean));
    },

    // Allergy
    /**
     * Save new allergy.
     * @param {sap.ui.base.Event} oEvent Event caller
     * @param {string} model Model name
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onSaveImportAllergyDialog: function (oEvent, model) {
      const list = [];
      oEvent.getSource().getParent().getContent()[0].getSelectedItems().forEach(item => {
        const pa = item.getBindingContext("PatientAllergy").getObject();
        var bcpname = ""
        if (pa.parent != undefined) {
          bcpname = pa.parent.Bcpname
        }
        list.push({
          PAT_FALLDS: pa.Descr,
          PAT_FALLGR: bcpname,
          PAT_FALLID: pa.AllergySeqno,
          PAT_FALLRA: "",
          PAT_FALLSE: "",
          PAT_FALLTY: "",
        });
      });
      this.getModel(model).setProperty("/Allergies", list);
      this.onCancelImportDialog(oEvent);
    },

    /**
     * Delete selected allergy.
     * @param {sap.ui.base.Event} oEvent Event caller
     * @param {string} model Model name
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onDeleteAllergyPressed: function (oEvent, model) {
      this.getModel(model).setProperty(oEvent.getParameter("listItem").getBindingContextPath(), null);
      this.getModel(model).setProperty("/Allergies", this.getModel(model).getProperty("/Allergies").filter(Boolean));
    },

    // Surgical Antecedents
    /**
     * Save new surgical antecedent.
     * @param {sap.ui.base.Event} oEvent Event caller
     * @param {string} model Model name
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onSaveImportSurgicalAntecedentDialog: function (oEvent, model) {
      const list = [];
      oEvent.getSource().getParent().getContent()[0].getSelectedItems().forEach(item => {
        const psh = item.getBindingContext("PatientSurgeryHistory").getObject();
        list.push({
          PAT_FSURDT: psh.DateSurg,
          PAT_FSURNA: psh.ZPSH.NameChild,
          PAT_FSURRM: psh.RemarksInt,
          PAT_FSURAN: "",
          PAT_FSURID: psh.SurgHistid,
        });
      });
      this.getModel(model).setProperty("/SurgicalAntecedents", list);
      this.onCancelImportDialog(oEvent);
    },

    /**
     * delete selected surgical antecedent.
     * @param {sap.ui.base.Event} oEvent Event caller
     * @param {string} model Model name
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onDeleteSurgicalAntecedentPressed: function (oEvent, model) {
      this.getModel(model).setProperty(oEvent.getParameter("listItem").getBindingContextPath(), null);
      this.getModel(model).setProperty("/SurgicalAntecedents", this.getModel(model).getProperty("/SurgicalAntecedents").filter(Boolean));
    },

    // Medical Antecedents
    /**
     * Save new medical antecedent.
     * @param {sap.ui.base.Event} oEvent Event caller
     * @param {string} model Model name
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onSaveImportMedicalAntecedentDialog: function (oEvent, model) {
      const list = [];
      oEvent.getSource().getParent().getContent()[0].getSelectedItems().forEach(item => {
        const pmh = item.getBindingContext("PatientMedicalHistory").getObject();
        list.push({
          PAT_FDISNA: pmh.ZPMH.NameChild,
          PAT_FDISDA: pmh.DateMedHist,
          PAT_FDISTR: pmh.Treatment,
          PAT_FDISRM: pmh.RemarksInt,
          PAT_FDISID: pmh.MedHistid,
        });
      });
      this.getModel(model).setProperty("/MedicalAntecedents", list);
      this.onCancelImportDialog(oEvent);
    },

    /**
     * Delete selected medical antecedent.
     * @param {sap.ui.base.Event} oEvent Event caller
     * @param {string} model Model name
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onDeleteMedicalAntecedentPressed: function (oEvent, model) {
      this.getModel(model).setProperty(oEvent.getParameter("listItem").getBindingContextPath(), null);
      this.getModel(model).setProperty("/MedicalAntecedents", this.getModel(model).getProperty("/MedicalAntecedents").filter(Boolean));
    },

    // Family Antecedents
    /**
     * Save new family antecedent.
     * @param {sap.ui.base.Event} oEvent Event caller
     * @param {string} model Model name
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onSaveImportFamilyAntecedentDialog: function (oEvent, model) {
      const list = [];
      oEvent.getSource().getParent().getContent()[0].getSelectedItems().forEach(item => {
        const pfh = item.getBindingContext("PatientFamilyHistory").getObject();
        list.push({
          PAT_FFHNAM: pfh.ZMFH.NameChild,
          PAT_FFHRMK: pfh.FamComment,
          PAT_FRSIB: "",
          PAT_FFHID: pfh.FamilyHistid,
          PAT_FRBRO: pfh.Brother,
          PAT_FRFAT: pfh.Father,
          PAT_FRGRA: "",
          PAT_FRMAGP: pfh.MaternalGrandparents,
          PAT_FRMOM: pfh.Mother,
          PAT_FRPAGP: pfh.PaternalGrandparents,
          PAT_FRSIS: pfh.Sister,
          PAT_FRSON: pfh.Son,
        });
      });
      this.getModel(model).setProperty("/FamilyAntecedents", list);
      this.onCancelImportDialog(oEvent);
    },

    /**
     * Delete selected family antecedent.
     * @param {sap.ui.base.Event} oEvent Event caller
     * @param {string} model Model name
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onDeleteFamilyAntecedentPressed: function (oEvent, model) {
      this.getModel(model).setProperty(oEvent.getParameter("listItem").getBindingContextPath(), null);
      this.getModel(model).setProperty("/FamilyAntecedents", this.getModel(model).getProperty("/FamilyAntecedents").filter(Boolean));
    },

    // Vital signs
    /**
     * Save new vital sign.
     * @param {sap.ui.base.Event} oEvent Event caller
     * @param {string} model Model name
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onSaveImportVitalSignDialog: function (oEvent, model) {
      const list = [];
      oEvent.getSource().getParent().getContent()[0].getSelectedItems().forEach(item => {
        const vs = item.getBindingContext("VitalSigns").getObject();
        list.push({
          CLI_FVSDSC: vs.catalog.description,
          CLI_FVSVAL: `${vs.valueNum} ${vs.catalog.unit}`,
          CLI_FVSNRA: `${vs.catalog.rangeNormalLow} ${vs.catalog.unit} - ${vs.catalog.rangeNormalHigh} ${vs.catalog.unit}`,
          CLI_FVSTIM: DateFormat.getDateTimeInstance({ pattern: "dd.MM.yyyy/HH:mm:ss" }).format(vs.dateTime),
          CLI_FVSID: vs.valueId,
          CLI_FVSUNI: vs.catalog.unit
        });
      });
      this.getModel(model).setProperty("/VitalSignsExamTable", list);
      this.onCancelImportDialog(oEvent);
    },

    /**
     * Delete selected vital sign.
     * @param {sap.ui.base.Event} oEvent Event caller
     * @param {string} model Model name
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onDeleteVitalSignsExamTablePressed: function (oEvent, model) {
      this.getModel(model).setProperty(oEvent.getParameter("listItem").getBindingContextPath(), null);
      this.getModel(model).setProperty("/VitalSignsExamTable", this.getModel(model).getProperty("/VitalSignsExamTable").filter(Boolean));
    },

    onDeleteServicesTablePressed: function (oEvent, model) {
      this.getModel(model).setProperty(oEvent.getParameter("listItem").getBindingContextPath(), null);
      this.getModel(model).setProperty("/Services", this.getModel(model).getProperty("/Services").filter(Boolean));
    },
    onDeleteDiag_JudmentTablePressed: function (oEvent, model) {
      this.getModel(model).setProperty(oEvent.getParameter("listItem").getBindingContextPath(), null);
      this.getModel(model).setProperty("/Diagnoses", this.getModel(model).getProperty("/Diagnoses").filter(Boolean));
    },

    // Sign
    /**
     * Add new sign entry if not exist.
     * @param {string} model Model name
     * @memberOf com.resulto.hcfi.controller.Main
     */
    signDocument: function (model) {
      if (!this.getModel(model).getProperty("/Signs").find(s => s.PMD_FERNUM === this.getModel("ProfessionalData").getProperty("/Id"))) {
        this.getModel(model).getProperty("/Signs").push({
          PMD_FERMLN: "",
          PMD_FERNAM: this.getModel("ProfessionalData").getProperty("/Name"),
          PMD_FERNUM: this.getModel("ProfessionalData").getProperty("/Id"),
        });
        this.getModel(model).updateBindings(true);
      }
    },

    // Reports
    /**
     * Add new report entry.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onAddReport: function (oEvent, model) {
      var reports = this.getModel(model).getProperty("/Reports");

      if (reports == undefined || reports.length == 0) {
        reports = [{
          DIA_INFOR2: "",
          DIA_INFORM: "",
          ENTR_INF: "",
          GINE_INFOR: "",
          PROF_GINE: this.getModel("ProfessionalData").getProperty("/Id"),
          VIA_GINE: "",
          VIA_GINE2: "",
        }];
        this.getModel(model).setProperty("/Reports", reports);
      } else if (reports != undefined && reports.length > 0) reports.push(Object.assign({}, reports[reports.length - 1]));
      else reports = [{
        DIA_INFOR2: "",
        DIA_INFORM: "",
        ENTR_INF: "",
        GINE_INFOR: "",
        PROF_GINE: this.getModel("ProfessionalData").getProperty("/Id"),
        VIA_GINE: "",
        VIA_GINE2: "",
      }];

      this.getModel(model).updateBindings(true);
    },

    /**
     * Delete selected report
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onDeleteReport: function (oEvent, model) {
      this.getModel(model).setProperty(oEvent.getParameter("listItem").getBindingContextPath(), null);
      this.getModel(model).setProperty("/Reports", this.getModel(model).getProperty("/Reports").filter(Boolean));
    },

    /**
     * Clear document to send.
     * @param {string} model Model name
     * @param {boolean} sign If sign document
     * @memberOf com.resulto.hcfi.controller.Main
     */
    clearDocument: function (model, sign) {
      var document = $.extend({}, this.getModel(model).getData());
      //Las propiedades locales las eliminamos del objeto document
      delete document.DroppedHistoryModel;

      if (sign) this.signDocument(model);
      document.Mitarb = this.getModel("ProfessionalData").getProperty("/Id");
      document.Orgdo = this.getModel("MainData").getProperty("/MovementData/Orgpf");
      // CAD_AE      
      if (document.content.MOV_FFEING) document.content.MOV_FFEING.Value = document.content.MOV_FFEING.Value.split(".").reverse().join("");
      if (document.content.MOV_FHRING) document.content.MOV_FHRING.Value = document.content.MOV_FHRING.Value.replaceAll(":", "");
      // CAD_CTREMB
      if (document.content.MOV_FTIMDI) document.content.MOV_FTIMDI.Value = document.content.MOV_FTIMDI.Value.replaceAll(":", "");
      // if (document.content.PARTOHORA) document.content.PARTOHORA.Value = document.content.PARTOHORA.Value.replaceAll(":", "");
      [
        // CAD_GINE
        "FUR_GIN", "ECO_DAT", "FUR_MAM",
        // CAD_CTREMB
        "EMB_CTRFPP", "EMB_CTRFUR", "EMB_FURCOR", "PARTOFECHA", "MOV_FDATDI",
      ].forEach(key => {
        if (document.content[key]) document.content[key].Value = document.content[key].Value.split(".").reverse().join("");
      });
      document.content = Object.values(document.content).filter(v => !Array.isArray(v));
      [
        // CAD_GINE
        "RiskFactors", "Allergies", "SurgicalAntecedents", "MedicalAntecedents", "FamilyAntecedents", "Signs", "VitalSignsExamTable", "Services", "Diagnoses", "Documents", "Reports",
        // CAD_CTREMB
        "FirstTrimester", "SecondTrimester", "ThirdTrimester", "SexT2", "SexT3", "Monitors", "Births", "AfterbirthReview",
        //CAD_AE, CAD_OPD
        "SocialHabits"
      ].forEach(v => {
        if (document[v]) document[v].forEach((a, i) => {
          Object.entries(a).forEach(e => {
            let value = e[1];
            if (["PAT_FDISDA", "PAT_FSURDT"].includes(e[0])) {
              if (value) {
                value = DateFormat.getDateTimeInstance({ pattern: "yyyyMMdd" }).format(value);
              } else {
                value = "";
              }
            }
            if (["X00TOHORA"].includes(e[0])) value = value.replaceAll(":", "");
            if ([
              // CAD_GINE
              "DIA_INFORM", "DIA_INFOR2",
              // CAD_CTREMB
              "CTRECOFECH", "X00ECOFECH", "X01ECOFECH", "EMBMONFECH", "REVPPFECHA",
              // CAD_AE
              "ORD_FASSCD"
            ].includes(e[0])) value = value.split(".").reverse().join("");
            document.content.push({
              Dokar: document.Dokar,
              Doknr: document.Doknr,
              Dokvr: document.Dokvr,
              Doktl: document.Doktl,
              Alias: e[0],
              Line: i + 1,
              Value: value,
            });
          });
        });
        delete document[v];
      });
      document.content.forEach(c => {
        if (c.Alias == "PAT_FRBRO") {
          if (c.Value == true) {
            c.Value = "X"
          } else if (c.Value == false) {
            c.Value = ""
          }
        }
        else if (c.Alias == "PAT_FRFAT") {
          if (c.Value == true) {
            c.Value = "X"
          } else if (c.Value == false) {
            c.Value = ""
          }
        }
        else if (c.Alias == "PAT_FRMAGP") {
          if (c.Value == true) {
            c.Value = "X"
          } else if (c.Value == false) {
            c.Value = ""
          }
        }
        else if (c.Alias == "PAT_FRMOM") {
          if (c.Value == true) {
            c.Value = "X"
          } else if (c.Value == false) {
            c.Value = ""
          }
        }
        else if (c.Alias == "PAT_FRPAGP") {
          if (c.Value == true) {
            c.Value = "X"
          } else if (c.Value == false) {
            c.Value = ""
          }
        }
        else if (c.Alias == "PAT_FRSIS") {
          if (c.Value == true) {
            c.Value = "X"
          } else if (c.Value == false) {
            c.Value = ""
          }
        }
        else if (c.Alias == "PAT_FRSON") {
          if (c.Value == true) {
            c.Value = "X"
          } else if (c.Value == false) {
            c.Value = ""
          }
        } else {
          c.Value = c.Value.toString().trim()
        }
      }
      );
      return document;
    },
    /**
     * Save document.
     * @param {string} model Model name
     * @memberOf com.resulto.hcfi.controller.Main
     */
    save: function (model, print = "false") {
      if (this.getModel(model).getProperty("/Dokst") == "FR") {
        this.print(model);
        return
      }
      var printModel = ""
      if (print == "true") {
        printModel = model
      }
      this.byId("Splitter").setBusy(true);
      if (this.getModel("CAD_AE").getProperty("/content/MOV_FDTYPE/Value") == "99") {
        this.displayOdataError(this.getModel("i18n").getProperty("ErrorTitle"), this.getModel("i18n").getProperty("ErrorInSelectedHighClass"))
        this.byId("Splitter").setBusy(false);
        return
      }
      this.createDocument(this.clearDocument(model), false, printModel)
    },

    /**
     * Save and release.
     * @param {string} model Model name
     * @memberOf com.resulto.hcfi.controller.Main
     */
    saveSend: function (model) {
      this.byId("Splitter").setBusy(true);
      this.createDocument(this.clearDocument(model, true), true);
    },

    /**
     * Save and release.
     * @param {string} model Model name
     * @memberOf com.resulto.hcfi.controller.Main
     */
    print: function (model) {
      const document = $.extend({}, this.getModel(model).getData());
      this._pdfViewer.setSource(`/sap/opu/odata/sap/ZISH_HCFI_SRV/PDFSet(Dokar='${document.Dokar}',Doknr='${document.Doknr}',Dokvr='${document.Dokvr}',Doktl='${document.Doktl}')/$value`);
      var pdfViewerTitle = null;
      this.getModel("AllowedPMD").getData().results.forEach(r =>{
        if(r.Dtid == model){
          pdfViewerTitle = r.Dkbez;
        }
      })
      this._pdfViewer.setTitle(pdfViewerTitle);
      this._pdfViewer.open();
    },

    /**
     * Create or update document.
     * @param {Object} document Document to save
     * @param {boolean} send If document has to be released when saved
     * @memberOf com.resulto.hcfi.controller.Main
     */
    createDocument: function (document, send = false, printModel = "") {
      this.getModel("ZISH_HCFI_SRV").create("/DocumentSet", document, {
        success: function (oResponse) {
          this.byId("Splitter").setBusy(false);
          this.byId(oResponse.Dtid).getContent()[0].setBusy(true);
          try { this.byId(oResponse.Dtid).getContent()[1].setBusy(true); } catch { }
          this.getDocuments(oResponse.Dtid, oResponse.Dtvers);
          MessageToast.show(this.getModel("i18n").getProperty("SaveSuccessful"));
          if (send) this.releaseDocument(oResponse);
          else this.byId("Splitter").setBusy(false);
          if (printModel != "")
            this.print(printModel);
        }.bind(this),
        error: function (oError) {
          this.byId("Splitter").setBusy(false);
          try {
            this.displayOdataError("DocumentSet", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("DocumentSet", oError.message);
          }
        }.bind(this)
      });
    },

    /**
     * Release document.
     * @param {Object} document Document to release
     * @memberOf com.resulto.hcfi.controller.Main
     */
    releaseDocument: function (document) {
      this.getModel("ZISH_HCFI_SRV").callFunction("/ReleaseDocument", {
        urlParameters: {
          Doktl: document.Doktl,
          Dokvr: document.Dokvr,
          Doknr: document.Doknr,
          Dokar: document.Dokar,
        },
        success: function (oResponse) {
          this.byId("Splitter").setBusy(false);
          this.byId(oResponse.ReleaseDocument.Dtid).getContent()[0].setBusy(true);
          try { this.byId(oResponse.ReleaseDocument.Dtid).getContent()[1].setBusy(true); } catch { }
          this.getDocuments(oResponse.ReleaseDocument.Dtid, oResponse.ReleaseDocument.Dtvers);
          MessageToast.show(this.getModel("i18n").getProperty("ReleaseSuccessful"));
        }.bind(this),
        error: function (oError) {
          this.byId("Splitter").setBusy(false);
          try {
            this.displayOdataError("ReleaseDocument", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("ReleaseDocument", oError.message);
          }
        }.bind(this)
      });
    },

    /**
     * Create new document.
     * @param {string} model Model name
     * @memberOf com.resulto.hcfi.controller.Main
     */
    createNewDocument: function (model) {
      switch (model) {
        case "CAD_OPD":
          this.setModel(models.createOPDModel(model, this.headers.Institution, this.headers.Case, this.headers.Patient), model);
          // if(this.getModel("CAD_OPD").getProperty("/Allergies") == undefined || this.getModel("CAD_OPD").getProperty("/Allergies") == []){
          //   this.getModel("CAD_OPD").getData().content.PAT_FALLST.Value = "Ninguna alergia";
          //   this.getModel("CAD_OPD").setProperty("/Allergies",[]);
          //   var al = this.getModel("CAD_OPD").getProperty("/Allergies");
          //     al.push({
          //       PAT_FALLDS: "No refiere",
          //       PAT_FALLGR: "",
          //       PAT_FALLID: "00000",
          //       PAT_FALLRA: "",
          //       PAT_FALLSE: "",
          //       PAT_FALLTY: "",
          //     })
          //     this.fillDroppedHistoryModel("CAD_OPD");
          // }else{
          //   this.getModel("CAD_OPD").getData().content.PAT_FALLST.Value = "Existen alergias";
          // }
          break;
        case "CAD_AE":
          this.setModel(models.createAEModel(model, this.headers.Institution, this.headers.Case, this.headers.Patient), model);
          // if(this.getModel("CAD_AE").getProperty("/Allergies") == undefined || this.getModel("CAD_AE").getProperty("/Allergies") == []){
          //   this.getModel("CAD_AE").getData().content.PAT_FALLST.Value = "Ninguna alergia";
          //   this.getModel("CAD_AE").setProperty("/Allergies",[]);
          //   var al = this.getModel("CAD_AE").getProperty("/Allergies");
          //     al.push({
          //       PAT_FALLDS: "No refiere",
          //       PAT_FALLGR: "",
          //       PAT_FALLID: "00000",
          //       PAT_FALLRA: "",
          //       PAT_FALLSE: "",
          //       PAT_FALLTY: "",
          //     })
          //     this.fillDroppedHistoryModel("CAD_AE");
          // }else{
          //   this.getModel("CAD_AE").getData().content.PAT_FALLST.Value = "Existen alergias";
          // }
          break;
        case "CAD_GINE":
          this.setModel(models.createGINEModel(model, this.headers.Institution, this.headers.Case, this.headers.Patient), model);
          break;
        case "CAD_MAM":
          this.setModel(models.createCADMAMModel(model, this.headers.Institution, this.headers.Case, this.headers.Patient), model);
          break;
        case "CAD_CTREMB":
          this.setModel(models.createCTREMBModel(model, this.headers.Institution, this.headers.Case, this.headers.Patient), model);
          break;
      }
      this.byId(model).getContent()[0].getHeaderTitle().getExpandedContent()[0].setText(this.getModel("i18n").getProperty("New"));
      const data = this.getModel(model).getData();
      data.RiskFactors = [];
      data.Allergies = [];
      data.SurgicalAntecedents = [];
      data.MedicalAntecedents = [];
      data.FamilyAntecedents = [];
      data.SocialHabits = [];
      data.Signs = [];
      data.VitalSignsExamTable = [];
      data.Services = [];
      data.Diagnoses = [];
      data.FirstTrimester = [];
      data.SexT2 = [];
      data.SexT3 = [];
      data.SecondTrimester = [];
      data.ThirdTrimester = [];
      data.Monitors = [];
      data.Births = [];
      data.AfterbirthReview = [];
      data.Reports = [];
      // this.getModel("KeyValue").getProperty("/GINE_INFOR").forEach(infor => {
      //   if (infor.KeyValue) data.Reports.push({
      //     DIA_INFOR2: "",
      //     DIA_INFORM: "",
      //     ENTR_INF: "",
      //     GINE_INFOR: infor.KeyValue,
      //     PROF_GINE: this.getModel("ProfessionalData").getProperty("/Id"),
      //     VIA_GINE: "",
      //     VIA_GINE2: "",
      //   });
      // });
      //data.content.PRU_OBS.Value = this.getModel("KeyValue").getProperty("/PRU_OBS/0/KeyText");

      //Templates
      switch (model) {
        case "CAD_OPD":
          break;
        case "CAD_AE":
          break;
        case "CAD_MAM":
          // data.content.MAMA_DER2.Value = this.getModel("KeyValue").getProperty("/MAMA_DER2/0/KeyText");
          // data.content.X00LA_DER.Value = this.getModel("KeyValue").getProperty("/X00LA_DER/0/KeyText");
          // data.content.MAMA_IZQ2.Value = this.getModel("KeyValue").getProperty("/MAMA_IZQ2/0/KeyText");
          // data.content.X00LA_IZQ.Value = this.getModel("KeyValue").getProperty("/X00LA_IZQ/0/KeyText");
          // data.content.ECO_MAM_T2.Value = this.getModel("KeyValue").getProperty("/ECO_MAM_T2/0/KeyText");
          data.content.OBS_MAM.Value = this.getModel("KeyValue").getProperty("/OBS_MAM/0/KeyText");
          break;
        case "CAD_GINE":
          data.content.OBS_GIN.Value = this.getModel("KeyValue").getProperty("/OBS_GIN/0/KeyText");
          break;
        case "CAD_CTREMB":
          data.content.PARTOEVO.Value = this.getModel("KeyValue").getProperty("/PARTOEVO/0/KeyText");
          data.content.PARTOEVORN.Value = this.getModel("KeyValue").getProperty("/PARTOEVORN/0/KeyText");
          break;
      }

      this.getModel(model).updateBindings(true);
    },

    /**
     * Create new document version.
     * @param {string} model Model name
     * @memberOf com.resulto.hcfi.controller.Main
     */
    createDocumentVersion: function (model) {
      this.byId("Splitter").setBusy(true);
      const document = this.getModel(model).getData();
      this.getModel("ZISH_HCFI_SRV").callFunction("/CreateDocVersion", {
        urlParameters: {
          Doktl: document.Doktl,
          Dokvr: document.Dokvr,
          Doknr: document.Doknr,
          Dokar: document.Dokar,
        },
        success: function (oResponse) {
          this.byId("Splitter").setBusy(false);
          this.byId(oResponse.CreateDocVersion.Dtid).getContent()[0].setBusy(true);
          try { this.byId(oResponse.ReleaseDocument.Dtid).getContent()[1].setBusy(true); } catch { }
          this.getDocuments(oResponse.CreateDocVersion.Dtid, oResponse.CreateDocVersion.Dtvers);
        }.bind(this),
        error: function (oError) {
          this.byId("Splitter").setBusy(false);
          try {
            this.displayOdataError("CreateDocVersion", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("CreateDocVersion", oError.message);
          }
        }.bind(this)
      });
    },

    /**
     * Search the value in notes list.
     * @param {sap.ui.base.Event} oEvent - Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onTimelineSearch: function (oEvent) {
      const filterText = oEvent.getParameter("newValue");
      const filters = this.byId("Timeline").getBinding("content").aFilters.length ? this.byId("Timeline").getBinding("content").aFilters[0].aFilters : [];
      if (filterText) {
        if (filters.length) {
          const index = filters.findIndex(f => f.sVariable === "search");
          if (index >= 0) filters.splice(index, 1);
          filters.push(new Filter({
            variable: "search",
            filters: [
              new Filter("information", "Contains", filterText),
              new Filter("documentationUnit", "Contains", filterText),
              new Filter("responsible", "Contains", filterText),
              new Filter("typeText", "Contains", filterText),
              new Filter("text", "Contains", filterText)
            ]
          }));
        } else filters.push(new Filter({
          variable: "search",
          filters: [
            new Filter("information", "Contains", filterText),
            new Filter("documentationUnit", "Contains", filterText),
            new Filter("responsible", "Contains", filterText),
            new Filter("typeText", "Contains", filterText),
            new Filter("text", "Contains", filterText)
          ]
        }));
      } else filters.splice(filters.findIndex(f => f.sVariable === "search"), 1);
      this.byId("Timeline").getBinding("content").filter(new Filter(filters, true));
    },

    /**
     * Open filter dialog.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onFilterTimelinePressed: function (oEvent) {
      const source = oEvent.getSource();
      this._oFilterTimelineDialog ? this._oFilterTimelineDialog.open(source) : this.loadFragment({
        type: "XML",
        name: "com.resulto.hcfi.view.FilterTimelineDialog"
      }).then(function (oDialog) {
        this._oFilterTimelineDialog = oDialog;
        oDialog.open(source);
      }.bind(this));
    },

    /**
     * Apply the filters to the table.
     * @param {sap.ui.base.Event} oEvent - Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onFilterTimelineDialogConfirm: function (oEvent) {
      const filters = this.byId("Timeline").getBinding("content").aFilters.length ? this.byId("Timeline").getBinding("content").aFilters[0].aFilters : [];
      const aFilters = Object.entries(oEvent.getParameter("filterItems").reduce((list, filterItem) => {
        if (filterItem.getKey() === "datetime") {
          const startDate = filterItem.getCustomControl().getItems()[1].getItems()[0].getDateValue();
          const endDate = filterItem.getCustomControl().getItems()[1].getItems()[0].getSecondDateValue();
          this.previousDateRange = filterItem.getCustomControl().getItems()[1].getItems()[0].getValue();
          list[filterItem.getKey()] = [...list[filterItem.getKey()] || [], new Filter(filterItem.getKey(), "BT", startDate, endDate)];
        } else
          list[filterItem.getParent().getKey()] = [...list[filterItem.getParent().getKey()] || [], new Filter(filterItem.getParent().getKey(), "EQ", filterItem.getKey())];
        return list;
      }, {})).map(typeList => new Filter({ variable: typeList[0], filters: typeList[1] }));
      const searchFilter = filters.find(f => f.sVariable === "search");
      if (searchFilter) aFilters.push(searchFilter);
      this.byId("Timeline").getBinding("content").filter(aFilters.length ? new Filter(aFilters, true) : null);
    },

    /**
     * Set the last value when the filter is canceled.
     * @param {sap.ui.base.Event} oEvent - Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onFilterTimelineDialogCancel: function (oEvent) {
      const oCustomFilter = oEvent.getSource().getFilterItems()[3];
      oCustomFilter.getCustomControl().getItems()[1].getItems()[0].setValue(this.previousDateRange);
      if (this.previousDateRange) {
        oCustomFilter.setFilterCount(1);
        oCustomFilter.setSelected(true);
      } else {
        oCustomFilter.setFilterCount(0);
        oCustomFilter.setSelected(false);
      }
    },

    /**
     * Remove all values when the filter is reseted.
     * @param {sap.ui.base.Event} oEvent - Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onFilterTimelineDialogReset: function (oEvent) {
      const oCustomFilter = oEvent.getSource().getFilterItems()[3];
      oCustomFilter.getCustomControl().getItems()[1].getItems()[0].setDateValue(null);
      oCustomFilter.getCustomControl().getItems()[1].getItems()[0].setSecondDateValue(null);
      oCustomFilter.setFilterCount(0);
      oCustomFilter.setSelected(false);
    },

    /**
     * Add the custom date filter to the filter dialog.
     * @param {sap.ui.base.Event} oEvent - Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onDateFilterChange: function (oEvent) {
      const oCustomFilter = oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getParent().getFilterItems()[3];
      if (oEvent.getParameter("value") !== this.previousDateRange) {
        oCustomFilter.setFilterCount(oCustomFilter.getFilterCount() + 1);
        oCustomFilter.setSelected(true);
      } else {
        oCustomFilter.setFilterCount(oCustomFilter.getFilterCount() - 1);
        oCustomFilter.setSelected(false);
      }
    },

    /**
     * Clear date range from filter dialog.
     * @param {sap.ui.base.Event} oEvent - Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onClearDateRange: function (oEvent) {
      const oCustomFilter = oEvent.getSource().getParent().getParent().getParent().getParent().getParent().getParent().getFilterItems()[3];
      oCustomFilter.getCustomControl().getItems()[1].getItems()[0].setDateValue(null);
      oCustomFilter.getCustomControl().getItems()[1].getItems()[0].setSecondDateValue(null);
      oCustomFilter.setFilterCount(0);
      oCustomFilter.setSelected(false);
    },

    /**
     * Open process popover
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onProcessPressed: function (oEvent) {
      // if (this.getModel("ProcessCases").getProperty("/results").length) {
      const source = oEvent.getSource();
      this._oProcessPopover ? this._oProcessPopover.openBy(source) : this.loadFragment({
        type: "XML",
        name: "com.resulto.hcfi.view.ProcessPopover"
      }).then(function (oPopover) {
        this._oProcessPopover = oPopover;
        oPopover.openBy(source);
      }.bind(this));
      // } else {
      //   this._oProcessSelectDialog ? this._oProcessSelectDialog.open() : this.loadFragment({
      //     type: "XML",
      //     name: "com.resulto.hcfi.view.ProcessSelectDialog"
      //   }).then(function (oDialog) {
      //     this._oProcessSelectDialog = oDialog;
      //     oDialog.open();
      //   }.bind(this));
      // }
    },

    onSearchSelectProcess: function (oEvent) {
      const text = oEvent.getParameter("value");
      oEvent.getParameter("itemsBinding").filter(new Filter([
        new Filter("Case", "Contains", text),
        new Filter("Dkey1", "Contains", text),
        new Filter("Ditxt", "Contains", text)
      ], false));
    },

    onConfirmSelectProcess: function (oEvent) {
      this.byId("MainPage").setBusy(true);
      const patientProcess = oEvent.getParameter("selectedItem").getBindingContext("PatientProcess").getObject();
      this.getModel("ZISH_HCFI_SRV").callFunction("/SetProcess", {
        urlParameters: {
          Institution: this.headers.Institution,
          Case: this.headers.Case,
          Process: patientProcess.ID,
        },
        success: function (oResponse) {
          // debugger
          this.getData();
        }.bind(this),
        error: function (oError) {
          this.byId("MainPage").setBusy(false);
          try {
            this.displayOdataError("GetPatientProcesses", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("GetPatientProcesses", oError.message);
          }
        }.bind(this)
      });
    },

    /**
     * Open add timeline dialog.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onAddTimelinePressed: function () {
      this.setModel(new JSONModel({
        ReferenceKey: "",
        Institution: this.headers.Institution,
        Case: this.headers.Case,
        Patient: this.headers.Patient,
        Process: this.getModel("MainData").getProperty("/ProcessData/ID"),
        Category: "",
        Content: "",
        Creation: 'true'
      }), "selectedNote");

      this.loadFragment({
        type: "XML",
        name: "com.resulto.hcfi.view.AddTimelineDialog"
      }).then(function (oDialog) {
        this._oAddTimelineDialog = oDialog;
        oDialog.open();
      }.bind(this));
    },

    onAntecedentPressed: function (oEvent) {
      const source = oEvent.getSource();
      const pressedObject = source.getBindingContext("MedicalDataOverview").getObject()
      const key = JSON.parse(pressedObject.Object).key
      var object;

      switch (pressedObject.MedType) {
        case "Alergia":
          object = JSON.parse(JSON.stringify( this.getModel("PatientAllergy").getData().results.find(x => x.AllergySeqno === key)));
          object.Reactions = []
          object.Allergy = object.parent
          
          if (object.reactions.results && object.reactions.results.length > 0){
             object.Reactions = object.reactions.results 
             object.Reactions.forEach(function(r){
                if(parseInt(r.Rea) < 10)
                  r.Rea = "0" + r.Rea;
                if(parseInt(r.Soa) < 10)
                  r.Soa = "0" + r.Soa;
               }
             )
          }
          this.getModel("NewAllergy").setData(object);        
          
          if (!this._EditAllergies) { 
            this.loadFragment({
              type: "XML",
              name: "com.resulto.hcfi.view.EditAllergies"
            }).then(function (oDialog) {
              this._EditAllergies = oDialog;
              this.getView().addDependent(this._EditAllergies);
              oDialog.open(source);
            }.bind(this));
          } else {
            this._EditAllergies.open();           
          }

          break;
        case "Antecedente médico":
          object = this.getModel("PatientMedicalHistory").getData().results.find(x => x.MedHistid === key);
          object.Antecedent = object.ZPMH
          object.Medication = object.Treatment
          object.Comments = object.Remarks
          object.Observations = object.RemarksInt
          
          this.getModel("NewMedicalHistory").setData(object);
          
          if(!this._EditMedicalAntecedents){
            this.loadFragment({
              type: "XML",
              name: "com.resulto.hcfi.view.EditMedicalAntecedents"
            }).then(function (oDialog) {
              this._EditMedicalAntecedents = oDialog;
              this.getView().addDependent(this._EditMedicalAntecedents);
              oDialog.open(source);
            }.bind(this));
          }else{
            this._EditMedicalAntecedents.open();
          }
          break;
        case "Antecedente quirúrgico":
          object = this.getModel("PatientSurgeryHistory").getData().results.find(x => x.SurgHistid === key);
          object.Antecedent = object.ZPSH
          object.Comments = object.Remarks
          object.Observations = object.RemarksInt        

          this.getModel("NewSurgeryHistory").setData(object);

          if(!this._EditSurgicalAntecedents){
            this.loadFragment({
              type: "XML",
              name: "com.resulto.hcfi.view.EditSurgicalAntecedents"
            }).then(function (oDialog) {
              this._EditSurgicalAntecedents = oDialog;
              this.getView().addDependent(this._EditSurgicalAntecedents);
              oDialog.open(source);
            }.bind(this));
          }else{
            this._EditSurgicalAntecedents.open()
          }
          break;
        case "Antecedente familiar":
          object = JSON.parse(JSON.stringify(this.getModel("PatientFamilyHistory").getData().results.find(x => x.FamilyHistid === key)));
          object.Antecedent = object.ZMFH
          object.Comments = object.FamComment
          object.Observations = object.RemarksInt
          
          this.getModel("NewFamilyHistory").setData(object);
          if(!this._EditFamilyAntecedents){
            this.loadFragment({
              type: "XML",
              name: "com.resulto.hcfi.view.EditFamilyAntecedents"
            }).then(function (oDialog) {
              this._EditFamilyAntecedents = oDialog;
              this.getView().addDependent(this._EditFamilyAntecedents);
              oDialog.open(source);
            }.bind(this));
          }else{
            this._EditFamilyAntecedents.open()
          }

          break;
        case "Factor de riesgo":
          object = JSON.parse(JSON.stringify(this.getModel("PatientRiskFactor").getData().results.find(x => x.Rsfnr === key)));        
          
          this.getModel("RiskFactorFiltered").setData(object);

          if(!this._EditRiskFactors){
            this.loadFragment({
              type: "XML",
              name: "com.resulto.hcfi.view.EditRiskFactors"
            }).then(function (oDialog) {
              this._EditRiskFactors = oDialog;
              this.getView().addDependent(this._EditRiskFactors);
              oDialog.open(source);
            }.bind(this));
          }else{
            this._EditRiskFactors.open();
          }
          break;
          
        case "Hábito":        
          var parts = [];
          parts.push(key.slice(0,8));
          parts.push(key.slice(8,12));
          parts.push(key.slice(12,16));
          parts.push(key.slice(16,20));
          parts.push(key.slice(20,32));
          var guid = parts.join('-').toLowerCase(); 

          object = JSON.parse(JSON.stringify(this.getModel("PatientSocialHabitsHistory").getData().results.find(x => x.Habitid === guid)));         
          object.Antecedent = {
            "NameChild": object.Type                                                  
          }
          object.Quantity = object.Quantity.trim();
                  
          this.getModel("NewHabit").setData(object);                    

          if(!this._EditHabitsAntecedents){
            this.loadFragment({
              type: "XML",
              name: "com.resulto.hcfi.view.EditHabitsAntecedents"
            }).then(function (oDialog) {
              this._EditHabitsAntecedents = oDialog;
              this.getView().addDependent(this._EditHabitsAntecedents);
              oDialog.open(source);
            }.bind(this));
          }else{
            this._EditHabitsAntecedents.open()
          }
          this.getModel("NewHabit").refresh()
          break;
        default:
          break;
      }

      /*this.loadFragment({
        id: "editAntecedentsFragment",
        type: "XML",
        name: "com.resulto.hcfi.view.EditAllergies"
      }).then(function (oDialog) {               
        oDialog.open(source);        
      }.bind(this));*/

    },

    onNoteSelected: function (oEvent) {

      let parameter = oEvent.getParameter("listItem") || oEvent.getParameter("selectedItem");

      let selNote = parameter.getBindingContext("Summary").getObject();

      this.setModel(new JSONModel({
        ReferenceKey: selNote.key,
        Institution: selNote.institutionId,
        Case: selNote.caseId,
        Patient: this.headers.Patient,
        Process: this.getModel("MainData").getProperty("/ProcessData/ID"),
        Category: selNote.category,
        Content: selNote.text,
        Interlocutor: selNote.responsibleId == this.getModel("MainData").getProperty("/DefaultData/Professional"),        
      }), "selectedNote");

      if (oEvent.getSource().removeSelections) {
        oEvent.getSource().removeSelections();
      }

      this.loadFragment({
        type: "XML",
        name: "com.resulto.hcfi.view.AddTimelineDialog"
      }).then(function (oDialog) {
        this._oAddTimelineDialog = oDialog;
        oDialog.open();
      }.bind(this));
    },

    /**
     * Open add vital sign dialog.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onAddVitalSignsPressed: function () {
      this.loadFragment({
        type: "XML",
        name: "com.resulto.hcfi.view.AddVitalSignsDialog"
      }).then(function (oDialog) {
        this._oAddVitalSignsDialog = oDialog;
        oDialog.open();
      }.bind(this));
    },

    /**
     * Open add service dialog.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onAddServicePressed: function () {
      this.loadFragment({
        type: "XML",
        name: "com.resulto.hcfi.view.AddServiceDialog"
      }).then(function (oDialog) {
        this.setModel(models.createResultsModel(), "ServiceTreeFiltered");
        this.getModel("ServiceTreeFiltered").setProperty("/results", this.getModel("ServiceTree").getProperty("/results"));
        this._oAddServiceDialog = oDialog;
        oDialog.open();
      }.bind(this));
    },

    /**
     * Show the entire text.
     * @param {sap.ui.base.Event} oEvent - Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    readMore: function (oEvent) {
      oEvent.getSource().getParent().getItems()[1].setMaxLines(0);
      oEvent.getSource().setVisible(false);
      oEvent.getSource().getParent().getItems()[oEvent.getSource().getParent().getItems().length - 1].setVisible(true);
    },

    /**
     * Reduce the text to show.
     * @param {sap.ui.base.Event} oEvent - Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    readLess: function (oEvent) {
      oEvent.getSource().getParent().getItems()[1].setMaxLines(4);
      oEvent.getSource().setVisible(false);
      oEvent.getSource().getParent().getItems()[oEvent.getSource().getParent().getItems().length - 2].setVisible(true);
    },

    /**
     * Clear and close Timeline dialog
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onCancelAddTimelineDialog: function (oEvent) {
      this.destroyDialog(oEvent);
    },

    onAnulateAddTimeLineDialog: function(oEvent){
      const dialog = oEvent.getSource().getParent();
      let selNote = this.getModel("selectedNote").getData();
      this.getModel("ZISH_HCFI_SRV").callFunction("/DeleteNote", {
        method: "GET",
        urlParameters: {
          ReferenceKey: selNote.ReferenceKey,          
        },
        success: function (oData, oResponse) {          
          this.getSummary();
          dialog.close();
          dialog.destroy();
          //this.byId("addTimelineDialogCategory").setSelectedKey("EVO");
          //this.byId("addTimelineDialogNote").setValue("");
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("CancelNote", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("CancelNote", oError.message);
          }
        }.bind(this)
      });
    },

    /**
     * Save new Timeline item
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onSaveAddTimelineDialog: function (oEvent) {
      const dialog = oEvent.getSource().getParent();
      let selNote = this.getModel("selectedNote").getData();
      //this.getModel("NotesCategories").getData().results.find(x => x.CatText === selNote.Category).CatId,

      this.getModel("ZISH_HCFI_SRV").callFunction("/CreateNote", {
        urlParameters: {
          ReferenceKey: selNote.ReferenceKey,
          Institution: selNote.Institution,
          Case: selNote.Case,
          Patient: selNote.Patient,
          Process: selNote.Process || "",
          Category: selNote.Category,
          Content: selNote.Content,
        },
        success: function (oResponse) {
          this.getSummarySuccess(oResponse);
          dialog.close();
          dialog.destroy();
          //this.byId("addTimelineDialogCategory").setSelectedKey("EVO");
          //this.byId("addTimelineDialogNote").setValue("");
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("CreateNote", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("CreateNote", oError.message);
          }
        }.bind(this)
      });
    },

    /**
     * Clear and close service dialog
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onCancelAddServiceDialog: function (oEvent) {
      this.getModel("ServiceTree").setProperty("/results", this.getModel("ServiceTree").getProperty("/results").map(parent => {
        parent.children.map(child => {
          delete child.Selected;
          return child;
        });
        parent.Selected = false;
        return parent;
      }));
      this.destroyDialog(oEvent);
    },

    /**
     * Save new service
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onSaveAddServiceDialog: function (oEvent) {
      const dialog = oEvent.getSource().getParent();
      var selected = this.getModel("ServiceTree").getProperty("/results").map(parent => parent.children.filter(child => child.Selected)).flat().concat(
        this.getModel("ServiceTree").getProperty("/results").filter(parent => parent.Selected).flat()
      );
      if (selected.length) {
        MessageBox.confirm(selected.map(s => `${s.Talst}: ${s.Ktxt1}`).join("\n"), {
          title: this.getModel("i18n").getProperty("SendBenefitsConfirmation"),
          actions: [MessageBox.Action.NO, MessageBox.Action.YES],
          emphasizedAction: MessageBox.Action.YES,
          onClose: function (sAction) {
            if (sAction === MessageBox.Action.YES) {
              dialog.setBusy(true);
              this.getModel("ZISH_HCFI_SRV").callFunction("/PerformServices", {
                urlParameters: {
                  Institution: this.headers.Institution,
                  Case: this.headers.Case,
                  Movement: this.headers.Movement,
                  Patient: this.headers.Patient,
                  Process: this.getModel("MainData").getProperty("/ProcessData/ID"),
                  Services: selected.map(s => s.Talst).join(",")
                },
                success: function (oResponse) {
                  dialog.setBusy(false);
                  this.getModel("Services").setProperty("/results", oResponse.results);
                  this.getModel("ServiceTree").setProperty("/results", this.getModel("ServiceTree").getProperty("/results").map(parent => {
                    parent.children.map(child => {
                      child.Selected = false;
                      return child;
                    });
                    parent.Selected = false;
                    return parent;
                  }));
                  dialog.close();
                  dialog.destroy();
                }.bind(this),
                error: function (oError) {
                  try {
                    this.displayOdataError("PerformServices", JSON.parse(oError.responseText).error.message.value);
                  } catch {
                    this.displayOdataError("PerformServices", oError.message);
                  }
                  dialog.setBusy(false);
                }.bind(this)
              });
            }
          }.bind(this)
        });
      } else MessageBox.error(this.getModel("i18n").getProperty("MinimumBenefitsSelected"));
    },

    /**
     * Clear and close vital sign dialog
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onCancelAddVitalSignDialog: function (oEvent) {
      this.byId("measure").setSelectedKey();
      this.byId("value").setValue();
      this.byId("unit").setText();
      this.destroyDialog(oEvent);
    },
    destroyDialog: function (oEvent) {
      if (oEvent.sId == "afterClose") {
        oEvent.getSource().destroy();
      } else {
        oEvent.getSource().getParent().close();
        oEvent.getSource().getParent().destroy();
      }
    },    


    closeUpdateDialog: function (oEvent) {
      oEvent.getSource().getParent().close();
    },

    closeAddAllergiesDialog: function(oEvent){
      var wizard;

      if(oEvent.getId() != "afterClose"){
        oEvent.getSource().getParent().close();
        wizard = oEvent.getSource().getParent().getContent()[0];
      }else{
        wizard = oEvent.getSource().getContent()[0];
      }           

      if(oEvent.getSource().getId().includes("addAllergiesDialog") ||
        oEvent.getSource().getParent().getId().includes("addAllergiesDialog")){
      
        this.getModel("AllergyFiltered").setProperty("/results", this.getModel("Allergy").getProperty("/results"));
        this.getModel("AllergyFiltered").setProperty("/loading", this.getModel("Allergy").getProperty("/loading"));
        this.getModel("AllergyFiltered").setProperty("/NoAllergy", this.getModel("Allergy").getProperty("/NoAllergy"));         
        this.byId("AllergiesSearchField").setValue("");         
      }

      if(oEvent.getSource().getId().includes("addFamilyAntDialog") ||
        oEvent.getSource().getParent().getId().includes("addFamilyAntDialog"))
        this.getModel("AntecedentFiltered").setProperty("/ZMFH", this.getModel("Antecedent").getProperty("/ZMFH"));        
      
      if(oEvent.getSource().getId().includes("addMedicalAntDialog") ||
        oEvent.getSource().getParent().getId().includes("addMedicalAntDialog"))
        this.getModel("AntecedentFiltered").setProperty("/ZPMH", this.getModel("Antecedent").getProperty("/ZPMH"));

      if(oEvent.getSource().getId().includes("addSurgicalAntDialog") ||
        oEvent.getSource().getParent().getId().includes("addSurgicalAntDialog"))
        this.getModel("AntecedentFiltered").setProperty("/ZPSH", this.getModel("Antecedent").getProperty("/ZPSH"));

      if(oEvent.getSource().getId().includes("addSocialHabitsAntDialog") ||
        oEvent.getSource().getParent().getId().includes("addSocialHabitsAntDialog"))
        this.getModel("AntecedentFiltered").setProperty("/ZSHA", this.getModel("Antecedent").getProperty("/ZSHA"));

      if(oEvent.getSource().getId().includes("addRiskFactorsDialog") ||
        oEvent.getSource().getParent().getId().includes("addRiskFactorsDialog")){
       this.getModel("RiskFactorFiltered").setProperty("/results", this.getModel("RiskFactor").getProperty("/results"));  
      }else{
      wizard.discardProgress(wizard.getSteps()[0]);
      wizard.getSteps()[0].getContent()[1].collapseAll();
      }

    },


    onCloseServiceResult: function (oEvent) {
      oEvent.getSource().destroy();
      this.oServiceResultsDialog = null;
      this.byId("Services").setBusy(true);
      this.getServices();
    },

    onCancelServiceResult: function (oEvent) {
      oEvent.getSource().getParent().close();

    },

    onBeforeImageAdded: function (oEvent) {
      return;
      if (oEvent.getSource().getIncompleteItems().length > 0) {
        MessageBox.error(this.getView().getModel("i18n").getResourceBundle().getText('ImageAlreadyAdded'));
        oEvent.preventDefault();
        return;
      }
    },

    onAfterItemAdded: function (oEvent) {
      this._oItem = oEvent.getParameter("item");
      this._oItem.setUploadState(sap.m.UploadState.Complete);

      var reader = new FileReader();
      reader.readAsDataURL(this._oItem.getFileObject());
      reader.onloadend = function () {
        var base64String = reader.result;
        var imageString = base64String.split(',')[1];
        this._itemsToUpload.push({ item: this._oItem, imageString: imageString })
      }.bind(this);
    },

    onAfterItemRemoved: function (oEvent) {
      this._oItem = oEvent.getParameter("item");
      this._itemsToUpload = this._itemsToUpload.filter(x => x.item !== this._oItem);
    },

    onSaveServiceResult: function (oEvent) {
      let oUploadSet = this.byId("_IDGenUploadSet1");
      this._oItem = oUploadSet.getIncompleteItems()[0];
      this._oResultsDoc = null;
      let oService = this.getModel("selectedService").getData();
      let document = this._fillFIN_GENObject(oService);

      this.oServiceResultsDialog.setBusy(true);
      this.signDocument("CAD_GINE");

      this.getModel("ZISH_HCFI_SRV").create("/DocumentSet", document, {
        success: function (oResponse) {
          MessageToast.show(this.getModel("i18n").getProperty("SaveSuccessful"));

          this._oResultsDoc = oResponse;

          if (this._itemsToUpload.length > 0) {
            // var reader = new FileReader();
            // reader.readAsDataURL(this._oItem.getFileObject());
            // reader.onloadend = function () {
            //   var base64String = reader.result;
            //   var imageString = base64String.split(',')[1];

            this.getModel("ZMEDIMAGE_GW_SRV").update(`/imageSet(Refkey='',Dockey='${oResponse.Dokar}${oResponse.Doknr}${oResponse.Dokvr}${oResponse.Doktl}')`,
              {
                Refkey: '',
                Dockey: `${oResponse.Dokar}${oResponse.Doknr}${oResponse.Dokvr}${oResponse.Doktl}`,
                // Notation: `['{\'data\':[{\'t\':\'I\',\'x\':827,\'y\':77,\'color\':\'#3784CC\',\'fill\':\'rgba(186, 157, 204, 0)\',\'size\':8,\'data\':\'${base64String}\',\'w\':506,\'h\':489,\'r\':321,\'b\':412}]}']`,
                Notation: `[${this._itemsToUpload.map(x => `'{\'data\':[{\'t\':\'I\',\'x\':827,\'y\':77,\'color\':\'#3784CC\',\'fill\':\'rgba(186, 157, 204, 0)\',\'size\':8,\'data\':\'${x.imageString}\',\'w\':506,\'h\':489,\'r\':321,\'b\':412}]}'`).join(",")}]`,
                Resimage: this._itemsToUpload.map(x => x.imageString).join(":"),
              }, {
              success: function (oResponse) {
                this._itemsToUpload = [];
                this._oItem.setUploadState(sap.m.UploadState.Complete);
                this._oItem.setVisibleRemove(false);
                this._oItem.setVisibleEdit(false);

                this.getModel("ZISH_HCFI_SRV").callFunction("/ReleaseDocument", {
                  urlParameters: {
                    Doktl: this._oResultsDoc.Doktl,
                    Dokvr: this._oResultsDoc.Dokvr,
                    Doknr: this._oResultsDoc.Doknr,
                    Dokar: this._oResultsDoc.Dokar,
                  },
                  success: function (oResponse) {
                    MessageToast.show(this.getModel("i18n").getProperty("ReleaseSuccessful"));
                    this.oServiceResultsDialog.setBusy(false);
                    this.oServiceResultsDialog.close();
                  }.bind(this),
                  error: function (oError) {
                    this.oServiceResultsDialog.setBusy(false);
                    try {
                      this.displayOdataError("ReleaseDocument", JSON.parse(oError.responseText).error.message.value);
                    } catch {
                      this.displayOdataError("ReleaseDocument", oError.message);
                    }
                  }.bind(this)
                });
              }.bind(this),
              error: function (oError) {
                this.oServiceResultsDialog.setBusy(false);
                try {
                  this.displayOdataError("DocumentSet", JSON.parse(oError.responseText).error.message.value);
                } catch {
                  this.displayOdataError("DocumentSet", oError.message);
                }
              }.bind(this)
            });

            // }.bind(this);

          } else {

            this.getModel("ZISH_HCFI_SRV").callFunction("/ReleaseDocument", {
              urlParameters: {
                Doktl: this._oResultsDoc.Doktl,
                Dokvr: this._oResultsDoc.Dokvr,
                Doknr: this._oResultsDoc.Doknr,
                Dokar: this._oResultsDoc.Dokar,
              },
              success: function (oResponse) {
                MessageToast.show(this.getModel("i18n").getProperty("ReleaseSuccessful"));
                this.oServiceResultsDialog.setBusy(false);
                this.oServiceResultsDialog.close();
              }.bind(this),
              error: function (oError) {
                this.oServiceResultsDialog.setBusy(false);
                try {
                  this.displayOdataError("ReleaseDocument", JSON.parse(oError.responseText).error.message.value);
                } catch {
                  this.displayOdataError("ReleaseDocument", oError.message);
                }
              }.bind(this)
            });


          }

        }.bind(this),
        error: function (oError) {
          this.oServiceResultsDialog.setBusy(false);
          try {
            this.displayOdataError("DocumentSet", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("DocumentSet", oError.message);
          }
        }.bind(this)
      });

      // oItem.setUploadState(sap.m.UploadState.Complete);
      // oUploadSet.getIncompleteItems()[0].setVisibleRemove(false);
      // oUploadSet.getIncompleteItems()[0].setVisibleEdit(false);
    },

    /**
     * Save new vital sign
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onSendAddVitalSignDialog: function (oEvent) {
      let error = false;
      const dialog = oEvent.getSource().getParent();
      const measure = this.byId("measure");
      const value = this.byId("value");
      if (measure.getSelectedItem() && value.getValue()) {
        dialog.setBusy(true);
        this.vitalSignBatchID = new Date().getTime();
        const movement = this.getModel("MainData").getProperty("/MovementData");
        const catalog = measure.getSelectedItem().getBindingContext("VitalSigns").getObject();
        const valueToSend = value.getValue();
        this.getModel("MVS_VITAL_SIGNS_SRV").setDeferredGroups([this.vitalSignBatchID]);
        if (catalog.dataType == "T") {
          this.getModel("MVS_VITAL_SIGNS_SRV").create("/measuredValueSet", {
            institutionId: this.headers.Institution,
            patientId: this.headers.Patient,
            caseId: this.headers.Case,
            catalogId: catalog.catalogId,
            positionId: catalog.positionId,
            valueText: valueToSend,
            dateTime: null
          }, {
            groupId: this.vitalSignBatchID,
            success: function (oResults) {
              this.getValues(true);
            }.bind(this),
            error: function (oError) {
              error = true;
              dialog.setBusy(false);
              try {
                this.displayOdataError("measuredValueSet", JSON.parse(oError.responseText).error.message.value);
              } catch {
                this.displayOdataError("measuredValueSet", oError.message);
              }
            }.bind(this),
          });
        } else {
          this.getModel("MVS_VITAL_SIGNS_SRV").create("/measuredValueSet", {
            institutionId: this.headers.Institution,
            patientId: this.headers.Patient,
            caseId: this.headers.Case,
            catalogId: catalog.catalogId,
            positionId: catalog.positionId,
            valueNum: valueToSend,
            dateTime: null
          }, {
            groupId: this.vitalSignBatchID,
            error: function (oError) {
              error = true;
              dialog.setBusy(false);
              try {
                this.displayOdataError("measuredValueSet", JSON.parse(oError.responseText).error.message.value);
              } catch {
                this.displayOdataError("measuredValueSet", oError.message);
              }
            }.bind(this),
          });
        }

        this.getModel("MVS_VITAL_SIGNS_SRV").callFunction("/saveMeasuredValues", {
          urlParameters: {
            caseid: this.headers.Case,
            deptunit: movement.Orgpf,
            institutionid: this.headers.Institution,
            movementid: movement.Lfdnr,
            nursunit: movement.Orgfa,
            patientid: this.headers.Patient
          },
          groupId: this.vitalSignBatchID,
          error: function (oError) {
            error = true;
            dialog.setBusy(false);
            this.displayOdataError("saveMeasuredValues", JSON.parse(oError.responseText).error.message.value);
          }.bind(this),
        });

        this.getModel("MVS_VITAL_SIGNS_SRV").submitChanges({
          success: function () {
            if (!error) {
              this.getValues(true);
              this.byId("measure").setSelectedKey();
              this.byId("value").setValue();
              this.byId("unit").setText();
              dialog.setBusy(false).close();
              dialog.setBusy(false).destroy();
            }
            dialog.setBusy(false);
          }.bind(this),
          error: function (oError) {
            try {
              this.displayOdataError("submitChanges", JSON.parse(oError.responseText).error.message.value);
            } catch {
              this.displayOdataError("submitChanges", oError.message);
            }
          }.bind(this),
        });
      } else sap.m.MessageToast.show(this.getModel("i18n").getProperty("NoSelectedVitalSigns"));
    },

    /**
     * Open  in a new tab.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onHeaderLinkPressed: function (property) {
      if (property == "Lab"){
        this.getLabUrl();
        window.open(this.getModel("Links").getProperty(`/${property}`), "_blank");
      }else{   
      window.open(this.getModel("Links").getProperty(`/${property}`), "_blank");
      }
    },

    /**
     * Open PDFViewer
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onLinkPressed: function (oEvent) {
      const document = oEvent.getSource().getParent().getBindingContext("Documents").getObject();
      if (document.PDF) {
        this._pdfViewer.setSource(`/sap/opu/odata/sap/ZISH_HCFI_SRV/PDFSet(Dokar='${document.RN2DOCDATA.Dokar}',Doknr='${document.RN2DOCDATA.Doknr}',Dokvr='${document.RN2DOCDATA.Dokvr}',Doktl='${document.RN2DOCDATA.Doktl}')/$value`);
        this._pdfViewer.setTitle(document.RN2DOCDATA.Dktxt);
        this._pdfViewer.open();
      } else if (document.URL) window.open(document.Link, "_blank");
    },

    /**
     * Open error page.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    goToErrorPage: function () {
      this.navTo("Error", {});
    },

    /**
     * Set the selected dates to filter when the dateTime selector change.
     * @param {sap.ui.base.Event} oEvent - Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    timeFilterChange: function (oEvent) {
      const sTimeFilter = oEvent.getParameter("selectedItem").getBindingContext("TimeFilter").getObject();
      this.addTableColumns(this.byId("cbVitalSigns").getSelectedItems().map(x => x.getAdditionalText()), [sTimeFilter.start, sTimeFilter.end]);
    },

    filterAllegiesList: function (result) {
      var formatResult = result;

      for (var i = 0; i <= result.length - 1; i++) {
        switch (result[i].MedType) {
          case "Alergia":
            result[i].position = 1;
            break;
          case "Antecedente médico":
            result[i].position = 2;
            break;
          case "Antecedente quirúrgico":
            result[i].position = 3;
            break;
          case "Antecedente familiar":
            result[i].position = 4;
            break;
          case "Factor de riesgo":
            result[i].position = 5;
            break;
          case "Hábito":
            result[i].position = 6;
            break;
          default:
            result[i].position = 7;
            break;
        }
      }
      formatResult = result.sort((a, b) => {
        return a.position - b.position;
      });
      formatResult.forEach(r => delete r.position);
      return formatResult
    },

    /**
     * Create custom css with alert and warning cells background.
     * @param {array} results - Vital signs available to show in the table
     * @memberOf com.resulto.hcfi.controller.Main
     */
    createCustomTableCss: function (results) {
      const styleSheet = Array.from(document.styleSheets).find(s => s.href?.indexOf("style.css") > 0);
      results.forEach(function (catalog) {
        styleSheet.insertRule(".catalog_" + catalog.code + "_Alert {background-color: " + catalog.colorAlert + " !important}");
        styleSheet.insertRule(".catalog_" + catalog.code + "_Warning {background-color: " + catalog.colorWarning + " !important}");
      });
    },

    /**
     * Draw exclamations on table header.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onAfterTableRendering: function () {
      sap.ui.table.Table.prototype.onAfterRendering.apply(this);
      const rows = this.getRows();
      if (rows.length) {
        for (let i = 0; i < rows.length; i++) {
          const cells = rows[i].getCells();
          for (let j = 0; j < cells.length; j++) {
            if (cells[j].getMetadata().getName() === "sap.m.Text" && cells[j].getCustomData()[0] && cells[j].getCustomData()[0].getValue()) {
              $("#" + cells[j].getId()).parent().parent().addClass(cells[j].getCustomData()[0].getValue());
              if (this.getColumns()[j].getMultiLabels()[1].getText().split(" ").length < 2 && cells[j].getCustomData()[0].getValue().indexOf("Warning") >= 0)
                this.getColumns()[j].getMultiLabels()[1].setText(this.getColumns()[j].getMultiLabels()[1].getText().split(" ")[0] + " !");
              if (cells[j].getCustomData()[0].getValue().indexOf("Alert") >= 0)
                this.getColumns()[j].getMultiLabels()[1].setText(this.getColumns()[j].getMultiLabels()[1].getText().split(" ")[0] + " !!");
            }
          }
        }
      }
    },

    /**
     * Create columns of tables with date and time.
     * @param {array} aFilters - Vital signs to add
     * @param {Date[]} aDates - Initial and final dates to add
     * @memberOf com.resulto.hcfi.controller.Main
     */
    addTableColumns: function (aFilters, aDates) {
      const table = this.byId("vitalSignsTable");
      const initialColumns = table.getColumns().slice(0, 3);
      table.removeAllColumns();
      for (let i = 0; i < initialColumns.length; i++) {
        table.addColumn(initialColumns[i]);
      }

      const catalogNoFilter = this.getModel("VitalSigns").getProperty("/catalogs/results");
      const catalogs = this.getModel("VitalSigns").getProperty("/catalogs/results").filter(c => aFilters.indexOf(c.code) > -1).map(c => c.positionId);
      const values = this.groupBy(this.getModel("VitalSigns").getProperty("/values/results").filter(v => catalogs.indexOf(v.positionId) > -1), "dateTime");
      const auxValues = Object.keys(values).sort(function (a, b) {
        return new Date(a).getTime() < new Date(b).getTime() ? 1 : -1;
      }).filter(function (header) {
        return new Date(header).getTime() > this[0] && new Date(header).getTime() < this[1];
      }.bind(aDates));
      const data = this.getModel("VitalSigns").getProperty("/catalogs/results").map(function (dates, catalog) {
        this.getModel("VitalSigns").getProperty("/values/results").filter(function (value) {
          //SEE-> Para filtrar por tipo, así no se mapean datos donde no toca
          return value.positionId === this.positionId;
        }.bind(catalog)).filter(function (value) {
          return value.dateTime > this[0] && value.dateTime < this[1];
        }.bind(dates)).forEach(function (value) {
          if (catalogNoFilter.find(x => x.positionId == value.positionId).dataType == "T") {
            this[value.dateTime] = {
              value: value.valueText,
              additionalInfo: value.additionalInformation
            };
          } else {
            this[value.dateTime] = {
              value: parseFloat(value.valueNum),
              additionalInfo: value.additionalInformation
            };
          }
        }.bind(catalog));
        return catalog;
      }.bind(this, aDates)).filter(function (catalog) {
        return this.indexOf(catalog.code) >= 0;
      }.bind(aFilters));
      auxValues.forEach(function (date, j, vals) {
        const headerSpan = vals.map(x => new Date(x).toLocaleDateString()).filter(function (x) {
          return x === this;
        }.bind(new Date(date).toLocaleDateString())).length;
        table.addColumn(new sap.ui.table.Column({
          width: "90px",
          headerSpan: headerSpan,
          customData: [
            new sap.ui.core.CustomData({
              key: "date",
              value: date
            })
          ],
          multiLabels: [
            new sap.m.Label({
              text: { value: new Date(date), type: "sap.ui.model.type.Date" }
            }),
            new sap.m.Label({
              text: { value: new Date(date), type: "sap.ui.model.type.Time" },
              textAlign: "Center",
              width: "100%"
            })
          ],
          //GRDG-488: Changed sap.m.Text by Transparent button for allowing drag config
          template: new sap.m.Button({
            text: "{VitalSigns>" + date + "/value}",
            type: sap.m.ButtonType.Transparent,
            enabled: "{= ${VitalSigns>" + date + "/value} !== undefined }",
            width: '100%',
            dragDropConfig: [
              new sap.ui.core.dnd.DragInfo()
            ],
            customData: [
              new sap.ui.core.CustomData({
                key: "rangeColor",
                value: {
                  parts: [`VitalSigns>${date}`, "VitalSigns>code",
                    "VitalSigns>rangeAlarmHigh", "VitalSigns>rangeAlarmLow", "VitalSigns>rangeNormalHigh", "VitalSigns>rangeNormalLow",
                    "VitalSigns>rangeWarningHigh", "VitalSigns>rangeWarningLow"], formatter: formatter.getRangeColor
                }
              })
            ]
          })
        }));
      }, this);
      this.getModel("VitalSigns").setProperty("/table/results", data);
    },

    /**
     * Update vital sign
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    vitalSignChange: function (oEvent) {
      const vitalSign = oEvent.getSource().getSelectedItem().getBindingContext("VitalSigns").getObject();
      this.byId("value").setValue();
      this.byId("unit").setText(vitalSign.unit);
    },

    /**
     * Open add risk factors dialog.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onAddRiskFactors: function () {
      if(!this._oAddRiskFactorsDialog){
        this.loadFragment({
          type: "XML",
          name: "com.resulto.hcfi.view.AddRiskFactorsDialog"
        }).then(function (oDialog) {
          this.setModel(models.createResultsModel(), "RiskFactorFiltered");
          this.getModel("RiskFactorFiltered").setProperty("/results", this.getModel("RiskFactor").getProperty("/results"));
          this._oAddRiskFactorsDialog = oDialog;
          this.getView().addDependent(this._oAddRiskFactorsDialog);
          oDialog.open();
        }.bind(this));
      }else{
        this._oAddRiskFactorsDialog.open();
      }
    },
    onSuggestRiskFactor: function (event) {
      var sValue = event.getParameter("suggestValue"),
        aFilters = [];
      if (sValue) {
        aFilters = [
          new Filter("Rsfna", function (sText) {
            return (sText || "").toUpperCase().indexOf(sValue.toUpperCase()) > -1;
          })
        ];
      }
      //this.byId("RiskFactorSearchField").getBinding("suggestionItems").filter(aFilters)
      //this.byId("RiskFactorSearchField").suggest();
    },
    onTypeRiskFactor: function (event) {
      this.onSearchRiskFactor(event.getParameter("newValue"));
    },
    onSearchRiskFactor: function (event) {
      var oItem = ""
      var childrenRiskFactor = []
      if (event.length == undefined) {
        oItem = event.getParameter("query");
      } else {
        oItem = event;
      }
      if (oItem != "") {
        if (this.getModel("RiskFactor").getProperty("/results").find(r => r.Rsfna.toUpperCase().includes(oItem.toUpperCase()))) {
          childrenRiskFactor = this.getModel("RiskFactor").getProperty("/results")
            .filter(r => r.Rsfna.toUpperCase().includes(oItem.toUpperCase()))
        }
        this.getModel("RiskFactorFiltered").setProperty("/results", childrenRiskFactor);
        return
      }
      //MessageToast.show(this.getModel("i18n").getProperty("NoResultFound"));
      this.getModel("RiskFactorFiltered").setProperty("/results", this.getModel("RiskFactor").getProperty("/results"));
      this.getModel("RiskFactorFiltered").refresh()
    },
    onTypeFamilyAntecedents: function (event) {
      this.onSearchFamilyAntecedents(event.getParameter("newValue"));
    },
    onSearchFamilyAntecedents: function (event) {
      //TODO: Añadir sugerencias.
      var oItem = ""
      var childrenAntecedent = [];
      var fAntecedent = this.getModel("Antecedent").getProperty("/ZMFH");

      if (event.length == undefined) {
        oItem = event.getParameter("query");
      } else {
        oItem = event;
      }
      if (oItem != "") {
        for (var i = 0; i <= fAntecedent.length - 1; i++) {
          if (fAntecedent[i].children.find(a => a.NameChild.toUpperCase().includes(oItem.toUpperCase()) && a.IsSelectable)) {
            fAntecedent[i].children.forEach(a => {
              if (a.NameChild.toUpperCase().includes(oItem.toUpperCase()) && a.IsSelectable && a.NameChild.toUpperCase() != "OTROS") {
                childrenAntecedent.push(a);
              }
            })
          }
        }
        if(!childrenAntecedent.find(c => c.ExtidChild.toUpperCase() == "OTROS"))
        childrenAntecedent.push(fAntecedent.find(a => a.ExtidChild.toUpperCase().includes("OTROS") && a.IsSelectable == true))
        this.getModel("AntecedentFiltered").setProperty("/ZMFH", childrenAntecedent)
        return
      }

      //MessageToast.show(this.getModel("i18n").getProperty("NoResultFound"));
      this.getModel("AntecedentFiltered").setProperty("/ZMFH", this.getModel("Antecedent").getProperty("/ZMFH"));
      this.getModel("AntecedentFiltered").refresh()
    },


    onTypeMedicalAntecedents: function (event) {
      this.onSearchMedicalAntecedents(event.getParameter("newValue"));
    },
    onSearchMedicalAntecedents: function (event) {
      //TODO: Añadir sugerencias.
      var oItem = ""
      var childrenMedicalAntecedents = [];
      var fAntecedent = this.getModel("Antecedent").getProperty("/ZPMH");

      if (event.length == undefined) {
        oItem = event.getParameter("query");
      } else {
        oItem = event;
      }
      if (oItem != "") {
        for (var i = 0; i <= fAntecedent.length - 1; i++) {
          if (fAntecedent[i].children.find(a => a.NameChild.toUpperCase().includes(oItem.toUpperCase()) && a.IsSelectable)) {
            fAntecedent[i].children.forEach(a => {
              if (a.NameChild.toUpperCase().includes(oItem.toUpperCase()) && a.IsSelectable && a.NameChild.toUpperCase() != "OTROS") {
                childrenMedicalAntecedents.push(a);
              }
            })
          }
        }
        if(!childrenMedicalAntecedents.find(c => c.NameChild.toUpperCase() == "OTROS"))
        childrenMedicalAntecedents.push(fAntecedent.find(a => a.NameChild.toUpperCase().includes("OTROS") && a.IsSelectable == true))
        this.getModel("AntecedentFiltered").setProperty("/ZPMH", childrenMedicalAntecedents);
        return
      }

      //MessageToast.show(this.getModel("i18n").getProperty("NoResultFound"));
      this.getModel("AntecedentFiltered").setProperty("/ZPMH", this.getModel("Antecedent").getProperty("/ZPMH"));
      this.getModel("AntecedentFiltered").refresh();
    },
    onTypeSurgicalAntecedents: function (event) {
      this.onSearchSurgicalAntecedents(event.getParameter("newValue"));
    },
    onSearchSurgicalAntecedents: function (event) {
      //TODO: Añadir sugerencias.
      var oItem = ""
      var childrenSurgicalAntecedents = [];
      var fAntecedent = this.getModel("Antecedent").getProperty("/ZPSH");
      if (event.length == undefined) {
        oItem = event.getParameter("query");
      } else {
        oItem = event;
      }
      if (oItem != "") {
        if (fAntecedent.find(a => a.NameChild.toUpperCase().includes(oItem.toUpperCase()) && a.IsSelectable && a.NameChild.toUpperCase() != "OTROS")) {
          childrenSurgicalAntecedents = fAntecedent.filter(a => a.NameChild.toUpperCase().includes(oItem.toUpperCase()) && a.IsSelectable);
        }
        if(!childrenSurgicalAntecedents.find(c => c.NameChild.toUpperCase() == "OTROS"))
        childrenSurgicalAntecedents.push(fAntecedent.find(a => a.NameChild.toUpperCase().includes("OTROS") && a.IsSelectable == true))
        this.getModel("AntecedentFiltered").setProperty("/ZPSH", childrenSurgicalAntecedents);
        return
      }
      //MessageToast.show(this.getModel("i18n").getProperty("NoResultFound"));
      this.getModel("AntecedentFiltered").setProperty("/ZPSH", this.getModel("Antecedent").getProperty("/ZPSH"));
      this.getModel("AntecedentFiltered").refresh()

    },
    onTypeSocialHabits: function (event) {
      this.onSearchSocialHabits(event.getParameter("newValue"));
    },
    onSearchSocialHabits: function (event) {
      //TODO: Añadir sugerencias.
      var oItem = ""
      var childrenSocialHabits = [];
      var fAntecedent = this.getModel("Antecedent").getProperty("/ZSHA");

      if (event.length == undefined) {
        oItem = event.getParameter("query");
      } else {
        oItem = event;
      }
      if (oItem != "") {
        if (fAntecedent.find(a => a.NameChild.toUpperCase().includes(oItem.toUpperCase()) && a.IsSelectable && a.NameChild.toUpperCase() != "OTROS")) {
          childrenSocialHabits = fAntecedent.filter(a => a.NameChild.toUpperCase().includes(oItem.toUpperCase()) && a.IsSelectable)
        }
        if(!childrenSocialHabits.find(c => c.NameChild.toUpperCase() == "OTROS"))
        childrenSocialHabits.push(fAntecedent.find(a => a.NameChild.toUpperCase().includes("OTROS") && a.IsSelectable == true))
        this.getModel("AntecedentFiltered").setProperty("/ZSHA", childrenSocialHabits)
        return
      }
      //MessageToast.show(this.getModel("i18n").getProperty("NoResultFound"));
      this.getModel("AntecedentFiltered").setProperty("/ZSHA", this.getModel("Antecedent").getProperty("/ZSHA"));
      this.getModel("AntecedentFiltered").refresh()
    },
    onTypeAllergies: function (event) {
      this.onSearchAllergies(event.getParameter("newValue"));
    },
    onSearchAllergies: function (event) {
      //TODO: Añadir sugerencias.
      var oItem = ""
      var childrenAllergies = []
      var fAllergy = this.getModel("Allergy").getProperty("/results");

      if (event.length == undefined) {
        oItem = event.getParameter("query");
      } else {
        oItem = event;
      }
      if (oItem) {
        for (var i = 1; i <= fAllergy.length - 1; i++) {
          if (fAllergy[i].children != undefined) {
            fAllergy[i].children.forEach(c => {
              if (c.children == undefined) {
                if (c.Bcpname.toUpperCase().includes(oItem.toUpperCase())) {
                  childrenAllergies.push(c);
                }
              } else {
                c.children.forEach(cAllergies => {
                  if (cAllergies.Bcpname.toUpperCase().includes(oItem.toUpperCase())) {
                    childrenAllergies.push(cAllergies);
                  }
                });
              }
            });
          }
        }
        childrenAllergies.push(fAllergy.find(c => c.Extid == ""))
        this.getModel("AllergyFiltered").setProperty("/results", childrenAllergies);
        return
      }
      //MessageToast.show(this.getModel("i18n").getProperty("NoResultFound"));
      this.getModel("AllergyFiltered").setProperty("/results", this.getModel("Allergy").getProperty("/results"));
      this.getModel("AllergyFiltered").refresh();

    },
    onTypeDiag_Judgment: function (event) {
      this.onSearchDiag_Judgment(event.getParameter("newValue"));
    },
    onSearchDiag_Judgment: function (event) {
      var oItem = ""
      var fDiagnostics = this.getModel("DiagnosticsSet").getProperty("/results");

      if (event.length == undefined) {
        oItem = event.getParameter("query");
      } else {
        oItem = event;
      }
      if (oItem != "") {
        this.getModel("DiagnosticsSetFiltered").setProperty("/results",
          fDiagnostics.filter(dJ => dJ.Description.toUpperCase().includes(oItem.toUpperCase()))
        );
        return;
      }

      //MessageToast.show(this.getModel("i18n").getProperty("NoResultFound"));
      this.getModel("DiagnosticsSetFiltered").setProperty("/results", this.getModel("DiagnosticsSet").getProperty("/results"));
      this.getModel("DiagnosticsSetFiltered").refresh()
    },

    onTypeImportDiag_Judgment: function (event) {
      this.onSearchImportDiag_Judgment(event.getParameter("newValue"));
    },
    onSearchImportDiag_Judgment: function (event) {
      var oItem = ""
      var fDiagnostics = this.getModel("GetCaseDiagnostics").getProperty("/results");

      if (event.length == undefined) {
        oItem = event.getParameter("query");
      } else {
        oItem = event;
      }
      if (oItem != "") {
        this.getModel("GetCaseDiagnosticsFiltered").setProperty("/results",
          fDiagnostics.filter(dJ => dJ.Description.toUpperCase().includes(oItem.toUpperCase()))
        );
        return;
      }

      //MessageToast.show(this.getModel("i18n").getProperty("NoResultFound"));
      this.getModel("GetCaseDiagnosticsFiltered").setProperty("/results", this.getModel("GetCaseDiagnostics").getProperty("/results"));
      this.getModel("GetCaseDiagnosticsFiltered").refresh()
    },

    onTypeServiceDialog: function (event) {
      this.onSearchServiceDialog(event.getParameter("newValue"));
    },

    onSearchServiceDialog: function (event) {
      var oItem = ""
      var childrenServiceDialog = []
      var fservice = this.getModel("ServiceTree").getProperty("/results");
      if (event.length == undefined) {
        oItem = event.getParameter("query");
      } else {
        oItem = event;
      }
      if (oItem != "") {
        for (var i = 0; i <= fservice.length - 1; i++) {
          if (fservice[i].children.find(s => s.Ktxt1.toUpperCase().includes(oItem.toUpperCase()))) {
            fservice[i].children.forEach(s => {
              if (s.Ktxt1.toUpperCase().includes(oItem.toUpperCase())) {
                childrenServiceDialog.push(s);
              }
            })
          }
        }

        this.getModel("ServiceTreeFiltered").setProperty("/results", childrenServiceDialog);
        return
      }
      /*if (oItem != "") {
        if (this.getModel("ServiceTree").getProperty("/results").find(r => r.Ktxt1.toUpperCase().includes(oItem.toUpperCase()))) {
          childrenServiceDialog = this.getModel("ServiceTree").getProperty("/results")
            .filter(r => r.Ktxt1.toUpperCase().includes(oItem.toUpperCase()))
        }
        this.getModel("ServiceTreeFiltered").setProperty("/results", childrenServiceDialog);
        return
      }*/
      //MessageToast.show(this.getModel("i18n").getProperty("NoResultFound"));
      this.getModel("ServiceTreeFiltered").setProperty("/results", this.getModel("ServiceTree").getProperty("/results"));
      this.getModel("ServiceTreeFiltered").refresh()
    },
    /**
     * Clear and close risk factor dialog
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onCancelAddRiskFactorsDialog: function (oEvent) {
      this.byId("RiskFactorsList").removeSelections(true);
      this.byId("RiskFactorSearchField").setValue("");
      this.closeAddAllergiesDialog(oEvent);
      //this.destroyDialog(oEvent);
    },

    /**
     * Save new risk factor
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onSaveAddRiskFactorsDialog: function (oEvent, cntinue) {
      const dialog = oEvent.getSource().getParent();
      dialog.setBusy(true);
      const list = this.byId("RiskFactorsList").getSelectedItems().map(item => item.getBindingContext("RiskFactorFiltered").getProperty("Rsfnr"));
      this.getModel("ZISH_HCFI_SRV").callFunction("/AddRiskFactors", {
        urlParameters: {
          Institution: this.headers.Institution,
          Patient: this.headers.Patient,
          RiskFactors: list.join(",")
        },
        success: function () {
          dialog.setBusy(false);
          this.getMedicalDataOverview();            
          this.byId("RiskFactorsList").removeSelections(true);
          this.byId("RiskFactorSearchField").clear()
          if (!cntinue) {
            //dialog.setBusy(true);
            dialog.close();
            //dialog.destroy();
          }
        }.bind(this),
        error: function (oError) {
          dialog.setBusy(false);
          try {
            this.displayOdataError("AddRiskFactors", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("AddRiskFactors", oError.message);
          }
        }.bind(this)
      });
    },
    onCancelDiagJudgment: function (oEvent) {
      this.byId("DiagList").removeSelections(true);
      this.destroyDialog(oEvent);
    },

    onSaveDiagJudgment: function (oEvent, model) {
      const dialog = oEvent.getSource().getParent();
      const code = this.byId("DiagList").getSelectedItems().map(item => item.getBindingContext("DiagnosticsSetFiltered").getProperty("Code"));
      const description = this.byId("DiagList").getSelectedItems().map(item => item.getBindingContext("DiagnosticsSetFiltered").getProperty("Description"));
      var list = this.getModel(model).getProperty("/Diagnoses");

      dialog.setBusy(true);
      code.forEach((d, i) => {
        if (!list.find(diag => diag.PAT_FDIACO == d))
          list.push({
            PAT_FDIACO: d,
            PAT_FDIACT: "",
            PAT_FDIAD: description[i],
            PAT_FDIAFT: "",
            PAT_FDIAID: "",
            PAT_FDIAO: ""
          });
      });

      dialog.setBusy(false);
      this.byId("DiagList").removeSelections(true);
      dialog.close();
      dialog.destroy();

      this.getModel(model).refresh();
      this.onCancelDiagJudgment(oEvent);
    },

    onSaveImportDiagJudgment: function (oEvent, model) {
      const dialog = oEvent.getSource().getParent();
      const code = this.byId("DiagList").getSelectedItems().map(item => item.getBindingContext("GetCaseDiagnosticsFiltered").getProperty("Dkey1"));
      const catalogo = this.byId("DiagList").getSelectedItems().map(item => item.getBindingContext("GetCaseDiagnosticsFiltered").getProperty("Dkat1"));
      const idDiag = this.byId("DiagList").getSelectedItems().map(item => item.getBindingContext("GetCaseDiagnosticsFiltered").getProperty("Lfdnr"));
      const description = this.byId("DiagList").getSelectedItems().map(item => item.getBindingContext("GetCaseDiagnosticsFiltered").getProperty("Description"));
      const textLibre = this.byId("DiagList").getSelectedItems().map(item => item.getBindingContext("GetCaseDiagnosticsFiltered").getProperty("Ditxt"));
      var list = this.getModel(model).getProperty("/Diagnoses");

      dialog.setBusy(true);
      code.forEach((d, i) => {
        if (!list.find(diag => diag.PAT_FDIACO == d))
          list.push({
            PAT_FDIACO: d,
            PAT_FDIACT: catalogo[i],
            PAT_FDIAD: description[i],
            PAT_FDIAFT: textLibre[i],
            PAT_FDIAID: idDiag[i],
            PAT_FDIAO: ""
          });
      });

      dialog.setBusy(false);
      this.byId("DiagList").removeSelections(true);
      dialog.close();
      dialog.destroy();

      this.getModel(model).refresh();
      this.onCancelDiagJudgment(oEvent);
    },
    /**
     * Open add family antecedents dialog.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onAddFamilyAntecedents: function () {
    if(!this._oAddFamilyAntecedentsDialog){
      this.loadFragment({
        type: "XML",
        name: "com.resulto.hcfi.view.AddFamilyAntecedentsDialog"
      }).then(function (oDialog) {
        //oDialog.mAggregations.content[0].mAggregations.suggestionItems
        this.setModel(models.createResultsModel(), "AntecedentFiltered");
        this.setModel(models.createResultsModel(), "NewFamilyHistory");
        this.getModel("AntecedentFiltered").setProperty("/ZMFH", this.getModel("Antecedent").getProperty("/ZMFH"));
        this._oAddFamilyAntecedentsDialog = oDialog;
        this.getView().addDependent(this._oAddFamilyAntecedentsDialog);
        oDialog.open();
      }.bind(this));
    }else{
      this._oAddFamilyAntecedentsDialog.open()
    }
    },

    /**
     * Open add medical antecedents dialog.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onAddMedicalAntecedents: function () {
      if(!this._oAddMedicalAntecedentsDialog){
        this.loadFragment({
          type: "XML",
          name: "com.resulto.hcfi.view.AddMedicalAntecedentsDialog"
        }).then(function (oDialog) {
          this.setModel(models.createResultsModel(), "AntecedentFiltered");
          this.setModel(models.createResultsModel(), "NewMedicalHistory");
          this.getModel("AntecedentFiltered").setProperty("/ZPMH", this.getModel("Antecedent").getProperty("/ZPMH"));
          this._oAddMedicalAntecedentsDialog = oDialog;
          this.getView().addDependent(this._oAddMedicalAntecedentsDialog);
          oDialog.open();
        }.bind(this));
      }else{
        this._oAddMedicalAntecedentsDialog.open()
      }
    },

    /**
     * Open add surgical antecedents dialog.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onAddSurgicalAntecedents: function () {
      if(!this._oAddSurgicalAntecedentsDialog){
        this.loadFragment({
          type: "XML",
          name: "com.resulto.hcfi.view.AddSurgicalAntecedentsDialog"
        }).then(function (oDialog) {
          this.setModel(models.createResultsModel(), "AntecedentFiltered");
          this.setModel(models.createResultsModel(), "NewSurgeryHistory");
          this.getModel("AntecedentFiltered").setProperty("/ZPSH", this.getModel("Antecedent").getProperty("/ZPSH"));
          this._oAddSurgicalAntecedentsDialog = oDialog;
          this.getView().addDependent(this._oAddSurgicalAntecedentsDialog);
          oDialog.open();          
        }.bind(this));
      }else{
        this._oAddSurgicalAntecedentsDialog.open()
      }
    },

    /**
     * Open add social habits dialog.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onAddSocialHabits: function () {
      this.setModel(models.createResultsModel(), "NewHabit");
      this.getModel("NewHabit").setProperty("/ZMEDMB_HAB_EVAL", this.getModel("KeyValue").getProperty("/ZMEDMB_HAB_EVAL/0"));
      this.getModel("NewHabit").setProperty("/ZMEDMB_FREQ", this.getModel("KeyValue").getProperty("/ZMEDMB_FREQ/0"));
      this.getModel("NewHabit").setProperty("/ZMEDMB_TOBACCO", this.getModel("KeyValue").getProperty("/ZMEDMB_TOBACCO/0"));
      this.getModel("NewHabit").setProperty("/ZMEDMB_FREQ_UNIT", this.getModel("KeyValue").getProperty("/ZMEDMB_FREQ_UNIT/0"));
      this.getModel("NewHabit").setProperty("/ZMEDMB_FREQ_COND", this.getModel("KeyValue").getProperty("/ZMEDMB_FREQ_COND/0"));

      if(!this._oAddSocialHabitsDialog){
        this.loadFragment({
          type: "XML",
          name: "com.resulto.hcfi.view.AddSocialHabitsDialog"
        }).then(function (oDialog) {
          this.setModel(models.createResultsModel(), "AntecedentFiltered");          
          this.getModel("AntecedentFiltered").setProperty("/ZSHA", this.getModel("Antecedent").getProperty("/ZSHA"));
          this._oAddSocialHabitsDialog = oDialog;
          this.getView().addDependent(this._oAddSocialHabitsDialog);
          oDialog.open();
        }.bind(this));
      }else{
        this._oAddSocialHabitsDialog.open()
      }
    },

    /**
     * Open add allergies dialog.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onAddAllergies: function () {
      this.getModel("NewAllergy").setProperty("/", {
        Allergy: {},
        Adcomment: "",
        Evaluation: this.getModel("KeyValue").getProperty("/N2AD_EVALUATION/0/KeyValue"),
        Typ: this.getModel("KeyValue").getProperty("/N2AD_TYP/0/KeyValue"),
        Cer: this.getModel("KeyValue").getProperty("/N2AD_CER/0/KeyValue"),
        Reactions: []
      });
     
      if(!this._AddAllergies){
        this.loadFragment({
          type: "XML",
          name: "com.resulto.hcfi.view.AddAllergiesDialog"
        }).then(function (oDialog) {
          this._AddAllergies = oDialog;
          this.getView().addDependent(this._AddAllergies);
          this.setModel(models.createResultsModel(), "AllergyFiltered");
          this.getModel("AllergyFiltered").setProperty("/results", this.getModel("Allergy").getProperty("/results"));
          this.getModel("AllergyFiltered").setProperty("/loading", this.getModel("Allergy").getProperty("/loading"));
          this.getModel("AllergyFiltered").setProperty("/NoAllergy", this.getModel("Allergy").getProperty("/NoAllergy"));          
          oDialog.open();
        }.bind(this));
      }else{
        this._AddAllergies.open()
      }
      
    },

    /**
     * Update config to display vital signs
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    configChange: function (oEvent) {
      const itemsSelected = [];
      const keysSelected = oEvent.getParameter("selectedItem").getBindingContext("Config").getObject().configurationToPositions.results.map(x => x.positionId);
      keysSelected.forEach(function (key) {
        itemsSelected.push(this.byId("cbVitalSigns").getItemByKey(key));
      }, this);
      this.byId("cbVitalSigns").setSelectedItems(itemsSelected).fireSelectionFinish({
        selectedItems: itemsSelected.filter(Boolean)
      });
    },

    /**
     * Update vital signs to display
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    vitalSignsSelectionFinish: function (oEvent) {
      if (this.byId("sTimeFilter").getSelectedItem()) {
        const sTimeFilter = this.byId("sTimeFilter").getSelectedItem().getBindingContext("TimeFilter").getObject();
        if (oEvent.getParameter("selectedItems").length)
          this.addTableColumns(oEvent.getParameter("selectedItems").map(x => x.getAdditionalText()), [sTimeFilter.start, sTimeFilter.end]);
        else this.addTableColumns(oEvent.getSource().getItems().map(x => x.getAdditionalText()), [sTimeFilter.start, sTimeFilter.end]);
      }
    },

    /**
     * Select allergy or display childrens in allergy dialog
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onAllergySelect: function (oEvent) {
      const wizard = oEvent.getSource().getParent().getParent();
      const item = oEvent.getParameter("listItem");
      const allergy =JSON.parse(JSON.stringify(item.getBindingContext("AllergyFiltered").getObject()));
      const level = item.getBindingContext("AllergyFiltered").getPath().split("/").map(x => parseInt(x)).filter(Number.isInteger).reduce((a, v) => a + 1 + v, -1);
      item.setSelected(false);
      if (!allergy.IsGroup) {    
        if(allergy.Bcpname == "Otras alergias")     
        allergy.Bcpname = this.byId("AllergiesSearchField").getValue();           
        const alData = { ...allergy };
        wizard.setCurrentStep(wizard.getSteps()[0]).nextStep();
        this.getModel("NewAllergy").setProperty("/Allergy", alData);
      } else item.getExpanded() ? oEvent.getSource().collapse(level) : oEvent.getSource().expand(level);
    },

    /**
     * Update Cer value with N2AD_CER selected value
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onN2AD_CERChange: function (oEvent) {
      this.getModel("NewAllergy").setProperty("/Cer", oEvent.getSource().getSelectedItem().getBindingContext("KeyValue").getProperty("KeyValue"));
    },

    /**
     * Update Evaluation value with N2AD_EVALUATION selected value
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onN2AD_EVALUATIONChange: function (oEvent) {
      this.getModel("NewAllergy").setProperty("/Evaluation", oEvent.getSource().getSelectedItem().getBindingContext("KeyValue").getProperty("KeyValue"));
    },

    /**
     * Update Typ value with N2AD_TYP selected value
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onN2AD_TYPChange: function (oEvent) {
      this.getModel("NewAllergy").setProperty("/Typ", oEvent.getSource().getSelectedItem().getBindingContext("KeyValue").getProperty("KeyValue"));
    },

    /**
     * Update Rea value with N2AD_REA selected value
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onN2AD_REAChange: function (oEvent) {
      const value = oEvent.getSource().getSelectedItem().getBindingContext("KeyValue").getProperty("KeyValue");
      const path = oEvent.getSource().getParent().getBindingContext("NewAllergy").getPath();
      this.getModel("NewAllergy").setProperty(`${path}/Rea`, value);
    },

    /**
     * Update Soa value with N2AD_SOA selected value
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onN2AD_SOAChange: function (oEvent) {
      const value = oEvent.getSource().getSelectedItem().getBindingContext("KeyValue").getProperty("KeyValue");
      const path = oEvent.getSource().getParent().getBindingContext("NewAllergy").getPath();
      this.getModel("NewAllergy").setProperty(`${path}/Soa`, value);
    },

    /**
     * Update EXPLO_MAMX value selected
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onEXPLO_MAMXSelect: function (oEvent) {
      this.getModel("CAD_GINE").setProperty("/content/EXPLO_MAMX/Value", oEvent.getParameter("selected") ? "X" : "");
    },

    /**
     *
     * @param {sap.ui.base.Event} oEvent Event caller
     * @param {string} model - Model name
     * @param {string} property - Property name
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onSelect: function (oEvent, model, property) {
      this.getModel(model).setProperty(`/content/${property}/Value`, oEvent.getParameter("selected") ? "X" : "");
      switch (property) {
        case "EXPLO_MAMX":
          if (model === "CAD_MAM") {
            this.getModel(model).setProperty("/content/MAMA_DER2/Value",
              oEvent.getParameter("selected") ? this.getModel("KeyValue").getProperty("/MAMA_DER2/0/KeyText") : "");
            this.getModel(model).setProperty("/content/X00LA_DER/Value",
              oEvent.getParameter("selected") ? this.getModel("KeyValue").getProperty("/X00LA_DER/0/KeyText") : "");
            this.getModel(model).setProperty("/content/MAMA_IZQ2/Value",
              oEvent.getParameter("selected") ? this.getModel("KeyValue").getProperty("/MAMA_IZQ2/0/KeyText") : "");
            this.getModel(model).setProperty("/content/X00LA_IZQ/Value",
              oEvent.getParameter("selected") ? this.getModel("KeyValue").getProperty("/X00LA_IZQ/0/KeyText") : "");
          } else {

            this.getModel(model).setProperty("/content/MAMA_DER/Value",
              oEvent.getParameter("selected") ? this.getModel("KeyValue").getProperty("/MAMA_DER/0/KeyText") : "");
            this.getModel(model).setProperty("/content/MAMA_IZQ/Value",
              oEvent.getParameter("selected") ? this.getModel("KeyValue").getProperty("/MAMA_IZQ/0/KeyText") : "");
            //   this.getModel(model).setProperty("/content/AXILA_DER/Value", this.getModel("KeyValue").getProperty("/AXILA_DER/0/KeyText"));
            //   this.getModel(model).setProperty("/content/AXILA_IZQ/Value", this.getModel("KeyValue").getProperty("/AXILA_IZQ/0/KeyText"));
          }
          break;
        case "ECOX_GIN":
          this.getModel(model).setProperty("/content/UTERO_GIN/Value",
            oEvent.getParameter("selected") ? this.getModel("KeyValue").getProperty("/UTERO_GIN/0/KeyText") : "");
          this.getModel(model).setProperty("/content/ENDOM_GIN/Value",
            oEvent.getParameter("selected") ? this.getModel("KeyValue").getProperty("/ENDOM_GIN/0/KeyText") : "");
          this.getModel(model).setProperty("/content/OVARIO_DER/Value",
            oEvent.getParameter("selected") ? this.getModel("KeyValue").getProperty("/OVARIO_DER/0/KeyText") : "");
          this.getModel(model).setProperty("/content/OVARIO_IZQ/Value",
            oEvent.getParameter("selected") ? this.getModel("KeyValue").getProperty("/OVARIO_IZQ/0/KeyText") : "");
          this.getModel(model).setProperty("/content/ECO_GIN_OB/Value",
            oEvent.getParameter("selected") ? "" : "");
          //:Check AÑADIR OBSERVACIONES POSIBLEMENTE
          break;
        case "ECOX_MAM":
          if (model === "CAD_MAM") {
            this.getModel(model).setProperty("/content/ECO_MAM_T2/Value",
              oEvent.getParameter("selected") ? this.getModel("KeyValue").getProperty("/ECO_MAM_T2/0/KeyText") : "");
          } else {
            this.getModel(model).setProperty("/content/ECO_MAM_TX/Value",
              oEvent.getParameter("selected") ? this.getModel("KeyValue").getProperty("/ECO_MAM_TX/0/KeyText") : "");
          }
          break;
        case "MOV_FTRADI":
          var rMOV_FTRADI = this.byId('container-hcfi---Main--cadae--rMOV_FTRADC');
          if (model === "CAD_AE" && oEvent.getParameter("selected")) {
            rMOV_FTRADI.setSelectedIndex(1);
            this.getModel("CAD_AE").setProperty("/content/MOV_FTRADC/Value",
              rMOV_FTRADI.getSelectedButton().getBindingContext("KeyValue").getObject().KeyValue);
          } else {
            rMOV_FTRADI.setSelectedIndex(0);
            this.getModel("CAD_AE").setProperty("/content/MOV_FTRADC/Value", "");
          }
      }
    },

    onDIAG_GINChange: function (oEvent) {
      this.getModel("CAD_GINE").setProperty("/content/DIAG_GIN/Value", oEvent.getParameter("value"));
    },

    onDIAG_MAMChange: function (oEvent) {
      //Al principio guarda la posicion del elemento en la lista, 
      //Luego al hacer el set guarda el valor en vez de la key.
      this.getModel("CAD_MAM").setProperty("/content/DIAG_MAM/Value", oEvent.getParameter("value"));
    },

    onDERIV_GINChange: function (oEvent) {
      this.getModel("CAD_GINE").setProperty("/content/DERIV_GIN/Value", oEvent.getParameter("value"));
    },

    /**
     * Update ENTR_INF value with ENTR_INF selected value
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onENTR_INFSelect: function (oEvent) {
      this.getModel("CAD_GINE").setProperty(`${oEvent.getSource().getParent().getBindingContext("CAD_GINE").getPath()}/ENTR_INF`, oEvent.getParameter("selected") ? "X" : "");
    },

    /**
     * Update calculated weeks and days when EMB_CTRFUR change
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onEMB_CTRFURChange: function (oEvent) {
      if (!this.getModel("CAD_CTREMB").getProperty("/content/EMB_FURCOR/Value")) this.onEMB_FURCORChange(oEvent);
    },

    /**
     * Update calculated weeks and days when EMB_FURCOR change
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onEMB_FURCORChange: function (oEvent) {
      const EMB_FURCOR = oEvent.getSource().getDateValue();
      const EMB_CTRFPP = new Date();
      if (EMB_FURCOR) {
        EMB_CTRFPP.setTime(EMB_FURCOR.getTime() + 7 * 40 * 24 * 60 * 60 * 1000);
        this.getModel("CAD_CTREMB").setProperty("/content/EMB_CTRFPP/Value", DateFormat.getDateTimeInstance({ pattern: "dd.MM.yyy" }).format(EMB_CTRFPP));
        this.getModel("CAD_CTREMB").getProperty("/FirstTrimester").map(c => {
          const CTRECOFECHSplit = c.CTRECOFECH.split(".");
          const CTRECOFECH = new Date(CTRECOFECHSplit[2], CTRECOFECHSplit[1] - 1, CTRECOFECHSplit[0]);
          c.EGSEMANAS = Math.floor((CTRECOFECH.getTime() - EMB_FURCOR.getTime()) / (1000 * 3600 * 24) / 7);
          c.EGDIAS = Math.floor((CTRECOFECH.getTime() - EMB_FURCOR.getTime()) / (1000 * 3600 * 24) % 7);
        });
        this.getModel("CAD_CTREMB").getProperty("/SecondTrimester").map(c => {
          const X00ECOFECHSplit = c.X00ECOFECH.split(".");
          const X00ECOFECH = new Date(X00ECOFECHSplit[2], X00ECOFECHSplit[1] - 1, X00ECOFECHSplit[0]);
          c.X00EMANAS = Math.floor((X00ECOFECH.getTime() - EMB_FURCOR.getTime()) / (1000 * 3600 * 24) / 7);
          c.X00IAS = Math.floor((X00ECOFECH.getTime() - EMB_FURCOR.getTime()) / (1000 * 3600 * 24) % 7);
        });
        this.getModel("CAD_CTREMB").getProperty("/ThirdTrimester").map(c => {
          const X01ECOFECHSplit = c.CTRECOFECH.split(".");
          const X01ECOFECH = new Date(X01ECOFECHSplit[2], X01ECOFECHSplit[1] - 1, X01ECOFECHSplit[0]);
          c.X01EMANAS = Math.floor((X01ECOFECH.getTime() - EMB_FURCOR.getTime()) / (1000 * 3600 * 24) / 7);
          c.X01IAS = Math.floor((X01ECOFECH.getTime() - EMB_FURCOR.getTime()) / (1000 * 3600 * 24) % 7);
        });
        this.getModel("CAD_CTREMB").getProperty("/Monitors").map(c => {
          const EMBMONFECHSplit = c.EMBMONFECH.split(".");
          const EMBMONFECH = new Date(EMBMONFECHSplit[2], EMBMONFECHSplit[1] - 1, EMBMONFECHSplit[0]);
          c.X02EMANAS = Math.floor((EMBMONFECH.getTime() - EMB_FURCOR.getTime()) / (1000 * 3600 * 24) / 7);
          c.X02IAS = Math.floor((EMBMONFECH.getTime() - EMB_FURCOR.getTime()) / (1000 * 3600 * 24) % 7);
        });

        this.getModel("CAD_CTREMB").getProperty("/Births").map(c => {
          const X00TOFECHASplit = c.X00TOFECHA.split(".");
          const X00TOFECHA = new Date(X00TOFECHASplit[2], X00TOFECHASplit[1] - 1, X00TOFECHASplit[0]);
          const ss = Math.floor((X00TOFECHA.getTime() - EMB_FURCOR.getTime()) / (1000 * 3600 * 24) / 7);
          const dd = Math.floor((X00TOFECHA.getTime() - EMB_FURCOR.getTime()) / (1000 * 3600 * 24) % 7);
          c.X00EMANAS = `${ss} SS ${dd} d`;
        });

        // const PARTOFECHASplit = this.getModel("CAD_CTREMB").getProperty("/content/PARTOFECHA/Value").split(".");
        // const PARTOFECHA = new Date(PARTOFECHASplit[2], PARTOFECHASplit[1] - 1, PARTOFECHASplit[0]);
        // this.getModel("CAD_CTREMB").setProperty("/content/X03EMANAS/Value", Math.floor((PARTOFECHA.getTime() - EMB_FURCOR.getTime()) / (1000 * 3600 * 24) / 7));
        this.getModel("CAD_CTREMB").updateBindings(true);
      }
    },

    onTIPOEMBARChange: function (oEvent) {
      this.getModel("CAD_CTREMB").setProperty("/content/TIPOEMBAR/Value", oEvent.getParameter("value"));
    },

    onPARTOFECHAChange: function (oEvent) {
      const PARTOFECHA = oEvent.getSource().getDateValue();
      const EMB_FURCORSplit = this.getModel("CAD_CTREMB").getProperty("/content/EMB_FURCOR/Value").split(".");
      const EMB_FURCOR = new Date(EMB_FURCORSplit[2], EMB_FURCORSplit[1] - 1, EMB_FURCORSplit[0]);
      this.getModel("CAD_CTREMB").setProperty("/content/X03EMANAS/Value", Math.floor((PARTOFECHA.getTime() - EMB_FURCOR.getTime()) / (1000 * 3600 * 24) / 7));
    },

    onMOV_FDATDIChange: function (oEvent) {
      const MOV_FDATDI = oEvent.getSource().getDateValue();
      this.getModel("CAD_CTREMB").setProperty("/content/MOV_FDATDI/Value", DateFormat.getDateTimeInstance({ pattern: "dd.MM.yyyy" }).format(MOV_FDATDI));
    },

    /**
     * Update number of entries when EMBRIONES change
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onEMBRIONESChange: function (oEvent) {
      const newLength = parseInt(oEvent.getParameter("value"));
      const sexT2 = this.getModel("CAD_CTREMB").getProperty("/SexT2");
      const sexT3 = this.getModel("CAD_CTREMB").getProperty("/SexT3");
      const lastLength = sexT2.length;
      const births = this.getModel("CAD_CTREMB").getProperty("/Births");
      const firstTrimester = this.getModel("CAD_CTREMB").getProperty("/FirstTrimester");
      const newFirstTrimester = [];
      const secondTrimester = this.getModel("CAD_CTREMB").getProperty("/SecondTrimester");
      const newSecondTrimester = [];
      const thirdTrimester = this.getModel("CAD_CTREMB").getProperty("/ThirdTrimester");
      const newThirdTrimester = [];
      if (lastLength > newLength) {
        sexT2.length = newLength;
        sexT3.length = newLength;
        births.length = newLength;
        for (let i = 0; i < firstTrimester.length; i += lastLength) {
          const chunk = firstTrimester.slice(i, i + lastLength);
          chunk.length = newLength;
          newFirstTrimester.push(chunk);
        }
        for (let i = 0; i < secondTrimester.length; i += lastLength) {
          const chunk = secondTrimester.slice(i, i + lastLength);
          chunk.length = newLength;
          newSecondTrimester.push(chunk);
        }
        for (let i = 0; i < thirdTrimester.length; i += lastLength) {
          const chunk = thirdTrimester.slice(i, i + lastLength);
          chunk.length = newLength;
          newThirdTrimester.push(chunk);
        }
      } else {
        for (let i = sexT2.length; i < newLength; i++) sexT2.push({ EMB_EMBID: i + 1, EMB_SEXO: this.getModel("KeyValue").getProperty("/EMB_SEXO/0") });
        for (let i = sexT3.length; i < newLength; i++) sexT3.push({ X00_EMBID: i + 1, X00_SEXO: this.getModel("KeyValue").getProperty("/X00_SEXO/0") });
        for (let i = births.length; i < newLength; i++) births.push({
          X01_EMBID: i + 1,
          X00TOFECHA: "",
          X00TOHORA: "",
          EGAMPLIADA: "",
          X00TOTIPO: "",
          X00TOCESAR: "",
          DECESO: "",
          NACPESO: "",
          NACSEXO: "",
          APGAR: "",
          ALUMBRA: "",
          CORDON: "",
          PH: "",
          X00TOFINTP: "",
        });
        for (let i = 0; i < firstTrimester.length; i += lastLength) {
          const chunk = firstTrimester.slice(i, i + lastLength);
          for (let j = lastLength; j < newLength; j++) chunk.push({
            CTRECOID: chunk[0].CTRECOID,
            CTRECOFECH: chunk[0].CTRECOFECH,
            X02_EMBID: j + 1,
            EGSEMANAS: chunk[0].EGSEMANAS,
            EGDIAS: chunk[0].EGDIAS,
            CTRECOTA: chunk[0].CTRECOTA,
            CTRECOKG: chunk[0].CTRECOKG,
            CTRECOCOM: chunk[0].CTRECOCOM,
            CTRECOTROB: chunk[0].CTRECOTROB,
            CREATED_BY: chunk[0].CREATED_BY
          });
          newFirstTrimester.push(chunk);
        }
        for (let i = 0; i < secondTrimester.length; i += lastLength) {
          const chunk = secondTrimester.slice(i, i + lastLength);
          for (let j = lastLength; j < newLength; j++) chunk.push({
            X00ECOID: chunk[0].X00ECOID,
            X00ECOFECH: chunk[0].X00ECOFECH,
            X03_EMBID: j + 1,
            X00EMANAS: chunk[0].X00EMANAS,
            X00IAS: chunk[0].X00IAS,
            X00ECOTA: chunk[0].X00ECOTA,
            X00ECOKG: chunk[0].X00ECOKG,
            CTRECOPRES: chunk[0].CTRECOPRES,
            CTRECOFC: chunk[0].CTRECOFC,
            CTRECOPFE: chunk[0].CTRECOPFE,
            CTRECOACOR: chunk[0].CTRECOACOR,
            CTRECOLA: chunk[0].CTRECOLA,
            CTRECOPLAC: chunk[0].CTRECOPLAC,
            CTRECODOPP: chunk[0].CTRECODOPP,
            CTRECOMORF: chunk[0].CTRECOMORF,
            X00ECOTROB: chunk[0].X00ECOTROB,
            X00ATED_BY: chunk[0].X00ATED_BY,
          });
          newSecondTrimester.push(chunk);
        }
        for (let i = 0; i < thirdTrimester.length; i += lastLength) {
          const chunk = thirdTrimester.slice(i, i + lastLength);
          for (let j = lastLength; j < newLength; j++) chunk.push({
            X01ECOID: chunk[0].X01ECOID,
            X01ECOFECH: chunk[0].X01ECOFECH,
            X04_EMBID: j + 1,
            X01EMANAS: chunk[0].X01EMANAS,
            X01IAS: chunk[0].X01IAS,
            X01ECOTA: chunk[0].X01ECOTA,
            X01ECOKG: chunk[0].X01ECOKG,
            X00ECOPRES: chunk[0].X00ECOPRES,
            X00ECOFC: chunk[0].X00ECOFC,
            X00ECOPFE: chunk[0].X00ECOPFE,
            X00ECOACOR: chunk[0].X00ECOACOR,
            X00ECOLA: chunk[0].X00ECOLA,
            X00ECOPLAC: chunk[0].X00ECOPLAC,
            X00ECODOPP: chunk[0].X00ECODOPP,
            X00ECOMORF: chunk[0].X00ECOMORF,
            X01ECOTROB: chunk[0].X01ECOTROB,
            X01ATED_BY: chunk[0].X01ATED_BY,
          });
          newThirdTrimester.push(chunk);
        }
      }
      this.getModel("CAD_CTREMB").setProperty("/FirstTrimester", newFirstTrimester.flat());
      this.getModel("CAD_CTREMB").setProperty("/SecondTrimester", newSecondTrimester.flat());
      this.getModel("CAD_CTREMB").setProperty("/ThirdTrimester", newThirdTrimester.flat());
    },

    onPARTOTIPOChange: function (oEvent) {
      this.getModel("CAD_CTREMB").setProperty("/content/PARTOTIPO/Value", oEvent.getParameter("value"));
    },

    /**
     * Open add ultrasound dialog.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onAddUltrasoundControlPressed: function (table) {
      const fur = this.getModel("CAD_CTREMB").getProperty("/content/EMB_FURCOR/Value") || this.getModel("CAD_CTREMB").getProperty("/content/EMB_CTRFUR/Value");
      const embriones = parseInt(this.getModel("CAD_CTREMB").getProperty("/content/EMBRIONES/Value") || 0);
      if (!fur) MessageBox.error(this.getModel("i18n").getProperty("FURRequiredField"));
      if (!embriones) MessageBox.error(this.getModel("i18n").getProperty("EMBRIONESRequiredField"));
      else {
        const furSplit = fur.split(".");
        const furDate = new Date(furSplit[2], furSplit[1] - 1, furSplit[0]);
        this.loadFragment({ type: "XML", name: "com.resulto.hcfi.view.CAD_CTREMB.AddUltrasoundControlDialog" }).then(oDialog => {
          oDialog.getContent()[1].setMaxDate(new Date()).setMinDate(furDate);
          oDialog.setModel(new sap.ui.model.json.JSONModel({ table: table })).open();
        });
      }
    },

    /**
     * Clear and close ultrasound dialog
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onCancelAddUltrasoundControlDialog: function (oEvent) {
      oEvent.getSource().getParent().close();
      oEvent.getSource().getParent().destroy();
    },

    /**
     * Save new ultrasound
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onSaveAddUltrasoundControlDialog: function (oEvent) {
      const date = oEvent.getSource().getParent().getContent()[1].getDateValue();
      const bloodPressure = oEvent.getSource().getParent().getContent()[3].getValue();
      const weight = oEvent.getSource().getParent().getContent()[5].getValue();
      if (!date) MessageBox.error(this.getModel("i18n").getProperty("NewUltrasoundControlRequiredField"));
      else {
        const fur = this.getModel("CAD_CTREMB").getProperty("/content/EMB_FURCOR/Value") || this.getModel("CAD_CTREMB").getProperty("/content/EMB_CTRFUR/Value");
        const furSplit = fur.split(".");
        const furDate = new Date(furSplit[2], furSplit[1] - 1, furSplit[0]);
        const tableName = oEvent.getSource().getParent().getModel().getProperty("/table");
        const id = oEvent.getSource().getParent().getModel().getProperty("/id");
        const uuid = this.uuidv4();
        for (let i = 0; i < parseInt(this.getModel("CAD_CTREMB").getProperty("/content/EMBRIONES/Value")); i++) {
          switch (tableName) {
            case "/FirstTrimester":
              if (id) {
                const item = this.getModel("CAD_CTREMB").getProperty(tableName).find(row => row.CTRECOID === id && row.X02_EMBID == i + 1);
                item.CTRECOFECH = DateFormat.getDateTimeInstance({ pattern: "dd.MM.yyy" }).format(date);
                item.EGSEMANAS = Math.floor((date.getTime() - furDate.getTime()) / (1000 * 3600 * 24) / 7);
                item.EGDIAS = Math.floor((date.getTime() - furDate.getTime()) / (1000 * 3600 * 24) % 7);
                item.CTRECOTA = bloodPressure;
                item.CTRECOKG = weight;
              } else this.getModel("CAD_CTREMB").getProperty(tableName).push({
                CTRECOID: uuid,
                CTRECOFECH: DateFormat.getDateTimeInstance({ pattern: "dd.MM.yyy" }).format(date),
                X02_EMBID: i + 1,
                EGSEMANAS: Math.floor((date.getTime() - furDate.getTime()) / (1000 * 3600 * 24) / 7),
                EGDIAS: Math.floor((date.getTime() - furDate.getTime()) / (1000 * 3600 * 24) % 7),
                CTRECOTA: bloodPressure,
                CTRECOKG: weight,
                CTRECOCOM: this.getModel("KeyValue").getProperty("/CTRECOCOM/0/KeyText"),
                CREATED_BY: ""
              });
              break;
            case "/SecondTrimester":
              if (id) {
                const item = this.getModel("CAD_CTREMB").getProperty(tableName).find(row => row.X00ECOID === id && row.X03_EMBID == i + 1);
                item.X00ECOFECH = DateFormat.getDateTimeInstance({ pattern: "dd.MM.yyy" }).format(date);
                item.X00EMANAS = Math.floor((date.getTime() - furDate.getTime()) / (1000 * 3600 * 24) / 7);
                item.X00IAS = Math.floor((date.getTime() - furDate.getTime()) / (1000 * 3600 * 24) % 7);
                item.X00ECOTA = bloodPressure;
                item.X00ECOKG = weight;
              } else this.getModel("CAD_CTREMB").getProperty(tableName).push({
                X00ECOID: uuid,
                X00ECOFECH: DateFormat.getDateTimeInstance({ pattern: "dd.MM.yyy" }).format(date),
                X03_EMBID: i + 1,
                X00EMANAS: Math.floor((date.getTime() - furDate.getTime()) / (1000 * 3600 * 24) / 7),
                X00IAS: Math.floor((date.getTime() - furDate.getTime()) / (1000 * 3600 * 24) % 7),
                X00ECOTA: bloodPressure,
                X00ECOKG: weight,
                CTRECOPRES: "",
                CTRECOFC: "",
                CTRECOPFE: "",
                CTRECOACOR: "",
                CTRECOLA: "",
                CTRECOPLAC: "",
                CTRECODOPP: "",
                CTRECOMORF: "",
                X00ATED_BY: ""
              });
              break;
            case "/ThirdTrimester":
              if (id) {
                const item = this.getModel("CAD_CTREMB").getProperty(tableName).find(row => row.X01ECOID === id && row.X04_EMBID == i + 1);
                item.X01ECOFECH = DateFormat.getDateTimeInstance({ pattern: "dd.MM.yyy" }).format(date);
                item.X01EMANAS = Math.floor((date.getTime() - furDate.getTime()) / (1000 * 3600 * 24) / 7);
                item.X01IAS = Math.floor((date.getTime() - furDate.getTime()) / (1000 * 3600 * 24) % 7);
                item.X01ECOTA = bloodPressure;
                item.X01ECOKG = weight;
              } else this.getModel("CAD_CTREMB").getProperty(tableName).push({
                X01ECOID: uuid,
                X01ECOFECH: DateFormat.getDateTimeInstance({ pattern: "dd.MM.yyy" }).format(date),
                X04_EMBID: i + 1,
                X01EMANAS: Math.floor((date.getTime() - furDate.getTime()) / (1000 * 3600 * 24) / 7),
                X01IAS: Math.floor((date.getTime() - furDate.getTime()) / (1000 * 3600 * 24) % 7),
                X01ECOTA: bloodPressure,
                X01ECOKG: weight,
                X00ECOPRES: "",
                X00ECOFC: "",
                X00ECOPFE: "",
                X00ECOACOR: "",
                X00ECOLA: "",
                X00ECOPLAC: "",
                X00ECODOPP: "",
                X00ECOMORF: "",
                X01ATED_BY: ""
              });
              break;
          }
        }
        this.getModel("CAD_CTREMB").updateBindings(true);
        this.onCancelAddUltrasoundControlDialog(oEvent);
      }
    },

    /**
     * Edit selected ultrasound
     * @param {sap.ui.base.Event} oEvent Event caller
     * @param {string} table Trimester table
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onEditUltrasoundControl: function (oEvent, table) {
      const fur = this.getModel("CAD_CTREMB").getProperty("/content/EMB_FURCOR/Value") || this.getModel("CAD_CTREMB").getProperty("/content/EMB_CTRFUR/Value");
      const embriones = parseInt(this.getModel("CAD_CTREMB").getProperty("/content/EMBRIONES/Value") || 0);
      if (!fur) MessageBox.error(this.getModel("i18n").getProperty("FURRequiredField"));
      if (!embriones) MessageBox.error(this.getModel("i18n").getProperty("EMBRIONESRequiredField"));
      else {
        const furSplit = fur.split(".");
        const furDate = new Date(furSplit[2], furSplit[1] - 1, furSplit[0]);
        const row = oEvent.getParameter("item").getBindingContext("CAD_CTREMB").getObject();
        this.loadFragment({ type: "XML", name: "com.resulto.hcfi.view.CAD_CTREMB.AddUltrasoundControlDialog" }).then(oDialog => {
          switch (table) {
            case "/FirstTrimester":
              oDialog.getContent()[1].setMaxDate(new Date()).setMinDate(furDate).setValue(row.CTRECOFECH);
              oDialog.getContent()[3].setValue(row.CTRECOTA);
              oDialog.getContent()[5].setValue(parseFloat(row.CTRECOKG));
              oDialog.setModel(new sap.ui.model.json.JSONModel({ table: table, id: row.CTRECOID })).open();
              break;
            case "/SecondTrimester":
              oDialog.getContent()[1].setMaxDate(new Date()).setMinDate(furDate).setValue(row.X00ECOFECH);
              oDialog.getContent()[3].setValue(row.X00ECOTA);
              oDialog.getContent()[5].setValue(parseFloat(row.X00ECOKG));
              oDialog.setModel(new sap.ui.model.json.JSONModel({ table: table, id: row.X00ECOID })).open();
              break;
            case "/ThirdTrimester":
              oDialog.getContent()[1].setMaxDate(new Date()).setMinDate(furDate).setValue(row.X01ECOFECH);
              oDialog.getContent()[3].setValue(row.X01ECOTA);
              oDialog.getContent()[5].setValue(parseFloat(row.X01ECOKG));
              oDialog.setModel(new sap.ui.model.json.JSONModel({ table: table, id: row.X01ECOID })).open();
              break;
          }
        });
      }
    },

    /**
     * Delete selected ultrasound
     * @param {sap.ui.base.Event} oEvent Event caller
     * @param {string} table Trimester table
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onDeleteUltrasoundControl: function (oEvent, table) {
      const o = oEvent.getParameter("item").getBindingContext("CAD_CTREMB").getObject();
      this.getModel("CAD_CTREMB").setProperty(table, this.getModel("CAD_CTREMB").getProperty(table).filter(i => {
        switch (table) {
          case "/FirstTrimester":
            return i["CTRECOID"] !== o["CTRECOID"];
          case "/SecondTrimester":
            return i["X00ECOID"] !== o["X00ECOID"];
          case "/ThirdTrimester":
            return i["X01ECOID"] !== o["X01ECOID"];
        }
        return true;
      }));
    },

    /**
     * Open add monitor dialog.
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onAddMonitorsPressed: function () {
      const now = new Date();
      const fur = this.getModel("CAD_CTREMB").getProperty("/content/EMB_FURCOR/Value") || this.getModel("CAD_CTREMB").getProperty("/content/EMB_CTRFUR/Value");
      if (fur) {
        const furSplit = fur.split(".");
        const furDate = new Date(furSplit[2], furSplit[1] - 1, furSplit[0]);
        this.getModel("CAD_CTREMB").getProperty("/Monitors").push({
          EMBMONFECH: DateFormat.getDateTimeInstance({ pattern: "dd.MM.yyyy" }).format(now),
          X02EMANAS: Math.floor((now.getTime() - furDate.getTime()) / (1000 * 3600 * 24) / 7),
          X02IAS: Math.floor((now.getTime() - furDate.getTime()) / (1000 * 3600 * 24) % 7),
          EMBMONREG: "",
          EMBMONTACT: "",
        });
        this.getModel("CAD_CTREMB").updateBindings(true);
      } else MessageBox.error(this.getModel("i18n").getProperty("FURRequiredField"));
    },

    /**
     * Update calculated weeks and days when EMBMONFECH change
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onEMBMONFECHChange: function (oEvent) {
      const EMBMONFECH = oEvent.getSource().getDateValue();
      const fur = this.getModel("CAD_CTREMB").getProperty("/content/EMB_FURCOR/Value") || this.getModel("CAD_CTREMB").getProperty("/content/EMB_CTRFUR/Value");
      const furSplit = fur.split(".");
      const furDate = new Date(furSplit[2], furSplit[1] - 1, furSplit[0]);
      const o = oEvent.getSource().getBindingContext("CAD_CTREMB").getObject();
      o.X02EMANAS = Math.floor((EMBMONFECH.getTime() - furDate.getTime()) / (1000 * 3600 * 24) / 7);
      o.X02IAS = Math.floor((EMBMONFECH.getTime() - furDate.getTime()) / (1000 * 3600 * 24) % 7);
      this.getModel("CAD_CTREMB").updateBindings(true);
    },

    /**
     * Delete selected monitor
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onDeleteMonitors: function (oEvent) {
      this.getModel("CAD_CTREMB").setProperty(oEvent.getParameter("listItem").getBindingContextPath(), null);
      this.getModel("CAD_CTREMB").setProperty("/Monitors", this.getModel("CAD_CTREMB").getProperty("/Monitors").filter(Boolean));
    },

    /**
     * Add new AfterbirthReview
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onAddAfterbirthReviewPressed: function () {
      this.getModel("CAD_CTREMB").getProperty("/AfterbirthReview").push({
        REVPPFECHA: DateFormat.getDateTimeInstance({ pattern: "dd.MM.yyyy" }).format(new Date()),
        REVPPESTGN: "",
        REVPPECO: "",
        REVPPOBS: "",
      });
      this.getModel("CAD_CTREMB").updateBindings(true);
    },

    /**
     * Delete selected AfterbirthReview
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onDeleteAfterbirthReview: function (oEvent) {
      this.getModel("CAD_CTREMB").setProperty(oEvent.getParameter("listItem").getBindingContextPath(), null);
      this.getModel("CAD_CTREMB").setProperty("/AfterbirthReview", this.getModel("CAD_CTREMB").getProperty("/AfterbirthReview").filter(Boolean));
    },

    /**
     * Add new Reaction
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onAddReaction: function () {
      const reactions = this.getModel("NewAllergy").getProperty("/Reactions");
      reactions.push({
        Patnr: this.headers.Patient,
        AllergySeqno: "99999",
        ReactSeqno: reactions.length,
        Rea: this.getModel("KeyValue").getProperty("/N2AD_REA/0/KeyValue"),
        Soa: this.getModel("KeyValue").getProperty("/N2AD_SOA/0/KeyValue"),
      });
      this.getModel("NewAllergy").refresh(true);
    },

    /**
     * Delete selected samples
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onRemoveSelectedSamples: function (oEvent) {
      const reactions = this.getModel("NewAllergy").getProperty("/Reactions");
      oEvent.getSource().getParent().getParent().getSelectedItems().forEach(i => {
        i.getBindingContext("NewAllergy").getObject().ReactSeqno = null;
      });
      this.getModel("NewAllergy").setProperty("/Reactions", reactions.filter(r => r.ReactSeqno !== null));
      oEvent.getSource().getParent().getParent().removeSelections(true);
    },

    /**
     * Clear and close allergy antecedents dialog
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onCancelAddAllergiesAntecedentsDialog: function (oEvent) {
      this.getModel("Allergy").setProperty("/NoAllergy", this.noAllergy);
      this.getModel("NewFamilyHistory").setProperty("/", {
        Antecedent: {},
        Father: false,
        Mother: false,
        Brother: false,
        Sister: false,
        PaternalGrandparent: false,
        MaternalGrandparent: false,
        Children: false,
        Comments: "",
        Observations: ""
      });
      this.getModel("NewMedicalHistory").setProperty("/", { Antecedent: {}, Date: null, Medication: "", Comments: "", Observations: "" });
      this.getModel("NewSurgeryHistory").setProperty("/", { Antecedent: {}, Date: null, Comments: "", Observations: "" });
      this.getModel("NewHabit").setProperty("/", {
        Antecedent: {},
        ZMEDMB_HAB_EVAL: {},
        From: "",
        To: "",
        ZMEDMB_FREQ: {},
        ZMEDMB_TOBACCO: {},
        ZMEDMB_FREQ_UNIT: {},
        ZMEDMB_FREQ_COND: {},
        GrWeek: "",
        Comments: ""
      });
      if (this.byId("N2AD_CER")) this.byId("N2AD_CER").setSelectedKey();
      if (this.byId("N2AD_EVALUATION")) this.byId("N2AD_EVALUATION").setSelectedKey();
      if (this.byId("N2AD_TYP")) this.byId("N2AD_TYP").setSelectedKey();
      if (this.byId("ZMEDMB_HAB_EVAL")) this.byId("ZMEDMB_HAB_EVAL").setSelectedKey();
      if (this.byId("ZMEDMB_FREQ")) this.byId("ZMEDMB_FREQ").setSelectedKey();
      if (this.byId("ZMEDMB_TOBACCO")) this.byId("ZMEDMB_TOBACCO").setSelectedKey();
      if (this.byId("ZMEDMB_FREQ_UNIT")) this.byId("ZMEDMB_FREQ_UNIT").setSelectedKey();
      if (this.byId("ZMEDMB_FREQ_COND")) this.byId("ZMEDMB_FREQ_COND").setSelectedKey();
     
      this.closeAddAllergiesDialog(oEvent)
           
      //this.destroyDialog(oEvent);
      
    },

    /**
     * Save new allergy
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onSaveAddAllergiesDialog: function (oEvent, cntinue) {
      const dialog = oEvent.getSource().getParent();
      const wizard = oEvent.getSource().getParent().getContent()[0];

      dialog.setBusy(true);
      const allergy = this.getModel("NewAllergy").getData();
      if (this.noAllergy !== this.getModel("Allergy").getProperty("/NoAllergy")) this.setNoReferredAllergy();
      if (!this.getModel("Allergy").getProperty("/NoAllergy")) {
        const data = {
          Patnr: this.headers.Patient,
          AllergySeqno: "99999",
          Bchid: allergy.Allergy.Bchid,
          Bcpid: allergy.Allergy.Bcpid,
          BchidAgr: allergy.Allergy.BchidAgr,
          BcpidAgr: allergy.Allergy.BcpidAgr,
          Adcomment: allergy.Adcomment,
          Evaluation: allergy.Evaluation,
          Typ: allergy.Typ,
          Cer: allergy.Cer,
          // Campos vacios
          Agr: "",
          Mdtyp: "",
          Drugid: null,
          Agentid: null,
          Descr: "",
          DescrOt: "",
          AdcommentLt: false,
          BchidTyp: "",
          BcpidTyp: "",
          BchidCer: "",
          BcpidCer: "",
          Responsible: "",
          Ereason: "",
          CancelReason: "",
          CancelFlag: false,
          Nor: "",
          reactions: allergy.Reactions.map((r, i) => {
            return {
              Patnr: this.headers.Patient,
              AllergySeqno: "99999",
              ReactSeqno: i.toString(),
              Rea: r.Rea,
              Soa: r.Soa,
              // Campos vacios
              BchidRea: "",
              BcpidRea: "",
              BchidSoa: "",
              BcpidSoa: "",
              Ereason: "",
              CreateDate: null,
              CreateTime: "PT00H00M00S",
              CreateUser: "",
              UpdateDate: null,
              UpdateTime: "PT00H00M00S",
              UpdateUser: "",
              CancelDate: null,
              CancelTime: "PT00H00M00S",
              CancelUser: "",
              CancelReason: "",
              CancelFlag: false
            };
          })
        };
        if (!allergy.Allergy.Bchid && !allergy.Allergy.Bcpid) {
          data.Descr = allergy.Allergy.Bcpname;
        }
        this.getModel("ZISH_HCFI_SRV").create("/AllergySet", data, {
          success: function () {
            wizard.discardProgress(wizard.getSteps()[0]);
            wizard.getSteps()[0].getContent()[1].collapseAll();
            this.getMedicalDataOverview();
            dialog.setBusy(false);
            this.byId("N2AD_CER").setSelectedKey("")
            this.byId("N2AD_EVALUATION").setSelectedKey("")
            this.byId("N2AD_TYP").setSelectedKey("")
            this.byId("reactionType").setSelectedKey("")
            this.byId("gravity").setSelectedKey("")

            this.getModel("NewAllergy").setProperty("/", {
              Allergy: {},
              Adcomment: "",
              Evaluation: this.getModel("KeyValue").getProperty("/N2AD_EVALUATION/0/KeyValue"),
              Typ: this.getModel("KeyValue").getProperty("/N2AD_TYP/0/KeyValue"),
              Cer: this.getModel("KeyValue").getProperty("/N2AD_CER/0/KeyValue"),
              Reactions: []
            });
            if (!cntinue) {

              dialog.close();
              
            }
          }.bind(this),
          error: function (oError) {
            dialog.setBusy(false);
            try {
              this.displayOdataError("AllergySet", JSON.parse(oError.responseText).error.message.value);
            } catch {
              this.displayOdataError("AllergySet", oError.message);
            }
          }.bind(this),
        });
      } else {
        this.getMedicalDataOverview();
        dialog.setBusy(false);
        dialog.close();
        //dialog.destroy();
      }
    },

    onUpdateAllergies: function(source){
      let allergy = this.getModel("NewAllergy").getData();

      const data = {
        Patnr: this.headers.Patient,
        AllergySeqno: allergy.AllergySeqno,
        Bchid: allergy.Bchid,
        Bcpid: allergy.Bcpid,
        BchidAgr: allergy.Allergy.Bchid,
        BcpidAgr: allergy.Allergy.Bcpid,
        Adcomment: allergy.Adcomment,
        Evaluation: allergy.Evaluation,
        Typ: allergy.Typ,
        Cer: allergy.Cer,
        // Campos vacios
        Agr: allergy.Agr,
        Mdtyp: allergy.Mdtyp,
        Drugid: allergy.Drugid,
        Agentid: allergy.Agentid,
        Descr: allergy.Descr,
        DescrOt: allergy.DescrOt,
        AdcommentLt: allergy.AdcommentLt,
        BchidTyp: allergy.BchidTyp,
        BcpidTyp: allergy.BcpidTyp,
        BchidCer: allergy.BchidCer,
        BcpidCer: allergy.BcpidCer,
        Responsible: allergy.Responsible,
        Ereason: allergy.Ereason,
        CancelReason: allergy.CancelReason,
        CancelFlag: allergy.CancelFlag,
        Nor: allergy.Nor,
        reactions: allergy.Reactions.map((r, i) => {
          return {
            Patnr: this.headers.Patient,
            AllergySeqno: allergy.AllergySeqno,
            ReactSeqno: i.toString(),
            Rea: r.Rea,
            Soa: r.Soa,
            // Campos vacios
            BchidRea: r.BchidRea,
            BcpidRea: r.BcpidRea,
            BchidSoa: r.BchidSoa,
            BcpidSoa: r.BcpidSoa,
            Ereason: r.Ereason,
            CreateDate: null,
            CreateTime: "PT00H00M00S",
            CreateUser: r.CreateUser,
            UpdateDate: null,
            UpdateTime: "PT00H00M00S",
            UpdateUser: r.UpdateUser,
            CancelDate: null,
            CancelTime: "PT00H00M00S",
            CancelUser: r.CancelUser,
            CancelReason: r.CancelReason,
            CancelFlag: r.CancelFlag
          };
        })
      };
    
      this.getModel("ZISH_HCFI_SRV").create("/AllergySet", data, {
          method: "PUT",
          success: function () {      
            source.getParent().close();
            this.getMedicalDataOverview();
          }.bind(this),
          error: function (oError) {           
            try {
              this.displayOdataError("AllergySet", JSON.parse(oError.responseText).error.message.value);
            } catch {
              this.displayOdataError("AllergySet", oError.message);
            }
          }.bind(this),
      })
    },

    onUpdateFamilyAntecedents: function(source){
      const movementData = this.getModel("MainData").getProperty("/MovementData");
      let familyAntecedent = this.getModel("NewFamilyHistory").getData();
      let date = new Date()    
      if(familyAntecedent.Erdat){
        date = new Date(familyAntecedent.Erdat); 
        date.setDate(date.getDate() +1); 
        date.setHours(8);
      }      
      const data = {
        FamilyHistid: familyAntecedent.FamilyHistguid,
        Einri: this.headers.Institution,
        Patnr: this.headers.Patient,
        Bchid: familyAntecedent.Antecedent.BchidChild,
        Bcpid: familyAntecedent.Antecedent.BcpidChild,
        Problem: familyAntecedent.Problem,
        Father: familyAntecedent.Father,
        Mother: familyAntecedent.Mother,
        Brother: familyAntecedent.Brother,
        Sister: familyAntecedent.Sister,
        GrandParent: familyAntecedent.GrandParent,
        MaternalGrandparents: familyAntecedent.MaternalGrandparents,
        PaternalGrandparents: familyAntecedent.PaternalGrandparents,
        Son: familyAntecedent.Son,
        FamComment: familyAntecedent.Comments,
        RemarksInt: familyAntecedent.Observations,
        RespEmp: familyAntecedent.RespEmp,
        Departmentou: movementData.Orgfa,
        Treatou: movementData.Orgpf,
        Erusr: familyAntecedent.Erusr,
        Erdat: date,
        Ertim: "PT00H00M00S",
        Upusr: familyAntecedent.Upusr,
        Updat: null,
        Uptim: "PT00H00M00S",
        Storn: false,
        Stusr: familyAntecedent.Stusr,
        Stdat: null,
        Sttim: "PT00H00M00S",
      };

      this.getModel("ZISH_HCFI_SRV").update("/FamilyHistorySet(guid'"+ familyAntecedent.FamilyHistguid +"')", data, {
        success: function () {
          source.getParent().close();
          this.getMedicalDataOverview();  
          //this.getPatientFamilyHistory();      
        }.bind(this),
         error: function (oError) {           
           try {
             this.displayOdataError("UpdateFamilyAntecedents", JSON.parse(oError.responseText).error.message.value);
           } catch {
             this.displayOdataError("UpdateFamilyAntecedents", oError.message);
           }
         }.bind(this),
      });
    },

    onUpdateMedicalAntecedents: function(source){
      let medicalAntecedent = this.getModel("NewMedicalHistory").getData();
      const movementData = this.getModel("MainData").getProperty("/MovementData");
      if(medicalAntecedent.DateMedHist)
      medicalAntecedent.DateMedHist.setHours(8)
      const data = {
        MedHistid: medicalAntecedent.MedHistguid,
        Einri: this.headers.Institution,
        Patnr: this.headers.Patient,
        Bchid: medicalAntecedent.Antecedent.BchidChild,
        Bcpid: medicalAntecedent.Antecedent.BcpidChild,
        Remarks: medicalAntecedent.Comments,
        RemarksInt: medicalAntecedent.Observations,
        Treatment: medicalAntecedent.Medication,
        DateMedHist: medicalAntecedent.DateMedHist,
        RespEmp: medicalAntecedent.RespEmp,
        Departmentou: movementData.Orgfa,
        Treatou: movementData.Orgpf,
        Erusr: medicalAntecedent.Erusr,
        Erdat: medicalAntecedent.Erdat,
        Ertim: "PT00H00M00S",
        Upusr: "",
        Updat: null,
        Uptim: "PT00H00M00S",
        Storn: false,
        Stusr: "",
        Stdat: null,
        Sttim: "PT00H00M00S"
      };
      this.getModel("ZISH_HCFI_SRV").update("/MedicalHistorySet(guid'"+medicalAntecedent.MedHistguid +"')", data, {
        success: function () {
          source.getParent().close();
          this.getMedicalDataOverview();         
          //this.getPatientMedicalHistory();
        }.bind(this),
         error: function (oError) {           
           try {
             this.displayOdataError("AllergySet", JSON.parse(oError.responseText).error.message.value);
           } catch {
             this.displayOdataError("AllergySet", oError.message);
           }
         }.bind(this),
      });
    },

    onUpdateSurgicalAntecedents: function(source){
      let antecedent = this.getModel("NewSurgeryHistory").getData();

      const movementData = this.getModel("MainData").getProperty("/MovementData");
      if(antecedent.DateSurg)
      antecedent.DateSurg.setHours(8)
      const data = {
        SurgHistid: antecedent.SurgHistguid,
        Einri: this.headers.Institution,
        Patnr: this.headers.Patient,
        Bchid: antecedent.Antecedent.BchidChild,
        Bcpid: antecedent.Antecedent.BcpidChild,
        Remarks: antecedent.Comments,
        RemarksInt: antecedent.Observations,
        DateSurg: antecedent.DateSurg,
        RespEmp: antecedent.RespEmp,
        Departmentou: movementData.Orgfa,
        Treatou: movementData.Orgpf,
        Erusr: antecedent.Erusr,
        Erdat: antecedent.Erdat,
        Ertim: "PT00H00M00S",
        Upusr: antecedent.Upusr,
        Updat: null,
        Uptim: "PT00H00M00S",
        Storn: false,
        Stusr: "",
        Stdat: null,
        Sttim: "PT00H00M00S",
      };

      this.getModel("ZISH_HCFI_SRV").update("/SurgeryHistorySet(guid'"+ antecedent.SurgHistguid +"')", data, {
        success: function () {        
          //this.getPatientSurgeryHistory();
          this.getMedicalDataOverview();
          source.getParent().close();
         }.bind(this),
         error: function (oError) {           
           try {
             this.displayOdataError("UpdateSurgery", JSON.parse(oError.responseText).error.message.value);
           } catch {
             this.displayOdataError("UpdateSurgery", oError.message);
           }
         }.bind(this),
      });
    },

    onUpdateSocialHabits: function(source){
      let antecedent = this.getModel("NewHabit").getData();
      var bcp = this.getModel("Antecedent").getProperty("/ZSHA").find( a => a.ExtidChild == antecedent.Type)
      var isConsumer = antecedent.Evaluation == "2";
    
      if(!antecedent.From && isConsumer){
      this.displayOdataError(this.getModel("i18n").getProperty("RequiredField"), this.getModel("i18n").getProperty("NewHabitRequiredField"));
      return;
      }      

      //Si no es consumidor, eliminamos parametros innecesarios.
      if(!isConsumer){
       antecedent.Frequency = "1"
       antecedent.FrequencyUnit = "D"
       antecedent.TobaccoType = "1"
       antecedent.FrequencyCond = "SO"
       antecedent.From = ""
       antecedent.To = ""
       antecedent.Status = ""
       antecedent.Quantity = ""
       antecedent.HabitOrder = ""
       antecedent.Comment = ""
       antecedent.OtherTypeText = ""
      }

      

      const data = {
        Habitid: antecedent.Habitid,
        Frequency: antecedent.Frequency,
        FrequencyUnit: antecedent.FrequencyUnit,
        Evaluation: antecedent.Evaluation,
        TobaccoType: antecedent.TobaccoType,
        FrequencyCond: antecedent.FrequencyCond,
        From: antecedent.From,
        To: antecedent.To,
        Type: "",
        OtherTypeText: antecedent.OtherTypeText,
        Status: antecedent.Status,
        Quantity: antecedent.Quantity,
        HabitOrder: antecedent.HabitOrder,
        Patient: this.headers.Patient,
        Comment: antecedent.Comment,
        Bchid: bcp.BchidChild,
        Bcpid: bcp.BcpidChild,
        Institution: this.headers.Institution,
        Case: this.headers.Case,
      };

      this.getModel("ZISH_HCFI_SRV").update("/HabitSet(Habitid=guid'"+antecedent.Habitid+"',Bcpid='"+bcp.BcpidChild+"')", data, {
        success: function () {    
          //this.getPatientSocialHabits();
          source.getParent().close();
          this.getMedicalDataOverview();
        }.bind(this),
         error: function (oError) {           
           try {
             this.displayOdataError("AllergySet", JSON.parse(oError.responseText).error.message.value);
           } catch {
             this.displayOdataError("AllergySet", oError.message);
           }
         }.bind(this),
      });
    },


    /**
     * Select or expand family antecedent
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onFamilyAntecedentsSelect: function (oEvent) {
      const wizard = oEvent.getSource().getParent().getParent();
      const item = oEvent.getParameter("listItem");
      const antecedent = JSON.parse(JSON.stringify(item.getBindingContext("AntecedentFiltered").getObject()));
      const level = item.getBindingContext("AntecedentFiltered").getPath().split("/").map(x => parseInt(x)).filter(Number.isInteger).reduce((a, v) => a + 1 + v, -1);
      item.setSelected(false);      
      if (antecedent.IsSelectable) {   
        if(antecedent.ExtidChild == "Otros")     
        this.getModel("NewFamilyHistory").setProperty("/Comments", this.byId("familyAntecedentsSearchField").getValue());
        wizard.setCurrentStep(wizard.getSteps()[0]).nextStep();
        this.getModel("NewFamilyHistory").setProperty("/Antecedent", antecedent);
      } else item.getExpanded() ? oEvent.getSource().collapse(level) : oEvent.getSource().expand(level);
    },

    /**
     * Save new family antecedent
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onSaveAddFamilyAntecedentsDialog: function (oEvent, cntinue) {
      const dialog = oEvent.getSource().getParent();
      const wizard = oEvent.getSource().getParent().getContent()[0];
      dialog.setBusy(true);
      const familyHistory = this.getModel("NewFamilyHistory").getData();
      const movementData = this.getModel("MainData").getProperty("/MovementData");
      const o = {
        FamilyHistid: "99999999-9999-9999-9999-999999999999",
        Einri: this.headers.Institution,
        Patnr: this.headers.Patient,
        Bchid: familyHistory.Antecedent.BchidChild,
        Bcpid: familyHistory.Antecedent.BcpidChild,
        Problem: "",
        Father: familyHistory.Father,
        Mother: familyHistory.Mother,
        Brother: familyHistory.Brother,
        Sister: familyHistory.Sister,
        GrandParent: false,
        MaternalGrandparents: familyHistory.MaternalGrandparent,
        PaternalGrandparents: familyHistory.PaternalGrandparent,
        Son: familyHistory.Children,
        FamComment: familyHistory.Comments,
        RemarksInt: familyHistory.Observations,
        RespEmp: "",
        Departmentou: movementData.Orgfa,
        Treatou: movementData.Orgpf,
        Erusr: "",
        Erdat: new Date(),
        Ertim: "PT00H00M00S",
        Upusr: "",
        Updat: null,
        Uptim: "PT00H00M00S",
        Storn: false,
        Stusr: "",
        Stdat: null,
        Sttim: "PT00H00M00S",
      };
      this.getModel("ZISH_HCFI_SRV").create("/FamilyHistorySet", o, {
        success: function () {
          wizard.discardProgress(wizard.getSteps()[0]);
          wizard.getSteps()[0].getContent()[1].collapseAll();
          dialog.setBusy(false);
          this.getMedicalDataOverview();

          this.byId("familyAntecedentsSearchField").setValue("")
          this.byId("familyAntecedentsSearchField").clear()
          this.getModel("NewFamilyHistory").setProperty("/", {
            Antecedent: {},
            Father: false,
            Mother: false,
            Brother: false,
            Sister: false,
            PaternalGrandparent: false,
            MaternalGrandparent: false,
            Children: false,
            Comments: "",
            Observations: ""
          });
          if (!cntinue){
            //dialog.setBusy(true);
            dialog.close();
          }
        }.bind(this),
        error: function (oError) {
          dialog.setBusy(false);
          try {
            this.displayOdataError("FamilyHistorySet", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("FamilyHistorySet", oError.message);
          }
        }.bind(this),
      });
    },

    /**
     * Select or expand medical antecedent
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onMedicalAntecedentsSelect: function (oEvent) {
      const wizard = oEvent.getSource().getParent().getParent();
      const item = oEvent.getParameter("listItem");
      const antecedent = item.getBindingContext("AntecedentFiltered").getObject();
      const level = item.getBindingContext("AntecedentFiltered").getPath().split("/").map(x => parseInt(x)).filter(Number.isInteger).reduce((a, v) => a + 1 + v, -1);
      item.setSelected(false);
      if (antecedent.IsSelectable) {
        if(antecedent.ExtidChild == "Otros")     
        this.getModel("NewMedicalHistory").setProperty("/Comments", this.byId("SearchMedicalAntecedents").getValue());      
        wizard.setCurrentStep(wizard.getSteps()[0]).nextStep();
        this.getModel("NewMedicalHistory").setProperty("/Antecedent", antecedent);
      } else item.getExpanded() ? oEvent.getSource().collapse(level) : oEvent.getSource().expand(level);
    },

    /**
     * Update medical antecedent date
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onMedicalAntecedentsDateChange: function (oEvent) {
      this.getModel("NewMedicalHistory").setProperty("/Date", oEvent.getSource().getProperty("dateValue"));
    },

    /**
     * Save new medical antecedent
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onSaveAddMedicalAntecedentsDialog: function (oEvent, cntinue) {
      const dialog = oEvent.getSource().getParent();
      const wizard = oEvent.getSource().getParent().getContent()[0];
      dialog.setBusy(true);
      const medicalHistory = this.getModel("NewMedicalHistory").getData();
      const movementData = this.getModel("MainData").getProperty("/MovementData");
      if(medicalHistory.Date)
      medicalHistory.Date.setHours(8)

      const o = {
        MedHistid: "99999999-9999-9999-9999-999999999999",
        Einri: this.headers.Institution,
        Patnr: this.headers.Patient,
        Bchid: medicalHistory.Antecedent.BchidChild,
        Bcpid: medicalHistory.Antecedent.BcpidChild,
        Remarks: medicalHistory.Comments,
        RemarksInt: medicalHistory.Observations,
        Treatment: medicalHistory.Medication,
        DateMedHist: medicalHistory.Date,
        RespEmp: "",
        Departmentou: movementData.Orgfa,
        Treatou: movementData.Orgpf,
        Erusr: "",
        Erdat: new Date(),
        Ertim: "PT00H00M00S",
        Upusr: "",
        Updat: null,
        Uptim: "PT00H00M00S",
        Storn: false,
        Stusr: "",
        Stdat: null,
        Sttim: "PT00H00M00S"
      };
      this.getModel("ZISH_HCFI_SRV").create("/MedicalHistorySet", o, {
        success: function () {
          wizard.discardProgress(wizard.getSteps()[0]);
          wizard.getSteps()[0].getContent()[1].collapseAll();
          this.getMedicalDataOverview();
          dialog.setBusy(false);
          this.getModel("NewMedicalHistory").setProperty("/", { Antecedent: {}, Date: null, Medication: "", Comments: "", Observations: "" });
          this.byId("dateMedicalAntecedents").setDateValue()
          if (!cntinue){
           // this.getPatientMedicalHistory()
            dialog.close();
          }

        }.bind(this),
        error: function (oError) {
          dialog.setBusy(false);
          try {
            this.displayOdataError("MedicalHistorySet", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("MedicalHistorySet", oError.message);
          }
        }.bind(this),
      });
    },

    /**
     * Open surgical antecedent dialog
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onSurgicalAntecedentsSelect: function (oEvent) {
      const wizard = oEvent.getSource().getParent().getParent();
      const item = oEvent.getParameter("listItem");
      const antecedent = item.getBindingContext("AntecedentFiltered").getObject();
      const level = item.getBindingContext("AntecedentFiltered").getPath().split("/").map(x => parseInt(x)).filter(Number.isInteger).reduce((a, v) => a + 1 + v, -1);
      item.setSelected(false);
      if (antecedent.IsSelectable) {
        if(antecedent.ExtidChild == "Otros")     
        this.getModel("NewSurgeryHistory").setProperty("/Comments", this.byId("SearchSurgicalAntecedents").getValue());       
        wizard.setCurrentStep(wizard.getSteps()[0]).nextStep();
        this.getModel("NewSurgeryHistory").setProperty("/Antecedent", antecedent);
      } else item.getExpanded() ? oEvent.getSource().collapse(level) : oEvent.getSource().expand(level);
    },

    /**
     * Update surgical antecedents date
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onSurgicalAntecedentsDateChange: function (oEvent) {
      this.getModel("NewSurgeryHistory").setProperty("/Date", oEvent.getSource().getProperty("dateValue"));
    },

    /**
     * Save new surgical antecedent
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onSaveAddSurgicalAntecedentsDialog: function (oEvent, cntinue) {
      const dialog = oEvent.getSource().getParent();
      const wizard = oEvent.getSource().getParent().getContent()[0];
      dialog.setBusy(true);
      const surgeryHistory = this.getModel("NewSurgeryHistory").getData();
      const movementData = this.getModel("MainData").getProperty("/MovementData");
      if(surgeryHistory.Date)
        surgeryHistory.Date.setHours(8)
      const o = {
        SurgHistid: "99999999-9999-9999-9999-999999999999",
        Einri: this.headers.Institution,
        Patnr: this.headers.Patient,
        Bchid: surgeryHistory.Antecedent.BchidChild,
        Bcpid: surgeryHistory.Antecedent.BcpidChild,
        Remarks: surgeryHistory.Comments,
        RemarksInt: surgeryHistory.Observations,
        DateSurg: surgeryHistory.Date,
        RespEmp: "",
        Departmentou: movementData.Orgfa,
        Treatou: movementData.Orgpf,
        Erusr: "",
        Erdat: new Date(),
        Ertim: "PT00H00M00S",
        Upusr: "",
        Updat: null,
        Uptim: "PT00H00M00S",
        Storn: false,
        Stusr: "",
        Stdat: null,
        Sttim: "PT00H00M00S",
      };
      this.getModel("ZISH_HCFI_SRV").create("/SurgeryHistorySet", o, {
        success: function () {
          wizard.discardProgress(wizard.getSteps()[0]);
          wizard.getSteps()[0].getContent()[1].collapseAll();          
          this.getMedicalDataOverview();
          dialog.setBusy(false);
          this.getModel("NewSurgeryHistory").setProperty("/", { Antecedent: {}, Date: null, Comments: "", Observations: "" });
          this.byId("dateSurginalAntecedents").setDateValue()
          if (!cntinue){
            dialog.close();
          }          
        }.bind(this),
        error: function (oError) {
          dialog.setBusy(false);
          try {
            this.displayOdataError("SurgeryHistorySet", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("SurgeryHistorySet", oError.message);
          }
        }.bind(this),
      });
    },

    //Limpia el formulario
    ClearFamilyAntecedents: function (oEvent) {
      this.getModel("NewFamilyHistory").setData({});
      this.closeAddAllergiesDialog(oEvent);
      this.byId("familyAntecedentsSearchField").setValue("");   
      //this.destroyDialog(oEvent);
    },
    ClearMedicalAntecedents: function (oEvent) {
      this.getModel("NewMedicalHistory").setData({});
      this.byId("SearchMedicalAntecedents").setValue("");   
      this.closeAddAllergiesDialog(oEvent);
      //this.destroyDialog(oEvent);
    },
    ClearSurgicalAntecedents: function (oEvent) {
      this.getModel("NewSurgeryHistory").setData({});
      this.byId("SearchSurgicalAntecedents").setValue("");   
      this.closeAddAllergiesDialog(oEvent);
      //this.destroyDialog(oEvent);
    },
    ClearSocialAntecedents: function (oEvent) {
      this.getModel("NewHabit").setData({});
      this.byId("SearchSocialHabits").setValue("");   
      this.closeAddAllergiesDialog(oEvent);
      //this.destroyDialog(oEvent);
    },
  

  
    /**
     * Update ZMEDMB_HAB_EVAL value on change
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onZMEDMB_HAB_EVALChange: function (oEvent) {
      this.getModel("NewHabit").setProperty("/ZMEDMB_HAB_EVAL", oEvent.getParameter("selectedItem").getBindingContext("KeyValue").getObject());
    },

    /**
     * Update ZMEDMB_FREQ value on change
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onZMEDMB_FREQChange: function (oEvent) {
      this.getModel("NewHabit").setProperty("/ZMEDMB_FREQ", oEvent.getParameter("selectedItem").getBindingContext("KeyValue").getObject());
    },

    /**
     * Update ZMEDMB_TOBACCO value on change
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onZMEDMB_TOBACCOChange: function (oEvent) {
      this.getModel("NewHabit").setProperty("/ZMEDMB_TOBACCO", oEvent.getParameter("selectedItem").getBindingContext("KeyValue").getObject());
    },

    /**
     * Update ZMEDMB_FREQ_UNIT value on change
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onZMEDMB_FREQ_UNITChange: function (oEvent) {
      this.getModel("NewHabit").setProperty("/ZMEDMB_FREQ_UNIT", oEvent.getParameter("selectedItem").getBindingContext("KeyValue").getObject());
    },

    /**
     * Update ZMEDMB_FREQ_COND value on change
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onZMEDMB_FREQ_CONDChange: function (oEvent) {
      this.getModel("NewHabit").setProperty("/ZMEDMB_FREQ_COND", oEvent.getParameter("selectedItem").getBindingContext("KeyValue").getObject());
    },

    /**
     * Select or expand selected social habit
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onSocialHabitsSelect: function (oEvent) {
      const wizard = oEvent.getSource().getParent().getParent();
      const item = oEvent.getParameter("listItem");
      const antecedent = item.getBindingContext("AntecedentFiltered").getObject();
      const level = item.getBindingContext("AntecedentFiltered").getPath().split("/").map(x => parseInt(x)).filter(Number.isInteger).reduce((a, v) => a + 1 + v, -1);
      item.setSelected(false);
      if (antecedent.IsSelectable) {                         
        wizard.setCurrentStep(wizard.getSteps()[0]).nextStep();
        this.getModel("NewHabit").setProperty("/Antecedent", antecedent);
      } else item.getExpanded() ? oEvent.getSource().collapse(level) : oEvent.getSource().expand(level);
    },
    

    /**
     * Save new social habit
     * @param {sap.ui.base.Event} oEvent Event caller
     * @memberOf com.resulto.hcfi.controller.Main
     */
    onSaveAddSocialHabitsDialog: function (oEvent, cntinue) {

      const habit = this.getModel("NewHabit").getData();

      if (!habit.From && this.getModel("NewHabit").getData().ZMEDMB_HAB_EVAL.KeyValue === '2')
        this.displayOdataError(this.getModel("i18n").getProperty("RequiredField"), this.getModel("i18n").getProperty("NewHabitRequiredField"));
      else {
        const dialog = oEvent.getSource().getParent();
        const wizard = oEvent.getSource().getParent().getContent()[0];
        dialog.setBusy(true);
        const o = {
          Habitid: "99999999-9999-9999-9999-999999999999",
          Frequency: habit.ZMEDMB_FREQ.KeyValue,
          FrequencyUnit: habit.ZMEDMB_FREQ_UNIT.KeyValue,
          Evaluation: habit.ZMEDMB_HAB_EVAL.KeyValue,
          TobaccoType: habit.ZMEDMB_TOBACCO.KeyValue,
          FrequencyCond: habit.ZMEDMB_FREQ_COND.KeyValue,
          From: habit.From,
          To: habit.To,
          OtherTypeText: habit.OtherTypeText,
          Type: "",
          Status: "",
          Quantity: habit.GrWeek,
          HabitOrder: "",
          Patient: this.headers.Patient,
          Comment: habit.Comments,
          Bchid: habit.Antecedent.BchidChild,
          Bcpid: habit.Antecedent.BcpidChild,
          Institution: this.headers.Institution,
          Case: this.headers.Case,
        };
        this.getModel("ZISH_HCFI_SRV").create("/HabitSet", o, {
          success: function () {
            wizard.discardProgress(wizard.getSteps()[0]);
            wizard.getSteps()[0].getContent()[1].collapseAll();            
            this.getMedicalDataOverview();
            dialog.setBusy(false);
            this.getModel("NewHabit").setProperty("/", {
              Antecedent: {},
              ZMEDMB_HAB_EVAL: {},
              From: "",
              To: "",
              ZMEDMB_FREQ: {},
              ZMEDMB_TOBACCO: {},
              ZMEDMB_FREQ_UNIT: {},
              ZMEDMB_FREQ_COND: {},
              GrWeek: "",
              Comments: ""
            });
            this.byId("ZMEDMB_HAB_EVAL").setSelectedKey("0")
            if (!cntinue){
              //dialog.setBusy(true);
              dialog.close();
            }
          }.bind(this),
          error: function (oError) {
            dialog.setBusy(false);
            try {
              this.displayOdataError("HabitSet", JSON.parse(oError.responseText).error.message.value);
            } catch {
              this.displayOdataError("HabitSet", oError.message);
            }
          }.bind(this),
        });
      }
    },
    onEditMedicalAntecedents: function(oEvent){
      let source = oEvent.getSource();   

      if (!this.editAnt_Allergies) {
        this.editAnt_Allergies = new sap.m.Dialog({
          type: sap.m.DialogType.Message,
          title: this.getModel("i18n").getProperty("Confirm"),
          content: new sap.m.Text({ text: this.getModel("i18n").getProperty("ConfirmSave")}),
          beginButton: new sap.m.Button({
            type: sap.m.ButtonType.Emphasized,
            text: this.getModel("i18n").getProperty("Confirm"),
            press: function () {
              this.editAnt_Allergies.close();
              this.onUpdateMedicalAntecedents(source);
            }.bind(this)
          }),
          endButton: new sap.m.Button({
            text: this.getModel("i18n").getProperty("Cancel"),
            press: function () {
              this.editAnt_Allergies.close();
            }.bind(this)
          })
        });
      }

      this.editAnt_Allergies.open();
    },

    onDeleteMedicalAntecedents: function(oEvent){
      let source = oEvent.getSource();

      if (!this.confirmMedicalAntecedentsDialog) {
        this.confirmMedicalAntecedentsDialog = new sap.m.Dialog({
          type: sap.m.DialogType.Message,
          title: this.getModel("i18n").getProperty("Eliminate"),
          content: new sap.m.Text({ text: this.getModel("i18n").getProperty("ConfirmDelete") }),
          beginButton: new sap.m.Button({
            type: sap.m.ButtonType.Emphasized,
            text: this.getModel("i18n").getProperty("Confirm"),
            press: function () {
              this.confirmMedicalAntecedentsDialog.close();
              this.deleteMedicalAntecedents(source)
            }.bind(this)
          }),
          endButton: new sap.m.Button({
            text: this.getModel("i18n").getProperty("Cancel"),
            press: function () {
              this.confirmMedicalAntecedentsDialog.close();
            }.bind(this)
          })
        });
      }

      this.confirmMedicalAntecedentsDialog.open();
    },

    deleteMedicalAntecedents: function(source){
      let antecedent = this.getModel("NewMedicalHistory").getData();
    
      //Recoger modelo Alergias      
      this.getModel("ZISH_HCFI_SRV").remove("/MedicalHistorySet(guid'"+ antecedent.MedHistguid +"')", {             
        success: function () {   
          this.getMedicalDataOverview();          
          source.getParent().close();
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("DeleteMedicalAntecedents", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("DeleteMedicalAntecedents", oError.message);
          }
        }.bind(this)
      });
    },

    onEditFamilyAntecedents: function(oEvent){
      let source = oEvent.getSource();

      if (!this.confirmEditFamilyAntecedent) {
        this.confirmEditFamilyAntecedent = new sap.m.Dialog({
          type: sap.m.DialogType.Message,
          title: this.getModel("i18n").getProperty("Confirm"),
          content: new sap.m.Text({ text: this.getModel("i18n").getProperty("ConfirmSave")}),
          beginButton: new sap.m.Button({
            type: sap.m.ButtonType.Emphasized,
            text: this.getModel("i18n").getProperty("Confirm"),
            press: function () {
              this.confirmEditFamilyAntecedent.close();
              this.onUpdateFamilyAntecedents(source);
            }.bind(this)
          }),
          endButton: new sap.m.Button({
            text: this.getModel("i18n").getProperty("Cancel"),
            press: function () {
              this.confirmEditFamilyAntecedent.close();
            }.bind(this)
          })
        });
      }

      this.confirmEditFamilyAntecedent.open();
    },

    onDeleteFamilyAntecedents: function(oEvent){
      let source = oEvent.getSource();

      if (!this.confirmDeleteFamilyAntecedents) {
        this.confirmDeleteFamilyAntecedents = new sap.m.Dialog({
          type: sap.m.DialogType.Message,
          title: this.getModel("i18n").getProperty("Eliminate"),
          content: new sap.m.Text({ text: this.getModel("i18n").getProperty("ConfirmDelete") }),
          beginButton: new sap.m.Button({
            type: sap.m.ButtonType.Emphasized,
            text: this.getModel("i18n").getProperty("Confirm"),
            press: function () {
              this.confirmDeleteFamilyAntecedents.close();            
              this.deleteFamilyAntecedents(source)
            }.bind(this)
          }),
          endButton: new sap.m.Button({
            text: this.getModel("i18n").getProperty("Cancel"),
            press: function () {
              this.confirmDeleteFamilyAntecedents.close();
            }.bind(this)
          })
        });
      }

      this.confirmDeleteFamilyAntecedents.open();
    },

    deleteFamilyAntecedents: function(source){
      let antecedent = this.getModel("NewFamilyHistory").getData();
    
      //Recoger modelo Alergias      
      this.getModel("ZISH_HCFI_SRV").remove("/FamilyHistorySet(guid'"+ antecedent.FamilyHistguid +"')", {             
        success: function () {          
          this.getMedicalDataOverview();          
          source.getParent().close();  
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("DeleteFamilyAntecedents", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("DeleteFamilyAntecedents", oError.message);
          }
        }.bind(this)
      });
    },
    onEditSocialHabits: function(oEvent){
      let source = oEvent.getSource();

      if (!this.editSocialHabits) {
        this.editSocialHabits = new sap.m.Dialog({
          type: sap.m.DialogType.Message,
          title: this.getModel("i18n").getProperty("Confirm"),
          content: new sap.m.Text({ text: this.getModel("i18n").getProperty("ConfirmSave")}),
          beginButton: new sap.m.Button({
            type: sap.m.ButtonType.Emphasized,
            text: this.getModel("i18n").getProperty("Confirm"),
            press: function () {
              this.editSocialHabits.close();          
              this.onUpdateSocialHabits(source);
            }.bind(this)
          }),
          endButton: new sap.m.Button({
            text: this.getModel("i18n").getProperty("Cancel"),
            press: function () {
              this.editSocialHabits.close();
            }.bind(this)
          })
        });
      }

      this.editSocialHabits.open();
    },

    onDeleteSocialHabits: function(oEvent){
      let source = oEvent.getSource();

      if (!this.confirmDeleteSocialHabits) {
        this.confirmDeleteSocialHabits = new sap.m.Dialog({
          type: sap.m.DialogType.Message,
          title: this.getModel("i18n").getProperty("Eliminate"),
          content: new sap.m.Text({ text: this.getModel("i18n").getProperty("ConfirmDelete") }),
          beginButton: new sap.m.Button({
            type: sap.m.ButtonType.Emphasized,
            text: this.getModel("i18n").getProperty("Confirm"),
            press: function () {
              this.confirmDeleteSocialHabits.close();
              this.deleteSocialHabits(source)
            }.bind(this)
          }),
          endButton: new sap.m.Button({
            text: this.getModel("i18n").getProperty("Cancel"),
            press: function () {
              this.confirmDeleteSocialHabits.close();
            }.bind(this)
          })
        });
      }

      this.confirmDeleteSocialHabits.open();
    },

    deleteSocialHabits: function(source){
      let antecedent = this.getModel("NewHabit").getData();
      var bcpid = this.getModel("Antecedent").getProperty("/ZSHA").find( a => a.ExtidChild == antecedent.Type).BcpidChild

      //Recoger modelo Alergias      
      this.getModel("ZISH_HCFI_SRV").remove("/HabitSet(Habitid=guid'"+antecedent.Habitid+"',Bcpid='"+ bcpid+"')", {             
        success: function () {  
          source.getParent().close();                  
          this.getMedicalDataOverview();         
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("DeleteSocialHabits", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("DeleteSocialHabits", oError.message);
          }
        }.bind(this)
      });
    
    },

    onEditSurgicalAntecedents: function(oEvent){
      let source = oEvent.getSource();

      if (!this.confirmEditSurgicalAntecedents) {
        this.confirmEditSurgicalAntecedents = new sap.m.Dialog({
          type: sap.m.DialogType.Message,
          title: this.getModel("i18n").getProperty("Confirm"),
          content: new sap.m.Text({ text: this.getModel("i18n").getProperty("ConfirmSave")}),
          beginButton: new sap.m.Button({
            type: sap.m.ButtonType.Emphasized,
            text: this.getModel("i18n").getProperty("Confirm"),
            press: function () {
              this.confirmEditSurgicalAntecedents.close();
              source.getParent().close();
              this.onUpdateSurgicalAntecedents(source);
            }.bind(this)
          }),
          endButton: new sap.m.Button({
            text: this.getModel("i18n").getProperty("Cancel"),
            press: function () {
              this.confirmEditSurgicalAntecedents.close();
            }.bind(this)
          })
        });
      }

      this.confirmEditSurgicalAntecedents.open();
    },

    onDeleteSurgicalAntecedent: function(oEvent){
      let source = oEvent.getSource();

      if (!this.confirmDeleteSurgicalAntecedent) {
        this.confirmDeleteSurgicalAntecedent = new sap.m.Dialog({
          type: sap.m.DialogType.Message,
          title: this.getModel("i18n").getProperty("Eliminate"),
          content: new sap.m.Text({ text: this.getModel("i18n").getProperty("ConfirmDelete") }),
          beginButton: new sap.m.Button({
            type: sap.m.ButtonType.Emphasized,
            text: this.getModel("i18n").getProperty("Confirm"),
            press: function () {
              this.confirmDeleteSurgicalAntecedent.close();
              source.getParent().close();
              this.deleteSurgicalAntecedents(source)
            }.bind(this)
          }),
          endButton: new sap.m.Button({
            text: this.getModel("i18n").getProperty("Cancel"),
            press: function () {
              this.confirmDeleteSurgicalAntecedent.close();
            }.bind(this)
          })
        });
      }

      this.confirmDeleteSurgicalAntecedent.open();
    },

    deleteSurgicalAntecedents: function(source){
      let antecedent = this.getModel("NewSurgeryHistory").getData();
    
      //Recoger modelo Alergias      
      this.getModel("ZISH_HCFI_SRV").remove("/SurgeryHistorySet(guid'"+ antecedent.SurgHistguid +"')", {             
        success: function () {          
          source.getParent().close();  
          this.getMedicalDataOverview();
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("DeleteAnt_Allergies", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("DeleteAnt_Allergies", oError.message);
          }
        }.bind(this)
      });
    
    },

    onDeleteRiskFactors: function(oEvent){
      let source = oEvent.getSource();

      if (!this.deleteRiskFactor) {
        this.deleteRiskFactor = new sap.m.Dialog({
          type: sap.m.DialogType.Message,
          title: this.getModel("i18n").getProperty("Eliminate"),
          content: new sap.m.Text({ text: this.getModel("i18n").getProperty("ConfirmDelete") }),
          beginButton: new sap.m.Button({
            type: sap.m.ButtonType.Emphasized,
            text: this.getModel("i18n").getProperty("Confirm"),
            press: function () {
              this.deleteRiskFactor.close();
              this.deleteRiskFactors(source);
            }.bind(this)
          }),
          endButton: new sap.m.Button({
            text: this.getModel("i18n").getProperty("Cancel"),
            press: function () {
              this.deleteRiskFactor.close();
            }.bind(this)
          })
        });
      }

      this.deleteRiskFactor.open();
    },

    deleteRiskFactors: function(source){
    let riskFactor = this.getModel("RiskFactorFiltered").getData();
      
      this.getModel("ZISH_HCFI_SRV").callFunction("/DeleteRiskFactors", {
       
        urlParameters: {
          Institution: this.headers.Institution,
          Patient: riskFactor.Patnr,
          RiskFactors: riskFactor.Rsfnr           
        },
        success: function () {           
          source.getParent().close();         
          this.getMedicalDataOverview();
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("DeleteRiskFactors", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("DeleteRiskFactors", oError.message);
          }
        }.bind(this)
      });
  
      /*this.getModel("ZISH_HCFI_SRV").remove("/DeleteRiskFactors(Patnr='"+ riskFactor.Patnr+"',Rsfnr='"+riskFactor.Rsfnr+"')", {             
        success: function () {          
          var flag = true;
          this.getMedicalDataOverview();
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("DeleteRiskFactors", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("DeleteRiskFactors", oError.message);
          }
        }.bind(this)
      });*/
    
    },
    
    onEditAllergies: function(oEvent){
      let source = oEvent.getSource();

      if (!this.confirmEditAllergies) {
        this.confirmEditAllergies = new sap.m.Dialog({
          type: sap.m.DialogType.Message,
          title: this.getModel("i18n").getProperty("Confirm"),
          content: new sap.m.Text({ text: this.getModel("i18n").getProperty("ConfirmSave")}),
          beginButton: new sap.m.Button({
            type: sap.m.ButtonType.Emphasized,
            text: this.getModel("i18n").getProperty("Confirm"),
            press: function () {
              this.confirmEditAllergies.close();            
              this.onUpdateAllergies(source);
            }.bind(this)
          }),
          endButton: new sap.m.Button({
            text: this.getModel("i18n").getProperty("Cancel"),
            press: function () {
              this.confirmEditAllergies.close();
            }.bind(this)
          })
        });
      }

      this.confirmEditAllergies.open();
    },

    onDeleteAllergies: function(oEvent){
      let source = oEvent.getSource();

      if (!this.deleteConfirmationDialog) {
        this.deleteConfirmationDialog = new sap.m.Dialog({
          type: sap.m.DialogType.Message,
          title: this.getModel("i18n").getProperty("Eliminate"),
          content: new sap.m.Text({ text: this.getModel("i18n").getProperty("ConfirmDelete") }),
          beginButton: new sap.m.Button({
            type: sap.m.ButtonType.Emphasized,
            text: this.getModel("i18n").getProperty("Confirm"),
            press: function () {
              this.deleteConfirmationDialog.close();              
              this.deleteAllergies(source)
            }.bind(this)
          }),
          endButton: new sap.m.Button({
            text: this.getModel("i18n").getProperty("Cancel"),
            press: function () {
              this.deleteConfirmationDialog.close();
            }.bind(this)
          })
        });
      }

      this.deleteConfirmationDialog.open();
    },


    deleteAllergies: function(source){
      let allergy = this.getModel("NewAllergy").getData();
    
      //Recoger modelo Alergias      
      this.getModel("ZISH_HCFI_SRV").remove("/AllergySet(Patnr='"+ allergy.Patnr +"',AllergySeqno='"+ allergy.AllergySeqno +"')", {             
        success: function () {                        
          this.getMedicalDataOverview();
          source.getParent().close();
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("DeleteAnt_Allergies", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("DeleteAnt_Allergies", oError.message);
          }
        }.bind(this)
      });
    },

    onRelatedCaseSelection: function (oEvent) {
      if (oEvent.getParameters().listItem.getBindingContext("ProcessCases").getObject().Falnr != this.getModel("MainData").getData().CaseData.Falnr) {
        let obj = oEvent.getParameters().listItem.getBindingContext("ProcessCases").getObject();
        oEvent.getSource().getParent().close();
        location.hash = `#?Institution=${obj.Einri}&Case=${obj.Falnr}&Movement=${obj.Lfdnr || '00001'}&Patient=${this.headers.Patient}`;
        location.reload();
      }
    },

    bringDocument: function (oEvent, dtid) {
      const source = oEvent.getSource();
      this._oRelatedDocsPopover ? this._oRelatedDocsPopover.openBy(source) : this.loadFragment({
        type: "XML",
        name: "com.resulto.hcfi.view.RelatedDocumentsPopover"
      }).then(function (oPopover) {
        this._oRelatedDocsPopover = oPopover;
        oPopover.openBy(source);
      }.bind(this));
    },

    onRelatedDocSelection: function (oEvent) {
      this.selectedDoc = { ...oEvent.getParameters().listItem.getBindingContext("FilteredDocuments").getObject() };
      let source = oEvent.getSource();
      if (!this.oApproveDialog) {
        this.oApproveDialog = new sap.m.Dialog({
          type: sap.m.DialogType.Message,
          title: "Importar datos",
          content: new sap.m.Text({ text: "¿Confirma que  se deben importar los datos del documento seleccionado?" }),
          beginButton: new sap.m.Button({
            type: sap.m.ButtonType.Emphasized,
            text: "Confirmar",
            press: function () {
              this.getRelatedDocument(this.selectedDoc.RN2DOCDATA);
              this.oApproveDialog.close();
              source.getParent().close();

            }.bind(this)
          }),
          endButton: new sap.m.Button({
            text: "Cancelar",
            press: function () {
              this.oApproveDialog.close();
            }.bind(this)
          })
        });
      }

      this.oApproveDialog.open();

    },

    /**
    * Get document from service.
    * @param {Object} document Document initial data
    * @memberOf com.resulto.hcfi.controller.Main
    */
    getRelatedDocument: function (document) {
      this.getModel("ZISH_HCFI_SRV").read(`/DocumentSet(Dokar='${document.Dokar}',Doknr='${document.Doknr}',Dokvr='${document.Dokvr}',Doktl='${document.Doktl}')`, {
        urlParameters: { $expand: "content" },
        success: function (oResponse) {
          let mainData = this.getModel("MainData").getData();
          oResponse.Einri = mainData.MovementData.Einri;
          oResponse.Falnr = mainData.MovementData.Falnr;
          oResponse.Orgdo = mainData.MovementData.Orgpf;
          oResponse.Mitarb = this.getModel("ProfessionalData").getProperty("/Id");
          oResponse.Doknr = "9999999999999999999999999";
          oResponse.Dokst = "";
          oResponse.Dokvr = "00";

          this.getModel(oResponse.Dtid).setProperty("/", oResponse);
          this.getModel(oResponse.Dtid).setProperty("/content", this.groupBy(oResponse.content.results, "Alias"));
          this.createAntecedentsTab(oResponse.Dtid, oResponse.content);
          this.createVitalSignsExamTab(oResponse.Dtid, oResponse.content);
          this.createServicesTab(oResponse.Dtid, oResponse.content);
          this.createDiagnosesProceduresTab(oResponse.Dtid, oResponse.content);
          this.createDischargeTab(oResponse.Dtid, oResponse.content);
          this.createCAD_GINEView(oResponse.Dtid, oResponse.content);
          this.createCAD_MAMView(oResponse.Dtid, oResponse.content);
          this.byId(oResponse.Dtid).getContent()[0].setBusy(false).getHeaderTitle().getActions().forEach(button => {
            button.setEnabled(true);
          });
          try { this.byId(oResponse.ReleaseDocument.Dtid).getContent()[1].setBusy(false); } catch { }
        }.bind(this),
        error: function (oError) {
          try {
            this.displayOdataError("DocumentSet", JSON.parse(oError.responseText).error.message.value);
          } catch {
            this.displayOdataError("DocumentSet", oError.message);
          }
        }.bind(this)
      });
    },

    onPopoverClose: function (oEvent) {
      this.getView().getModel("FilteredDocuments").setData({});
    },
    onPopoverOpen: function (oEvent) {
      let filteredResults = this.getView().getModel("Documents").oData.results.
        filter(x => x.RN2DOCDATA.Dtid == this.byId("IconTabBar").getSelectedKey());


      this.getView().setModel(new JSONModel(), "FilteredDocuments");
      this.getView().getModel("FilteredDocuments").setProperty("/results", filteredResults);
    },

    onPARTORECALPressed: function (alias) {

      let recomText = this.getModel("KeyValue").getProperty(`/${alias}/0/KeyText`);
      if (recomText) this.getModel("CAD_CTREMB").setProperty("/content/PARTORECAL/Value", recomText);

    },

    onBirthsTemplatePress: function (oEvent) {

      let selected = oEvent.getParameter("selected");
      this.getModel("CAD_CTREMB").setProperty(`/content/PARTOPLGEN/Value`, selected ? "X" : "");

      let i18n = this.getView().getModel("i18n").getResourceBundle();
      var template = ""

      if (selected) {

        /*
        El día  <fecha>  a las  <hora>  horas  se asiste a <tipo parto por/cesarea por + valor campo > 
        naciendo <sexo:varón/mujer/indeterminado><estado: vivo/a/muerto/a> de  <peso>    gr. APAGAR: <valor apgar> . 
        Alumbramiento <alumbramiento>. Cordón <cordon>. Ph de cordón <valor ph> .
        */

        let births = this.getModel("CAD_CTREMB").getProperty("/Births");
        let episi = this.getModel("CAD_CTREMB").getProperty("/content/PARTOEPISI/Value");
        let desga = this.getModel("CAD_CTREMB").getProperty("/content/PARTODESGR/Value");
        let desgaTxt = this.getModel("KeyValue").getProperty("/PARTODESGR").find(x => x.KeyValue == desga)?.KeyText || desga;
        let ligat = this.getModel("CAD_CTREMB").getProperty("/content/LIGADURA_T/Value");
        let tsang = this.getModel("CAD_CTREMB").getProperty("/content/PARTOTSANG/Value");
        let bsang = this.getModel("CAD_CTREMB").getProperty("/content/BANCOSANGR/Value");
        let bsangTxt = this.getModel("KeyValue").getProperty("/BANCOSANGR").find(x => x.KeyValue == bsang)?.KeyText || bsang;

        births.forEach(b => {

          let ptipoTxt = this.getModel("KeyValue").getProperty("/PARTOTIPO").find(x => x.KeyValue == b.X00TOTIPO)?.KeyText || b.X00TOTIPO;
          let cesaTxt = this.getModel("KeyValue").getProperty("/PARTOCESAR").find(x => x.KeyValue == b.X00TOCESAR)?.KeyText || b.X00TOCESAR;
          let sexTxt = this.getModel("KeyValue").getProperty("/NACSEXO").find(x => x.KeyValue == b.NACSEXO)?.KeyText || b.NACSEXO;
          let statTxt = this.getModel("KeyValue").getProperty("/DECESO").find(x => x.KeyValue == b.DECESO)?.KeyText || b.DECESO;
          let alumbTxt = this.getModel("KeyValue").getProperty("/ALUMBRA").find(x => x.KeyValue == b.ALUMBRA)?.KeyText || b.ALUMBRA;
          let cordonTxt = this.getModel("KeyValue").getProperty("/CORDON").find(x => x.KeyValue == b.CORDON)?.KeyText || b.CORDON;

          // El día  <fecha>
          template = `${template}${i18n.getText('template10a')} ${b.X00TOFECHA}`;
          // a las  <hora> horas  se asiste a 
          template = `${template} ${i18n.getText('template10b')} ${b.X00TOHORA} ${i18n.getText('template10c')}`;
          //<tipo parto por/cesarea por + valor campo >.
          if (b.X00TOTIPO != "") {
            template = `${template} ${i18n.getText('template10c1')} ${ptipoTxt}.`;
          } else if (b.X00TOCESAR != "") {
            template = `${template} ${i18n.getText('template10c2')} ${cesaTxt}.`;
          }
          // // naciendo <sexo:varón/mujer/indeterminado><estado: vivo/a/muerto/a>
          // Recien nacido <estado> con genitales de género <genitales: femenino/masculino/indeterminado>
          template = `${template} ${i18n.getText('template10d')} ${statTxt} ${i18n.getText('template10d2')} ${sexTxt}`;
          // de <peso> gr. APAGAR: <valor apgar> .
          template = `${template} ${i18n.getText('template10e')} ${parseFloat(b.NACPESO)} ${i18n.getText('template10f')} ${b.APGAR}.`;
          // Alumbramiento <alumbramiento>. 
          if (b.ALUMBRA === "03") {
            template = `${template} ${alumbTxt}.`;
          } else {
            template = `${template} ${i18n.getText('template10g')} ${alumbTxt}.`;
          }
          // Cordón <cordon>. 
          template = `${template} ${i18n.getText('template10h')} ${cordonTxt}.`;
          // Ph de cordón <valor ph> .
          template = `${template} ${i18n.getText('template10i')} ${parseFloat(b.PH)}.`;

          template = `${template}\n\n`;
        });

        //<Episiotomia NO y Desgarro NO> “No se realiza episiotomía ni se produce desgarro.”
        if (episi == "" && desga == "") template = `${template}${i18n.getText('template20')}`;
        //<Episiotomia SI y Desgarro NO> “Se realiza episiotomía que se sutura sin incidencias.”
        if (episi == "X" && desga == "") template = `${template}${i18n.getText('template21')}`;
        //<Episiotomia SI y Desgarro SI> “Se realiza episiotomía y se produce desgarro tipo <valor desgarro> que se suturan sin incidencias.”
        if (episi == "X" && desga != "") template = `${template}${i18n.getText('template22a')} ${desgaTxt} ${i18n.getText('template22b')}`;
        //<Episiotomia NO y Desgarro SI> “Se produce desgarro tipo <valor desgarro> que se suturan sin incidencias.”
        if (episi == "" && desga != "") template = `${template}${i18n.getText('template23a')} ${desgaTxt} ${i18n.getText('template23b')}`;
        //<Toma sangre SI> “Se recoge sangre de cordón por deseo de los padres para banco <valor banco>. 
        if (tsang == "X") template = `${template} ${i18n.getText('template24')} ${bsangTxt}.`;
        //<Ligadura trompas SI> “Se realiza ligadura de trompas por deseo de la paciente”
        if (ligat == "X") template = `${template} ${i18n.getText('template25')}`;
        //“Tacto vaginal y rectal normales”
        template = `${template} ${i18n.getText('template26')}`;
      }

      this.getModel("CAD_CTREMB").setProperty("/content/PARTOPL/Value", template);

    },

    onDischargeButtonPress: function (oEvent, model) {

      var MOV_FDISFL = this.getModel(model).getProperty("/content/MOV_FDISFL/Value") === "X";

      if (!MOV_FDISFL) {

        this.getModel(model).setProperty("/content/MOV_FDISFL/Value", "X");

        var d = new Date(),
          month = '' + (d.getMonth() + 1).toString().padStart(2, 0),
          day = '' + d.getDate().toString().padStart(2, 0),
          year = d.getFullYear(),
          hour = d.getHours().toString().padStart(2, 0),
          min = d.getMinutes().toString().padStart(2, 0),
          sec = d.getSeconds().toString().padStart(2, 0);

        this.getModel(model).setProperty("/content/MOV_FDATDI/Value", `${day}.${month}.${year}`);
        this.getModel(model).setProperty("/content/MOV_FTIMDI/Value", `${hour}:${min}`);

        if (model == "CAD_AE") {
          const header = this.byId("CAD_AE").getContent()[0];
        
          this.byId("container-hcfi---Main--cadae--rMOV_FDTYPE").setSelectedIndex(9);
                   
          this.getModel(model).setProperty(
            "/content/MOV_FDTYPE/Value",
            this.byId("container-hcfi---Main--cadae--rMOV_FDTYPE")
              .getSelectedButton().getBindingContext("KeyValue")
              .getObject().KeyValue
          );
          this.byId("container-hcfi---Main--cadae--rMOV_FSTYDA").setSelectedIndex(0);
          this.getModel(model).setProperty(
            "/content/MOV_FSTYDA/Value",
            this.byId("container-hcfi---Main--cadae--rMOV_FSTYDA")
              .getSelectedButton().getBindingContext("KeyValue")
              .getObject().KeyValue
          );
          this.byId("container-hcfi---Main--cadae--rMOV_FTRADC").setSelectedIndex(0);
          this.getModel(model).setProperty(
            "/content/MOV_FTRADC/Value",
            this.byId("container-hcfi---Main--cadae--rMOV_FTRADC")
              .getSelectedButton().getBindingContext("KeyValue")
              .getObject().KeyValue
          );

        }

      } else {
        this.getModel(model).setProperty("/content/MOV_FDISFL/Value", "");
        this.getModel(model).setProperty("/content/MOV_FDATDI/Value", "");
        this.getModel(model).setProperty("/content/MOV_FTIMDI/Value", "");
        this.getModel(model).setProperty("/content/MOV_FDTYPE/Value", "");
        this.getModel(model).setProperty("/content/MOV_CSTRAS/Value", "");
        this.getModel(model).setProperty("/content/MOV_FSTYDA/Value", "");
        this.getModel(model).setProperty("/content/MOV_FTRADI/Value", "");
        this.getModel(model).setProperty("/content/MOV_FTRADC/Value", "");
        this.getModel(model).setProperty("/content/MOV_FREADI/Value", "");

        if (model == "CAD_AE") {
          this.getModel(model).setProperty("/content/MOV_UO/Value", "");
          this.byId("container-hcfi---Main--cadae--labelSpeciality").setProperty("visible", false);
          this.byId("container-hcfi---Main--cadae--selectSpecialty").setProperty("visible", false);
          this.byId("container-hcfi---Main--cadae--selectSpecialty")
            .setSelectedKey(this.getModel(model).getProperty("/content/MOV_UO/Value"))

        }
      }
    },
    DisChargeUrgeRadioButtom: function (oEvent) {
      var itemSelected = this.byId(oEvent.mParameters.id).getSelectedButton().getBindingContext("KeyValue").getObject();
      if (itemSelected.KeyValue == "02" && itemSelected.Field == "MOV_FDTYPE") {
        var rMOV_FSTYDA = this.byId(oEvent.mParameters.id.substring(0, 30) + "rMOV_FSTYDA").aRBs.find(r =>
          r.getBindingContext("KeyValue").getObject().KeyValue == "08" &&
          r.getBindingContext("KeyValue").getObject().Field == "MOV_FSTYDA");

        if (rMOV_FSTYDA.sId.length == 54) {
          rMOV_FSTYDA.getParent().setSelectedIndex(
            parseInt(rMOV_FSTYDA.sId.substring(rMOV_FSTYDA.sId.length - 1, rMOV_FSTYDA.sId.length))
          );
        } else {
          rMOV_FSTYDA.getParent().setSelectedIndex(
            parseInt(rMOV_FSTYDA.sId.substring(rMOV_FSTYDA.sId.length - 2, rMOV_FSTYDA.sId.length))
          );
        }
        //Seteo de valores para envio a Back
        this.getModel("CAD_AE").setProperty(
          "/content/MOV_FSTYDA/Value",
          rMOV_FSTYDA.getBindingContext("KeyValue").getObject().KeyValue
        );

        var rMOV_CSTRAS = this.byId(oEvent.mParameters.id.substring(0, 30) + "rMOV_CSTRAS").aRBs.find(r =>
          r.getBindingContext("KeyValue").getObject().KeyValue == "OTR" &&
          r.getBindingContext("KeyValue").getObject().Field == "MOV_CSTRAS");

        if (rMOV_CSTRAS.sId.length == 54) {
          rMOV_CSTRAS.getParent().setSelectedIndex(
            parseInt(rMOV_CSTRAS.sId.substring(rMOV_CSTRAS.sId.length - 1, rMOV_CSTRAS.sId.length))
          );
        } else {
          rMOV_CSTRAS.getParent().setSelectedIndex(
            parseInt(rMOV_CSTRAS.sId.substring(rMOV_CSTRAS.sId.length - 2, rMOV_CSTRAS.sId.length))
          );
        }
        //Seteo de valores para envio a Back
        this.getModel("CAD_AE").setProperty(
          "/content/MOV_CSTRAS/Value",
          rMOV_CSTRAS.getBindingContext("KeyValue").getObject().KeyValue
        );

      }
      if (itemSelected.KeyValue == "10" && itemSelected.Field == "MOV_FDTYPE") {
        var radioButtom = this.byId(oEvent.mParameters.id.substring(0, 30) + "rMOV_FSTYDA").aRBs.find(r =>
          r.getBindingContext("KeyValue").getObject().KeyValue == "02" &&
          r.getBindingContext("KeyValue").getObject().Field == "MOV_FSTYDA");

        if (radioButtom.sId.length == 54) {
          radioButtom.getParent().setSelectedIndex(
            parseInt(radioButtom.sId.substring(radioButtom.sId.length - 1, radioButtom.sId.length))
          );
        } else {
          radioButtom.getParent().setSelectedIndex(
            parseInt(radioButtom.sId.substring(radioButtom.sId.length - 2, radioButtom.sId.length))
          );
        }

        this.getModel("CAD_AE").setProperty(
          "/content/MOV_FSTYDA/Value",
          radioButtom.getBindingContext("KeyValue").getObject().KeyValue
        );
      }
      if (itemSelected.KeyValue == "99" && itemSelected.Field == "MOV_FDTYPE") {
        var radioButtom = this.byId(oEvent.mParameters.id.substring(0, 30) + "rMOV_FDTYPE").aRBs.find(r =>
          r.getBindingContext("KeyValue").getObject().KeyValue == "99" &&
          r.getBindingContext("KeyValue").getObject().Field == "MOV_FDTYPE");
        this.getModel("CAD_AE").setProperty(
          "/content/MOV_FDTYPE/Value",
          radioButtom.getBindingContext("KeyValue").getObject().KeyValue
        );
      }
      if (itemSelected.KeyValue == "05" && itemSelected.Field == "MOV_FDTYPE") {
        var radioButtom = this.byId(oEvent.mParameters.id.substring(0, 30) + "rMOV_CSTRAS").aRBs.find(r =>
          r.getBindingContext("KeyValue").getObject().KeyValue == "OTR" &&
          r.getBindingContext("KeyValue").getObject().Field == "MOV_CSTRAS");

        if (radioButtom.sId.length == 54) {
          radioButtom.getParent().setSelectedIndex(
            parseInt(radioButtom.sId.substring(radioButtom.sId.length - 1, radioButtom.sId.length))
          );
        } else {
          radioButtom.getParent().setSelectedIndex(
            parseInt(radioButtom.sId.substring(radioButtom.sId.length - 2, radioButtom.sId.length))
          );
        }
        //Seteo de valores para envio a Back
        this.getModel("CAD_AE").setProperty(
          "/content/MOV_CSTRAS/Value",
          radioButtom.getBindingContext("KeyValue").getObject().KeyValue
        );

      }

      if (itemSelected.KeyValue != "02" && itemSelected.Field == "MOV_FDTYPE") {
        this.byId("container-hcfi---Main--cadae--rMOV_CSTRAS").setSelectedIndex(-1)
        this.getModel("CAD_AE").setProperty("/content/MOV_CSTRAS/Value", "");
      }
      this.activateSpecialtyVisibility();
      this.getModel("CAD_AE").setProperty("/content/" + itemSelected.Field + "/Value", itemSelected.KeyValue);

    },
    activateSpecialtyVisibility: function () {
      if (this.byId("container-hcfi---Main--cadae--rMOV_FDTYPE")
        .getSelectedButton().getBindingContext("KeyValue")
        .getObject().KeyValue == "01" &&
        this.byId("container-hcfi---Main--cadae--rMOV_FSTYDA")
          .getSelectedButton().getBindingContext("KeyValue")
          .getObject().KeyValue == "10") {
        this.byId("container-hcfi---Main--cadae--labelSpeciality").setProperty("visible", true)
        this.byId("container-hcfi---Main--cadae--selectSpecialty").setProperty("visible", true)
      } else {
        this.getModel("CAD_AE").setProperty("/content/MOV_UO/Value", "");
        this.byId("container-hcfi---Main--cadae--labelSpeciality").setProperty("visible", false)
        this.byId("container-hcfi---Main--cadae--selectSpecialty").setProperty("visible", false)

        this.byId("container-hcfi---Main--cadae--selectSpecialty")
          .setSelectedKey(this.getModel("CAD_AE").getProperty("/content/MOV_UO/Value"))
      }
    },
    //Select Radiobutton with Information On Back
    setRadioButtomSelectedIndex: function () {
      //Clase de alta
      var rMOV_FDTYPE = this.byId('container-hcfi---Main--cadae--rMOV_FDTYPE').aRBs.find(r =>
        r.getBindingContext("KeyValue").getObject().KeyValue ==
        this.getModel("CAD_AE").getProperty("/content/MOV_FDTYPE/Value")
      );
      if (rMOV_FDTYPE)
        if (rMOV_FDTYPE.sId.length == 54) {
          rMOV_FDTYPE.getParent().setSelectedIndex(
            parseInt(rMOV_FDTYPE.sId.substring(rMOV_FDTYPE.sId.length - 1, rMOV_FDTYPE.sId.length))
          );
        } else {
          const header = this.byId("CAD_AE").getContent()[0];
          if (header.getHeaderTitle().getExpandedContent()[0].getText() == this.getModel("i18n").getProperty("New")) {
            rMOV_FDTYPE.getParent().setSelectedIndex(9);
          } else {
            rMOV_FDTYPE.getParent().setSelectedIndex(
              parseInt(rMOV_FDTYPE.sId.substring(rMOV_FDTYPE.sId.length - 2, rMOV_FDTYPE.sId.length))
            );
          }
        }
      //Traslado a otro centro
      var rMOV_CSTRAS = this.byId('container-hcfi---Main--cadae--rMOV_CSTRAS').aRBs.find(r =>
        r.getBindingContext("KeyValue").getObject().KeyValue ==
        this.getModel("CAD_AE").getProperty("/content/MOV_CSTRAS/Value"));

      if (rMOV_CSTRAS != "" && rMOV_CSTRAS)
        if (rMOV_CSTRAS.sId.length == 54) {
          rMOV_CSTRAS.getParent().setSelectedIndex(
            parseInt(rMOV_CSTRAS.sId.substring(rMOV_CSTRAS.sId.length - 1, rMOV_CSTRAS.sId.length))
          );
        } else {
          rMOV_CSTRAS.getParent().setSelectedIndex(
            parseInt(rMOV_CSTRAS.sId.substring(rMOV_CSTRAS.sId.length - 2, rMOV_CSTRAS.sId.length))
          );
        }
      //Continuidad asistencial
      var rMOV_FSTYDA = this.byId('container-hcfi---Main--cadae--rMOV_FSTYDA').aRBs.find(r =>
        r.getBindingContext("KeyValue").getObject().KeyValue ==
        this.getModel("CAD_AE").getProperty("/content/MOV_FSTYDA/Value") &&
        r.getBindingContext("KeyValue").getObject().KeyValue != ""
      );
      if (rMOV_FSTYDA)
        if (rMOV_FSTYDA.sId.length == 54) {
          rMOV_FSTYDA.getParent().setSelectedIndex(
            parseInt(rMOV_FSTYDA.sId.substring(rMOV_FSTYDA.sId.length - 1, rMOV_FSTYDA.sId.length))
          );
        } else {
          rMOV_FSTYDA.getParent().setSelectedIndex(
            parseInt(rMOV_FSTYDA.sId.substring(rMOV_FSTYDA.sId.length - 2, rMOV_FSTYDA.sId.length))
          );
        }
      //Tipo        
      var rMOV_FTRADC = this.byId('container-hcfi---Main--cadae--rMOV_FTRADC').aRBs.find(r =>
        r.getBindingContext("KeyValue").getObject().KeyValue ==
        this.getModel("CAD_AE").getProperty("/content/MOV_FTRADC/Value") &&
        r.getBindingContext("KeyValue").getObject().KeyValue != ""
      );
      if (rMOV_FTRADC)
        if (rMOV_FTRADC.sId.length == 54) {
          rMOV_FTRADC.getParent().setSelectedIndex(
            parseInt(rMOV_FTRADC.sId.substring(rMOV_FTRADC.sId.length - 1, rMOV_FTRADC.sId.length))
          );
        } else {
          rMOV_FTRADC.getParent().setSelectedIndex(
            parseInt(rMOV_FTRADC.sId.substring(rMOV_FTRADC.sId.length - 2, rMOV_FTRADC.sId.length))
          );
        }
      this.byId("container-hcfi---Main--cadae--selectSpecialty").setSelectedKey(this.getModel("CAD_AE").getProperty("/content/MOV_UO/Value"));
      this.activateSpecialtyVisibility();
    },

    setSpecialty: function (oEvent) {
      this.getModel("CAD_AE").setProperty("/content/MOV_UO/Value", oEvent.getParameter("selectedItem").getKey());
    },

    updateSexT3: function (oEvent) {

      let sexT2 = this.getModel("CAD_CTREMB").getProperty("/SexT2");
      var sexT3 = this.getModel("CAD_CTREMB").getProperty("/SexT3");

      sexT3.forEach((v, i) => {
        v["X00_SEXO"] = sexT2[i]["EMB_SEXO"];
      });

      //this.getModel("CAD_CTREMB").updateBindings(true);

    },

    onChangePARTOFECHA: function (oEvent) {

      const fur = this.getModel("CAD_CTREMB").getProperty("/content/EMB_FURCOR/Value") || this.getModel("CAD_CTREMB").getProperty("/content/EMB_CTRFUR/Value");
      const EMB_FURCORSplit = fur.split(".");
      const EMB_FURCOR = new Date(EMB_FURCORSplit[2], EMB_FURCORSplit[1] - 1, EMB_FURCORSplit[0]);

      var c = oEvent.getSource().getParent().getBindingContext("CAD_CTREMB").getObject()

      const X00TOFECHASplit = c.X00TOFECHA.split(".");
      const X00TOFECHA = new Date(X00TOFECHASplit[2], X00TOFECHASplit[1] - 1, X00TOFECHASplit[0]);
      const ss = Math.floor((X00TOFECHA.getTime() - EMB_FURCOR.getTime()) / (1000 * 3600 * 24) / 7);
      const dd = Math.floor((X00TOFECHA.getTime() - EMB_FURCOR.getTime()) / (1000 * 3600 * 24) % 7);

      const egampliada = dd === 0 ? `${ss} sem.` : `${ss} sem. ${dd} d.`;

      this.getModel("CAD_CTREMB").setProperty(`/Births/${c.X01_EMBID - 1}/EGAMPLIADA`, egampliada);

    },
    onDropHistory: function (oEvent, sModel) {
      if (this.getModel(sModel).getProperty("/Dokst") === "FR") return
      let droppedObject = oEvent.getParameter("draggedControl").getBindingContext("MedicalDataOverview").getObject();
      let key = JSON.parse(droppedObject.Object).key;
      var object = {};

      if (this.getModel(sModel).getProperty("/DroppedHistoryModel")?.find(d => d.ID === key)) return

      switch (droppedObject.MedType) {
        case "Alergia":
          object = this.getModel("PatientAllergy").getData().results.find(x => x.AllergySeqno === key);
          var al = this.getModel(sModel).getProperty("/Allergies");
          if (droppedObject.Description == "No refiere") {
            al.push({
              PAT_FALLDS: droppedObject.Description,
              PAT_FALLGR: "",
              PAT_FALLID: key,
              PAT_FALLRA: "",
              PAT_FALLSE: "",
              PAT_FALLTY: "",
              PAT_FALLCE: "",
              PAT_FALLVA: "",
              PAT_FALLOB: ""
            })
            this.getView().getModel(sModel).getData().content.PAT_FALLST.Value = "Ninguna alergia";
          } else {
            al.push({
              PAT_FALLDS: object.Descr,
              PAT_FALLGR: object.parent.Bcpname,
              PAT_FALLID: object.AllergySeqno,
              PAT_FALLRA: "",
              PAT_FALLSE: "",
              PAT_FALLTY: object.Typ,
              PAT_FALLCE: object.Cer,
              PAT_FALLVA: object.Evaluation,
              PAT_FALLOB: object.Adcomment
            });
            this.getView().getModel(sModel).getData().content.PAT_FALLST.Value = "Existen alergias";
          }
          this.getModel(sModel).setProperty("/Allergies", al);
          break;
        case "Antecedente médico":
          object = this.getModel("PatientMedicalHistory").getData().results.find(x => x.MedHistid === key);
          var mh = this.getModel(sModel).getProperty("/MedicalAntecedents");

          mh.push({
            PAT_FDISNA: object.ZPMH.NameChild,
            PAT_FDISDA: object.DateMedHist,
            PAT_FDISTR: object.Treatment,
            PAT_FDISRM: object.RemarksInt,
            PAT_FDISID: object.MedHistid,
            PAT_FDISCM: object.Remarks
          });

          this.getModel(sModel).setProperty("/MedicalAntecedents", mh);
          break;
        case "Antecedente quirúrgico":
          object = this.getModel("PatientSurgeryHistory").getData().results.find(x => x.SurgHistid === key);
          var sh = this.getModel(sModel).getProperty("/SurgicalAntecedents");

          sh.push({
            PAT_FSURDT: object.DateSurg,
            PAT_FSURNA: object.ZPSH.NameChild,
            PAT_FSURRM: object.RemarksInt,
            PAT_FSURAN: "",
            PAT_FSURID: object.SurgHistid,
            PAT_FSURCM: object.Remarks
          });

          this.getModel(sModel).setProperty("/SurgicalAntecedents", sh);
          break;
        case "Antecedente familiar":
          object = this.getModel("PatientFamilyHistory").getData().results.find(x => x.FamilyHistid === key);
          var fh = this.getModel(sModel).getProperty("/FamilyAntecedents");

          fh.push({
            PAT_FFHNAM: object.ZMFH.NameChild,
            PAT_FFHRMK: object.FamComment,
            PAT_FRSIB: "",
            PAT_FFHID: object.FamilyHistid,
            PAT_FRBRO: object.Brother,
            PAT_FRFAT: object.Father,
            PAT_FRGRA: "",
            PAT_FRMAGP: object.MaternalGrandparents,
            PAT_FRMOM: object.Mother,
            PAT_FRPAGP: object.PaternalGrandparents,
            PAT_FRSIS: object.Sister,
            PAT_FRSON: object.Son,
            PAT_FFHROB: object.RemarksInt
          });

          this.getModel(sModel).setProperty("/FamilyAntecedents", fh);
          break;
        case "Factor de riesgo":
          object = this.getModel("PatientRiskFactor").getData().results.find(x => x.Rsfnr === key);
          var rf = this.getModel(sModel).getProperty("/RiskFactors");

          rf.push({
            PAT_FRFDSC: object.Rsfna,
            PAT_FRFCOD: object.Rsfnr,
            PAT_FRFCOM: "",
            PAT_FRFID: "000",
          });

          this.getModel(sModel).setProperty("/RiskFactors", rf);
          break;
        case "Hábito":
          if(sModel == "CAD_GINE") return;
          var sh = this.getModel(sModel).getProperty("/SocialHabits") || [];

          sh.push({
            P_HABIT_ID: key,
            P_HABIT_D: droppedObject.Description,
          });

          this.getModel(sModel).setProperty("/SocialHabits", sh);
          break;
        default:
          break;
      }

      this.fillDocumentHistoryModel(sModel);
      //this.fillDroppedHistoryModel(sModel);

    },

    onDropVitalSigns: function (oEvent, sModel) {
      if (this.getModel(sModel).getProperty("/Dokst") === "FR") return
      var droppedObject = {};
      try {
        droppedObject = oEvent.getParameter("draggedControl").getParent().getBindingContext("VitalSigns").getObject();
      } catch (e) {
        return;
      }

      let value = oEvent.getParameter("draggedControl").getText();
      let date = new Date(oEvent.getParameter("draggedControl").getBinding("text").getPath().split('/value')[0]);

      var vsList = this.getModel(sModel).getProperty('/VitalSignsExamTable');
      vsList.push({
        CLI_FVSDSC: droppedObject.description,
        CLI_FVSVAL: `${value} ${droppedObject.unit}`,
        CLI_FVSNRA: `${droppedObject.rangeNormalLow} ${droppedObject.unit} - ${droppedObject.rangeNormalHigh} ${droppedObject.unit}`,
        CLI_FVSTIM: DateFormat.getDateTimeInstance({ pattern: "dd.MM.yyyy/HH:mm:ss" }).format(date),
        CLI_FVSID: droppedObject.positionId,
        CLI_FVSUNI: droppedObject.unit
      });

      this.getModel(sModel).setProperty("/VitalSignsExamTable", vsList);
    },

    onDropServices: function (oEvent, sModel) {
      if (this.getModel(sModel).getProperty("/Dokst") === "FR") return
      let droppedObject = {};
      try {
        droppedObject = oEvent.getParameter("draggedControl").getBindingContext("Services").getObject();
      } catch (e) {
        return;
      }
      if (this.getModel(sModel).getProperty("/Services").find(s =>
        s.SRV_FIDPSR == droppedObject.Service.Lnrls))
        return

      var vsList = this.getModel(sModel).getProperty('/Services');
      vsList.push({
        ORD_FASSCD: DateFormat.getDateTimeInstance({ pattern: "dd.MM.yyyy" }).format(droppedObject.Service.Erdat),
        SRV_FIDPSR: droppedObject.Service.Lnrls,
        ORD_FASSD: droppedObject.Text,
        PMD_FREST: droppedObject.ResultsData,
        ORD_FERNAM: droppedObject.DrText
      });

      this.getModel(sModel).setProperty("/Services", vsList);
    },

    onServiceResultsButtonPress: function (oEvent) {

      this._itemsToUpload = [];

      let oService = oEvent.getSource().getParent().getBindingContext("Services").getObject();

      this.setModel(new JSONModel(oService), "selectedService");

      if (oService.ResultsDocument.Doknr && oService.ResultsDocument.Dokst === 'FR') {
        this._pdfViewer.setSource(`/sap/opu/odata/sap/ZISH_HCFI_SRV/PDFSet(Dokar='${oService.ResultsDocument.Dokar}',Doknr='${oService.ResultsDocument.Doknr}',Dokvr='${oService.ResultsDocument.Dokvr}',Doktl='${oService.ResultsDocument.Doktl}')/$value`);
        this._pdfViewer.setTitle(oService.ResultsDocument.Dktxt);
        this._pdfViewer.open();
      } else {
        this.oServiceResultsDialog ? this.oServiceResultsDialog.open() : this.loadFragment({
          type: "XML",
          name: "com.resulto.hcfi.view.ServiceResult"
        }).then(function (oDialog) {
          this.oServiceResultsDialog = oDialog;
          oDialog.open();
        }.bind(this));
      }

    },

    fillDroppedHistoryModel: function (sModel) {
      let rf = this.getModel(sModel).getProperty("/RiskFactors") || [];
      let al = this.getModel(sModel).getProperty("/Allergies") || [];
      let mh = this.getModel(sModel).getProperty("/MedicalAntecedents") || [];
      let fh = this.getModel(sModel).getProperty("/FamilyAntecedents") || [];
      let sa = this.getModel(sModel).getProperty("/SurgicalAntecedents") || [];
      let sh = this.getModel(sModel).getProperty("/SocialHabits") || [];
      var overviewData = this.getModel("MedicalDataOverview").getData().results;

      var droppedHistoryModel = [];
      al.forEach(a => {
        try{
          if (a.PAT_FALLDS == "No refiere") {          
            droppedHistoryModel.push({ medtype: "Alergias", description: a.PAT_FALLDS, ID: a.PAT_FALLID });
          } else if (a.PAT_FALLDS != "No refiere") {
            let o = overviewData.find(x => JSON.parse(x.Object).key === a.PAT_FALLID);
            droppedHistoryModel.push({ medtype: "Alergias", description: o.Description, ID: a.PAT_FALLID });
          }
        }catch(e){

        }
      });
      mh.forEach(m => {
        try{
        let o = overviewData.find(x => JSON.parse(x.Object).key === m.PAT_FDISID);
        droppedHistoryModel.push({ medtype: "Antecedente médico", description: o.Description, ID: m.PAT_FDISID });
        }catch(e){

        }
      });
      sa.forEach(s => {
        try{
        let o = overviewData.find(x => JSON.parse(x.Object).key === s.PAT_FSURID);
        droppedHistoryModel.push({ medtype: "Antecedente quirúrgico", description: o.Description, ID: s.PAT_FSURID });
        }catch(e){

        }
      });
      fh.forEach(f => {
        try{
          let o = overviewData.find(x => JSON.parse(x.Object).key === f.PAT_FFHID);
          if (o != undefined) {
            droppedHistoryModel.push({ medtype: "Antecedente familiar", description: o.Description, ID: f.PAT_FFHID });
          }
        }catch(e){

        }

      });
      rf.forEach(r => {
        try{
        let o = overviewData.find(x => JSON.parse(x.Object).key === r.PAT_FRFCOD);
        droppedHistoryModel.push({ medtype: "Factor de riesgo", description: o.Description, ID: r.PAT_FRFCOD });
        }catch(e){

        }
      });
      sh.forEach(h => {
        try{
        droppedHistoryModel.push({ medtype: "Hábito Social", description: h.P_HABIT_D, ID: h.P_HABIT_ID });
        }catch(e){

        }
      });

      this.getModel(sModel).setProperty("/DroppedHistoryModel", droppedHistoryModel);

    },

    fillDocumentHistoryModel: function(sModel){
      let rf = this.getModel(sModel).getProperty("/RiskFactors") || [];
      let al = this.getModel(sModel).getProperty("/Allergies") || [];
      let mh = this.getModel(sModel).getProperty("/MedicalAntecedents") || [];
      let fh = this.getModel(sModel).getProperty("/FamilyAntecedents") || [];
      let sa = this.getModel(sModel).getProperty("/SurgicalAntecedents") || [];
      let sh = this.getModel(sModel).getProperty("/SocialHabits") || [];
      

      var documentHistoryModel = [];
      al.forEach(a => {
        try{
          if (a.PAT_FALLDS == "No refiere") {          
            documentHistoryModel.push({ medtype: "Alergias", description: a.PAT_FALLDS, ID: a.PAT_FALLID });
          } else if (a.PAT_FALLDS != "No refiere") {
            let alDescription = "";
            let alTyp = this.getModel("KeyValue").getData().N2AD_TYP.find(n => n.KeyValue == a.PAT_FALLTY)?.KeyText;
            let alEval = this.getModel("KeyValue").getData().N2AD_EVALUATION.find(n => n.KeyValue == a.PAT_FALLVA)?.KeyText 
            let alCer = this.getModel("KeyValue").getData().N2AD_CER.find(n => n.KeyValue == a.PAT_FALLCE)?.KeyText;
            if(a.PAT_FALLDS)
            alDescription += ""+a.PAT_FALLDS;
            if(a.PAT_FALLOB)
            alDescription += "\n"+"Observaciones: "+a.PAT_FALLOB;
            if(alCer)
            alDescription += "\n"+"Certeza: "+alCer;
            if(alEval)
            alDescription += "\n"+"Valoración: "+alEval;
            if(alTyp)
            alDescription += "\n"+"Tipo: "+alTyp;
           
            documentHistoryModel.push({ medtype: "Alergias", description: alDescription, ID: a.PAT_FALLID });
          }
        }catch(e){

        }
      });
      mh.forEach(m => {
        try{
          let mhDescription = "";
          if(m.PAT_FDISNA)
            mhDescription += ""+m.PAT_FDISNA+" - ";
          if(m.PAT_FDISDA){
            var date =  DateFormat.getDateTimeInstance({ pattern: "dd.MM.yyyy" }).format(new Date(m.PAT_FDISDA))
            mhDescription += ""+date;
          }
          if(m.PAT_FDISTR)
            mhDescription += "\n"+"Tratamiento: "+m.PAT_FDISTR;
          if(m.PAT_FDISRM)
            mhDescription += "\n"+"Observaciones: "+m.PAT_FDISRM;
          if(m.PAT_FDISCM)
            mhDescription += "\n"+"Comentarios: "+m.PAT_FDISCM;

          documentHistoryModel.push({ medtype: "Antecedente médico", description: mhDescription, ID: m.PAT_FDISID });
        }catch(e){

        }
      });
      sa.forEach(s => {
        
        try{
          let saDescription = "";
        if(s.PAT_FSURNA)
          saDescription += ""+s.PAT_FSURNA;
        if(s.PAT_FSURDT){
          var date =  DateFormat.getDateTimeInstance({ pattern: "dd.MM.yyyy" }).format(new Date(s.PAT_FSURDT))
          saDescription += " - "+date;
        }
        if(s.PAT_FSURRM)
          saDescription += "\n"+"Observaciones: "+s.PAT_FSURRM;
        if(s.PAT_FSURCM)
          saDescription += "\n"+"Comentarios: "+s.PAT_FSURCM;
        
        documentHistoryModel.push({ medtype: "Antecedente quirúrgico", description: saDescription, ID: s.PAT_FSURID });
        }catch(e){

        }
      });
      fh.forEach(f => {
        try{
          let fhDescription = "";
          if(f.PAT_FFHNAM)
            fhDescription += ""+f.PAT_FFHNAM;
          if(f.PAT_FRMOM || f.PAT_FRMAGP || f.PAT_FRPAGP || f.PAT_FRSIS || f.PAT_FRSON || f.PAT_FRBRO || f.PAT_FRFAT){
            fhDescription += " ("
            if(f.PAT_FRMOM)
            fhDescription += " "+this.getModel("i18n").getProperty("PAT_FRMOM");
            if(f.PAT_FRFAT)
            fhDescription += " "+this.getModel("i18n").getProperty("PAT_FRFAT");
            if(f.PAT_FRBRO)
            fhDescription += " "+this.getModel("i18n").getProperty("PAT_FRBRO");
            if(f.PAT_FRSIS)
            fhDescription += " "+this.getModel("i18n").getProperty("PAT_FRSIS");
            if(f.PAT_FRSON)
            fhDescription += " "+this.getModel("i18n").getProperty("PAT_FRSON");
            if(f.PAT_FRMAGP)
            fhDescription += " "+this.getModel("i18n").getProperty("PAT_FRMAGP");
            if(f.PAT_FRPAGP)
            fhDescription += " "+this.getModel("i18n").getProperty("PAT_FRPAGP");
            fhDescription += " )"
          }
                 
          if(f.PAT_FFHROB)
            fhDescription += "\n"+"Observaciones: "+f.PAT_FFHROB;
          if(f.PAT_FFHRMK)
            fhDescription += "\n"+"Comentarios: "+f.PAT_FFHRMK; 

            documentHistoryModel.push({ medtype: "Antecedente familiar", description: fhDescription, ID: f.PAT_FFHID });          
        }catch(e){

        }

      });
      rf.forEach(r => {
        try{        
          documentHistoryModel.push({ medtype: "Factor de riesgo", description: r.PAT_FRFDSC, ID: r.PAT_FRFCOD });
        }catch(e){

        }
      });
      sh.forEach(h => {
        try{
        documentHistoryModel.push({ medtype: "Hábito Social", description: h.P_HABIT_D, ID: h.P_HABIT_ID });
        }catch(e){

        }
      });

      this.getModel(sModel).setSizeLimit(1000);
      this.getModel(sModel).setProperty("/DroppedHistoryModel", documentHistoryModel);
   
    },

    _fillFIN_GENObject: function (oService) {

      let mainData = this.getModel("MainData").getData();

      return {
        Dokar: "FIN",
        Doknr: oService.ResultsDocument.Doknr || "9999999999999999999999999",
        Dokst: oService.ResultsDocument.Dokst || "",
        Dokvr: oService.ResultsDocument.Dokvr || "00",
        Doktl: oService.ResultsDocument.Doktl || "000",
        Dotim: { ms: 0, __edmType: "Edm.Time" },
        Einri: oService.Service.Einri,
        Patnr: mainData.CaseData.Patnr,
        Falnr: oService.Service.Falnr,
        Orgdo: oService.Service.Anpoe,
        Mitarb: this.getModel("ProfessionalData").getProperty("/Id"),
        Dtid: "FIN_GEN",
        Dtvers: "001",
        Dodat: new Date(),
        Service: oService.Service.Lnrls,
        InitializationFields: '',
        content: [{
          Alias: "PMD_FREST",
          Dokar: "",
          Doknr: '',
          Doktl: "",
          Dokvr: "",
          Line: 0,
          Value: oService.ResultsData
        }, {
          Alias: "SRV_FIDSRV",
          Dokar: "",
          Doknr: '',
          Doktl: "",
          Dokvr: "",
          Line: 1,
          Value: oService.Service.Lnrls
        }, {
          Alias: "SRV_FPSRV",
          Dokar: "",
          Doknr: '',
          Doktl: "",
          Dokvr: "",
          Line: 1,
          Value: oService.Text
        }, {
          Alias: "PMD_FERNAM",
          Dokar: "",
          Doknr: '',
          Doktl: "",
          Dokvr: "",
          Line: 1,
          Value: this.getModel("ProfessionalData").getProperty("/Name")
        }, {
          Alias: "PMD_FERMLN",
          Dokar: "",
          Doknr: '',
          Doktl: "",
          Dokvr: "",
          Line: 1,
          Value: ''
        }, {
          Alias: "PMD_FERNUM",
          Dokar: "",
          Doknr: '',
          Doktl: "",
          Dokvr: "",
          Line: 1,
          Value: this.getModel("ProfessionalData").getProperty("/Id")
        }]
      };
    },
    onOcPrintPressed: function(e){
      var SelectedList = this.getView().byId("clinicalOrders").getSelectedItems();
        var List = this.getView().getModel("ClinicalOrders").getProperty("/results");
        SelectedList.forEach(element =>{
          var pos= element.oBindingContexts.ClinicalOrders.sPath
          pos =pos.split("/")
          element = List[pos[2]];
          this.__onOcPrint(e, element);
        })
      
    },
    __onOcPrint: function(oEvent, element){
      this.setModel(models.createResultsModel(), "OCPrint");
      const source = oEvent.getSource();
      this.byId("clinicalOrders").setBusy(true);
          var corderId = element.CorderId;
          this.getModel("ZISH_HCFI_SRV").callFunction("/PrintClinicalOrder", {
            urlParameters: {
              "CorderID": corderId,
            },success: function (oResponse) {
              var response = oResponse;
              if(response.results.lenght <= 1){
                var base64EncodedPDF1 = response.results[0].Base64;
                var decodedPdfContent1 = atob(base64EncodedPDF1);
                var byteArray1= new Uint8Array(decodedPdfContent1.length);
                for(var i=0; i<decodedPdfContent1.length; i++){
                  byteArray1[i] = decodedPdfContent1.charCodeAt(i);
                }
                var blob1 = new Blob([byteArray1.buffer],{type: 'application/pdf'});
                var _pdfurl1= URL.createObjectURL(blob1);
                this.byId("clinicalOrders").setBusy(false);
                this._pdfViewer.setSource(_pdfurl1);
                this._pdfViewer.open();
              }else{
                var pdfUrls =[];
                
                  var contador = 0
                  var docName = ""
                  response.results.forEach(element =>{
                    docName = element.TypeDescription;
                  var base64EncodedPDF = element.Base64;
                  var decodedPDFContent = atob(base64EncodedPDF);
                  var byteArray= new Uint8Array(decodedPDFContent.length);
                  for(var i=0; i<decodedPDFContent.length; i++){
                    byteArray[i]= decodedPDFContent.charCodeAt(i);
                  }
                  contador ++
                  var blob = new Blob([byteArray.buffer],{type: 'application/pdf'});
                  var _pdfurl = URL.createObjectURL(blob);
                  pdfUrls.push({"URL": _pdfurl, "NameDoc": docName });
                })
                this.getModel("OCPrint").setProperty("/Docs", pdfUrls);
                this.byId("clinicalOrders").setBusy(false);      
                if(!this._OCPrintFragment){
                  this.loadFragment({
                    type: "XML",
                    name: "com.resulto.hcfi.view.PrintClinicalOrderDialog" 
                  }).then(function (oDialog) {             
                    oDialog.open(source);
                    this._OCPrintFragment = oDialog;
                    this.getView().addDependent(this._OCPrintFragment);
                  })
                }else{
                  this._OCPrintFragment.open()
                }          
              }
            }.bind(this),
            error: function (oError) {
              try {
                this.byId("clinicalOrders").setBusy(false);
                this.displayOdataError("PrintClinicalOrder", JSON.parse(oError.responseText).error.message.value);
              } catch {
                this.displayOdataError("PrintClinicalOrder", oError.message);
              }
            }.bind(this)
          })
          
    },
    onOCDialogClose: function(oEvent){
      oEvent.getSource().getParent().close();
      oEvent.getSource().getParent().destroy();
    },
    onOCDialogObjectPress: function(oEvent){
      var url= oEvent.getSource().getBindingContext("OCPrint").getObject().URL;
      this._pdfViewer.setSource(url);
      this._pdfViewer.open();
    },
    onOcUpdatePressed: function(oEvent){
      var selectedOc = null;
      var List = this.getView().getModel("ClinicalOrders").getProperty("/results");
      var pos= oEvent.oSource.oBindingContexts.ClinicalOrders.sPath
      pos =pos.split("/")
      selectedOc = List[pos[2]];
      var requestid= selectedOc.CorderPositionID;
      var patientid =this.headers.Patient;
      var institutionid = this.headers.Institution;
      var caseid = this.headers.Case;
      var orgid = selectedOc.TreatmentUnit;
      var deptid = selectedOc.MedicalUnit;
      var url = new URL("https://sapdes.gruporecoletas.com/sap/bc/ui5_ui5/sap/zsmartlab/index.html#")
      url.searchParams.set("requestid",requestid )
      url.searchParams.set("patientid",patientid )
      url.searchParams.set("institutionid",institutionid)
      url.searchParams.set("caseid",caseid)
      url.searchParams.set("orgid",orgid)
      url.searchParams.set("deptid",deptid)
      sap.m.URLHelper.redirect( url,true);
    },
    onOcAddPressed: function(){
      var selectedOc = null;
      var List = this.getView().getModel("ClinicalOrders").getProperty("/results");
      selectedOc = List[0];
      var patientid =this.headers.Patient;
      var institutionid = this.headers.Institution;
      var caseid = this.headers.Case;
      var orgid = selectedOc.TreatmentUnit;
      var deptid = selectedOc.MedicalUnit;
      var url = new URL("https://sapdes.gruporecoletas.com/sap/bc/ui5_ui5/sap/zsmartlab/index.html#?")
      url.searchParams.append("patientid",patientid )
      url.searchParams.append("institutionid",institutionid)
      url.searchParams.append("caseid",caseid)
      url.searchParams.append("orgid",orgid)
      url.searchParams.append("deptid",deptid)
      sap.m.URLHelper.redirect( url,true);
    },
    onOcDeletePressed: function(oEvent){
      let source = oEvent.getSource();

      if (!this.deleteOcConfirmationDialog) {
        this.deleteOcConfirmationDialog = new sap.m.Dialog({
          type: sap.m.DialogType.Message,
          title: this.getModel("i18n").getProperty("Eliminate"),
          content: new sap.m.Text({ text: this.getModel("i18n").getProperty("ConfirmDelete") }),
          beginButton: new sap.m.Button({
            type: sap.m.ButtonType.Emphasized,
            text: this.getModel("i18n").getProperty("Confirm"),
            press: function () {
              this.deleteOcConfirmationDialog.close();       
              this.byId("clinicalOrders").setBusy(true);       
              this.onOcDelete(source)
            }.bind(this)
          }),
          endButton: new sap.m.Button({
            text: this.getModel("i18n").getProperty("Cancel"),
            press: function () {
              this.deleteOcConfirmationDialog.close();
            }.bind(this)
          })
        });
      }

      this.deleteOcConfirmationDialog.open();
    },
    onOcDelete: function(){
      var SelectedList = this.getView().byId("clinicalOrders").getSelectedItems();
      var List = this.getView().getModel("ClinicalOrders").getProperty("/results");
      SelectedList.forEach(element =>{
        var pos= element.oBindingContexts.ClinicalOrders.sPath
        pos =pos.split("/")
        element = List[pos[2]];
        this.getModel("ZISH_HCFI_SRV").callFunction("/DeleteClinicalOrderPosition", {
          urlParameters: {
            "CorderPositionID": element.CorderPositionID,
          },success: function (oResponse) {
             
            if (!this.deleteConfirmedDialog) {
              this.deleteConfirmedDialog = new sap.m.Dialog({
                type: sap.m.DialogType.Message,
                title: this.getModel("i18n").getProperty("Eliminate"),
                content: new sap.m.Text({ text: this.getModel("i18n").getProperty("deletionComplete") }),
                endButton: new sap.m.Button({
                  text: this.getModel("i18n").getProperty("close"),
                  press: function () {
                    this.deleteConfirmedDialog.close();
                    this.getClinicalOrders();
                    this.getModel("ClinicalOrders").refresh();
                    this.byId("clinicalOrders").setBusy(false); 
                    this.getView().byId("clinicalOrders").removeSelections(true);
                  }.bind(this)
                })
              });
            }
      
            this.deleteConfirmedDialog.open();
           
          }.bind(this),
          error: function (oError) {
            try {
              this.byId("clinicalOrders").setBusy(false);
              this.displayOdataError("DeleteClinicalOrderPosition", JSON.parse(oError.responseText).error.message.value);
              this.getClinicalOrders();
              this.getModel("ClinicalOrders").refresh();
              this.getView().byId("clinicalOrders").removeSelections(true);
            } catch {
              this.displayOdataError("DeleteClinicalOrderPosition", oError.message);
              this.getView().byId("clinicalOrders").removeSelections(true);
            }
          }.bind(this)})
      })
      
    },
    prefillDefaultData: function (oData) {
      var value = "";
      if (oData.InitializationFields) {
        let defaultData = JSON.parse(oData.InitializationFields);
        defaultData.forEach(defaultValue => {

          if (this.getModel(oData.Dtid).getProperty('/content/' + defaultValue.alias)) {
            switch (defaultValue.alias) {
              case 'MOV_FFEING':
                value = `${defaultValue.value.substr(6, 2)}.${defaultValue.value.substr(4, 2)}.${defaultValue.value.substr(0, 4)}`;
                break;
              case 'MOV_FHRING':
                value = `${defaultValue.value.substr(0, 2)}:${defaultValue.value.substr(2, 2)}:${defaultValue.value.substr(4, 2)}`;
                break;
              default:
                value = defaultValue.value;
            }
            this.getModel(oData.Dtid).setProperty('/content/' + defaultValue.alias + '/Value', value);
          }
        })
      }
    },
    onOcRefreshPressed: function(oEvent){
      // this.getView().byId("clinicalOrders").setBusy(true);
      this.sleep(1000);
      this.getClinicalOrders();
      this.getView().byId("clinicalOrders").removeSelections(true);
     
      // this.getModel("ClinicalOrders").refresh();
      
      // this.getView().byId("clinicalOrders").setBusy(false); 
      
    },
    onChangeFilteredBySpecialityStatus: function (oEvent){
      let boolPressed = oEvent.getParameter("pressed");

      this.getModel("ZISH_HCFI_SRV").callFunction("/SetFilteredBySpeciality", {
        method: "POST",
        urlParameters: {
          FilteredBySpeciality: boolPressed,
        }
      });

      this.byId("MedDocuments").setBusy(false);
      this.byId("OtherDocuments").setBusy(false);
      this.byId("ResultsDocuments").setBusy(false);

      this.getDocuments(null,null,true);

    },
     sleep: function(milliseconds) {
      this.getView().byId("clinicalOrders").setBusy(true);
      const date = Date.now();
      let currentDate = null;
      do {
        currentDate = Date.now();
      } while (currentDate - date < milliseconds);
    },

    onLiveChangeMaxLength: function(oEvent){
      if(oEvent.getParameter("value").length > oEvent.getSource().getMaxLength())
      oEvent.getSource().setValue(oEvent.getParameter("value").substr(0, oEvent.getSource().getMaxLength()))
    },
    ExpandedDialogOpen: function(oEvent){
      var expandedModel = new JSONModel();
      this.getView().setModel(expandedModel,"expandedModel");
      var model = this.getView().getModel("expandedModel");
      var textArea = this.getView().byId(oEvent.oSource.oParent.mAggregations.items[0].sId);
      model.setProperty("/expandedText");
      var title = "";
      if(oEvent.oSource.sId.includes("AEBtnCon")){
       title= oEvent.oSource.oParent.oParent.oParent.oParent.getHeaderText()
      }else if(oEvent.oSource.sId.includes("AEBtnAlt")){
        title =oEvent.oSource.oParent.oParent.oParent.oParent.oParent.oParent.getHeaderText()
      }else{
        title = oEvent.oSource.oParent.oParent.getHeaderText()
      }
      var item = {
        title: title,
        ogModel: textArea.mBindingInfos.value.parts[0].model,
        ogPath: textArea.mBindingInfos.value.parts[0].path,
        content: textArea.mBindingInfos.value.binding.oValue
      }
      model.setProperty("/expandedText",item);
      if (!this.oExpandedDialog) {
				this.oExpandedDialog = new Dialog({
					title: this.getView().getModel("expandedModel").getProperty("/expandedText").title,
          contentWidth: "1024px",
					content: [
            new sap.m.TextArea({ value: this.getView().getModel("expandedModel").getProperty("/expandedText").content, rows:7,width:"100%",maxLength:textArea.mProperties.maxLength,showExceededText:true})
          ],
          type: "Message",
					beginButton: new Button({
						type: "Emphasized",
						text: "Grabar",
						press: function () {
              var route = model.getProperty("/expandedText").ogPath;
              route= route.split("/");
              route.pop();
              route.shift();
              this.getView().getModel(model.getProperty("/expandedText").ogModel).getProperty("/"+route[0]+"/"+route[1]).Value =this.oExpandedDialog.getContent()[0].getValue();
							this.oExpandedDialog.close();
              this.getView().getModel(model.getProperty("/expandedText").ogModel).refresh(); 
						}.bind(this)
					}),
          dialogAfterclose: function(oEvent) {//function called after Dialog is closed
            this._oDialog.destroy();//destroy only the content inside the Dialog
              model.destroy()
          },
					endButton: new Button({
						text: "Cancelar",
						press: function () {
							this.oExpandedDialog.close();
						}.bind(this)
					})
				});

				// to get access to the controller's model
				this.getView().addDependent(this.oExpandedDialog);
			}else{
        this.oExpandedDialog.setTitle(this.getView().getModel("expandedModel").getProperty("/expandedText").title);
        this.oExpandedDialog.destroyContent()
        this.oExpandedDialog.destroyBeginButton()
        this.oExpandedDialog.addContent( new sap.m.TextArea({value: this.getView().getModel("expandedModel").getProperty("/expandedText").content, rows:7,width:"100%",maxLength:textArea.mProperties.maxLength,showExceededText:true}));
        this.oExpandedDialog.setBeginButton( new Button({
						type: "Emphasized",
						text: "Grabar",
						press: function () {
              var route = model.getProperty("/expandedText").ogPath;
              route= route.split("/");
              route.pop();
              route.shift();
              this.getView().getModel(model.getProperty("/expandedText").ogModel).getProperty("/"+route[0]+"/"+route[1]).Value =this.oExpandedDialog.getContent()[0].getValue();
							this.oExpandedDialog.close();
              this.getView().getModel(model.getProperty("/expandedText").ogModel).refresh(); 
						}.bind(this)
					}))
      }

			this.oExpandedDialog.open();
    },
    importAll: function(oEvent){
      var model = oEvent.oSource.oParent.oParent.mBindingInfos.items.model
      var antecedents = this.getModel("MedicalDataOverview").getProperty("/results");
      var object = {};
      this.getModel(model).setProperty("/Allergies", []);
      this.getModel(model).setProperty("/MedicalAntecedents", []);
      this.getModel(model).setProperty("/SurgicalAntecedents", []);
      this.getModel(model).setProperty("/FamilyAntecedents", []);
      this.getModel(model).setProperty("/RiskFactors", []);
      this.getModel(model).setProperty("/SocialHabits", []);
      antecedents.forEach( a =>{
       var key =JSON.parse(a.Object).key;
        switch(a.MedType){
          case "Alergia":
            object = this.getModel("PatientAllergy").getData().results.find(x => x.AllergySeqno === key)
            var al = this.getModel(model).getProperty("/Allergies");
            if(a.Description == "No refiere"){
              al.push({
                PAT_FALLDS: a.Description,
                PAT_FALLGR: "",
                PAT_FALLID: key,
                PAT_FALLRA: "",
                PAT_FALLSE: "",
                PAT_FALLTY: "",
                PAT_FALLCE: "",
                PAT_FALLVA: "",
                PAT_FALLOB: ""
              })
              this.getView().getModel(model).getData().content.PAT_FALLST.Value = "Ninguna alergia";
            } else {
              al.push({
                PAT_FALLDS: object.Descr,
                PAT_FALLGR: object.parent.Bcpname,
                PAT_FALLID: object.AllergySeqno,
                PAT_FALLRA: "",
                PAT_FALLSE: "",
                PAT_FALLTY: object.Typ,
                PAT_FALLCE: object.Cer,
                PAT_FALLVA: object.Evaluation,
                PAT_FALLOB: object.Adcomment
              });
              this.getView().getModel(model).getData().content.PAT_FALLST.Value = "Existen alergias";
            }
            this.getModel(model).setProperty("/Allergies", al);
            break;
            case "Antecedente médico":
          object = this.getModel("PatientMedicalHistory").getData().results.find(x => x.MedHistid === key);
          var mh = this.getModel(model).getProperty("/MedicalAntecedents");

          mh.push({
            PAT_FDISNA: object.ZPMH.NameChild,
            PAT_FDISDA: object.DateMedHist,
            PAT_FDISTR: object.Treatment,
            PAT_FDISRM: object.RemarksInt,
            PAT_FDISID: object.MedHistid,
            PAT_FDISCM: object.Remarks
          });

          this.getModel(model).setProperty("/MedicalAntecedents", mh);
          break;
          case "Antecedente quirúrgico":
          object = this.getModel("PatientSurgeryHistory").getData().results.find(x => x.SurgHistid === key);
          var sh = this.getModel(model).getProperty("/SurgicalAntecedents");

          sh.push({
            PAT_FSURDT: object.DateSurg,
            PAT_FSURNA: object.ZPSH.NameChild,
            PAT_FSURRM: object.RemarksInt,
            PAT_FSURAN: "",
            PAT_FSURID: object.SurgHistid,
            PAT_FSURCM: object.Remarks
          });

          this.getModel(model).setProperty("/SurgicalAntecedents", sh);
          break;
          case "Antecedente familiar":
          object = this.getModel("PatientFamilyHistory").getData().results.find(x => x.FamilyHistid === key);
          var fh = this.getModel(model).getProperty("/FamilyAntecedents");

          fh.push({
            PAT_FFHNAM: object.ZMFH.NameChild,
            PAT_FFHRMK: object.FamComment,
            PAT_FRSIB: "",
            PAT_FFHID: object.FamilyHistid,
            PAT_FRBRO: object.Brother,
            PAT_FRFAT: object.Father,
            PAT_FRGRA: "",
            PAT_FRMAGP: object.MaternalGrandparents,
            PAT_FRMOM: object.Mother,
            PAT_FRPAGP: object.PaternalGrandparents,
            PAT_FRSIS: object.Sister,
            PAT_FRSON: object.Son,
            PAT_FFHROB: object.RemarksInt
          });
          this.getModel(model).setProperty("/FamilyAntecedents", fh);
          break;
          case "Factor de riesgo":
            object = this.getModel("PatientRiskFactor").getData().results.find(x => x.Rsfnr === key);
            var rf = this.getModel(model).getProperty("/RiskFactors");
  
            rf.push({
              PAT_FRFDSC: object.Rsfna,
              PAT_FRFCOD: object.Rsfnr,
              PAT_FRFCOM: "",
              PAT_FRFID: "000",
            });
  
            this.getModel(model).setProperty("/RiskFactors", rf);
            break;
            case "Hábito":
              if (model == "CAD_GINE") break;
              var sh = this.getModel(model).getProperty("/SocialHabits") || [];
    
              sh.push({
                P_HABIT_ID: key,
                P_HABIT_D: a.Description,
              });
    
              this.getModel(model).setProperty("/SocialHabits", sh);
              break;
            default:
              break;
        }
      })
      this.getModel(model).setProperty("/DroppedHistoryModel", []);
      this.fillDocumentHistoryModel(model);
    }
    
		

  });

});
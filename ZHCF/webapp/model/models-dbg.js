sap.ui.define([
  "sap/ui/model/json/JSONModel",
  "sap/ui/Device"
], function (JSONModel, Device) {
  "use strict";

  /**
   * @class com.resulto.hcfi.model.models
   */
  return {

    /**
     * Create a model with the device information.
     * @returns {sap.ui.model.json.JSONModel} The model with the device information
     * @memberOf com.resulto.hcfi.model.models
     */
    createDeviceModel: function () {
      const oModel = new JSONModel(Device);
      oModel.setDefaultBindingMode("OneWay");
      return oModel;
    },

    /**
     * Create an empty model.
     * @returns {sap.ui.model.json.JSONModel} The emtpy model
     * @memberOf com.resulto.hcfi.model.models
     */
    createEmptyModel: function () {
      return new JSONModel({});
    },

    /**
     * Create a model with results.
     * @returns {sap.ui.model.json.JSONModel} The model with the results
     * @memberOf com.resulto.hcfi.model.models
     */
    createResultsModel: function () {
      return new JSONModel({ results: [], loading: true });
    },
   
     /**
     * Create a model with the information about AllowedPMD.
     * @returns {sap.ui.model.json.JSONModel} The model with the results
     * @memberOf com.resulto.hcfi.model.models
     */
     createAllowedPMDModel: function () {
      return new JSONModel(
        {results:[
          { 
            Case: "",
            Dkbez: "",
            Dtid: "CAD_AE",
            Dtkt: "",
            Dtvers:"",
            Einri: "",
            Exclusive: "X",
          },
          { 
            Case: "",
            Dkbez: "",
            Dtid: "CAD_CTREMB",
            Dtkt: "",
            Dtvers:"",
            Einri: "",
            Exclusive: "X",
          },
          { 
            Case: "",
            Dkbez: "",
            Dtid: "CAD_GINE",
            Dtkt: "",
            Dtvers:"",
            Einri: "",
            Exclusive: "",
          },
          { 
            Case: "",
            Dkbez: "",
            Dtid: "CAD_MAM",
            Dtkt: "",
            Dtvers:"",
            Einri: "",
            Exclusive: "X",
          },
          { 
          Case: "",
          Dkbez: "",
          Dtid: "CAD_OPD",
          Dtkt: "",
          Dtvers:"",
          Einri: "",
          Exclusive: "X",
          }],
        });
    },


    /**
     * Create a model with the main information.
     * @returns {sap.ui.model.json.JSONModel} The model with the main information
     * @memberOf com.resulto.hcfi.model.models
     */
    createMainModel: function () {
      return new JSONModel({
        CaseData: {},
        InsuranceData: {},
        MovementData: {},
        PatientData: {},
        ProcessData: {},
      });
    },

    /**
     * Create a model with the header links information.
     * @returns {sap.ui.model.json.JSONModel} The model with the header links information
     * @memberOf com.resulto.hcfi.model.models
     */
    createLinksModel: function () {
      return new JSONModel({ REMPe: "", Lab: "", Rad: "", });
    },

    /**
     * Create a model with the antecedents information.
     * @returns {sap.ui.model.json.JSONModel} The model with the antecedents information
     * @memberOf com.resulto.hcfi.model.models
     */
    createAntecedentsModel: function () {
      return new JSONModel({ ZMFH: [], ZPMH: [], ZPSH: [], ZSHA: [] });
    },

    /**
     * Create a model with the allergy information.
     * @returns {sap.ui.model.json.JSONModel} The model with the allergy information
     * @memberOf com.resulto.hcfi.model.models
     */
    createNewAllergyModel: function () {
      return new JSONModel({ Allergy: {}, Adcomment: "", Evaluation: "", Typ: "", Cer: "", Reactions: [] });
    },

    /**
     * Create a model with the family history information.
     * @returns {sap.ui.model.json.JSONModel} The model with the family history information
     * @memberOf com.resulto.hcfi.model.models
     */
    createNewFamilyHistoryModel: function () {
      return new JSONModel({
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
    },

    /**
     * Create a model with the medical history information.
     * @returns {sap.ui.model.json.JSONModel} The model with the medical history information
     * @memberOf com.resulto.hcfi.model.models
     */
    createNewMedicalHistoryModel: function () {
      return new JSONModel({ Antecedent: {}, Date: null, Medication: "", Comments: "", Observations: "" });
    },

    /**
     * Create a model with the surgery history information.
     * @returns {sap.ui.model.json.JSONModel} The model with the surgery history information
     * @memberOf com.resulto.hcfi.model.models
     */
    createNewSurgeryHistoryModel: function () {
      return new JSONModel({ Antecedent: {}, Date: null, Comments: "", Observations: "" });
    },

    /**
     * Create a model with the social habit information.
     * @returns {sap.ui.model.json.JSONModel} The model with the social habit information
     * @memberOf com.resulto.hcfi.model.models
     */
    createNewHabitModel: function () {
      return new JSONModel({
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
    },

    /**
     * Create a model with the vital sign information.
     * @returns {sap.ui.model.json.JSONModel} The model with the vital sign information
     * @memberOf com.resulto.hcfi.model.models
     */
    createVitalSignsModel: function () {
      return new JSONModel({ catalogs: { results: [] }, table: { results: [] }, values: { results: [] }, CAD_AETable: { results: [] } });
    },

    /**
     * Create a model with the OPD information.
     * @param {string} Dtid Document id
     * @param {string} Einri Institution
     * @param {string} Falnr Case
     * @param {string} Patnr Patient
     * @returns {sap.ui.model.json.JSONModel} The model with the OPD information
     * @memberOf com.resulto.hcfi.model.models
     */
    createOPDModel: function (Dtid = "", Einri = "", Falnr = "", Patnr = "") {
      return new JSONModel({
        Dodat: new Date(),
        Dokar: "CAD",
        Doknr: "9999999999999999999999999",
        Dokst: "",
        Doktl: "000",
        Dokvr: "00",
        Dotim: { ms: 0, __edmType: "Edm.Time" },
        Dtid,
        Dtvers: "001",
        Einri,
        Falnr,
        Mitarb: "",
        Orgdo: "",
        Patnr,
        content: {
          CLI_FPEFUR: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "CLI_FPEFUR", Line: 0, Value: "" },
          LAB_URL: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "LAB_URL", Line: 0, Value: "" },
          MOV_CSTRAS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_CSTRAS", Line: 0, Value: "" },
          MOV_FDATDI: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FDATDI", Line: 0, Value: "" },
          MOV_FDISFL: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FDISFL", Line: 0, Value: "" },
          MOV_FDITYP: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FDITYP", Line: 0, Value: "" },
          MOV_FDTYPD: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FDTYPD", Line: 0, Value: "" },
          MOV_FDTYPE: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FDTYPE", Line: 0, Value: "" },
          MOV_FEVO: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FEVO", Line: 0, Value: "" },
          MOV_EEVO: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_EEVO", Line: 0, Value: "" },
          MOV_FMOT1: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FMOT1", Line: 0, Value: "" },
          MOV_FMOTFL: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FMOTFL", Line: 0, Value: "" },
          MOV_FMOTFT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FMOTFT", Line: 0, Value: "" },
          MOV_FREADI: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FREADI", Line: 0, Value: "" },
          MOV_FSTYDA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FSTYDA", Line: 0, Value: "" },
          MOV_FTIMDI: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FTIMDI", Line: 0, Value: "" },
          MOV_FTRADC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FTRADC", Line: 0, Value: "" },
          MOV_FTRADI: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FTRADI", Line: 0, Value: "" },
          MOV_HORSRV: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_HORSRV", Line: 0, Value: "" },
          MOV_INGSRV: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_INGSRV", Line: 0, Value: "" },
          MOV_SRVMED: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_SRVMED", Line: 0, Value: "" },
          ORD_FASST: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "ORD_FASST", Line: 0, Value: "" },
          PAT_FADM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FADM", Line: 0, Value: "" },
          PAT_FAGE: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FAGE", Line: 0, Value: "" },
          PAT_FALLR: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FALLR", Line: 0, Value: "" },
          PAT_FALLST: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FALLST", Line: 0, Value: "" },
          PAT_FATPHY: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FATPHY", Line: 0, Value: "" },
          PAT_FCASE: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FCASE", Line: 0, Value: "" },
          PAT_FDOB: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FDOB", Line: 0, Value: "" },
          PAT_FFAMNK: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FFAMNK", Line: 0, Value: "" },
          PAT_FGND: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FGND", Line: 0, Value: "" },
          PAT_FMHINK: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FMHINK", Line: 0, Value: "" },
          PAT_FMRN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FMRN", Line: 0, Value: "" },
          PAT_FNAME: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FNAME", Line: 0, Value: "" },
          PAT_FPILL: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FPILL", Line: 0, Value: "" },
          PAT_FPREC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FPREC", Line: 0, Value: "" },
          PAT_FPROT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FPROT", Line: 0, Value: "" },
          PAT_FROOM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FROOM", Line: 0, Value: "" },
          PAT_FRSFK: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FRSFK", Line: 0, Value: "" },
          PAT_FSUNK: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FSUNK", Line: 0, Value: "" },
          PAT_FWARD: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FWARD", Line: 0, Value: "" },
          PAT_GCLIN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_GCLIN", Line: 0, Value: "" },
          PAT_GOTHI: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_GOTHI", Line: 0, Value: "" },
          PMD_ALTMED: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PMD_ALTMED", Line: 0, Value: "" },
          PMD_FFTNT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PMD_FFTNT", Line: 0, Value: "" },
          PMD_FFUPT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PMD_FFUPT", Line: 0, Value: "" },
          PMD_FGENT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PMD_FGENT", Line: 0, Value: "" },
          PMD_VALALT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PMD_VALALT", Line: 0, Value: "" },
          X00_GOTHTR: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X00_GOTHTR", Line: 0, Value: "" },
          X02_GOTHTR: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X02_GOTHTR", Line: 0, Value: "" },
          X03_GOTHTR: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X03_GOTHTR", Line: 0, Value: "" },
        }
      });
    },

    /**
     * Create a model with the AE information.
     * @param {string} Dtid Document id
     * @param {string} Einri Institution
     * @param {string} Falnr Case
     * @param {string} Patnr Patient
     * @returns {sap.ui.model.json.JSONModel} The model with the AE information
     * @memberOf com.resulto.hcfi.model.models
     */
    createAEModel: function (Dtid = "", Einri = "", Falnr = "", Patnr = "") {
      return new JSONModel({
        Dodat: new Date(),
        Dokar: "CAD",
        Doknr: "9999999999999999999999999",
        Dokst: "",
        Doktl: "000",
        Dokvr: "00",
        Dotim: { ms: 0, __edmType: "Edm.Time" },
        Dtid,
        Dtvers: "001",
        Einri,
        Falnr,
        Mitarb: "",
        Orgdo: "",
        Patnr,
        content: {
          CLI_FPEFUR: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "CLI_FPEFUR", Line: 0, Value: "" },
          LAB_URL: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "LAB_URL", Line: 0, Value: "" },
          MOV_CSTRAS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_CSTRAS", Line: 0, Value: "" },
          MOV_FDATDI: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FDATDI", Line: 0, Value: "" },
          MOV_FDISFL: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FDISFL", Line: 0, Value: "" },
          MOV_FDITYP: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FDITYP", Line: 0, Value: "" },
          MOV_FDTYPD: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FDTYPD", Line: 0, Value: "" },
          MOV_FDTYPE: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FDTYPE", Line: 0, Value: "" },
          MOV_EEVO: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_EEVO", Line: 0, Value: "" },
          MOV_EOBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_EOBS", Line: 0, Value: "" },
          MOV_FEVO: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FEVO", Line: 0, Value: "" },
          MOV_FFCCSE: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FFCCSE", Line: 0, Value: "" },
          MOV_FFEING: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FFEING", Line: 0, Value: "" },
          MOV_FHRING: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FHRING", Line: 0, Value: "" },
          MOV_FMOT1: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FMOT1", Line: 0, Value: "" },
          MOV_FMOTFT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FMOTFT", Line: 0, Value: "" },
          MOV_FMOTXT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FMOTXT", Line: 0, Value: "" },
          MOV_FREADI: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FREADI", Line: 0, Value: "" },
          MOV_FSTYDA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FSTYDA", Line: 0, Value: "" },
          MOV_FTICOT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FTICOT", Line: 0, Value: "" },
          MOV_FTIMDI: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FTIMDI", Line: 0, Value: "" },
          MOV_FTRADC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FTRADC", Line: 0, Value: "" },
          MOV_FTRADI: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FTRADI", Line: 0, Value: "" },
          ORD_FASST: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "ORD_FASST", Line: 0, Value: "" },
          PAT_FADM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FADM", Line: 0, Value: "" },
          PAT_FAGE: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FAGE", Line: 0, Value: "" },
          PAT_FALLR: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FALLR", Line: 0, Value: "" },
          PAT_FALLST: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FALLST", Line: 0, Value: "" },
          PAT_FATPHY: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FATPHY", Line: 0, Value: "" },
          PAT_FCASE: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FCASE", Line: 0, Value: "" },
          PAT_FDOB: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FDOB", Line: 0, Value: "" },
          PAT_FFAMNK: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FFAMNK", Line: 0, Value: "" },
          PAT_FGND: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FGND", Line: 0, Value: "" },
          PAT_FMHINK: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FMHINK", Line: 0, Value: "" },
          PAT_FMRN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FMRN", Line: 0, Value: "" },
          PAT_FNAME: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FNAME", Line: 0, Value: "" },
          PAT_FPILL: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FPILL", Line: 0, Value: "" },
          PAT_FPREC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FPREC", Line: 0, Value: "" },
          PAT_FPROT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FPROT", Line: 0, Value: "" },
          PAT_FROOM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FROOM", Line: 0, Value: "" },
          PAT_FRSFK: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FRSFK", Line: 0, Value: "" },
          PAT_FSUNK: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FSUNK", Line: 0, Value: "" },
          PAT_FWARD: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FWARD", Line: 0, Value: "" },
          PAT_GCLIN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_GCLIN", Line: 0, Value: "" },
          PAT_GOTHI: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_GOTHI", Line: 0, Value: "" },
          PMD_ALTMED: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PMD_ALTMED", Line: 0, Value: "" },
          PMD_FFTNT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PMD_FFTNT", Line: 0, Value: "" },
          PMD_FFUPT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PMD_FFUPT", Line: 0, Value: "" },
          PMD_FGENT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PMD_FGENT", Line: 0, Value: "" },
          PMD_GOTHTR: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PMD_GOTHTR", Line: 0, Value: "" },
          PMD_VALALT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PMD_VALALT", Line: 0, Value: "" },
          ORD_OPC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "ORD_OPC", Line: 0, Value: "" },
          ORD_FASST: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "ORD_FASST", Line: 0, Value: "" },
          X00_FMOTXT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X00_FMOTXT", Line: 0, Value: "" },
          X00_FTICOT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X00_FTICOT", Line: 0, Value: "" },
          X00_GOTHTR: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X00_GOTHTR", Line: 0, Value: "" },
          X01_GOTHTR: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X01_GOTHTR", Line: 0, Value: "" },
        }
      });
    },

    /**
     * Create a model with the GINE information.
     * @param {string} Dtid Document id
     * @param {string} Einri Institution
     * @param {string} Falnr Case
     * @param {string} Patnr Patient
     * @returns {sap.ui.model.json.JSONModel} The model with the GINE information
     * @memberOf com.resulto.hcfi.model.models
     */
    createGINEModel: function (Dtid = "", Einri = "", Falnr = "", Patnr = "") {
      return new JSONModel({
        Dodat: new Date(),
        Dokar: "CAD",
        Doknr: "9999999999999999999999999",
        Dokst: "",
        Doktl: "000",
        Dokvr: "00",
        Dotim: { ms: 0, __edmType: "Edm.Time" },
        Dtid,
        Dtvers: "001",
        Einri,
        Falnr,
        Mitarb: "",
        Orgdo: "",
        Patnr,
        content: {
          AXILA_DER: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "AXILA_DER", Line: 0, Value: "" },
          AXILA_IZQ: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "AXILA_IZQ", Line: 0, Value: "" },
          CERVI2_GIN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "CERVI2_GIN", Line: 0, Value: "" },
          CERVIX_GIN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "CERVIX_GIN", Line: 0, Value: "" },
          DERIV_GIN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "DERIV_GIN", Line: 0, Value: "" },
          DIAG_GIN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "DIAG_GIN", Line: 0, Value: "" },
          DIAG_GIN_X: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "DIAG_GIN_X", Line: 0, Value: "" },
          ECOX_GIN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "ECOX_GIN", Line: 0, Value: "" },
          ECOX_MAM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "ECOX_MAM", Line: 0, Value: "" },
          ECO_DAT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "ECO_DAT", Line: 0, Value: "" },
          ECO_MAM_TX: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "ECO_MAM_TX", Line: 0, Value: "" },
          ENDOM_GIN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "ENDOM_GIN", Line: 0, Value: "" },
          ESPECULX: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "ESPECULX", Line: 0, Value: "" },
          EXPLO_MAMX: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "EXPLO_MAMX", Line: 0, Value: "" },
          FLUJO2_GIN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "FLUJO2_GIN", Line: 0, Value: "" },
          FLUJO_GIN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "FLUJO_GIN", Line: 0, Value: "" },
          FUR_GIN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "FUR_GIN", Line: 0, Value: "" },
          GEN_EXTX: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "GEN_EXTX", Line: 0, Value: "" },
          GEN_EXT_D: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "GEN_EXT_D", Line: 0, Value: "" },
          GEN_EXT_D2: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "GEN_EXT_D2", Line: 0, Value: "" },
          IND_GINE: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "IND_GINE", Line: 0, Value: "" },
          IND_GIN_X: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "IND_GIN_X", Line: 0, Value: "" },
          MAMA_DER: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MAMA_DER", Line: 0, Value: "" },
          MAMA_IZQ: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MAMA_IZQ", Line: 0, Value: "" },
          MEN_GIN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MEN_GIN", Line: 0, Value: "" },
          MOTIV3_GIN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOTIV3_GIN", Line: 0, Value: "" },
          MOTIV2_GIN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOTIV2_GIN", Line: 0, Value: "" },
          MOTIVO_GIN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOTIVO_GIN", Line: 0, Value: "" },
          OBS_GIN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "OBS_GIN", Line: 0, Value: "" },
          OTHR_PRU_X: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "OTHR_PRU_X", Line: 0, Value: "" },
          OVARIO_DER: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "OVARIO_DER", Line: 0, Value: "" },
          OVARIO_IZQ: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "OVARIO_IZQ", Line: 0, Value: "" },
          ECO_GIN_OB: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "ECO_GIN_OB", Line: 0, Value: "" },
          PAT_FADM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FADM", Line: 0, Value: "" },
          PAT_FAGE: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FAGE", Line: 0, Value: "" },
          PAT_FALLR: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FALLR", Line: 0, Value: "" },
          PAT_FALLST: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FALLST", Line: 0, Value: "" },
          PAT_FATPHY: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FATPHY", Line: 0, Value: "" },
          PAT_FCASE: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FCASE", Line: 0, Value: "" },
          PAT_FDOB: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FDOB", Line: 0, Value: "" },
          PAT_FGND: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FGND", Line: 0, Value: "" },
          PAT_FMRN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FMRN", Line: 0, Value: "" },
          PAT_FNAME: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FNAME", Line: 0, Value: "" },
          PAT_FPREC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FPREC", Line: 0, Value: "" },
          PAT_FROOM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FROOM", Line: 0, Value: "" },
          PAT_FRSFK: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FRSFK", Line: 0, Value: "" },
          PAT_FWARD: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FWARD", Line: 0, Value: "" },
          PAUTA_GIN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAUTA_GIN", Line: 0, Value: "" },
          PRU_FECHA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PRU_FECHA", Line: 0, Value: "" },
          PRU_OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PRU_OBS", Line: 0, Value: "" },
          PRU_RES: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PRU_RES", Line: 0, Value: "" },
          PRU_RES_CD: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PRU_RES_CD", Line: 0, Value: "" },
          PRU_RES_CL: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PRU_RES_CL", Line: 0, Value: "" },
          PRU_SEG: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PRU_SEG", Line: 0, Value: "" },
          PRU_SOLIC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PRU_SOLIC", Line: 0, Value: "" },
          SEND_INF_W: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "SEND_INF_W", Line: 0, Value: "" },
          STATUS_INT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "STATUS_INT", Line: 0, Value: "" },
          TAC2_BIMAN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "TAC2_BIMAN", Line: 0, Value: "" },
          TACT_BIMAN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "TACT_BIMAN", Line: 0, Value: "" },
          UTERO_GIN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "UTERO_GIN", Line: 0, Value: "" },
          X00_FECHA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X00_FECHA", Line: 0, Value: "" },
          X00_OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X00_OBS", Line: 0, Value: "" },
          X00_RES: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X00_RES", Line: 0, Value: "" },
          X00_SEG: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X00_SEG", Line: 0, Value: "" },
          X00_SOLIC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X00_SOLIC", Line: 0, Value: "" },
          X01_FECHA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X01_FECHA", Line: 0, Value: "" },
          X01_OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X01_OBS", Line: 0, Value: "" },
          X01_RES: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X01_RES", Line: 0, Value: "" },
          X01_SOLIC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X01_SOLIC", Line: 0, Value: "" },
          X02_FECHA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X02_FECHA", Line: 0, Value: "" },
          X02_OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X02_OBS", Line: 0, Value: "" },
          X02_RES: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X02_RES", Line: 0, Value: "" },
          X02_SOLIC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X02_SOLIC", Line: 0, Value: "" },
          X03_FECHA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X03_FECHA", Line: 0, Value: "" },
          X03_OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X03_OBS", Line: 0, Value: "" },
          X03_RES: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X03_RES", Line: 0, Value: "" },
          X03_SOLIC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X03_SOLIC", Line: 0, Value: "" },
          X04_FECHA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X04_FECHA", Line: 0, Value: "" },
          X04_OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X04_OBS", Line: 0, Value: "" },
          X04_SOLIC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X04_SOLIC", Line: 0, Value: "" },
          X05_FECHA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X05_FECHA", Line: 0, Value: "" },
          X05_OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X05_OBS", Line: 0, Value: "" },
          X05_RES: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X05_RES", Line: 0, Value: "" },
          X05_SOLIC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X05_SOLIC", Line: 0, Value: "" },
          X06_FECHA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X06_FECHA", Line: 0, Value: "" },
          X06_OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X06_OBS", Line: 0, Value: "" },
          X06_RES: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X06_RES", Line: 0, Value: "" },
          X06_SOLIC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X06_SOLIC", Line: 0, Value: "" },
          X07_FECHA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X07_FECHA", Line: 0, Value: "" },
          X07_OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X07_OBS", Line: 0, Value: "" },
          X07_RES: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X07_RES", Line: 0, Value: "" },
          X07_SOLIC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X07_SOLIC", Line: 0, Value: "" },
          X08_FECHA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X08_FECHA", Line: 0, Value: "" },
          X08_OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X08_OBS", Line: 0, Value: "" },
          X08_RES: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X08_RES", Line: 0, Value: "" },
          X08_SOLIC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X08_SOLIC", Line: 0, Value: "" },
          X09_FECHA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X09_FECHA", Line: 0, Value: "" },
          X09_OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X09_OBS", Line: 0, Value: "" },
          X09_RES: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X09_RES", Line: 0, Value: "" },
          X09_SOLIC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X09_SOLIC", Line: 0, Value: "" },
          X0A_FECHA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X0A_FECHA", Line: 0, Value: "" },
          X0A_OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X0A_OBS", Line: 0, Value: "" },
          X0A_RES: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X0A_RES", Line: 0, Value: "" },
          X0A_SOLIC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X0A_SOLIC", Line: 0, Value: "" },
          X0B_FECHA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X0B_FECHA", Line: 0, Value: "" },
          X0B_OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X0B_OBS", Line: 0, Value: "" },
          X0B_RES: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X0B_RES", Line: 0, Value: "" },
          X0B_SOLIC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X0B_SOLIC", Line: 0, Value: "" },
          X0C_FECHA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X0C_FECHA", Line: 0, Value: "" },
          X0C_OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X0C_OBS", Line: 0, Value: "" },
          X0C_RES: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X0C_RES", Line: 0, Value: "" },
          X0C_SOLIC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X0C_SOLIC", Line: 0, Value: "" },
          X0D_FECHA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X0D_FECHA", Line: 0, Value: "" },
          X0D_OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X0D_OBS", Line: 0, Value: "" },
          X0D_RES: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X0D_RES", Line: 0, Value: "" },
          X0D_SOLIC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X0D_SOLIC", Line: 0, Value: "" },
        }
      });

    },

    /**
     * Create a model with the CAD_MAM information.
     * @param {string} Dtid Document id
     * @param {string} Einri Institution
     * @param {string} Falnr Case
     * @param {string} Patnr Patient
     * @returns {sap.ui.model.json.JSONModel} The model with the CAD_MAM information
     * @memberOf com.resulto.hcfi.model.models
     */
    createCADMAMModel: function (Dtid = "", Einri = "", Falnr = "", Patnr = "") {
      return new JSONModel({
        Dodat: new Date(),
        Dokar: "CAD",
        Doknr: "9999999999999999999999999",
        Dokst: "",
        Doktl: "000",
        Dokvr: "00",
        Dotim: { ms: 0, __edmType: "Edm.Time" },
        Dtid,
        Dtvers: "001",
        Einri,
        Falnr,
        Mitarb: "",
        Orgdo: "",
        Patnr,
        content: {
          DIAG_MAM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "DIAG_MAM", Line: 0, Value: "" }, 
          DIAG_MAM_T: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "DIAG_MAM_T", Line: 0, Value: "" }, 
          ECOX_MAM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "ECOX_MAM", Line: 0, Value: "" }, 
          ECO_MAM_T2: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "ECO_MAM_T2", Line: 0, Value: "" }, 
          EXPLO_MAMX: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "EXPLO_MAMX", Line: 0, Value: "" }, 
          FUR_MAM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "FUR_MAM", Line: 0, Value: "" }, 
          MAMA_DER2: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MAMA_DER2", Line: 0, Value: "" }, 
          MAMA_IZQ2: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MAMA_IZQ2", Line: 0, Value: "" }, 
          MEN_GIN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MEN_GIN", Line: 0, Value: "" }, 
          MOTIV2_MAM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOTIV2_MAM", Line: 0, Value: "" }, 
          MOTIVO_MAM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOTIVO_MAM", Line: 0, Value: "" }, 
          OBS_MAM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "OBS_MAM", Line: 0, Value: "" }, 
          OTHR_PRU_X: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "OTHR_PRU_X", Line: 0, Value: "" }, 
          PAT_FADM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FADM", Line: 0, Value: "" }, 
          PAT_FAGE: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FAGE", Line: 0, Value: "" }, 
          PAT_FALLR: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FALLR", Line: 0, Value: "" }, 
          PAT_FATPHY: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FATPHY", Line: 0, Value: "" }, 
          PAT_FCASE: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FCASE", Line: 0, Value: "" }, 
          PAT_FDOB: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FDOB", Line: 0, Value: "" }, 
          PAT_FGND: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FGND", Line: 0, Value: "" }, 
          PAT_FMRN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FMRN", Line: 0, Value: "" }, 
          PAT_FNAME: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FNAME", Line: 0, Value: "" }, 
          PAT_FPREC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FPREC", Line: 0, Value: "" }, 
          PAT_FROOM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FROOM", Line: 0, Value: "" }, 
          PAT_FRSFK: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FRSFK", Line: 0, Value: "" }, 
          PAT_FWARD: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FWARD", Line: 0, Value: "" }, 
          PLAN_MAM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PLAN_MAM", Line: 0, Value: "" }, 
          PLAN_MAM_T: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PLAN_MAM_T", Line: 0, Value: "" }, 
          PRU_FECHA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PRU_FECHA", Line: 0, Value: "" }, 
          PRU_OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PRU_OBS", Line: 0, Value: "" }, 
          PRU_RES: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PRU_RES", Line: 0, Value: "" }, 
          PRU_RES_CD: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PRU_RES_CD", Line: 0, Value: "" }, 
          PRU_RES_CL: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PRU_RES_CL", Line: 0, Value: "" }, 
          PRU_SEG: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PRU_SEG", Line: 0, Value: "" }, 
          PRU_SOLIC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PRU_SOLIC", Line: 0, Value: "" }, 
          SEND_INF_W: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "SEND_INF_W", Line: 0, Value: "" }, 
          STATUS_INT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "STATUS_INT", Line: 0, Value: "" }, 
          X00LA_DER: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X00LA_DER", Line: 0, Value: "" }, 
          X00LA_IZQ: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X00LA_IZQ", Line: 0, Value: "" }, 
          X00R_PRU_X: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X00R_PRU_X", Line: 0, Value: "" }, 
          X00_FECHA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X00_FECHA", Line: 0, Value: "" }, 
          X00_OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X00_OBS", Line: 0, Value: "" }, 
          X00_RES: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X00_RES", Line: 0, Value: "" }, 
          X00_SOLIC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X00_SOLIC", Line: 0, Value: "" }, 
          X01_FECHA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X01_FECHA", Line: 0, Value: "" }, 
          X01_OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X01_OBS", Line: 0, Value: "" }, 
          X01_RES: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X01_RES", Line: 0, Value: "" }, 
          X01_SOLIC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X01_SOLIC", Line: 0, Value: "" }, 
          X02_FECHA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X02_FECHA", Line: 0, Value: "" }, 
          X02_OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X02_OBS", Line: 0, Value: "" }, 
          X02_RES: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X02_RES", Line: 0, Value: "" }, 
          X02_SOLIC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X02_SOLIC", Line: 0, Value: "" }, 
          X03_FECHA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X03_FECHA", Line: 0, Value: "" }, 
          X03_OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X03_OBS", Line: 0, Value: "" }, 
          X03_RES: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X03_RES", Line: 0, Value: "" }, 
          X03_SOLIC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X03_SOLIC", Line: 0, Value: "" }, 
          X04_FECHA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X04_FECHA", Line: 0, Value: "" }, 
          X04_OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X04_OBS", Line: 0, Value: "" }, 
          X04_RES: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X04_RES", Line: 0, Value: "" }, 
          X04_SOLIC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X04_SOLIC", Line: 0, Value: "" }, 
          X05_FECHA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X05_FECHA", Line: 0, Value: "" }, 
          X05_OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X05_OBS", Line: 0, Value: "" }, 
          X05_RES: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X05_RES", Line: 0, Value: "" }, 
          X05_SOLIC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X05_SOLIC", Line: 0, Value: "" }, 
          X06_FECHA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X06_FECHA", Line: 0, Value: "" }, 
          X06_OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X06_OBS", Line: 0, Value: "" }, 
          X06_RES: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X06_RES", Line: 0, Value: "" }, 
          X06_SOLIC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X06_SOLIC", Line: 0, Value: "" }, 
          X07_FECHA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X07_FECHA", Line: 0, Value: "" }, 
          X07_OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X07_OBS", Line: 0, Value: "" }, 
          X07_RES: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X07_RES", Line: 0, Value: "" }, 
          X07_SOLIC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X07_SOLIC", Line: 0, Value: "" }, 
          X08_FECHA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X08_FECHA", Line: 0, Value: "" }, 
          X08_OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X08_OBS", Line: 0, Value: "" }, 
          X08_RES: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X08_RES", Line: 0, Value: "" }, 
          X08_SOLIC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X08_SOLIC", Line: 0, Value: "" }, 
          X09_FECHA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X09_FECHA", Line: 0, Value: "" }, 
          X09_OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X09_OBS", Line: 0, Value: "" }, 
          X09_RES: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X09_RES", Line: 0, Value: "" }, 
          X09_SOLIC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X09_SOLIC", Line: 0, Value: "" }, 
          X0A_FECHA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X0A_FECHA", Line: 0, Value: "" }, 
          X0A_OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X0A_OBS", Line: 0, Value: "" }, 
          X0A_SOLIC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X0A_SOLIC", Line: 0, Value: "" }, 
          //Reports
          //DIA_INFOR2: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "DIA_INFOR2", Line: 0, Value: "" }, 
          //DIA_INFORM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "DIA_INFORM", Line: 0, Value: "" }, 
          //ENTR_INF: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "ENTR_INF", Line: 0, Value: "" }, 
          //GINE_INFOR: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "GINE_INFOR", Line: 0, Value: "" }, 
          //PROF_GINE: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PROF_GINE", Line: 0, Value: "" }, 
          //VIA_GINE: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "VIA_GINE", Line: 0, Value: "" }, 
          //VIA_GINE2: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "VIA_GINE2", Line: 0, Value: "" }, 
          //Signs
          //PMD_FERMLN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PMD_FERMLN", Line: 0, Value: "" }, 
          //PMD_FERNAM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PMD_FERNAM", Line: 0, Value: "" }, 
          //PMD_FERNUM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PMD_FERNUM", Line: 0, Value: "" }, 
        }
      });
      
    },
    
    /**
     * Create a model with the CTREMB information.
     * @param {string} Dtid Document id
     * @param {string} Einri Institution
     * @param {string} Falnr Case
     * @param {string} Patnr Patient
     * @returns {sap.ui.model.json.JSONModel} The model with the CTREMB information
     * @memberOf com.resulto.hcfi.model.models
     */
    createCTREMBModel: function (Dtid = "", Einri = "", Falnr = "", Patnr = "") {
      return new JSONModel({
        Dodat: new Date(),
        Dokar: "CAD",
        Doknr: "9999999999999999999999999",
        Dokst: "",
        Doktl: "000",
        Dokvr: "00",
        Dotim: { ms: 0, __edmType: "Edm.Time" },
        Dtid,
        Dtvers: "001",
        Einri,
        Falnr,
        Mitarb: "",
        Orgdo: "",
        Patnr,
        content: {
          AMCCOMMENT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "AMCCOMMENT", Line: 0, Value: "" },
          AMCRESULT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "AMCRESULT", Line: 0, Value: "" },
          ANTCOMMENT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "ANTCOMMENT", Line: 0, Value: "" },
          ANTRESULT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "ANTRESULT", Line: 0, Value: "" },
          CLPRCOMMEN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "CLPRCOMMEN", Line: 0, Value: "" },
          CLPRRESULT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "CLPRRESULT", Line: 0, Value: "" },
          CONSINF: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "CONSINF", Line: 0, Value: "" },
          CRVGCOMMEN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "CRVGCOMMEN", Line: 0, Value: "" },
          CRVGRESULT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "CRVGRESULT", Line: 0, Value: "" },
          ECOTRIM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "ECOTRIM", Line: 0, Value: "" },
          EMBOBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "EMBOBS", Line: 0, Value: "" },
          EMBRIONES: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "EMBRIONES", Line: 0, Value: "" },
          EMB_ABOCHK: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "EMB_ABOCHK", Line: 0, Value: "" },
          EMB_ABONUM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "EMB_ABONUM", Line: 0, Value: "" },
          EMB_CESCHK: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "EMB_CESCHK", Line: 0, Value: "" },
          EMB_CESNUM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "EMB_CESNUM", Line: 0, Value: "" },
          EMB_CHK: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "EMB_CHK", Line: 0, Value: "" },
          EMB_CTREPR: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "EMB_CTREPR", Line: 0, Value: "" },
          EMB_CTRFPP: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "EMB_CTRFPP", Line: 0, Value: "" },
          EMB_CTRFUR: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "EMB_CTRFUR", Line: 0, Value: "" },
          EMB_CTRGRS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "EMB_CTRGRS", Line: 0, Value: "" },
          EMB_CTRPPR: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "EMB_CTRPPR", Line: 0, Value: "" },
          EMB_FURCOR: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "EMB_FURCOR", Line: 0, Value: "" },
          EMB_NOTAS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "EMB_NOTAS", Line: 0, Value: "" },
          EMB_OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "EMB_OBS", Line: 0, Value: "" },
          EMB_NUM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "EMB_NUM", Line: 0, Value: "" },
          EMB_PARCHK: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "EMB_PARCHK", Line: 0, Value: "" },
          EMB_PARNUM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "EMB_PARNUM", Line: 0, Value: "" },
          ENVPCOMMEN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "ENVPCOMMEN", Line: 0, Value: "" },
          PRECL_COM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PRECL_COM", Line: 0, Value: "" },
          ENVPRESULT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "ENVPRESULT", Line: 0, Value: "" },
          PRECL_RES: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PRECL_RES", Line: 0, Value: "" },
          GETGEMCOMM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "GETGEMCOMM", Line: 0, Value: "" },
          GETGEMRES: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "GETGEMRES", Line: 0, Value: "" },
          HIVCOMMENT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "HIVCOMMENT", Line: 0, Value: "" },
          HIVRESULT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "HIVRESULT", Line: 0, Value: "" },
          LACTANCIA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "LACTANCIA", Line: 0, Value: "" },
          OSULCOMMEN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "OSULCOMMEN", Line: 0, Value: "" },
          OSULRESULT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "OSULRESULT", Line: 0, Value: "" },
          //PARTOCESAR: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PARTOCESAR", Line: 0, Value: "" },
          PARTOCOMP: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PARTOCOMP", Line: 0, Value: "" },
          PARTOCOMPC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PARTOCOMPC", Line: 0, Value: "" },
          PARTOEVORN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PARTOEVORN", Line: 0, Value: "" },
          //PARTOFECHA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PARTOFECHA", Line: 0, Value: "" },
          //PARTOFINCO: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PARTOFINCO", Line: 0, Value: "" },
          //PARTOFINTP: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PARTOFINTP", Line: 0, Value: "" },
          //PARTOHORA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PARTOHORA", Line: 0, Value: "" },
          //PARTOTIPO: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PARTOTIPO", Line: 0, Value: "" },
          PAT_FADM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FADM", Line: 0, Value: "" },
          PAT_FAGE: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FAGE", Line: 0, Value: "" },
          PAT_FALLR: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FALLR", Line: 0, Value: "" },
          PAT_FATPHY: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FATPHY", Line: 0, Value: "" },
          PAT_FCASE: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FCASE", Line: 0, Value: "" },
          PAT_FDOB: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FDOB", Line: 0, Value: "" },
          PAT_FGND: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FGND", Line: 0, Value: "" },
          PAT_FMRN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FMRN", Line: 0, Value: "" },
          PAT_FNAME: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FNAME", Line: 0, Value: "" },
          PAT_FPREC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FPREC", Line: 0, Value: "" },
          PAT_FROOM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FROOM", Line: 0, Value: "" },
          PAT_FRSFK: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FRSFK", Line: 0, Value: "" },
          PAT_FWARD: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PAT_FWARD", Line: 0, Value: "" },
          PREOP: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PREOP", Line: 0, Value: "" },
          RUBCOMMENT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "RUBCOMMENT", Line: 0, Value: "" },
          RUBRESULT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "RUBRESULT", Line: 0, Value: "" },
          SIFCOMMENT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "SIFCOMMENT", Line: 0, Value: "" },
          SIFRESULT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "SIFRESULT", Line: 0, Value: "" },
          SOBCCOMMEN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "SOBCCOMMEN", Line: 0, Value: "" },
          SOBCRESULT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "SOBCRESULT", Line: 0, Value: "" },
          TPARRESULT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "TPARRESULT", Line: 0, Value: "" },
          TPNICOMMEN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "TPNICOMMEN", Line: 0, Value: "" },
          TPNIRESULT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "TPNIRESULT", Line: 0, Value: "" },
          TSRCCOMMEN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "TSRCCOMMEN", Line: 0, Value: "" },
          TSRCRESULT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "TSRCRESULT", Line: 0, Value: "" },
          //TXPLCOMMENT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "TXPLCOMMEN", Line: 0, Value: "" },
          TXPLRESULT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "TXPLRESULT", Line: 0, Value: "" },
          VAADCOMMEN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "VAADCOMMEN", Line: 0, Value: "" },
          VAADRESULT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "VAADRESULT", Line: 0, Value: "" },
          VATOCOMMEN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "VATOCOMMEN", Line: 0, Value: "" },
          VATORESULT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "VATORESULT", Line: 0, Value: "" },
          VHBCOMMENT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "VHBCOMMENT", Line: 0, Value: "" },
          VHBRESULT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "VHBRESULT", Line: 0, Value: "" },
          VHCCOMMENT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "VHCCOMMENT", Line: 0, Value: "" },
          VHCRESULT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "VHCRESULT", Line: 0, Value: "" },
          VOLPARTO: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "VOLPARTO", Line: 0, Value: "" },
          X00COMMENT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X00COMMENT", Line: 0, Value: "" },
          X00LCOMMEN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X00LCOMMEN", Line: 0, Value: "" },
          X00LRESULT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X00LRESULT", Line: 0, Value: "" },
          X00OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X00OBS", Line: 0, Value: "" },
          X00RESULT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X00RESULT", Line: 0, Value: "" },
          X00TRIM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X00TRIM", Line: 0, Value: "" },
          X00_NOTAS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X00_NOTAS", Line: 0, Value: "" },
          X01COMMENT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X01COMMENT", Line: 0, Value: "" },
          X01LCOMMEN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X01LCOMMEN", Line: 0, Value: "" },
          X01LRESULT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X01LRESULT", Line: 0, Value: "" },
          X01OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X01OBS", Line: 0, Value: "" },
          X01RESULT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X01RESULT", Line: 0, Value: "" },
          X01TRIM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X01TRIM", Line: 0, Value: "" },
          X01_NOTAS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X01_NOTAS", Line: 0, Value: "" },
          X02LCOMMEN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X02LCOMMEN", Line: 0, Value: "" },
          X02LRESULT: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X02LRESULT", Line: 0, Value: "" },
          X02OBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X02OBS", Line: 0, Value: "" },
          //X03EMANAS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X03EMANAS", Line: 0, Value: "" },
          CTRECORESU: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "CTRECORESU", Line: 0, Value: "" },
          CTRECOCOMM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "CTRECOCOMM", Line: 0, Value: "" },
          X00ECORESU: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X00ECORESU", Line: 0, Value: "" },
          X00ECOCOMM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X00ECOCOMM", Line: 0, Value: "" },
          X01ECORESU: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X01ECORESU", Line: 0, Value: "" },
          X01ECOCOMM: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "X01ECOCOMM", Line: 0, Value: "" },
          //BirthV2
          PARTOMOTIV: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PARTOMOTIV", Line: 0, Value: "" },
          PARTOOBS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PARTOOBS", Line: 0, Value: "" },
          PARTOEVO: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PARTOEVO", Line: 0, Value: "" },
          PARTOEPISI: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PARTOEPISI", Line: 0, Value: "" },
          PARTODESGR: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PARTODESGR", Line: 0, Value: "" },
          LIGADURA_T: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "LIGADURA_T", Line: 0, Value: "" },
          PARTOTSANG: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PARTOTSANG", Line: 0, Value: "" },
          BANCOSANGR: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "BANCOSANGR", Line: 0, Value: "" },
          ANESTESIST: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "ANESTESIST", Line: 0, Value: "" },
          MATRONA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MATRONA", Line: 0, Value: "" },
          GINECOLOGO: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "GINECOLOGO", Line: 0, Value: "" },
          PARTORECAL: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PARTORECAL", Line: 0, Value: "" },
          PARTOPLGEN: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PARTOPLGEN", Line: 0, Value: "" },
          PARTOPL: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "PARTOPL", Line: 0, Value: "" },
          //Discharge
          MOV_FREADI: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FREADI", Line: 0, Value: "" },
          MOV_FDTYPE: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FDTYPE", Line: 0, Value: "" },
          MOV_CSTRAS: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_CSTRAS", Line: 0, Value: "" },
          MOV_FSTYDA: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FSTYDA", Line: 0, Value: "" }, 
          MOV_FTRADI: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FTRADI", Line: 0, Value: "" },
          MOV_FTRADC: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FTRADC", Line: 0, Value: "" },
          MOV_FDATDI: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FDATDI", Line: 0, Value: "" },
          MOV_FTIMDI: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FTIMDI", Line: 0, Value: "" },
          MOV_FDISFL: { Dokar: "", Doknr: "", Dokvr: "", Doktl: "", Alias: "MOV_FDISFL", Line: 0, Value: "" },
        }
      });
    },

  };
});

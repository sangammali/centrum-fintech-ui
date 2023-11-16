const getFintechMetaService = require("./getFintechMeta.service");
const initJourneyService = require("./initJourney.service");
const fintechRedirectionService = require("./fintechRedirection.service");
const fintechCustomerLinkingService = require("./getFintechCustomerLinking.service");

const services = {
  getFintechMeta: getFintechMetaService,
  initJourney: initJourneyService,
  fintechRedirection: fintechRedirectionService,
  getFintechCustomerLinking: fintechCustomerLinkingService,
};

module.exports = services;

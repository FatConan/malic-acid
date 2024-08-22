import ElementHelper from "./dom/ElementHelper.js";
import HighLevelEventHandler from "./events/HighLevelEventHandler.js";
import ConfirmationModal from "./modal/ConfirmationModal.js";
import RequestParameters from "./request/RequestParameters.js";
import BaseClass from "./classes/BaseClass.js";

const dom = {
    ElementHelper
};

const events = {
    HighLevelEventHandler: HighLevelEventHandler
};

const modal = {
    ConfirmationModal
};

const request = {
    RequestParameters
};

const classes = {
    BaseClass
};

const helpers = {
    dom,
    events,
    modal,
    request,
    classes
};

export default helpers;
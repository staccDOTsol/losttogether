"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandyMachineConfig = void 0;
const react_1 = __importStar(require("react"));
const marketplace_ui_1 = require("@strata-foundation/marketplace-ui");
const react_2 = require("@chakra-ui/react");
const variables_1 = require("../../theme/Root/variables");
const AsyncButton_1 = require("../../theme/ReactLiveScope/AsyncButton");
//@ts-ignore
const BrowserOnly_1 = __importDefault(require("@docusaurus/BrowserOnly"));
const react_3 = require("@strata-foundation/react");
function BrowserOnlyReactJson(props) {
    return (react_1.default.createElement(BrowserOnly_1.default, { fallback: react_1.default.createElement("div", null, "...") }, () => {
        const Component = require("react-json-view").default;
        return react_1.default.createElement(Component, Object.assign({}, props));
    }));
}
function CandyMachineConfig() {
    const { setVariables } = (0, variables_1.useVariablesContext)();
    const variables = (0, variables_1.useVariables)();
    const candyMachineKey = (0, react_3.usePublicKey)(variables === null || variables === void 0 ? void 0 : variables.candyMachineId);
    const { info, loading } = (0, marketplace_ui_1.useCandyMachine)(candyMachineKey);
    (0, react_1.useEffect)(() => {
        setVariables((vars) => (Object.assign(Object.assign({}, vars), { candyMachine: info })));
    }, [variables.candyMachineId]);
    if (loading) {
        return react_1.default.createElement(react_2.Spinner, null);
    }
    return (react_1.default.createElement(BrowserOnlyReactJson, { theme: "bright:inverted", collapsed: 1, displayDataTypes: false, name: false, src: (0, AsyncButton_1.recursiveTransformBN)(info || {}) }));
}
exports.CandyMachineConfig = CandyMachineConfig;
//# sourceMappingURL=index.js.map
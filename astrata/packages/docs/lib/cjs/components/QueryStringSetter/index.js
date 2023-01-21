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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryStringSetter = void 0;
const react_1 = __importStar(require("react"));
const react_2 = require("@chakra-ui/react");
const react_3 = require("@strata-foundation/react");
const variables_1 = require("../../theme/Root/variables");
function QueryStringSetter({ name, label, conv = (v) => v, }) {
    const [passedValue, setPassedValue] = (0, react_3.useQueryString)(name, "");
    const { setVariables, variables } = (0, variables_1.useVariablesContext)();
    (0, react_1.useEffect)(() => {
        setVariables((vars) => {
            try {
                return Object.assign(Object.assign({}, vars), { [name]: conv(passedValue), [name + "Raw"]: passedValue });
            }
            catch (e) {
                console.error(e);
            }
        });
    }, [passedValue, setVariables]);
    return (react_1.default.createElement(react_2.Box, { p: 1 },
        react_1.default.createElement(react_2.Text, { fontWeight: "bold" }, label),
        react_1.default.createElement(react_2.Input, { onChange: (e) => setPassedValue(e.target.value), value: passedValue })));
}
exports.QueryStringSetter = QueryStringSetter;
//# sourceMappingURL=index.js.map
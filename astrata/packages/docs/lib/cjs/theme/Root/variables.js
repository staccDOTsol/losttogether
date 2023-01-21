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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVariables = exports.useVariablesContext = exports.VariablesProvider = exports.VariablesContext = void 0;
const react_1 = __importStar(require("react"));
const react_2 = require("@strata-foundation/react");
exports.VariablesContext = react_1.default.createContext({
    variables: null,
    setVariables: (i) => null,
    register: () => null,
    execWithDeps: () => Promise.resolve(),
});
//@ts-ignore
const VariablesProvider = ({ children }) => {
    const [variables, setVariables] = (0, react_1.useState)(null);
    const [dependencies, setDependencies] = (0, react_1.useState)({});
    const [executed, setExecuted] = (0, react_1.useState)(new Set());
    const register = (name, deps, exec) => {
        setDependencies((d) => (Object.assign(Object.assign({}, d), { [name]: { deps, exec } })));
    };
    const execWithDeps = (0, react_1.useMemo)(() => (name, vars = variables) => __awaiter(void 0, void 0, void 0, function* () {
        for (const dep of dependencies[name].deps) {
            if (!executed.has(dep)) {
                vars = Object.assign(Object.assign({}, vars), (yield execWithDeps(dep, vars)));
            }
        }
        const ret = yield dependencies[name].exec(vars);
        setExecuted((e) => {
            e.add(name);
            return e;
        });
        setVariables(ret);
        return ret;
    }), [dependencies, setVariables, variables]);
    const { cluster } = (0, react_2.useEndpoint)();
    (0, react_1.useEffect)(() => {
        setVariables(vars => (Object.assign(Object.assign({}, vars), { cluster })));
    }, [cluster]);
    return (react_1.default.createElement(exports.VariablesContext.Provider, { value: { variables, setVariables, register, execWithDeps } }, children));
};
exports.VariablesProvider = VariablesProvider;
const useVariablesContext = () => {
    return (0, react_1.useContext)(exports.VariablesContext);
};
exports.useVariablesContext = useVariablesContext;
const useVariables = () => {
    return (0, exports.useVariablesContext)().variables || {};
};
exports.useVariables = useVariables;
//# sourceMappingURL=variables.js.map
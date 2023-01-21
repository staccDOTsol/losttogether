"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlDisplay = void 0;
const variables_1 = require("../../theme/Root/variables");
const react_1 = __importDefault(require("react"));
//@ts-ignore
const CodeBlock_1 = __importDefault(require("@theme-init/CodeBlock"));
const UrlDisplay = ({ subs, value }) => {
    const variables = (0, variables_1.useVariables)();
    const subbed = subs.reduce((currValue, name) => {
        return currValue.replace(new RegExp(":" + name, 'g'), variables[name]);
    }, value);
    return react_1.default.createElement(CodeBlock_1.default, null, subbed);
};
exports.UrlDisplay = UrlDisplay;
//# sourceMappingURL=index.js.map
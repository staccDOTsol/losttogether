"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
if (process.env.NODE_ENV === "development") {
    const whyDidYouRender = require("@welldone-software/why-did-you-render");
    whyDidYouRender(react_1.default, {
        trackAllPureComponents: true,
    });
}
//# sourceMappingURL=wdyr.js.map
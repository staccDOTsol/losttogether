"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const react_1 = __importDefault(require("react"));
const clsx_1 = __importDefault(require("clsx"));
//@ts-ignore
const HomepageFeatures_module_css_1 = __importDefault(require("./HomepageFeatures.module.css"));
const FeatureList = [
    {
        title: "Easy to Use",
        image: "/img/EasytoUse.png",
        description: (react_1.default.createElement(react_1.default.Fragment, null, "Strata provides SDKs to launch Tokens in an instant. No Rust or Solana experience needed!")),
    },
    {
        title: "Free and Open",
        image: "/img/FreeandOpen.png",
        description: (react_1.default.createElement(react_1.default.Fragment, null, "Strata is free to use and Open Source. Launch your token without someone else taking a cut!")),
    },
    {
        title: "Build Quickly with React",
        image: "/img/BuildwithReact.png",
        description: (react_1.default.createElement(react_1.default.Fragment, null, "Strata comes with hooks and helpers to make coding using React a breeze.")),
    },
];
function Feature({ title, image, description }) {
    return (react_1.default.createElement("div", { className: (0, clsx_1.default)("col col--4") },
        react_1.default.createElement("div", { className: "text--center" },
            react_1.default.createElement("img", { style: { width: "100px", height: "100px" }, className: HomepageFeatures_module_css_1.default.featureSvg, alt: title, src: image })),
        react_1.default.createElement("div", { className: "text--center padding-horiz--md" },
            react_1.default.createElement("h3", null, title),
            react_1.default.createElement("p", null, description))));
}
function HomepageFeatures() {
    return (react_1.default.createElement("section", { className: HomepageFeatures_module_css_1.default.features },
        react_1.default.createElement("div", { className: "container" },
            react_1.default.createElement("div", { className: "row" }, FeatureList.map((props, idx) => (react_1.default.createElement(Feature, Object.assign({ key: idx }, props))))))));
}
exports.default = HomepageFeatures;
//# sourceMappingURL=HomepageFeatures.js.map
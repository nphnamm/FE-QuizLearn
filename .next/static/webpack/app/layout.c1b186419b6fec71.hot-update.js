"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/layout",{

/***/ "(app-pages-browser)/./src/store/store.ts":
/*!****************************!*\
  !*** ./src/store/store.ts ***!
  \****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   store: () => (/* binding */ store)\n/* harmony export */ });\n/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @reduxjs/toolkit */ \"(app-pages-browser)/./node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs\");\n/* harmony import */ var redux_saga__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! redux-saga */ \"(app-pages-browser)/./node_modules/redux-saga/dist/redux-saga-core-npm-proxy.esm.js\");\n/* harmony import */ var _rootSaga__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./rootSaga */ \"(app-pages-browser)/./src/store/rootSaga.ts\");\n/* harmony import */ var _features_signIn_loginSlice__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./features/signIn/loginSlice */ \"(app-pages-browser)/./src/store/features/signIn/loginSlice.ts\");\n\n\n\n\nconst sagaMiddleware = (0,redux_saga__WEBPACK_IMPORTED_MODULE_0__[\"default\"])();\nconst store = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_3__.configureStore)({\n    reducer: {\n        login: _features_signIn_loginSlice__WEBPACK_IMPORTED_MODULE_2__[\"default\"]\n    },\n    middleware: (getDefaultMiddleware)=>getDefaultMiddleware({\n            thunk: false\n        }).concat(sagaMiddleware)\n});\nsagaMiddleware.run(_rootSaga__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9zdG9yZS9zdG9yZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFrRDtBQUNKO0FBQ1o7QUFHc0I7QUFDeEQsTUFBTUksaUJBQWlCSCxzREFBb0JBO0FBRXBDLE1BQU1JLFFBQVFMLGdFQUFjQSxDQUFDO0lBQ2xDTSxTQUFTO1FBQ1BDLE9BQU9KLG1FQUFZQTtJQUNyQjtJQUNBSyxZQUFZLENBQUNDLHVCQUNYQSxxQkFBcUI7WUFBRUMsT0FBTztRQUFNLEdBQUdDLE1BQU0sQ0FBQ1A7QUFDbEQsR0FBRztBQUVIQSxlQUFlUSxHQUFHLENBQUNWLGlEQUFRQSIsInNvdXJjZXMiOlsiRTpcXE5hbVxcRkUtUXVpekxlYXJuXFxzcmNcXHN0b3JlXFxzdG9yZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjb25maWd1cmVTdG9yZSB9IGZyb20gXCJAcmVkdXhqcy90b29sa2l0XCI7XHJcbmltcG9ydCBjcmVhdGVTYWdhTWlkZGxld2FyZSBmcm9tIFwicmVkdXgtc2FnYVwiO1xyXG5pbXBvcnQgcm9vdFNhZ2EgZnJvbSBcIi4vcm9vdFNhZ2FcIjtcclxuaW1wb3J0IHsgc2lnblVwUmVkdWNlciB9IGZyb20gXCIuL2ZlYXR1cmVzL3NpZ25VcC9zaWduVXBTbGljZVwiO1xyXG5pbXBvcnQgYXV0aFJlZHVjZXIgZnJvbSBcIi4vZmVhdHVyZXMvYXV0aC9hdXRoU2xpY2VcIjtcclxuaW1wb3J0IGxvZ2luUmVkdWNlciBmcm9tIFwiLi9mZWF0dXJlcy9zaWduSW4vbG9naW5TbGljZVwiO1xyXG5jb25zdCBzYWdhTWlkZGxld2FyZSA9IGNyZWF0ZVNhZ2FNaWRkbGV3YXJlKCk7XHJcblxyXG5leHBvcnQgY29uc3Qgc3RvcmUgPSBjb25maWd1cmVTdG9yZSh7XHJcbiAgcmVkdWNlcjoge1xyXG4gICAgbG9naW46IGxvZ2luUmVkdWNlcixcclxuICB9LFxyXG4gIG1pZGRsZXdhcmU6IChnZXREZWZhdWx0TWlkZGxld2FyZSkgPT5cclxuICAgIGdldERlZmF1bHRNaWRkbGV3YXJlKHsgdGh1bms6IGZhbHNlIH0pLmNvbmNhdChzYWdhTWlkZGxld2FyZSksXHJcbn0pO1xyXG5cclxuc2FnYU1pZGRsZXdhcmUucnVuKHJvb3RTYWdhKTtcclxuXHJcbmV4cG9ydCB0eXBlIFJvb3RTdGF0ZSA9IFJldHVyblR5cGU8dHlwZW9mIHN0b3JlLmdldFN0YXRlPjtcclxuZXhwb3J0IHR5cGUgQXBwRGlzcGF0Y2ggPSB0eXBlb2Ygc3RvcmUuZGlzcGF0Y2g7XHJcbiJdLCJuYW1lcyI6WyJjb25maWd1cmVTdG9yZSIsImNyZWF0ZVNhZ2FNaWRkbGV3YXJlIiwicm9vdFNhZ2EiLCJsb2dpblJlZHVjZXIiLCJzYWdhTWlkZGxld2FyZSIsInN0b3JlIiwicmVkdWNlciIsImxvZ2luIiwibWlkZGxld2FyZSIsImdldERlZmF1bHRNaWRkbGV3YXJlIiwidGh1bmsiLCJjb25jYXQiLCJydW4iXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/store/store.ts\n"));

/***/ })

});
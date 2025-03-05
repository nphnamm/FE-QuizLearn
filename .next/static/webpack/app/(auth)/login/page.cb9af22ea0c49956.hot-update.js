"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/(auth)/login/page",{

/***/ "(app-pages-browser)/./src/store/features/signIn/loginSlice.ts":
/*!*************************************************!*\
  !*** ./src/store/features/signIn/loginSlice.ts ***!
  \*************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   loginFailure: () => (/* binding */ loginFailure),\n/* harmony export */   loginRequest: () => (/* binding */ loginRequest),\n/* harmony export */   loginSuccess: () => (/* binding */ loginSuccess),\n/* harmony export */   logoutFailure: () => (/* binding */ logoutFailure),\n/* harmony export */   logoutRequest: () => (/* binding */ logoutRequest),\n/* harmony export */   logoutSuccess: () => (/* binding */ logoutSuccess)\n/* harmony export */ });\n/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @reduxjs/toolkit */ \"(app-pages-browser)/./node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs\");\n\nconst initialState = {\n    isAuthenticated: false,\n    accessToken: null,\n    refreshToken: null,\n    loading: false,\n    error: null,\n    user: null\n};\nconst loginSlice = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createSlice)({\n    name: \"login\",\n    initialState,\n    reducers: {\n        loginRequest (state, action) {\n            state.loading = true;\n            state.error = null;\n        },\n        loginSuccess (state, action) {\n            state.isAuthenticated = true;\n            state.accessToken = action.payload.accessToken;\n            state.refreshToken = action.payload.refreshToken;\n            state.user = action.payload.user;\n            state.loading = false;\n        },\n        loginFailure (state, action) {\n            state.loading = false;\n            state.error = action.payload;\n        },\n        logoutRequest (state) {\n            state.loading = true;\n        },\n        logoutSuccess (state) {\n            return initialState;\n        },\n        logoutFailure (state, action) {\n            state.loading = false;\n            state.error = action.payload;\n        }\n    }\n});\nconst { loginRequest, loginSuccess, loginFailure, logoutRequest, logoutSuccess, logoutFailure } = loginSlice.actions;\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (loginSlice.reducer);\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9zdG9yZS9mZWF0dXJlcy9zaWduSW4vbG9naW5TbGljZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUE4RDtBQVk5RCxNQUFNQyxlQUEwQjtJQUM5QkMsaUJBQWlCO0lBQ2pCQyxhQUFhO0lBQ2JDLGNBQWM7SUFDZEMsU0FBUztJQUNUQyxPQUFPO0lBQ1BDLE1BQU07QUFDUjtBQUVBLE1BQU1DLGFBQWFSLDZEQUFXQSxDQUFDO0lBQzdCUyxNQUFNO0lBQ05SO0lBQ0FTLFVBQVU7UUFDUkMsY0FBYUMsS0FBSyxFQUFFQyxNQUFtQztZQUNyREQsTUFBTVAsT0FBTyxHQUFHO1lBQ2hCTyxNQUFNTixLQUFLLEdBQUc7UUFDaEI7UUFDQVEsY0FDRUYsS0FBSyxFQUNMQyxNQUlFO1lBRUZELE1BQU1WLGVBQWUsR0FBRztZQUN4QlUsTUFBTVQsV0FBVyxHQUFHVSxPQUFPRSxPQUFPLENBQUNaLFdBQVc7WUFDOUNTLE1BQU1SLFlBQVksR0FBR1MsT0FBT0UsT0FBTyxDQUFDWCxZQUFZO1lBQ2hEUSxNQUFNTCxJQUFJLEdBQUdNLE9BQU9FLE9BQU8sQ0FBQ1IsSUFBSTtZQUNoQ0ssTUFBTVAsT0FBTyxHQUFHO1FBQ2xCO1FBQ0FXLGNBQWFKLEtBQUssRUFBRUMsTUFBNkI7WUFDL0NELE1BQU1QLE9BQU8sR0FBRztZQUNoQk8sTUFBTU4sS0FBSyxHQUFHTyxPQUFPRSxPQUFPO1FBQzlCO1FBQ0FFLGVBQWNMLEtBQUs7WUFDakJBLE1BQU1QLE9BQU8sR0FBRztRQUNsQjtRQUNBYSxlQUFjTixLQUFLO1lBQ2pCLE9BQU9YO1FBQ1Q7UUFDQWtCLGVBQWNQLEtBQUssRUFBRUMsTUFBNkI7WUFDaERELE1BQU1QLE9BQU8sR0FBRztZQUNoQk8sTUFBTU4sS0FBSyxHQUFHTyxPQUFPRSxPQUFPO1FBQzlCO0lBQ0Y7QUFDRjtBQUVPLE1BQU0sRUFDWEosWUFBWSxFQUNaRyxZQUFZLEVBQ1pFLFlBQVksRUFDWkMsYUFBYSxFQUNiQyxhQUFhLEVBQ2JDLGFBQWEsRUFDZCxHQUFHWCxXQUFXWSxPQUFPLENBQUM7QUFDdkIsaUVBQWVaLFdBQVdhLE9BQU8sRUFBQyIsInNvdXJjZXMiOlsiRTpcXE5hbVxcRkUtUXVpekxlYXJuXFxzcmNcXHN0b3JlXFxmZWF0dXJlc1xcc2lnbkluXFxsb2dpblNsaWNlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZVNsaWNlLCBQYXlsb2FkQWN0aW9uIH0gZnJvbSBcIkByZWR1eGpzL3Rvb2xraXRcIjtcclxuaW1wb3J0IHsgTG9naW5QYXlsb2FkIH0gZnJvbSBcIi4uL2F1dGgvc3RhdGVcIjtcclxuXHJcbmludGVyZmFjZSBBdXRoU3RhdGUge1xyXG4gIGlzQXV0aGVudGljYXRlZDogYm9vbGVhbjtcclxuICBhY2Nlc3NUb2tlbjogc3RyaW5nIHwgbnVsbDtcclxuICByZWZyZXNoVG9rZW46IHN0cmluZyB8IG51bGw7XHJcbiAgbG9hZGluZzogYm9vbGVhbjtcclxuICBlcnJvcjogc3RyaW5nIHwgbnVsbDtcclxuICB1c2VyOiBhbnk7XHJcbn1cclxuXHJcbmNvbnN0IGluaXRpYWxTdGF0ZTogQXV0aFN0YXRlID0ge1xyXG4gIGlzQXV0aGVudGljYXRlZDogZmFsc2UsXHJcbiAgYWNjZXNzVG9rZW46IG51bGwsXHJcbiAgcmVmcmVzaFRva2VuOiBudWxsLFxyXG4gIGxvYWRpbmc6IGZhbHNlLFxyXG4gIGVycm9yOiBudWxsLFxyXG4gIHVzZXI6IG51bGwsXHJcbn07XHJcblxyXG5jb25zdCBsb2dpblNsaWNlID0gY3JlYXRlU2xpY2Uoe1xyXG4gIG5hbWU6IFwibG9naW5cIixcclxuICBpbml0aWFsU3RhdGUsXHJcbiAgcmVkdWNlcnM6IHtcclxuICAgIGxvZ2luUmVxdWVzdChzdGF0ZSwgYWN0aW9uOiBQYXlsb2FkQWN0aW9uPExvZ2luUGF5bG9hZD4pIHtcclxuICAgICAgc3RhdGUubG9hZGluZyA9IHRydWU7XHJcbiAgICAgIHN0YXRlLmVycm9yID0gbnVsbDtcclxuICAgIH0sXHJcbiAgICBsb2dpblN1Y2Nlc3MoXHJcbiAgICAgIHN0YXRlLFxyXG4gICAgICBhY3Rpb246IFBheWxvYWRBY3Rpb248e1xyXG4gICAgICAgIGFjY2Vzc1Rva2VuOiBzdHJpbmc7XHJcbiAgICAgICAgcmVmcmVzaFRva2VuOiBzdHJpbmc7XHJcbiAgICAgICAgdXNlcjogYW55O1xyXG4gICAgICB9PlxyXG4gICAgKSB7XHJcbiAgICAgIHN0YXRlLmlzQXV0aGVudGljYXRlZCA9IHRydWU7XHJcbiAgICAgIHN0YXRlLmFjY2Vzc1Rva2VuID0gYWN0aW9uLnBheWxvYWQuYWNjZXNzVG9rZW47XHJcbiAgICAgIHN0YXRlLnJlZnJlc2hUb2tlbiA9IGFjdGlvbi5wYXlsb2FkLnJlZnJlc2hUb2tlbjtcclxuICAgICAgc3RhdGUudXNlciA9IGFjdGlvbi5wYXlsb2FkLnVzZXI7XHJcbiAgICAgIHN0YXRlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgIH0sXHJcbiAgICBsb2dpbkZhaWx1cmUoc3RhdGUsIGFjdGlvbjogUGF5bG9hZEFjdGlvbjxzdHJpbmc+KSB7XHJcbiAgICAgIHN0YXRlLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgc3RhdGUuZXJyb3IgPSBhY3Rpb24ucGF5bG9hZDtcclxuICAgIH0sXHJcbiAgICBsb2dvdXRSZXF1ZXN0KHN0YXRlKSB7XHJcbiAgICAgIHN0YXRlLmxvYWRpbmcgPSB0cnVlO1xyXG4gICAgfSxcclxuICAgIGxvZ291dFN1Y2Nlc3Moc3RhdGUpIHtcclxuICAgICAgcmV0dXJuIGluaXRpYWxTdGF0ZTtcclxuICAgIH0sXHJcbiAgICBsb2dvdXRGYWlsdXJlKHN0YXRlLCBhY3Rpb246IFBheWxvYWRBY3Rpb248c3RyaW5nPikge1xyXG4gICAgICBzdGF0ZS5sb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgIHN0YXRlLmVycm9yID0gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGNvbnN0IHtcclxuICBsb2dpblJlcXVlc3QsXHJcbiAgbG9naW5TdWNjZXNzLFxyXG4gIGxvZ2luRmFpbHVyZSxcclxuICBsb2dvdXRSZXF1ZXN0LFxyXG4gIGxvZ291dFN1Y2Nlc3MsXHJcbiAgbG9nb3V0RmFpbHVyZSxcclxufSA9IGxvZ2luU2xpY2UuYWN0aW9ucztcclxuZXhwb3J0IGRlZmF1bHQgbG9naW5TbGljZS5yZWR1Y2VyO1xyXG4iXSwibmFtZXMiOlsiY3JlYXRlU2xpY2UiLCJpbml0aWFsU3RhdGUiLCJpc0F1dGhlbnRpY2F0ZWQiLCJhY2Nlc3NUb2tlbiIsInJlZnJlc2hUb2tlbiIsImxvYWRpbmciLCJlcnJvciIsInVzZXIiLCJsb2dpblNsaWNlIiwibmFtZSIsInJlZHVjZXJzIiwibG9naW5SZXF1ZXN0Iiwic3RhdGUiLCJhY3Rpb24iLCJsb2dpblN1Y2Nlc3MiLCJwYXlsb2FkIiwibG9naW5GYWlsdXJlIiwibG9nb3V0UmVxdWVzdCIsImxvZ291dFN1Y2Nlc3MiLCJsb2dvdXRGYWlsdXJlIiwiYWN0aW9ucyIsInJlZHVjZXIiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/store/features/signIn/loginSlice.ts\n"));

/***/ })

});
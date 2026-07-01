/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./src/lib/DistrictContext.js":
/*!************************************!*\
  !*** ./src/lib/DistrictContext.js ***!
  \************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DistrictProvider: () => (/* binding */ DistrictProvider),\n/* harmony export */   useDistrict: () => (/* binding */ useDistrict)\n/* harmony export */ });\n/* harmony import */ var _emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/react/jsx-dev-runtime */ \"@emotion/react/jsx-dev-runtime\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__]);\n_emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\nconst DistrictContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(null);\nconst DistrictProvider = ({ children })=>{\n    const [chamber, setChamber] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(\"house\");\n    const [activeHouseDistrict, setActiveHouseDistrict] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(\"\");\n    const [activeSenateDistrict, setActiveSenateDistrict] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(\"\");\n    return /*#__PURE__*/ (0,_emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(DistrictContext.Provider, {\n        value: {\n            chamber,\n            setChamber,\n            activeHouseDistrict,\n            setActiveHouseDistrict,\n            activeSenateDistrict,\n            setActiveSenateDistrict\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"/home/tmuss/projects/election-guide-2026/src/lib/DistrictContext.js\",\n        lineNumber: 11,\n        columnNumber: 5\n    }, undefined);\n};\nconst useDistrict = ()=>(0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(DistrictContext);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvbGliL0Rpc3RyaWN0Q29udGV4dC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBMkQ7QUFFM0QsTUFBTUcsZ0NBQWtCSCxvREFBYUEsQ0FBQztBQUUvQixNQUFNSSxtQkFBbUIsQ0FBQyxFQUFFQyxRQUFRLEVBQUU7SUFDM0MsTUFBTSxDQUFDQyxTQUFTQyxXQUFXLEdBQUdMLCtDQUFRQSxDQUFDO0lBQ3ZDLE1BQU0sQ0FBQ00scUJBQXFCQyx1QkFBdUIsR0FBR1AsK0NBQVFBLENBQUM7SUFDL0QsTUFBTSxDQUFDUSxzQkFBc0JDLHdCQUF3QixHQUFHVCwrQ0FBUUEsQ0FBQztJQUVqRSxxQkFDRSx1RUFBQ0MsZ0JBQWdCUyxRQUFRO1FBQUNDLE9BQU87WUFDL0JQO1lBQVNDO1lBQ1RDO1lBQXFCQztZQUNyQkM7WUFBc0JDO1FBQ3hCO2tCQUNHTjs7Ozs7O0FBR1AsRUFBQztBQUVNLE1BQU1TLGNBQWMsSUFBTWIsaURBQVVBLENBQUNFLGlCQUFnQiIsInNvdXJjZXMiOlsid2VicGFjazovL2VsZWN0aW9uLWd1aWRlLy4vc3JjL2xpYi9EaXN0cmljdENvbnRleHQuanM/MTgxMiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDb250ZXh0LCB1c2VDb250ZXh0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuXG5jb25zdCBEaXN0cmljdENvbnRleHQgPSBjcmVhdGVDb250ZXh0KG51bGwpXG5cbmV4cG9ydCBjb25zdCBEaXN0cmljdFByb3ZpZGVyID0gKHsgY2hpbGRyZW4gfSkgPT4ge1xuICBjb25zdCBbY2hhbWJlciwgc2V0Q2hhbWJlcl0gPSB1c2VTdGF0ZSgnaG91c2UnKVxuICBjb25zdCBbYWN0aXZlSG91c2VEaXN0cmljdCwgc2V0QWN0aXZlSG91c2VEaXN0cmljdF0gPSB1c2VTdGF0ZSgnJylcbiAgY29uc3QgW2FjdGl2ZVNlbmF0ZURpc3RyaWN0LCBzZXRBY3RpdmVTZW5hdGVEaXN0cmljdF0gPSB1c2VTdGF0ZSgnJylcblxuICByZXR1cm4gKFxuICAgIDxEaXN0cmljdENvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3tcbiAgICAgIGNoYW1iZXIsIHNldENoYW1iZXIsXG4gICAgICBhY3RpdmVIb3VzZURpc3RyaWN0LCBzZXRBY3RpdmVIb3VzZURpc3RyaWN0LFxuICAgICAgYWN0aXZlU2VuYXRlRGlzdHJpY3QsIHNldEFjdGl2ZVNlbmF0ZURpc3RyaWN0XG4gICAgfX0+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9EaXN0cmljdENvbnRleHQuUHJvdmlkZXI+XG4gIClcbn1cblxuZXhwb3J0IGNvbnN0IHVzZURpc3RyaWN0ID0gKCkgPT4gdXNlQ29udGV4dChEaXN0cmljdENvbnRleHQpXG4iXSwibmFtZXMiOlsiY3JlYXRlQ29udGV4dCIsInVzZUNvbnRleHQiLCJ1c2VTdGF0ZSIsIkRpc3RyaWN0Q29udGV4dCIsIkRpc3RyaWN0UHJvdmlkZXIiLCJjaGlsZHJlbiIsImNoYW1iZXIiLCJzZXRDaGFtYmVyIiwiYWN0aXZlSG91c2VEaXN0cmljdCIsInNldEFjdGl2ZUhvdXNlRGlzdHJpY3QiLCJhY3RpdmVTZW5hdGVEaXN0cmljdCIsInNldEFjdGl2ZVNlbmF0ZURpc3RyaWN0IiwiUHJvdmlkZXIiLCJ2YWx1ZSIsInVzZURpc3RyaWN0Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/lib/DistrictContext.js\n");

/***/ }),

/***/ "./src/pages/_app.js":
/*!***************************!*\
  !*** ./src/pages/_app.js ***!
  \***************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var _emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/react/jsx-dev-runtime */ \"@emotion/react/jsx-dev-runtime\");\n/* harmony import */ var _lib_DistrictContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/DistrictContext */ \"./src/lib/DistrictContext.js\");\n/* harmony import */ var _styles_base_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/styles/base.css */ \"./src/styles/base.css\");\n/* harmony import */ var _styles_base_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_base_css__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var ol_ol_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ol/ol.css */ \"./node_modules/ol/ol.css\");\n/* harmony import */ var ol_ol_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ol_ol_css__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _styles_index_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/styles/index.css */ \"./src/styles/index.css\");\n/* harmony import */ var _styles_index_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_styles_index_css__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _styles_candidate_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/styles/candidate.css */ \"./src/styles/candidate.css\");\n/* harmony import */ var _styles_candidate_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_styles_candidate_css__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _styles_footer_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/styles/footer.css */ \"./src/styles/footer.css\");\n/* harmony import */ var _styles_footer_css__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_styles_footer_css__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var _styles_header_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/styles/header.css */ \"./src/styles/header.css\");\n/* harmony import */ var _styles_header_css__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_styles_header_css__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var _styles_nav_css__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/styles/nav.css */ \"./src/styles/nav.css\");\n/* harmony import */ var _styles_nav_css__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_styles_nav_css__WEBPACK_IMPORTED_MODULE_8__);\n/* harmony import */ var _styles_components_portrait_image_css__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/styles/components/portrait-image.css */ \"./src/styles/components/portrait-image.css\");\n/* harmony import */ var _styles_components_portrait_image_css__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_styles_components_portrait_image_css__WEBPACK_IMPORTED_MODULE_9__);\n/* harmony import */ var _styles_components_candidate_search_css__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @/styles/components/candidate-search.css */ \"./src/styles/components/candidate-search.css\");\n/* harmony import */ var _styles_components_candidate_search_css__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_styles_components_candidate_search_css__WEBPACK_IMPORTED_MODULE_10__);\n/* harmony import */ var _styles_components_election_coverage_css__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @/styles/components/election-coverage.css */ \"./src/styles/components/election-coverage.css\");\n/* harmony import */ var _styles_components_election_coverage_css__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_styles_components_election_coverage_css__WEBPACK_IMPORTED_MODULE_11__);\n/* harmony import */ var _styles_components_race_candidates_css__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @/styles/components/race-candidates.css */ \"./src/styles/components/race-candidates.css\");\n/* harmony import */ var _styles_components_race_candidates_css__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_styles_components_race_candidates_css__WEBPACK_IMPORTED_MODULE_12__);\n/* harmony import */ var _styles_components_state_races_css__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @/styles/components/state-races.css */ \"./src/styles/components/state-races.css\");\n/* harmony import */ var _styles_components_state_races_css__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_styles_components_state_races_css__WEBPACK_IMPORTED_MODULE_13__);\n/* harmony import */ var _styles_components_candidate_links_css__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @/styles/components/candidate-links.css */ \"./src/styles/components/candidate-links.css\");\n/* harmony import */ var _styles_components_candidate_links_css__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_styles_components_candidate_links_css__WEBPACK_IMPORTED_MODULE_14__);\n/* harmony import */ var _styles_components_candidate_opponents_css__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @/styles/components/candidate-opponents.css */ \"./src/styles/components/candidate-opponents.css\");\n/* harmony import */ var _styles_components_candidate_opponents_css__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(_styles_components_candidate_opponents_css__WEBPACK_IMPORTED_MODULE_15__);\n/* harmony import */ var _styles_components_candidate_page_summary_css__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @/styles/components/candidate-page-summary.css */ \"./src/styles/components/candidate-page-summary.css\");\n/* harmony import */ var _styles_components_candidate_page_summary_css__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(_styles_components_candidate_page_summary_css__WEBPACK_IMPORTED_MODULE_16__);\n/* harmony import */ var _styles_components_race_results_css__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @/styles/components/race-results.css */ \"./src/styles/components/race-results.css\");\n/* harmony import */ var _styles_components_race_results_css__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(_styles_components_race_results_css__WEBPACK_IMPORTED_MODULE_17__);\n/* harmony import */ var _styles_components_judge_list_css__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @/styles/components/judge-list.css */ \"./src/styles/components/judge-list.css\");\n/* harmony import */ var _styles_components_judge_list_css__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(_styles_components_judge_list_css__WEBPACK_IMPORTED_MODULE_18__);\n/* harmony import */ var _styles_components_candidate_stories_css__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @/styles/components/candidate-stories.css */ \"./src/styles/components/candidate-stories.css\");\n/* harmony import */ var _styles_components_candidate_stories_css__WEBPACK_IMPORTED_MODULE_19___default = /*#__PURE__*/__webpack_require__.n(_styles_components_candidate_stories_css__WEBPACK_IMPORTED_MODULE_19__);\n/* harmony import */ var _styles_components_county_locator_css__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @/styles/components/county-locator.css */ \"./src/styles/components/county-locator.css\");\n/* harmony import */ var _styles_components_county_locator_css__WEBPACK_IMPORTED_MODULE_20___default = /*#__PURE__*/__webpack_require__.n(_styles_components_county_locator_css__WEBPACK_IMPORTED_MODULE_20__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__, _lib_DistrictContext__WEBPACK_IMPORTED_MODULE_1__]);\n([_emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__, _lib_DistrictContext__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,_emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_lib_DistrictContext__WEBPACK_IMPORTED_MODULE_1__.DistrictProvider, {\n        children: /*#__PURE__*/ (0,_emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"/home/tmuss/projects/election-guide-2026/src/pages/_app.js\",\n            lineNumber: 30,\n            columnNumber: 13\n        }, this)\n    }, void 0, false, {\n        fileName: \"/home/tmuss/projects/election-guide-2026/src/pages/_app.js\",\n        lineNumber: 29,\n        columnNumber: 9\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcGFnZXMvX2FwcC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDd0Q7QUFFOUI7QUFDUDtBQUVRO0FBQ0k7QUFFSDtBQUNBO0FBQ0g7QUFDc0I7QUFDRTtBQUNDO0FBQ0Y7QUFDSjtBQUNJO0FBQ0k7QUFDRztBQUNMO0FBQ0w7QUFDRjtBQUNPO0FBQ0g7QUFFaEMsU0FBU0MsSUFBSSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBRTtJQUNoRCxxQkFDSSx1RUFBQ0gsa0VBQWdCQTtrQkFDYixxRkFBQ0U7WUFBVyxHQUFHQyxTQUFTOzs7Ozs7Ozs7OztBQUdwQyIsInNvdXJjZXMiOlsid2VicGFjazovL2VsZWN0aW9uLWd1aWRlLy4vc3JjL3BhZ2VzL19hcHAuanM/OGZkYSJdLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IERpc3RyaWN0UHJvdmlkZXIgfSBmcm9tICdAL2xpYi9EaXN0cmljdENvbnRleHQnXG5cbmltcG9ydCBcIkAvc3R5bGVzL2Jhc2UuY3NzXCJcbmltcG9ydCAnb2wvb2wuY3NzJztcblxuaW1wb3J0ICdAL3N0eWxlcy9pbmRleC5jc3MnXG5pbXBvcnQgJ0Avc3R5bGVzL2NhbmRpZGF0ZS5jc3MnXG5cbmltcG9ydCAnQC9zdHlsZXMvZm9vdGVyLmNzcydcbmltcG9ydCBcIkAvc3R5bGVzL2hlYWRlci5jc3NcIlxuaW1wb3J0ICdAL3N0eWxlcy9uYXYuY3NzJ1xuaW1wb3J0ICdAL3N0eWxlcy9jb21wb25lbnRzL3BvcnRyYWl0LWltYWdlLmNzcydcbmltcG9ydCAnQC9zdHlsZXMvY29tcG9uZW50cy9jYW5kaWRhdGUtc2VhcmNoLmNzcydcbmltcG9ydCAnQC9zdHlsZXMvY29tcG9uZW50cy9lbGVjdGlvbi1jb3ZlcmFnZS5jc3MnXG5pbXBvcnQgJ0Avc3R5bGVzL2NvbXBvbmVudHMvcmFjZS1jYW5kaWRhdGVzLmNzcydcbmltcG9ydCAnQC9zdHlsZXMvY29tcG9uZW50cy9zdGF0ZS1yYWNlcy5jc3MnXG5pbXBvcnQgJ0Avc3R5bGVzL2NvbXBvbmVudHMvY2FuZGlkYXRlLWxpbmtzLmNzcydcbmltcG9ydCAnQC9zdHlsZXMvY29tcG9uZW50cy9jYW5kaWRhdGUtb3Bwb25lbnRzLmNzcydcbmltcG9ydCAnQC9zdHlsZXMvY29tcG9uZW50cy9jYW5kaWRhdGUtcGFnZS1zdW1tYXJ5LmNzcydcbmltcG9ydCAnQC9zdHlsZXMvY29tcG9uZW50cy9lbGVjdGlvbi1jb3ZlcmFnZS5jc3MnXG5pbXBvcnQgJ0Avc3R5bGVzL2NvbXBvbmVudHMvcmFjZS1yZXN1bHRzLmNzcydcbmltcG9ydCAnQC9zdHlsZXMvY29tcG9uZW50cy9qdWRnZS1saXN0LmNzcydcbmltcG9ydCAnQC9zdHlsZXMvY29tcG9uZW50cy9jYW5kaWRhdGUtc3Rvcmllcy5jc3MnXG5pbXBvcnQgJ0Avc3R5bGVzL2NvbXBvbmVudHMvY291bnR5LWxvY2F0b3IuY3NzJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPERpc3RyaWN0UHJvdmlkZXI+XG4gICAgICAgICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgICAgIDwvRGlzdHJpY3RQcm92aWRlcj5cbiAgICApO1xufSJdLCJuYW1lcyI6WyJEaXN0cmljdFByb3ZpZGVyIiwiQXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/pages/_app.js\n");

/***/ }),

/***/ "./src/styles/base.css":
/*!*****************************!*\
  !*** ./src/styles/base.css ***!
  \*****************************/
/***/ (() => {



/***/ }),

/***/ "./src/styles/candidate.css":
/*!**********************************!*\
  !*** ./src/styles/candidate.css ***!
  \**********************************/
/***/ (() => {



/***/ }),

/***/ "./src/styles/components/candidate-links.css":
/*!***************************************************!*\
  !*** ./src/styles/components/candidate-links.css ***!
  \***************************************************/
/***/ (() => {



/***/ }),

/***/ "./src/styles/components/candidate-opponents.css":
/*!*******************************************************!*\
  !*** ./src/styles/components/candidate-opponents.css ***!
  \*******************************************************/
/***/ (() => {



/***/ }),

/***/ "./src/styles/components/candidate-page-summary.css":
/*!**********************************************************!*\
  !*** ./src/styles/components/candidate-page-summary.css ***!
  \**********************************************************/
/***/ (() => {



/***/ }),

/***/ "./src/styles/components/candidate-search.css":
/*!****************************************************!*\
  !*** ./src/styles/components/candidate-search.css ***!
  \****************************************************/
/***/ (() => {



/***/ }),

/***/ "./src/styles/components/candidate-stories.css":
/*!*****************************************************!*\
  !*** ./src/styles/components/candidate-stories.css ***!
  \*****************************************************/
/***/ (() => {



/***/ }),

/***/ "./src/styles/components/county-locator.css":
/*!**************************************************!*\
  !*** ./src/styles/components/county-locator.css ***!
  \**************************************************/
/***/ (() => {



/***/ }),

/***/ "./src/styles/components/election-coverage.css":
/*!*****************************************************!*\
  !*** ./src/styles/components/election-coverage.css ***!
  \*****************************************************/
/***/ (() => {



/***/ }),

/***/ "./src/styles/components/judge-list.css":
/*!**********************************************!*\
  !*** ./src/styles/components/judge-list.css ***!
  \**********************************************/
/***/ (() => {



/***/ }),

/***/ "./src/styles/components/portrait-image.css":
/*!**************************************************!*\
  !*** ./src/styles/components/portrait-image.css ***!
  \**************************************************/
/***/ (() => {



/***/ }),

/***/ "./src/styles/components/race-candidates.css":
/*!***************************************************!*\
  !*** ./src/styles/components/race-candidates.css ***!
  \***************************************************/
/***/ (() => {



/***/ }),

/***/ "./src/styles/components/race-results.css":
/*!************************************************!*\
  !*** ./src/styles/components/race-results.css ***!
  \************************************************/
/***/ (() => {



/***/ }),

/***/ "./src/styles/components/state-races.css":
/*!***********************************************!*\
  !*** ./src/styles/components/state-races.css ***!
  \***********************************************/
/***/ (() => {



/***/ }),

/***/ "./src/styles/footer.css":
/*!*******************************!*\
  !*** ./src/styles/footer.css ***!
  \*******************************/
/***/ (() => {



/***/ }),

/***/ "./src/styles/header.css":
/*!*******************************!*\
  !*** ./src/styles/header.css ***!
  \*******************************/
/***/ (() => {



/***/ }),

/***/ "./src/styles/index.css":
/*!******************************!*\
  !*** ./src/styles/index.css ***!
  \******************************/
/***/ (() => {



/***/ }),

/***/ "./src/styles/nav.css":
/*!****************************!*\
  !*** ./src/styles/nav.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "@emotion/react/jsx-dev-runtime":
/*!*************************************************!*\
  !*** external "@emotion/react/jsx-dev-runtime" ***!
  \*************************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@emotion/react/jsx-dev-runtime");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/ol"], () => (__webpack_exec__("./src/pages/_app.js")));
module.exports = __webpack_exports__;

})();
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./frontend/js/worker.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./frontend/js/worker.js":
/*!*******************************!*\
  !*** ./frontend/js/worker.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("self.importScripts('../../wasm/proc.js');\r\n\r\nconst {invert, box_blur, gamma_transform, sobel_edge_detection} = wasm_bindgen;\r\n\r\nlet user_image = null;\r\n\r\nasync function initialize() {\r\n    await wasm_bindgen('../../wasm/proc_bg.wasm');\r\n    \r\n    self.postMessage({\r\n        message: \"wasm INITIALIZED\",\r\n    });\r\n\r\n    function invert_image(img, width) {\r\n        let inverted_raw_data = new Uint8ClampedArray(\r\n            invert(img, width)\r\n        );\r\n\r\n        return inverted_raw_data;\r\n    }\r\n\r\n    function box_blur_image(img, width, kernel_size) {\r\n\r\n        let box_blur_raw_data = new Uint8ClampedArray(\r\n            box_blur(\r\n                img,\r\n                width,\r\n                kernel_size\r\n            )\r\n        );\r\n\r\n        return box_blur_raw_data;\r\n    }\r\n\r\n    function gamma(img, width, gamma_value) {\r\n        let gamma_transform_raw_data = new Uint8ClampedArray(\r\n            gamma_transform(img, width, gamma_value)\r\n        );\r\n\r\n        return gamma_transform_raw_data;\r\n    }\r\n\r\n    function sobel(img, width, threshold) {\r\n        let sobel_raw_data = new Uint8ClampedArray(\r\n            sobel_edge_detection(img, width, threshold)\r\n        );\r\n\r\n        return sobel_raw_data\r\n    }\r\n\r\n    self.addEventListener('message', event => {\r\n        let message = event.data.message;\r\n        // let image_data = new Uint8Array();\r\n        let image_data = null;\r\n        let width = 0;\r\n\r\n        if (message === \"INVERT\") {\r\n            width = event.data.width;\r\n        } \r\n        else if (message === \"INVERT BUTTON\") {\r\n            width = event.data.width;\r\n            image_data = new Uint8Array(event.data.image);\r\n        } \r\n        else if (message === \"BOX BLUR\") {\r\n            width = event.data.width;\r\n        } \r\n        else if (message === \"GAMMA\") {\r\n            width = event.data.width;\r\n        } \r\n        else if(message === \"SOBEL\") {\r\n            width = event.data.width;\r\n        }\r\n        else if(message === \"USER IMAGE\") {\r\n            user_image = new Uint8ClampedArray(event.data.image);\r\n        }\r\n\r\n        if (message === \"INVERT\") {\r\n            image_data = invert_image(user_image, width);\r\n            self.postMessage(\r\n                {\r\n                    message: \"INVERTED\",\r\n                    image: image_data.buffer,\r\n                    width: width,\r\n                },\r\n                [image_data.buffer]\r\n            );\r\n        } \r\n        else if (message === \"INVERT BUTTON\") {\r\n            image_data = invert_image(image_data, width);\r\n            self.postMessage(\r\n                {\r\n                    message: \"INVERTED\",\r\n                    image: image_data.buffer,\r\n                    width: width,\r\n                },\r\n                [image_data.buffer]\r\n            );\r\n        }\r\n        else if (message === \"BOX BLUR\") {\r\n            image_data = box_blur_image(user_image, width, event.data.kernel_size);\r\n            self.postMessage(\r\n                {\r\n                    message: \"BOX BLUR\",\r\n                    image: image_data.buffer,\r\n                    width: width,\r\n                },\r\n                [image_data.buffer]\r\n            );\r\n        } \r\n        else if (message === \"GAMMA\") {\r\n            image_data = gamma(user_image, width, event.data.gamma);\r\n            self.postMessage(\r\n                {\r\n                    message: \"GAMMA\",\r\n                    image: image_data.buffer,\r\n                    width: width,\r\n                },\r\n                [image_data.buffer]\r\n            );\r\n        } \r\n        else if (message === \"SOBEL\") {\r\n            image_data = sobel(user_image, width, event.data.threshold);\r\n            self.postMessage(\r\n                {\r\n                    message: \"SOBEL\",\r\n                    image: image_data.buffer,\r\n                    width: width,\r\n                },\r\n                [image_data.buffer]\r\n            );\r\n        }\r\n        else {\r\n            self.postMessage(\"Unrecognized message\", []);\r\n        }\r\n    });\r\n}\r\n\r\ninitialize();\n\n//# sourceURL=webpack:///./frontend/js/worker.js?");

/***/ })

/******/ });
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

self.importScripts('../../wasm/proc.js');

const {invert, box_blur, gamma_transform} = wasm_bindgen;

async function initialize() {
    await wasm_bindgen('../../wasm/proc_bg.wasm');
    
    self.postMessage({
        message: "wasm INITIALIZED",
    });

    function invert_image(img, width) {
        let inverted_raw_data = new Uint8ClampedArray(
            invert(img, width)
        );
        // return new ImageData(inverted_raw_data, width);
        return inverted_raw_data;
    }

    function box_blur_image(img, width, kernel_size) {

        let box_blur_raw_data = new Uint8ClampedArray(
            box_blur(
                img,
                width,
                kernel_size
            )
        );

        // return new ImageData(box_blur_raw_data, img.width)
        return box_blur_raw_data;
    }

    function gamma(img, width, gamma_value) {
        let gamma_transform_raw_data = new Uint8ClampedArray(
            gamma_transform(img, width, gamma_value)
        );

        return gamma_transform_raw_data;
    }

    self.addEventListener('message', event => {
        let message = event.data.message;
        let image_data = new Uint8Array();
        let width = 0;

        if (message === "INVERT") {
            width = event.data.width;
            image_data = new Uint8Array(event.data.image);
        } else if (message === "BOX BLUR") {
            width = event.data.width;
            image_data = new Uint8Array(event.data.image); 
        } else if (message === "GAMMA") {
            width = event.data.width;
            image_data = new Uint8Array(event.data.image);
        }

        if (message === "INVERT") {
            console.log("inverting");
            image_data = invert_image(image_data, width);
            self.postMessage(
                {
                    message: "INVERTED",
                    image: image_data.buffer,
                    width: width,
                },
                [image_data.buffer]
            );
        } else if (message === "BOX BLUR") {
            console.log("box blurring");
            image_data = box_blur_image(image_data, width, event.data.kernel_size);
            self.postMessage(
                {
                    message: "BOX BLUR",
                    image: image_data.buffer,
                    width: width,
                },
                [image_data.buffer]
            );
        } else if (message === "GAMMA") {
            console.log("performing gamma transformation");
            image_data = gamma(image_data, width, event.data.gamma);
            self.postMessage(
                {
                    message: "GAMMA",
                    image: image_data.buffer,
                    width: width,
                },
                [image_data.buffer]
            )
        } else {
            console.log("Message was unrecognized");
            self.postMessage("Unrecognized message", []);
        }
    });
}

initialize();

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vZnJvbnRlbmQvanMvd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTs7QUFFQSxPQUFPLGtDQUFrQzs7QUFFekM7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSwwRDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUEsYSIsImZpbGUiOiJidW5kbGVfd29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9mcm9udGVuZC9qcy93b3JrZXIuanNcIik7XG4iLCJzZWxmLmltcG9ydFNjcmlwdHMoJy4uLy4uL3dhc20vcHJvYy5qcycpO1xyXG5cclxuY29uc3Qge2ludmVydCwgYm94X2JsdXIsIGdhbW1hX3RyYW5zZm9ybX0gPSB3YXNtX2JpbmRnZW47XHJcblxyXG5hc3luYyBmdW5jdGlvbiBpbml0aWFsaXplKCkge1xyXG4gICAgYXdhaXQgd2FzbV9iaW5kZ2VuKCcuLi8uLi93YXNtL3Byb2NfYmcud2FzbScpO1xyXG4gICAgXHJcbiAgICBzZWxmLnBvc3RNZXNzYWdlKHtcclxuICAgICAgICBtZXNzYWdlOiBcIndhc20gSU5JVElBTElaRURcIixcclxuICAgIH0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIGludmVydF9pbWFnZShpbWcsIHdpZHRoKSB7XHJcbiAgICAgICAgbGV0IGludmVydGVkX3Jhd19kYXRhID0gbmV3IFVpbnQ4Q2xhbXBlZEFycmF5KFxyXG4gICAgICAgICAgICBpbnZlcnQoaW1nLCB3aWR0aClcclxuICAgICAgICApO1xyXG4gICAgICAgIC8vIHJldHVybiBuZXcgSW1hZ2VEYXRhKGludmVydGVkX3Jhd19kYXRhLCB3aWR0aCk7XHJcbiAgICAgICAgcmV0dXJuIGludmVydGVkX3Jhd19kYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGJveF9ibHVyX2ltYWdlKGltZywgd2lkdGgsIGtlcm5lbF9zaXplKSB7XHJcblxyXG4gICAgICAgIGxldCBib3hfYmx1cl9yYXdfZGF0YSA9IG5ldyBVaW50OENsYW1wZWRBcnJheShcclxuICAgICAgICAgICAgYm94X2JsdXIoXHJcbiAgICAgICAgICAgICAgICBpbWcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aCxcclxuICAgICAgICAgICAgICAgIGtlcm5lbF9zaXplXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyByZXR1cm4gbmV3IEltYWdlRGF0YShib3hfYmx1cl9yYXdfZGF0YSwgaW1nLndpZHRoKVxyXG4gICAgICAgIHJldHVybiBib3hfYmx1cl9yYXdfZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnYW1tYShpbWcsIHdpZHRoLCBnYW1tYV92YWx1ZSkge1xyXG4gICAgICAgIGxldCBnYW1tYV90cmFuc2Zvcm1fcmF3X2RhdGEgPSBuZXcgVWludDhDbGFtcGVkQXJyYXkoXHJcbiAgICAgICAgICAgIGdhbW1hX3RyYW5zZm9ybShpbWcsIHdpZHRoLCBnYW1tYV92YWx1ZSlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gZ2FtbWFfdHJhbnNmb3JtX3Jhd19kYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGYuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGV2ZW50ID0+IHtcclxuICAgICAgICBsZXQgbWVzc2FnZSA9IGV2ZW50LmRhdGEubWVzc2FnZTtcclxuICAgICAgICBsZXQgaW1hZ2VfZGF0YSA9IG5ldyBVaW50OEFycmF5KCk7XHJcbiAgICAgICAgbGV0IHdpZHRoID0gMDtcclxuXHJcbiAgICAgICAgaWYgKG1lc3NhZ2UgPT09IFwiSU5WRVJUXCIpIHtcclxuICAgICAgICAgICAgd2lkdGggPSBldmVudC5kYXRhLndpZHRoO1xyXG4gICAgICAgICAgICBpbWFnZV9kYXRhID0gbmV3IFVpbnQ4QXJyYXkoZXZlbnQuZGF0YS5pbWFnZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChtZXNzYWdlID09PSBcIkJPWCBCTFVSXCIpIHtcclxuICAgICAgICAgICAgd2lkdGggPSBldmVudC5kYXRhLndpZHRoO1xyXG4gICAgICAgICAgICBpbWFnZV9kYXRhID0gbmV3IFVpbnQ4QXJyYXkoZXZlbnQuZGF0YS5pbWFnZSk7IFxyXG4gICAgICAgIH0gZWxzZSBpZiAobWVzc2FnZSA9PT0gXCJHQU1NQVwiKSB7XHJcbiAgICAgICAgICAgIHdpZHRoID0gZXZlbnQuZGF0YS53aWR0aDtcclxuICAgICAgICAgICAgaW1hZ2VfZGF0YSA9IG5ldyBVaW50OEFycmF5KGV2ZW50LmRhdGEuaW1hZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG1lc3NhZ2UgPT09IFwiSU5WRVJUXCIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpbnZlcnRpbmdcIik7XHJcbiAgICAgICAgICAgIGltYWdlX2RhdGEgPSBpbnZlcnRfaW1hZ2UoaW1hZ2VfZGF0YSwgd2lkdGgpO1xyXG4gICAgICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiSU5WRVJURURcIixcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZTogaW1hZ2VfZGF0YS5idWZmZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFtpbWFnZV9kYXRhLmJ1ZmZlcl1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UgPT09IFwiQk9YIEJMVVJcIikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImJveCBibHVycmluZ1wiKTtcclxuICAgICAgICAgICAgaW1hZ2VfZGF0YSA9IGJveF9ibHVyX2ltYWdlKGltYWdlX2RhdGEsIHdpZHRoLCBldmVudC5kYXRhLmtlcm5lbF9zaXplKTtcclxuICAgICAgICAgICAgc2VsZi5wb3N0TWVzc2FnZShcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkJPWCBCTFVSXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2U6IGltYWdlX2RhdGEuYnVmZmVyLFxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB3aWR0aCxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBbaW1hZ2VfZGF0YS5idWZmZXJdXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChtZXNzYWdlID09PSBcIkdBTU1BXCIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJwZXJmb3JtaW5nIGdhbW1hIHRyYW5zZm9ybWF0aW9uXCIpO1xyXG4gICAgICAgICAgICBpbWFnZV9kYXRhID0gZ2FtbWEoaW1hZ2VfZGF0YSwgd2lkdGgsIGV2ZW50LmRhdGEuZ2FtbWEpO1xyXG4gICAgICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiR0FNTUFcIixcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZTogaW1hZ2VfZGF0YS5idWZmZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFtpbWFnZV9kYXRhLmJ1ZmZlcl1cclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiTWVzc2FnZSB3YXMgdW5yZWNvZ25pemVkXCIpO1xyXG4gICAgICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKFwiVW5yZWNvZ25pemVkIG1lc3NhZ2VcIiwgW10pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG5pbml0aWFsaXplKCk7Il0sInNvdXJjZVJvb3QiOiIifQ==
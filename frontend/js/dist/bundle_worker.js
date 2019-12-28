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

// let user_image = new Uint8ClampedArray(0);
let user_image = null;

async function initialize() {
    await wasm_bindgen('../../wasm/proc_bg.wasm');
    
    self.postMessage({
        message: "wasm INITIALIZED",
    });

    function invert_image(img, width) {
        let inverted_raw_data = new Uint8ClampedArray(
            invert(img, width)
        );

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
        // let image_data = new Uint8Array();
        let image_data = null;
        let width = 0;

        if (message === "INVERT") {
            width = event.data.width;
        } else if (message === "INVERT BUTTON") {
            width = event.data.width;
            image_data = new Uint8Array(event.data.image);
        } else if (message === "BOX BLUR") {
            width = event.data.width;
        } else if (message === "GAMMA") {
            width = event.data.width;
        } else if (message === "USER IMAGE") {
            user_image = new Uint8ClampedArray(event.data.image);
        }

        if (message === "INVERT") {
            image_data = invert_image(user_image, width);
            self.postMessage(
                {
                    message: "INVERTED",
                    image: image_data.buffer,
                    width: width,
                },
                [image_data.buffer]
            );
        } 
        else if (message === "INVERT BUTTON") {
            image_data = invert_image(image_data, width);
            self.postMessage(
                {
                    message: "INVERTED",
                    image: image_data.buffer,
                    width: width,
                },
                [image_data.buffer]
            );
        }
        else if (message === "BOX BLUR") {
            image_data = box_blur_image(user_image, width, event.data.kernel_size);
            self.postMessage(
                {
                    message: "BOX BLUR",
                    image: image_data.buffer,
                    width: width,
                },
                [image_data.buffer]
            );
        } else if (message === "GAMMA") {
            image_data = gamma(user_image, width, event.data.gamma);
            self.postMessage(
                {
                    message: "GAMMA",
                    image: image_data.buffer,
                    width: width,
                },
                [image_data.buffer]
            );
        } else {
            self.postMessage("Unrecognized message", []);
        }
    });
}

initialize();

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vZnJvbnRlbmQvanMvd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTs7QUFFQSxPQUFPLGtDQUFrQzs7QUFFekM7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLFM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUEsYSIsImZpbGUiOiJidW5kbGVfd29ya2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9mcm9udGVuZC9qcy93b3JrZXIuanNcIik7XG4iLCJzZWxmLmltcG9ydFNjcmlwdHMoJy4uLy4uL3dhc20vcHJvYy5qcycpO1xyXG5cclxuY29uc3Qge2ludmVydCwgYm94X2JsdXIsIGdhbW1hX3RyYW5zZm9ybX0gPSB3YXNtX2JpbmRnZW47XHJcblxyXG4vLyBsZXQgdXNlcl9pbWFnZSA9IG5ldyBVaW50OENsYW1wZWRBcnJheSgwKTtcclxubGV0IHVzZXJfaW1hZ2UgPSBudWxsO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcclxuICAgIGF3YWl0IHdhc21fYmluZGdlbignLi4vLi4vd2FzbS9wcm9jX2JnLndhc20nKTtcclxuICAgIFxyXG4gICAgc2VsZi5wb3N0TWVzc2FnZSh7XHJcbiAgICAgICAgbWVzc2FnZTogXCJ3YXNtIElOSVRJQUxJWkVEXCIsXHJcbiAgICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiBpbnZlcnRfaW1hZ2UoaW1nLCB3aWR0aCkge1xyXG4gICAgICAgIGxldCBpbnZlcnRlZF9yYXdfZGF0YSA9IG5ldyBVaW50OENsYW1wZWRBcnJheShcclxuICAgICAgICAgICAgaW52ZXJ0KGltZywgd2lkdGgpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGludmVydGVkX3Jhd19kYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGJveF9ibHVyX2ltYWdlKGltZywgd2lkdGgsIGtlcm5lbF9zaXplKSB7XHJcblxyXG4gICAgICAgIGxldCBib3hfYmx1cl9yYXdfZGF0YSA9IG5ldyBVaW50OENsYW1wZWRBcnJheShcclxuICAgICAgICAgICAgYm94X2JsdXIoXHJcbiAgICAgICAgICAgICAgICBpbWcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aCxcclxuICAgICAgICAgICAgICAgIGtlcm5lbF9zaXplXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gYm94X2JsdXJfcmF3X2RhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2FtbWEoaW1nLCB3aWR0aCwgZ2FtbWFfdmFsdWUpIHtcclxuICAgICAgICBsZXQgZ2FtbWFfdHJhbnNmb3JtX3Jhd19kYXRhID0gbmV3IFVpbnQ4Q2xhbXBlZEFycmF5KFxyXG4gICAgICAgICAgICBnYW1tYV90cmFuc2Zvcm0oaW1nLCB3aWR0aCwgZ2FtbWFfdmFsdWUpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdhbW1hX3RyYW5zZm9ybV9yYXdfZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBldmVudCA9PiB7XHJcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBldmVudC5kYXRhLm1lc3NhZ2U7XHJcbiAgICAgICAgLy8gbGV0IGltYWdlX2RhdGEgPSBuZXcgVWludDhBcnJheSgpO1xyXG4gICAgICAgIGxldCBpbWFnZV9kYXRhID0gbnVsbDtcclxuICAgICAgICBsZXQgd2lkdGggPSAwO1xyXG5cclxuICAgICAgICBpZiAobWVzc2FnZSA9PT0gXCJJTlZFUlRcIikge1xyXG4gICAgICAgICAgICB3aWR0aCA9IGV2ZW50LmRhdGEud2lkdGg7XHJcbiAgICAgICAgfSBlbHNlIGlmIChtZXNzYWdlID09PSBcIklOVkVSVCBCVVRUT05cIikge1xyXG4gICAgICAgICAgICB3aWR0aCA9IGV2ZW50LmRhdGEud2lkdGg7XHJcbiAgICAgICAgICAgIGltYWdlX2RhdGEgPSBuZXcgVWludDhBcnJheShldmVudC5kYXRhLmltYWdlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UgPT09IFwiQk9YIEJMVVJcIikge1xyXG4gICAgICAgICAgICB3aWR0aCA9IGV2ZW50LmRhdGEud2lkdGg7XHJcbiAgICAgICAgfSBlbHNlIGlmIChtZXNzYWdlID09PSBcIkdBTU1BXCIpIHtcclxuICAgICAgICAgICAgd2lkdGggPSBldmVudC5kYXRhLndpZHRoO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobWVzc2FnZSA9PT0gXCJVU0VSIElNQUdFXCIpIHtcclxuICAgICAgICAgICAgdXNlcl9pbWFnZSA9IG5ldyBVaW50OENsYW1wZWRBcnJheShldmVudC5kYXRhLmltYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtZXNzYWdlID09PSBcIklOVkVSVFwiKSB7XHJcbiAgICAgICAgICAgIGltYWdlX2RhdGEgPSBpbnZlcnRfaW1hZ2UodXNlcl9pbWFnZSwgd2lkdGgpO1xyXG4gICAgICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiSU5WRVJURURcIixcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZTogaW1hZ2VfZGF0YS5idWZmZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFtpbWFnZV9kYXRhLmJ1ZmZlcl1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IFxyXG4gICAgICAgIGVsc2UgaWYgKG1lc3NhZ2UgPT09IFwiSU5WRVJUIEJVVFRPTlwiKSB7XHJcbiAgICAgICAgICAgIGltYWdlX2RhdGEgPSBpbnZlcnRfaW1hZ2UoaW1hZ2VfZGF0YSwgd2lkdGgpO1xyXG4gICAgICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiSU5WRVJURURcIixcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZTogaW1hZ2VfZGF0YS5idWZmZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFtpbWFnZV9kYXRhLmJ1ZmZlcl1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAobWVzc2FnZSA9PT0gXCJCT1ggQkxVUlwiKSB7XHJcbiAgICAgICAgICAgIGltYWdlX2RhdGEgPSBib3hfYmx1cl9pbWFnZSh1c2VyX2ltYWdlLCB3aWR0aCwgZXZlbnQuZGF0YS5rZXJuZWxfc2l6ZSk7XHJcbiAgICAgICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJCT1ggQkxVUlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlOiBpbWFnZV9kYXRhLmJ1ZmZlcixcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGgsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgW2ltYWdlX2RhdGEuYnVmZmVyXVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0gZWxzZSBpZiAobWVzc2FnZSA9PT0gXCJHQU1NQVwiKSB7XHJcbiAgICAgICAgICAgIGltYWdlX2RhdGEgPSBnYW1tYSh1c2VyX2ltYWdlLCB3aWR0aCwgZXZlbnQuZGF0YS5nYW1tYSk7XHJcbiAgICAgICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJHQU1NQVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlOiBpbWFnZV9kYXRhLmJ1ZmZlcixcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogd2lkdGgsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgW2ltYWdlX2RhdGEuYnVmZmVyXVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoXCJVbnJlY29nbml6ZWQgbWVzc2FnZVwiLCBbXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbmluaXRpYWxpemUoKTsiXSwic291cmNlUm9vdCI6IiJ9
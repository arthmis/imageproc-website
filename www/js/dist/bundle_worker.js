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

const {invert, box_blur, gamma_transform, sobel_edge_detection} = wasm_bindgen;

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

    function sobel(img, width, threshold) {
        let sobel_raw_data = new Uint8ClampedArray(
            sobel_edge_detection(img, width, threshold)
        );

        return sobel_raw_data
    }

    self.addEventListener('message', event => {
        let message = event.data.message;
        // let image_data = new Uint8Array();
        let image_data = null;
        let width = 0;

        if (message === "INVERT") {
            width = event.data.width;
        } 
        else if (message === "INVERT BUTTON") {
            width = event.data.width;
            image_data = new Uint8Array(event.data.image);
        } 
        else if (message === "BOX BLUR") {
            width = event.data.width;
        } 
        else if (message === "GAMMA") {
            width = event.data.width;
        } 
        else if(message === "SOBEL") {
            width = event.data.width;
        }
        else if(message === "USER IMAGE") {
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
        } 
        else if (message === "GAMMA") {
            image_data = gamma(user_image, width, event.data.gamma);
            self.postMessage(
                {
                    message: "GAMMA",
                    image: image_data.buffer,
                    width: width,
                },
                [image_data.buffer]
            );
        } 
        else if (message === "SOBEL") {
            image_data = sobel(user_image, width, event.data.threshold);
            self.postMessage(
                {
                    message: "SOBEL",
                    image: image_data.buffer,
                    width: width,
                },
                [image_data.buffer]
            );
        }
        else {
            self.postMessage("Unrecognized message", []);
        }
    });
}

initialize();

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vZnJvbnRlbmQvanMvd29ya2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTs7QUFFQSxPQUFPLHdEQUF3RDs7QUFFL0Q7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsUztBQUNBO0FBQ0E7QUFDQTtBQUNBLFM7QUFDQTtBQUNBO0FBQ0EsUztBQUNBO0FBQ0E7QUFDQSxTO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxTO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLFM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsUztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQSxhIiwiZmlsZSI6ImJ1bmRsZV93b3JrZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL2Zyb250ZW5kL2pzL3dvcmtlci5qc1wiKTtcbiIsInNlbGYuaW1wb3J0U2NyaXB0cygnLi4vLi4vd2FzbS9wcm9jLmpzJyk7XHJcblxyXG5jb25zdCB7aW52ZXJ0LCBib3hfYmx1ciwgZ2FtbWFfdHJhbnNmb3JtLCBzb2JlbF9lZGdlX2RldGVjdGlvbn0gPSB3YXNtX2JpbmRnZW47XHJcblxyXG4vLyBsZXQgdXNlcl9pbWFnZSA9IG5ldyBVaW50OENsYW1wZWRBcnJheSgwKTtcclxubGV0IHVzZXJfaW1hZ2UgPSBudWxsO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gaW5pdGlhbGl6ZSgpIHtcclxuICAgIGF3YWl0IHdhc21fYmluZGdlbignLi4vLi4vd2FzbS9wcm9jX2JnLndhc20nKTtcclxuICAgIFxyXG4gICAgc2VsZi5wb3N0TWVzc2FnZSh7XHJcbiAgICAgICAgbWVzc2FnZTogXCJ3YXNtIElOSVRJQUxJWkVEXCIsXHJcbiAgICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiBpbnZlcnRfaW1hZ2UoaW1nLCB3aWR0aCkge1xyXG4gICAgICAgIGxldCBpbnZlcnRlZF9yYXdfZGF0YSA9IG5ldyBVaW50OENsYW1wZWRBcnJheShcclxuICAgICAgICAgICAgaW52ZXJ0KGltZywgd2lkdGgpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGludmVydGVkX3Jhd19kYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGJveF9ibHVyX2ltYWdlKGltZywgd2lkdGgsIGtlcm5lbF9zaXplKSB7XHJcblxyXG4gICAgICAgIGxldCBib3hfYmx1cl9yYXdfZGF0YSA9IG5ldyBVaW50OENsYW1wZWRBcnJheShcclxuICAgICAgICAgICAgYm94X2JsdXIoXHJcbiAgICAgICAgICAgICAgICBpbWcsXHJcbiAgICAgICAgICAgICAgICB3aWR0aCxcclxuICAgICAgICAgICAgICAgIGtlcm5lbF9zaXplXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gYm94X2JsdXJfcmF3X2RhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2FtbWEoaW1nLCB3aWR0aCwgZ2FtbWFfdmFsdWUpIHtcclxuICAgICAgICBsZXQgZ2FtbWFfdHJhbnNmb3JtX3Jhd19kYXRhID0gbmV3IFVpbnQ4Q2xhbXBlZEFycmF5KFxyXG4gICAgICAgICAgICBnYW1tYV90cmFuc2Zvcm0oaW1nLCB3aWR0aCwgZ2FtbWFfdmFsdWUpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGdhbW1hX3RyYW5zZm9ybV9yYXdfZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzb2JlbChpbWcsIHdpZHRoLCB0aHJlc2hvbGQpIHtcclxuICAgICAgICBsZXQgc29iZWxfcmF3X2RhdGEgPSBuZXcgVWludDhDbGFtcGVkQXJyYXkoXHJcbiAgICAgICAgICAgIHNvYmVsX2VkZ2VfZGV0ZWN0aW9uKGltZywgd2lkdGgsIHRocmVzaG9sZClcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gc29iZWxfcmF3X2RhdGFcclxuICAgIH1cclxuXHJcbiAgICBzZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBldmVudCA9PiB7XHJcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSBldmVudC5kYXRhLm1lc3NhZ2U7XHJcbiAgICAgICAgLy8gbGV0IGltYWdlX2RhdGEgPSBuZXcgVWludDhBcnJheSgpO1xyXG4gICAgICAgIGxldCBpbWFnZV9kYXRhID0gbnVsbDtcclxuICAgICAgICBsZXQgd2lkdGggPSAwO1xyXG5cclxuICAgICAgICBpZiAobWVzc2FnZSA9PT0gXCJJTlZFUlRcIikge1xyXG4gICAgICAgICAgICB3aWR0aCA9IGV2ZW50LmRhdGEud2lkdGg7XHJcbiAgICAgICAgfSBcclxuICAgICAgICBlbHNlIGlmIChtZXNzYWdlID09PSBcIklOVkVSVCBCVVRUT05cIikge1xyXG4gICAgICAgICAgICB3aWR0aCA9IGV2ZW50LmRhdGEud2lkdGg7XHJcbiAgICAgICAgICAgIGltYWdlX2RhdGEgPSBuZXcgVWludDhBcnJheShldmVudC5kYXRhLmltYWdlKTtcclxuICAgICAgICB9IFxyXG4gICAgICAgIGVsc2UgaWYgKG1lc3NhZ2UgPT09IFwiQk9YIEJMVVJcIikge1xyXG4gICAgICAgICAgICB3aWR0aCA9IGV2ZW50LmRhdGEud2lkdGg7XHJcbiAgICAgICAgfSBcclxuICAgICAgICBlbHNlIGlmIChtZXNzYWdlID09PSBcIkdBTU1BXCIpIHtcclxuICAgICAgICAgICAgd2lkdGggPSBldmVudC5kYXRhLndpZHRoO1xyXG4gICAgICAgIH0gXHJcbiAgICAgICAgZWxzZSBpZihtZXNzYWdlID09PSBcIlNPQkVMXCIpIHtcclxuICAgICAgICAgICAgd2lkdGggPSBldmVudC5kYXRhLndpZHRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKG1lc3NhZ2UgPT09IFwiVVNFUiBJTUFHRVwiKSB7XHJcbiAgICAgICAgICAgIHVzZXJfaW1hZ2UgPSBuZXcgVWludDhDbGFtcGVkQXJyYXkoZXZlbnQuZGF0YS5pbWFnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobWVzc2FnZSA9PT0gXCJJTlZFUlRcIikge1xyXG4gICAgICAgICAgICBpbWFnZV9kYXRhID0gaW52ZXJ0X2ltYWdlKHVzZXJfaW1hZ2UsIHdpZHRoKTtcclxuICAgICAgICAgICAgc2VsZi5wb3N0TWVzc2FnZShcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIklOVkVSVEVEXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2U6IGltYWdlX2RhdGEuYnVmZmVyLFxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB3aWR0aCxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBbaW1hZ2VfZGF0YS5idWZmZXJdXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfSBcclxuICAgICAgICBlbHNlIGlmIChtZXNzYWdlID09PSBcIklOVkVSVCBCVVRUT05cIikge1xyXG4gICAgICAgICAgICBpbWFnZV9kYXRhID0gaW52ZXJ0X2ltYWdlKGltYWdlX2RhdGEsIHdpZHRoKTtcclxuICAgICAgICAgICAgc2VsZi5wb3N0TWVzc2FnZShcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIklOVkVSVEVEXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2U6IGltYWdlX2RhdGEuYnVmZmVyLFxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB3aWR0aCxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBbaW1hZ2VfZGF0YS5idWZmZXJdXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG1lc3NhZ2UgPT09IFwiQk9YIEJMVVJcIikge1xyXG4gICAgICAgICAgICBpbWFnZV9kYXRhID0gYm94X2JsdXJfaW1hZ2UodXNlcl9pbWFnZSwgd2lkdGgsIGV2ZW50LmRhdGEua2VybmVsX3NpemUpO1xyXG4gICAgICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiQk9YIEJMVVJcIixcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZTogaW1hZ2VfZGF0YS5idWZmZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFtpbWFnZV9kYXRhLmJ1ZmZlcl1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IFxyXG4gICAgICAgIGVsc2UgaWYgKG1lc3NhZ2UgPT09IFwiR0FNTUFcIikge1xyXG4gICAgICAgICAgICBpbWFnZV9kYXRhID0gZ2FtbWEodXNlcl9pbWFnZSwgd2lkdGgsIGV2ZW50LmRhdGEuZ2FtbWEpO1xyXG4gICAgICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiR0FNTUFcIixcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZTogaW1hZ2VfZGF0YS5idWZmZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHdpZHRoLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFtpbWFnZV9kYXRhLmJ1ZmZlcl1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9IFxyXG4gICAgICAgIGVsc2UgaWYgKG1lc3NhZ2UgPT09IFwiU09CRUxcIikge1xyXG4gICAgICAgICAgICBpbWFnZV9kYXRhID0gc29iZWwodXNlcl9pbWFnZSwgd2lkdGgsIGV2ZW50LmRhdGEudGhyZXNob2xkKTtcclxuICAgICAgICAgICAgc2VsZi5wb3N0TWVzc2FnZShcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlNPQkVMXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2U6IGltYWdlX2RhdGEuYnVmZmVyLFxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB3aWR0aCxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBbaW1hZ2VfZGF0YS5idWZmZXJdXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKFwiVW5yZWNvZ25pemVkIG1lc3NhZ2VcIiwgW10pO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG5pbml0aWFsaXplKCk7Il0sInNvdXJjZVJvb3QiOiIifQ==
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./frontend/js/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./frontend/js/draw_canvases.js":
/*!**************************************!*\
  !*** ./frontend/js/draw_canvases.js ***!
  \**************************************/
/*! exports provided: DrawCanvases */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DrawCanvases\", function() { return DrawCanvases; });\n// import { resize_img } from \"../wasm/proc.js\";\r\nclass DrawCanvases {\r\n    constructor(input_canvas) {\r\n        this.processed_image_canvas = input_canvas;\r\n        this.processed_image_ctx = input_canvas.getContext(\"2d\");\r\n    }\r\n\r\n    // displays image when uploading a new image\r\n    display_image(html_img) {\r\n        // this sequence scales the image up or down to fit into canvas element\r\n        // consider scaling to a percentage of the canvas\r\n        const [resized_width, resized_height] =\r\n            this.scale_img_dimensions_to_canvas(html_img, this.processed_image_canvas);\r\n\r\n        // resize the canvas to fit into canvas element size\r\n        this.processed_image_canvas.width = this.processed_image_canvas.offsetWidth;\r\n        this.processed_image_canvas.height = this.processed_image_canvas.offsetHeight;\r\n\r\n        // these two variables center the image within the canvas\r\n        const center_x = (this.processed_image_canvas.width - resized_width) / 2;\r\n        const center_y = (this.processed_image_canvas.height - resized_height) / 2;\r\n\r\n        this.processed_image_ctx.drawImage(\r\n            html_img,\r\n            center_x,\r\n            center_y,\r\n            resized_width,\r\n            resized_height,\r\n        );\r\n\r\n    }\r\n\r\n    scale_img_dimensions_to_canvas(img, canvas) {\r\n\r\n        let scale = 0;\r\n        let new_height = img.height;\r\n        let new_width = img.width;\r\n\r\n        const width_scale = canvas.offsetWidth / img.width;\r\n        const height_scale = canvas.offsetHeight / img.height;\r\n\r\n        if (width_scale < height_scale) {\r\n            scale = width_scale;\r\n        } else {\r\n            scale = height_scale;\r\n        }\r\n\r\n        if (canvas.offsetWidth < img.width || canvas.offsetHeight < img.height) {\r\n            new_width = Math.round(img.width * scale);\r\n            new_height = Math.round(img.height * scale);\r\n        }\r\n\r\n        return [new_width, new_height];\r\n    }\r\n\r\n\r\n    put_image(img) {\r\n        // resize canvases to fit their new offset width and height\r\n        this.resize_canvases();\r\n\r\n        // find new origin to center image on canvas\r\n        let center_x = (this.processed_image_canvas.width - img.width) / 2;\r\n        let center_y = (this.processed_image_canvas.height - img.height) / 2;\r\n\r\n        // let original_data = new ImageData(resized_img, resized_img_width);\r\n\r\n        this.processed_image_ctx.putImageData(\r\n            img,\r\n            center_x,\r\n            center_y,\r\n            0,\r\n            0,\r\n            img.width,\r\n            img.height,\r\n        );\r\n    }\r\n\r\n    // draw image when showing processed output or the original image\r\n    draw_image(image_canvas) {\r\n\r\n        // resize the canvas to fit into canvas element size\r\n        this.processed_image_canvas.width = this.processed_image_canvas.offsetWidth;\r\n        this.processed_image_canvas.height = this.processed_image_canvas.offsetHeight;\r\n\r\n        const [resized_width, resized_height] =\r\n            this.scale_img_dimensions_to_canvas(\r\n                image_canvas,\r\n                this.processed_image_canvas\r\n            );\r\n\r\n        // these two variables center the image within the canvas\r\n        const center_x = (this.processed_image_canvas.width - resized_width) / 2;\r\n        const center_y = (this.processed_image_canvas.height - resized_height) / 2;\r\n\r\n        this.processed_image_ctx.drawImage(\r\n            image_canvas,\r\n            center_x,\r\n            center_y,\r\n            resized_width,\r\n            resized_height,\r\n        );\r\n    }\r\n\r\n    resize_canvases() {\r\n        this.processed_image_canvas.width = this.processed_image_canvas.offsetWidth;\r\n        this.processed_image_canvas.height = this.processed_image_canvas.offsetHeight;\r\n    }\r\n\r\n    display_only_processed_image() {\r\n        this.processed_image_canvas.classList.remove(\"active-canvases\");\r\n        this.processed_image_canvas.classList.add(\"one-active-canvas\");\r\n    }\r\n\r\n    display_original_image_canvas() {\r\n        this.processed_image_canvas.classList.add(\"active-canvases\");\r\n        this.processed_image_canvas.classList.remove(\"one-active-canvas\");\r\n    }\r\n}\n\n//# sourceURL=webpack:///./frontend/js/draw_canvases.js?");

/***/ }),

/***/ "./frontend/js/main.js":
/*!*****************************!*\
  !*** ./frontend/js/main.js ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _draw_canvases_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./draw_canvases.js */ \"./frontend/js/draw_canvases.js\");\n/* harmony import */ var _raw_image_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./raw_image.js */ \"./frontend/js/raw_image.js\");\n\r\n\r\n\r\nconst debounce = (func, delay) => {\r\n    let in_debounce;\r\n    return function () {\r\n        const context = this;\r\n        const args = arguments;\r\n        clearTimeout(in_debounce);\r\n        in_debounce = setTimeout(() => func.apply(context, args), delay);\r\n    }\r\n}\r\n\r\n// const throttle = (func, limit) => {\r\n//     let lastFunc;\r\n//     let lastRan;\r\n//     return function () {\r\n//         const context = this;\r\n//         const args = arguments;\r\n//         if (!lastRan) {\r\n//             func.apply(context, args);\r\n//             lastRan = Date.now();\r\n//         } else {\r\n//             clearTimeout(lastFunc);\r\n//             lastFunc = setTimeout(function () {\r\n//                 if ((Date.now() - lastRan) >= limit) {\r\n//                     func.apply(context, args);\r\n//                     lastRan = Date.now();\r\n//                 }\r\n//             }, limit - (Date.now() - lastRan));\r\n//         }\r\n//     }\r\n// }\r\n\r\nfunction main() {\r\n    let image_worker = new Worker(\"./js/dist/bundle_worker.js\");\r\n    image_worker.onmessage = event => {\r\n        if (event.data.message === \"wasm INITIALIZED\") {\r\n            console.log(`${event.data.message}`);\r\n        }\r\n        else if (event.data.message === \"INVERTED\") {\r\n            // console.log(`${event.data.message}`);\r\n            let image = new ImageData(\r\n                new Uint8ClampedArray(event.data.image), event.data.width\r\n            );\r\n            raw_images.set_output_image(\r\n                image\r\n            );\r\n            draw_canvases.draw_image(raw_images.output_img_canvas());\r\n        }\r\n        else if (event.data.message === \"BOX BLUR\") {\r\n            // console.log(`${event.data.message}`);\r\n            let image = new ImageData(\r\n                new Uint8ClampedArray(event.data.image), event.data.width\r\n            );\r\n            raw_images.set_output_image(image);\r\n            draw_canvases.draw_image(raw_images.output_img_canvas());\r\n        }\r\n        else if (event.data.message === \"GAMMA\") {\r\n            // console.log(`${event.data.message}`);\r\n            let image = new ImageData(\r\n                new Uint8ClampedArray(event.data.image), event.data.width\r\n            );\r\n            raw_images.set_output_image(image);\r\n            draw_canvases.draw_image(raw_images.output_img_canvas());\r\n        }\r\n        else if (event.data.message === \"SOBEL\") {\r\n\r\n            let image = new ImageData(\r\n                new Uint8ClampedArray(event.data.image), event.data.width\r\n            );\r\n            raw_images.set_output_image(image);\r\n            draw_canvases.draw_image(raw_images.output_img_canvas());\r\n        }\r\n        else {\r\n            // console.log(`unrecognized message from web worker: ${event.data.message}`);\r\n        }\r\n    };\r\n\r\n\r\n    const draw_canvases = new _draw_canvases_js__WEBPACK_IMPORTED_MODULE_0__[\"DrawCanvases\"](\r\n        document.getElementById(\"input-canvas\")\r\n    );\r\n\r\n    let raw_images = null;\r\n\r\n    let original_img = new Image();\r\n\r\n    // takes the image url and displays it on both canvas\r\n    function import_and_display(image_url) {\r\n        original_img.addEventListener('load', function () {\r\n            draw_canvases.display_image(original_img);\r\n\r\n            raw_images = new _raw_image_js__WEBPACK_IMPORTED_MODULE_1__[\"RawImage\"](\r\n                original_img,\r\n                draw_canvases.processed_image_canvas,\r\n            );\r\n            image_worker.postMessage(\r\n                {\r\n                    message: \"USER IMAGE\",\r\n                    image: raw_images.preview_img().data.buffer,\r\n                    width: raw_images.preview_img().width,\r\n                },\r\n                [raw_images.original_img().data.buffer]\r\n            );\r\n\r\n        });\r\n        original_img.src = window.URL.createObjectURL(image_url);\r\n    }\r\n\r\n    // handles getting a new image\r\n    // have to add checks that only get jpg and png images\r\n    let file_input = document.getElementById(\"file-input\");\r\n    file_input.addEventListener(\"change\", () => {\r\n        let image = file_input.files[0];\r\n        import_and_display(image);\r\n\r\n        file_input.value = null;\r\n        large_upload_button.style.display = \"none\";\r\n        // deselects any active option and hides any sliders\r\n        // that were in effect if user is selecting a new image\r\n        // this will need some more working if I decide to\r\n        // make active_input and active_option null capable\r\n        // variables\r\n        if (active_option !== null) {\r\n            active_option.classList.remove(\"select-option\");\r\n            active_option = null;\r\n        }\r\n\r\n        if (active_input !== null) {\r\n            active_input.style.display = \"none\";\r\n        }\r\n\r\n        // might need to check if algorithim-info is still displaying something\r\n        // even if it's not null\r\n        if (active_info !== null) {\r\n            active_info.style.display = \"none\";\r\n        }\r\n        // will have to make sure this displays the new image without \r\n        // any weird bugs \r\n        draw_canvases.display_only_processed_image();\r\n    });\r\n\r\n    let large_upload_button = document.getElementById(\"large-upload-button\");\r\n    large_upload_button.addEventListener(\"click\", () => {\r\n        if (window.matchMedia(\"(max-width: 768px)\")) {\r\n            if (sidebar.classList.contains(\"mobile-visible\")) {\r\n                sidebar.classList.remove(\"mobile-visible\");\r\n                sidebar.classList.add(\"mobile-hidden\");\r\n            }\r\n        }\r\n        file_input.click();\r\n    });\r\n\r\n    // this button activates the file input event\r\n    let upload_image = document.getElementById(\"upload-image\");\r\n    upload_image.addEventListener(\"click\", () => {\r\n        file_input.click();\r\n    });\r\n\r\n    // takes original image and resizes it \r\n    // currently doesn't reapply edit made by current processing algorithm\r\n    window.addEventListener('resize', () => {\r\n        if (raw_images !== null) {\r\n            // uses original image to resize to the new output canvas \r\n            // dimensions\r\n            const [resized_img_width, resized_img_height] =\r\n                scale_img_dimensions_to_canvas(\r\n                    raw_images.original_img(),\r\n                    draw_canvases.processed_image_canvas\r\n                );\r\n\r\n            draw_canvases.resize_canvases();\r\n\r\n            draw_canvases.resized_width = resized_img_width;\r\n            draw_canvases.resized_height = resized_img_height;\r\n\r\n            draw_canvases.draw_image(\r\n                raw_images.output_img_canvas(),\r\n            );\r\n        }\r\n    });\r\n\r\n    let invert_option = document.getElementById(\"invert-option\");\r\n    let blur_option = document.getElementById(\"box-blur-option\");\r\n    let gamma_option = document.getElementById(\"gamma-option\");\r\n    let sobel_option = document.getElementById(\"sobel-option\");\r\n    let active_option = null;\r\n\r\n    let processing_options = document.getElementById(\"processing-options\");\r\n\r\n    let active_input = null;\r\n\r\n    let invert_info = document.getElementById(\"invert-info\");\r\n    let box_blur_info = document.getElementById(\"box-blur-info\");\r\n    let gamma_info = document.getElementById(\"gamma-info\");\r\n    let sobel_info = document.getElementById(\"sobel-info\");\r\n    // let active_info = document.createElement(\"p\");\r\n    let active_info = null;\r\n\r\n    function change_active_option(algorithm_option, algorithm_input, algorithm_info) {\r\n\r\n        if (active_info === null) {\r\n            active_info = algorithm_info;\r\n            active_info.style.display = \"\";\r\n        } \r\n        else {\r\n            active_info.style.display = \"none\";\r\n            active_info = algorithm_info;\r\n            active_info.style.display = \"\";\r\n        }\r\n\r\n        if (active_input === null) {\r\n            processing_options.style.display = \"\";\r\n            active_input = algorithm_input;\r\n            active_input.style.display = \"\";\r\n        } \r\n        else {\r\n            active_input.style.display = \"none\";\r\n            active_input = algorithm_input;\r\n            active_input.style.display = \"\";\r\n            processing_options.style.display = \"\";\r\n        }\r\n\r\n        if (active_option === null) {\r\n            active_option = algorithm_option;\r\n            active_option.classList.add(\"select-option\");\r\n        } \r\n        else {\r\n            active_option.classList.remove(\"select-option\");\r\n            active_option = algorithm_option;\r\n            active_option.classList.add(\"select-option\");\r\n        }\r\n    }\r\n    function deactivate_option(algorithm_option) {\r\n        algorithm_option.classList.remove(\"select-option\");\r\n        active_input.style.display = \"none\";\r\n\r\n        active_info.style.display = \"none\";\r\n\r\n        active_option = null;\r\n        active_input = null;\r\n        active_info = null;\r\n        processing_options.style.display = \"none\";\r\n\r\n        toggle_algorithms_sidebar();\r\n\r\n        raw_images.set_output_image_to_original();\r\n        draw_canvases.draw_image(raw_images.original_img_canvas());\r\n        \r\n    }\r\n    let options = document.getElementById(\"options\");\r\n    // these events should check if they are the active option and if clicked again\r\n    // they should deactivate and present the original image\r\n    options.addEventListener(\"click\", debounce((event) => {\r\n        if (active_option !== null) {\r\n            active_option.classList.remove(\"select-option\");\r\n        }\r\n\r\n        if (event.target.matches(\"#invert-option\")) {\r\n            if (raw_images === null) {\r\n                alert(\"Upload an image to use these algorithms\");\r\n                return;\r\n            }\r\n\r\n            if (active_option === invert_option) {\r\n                deactivate_option(invert_option);\r\n            } else {\r\n                change_active_option(invert_option, invert_button, invert_info);\r\n\r\n                toggle_algorithms_sidebar();\r\n\r\n                image_worker.postMessage(\r\n                    {\r\n                        message: \"INVERT\",\r\n                        width: raw_images.preview_img().width,\r\n                    },\r\n                );\r\n\r\n            }\r\n\r\n        }\r\n        if (event.target.matches(\"#box-blur-option\")) {\r\n            if (raw_images === null) {\r\n                alert(\"Upload an image to use these algorithms\");\r\n                return;\r\n            }\r\n\r\n            if (active_option === blur_option) {\r\n                deactivate_option(blur_option);\r\n            } else {\r\n                change_active_option(blur_option, box_blur_slider_wrapper, box_blur_info);\r\n\r\n                toggle_algorithms_sidebar();\r\n\r\n                // puts the box blur slider at 1 because the default position is in the middle\r\n                box_blur_slider.value = 1;\r\n                box_blur_value_elem.value = box_blur_slider.value;\r\n\r\n                let kernel_size = box_blur_slider.valueAsNumber;\r\n\r\n                image_worker.postMessage(\r\n                    {\r\n                        message: \"BOX BLUR\",\r\n                        width: raw_images.preview_img().width,\r\n                        kernel_size: kernel_size,\r\n                    },\r\n                );\r\n            }\r\n        }\r\n        if (event.target.matches(\"#gamma-option\")) {\r\n            if (raw_images === null) {\r\n                alert(\"Upload an image to use these algorithms\");\r\n                return;\r\n            }\r\n            if (active_option === gamma_option) {\r\n                deactivate_option(gamma_option);\r\n            } else {\r\n                change_active_option(gamma_option, gamma_slider_wrapper, gamma_info);\r\n\r\n                toggle_algorithms_sidebar();\r\n\r\n                // puts the gamma slider at 1 because this keeps the image unchanged \r\n                gamma_slider.value = 1;\r\n                gamma_value_elem.value = 1;\r\n\r\n                image_worker.postMessage(\r\n                    {\r\n                        message: \"GAMMA\",\r\n                        width: raw_images.preview_img().width,\r\n                        gamma: gamma_slider.valueAsNumber,\r\n                    },\r\n                );\r\n            }\r\n        }\r\n        if (event.target.matches(\"#sobel-option\")) {\r\n            if (raw_images === null) {\r\n                alert(\"Upload an image to use these algorithms\");\r\n                return;\r\n            }\r\n            if (active_option === sobel_option) {\r\n                deactivate_option(sobel_option);\r\n            } else {\r\n                change_active_option(sobel_option, sobel_slider_wrapper, sobel_info);\r\n\r\n                toggle_algorithms_sidebar();\r\n\r\n                // starts sobel detector at halfway for threshold\r\n                sobel_slider.value = 123;\r\n                sobel_threshold.value = 123;\r\n\r\n                image_worker.postMessage(\r\n                    {\r\n                        message: \"SOBEL\",\r\n                        width: raw_images.preview_img().width,\r\n                        threshold: sobel_slider.valueAsNumber,\r\n                    },\r\n                );\r\n            }\r\n        }\r\n\r\n    }), 33);\r\n\r\n    let invert_button = document.getElementById(\"invert-button\");\r\n    invert_button.addEventListener(\"click\", debounce(() => {\r\n        image_worker.postMessage(\r\n            {\r\n                message: \"INVERT BUTTON\",\r\n                image: raw_images.output_img().data.buffer,\r\n                width: raw_images.output_img().width,\r\n            },\r\n            [raw_images.output_img().data.buffer]\r\n        );\r\n    }), 33);\r\n\r\n    let gamma_slider_wrapper = document.getElementById(\"gamma-slider-wrapper\");\r\n    let gamma_slider = document.getElementById(\"gamma-slider\");\r\n    let gamma_value_elem = document.getElementById(\"gamma-value\");\r\n    let gamma_slider_func = (event) => {\r\n        let gamma = event.target.valueAsNumber;\r\n        gamma_value_elem.value = gamma;\r\n\r\n        // does a gamma transformation on full size image preview \r\n        image_worker.postMessage(\r\n            {\r\n                message: \"GAMMA\",\r\n                width: raw_images.preview_img().width,\r\n                gamma: gamma,\r\n            },\r\n        );\r\n\r\n    }\r\n    gamma_slider.addEventListener(\"input\", debounce(gamma_slider_func, 100));\r\n\r\n    let box_blur_slider_wrapper = document.getElementById(\"box-blur-slider-wrapper\");\r\n    let box_blur_slider = document.getElementById(\"box-blur-slider\");\r\n    let box_blur_value_elem = document.getElementById(\"box-blur-value\");\r\n    let box_slider_func = (event) => {\r\n        let kernel_size = event.target.valueAsNumber;\r\n        box_blur_value_elem.value = kernel_size;\r\n\r\n        // box blurs full size image preview \r\n        image_worker.postMessage(\r\n            {\r\n                message: \"BOX BLUR\",\r\n                width: raw_images.preview_img().width,\r\n                kernel_size: kernel_size,\r\n            },\r\n        );\r\n    }\r\n\r\n    box_blur_slider.addEventListener(\"input\", debounce(box_slider_func, 100));\r\n    // box_blur_slider.addEventListener(\"change\", box_slider_func);\r\n\r\n    const sobel_slider_wrapper = document.getElementById(\"sobel-slider-wrapper\");\r\n    const sobel_slider = document.getElementById(\"sobel-slider\"); \r\n    let sobel_threshold = document.getElementById(\"sobel-threshold\");\r\n    function sobel_edge_detector(event) {\r\n        let threshold = event.target.valueAsNumber;\r\n        sobel_threshold.value = threshold;\r\n        image_worker.postMessage(\r\n            {\r\n                message: \"SOBEL\",\r\n                width: raw_images.preview_img().width,\r\n                threshold: threshold,\r\n            },\r\n        );\r\n    }\r\n    sobel_slider.addEventListener(\"input\", debounce(sobel_edge_detector, 100)); \r\n\r\n    function scale_img_dimensions_to_canvas(img, canvas) {\r\n\r\n        let scale = 0;\r\n        let new_height = img.height;\r\n        let new_width = img.width;\r\n\r\n        const width_scale = canvas.offsetWidth / img.width;\r\n        const height_scale = canvas.offsetHeight / img.height;\r\n\r\n        if (width_scale < height_scale) {\r\n            scale = width_scale;\r\n        } else {\r\n            scale = height_scale;\r\n        }\r\n\r\n        if (canvas.offsetWidth < img.width || canvas.offsetHeight < img.height) {\r\n            new_width = Math.round(img.width * scale);\r\n            new_height = Math.round(img.height * scale);\r\n        }\r\n\r\n        return [new_width, new_height];\r\n    }\r\n    \r\n    let sidebar = document.getElementById(\"sidebar\");\r\n    let algorithms_button = document.getElementById(\"open-algorithms\");\r\n    let algorithms_arrow = document.getElementById(\"open-algorithms-arrow\");\r\n    algorithms_button.addEventListener(\"click\", () => {\r\n        toggle_algorithms_sidebar();\r\n    });\r\n\r\n    function close_sidebar(event) {\r\n        if (\r\n            !event.target.matches(\"#sidebar\") && \r\n            !event.target.matches(\"#open-algorithms\") && \r\n            !event.target.matches(\"#sidebar *\")\r\n        ) {\r\n            toggle_algorithms_sidebar();\r\n        }\r\n    }\r\n    function toggle_algorithms_sidebar() {\r\n        if (window.matchMedia(\"(max-width: 768px)\").matches) {\r\n            if (sidebar.classList.contains(\"slideopen\")) {\r\n                sidebar.classList.remove(\"slideopen\", \"mobile-visible\");\r\n                sidebar.classList.add(\"slideclose\", \"mobile-hidden\");\r\n                algorithms_arrow.classList.remove(\"fa-angle-down\");\r\n                algorithms_arrow.classList.add(\"fa-angle-right\");\r\n                window.removeEventListener(\"click\", close_sidebar);\r\n            }\r\n            else if (sidebar.classList.contains(\"slideclose\") || sidebar.classList.contains(\"mobile-hidden\")) {\r\n                sidebar.classList.remove(\"slideclose\", \"mobile-hidden\"); \r\n                sidebar.classList.add(\"slideopen\", \"mobile-visible\");\r\n                algorithms_arrow.classList.remove(\"fa-angle-right\");\r\n                algorithms_arrow.classList.add(\"fa-angle-down\");\r\n                window.addEventListener(\"click\", close_sidebar);\r\n            }\r\n        }\r\n    }\r\n}\r\n\r\nmain();\r\n\n\n//# sourceURL=webpack:///./frontend/js/main.js?");

/***/ }),

/***/ "./frontend/js/raw_image.js":
/*!**********************************!*\
  !*** ./frontend/js/raw_image.js ***!
  \**********************************/
/*! exports provided: RawImage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RawImage\", function() { return RawImage; });\n// import { resize_img } from \"../wasm/proc.js\";\r\n\r\nconst max_dimension = 1500;\r\n\r\nclass RawImage {\r\n    constructor(original_img, canvas) {\r\n        this.output_image = document.createElement('canvas');\r\n        this.original_image = document.createElement('canvas');\r\n        this.preview_image = document.createElement('canvas');\r\n\r\n        this.preview_image_ctx = this.preview_image.getContext(\"2d\");\r\n        this.output_image_ctx = this.output_image.getContext(\"2d\");\r\n        this.original_image_ctx = this.original_image.getContext(\"2d\");\r\n\r\n        // this part gets the raw image data by using an off screen canvas\r\n        // resizes the canvas to image dimensions so that image isn't clipped\r\n        // when calling getImageData()\r\n        this.output_image.width = original_img.width;\r\n        this.output_image.height = original_img.height;\r\n\r\n        this.original_image.width = original_img.width;\r\n        this.original_image.height = original_img.height;\r\n\r\n        this.output_image_ctx.drawImage(original_img, 0, 0);\r\n        this.original_image_ctx.drawImage(original_img, 0, 0);\r\n        this.preview_image.offsetHeight\r\n        let [preview_width, preview_height] = \r\n            resize_preview_image(\r\n                original_img, \r\n                max_dimension\r\n            );\r\n        this.preview_image.width = preview_width;\r\n        this.preview_image.height = preview_height;\r\n        this.output_image.width = preview_width;\r\n        this.output_image.height = preview_height;\r\n\r\n        this.preview_image_ctx.drawImage(original_img, 0, 0, preview_width, preview_height);\r\n        this.output_image_ctx.drawImage(original_img, 0, 0, preview_width, preview_height);\r\n\r\n        // this.output_image = output_img_ctx.getImageData(\r\n        //     0, \r\n        //     0, \r\n        //     output_img.width, \r\n        //     output_img.height\r\n        // );\r\n        // this.original_image = img_ctx.getImageData(\r\n        //     0, \r\n        //     0, \r\n        //     img.width, \r\n        //     img.height\r\n        // );\r\n\r\n        // const [resized_img_width, resized_img_height] = \r\n        //     this.scale_img_dimensions_to_canvas(img, canvas);\r\n        // // this image will be the one that gets processed so there isn't a need\r\n        // // to constantly resize the original image on every processing function\r\n        // const output_image_resized_raw = new Uint8ClampedArray(\r\n        //     resize_img(\r\n        //         this.output_image.data, \r\n        //         this.output_image.width, \r\n        //         resized_img_width, \r\n        //         resized_img_height\r\n        //     )\r\n        // );\r\n        // this.output_image_resized = new ImageData(\r\n        //     output_image_resized_raw, \r\n        //     resized_img_width\r\n        // );\r\n        // make this more performant\r\n        // let luma_img_data = change_to_grayscale(original_img_data);\r\n        // let output_luma_data = change_to_grayscale(output_img_data);\r\n\r\n        // put_image_data_canvas(luma_img_data, input_ctx);\r\n\r\n        // original_img_data = luma_img_data;\r\n        // output_img_data = output_luma_data;\r\n    }\r\n\r\n    original_img() {\r\n        return this.original_image_ctx.getImageData(\r\n            0,\r\n            0,\r\n            this.original_image.width,\r\n            this.original_image.height,\r\n        );\r\n    }\r\n    original_img_canvas() {\r\n        return this.original_image;\r\n    }\r\n\r\n    output_img_canvas() {\r\n        return this.output_image;\r\n    }\r\n    output_img() {\r\n        return this.output_image_ctx.getImageData(\r\n            0,\r\n            0,\r\n            this.output_image.width,\r\n            this.output_image.height,\r\n        );\r\n    }\r\n\r\n    preview_img_canvas() {\r\n        return this.preview_image;\r\n    }\r\n    preview_img() {\r\n        return this.preview_image_ctx.getImageData(\r\n            0,\r\n            0, \r\n            this.preview_image.width,\r\n            this.preview_image.height,\r\n        );\r\n    }\r\n\r\n    set_output_image(image) {\r\n        this.output_image_ctx.putImageData(image, 0, 0);\r\n    }\r\n\r\n    set_output_image_to_original() {\r\n        this.set_output_image(this.original_img());\r\n    }\r\n\r\n    // set_original_image(image) {\r\n    //     this.original_image = image;\r\n    // }\r\n\r\n    // scale_img_dimensions_to_canvas(img, canvas) {\r\n\r\n    //     let scale = 0;\r\n    //     let new_height = img.height;\r\n    //     let new_width = img.width;\r\n\r\n    //     const width_scale = canvas.offsetWidth / img.width;\r\n    //     const height_scale = canvas.offsetHeight / img.height;\r\n\r\n    //     if (width_scale < height_scale) {\r\n    //         scale = width_scale;\r\n    //     } else {\r\n    //         scale = height_scale;\r\n    //     }\r\n\r\n    //     if (canvas.offsetWidth < img.width || canvas.offsetHeight < img.height) {\r\n    //         new_width = Math.round(img.width * scale);\r\n    //         new_height = Math.round(img.height * scale);\r\n    //     }\r\n\r\n    //     return [new_width, new_height];\r\n    // }\r\n}\r\n\r\nfunction resize_preview_image(img, max_long_edge) {\r\n    let scale = 0;\r\n    let new_height = img.height;\r\n    let new_width = img.width;\r\n\r\n    const width_scale = max_long_edge / img.width;\r\n    const height_scale = max_long_edge / img.height;\r\n\r\n    if (width_scale < height_scale) {\r\n        scale = width_scale;\r\n    } else {\r\n        scale = height_scale;\r\n    }\r\n\r\n    if (max_long_edge < img.width || max_long_edge < img.height) {\r\n        new_width = Math.round(img.width * scale);\r\n        new_height = Math.round(img.height * scale);\r\n    }\r\n\r\n    return [new_width, new_height];\r\n}\n\n//# sourceURL=webpack:///./frontend/js/raw_image.js?");

/***/ })

/******/ });
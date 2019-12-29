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
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DrawCanvases", function() { return DrawCanvases; });
// import { resize_img } from "../wasm/proc.js";
class DrawCanvases {
    constructor(input_canvas) {
        this.processed_image_canvas = input_canvas;
        this.processed_image_ctx = input_canvas.getContext("2d");
    }

    // displays image when uploading a new image
    display_image(html_img) {
        // this sequence scales the image up or down to fit into canvas element
        // consider scaling to a percentage of the canvas
        const [resized_width, resized_height] =
            this.scale_img_dimensions_to_canvas(html_img, this.processed_image_canvas);

        // resize the canvas to fit into canvas element size
        this.processed_image_canvas.width = this.processed_image_canvas.offsetWidth;
        this.processed_image_canvas.height = this.processed_image_canvas.offsetHeight;

        // these two variables center the image within the canvas
        const center_x = (this.processed_image_canvas.width - resized_width) / 2;
        const center_y = (this.processed_image_canvas.height - resized_height) / 2;

        this.processed_image_ctx.drawImage(
            html_img,
            center_x,
            center_y,
            resized_width,
            resized_height,
        );

    }

    scale_img_dimensions_to_canvas(img, canvas) {

        let scale = 0;
        let new_height = img.height;
        let new_width = img.width;

        const width_scale = canvas.offsetWidth / img.width;
        const height_scale = canvas.offsetHeight / img.height;

        if (width_scale < height_scale) {
            scale = width_scale;
        } else {
            scale = height_scale;
        }

        if (canvas.offsetWidth < img.width || canvas.offsetHeight < img.height) {
            new_width = Math.round(img.width * scale);
            new_height = Math.round(img.height * scale);
        }

        return [new_width, new_height];
    }


    put_image(img) {
        // resize canvases to fit their new offset width and height
        this.resize_canvases();

        // find new origin to center image on canvas
        let center_x = (this.processed_image_canvas.width - img.width) / 2;
        let center_y = (this.processed_image_canvas.height - img.height) / 2;

        // let original_data = new ImageData(resized_img, resized_img_width);

        this.processed_image_ctx.putImageData(
            img,
            center_x,
            center_y,
            0,
            0,
            img.width,
            img.height,
        );
    }

    // draw image when showing processed output or the original image
    draw_image(image_canvas) {

        // resize the canvas to fit into canvas element size
        this.processed_image_canvas.width = this.processed_image_canvas.offsetWidth;
        this.processed_image_canvas.height = this.processed_image_canvas.offsetHeight;

        const [resized_width, resized_height] =
            this.scale_img_dimensions_to_canvas(
                image_canvas,
                this.processed_image_canvas
            );

        // these two variables center the image within the canvas
        const center_x = (this.processed_image_canvas.width - resized_width) / 2;
        const center_y = (this.processed_image_canvas.height - resized_height) / 2;

        this.processed_image_ctx.drawImage(
            image_canvas,
            center_x,
            center_y,
            resized_width,
            resized_height,
        );
    }

    resize_canvases() {
        this.processed_image_canvas.width = this.processed_image_canvas.offsetWidth;
        this.processed_image_canvas.height = this.processed_image_canvas.offsetHeight;
    }

    display_only_processed_image() {
        this.processed_image_canvas.classList.remove("active-canvases");
        this.processed_image_canvas.classList.add("one-active-canvas");
    }

    display_original_image_canvas() {
        this.processed_image_canvas.classList.add("active-canvases");
        this.processed_image_canvas.classList.remove("one-active-canvas");
    }
}

/***/ }),

/***/ "./frontend/js/main.js":
/*!*****************************!*\
  !*** ./frontend/js/main.js ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _draw_canvases_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./draw_canvases.js */ "./frontend/js/draw_canvases.js");
/* harmony import */ var _raw_image_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./raw_image.js */ "./frontend/js/raw_image.js");



const debounce = (func, delay) => {
    let inDebounce;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(inDebounce);
        inDebounce = setTimeout(() => func.apply(context, args), delay);
    }
}

const throttle = (func, limit) => {
    let lastFunc;
    let lastRan;
    return function () {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function () {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    }
}

function main() {
    let image_worker = new Worker("./js/dist/bundle_worker.js");
    image_worker.onmessage = event => {
        if (event.data.message === "wasm INITIALIZED") {
            console.log(`${event.data.message}`);
        }
        else if (event.data.message === "INVERTED") {
            // console.log(`${event.data.message}`);
            let image = new ImageData(
                new Uint8ClampedArray(event.data.image), event.data.width
            );
            raw_images.set_output_image(
                image
            );
            draw_canvases.draw_image(raw_images.output_img_canvas());
        }
        else if (event.data.message === "BOX BLUR") {
            // console.log(`${event.data.message}`);
            let image = new ImageData(
                new Uint8ClampedArray(event.data.image), event.data.width
            );
            raw_images.set_output_image(image);
            draw_canvases.draw_image(raw_images.output_img_canvas());
        }
        else if (event.data.message === "GAMMA") {
            // console.log(`${event.data.message}`);
            let image = new ImageData(
                new Uint8ClampedArray(event.data.image), event.data.width
            );
            raw_images.set_output_image(image);
            draw_canvases.draw_image(raw_images.output_img_canvas());
        }
        else if (event.data.message === "SOBEL") {
            let image = new ImageData(
                new Uint8ClampedArray(event.data.image), event.data.width
            );
            raw_images.set_output_image(image);
            draw_canvases.draw_image(raw_images.output_img_canvas());
        }
        else {
            // console.log(`unrecognized message from web worker: ${event.data.message}`);
        }
    };


    const draw_canvases = new _draw_canvases_js__WEBPACK_IMPORTED_MODULE_0__["DrawCanvases"](
        document.getElementById("input-canvas")
    );

    let raw_images = null;

    let original_img = new Image();

    // takes the image url and displays it on both canvas
    function import_and_display(image_url) {
        original_img.addEventListener('load', function () {
            draw_canvases.display_image(original_img);

            raw_images = new _raw_image_js__WEBPACK_IMPORTED_MODULE_1__["RawImage"](
                original_img,
                draw_canvases.processed_image_canvas,
            );
            image_worker.postMessage(
                {
                    message: "USER IMAGE",
                    image: raw_images.preview_img().data.buffer,
                    width: raw_images.preview_img().width,
                },
                [raw_images.original_img().data.buffer]
            );

        });
        original_img.src = window.URL.createObjectURL(image_url);
    }

    // handles getting a new image
    // have to add checks that only get jpg and png images
    let file_input = document.getElementById("file-input");
    file_input.addEventListener("change", () => {
        let image = file_input.files[0];
        import_and_display(image);

        file_input.value = null;
        large_upload_button.style.display = "none";
        // deselects any active option and hides any sliders
        // that were in effect if user is selecting a new image
        // this will need some more working if I decide to
        // make active_input and active_option null capable
        // variables
        if (active_option !== null) {
            active_option.classList.remove("select-option");
            active_option = null;
        }

        if (active_input !== null) {
            active_input.style.display = "none";
        }

        // might need to check if algorithim-info is still displaying something
        // even if it's not null
        if (active_info !== null) {
            active_info.style.display = "none";
        }
        // will have to make sure this displays the new image without 
        // any weird bugs 
        draw_canvases.display_only_processed_image();
    });

    let large_upload_button = document.getElementById("large-upload-button");
    large_upload_button.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 768px)")) {
            if (sidebar.classList.contains("mobile-visible")) {
                sidebar.classList.remove("mobile-visible");
                sidebar.classList.add("mobile-hidden");
            }
        }
        file_input.click();
    });
    // this button activates the file input event
    let upload_image = document.getElementById("upload-image");
    upload_image.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 768px)")) {
            if (sidebar.classList.contains("mobile-visible")) {
                sidebar.classList.remove("mobile-visible");
                sidebar.classList.add("mobile-hidden");
            }
        }
        file_input.click();
    });

    // takes original image and resizes it 
    // currently doesn't reapply edit made by current processing algorithm
    window.addEventListener('resize', () => {
        if (raw_images !== null) {
            // uses original image to resize to the new output canvas 
            // dimensions
            const [resized_img_width, resized_img_height] =
                scale_img_dimensions_to_canvas(
                    raw_images.original_img(),
                    draw_canvases.processed_image_canvas
                );

            draw_canvases.resize_canvases();

            draw_canvases.resized_width = resized_img_width;
            draw_canvases.resized_height = resized_img_height;

            draw_canvases.draw_image(
                raw_images.output_img_canvas(),
            );
        }
    });

    let invert_option = document.getElementById("invert-option");
    let blur_option = document.getElementById("box-blur-option");
    let gamma_option = document.getElementById("gamma-option");
    let sobel_option = document.getElementById("sobel-option");
    // let active_option = document.createElement("p"); // creates dummy element so it wouldn't be null
    let active_option = null;

    let processing_options = document.getElementById("processing-options");

    // maybe make this null
    // also maybe make this null
    // let active_input = document.createElement("p"); // creates dummy element so it wouldn't be null
    let active_input = null;

    let invert_info = document.getElementById("invert-info");
    let box_blur_info = document.getElementById("box-blur-info");
    let gamma_info = document.getElementById("gamma-info");
    let sobel_info = document.getElementById("sobel-info");
    // let active_info = document.createElement("p");
    let active_info = null;

    function change_active_option(algorithm_option, algorithm_input, algorithm_info) {

        if (active_info === null) {
            active_info = algorithm_info;
            active_info.style.display = "";
        } 
        else {
            active_info.style.display = "none";
            active_info = algorithm_info;
            active_info.style.display = "";
        }

        if (active_input === null) {
            processing_options.style.display = "";
            active_input = algorithm_input;
            active_input.style.display = "";
        } 
        else {
            active_input.style.display = "none";
            active_input = algorithm_input;
            active_input.style.display = "";
            processing_options.style.display = "";
        }

        if (active_option === null) {
            active_option = algorithm_option;
            active_option.classList.add("select-option");
        } 
        else {
            active_option.classList.remove("select-option");
            active_option = algorithm_option;
            active_option.classList.add("select-option");
        }
    }
    function deactivate_option(algorithm_option) {
        algorithm_option.classList.remove("select-option");
        active_input.style.display = "none";

        active_info.style.display = "none";

        active_option = null;
        active_input = null;
        active_info = null;
        processing_options.style.display = "none";

        toggle_algorithms_sidebar();

        raw_images.set_output_image_to_original();
        draw_canvases.draw_image(raw_images.original_img_canvas());
        
    }
    let options = document.getElementById("options");
    // these events should check if they are the active option and if clicked again
    // they should deactivate and present the original image
    options.addEventListener("click", debounce((event) => {
        if (active_option !== null) {
            active_option.classList.remove("select-option");
        }

        if (event.target.matches("#invert-option")) {
            if (raw_images === null) {
                alert("Upload an image to use these algorithms");
                return;
            }

            if (active_option === invert_option) {
                deactivate_option(invert_option);
            } else {
                change_active_option(invert_option, invert_button, invert_info);

                toggle_algorithms_sidebar();

                image_worker.postMessage(
                    {
                        message: "INVERT",
                        width: raw_images.preview_img().width,
                    },
                );

            }

        }
        if (event.target.matches("#box-blur-option")) {
            if (raw_images === null) {
                alert("Upload an image to use these algorithms");
                return;
            }

            if (active_option === blur_option) {
                deactivate_option(blur_option);
            } else {
                change_active_option(blur_option, box_blur_slider_wrapper, box_blur_info);

                toggle_algorithms_sidebar();

                // puts the box blur slider at 1 because the default position is in the middle
                box_blur_slider.value = 1;
                box_blur_value_elem.value = box_blur_slider.value;

                let kernel_size = box_blur_slider.valueAsNumber;

                image_worker.postMessage(
                    {
                        message: "BOX BLUR",
                        width: raw_images.preview_img().width,
                        kernel_size: kernel_size,
                    },
                );
            }
        }
        if (event.target.matches("#gamma-option")) {
            if (raw_images === null) {
                alert("Upload an image to use these algorithms");
                return;
            }
            if (active_option === gamma_option) {
                deactivate_option(gamma_option);
            } else {
                change_active_option(gamma_option, gamma_slider_wrapper, gamma_info);

                toggle_algorithms_sidebar();

                // puts the gamma slider at 1 because this keeps the image unchanged 
                gamma_slider.value = 1;
                gamma_value_elem.value = 1;

                image_worker.postMessage(
                    {
                        message: "GAMMA",
                        width: raw_images.preview_img().width,
                        gamma: gamma_slider.valueAsNumber,
                    },
                );
            }
        }
        if (event.target.matches("#sobel-option")) {
            if (raw_images === null) {
                alert("Upload an image to use these algorithms");
                return;
            }
            if (active_option === sobel_option) {
                deactivate_option(sobel_option);
            } else {
                change_active_option(sobel_option, sobel_slider_wrapper, sobel_info);

                toggle_algorithms_sidebar();

                // starts sobel detector at halfway for threshold
                sobel_slider.value = 123;
                sobel_threshold.value = 123;

                image_worker.postMessage(
                    {
                        message: "SOBEL",
                        width: raw_images.preview_img().width,
                        threshold: sobel_slider.valueAsNumber,
                    },
                );
            }
        }

    }), 33);

    let invert_button = document.getElementById("invert-button");
    invert_button.addEventListener("click", debounce(() => {
        image_worker.postMessage(
            {
                message: "INVERT BUTTON",
                image: raw_images.output_img().data.buffer,
                width: raw_images.output_img().width,
            },
            [raw_images.output_img().data.buffer]
        );
    }), 33);

    let gamma_slider_wrapper = document.getElementById("gamma-slider-wrapper");
    let gamma_slider = document.getElementById("gamma-slider");
    let gamma_value_elem = document.getElementById("gamma-value");
    let gamma_slider_func = (event) => {
        let gamma = event.target.valueAsNumber;
        gamma_value_elem.value = gamma;

        // does a gamma transformation on full size image preview 
        image_worker.postMessage(
            {
                message: "GAMMA",
                width: raw_images.preview_img().width,
                gamma: gamma,
            },
        );

    }
    gamma_slider.addEventListener("input", debounce(gamma_slider_func, 100));

    let box_blur_slider_wrapper = document.getElementById("box-blur-slider-wrapper");
    let box_blur_slider = document.getElementById("box-blur-slider");
    let box_blur_value_elem = document.getElementById("box-blur-value");
    let box_slider_func = (event) => {
        let kernel_size = event.target.valueAsNumber;
        box_blur_value_elem.value = kernel_size;

        // box blurs full size image preview 
        image_worker.postMessage(
            {
                message: "BOX BLUR",
                width: raw_images.preview_img().width,
                kernel_size: kernel_size,
            },
        );
    }

    box_blur_slider.addEventListener("input", debounce(box_slider_func, 150));
    // box_blur_slider.addEventListener("change", box_slider_func);

    const sobel_slider_wrapper = document.getElementById("sobel-slider-wrapper");
    const sobel_slider = document.getElementById("sobel-slider"); 
    let sobel_threshold = document.getElementById("sobel-threshold");
    sobel_slider.addEventListener("input", debounce((event) => {
        let threshold = event.target.valueAsNumber;
        sobel_threshold.value = threshold;
        image_worker.postMessage(
            {
                message: "SOBEL",
                width: raw_images.preview_img().width,
                threshold: threshold,
            },
        );
    }), 100);

    function scale_img_dimensions_to_canvas(img, canvas) {

        let scale = 0;
        let new_height = img.height;
        let new_width = img.width;

        const width_scale = canvas.offsetWidth / img.width;
        const height_scale = canvas.offsetHeight / img.height;

        if (width_scale < height_scale) {
            scale = width_scale;
        } else {
            scale = height_scale;
        }

        if (canvas.offsetWidth < img.width || canvas.offsetHeight < img.height) {
            new_width = Math.round(img.width * scale);
            new_height = Math.round(img.height * scale);
        }

        return [new_width, new_height];
    }
    
    let sidebar = document.getElementById("sidebar");
    let algorithms_button = document.getElementById("open-algorithms");
    let algorithms_arrow = document.getElementById("open-algorithms-arrow");
    algorithms_button.addEventListener("click", () => {
        toggle_algorithms_sidebar();
    });
    function toggle_algorithms_sidebar() {
        if (window.matchMedia("(max-width: 768px)").matches) {
                sidebar.classList.toggle("mobile-hidden");
                sidebar.classList.toggle("mobile-visible");

                algorithms_arrow.classList.toggle("fa-angle-right");
                algorithms_arrow.classList.toggle("fa-angle-down");
        }
    }
}

main();


/***/ }),

/***/ "./frontend/js/raw_image.js":
/*!**********************************!*\
  !*** ./frontend/js/raw_image.js ***!
  \**********************************/
/*! exports provided: RawImage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RawImage", function() { return RawImage; });
// import { resize_img } from "../wasm/proc.js";

const max_dimension = 1500;

class RawImage {
    constructor(original_img, canvas) {
        this.output_image = document.createElement('canvas');
        this.original_image = document.createElement('canvas');
        this.preview_image = document.createElement('canvas');

        this.preview_image_ctx = this.preview_image.getContext("2d");
        this.output_image_ctx = this.output_image.getContext("2d");
        this.original_image_ctx = this.original_image.getContext("2d");

        // this part gets the raw image data by using an off screen canvas
        // resizes the canvas to image dimensions so that image isn't clipped
        // when calling getImageData()
        this.output_image.width = original_img.width;
        this.output_image.height = original_img.height;

        this.original_image.width = original_img.width;
        this.original_image.height = original_img.height;

        this.output_image_ctx.drawImage(original_img, 0, 0);
        this.original_image_ctx.drawImage(original_img, 0, 0);
        this.preview_image.offsetHeight
        let [preview_width, preview_height] = 
            resize_preview_image(
                original_img, 
                max_dimension
            );
        this.preview_image.width = preview_width;
        this.preview_image.height = preview_height;
        this.output_image.width = preview_width;
        this.output_image.height = preview_height;

        this.preview_image_ctx.drawImage(original_img, 0, 0, preview_width, preview_height);
        this.output_image_ctx.drawImage(original_img, 0, 0, preview_width, preview_height);

        // this.output_image = output_img_ctx.getImageData(
        //     0, 
        //     0, 
        //     output_img.width, 
        //     output_img.height
        // );
        // this.original_image = img_ctx.getImageData(
        //     0, 
        //     0, 
        //     img.width, 
        //     img.height
        // );

        // const [resized_img_width, resized_img_height] = 
        //     this.scale_img_dimensions_to_canvas(img, canvas);
        // // this image will be the one that gets processed so there isn't a need
        // // to constantly resize the original image on every processing function
        // const output_image_resized_raw = new Uint8ClampedArray(
        //     resize_img(
        //         this.output_image.data, 
        //         this.output_image.width, 
        //         resized_img_width, 
        //         resized_img_height
        //     )
        // );
        // this.output_image_resized = new ImageData(
        //     output_image_resized_raw, 
        //     resized_img_width
        // );
        // make this more performant
        // let luma_img_data = change_to_grayscale(original_img_data);
        // let output_luma_data = change_to_grayscale(output_img_data);

        // put_image_data_canvas(luma_img_data, input_ctx);

        // original_img_data = luma_img_data;
        // output_img_data = output_luma_data;
    }

    original_img() {
        return this.original_image_ctx.getImageData(
            0,
            0,
            this.original_image.width,
            this.original_image.height,
        );
    }
    original_img_canvas() {
        return this.original_image;
    }

    output_img_canvas() {
        return this.output_image;
    }
    output_img() {
        return this.output_image_ctx.getImageData(
            0,
            0,
            this.output_image.width,
            this.output_image.height,
        );
    }

    preview_img_canvas() {
        return this.preview_image;
    }
    preview_img() {
        return this.preview_image_ctx.getImageData(
            0,
            0, 
            this.preview_image.width,
            this.preview_image.height,
        );
    }

    set_output_image(image) {
        this.output_image_ctx.putImageData(image, 0, 0);
    }

    set_output_image_to_original() {
        this.set_output_image(this.original_img());
    }

    // set_original_image(image) {
    //     this.original_image = image;
    // }

    // scale_img_dimensions_to_canvas(img, canvas) {

    //     let scale = 0;
    //     let new_height = img.height;
    //     let new_width = img.width;

    //     const width_scale = canvas.offsetWidth / img.width;
    //     const height_scale = canvas.offsetHeight / img.height;

    //     if (width_scale < height_scale) {
    //         scale = width_scale;
    //     } else {
    //         scale = height_scale;
    //     }

    //     if (canvas.offsetWidth < img.width || canvas.offsetHeight < img.height) {
    //         new_width = Math.round(img.width * scale);
    //         new_height = Math.round(img.height * scale);
    //     }

    //     return [new_width, new_height];
    // }
}

function resize_preview_image(img, max_long_edge) {
    let scale = 0;
    let new_height = img.height;
    let new_width = img.width;

    const width_scale = max_long_edge / img.width;
    const height_scale = max_long_edge / img.height;

    if (width_scale < height_scale) {
        scale = width_scale;
    } else {
        scale = height_scale;
    }

    if (max_long_edge < img.width || max_long_edge < img.height) {
        new_width = Math.round(img.width * scale);
        new_height = Math.round(img.height * scale);
    }

    return [new_width, new_height];
}

/***/ })

/******/ });

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vZnJvbnRlbmQvanMvZHJhd19jYW52YXNlcy5qcyIsIndlYnBhY2s6Ly8vLi9mcm9udGVuZC9qcy9tYWluLmpzIiwid2VicGFjazovLy8uL2Zyb250ZW5kL2pzL3Jhd19pbWFnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQSxXQUFXLGFBQWE7QUFDakI7QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7O0FDckhBO0FBQUE7QUFBQTtBQUFrRDtBQUNSOztBQUUxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsbUJBQW1CO0FBQzlDO0FBQ0E7QUFDQSw4QkFBOEIsbUJBQW1CO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixtQkFBbUI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsbUJBQW1CO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvRUFBb0UsbUJBQW1CO0FBQ3ZGO0FBQ0E7OztBQUdBLDhCQUE4Qiw4REFBWTtBQUMxQztBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDZCQUE2QixzREFBUTtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7O0FBRUEsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0Esc0RBQXNEO0FBQ3REOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTs7QUFFQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGlFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7QUM3ZEE7QUFBQTtBQUFBLFdBQVcsYUFBYTs7QUFFeEI7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL2Zyb250ZW5kL2pzL21haW4uanNcIik7XG4iLCIvLyBpbXBvcnQgeyByZXNpemVfaW1nIH0gZnJvbSBcIi4uL3dhc20vcHJvYy5qc1wiO1xyXG5leHBvcnQgY2xhc3MgRHJhd0NhbnZhc2VzIHtcclxuICAgIGNvbnN0cnVjdG9yKGlucHV0X2NhbnZhcykge1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2VkX2ltYWdlX2NhbnZhcyA9IGlucHV0X2NhbnZhcztcclxuICAgICAgICB0aGlzLnByb2Nlc3NlZF9pbWFnZV9jdHggPSBpbnB1dF9jYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGRpc3BsYXlzIGltYWdlIHdoZW4gdXBsb2FkaW5nIGEgbmV3IGltYWdlXHJcbiAgICBkaXNwbGF5X2ltYWdlKGh0bWxfaW1nKSB7XHJcbiAgICAgICAgLy8gdGhpcyBzZXF1ZW5jZSBzY2FsZXMgdGhlIGltYWdlIHVwIG9yIGRvd24gdG8gZml0IGludG8gY2FudmFzIGVsZW1lbnRcclxuICAgICAgICAvLyBjb25zaWRlciBzY2FsaW5nIHRvIGEgcGVyY2VudGFnZSBvZiB0aGUgY2FudmFzXHJcbiAgICAgICAgY29uc3QgW3Jlc2l6ZWRfd2lkdGgsIHJlc2l6ZWRfaGVpZ2h0XSA9XHJcbiAgICAgICAgICAgIHRoaXMuc2NhbGVfaW1nX2RpbWVuc2lvbnNfdG9fY2FudmFzKGh0bWxfaW1nLCB0aGlzLnByb2Nlc3NlZF9pbWFnZV9jYW52YXMpO1xyXG5cclxuICAgICAgICAvLyByZXNpemUgdGhlIGNhbnZhcyB0byBmaXQgaW50byBjYW52YXMgZWxlbWVudCBzaXplXHJcbiAgICAgICAgdGhpcy5wcm9jZXNzZWRfaW1hZ2VfY2FudmFzLndpZHRoID0gdGhpcy5wcm9jZXNzZWRfaW1hZ2VfY2FudmFzLm9mZnNldFdpZHRoO1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2VkX2ltYWdlX2NhbnZhcy5oZWlnaHQgPSB0aGlzLnByb2Nlc3NlZF9pbWFnZV9jYW52YXMub2Zmc2V0SGVpZ2h0O1xyXG5cclxuICAgICAgICAvLyB0aGVzZSB0d28gdmFyaWFibGVzIGNlbnRlciB0aGUgaW1hZ2Ugd2l0aGluIHRoZSBjYW52YXNcclxuICAgICAgICBjb25zdCBjZW50ZXJfeCA9ICh0aGlzLnByb2Nlc3NlZF9pbWFnZV9jYW52YXMud2lkdGggLSByZXNpemVkX3dpZHRoKSAvIDI7XHJcbiAgICAgICAgY29uc3QgY2VudGVyX3kgPSAodGhpcy5wcm9jZXNzZWRfaW1hZ2VfY2FudmFzLmhlaWdodCAtIHJlc2l6ZWRfaGVpZ2h0KSAvIDI7XHJcblxyXG4gICAgICAgIHRoaXMucHJvY2Vzc2VkX2ltYWdlX2N0eC5kcmF3SW1hZ2UoXHJcbiAgICAgICAgICAgIGh0bWxfaW1nLFxyXG4gICAgICAgICAgICBjZW50ZXJfeCxcclxuICAgICAgICAgICAgY2VudGVyX3ksXHJcbiAgICAgICAgICAgIHJlc2l6ZWRfd2lkdGgsXHJcbiAgICAgICAgICAgIHJlc2l6ZWRfaGVpZ2h0LFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNjYWxlX2ltZ19kaW1lbnNpb25zX3RvX2NhbnZhcyhpbWcsIGNhbnZhcykge1xyXG5cclxuICAgICAgICBsZXQgc2NhbGUgPSAwO1xyXG4gICAgICAgIGxldCBuZXdfaGVpZ2h0ID0gaW1nLmhlaWdodDtcclxuICAgICAgICBsZXQgbmV3X3dpZHRoID0gaW1nLndpZHRoO1xyXG5cclxuICAgICAgICBjb25zdCB3aWR0aF9zY2FsZSA9IGNhbnZhcy5vZmZzZXRXaWR0aCAvIGltZy53aWR0aDtcclxuICAgICAgICBjb25zdCBoZWlnaHRfc2NhbGUgPSBjYW52YXMub2Zmc2V0SGVpZ2h0IC8gaW1nLmhlaWdodDtcclxuXHJcbiAgICAgICAgaWYgKHdpZHRoX3NjYWxlIDwgaGVpZ2h0X3NjYWxlKSB7XHJcbiAgICAgICAgICAgIHNjYWxlID0gd2lkdGhfc2NhbGU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2NhbGUgPSBoZWlnaHRfc2NhbGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY2FudmFzLm9mZnNldFdpZHRoIDwgaW1nLndpZHRoIHx8IGNhbnZhcy5vZmZzZXRIZWlnaHQgPCBpbWcuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIG5ld193aWR0aCA9IE1hdGgucm91bmQoaW1nLndpZHRoICogc2NhbGUpO1xyXG4gICAgICAgICAgICBuZXdfaGVpZ2h0ID0gTWF0aC5yb3VuZChpbWcuaGVpZ2h0ICogc2NhbGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIFtuZXdfd2lkdGgsIG5ld19oZWlnaHRdO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwdXRfaW1hZ2UoaW1nKSB7XHJcbiAgICAgICAgLy8gcmVzaXplIGNhbnZhc2VzIHRvIGZpdCB0aGVpciBuZXcgb2Zmc2V0IHdpZHRoIGFuZCBoZWlnaHRcclxuICAgICAgICB0aGlzLnJlc2l6ZV9jYW52YXNlcygpO1xyXG5cclxuICAgICAgICAvLyBmaW5kIG5ldyBvcmlnaW4gdG8gY2VudGVyIGltYWdlIG9uIGNhbnZhc1xyXG4gICAgICAgIGxldCBjZW50ZXJfeCA9ICh0aGlzLnByb2Nlc3NlZF9pbWFnZV9jYW52YXMud2lkdGggLSBpbWcud2lkdGgpIC8gMjtcclxuICAgICAgICBsZXQgY2VudGVyX3kgPSAodGhpcy5wcm9jZXNzZWRfaW1hZ2VfY2FudmFzLmhlaWdodCAtIGltZy5oZWlnaHQpIC8gMjtcclxuXHJcbiAgICAgICAgLy8gbGV0IG9yaWdpbmFsX2RhdGEgPSBuZXcgSW1hZ2VEYXRhKHJlc2l6ZWRfaW1nLCByZXNpemVkX2ltZ193aWR0aCk7XHJcblxyXG4gICAgICAgIHRoaXMucHJvY2Vzc2VkX2ltYWdlX2N0eC5wdXRJbWFnZURhdGEoXHJcbiAgICAgICAgICAgIGltZyxcclxuICAgICAgICAgICAgY2VudGVyX3gsXHJcbiAgICAgICAgICAgIGNlbnRlcl95LFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICBpbWcud2lkdGgsXHJcbiAgICAgICAgICAgIGltZy5oZWlnaHQsXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBkcmF3IGltYWdlIHdoZW4gc2hvd2luZyBwcm9jZXNzZWQgb3V0cHV0IG9yIHRoZSBvcmlnaW5hbCBpbWFnZVxyXG4gICAgZHJhd19pbWFnZShpbWFnZV9jYW52YXMpIHtcclxuXHJcbiAgICAgICAgLy8gcmVzaXplIHRoZSBjYW52YXMgdG8gZml0IGludG8gY2FudmFzIGVsZW1lbnQgc2l6ZVxyXG4gICAgICAgIHRoaXMucHJvY2Vzc2VkX2ltYWdlX2NhbnZhcy53aWR0aCA9IHRoaXMucHJvY2Vzc2VkX2ltYWdlX2NhbnZhcy5vZmZzZXRXaWR0aDtcclxuICAgICAgICB0aGlzLnByb2Nlc3NlZF9pbWFnZV9jYW52YXMuaGVpZ2h0ID0gdGhpcy5wcm9jZXNzZWRfaW1hZ2VfY2FudmFzLm9mZnNldEhlaWdodDtcclxuXHJcbiAgICAgICAgY29uc3QgW3Jlc2l6ZWRfd2lkdGgsIHJlc2l6ZWRfaGVpZ2h0XSA9XHJcbiAgICAgICAgICAgIHRoaXMuc2NhbGVfaW1nX2RpbWVuc2lvbnNfdG9fY2FudmFzKFxyXG4gICAgICAgICAgICAgICAgaW1hZ2VfY2FudmFzLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzZWRfaW1hZ2VfY2FudmFzXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIHRoZXNlIHR3byB2YXJpYWJsZXMgY2VudGVyIHRoZSBpbWFnZSB3aXRoaW4gdGhlIGNhbnZhc1xyXG4gICAgICAgIGNvbnN0IGNlbnRlcl94ID0gKHRoaXMucHJvY2Vzc2VkX2ltYWdlX2NhbnZhcy53aWR0aCAtIHJlc2l6ZWRfd2lkdGgpIC8gMjtcclxuICAgICAgICBjb25zdCBjZW50ZXJfeSA9ICh0aGlzLnByb2Nlc3NlZF9pbWFnZV9jYW52YXMuaGVpZ2h0IC0gcmVzaXplZF9oZWlnaHQpIC8gMjtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9jZXNzZWRfaW1hZ2VfY3R4LmRyYXdJbWFnZShcclxuICAgICAgICAgICAgaW1hZ2VfY2FudmFzLFxyXG4gICAgICAgICAgICBjZW50ZXJfeCxcclxuICAgICAgICAgICAgY2VudGVyX3ksXHJcbiAgICAgICAgICAgIHJlc2l6ZWRfd2lkdGgsXHJcbiAgICAgICAgICAgIHJlc2l6ZWRfaGVpZ2h0LFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzaXplX2NhbnZhc2VzKCkge1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2VkX2ltYWdlX2NhbnZhcy53aWR0aCA9IHRoaXMucHJvY2Vzc2VkX2ltYWdlX2NhbnZhcy5vZmZzZXRXaWR0aDtcclxuICAgICAgICB0aGlzLnByb2Nlc3NlZF9pbWFnZV9jYW52YXMuaGVpZ2h0ID0gdGhpcy5wcm9jZXNzZWRfaW1hZ2VfY2FudmFzLm9mZnNldEhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBkaXNwbGF5X29ubHlfcHJvY2Vzc2VkX2ltYWdlKCkge1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2VkX2ltYWdlX2NhbnZhcy5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlLWNhbnZhc2VzXCIpO1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2VkX2ltYWdlX2NhbnZhcy5jbGFzc0xpc3QuYWRkKFwib25lLWFjdGl2ZS1jYW52YXNcIik7XHJcbiAgICB9XHJcblxyXG4gICAgZGlzcGxheV9vcmlnaW5hbF9pbWFnZV9jYW52YXMoKSB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzZWRfaW1hZ2VfY2FudmFzLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmUtY2FudmFzZXNcIik7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzZWRfaW1hZ2VfY2FudmFzLmNsYXNzTGlzdC5yZW1vdmUoXCJvbmUtYWN0aXZlLWNhbnZhc1wiKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IERyYXdDYW52YXNlcyB9IGZyb20gXCIuL2RyYXdfY2FudmFzZXMuanNcIjtcclxuaW1wb3J0IHsgUmF3SW1hZ2UgfSBmcm9tIFwiLi9yYXdfaW1hZ2UuanNcIjtcclxuXHJcbmNvbnN0IGRlYm91bmNlID0gKGZ1bmMsIGRlbGF5KSA9PiB7XHJcbiAgICBsZXQgaW5EZWJvdW5jZTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc3QgY29udGV4dCA9IHRoaXM7XHJcbiAgICAgICAgY29uc3QgYXJncyA9IGFyZ3VtZW50cztcclxuICAgICAgICBjbGVhclRpbWVvdXQoaW5EZWJvdW5jZSk7XHJcbiAgICAgICAgaW5EZWJvdW5jZSA9IHNldFRpbWVvdXQoKCkgPT4gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKSwgZGVsYXkpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCB0aHJvdHRsZSA9IChmdW5jLCBsaW1pdCkgPT4ge1xyXG4gICAgbGV0IGxhc3RGdW5jO1xyXG4gICAgbGV0IGxhc3RSYW47XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzO1xyXG4gICAgICAgIGNvbnN0IGFyZ3MgPSBhcmd1bWVudHM7XHJcbiAgICAgICAgaWYgKCFsYXN0UmFuKSB7XHJcbiAgICAgICAgICAgIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XHJcbiAgICAgICAgICAgIGxhc3RSYW4gPSBEYXRlLm5vdygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dChsYXN0RnVuYyk7XHJcbiAgICAgICAgICAgIGxhc3RGdW5jID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKERhdGUubm93KCkgLSBsYXN0UmFuKSA+PSBsaW1pdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdFJhbiA9IERhdGUubm93KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIGxpbWl0IC0gKERhdGUubm93KCkgLSBsYXN0UmFuKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYWluKCkge1xyXG4gICAgbGV0IGltYWdlX3dvcmtlciA9IG5ldyBXb3JrZXIoXCIuL2pzL2Rpc3QvYnVuZGxlX3dvcmtlci5qc1wiKTtcclxuICAgIGltYWdlX3dvcmtlci5vbm1lc3NhZ2UgPSBldmVudCA9PiB7XHJcbiAgICAgICAgaWYgKGV2ZW50LmRhdGEubWVzc2FnZSA9PT0gXCJ3YXNtIElOSVRJQUxJWkVEXCIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYCR7ZXZlbnQuZGF0YS5tZXNzYWdlfWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChldmVudC5kYXRhLm1lc3NhZ2UgPT09IFwiSU5WRVJURURcIikge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgJHtldmVudC5kYXRhLm1lc3NhZ2V9YCk7XHJcbiAgICAgICAgICAgIGxldCBpbWFnZSA9IG5ldyBJbWFnZURhdGEoXHJcbiAgICAgICAgICAgICAgICBuZXcgVWludDhDbGFtcGVkQXJyYXkoZXZlbnQuZGF0YS5pbWFnZSksIGV2ZW50LmRhdGEud2lkdGhcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgcmF3X2ltYWdlcy5zZXRfb3V0cHV0X2ltYWdlKFxyXG4gICAgICAgICAgICAgICAgaW1hZ2VcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgZHJhd19jYW52YXNlcy5kcmF3X2ltYWdlKHJhd19pbWFnZXMub3V0cHV0X2ltZ19jYW52YXMoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGV2ZW50LmRhdGEubWVzc2FnZSA9PT0gXCJCT1ggQkxVUlwiKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGAke2V2ZW50LmRhdGEubWVzc2FnZX1gKTtcclxuICAgICAgICAgICAgbGV0IGltYWdlID0gbmV3IEltYWdlRGF0YShcclxuICAgICAgICAgICAgICAgIG5ldyBVaW50OENsYW1wZWRBcnJheShldmVudC5kYXRhLmltYWdlKSwgZXZlbnQuZGF0YS53aWR0aFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICByYXdfaW1hZ2VzLnNldF9vdXRwdXRfaW1hZ2UoaW1hZ2UpO1xyXG4gICAgICAgICAgICBkcmF3X2NhbnZhc2VzLmRyYXdfaW1hZ2UocmF3X2ltYWdlcy5vdXRwdXRfaW1nX2NhbnZhcygpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZXZlbnQuZGF0YS5tZXNzYWdlID09PSBcIkdBTU1BXCIpIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYCR7ZXZlbnQuZGF0YS5tZXNzYWdlfWApO1xyXG4gICAgICAgICAgICBsZXQgaW1hZ2UgPSBuZXcgSW1hZ2VEYXRhKFxyXG4gICAgICAgICAgICAgICAgbmV3IFVpbnQ4Q2xhbXBlZEFycmF5KGV2ZW50LmRhdGEuaW1hZ2UpLCBldmVudC5kYXRhLndpZHRoXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHJhd19pbWFnZXMuc2V0X291dHB1dF9pbWFnZShpbWFnZSk7XHJcbiAgICAgICAgICAgIGRyYXdfY2FudmFzZXMuZHJhd19pbWFnZShyYXdfaW1hZ2VzLm91dHB1dF9pbWdfY2FudmFzKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChldmVudC5kYXRhLm1lc3NhZ2UgPT09IFwiU09CRUxcIikge1xyXG4gICAgICAgICAgICBsZXQgaW1hZ2UgPSBuZXcgSW1hZ2VEYXRhKFxyXG4gICAgICAgICAgICAgICAgbmV3IFVpbnQ4Q2xhbXBlZEFycmF5KGV2ZW50LmRhdGEuaW1hZ2UpLCBldmVudC5kYXRhLndpZHRoXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHJhd19pbWFnZXMuc2V0X291dHB1dF9pbWFnZShpbWFnZSk7XHJcbiAgICAgICAgICAgIGRyYXdfY2FudmFzZXMuZHJhd19pbWFnZShyYXdfaW1hZ2VzLm91dHB1dF9pbWdfY2FudmFzKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYHVucmVjb2duaXplZCBtZXNzYWdlIGZyb20gd2ViIHdvcmtlcjogJHtldmVudC5kYXRhLm1lc3NhZ2V9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcblxyXG4gICAgY29uc3QgZHJhd19jYW52YXNlcyA9IG5ldyBEcmF3Q2FudmFzZXMoXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnB1dC1jYW52YXNcIilcclxuICAgICk7XHJcblxyXG4gICAgbGV0IHJhd19pbWFnZXMgPSBudWxsO1xyXG5cclxuICAgIGxldCBvcmlnaW5hbF9pbWcgPSBuZXcgSW1hZ2UoKTtcclxuXHJcbiAgICAvLyB0YWtlcyB0aGUgaW1hZ2UgdXJsIGFuZCBkaXNwbGF5cyBpdCBvbiBib3RoIGNhbnZhc1xyXG4gICAgZnVuY3Rpb24gaW1wb3J0X2FuZF9kaXNwbGF5KGltYWdlX3VybCkge1xyXG4gICAgICAgIG9yaWdpbmFsX2ltZy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBkcmF3X2NhbnZhc2VzLmRpc3BsYXlfaW1hZ2Uob3JpZ2luYWxfaW1nKTtcclxuXHJcbiAgICAgICAgICAgIHJhd19pbWFnZXMgPSBuZXcgUmF3SW1hZ2UoXHJcbiAgICAgICAgICAgICAgICBvcmlnaW5hbF9pbWcsXHJcbiAgICAgICAgICAgICAgICBkcmF3X2NhbnZhc2VzLnByb2Nlc3NlZF9pbWFnZV9jYW52YXMsXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGltYWdlX3dvcmtlci5wb3N0TWVzc2FnZShcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlVTRVIgSU1BR0VcIixcclxuICAgICAgICAgICAgICAgICAgICBpbWFnZTogcmF3X2ltYWdlcy5wcmV2aWV3X2ltZygpLmRhdGEuYnVmZmVyLFxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiByYXdfaW1hZ2VzLnByZXZpZXdfaW1nKCkud2lkdGgsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgW3Jhd19pbWFnZXMub3JpZ2luYWxfaW1nKCkuZGF0YS5idWZmZXJdXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG9yaWdpbmFsX2ltZy5zcmMgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChpbWFnZV91cmwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGhhbmRsZXMgZ2V0dGluZyBhIG5ldyBpbWFnZVxyXG4gICAgLy8gaGF2ZSB0byBhZGQgY2hlY2tzIHRoYXQgb25seSBnZXQganBnIGFuZCBwbmcgaW1hZ2VzXHJcbiAgICBsZXQgZmlsZV9pbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsZS1pbnB1dFwiKTtcclxuICAgIGZpbGVfaW5wdXQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XHJcbiAgICAgICAgbGV0IGltYWdlID0gZmlsZV9pbnB1dC5maWxlc1swXTtcclxuICAgICAgICBpbXBvcnRfYW5kX2Rpc3BsYXkoaW1hZ2UpO1xyXG5cclxuICAgICAgICBmaWxlX2lucHV0LnZhbHVlID0gbnVsbDtcclxuICAgICAgICBsYXJnZV91cGxvYWRfYnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAvLyBkZXNlbGVjdHMgYW55IGFjdGl2ZSBvcHRpb24gYW5kIGhpZGVzIGFueSBzbGlkZXJzXHJcbiAgICAgICAgLy8gdGhhdCB3ZXJlIGluIGVmZmVjdCBpZiB1c2VyIGlzIHNlbGVjdGluZyBhIG5ldyBpbWFnZVxyXG4gICAgICAgIC8vIHRoaXMgd2lsbCBuZWVkIHNvbWUgbW9yZSB3b3JraW5nIGlmIEkgZGVjaWRlIHRvXHJcbiAgICAgICAgLy8gbWFrZSBhY3RpdmVfaW5wdXQgYW5kIGFjdGl2ZV9vcHRpb24gbnVsbCBjYXBhYmxlXHJcbiAgICAgICAgLy8gdmFyaWFibGVzXHJcbiAgICAgICAgaWYgKGFjdGl2ZV9vcHRpb24gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgYWN0aXZlX29wdGlvbi5jbGFzc0xpc3QucmVtb3ZlKFwic2VsZWN0LW9wdGlvblwiKTtcclxuICAgICAgICAgICAgYWN0aXZlX29wdGlvbiA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYWN0aXZlX2lucHV0ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGFjdGl2ZV9pbnB1dC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBtaWdodCBuZWVkIHRvIGNoZWNrIGlmIGFsZ29yaXRoaW0taW5mbyBpcyBzdGlsbCBkaXNwbGF5aW5nIHNvbWV0aGluZ1xyXG4gICAgICAgIC8vIGV2ZW4gaWYgaXQncyBub3QgbnVsbFxyXG4gICAgICAgIGlmIChhY3RpdmVfaW5mbyAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBhY3RpdmVfaW5mby5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHdpbGwgaGF2ZSB0byBtYWtlIHN1cmUgdGhpcyBkaXNwbGF5cyB0aGUgbmV3IGltYWdlIHdpdGhvdXQgXHJcbiAgICAgICAgLy8gYW55IHdlaXJkIGJ1Z3MgXHJcbiAgICAgICAgZHJhd19jYW52YXNlcy5kaXNwbGF5X29ubHlfcHJvY2Vzc2VkX2ltYWdlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBsZXQgbGFyZ2VfdXBsb2FkX2J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGFyZ2UtdXBsb2FkLWJ1dHRvblwiKTtcclxuICAgIGxhcmdlX3VwbG9hZF9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgICBpZiAod2luZG93Lm1hdGNoTWVkaWEoXCIobWF4LXdpZHRoOiA3NjhweClcIikpIHtcclxuICAgICAgICAgICAgaWYgKHNpZGViYXIuY2xhc3NMaXN0LmNvbnRhaW5zKFwibW9iaWxlLXZpc2libGVcIikpIHtcclxuICAgICAgICAgICAgICAgIHNpZGViYXIuY2xhc3NMaXN0LnJlbW92ZShcIm1vYmlsZS12aXNpYmxlXCIpO1xyXG4gICAgICAgICAgICAgICAgc2lkZWJhci5jbGFzc0xpc3QuYWRkKFwibW9iaWxlLWhpZGRlblwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmaWxlX2lucHV0LmNsaWNrKCk7XHJcbiAgICB9KTtcclxuICAgIC8vIHRoaXMgYnV0dG9uIGFjdGl2YXRlcyB0aGUgZmlsZSBpbnB1dCBldmVudFxyXG4gICAgbGV0IHVwbG9hZF9pbWFnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidXBsb2FkLWltYWdlXCIpO1xyXG4gICAgdXBsb2FkX2ltYWdlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogNzY4cHgpXCIpKSB7XHJcbiAgICAgICAgICAgIGlmIChzaWRlYmFyLmNsYXNzTGlzdC5jb250YWlucyhcIm1vYmlsZS12aXNpYmxlXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBzaWRlYmFyLmNsYXNzTGlzdC5yZW1vdmUoXCJtb2JpbGUtdmlzaWJsZVwiKTtcclxuICAgICAgICAgICAgICAgIHNpZGViYXIuY2xhc3NMaXN0LmFkZChcIm1vYmlsZS1oaWRkZW5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZmlsZV9pbnB1dC5jbGljaygpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gdGFrZXMgb3JpZ2luYWwgaW1hZ2UgYW5kIHJlc2l6ZXMgaXQgXHJcbiAgICAvLyBjdXJyZW50bHkgZG9lc24ndCByZWFwcGx5IGVkaXQgbWFkZSBieSBjdXJyZW50IHByb2Nlc3NpbmcgYWxnb3JpdGhtXHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xyXG4gICAgICAgIGlmIChyYXdfaW1hZ2VzICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIC8vIHVzZXMgb3JpZ2luYWwgaW1hZ2UgdG8gcmVzaXplIHRvIHRoZSBuZXcgb3V0cHV0IGNhbnZhcyBcclxuICAgICAgICAgICAgLy8gZGltZW5zaW9uc1xyXG4gICAgICAgICAgICBjb25zdCBbcmVzaXplZF9pbWdfd2lkdGgsIHJlc2l6ZWRfaW1nX2hlaWdodF0gPVxyXG4gICAgICAgICAgICAgICAgc2NhbGVfaW1nX2RpbWVuc2lvbnNfdG9fY2FudmFzKFxyXG4gICAgICAgICAgICAgICAgICAgIHJhd19pbWFnZXMub3JpZ2luYWxfaW1nKCksXHJcbiAgICAgICAgICAgICAgICAgICAgZHJhd19jYW52YXNlcy5wcm9jZXNzZWRfaW1hZ2VfY2FudmFzXHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgZHJhd19jYW52YXNlcy5yZXNpemVfY2FudmFzZXMoKTtcclxuXHJcbiAgICAgICAgICAgIGRyYXdfY2FudmFzZXMucmVzaXplZF93aWR0aCA9IHJlc2l6ZWRfaW1nX3dpZHRoO1xyXG4gICAgICAgICAgICBkcmF3X2NhbnZhc2VzLnJlc2l6ZWRfaGVpZ2h0ID0gcmVzaXplZF9pbWdfaGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgZHJhd19jYW52YXNlcy5kcmF3X2ltYWdlKFxyXG4gICAgICAgICAgICAgICAgcmF3X2ltYWdlcy5vdXRwdXRfaW1nX2NhbnZhcygpLFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGxldCBpbnZlcnRfb3B0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnZlcnQtb3B0aW9uXCIpO1xyXG4gICAgbGV0IGJsdXJfb3B0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJib3gtYmx1ci1vcHRpb25cIik7XHJcbiAgICBsZXQgZ2FtbWFfb3B0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1tYS1vcHRpb25cIik7XHJcbiAgICBsZXQgc29iZWxfb3B0aW9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzb2JlbC1vcHRpb25cIik7XHJcbiAgICAvLyBsZXQgYWN0aXZlX29wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpOyAvLyBjcmVhdGVzIGR1bW15IGVsZW1lbnQgc28gaXQgd291bGRuJ3QgYmUgbnVsbFxyXG4gICAgbGV0IGFjdGl2ZV9vcHRpb24gPSBudWxsO1xyXG5cclxuICAgIGxldCBwcm9jZXNzaW5nX29wdGlvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByb2Nlc3Npbmctb3B0aW9uc1wiKTtcclxuXHJcbiAgICAvLyBtYXliZSBtYWtlIHRoaXMgbnVsbFxyXG4gICAgLy8gYWxzbyBtYXliZSBtYWtlIHRoaXMgbnVsbFxyXG4gICAgLy8gbGV0IGFjdGl2ZV9pbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpOyAvLyBjcmVhdGVzIGR1bW15IGVsZW1lbnQgc28gaXQgd291bGRuJ3QgYmUgbnVsbFxyXG4gICAgbGV0IGFjdGl2ZV9pbnB1dCA9IG51bGw7XHJcblxyXG4gICAgbGV0IGludmVydF9pbmZvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnZlcnQtaW5mb1wiKTtcclxuICAgIGxldCBib3hfYmx1cl9pbmZvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJib3gtYmx1ci1pbmZvXCIpO1xyXG4gICAgbGV0IGdhbW1hX2luZm8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbW1hLWluZm9cIik7XHJcbiAgICBsZXQgc29iZWxfaW5mbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29iZWwtaW5mb1wiKTtcclxuICAgIC8vIGxldCBhY3RpdmVfaW5mbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xyXG4gICAgbGV0IGFjdGl2ZV9pbmZvID0gbnVsbDtcclxuXHJcbiAgICBmdW5jdGlvbiBjaGFuZ2VfYWN0aXZlX29wdGlvbihhbGdvcml0aG1fb3B0aW9uLCBhbGdvcml0aG1faW5wdXQsIGFsZ29yaXRobV9pbmZvKSB7XHJcblxyXG4gICAgICAgIGlmIChhY3RpdmVfaW5mbyA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBhY3RpdmVfaW5mbyA9IGFsZ29yaXRobV9pbmZvO1xyXG4gICAgICAgICAgICBhY3RpdmVfaW5mby5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcclxuICAgICAgICB9IFxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBhY3RpdmVfaW5mby5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIGFjdGl2ZV9pbmZvID0gYWxnb3JpdGhtX2luZm87XHJcbiAgICAgICAgICAgIGFjdGl2ZV9pbmZvLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGFjdGl2ZV9pbnB1dCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBwcm9jZXNzaW5nX29wdGlvbnMuc3R5bGUuZGlzcGxheSA9IFwiXCI7XHJcbiAgICAgICAgICAgIGFjdGl2ZV9pbnB1dCA9IGFsZ29yaXRobV9pbnB1dDtcclxuICAgICAgICAgICAgYWN0aXZlX2lucHV0LnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xyXG4gICAgICAgIH0gXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGFjdGl2ZV9pbnB1dC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIGFjdGl2ZV9pbnB1dCA9IGFsZ29yaXRobV9pbnB1dDtcclxuICAgICAgICAgICAgYWN0aXZlX2lucHV0LnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xyXG4gICAgICAgICAgICBwcm9jZXNzaW5nX29wdGlvbnMuc3R5bGUuZGlzcGxheSA9IFwiXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYWN0aXZlX29wdGlvbiA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBhY3RpdmVfb3B0aW9uID0gYWxnb3JpdGhtX29wdGlvbjtcclxuICAgICAgICAgICAgYWN0aXZlX29wdGlvbi5jbGFzc0xpc3QuYWRkKFwic2VsZWN0LW9wdGlvblwiKTtcclxuICAgICAgICB9IFxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBhY3RpdmVfb3B0aW9uLmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3Qtb3B0aW9uXCIpO1xyXG4gICAgICAgICAgICBhY3RpdmVfb3B0aW9uID0gYWxnb3JpdGhtX29wdGlvbjtcclxuICAgICAgICAgICAgYWN0aXZlX29wdGlvbi5jbGFzc0xpc3QuYWRkKFwic2VsZWN0LW9wdGlvblwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBkZWFjdGl2YXRlX29wdGlvbihhbGdvcml0aG1fb3B0aW9uKSB7XHJcbiAgICAgICAgYWxnb3JpdGhtX29wdGlvbi5jbGFzc0xpc3QucmVtb3ZlKFwic2VsZWN0LW9wdGlvblwiKTtcclxuICAgICAgICBhY3RpdmVfaW5wdXQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG5cclxuICAgICAgICBhY3RpdmVfaW5mby5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcblxyXG4gICAgICAgIGFjdGl2ZV9vcHRpb24gPSBudWxsO1xyXG4gICAgICAgIGFjdGl2ZV9pbnB1dCA9IG51bGw7XHJcbiAgICAgICAgYWN0aXZlX2luZm8gPSBudWxsO1xyXG4gICAgICAgIHByb2Nlc3Npbmdfb3B0aW9ucy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcblxyXG4gICAgICAgIHRvZ2dsZV9hbGdvcml0aG1zX3NpZGViYXIoKTtcclxuXHJcbiAgICAgICAgcmF3X2ltYWdlcy5zZXRfb3V0cHV0X2ltYWdlX3RvX29yaWdpbmFsKCk7XHJcbiAgICAgICAgZHJhd19jYW52YXNlcy5kcmF3X2ltYWdlKHJhd19pbWFnZXMub3JpZ2luYWxfaW1nX2NhbnZhcygpKTtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIGxldCBvcHRpb25zID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHRpb25zXCIpO1xyXG4gICAgLy8gdGhlc2UgZXZlbnRzIHNob3VsZCBjaGVjayBpZiB0aGV5IGFyZSB0aGUgYWN0aXZlIG9wdGlvbiBhbmQgaWYgY2xpY2tlZCBhZ2FpblxyXG4gICAgLy8gdGhleSBzaG91bGQgZGVhY3RpdmF0ZSBhbmQgcHJlc2VudCB0aGUgb3JpZ2luYWwgaW1hZ2VcclxuICAgIG9wdGlvbnMuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGRlYm91bmNlKChldmVudCkgPT4ge1xyXG4gICAgICAgIGlmIChhY3RpdmVfb3B0aW9uICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGFjdGl2ZV9vcHRpb24uY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdC1vcHRpb25cIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0Lm1hdGNoZXMoXCIjaW52ZXJ0LW9wdGlvblwiKSkge1xyXG4gICAgICAgICAgICBpZiAocmF3X2ltYWdlcyA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJVcGxvYWQgYW4gaW1hZ2UgdG8gdXNlIHRoZXNlIGFsZ29yaXRobXNcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChhY3RpdmVfb3B0aW9uID09PSBpbnZlcnRfb3B0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBkZWFjdGl2YXRlX29wdGlvbihpbnZlcnRfb3B0aW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNoYW5nZV9hY3RpdmVfb3B0aW9uKGludmVydF9vcHRpb24sIGludmVydF9idXR0b24sIGludmVydF9pbmZvKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0b2dnbGVfYWxnb3JpdGhtc19zaWRlYmFyKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaW1hZ2Vfd29ya2VyLnBvc3RNZXNzYWdlKFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJJTlZFUlRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHJhd19pbWFnZXMucHJldmlld19pbWcoKS53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChldmVudC50YXJnZXQubWF0Y2hlcyhcIiNib3gtYmx1ci1vcHRpb25cIikpIHtcclxuICAgICAgICAgICAgaWYgKHJhd19pbWFnZXMgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiVXBsb2FkIGFuIGltYWdlIHRvIHVzZSB0aGVzZSBhbGdvcml0aG1zXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoYWN0aXZlX29wdGlvbiA9PT0gYmx1cl9vcHRpb24pIHtcclxuICAgICAgICAgICAgICAgIGRlYWN0aXZhdGVfb3B0aW9uKGJsdXJfb3B0aW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNoYW5nZV9hY3RpdmVfb3B0aW9uKGJsdXJfb3B0aW9uLCBib3hfYmx1cl9zbGlkZXJfd3JhcHBlciwgYm94X2JsdXJfaW5mbyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdG9nZ2xlX2FsZ29yaXRobXNfc2lkZWJhcigpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHB1dHMgdGhlIGJveCBibHVyIHNsaWRlciBhdCAxIGJlY2F1c2UgdGhlIGRlZmF1bHQgcG9zaXRpb24gaXMgaW4gdGhlIG1pZGRsZVxyXG4gICAgICAgICAgICAgICAgYm94X2JsdXJfc2xpZGVyLnZhbHVlID0gMTtcclxuICAgICAgICAgICAgICAgIGJveF9ibHVyX3ZhbHVlX2VsZW0udmFsdWUgPSBib3hfYmx1cl9zbGlkZXIudmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGtlcm5lbF9zaXplID0gYm94X2JsdXJfc2xpZGVyLnZhbHVlQXNOdW1iZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgaW1hZ2Vfd29ya2VyLnBvc3RNZXNzYWdlKFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJCT1ggQkxVUlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogcmF3X2ltYWdlcy5wcmV2aWV3X2ltZygpLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXJuZWxfc2l6ZToga2VybmVsX3NpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5tYXRjaGVzKFwiI2dhbW1hLW9wdGlvblwiKSkge1xyXG4gICAgICAgICAgICBpZiAocmF3X2ltYWdlcyA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJVcGxvYWQgYW4gaW1hZ2UgdG8gdXNlIHRoZXNlIGFsZ29yaXRobXNcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGFjdGl2ZV9vcHRpb24gPT09IGdhbW1hX29wdGlvbikge1xyXG4gICAgICAgICAgICAgICAgZGVhY3RpdmF0ZV9vcHRpb24oZ2FtbWFfb3B0aW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNoYW5nZV9hY3RpdmVfb3B0aW9uKGdhbW1hX29wdGlvbiwgZ2FtbWFfc2xpZGVyX3dyYXBwZXIsIGdhbW1hX2luZm8pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRvZ2dsZV9hbGdvcml0aG1zX3NpZGViYXIoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBwdXRzIHRoZSBnYW1tYSBzbGlkZXIgYXQgMSBiZWNhdXNlIHRoaXMga2VlcHMgdGhlIGltYWdlIHVuY2hhbmdlZCBcclxuICAgICAgICAgICAgICAgIGdhbW1hX3NsaWRlci52YWx1ZSA9IDE7XHJcbiAgICAgICAgICAgICAgICBnYW1tYV92YWx1ZV9lbGVtLnZhbHVlID0gMTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbWFnZV93b3JrZXIucG9zdE1lc3NhZ2UoXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkdBTU1BXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiByYXdfaW1hZ2VzLnByZXZpZXdfaW1nKCkud2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdhbW1hOiBnYW1tYV9zbGlkZXIudmFsdWVBc051bWJlcixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0Lm1hdGNoZXMoXCIjc29iZWwtb3B0aW9uXCIpKSB7XHJcbiAgICAgICAgICAgIGlmIChyYXdfaW1hZ2VzID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydChcIlVwbG9hZCBhbiBpbWFnZSB0byB1c2UgdGhlc2UgYWxnb3JpdGhtc1wiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoYWN0aXZlX29wdGlvbiA9PT0gc29iZWxfb3B0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBkZWFjdGl2YXRlX29wdGlvbihzb2JlbF9vcHRpb24pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY2hhbmdlX2FjdGl2ZV9vcHRpb24oc29iZWxfb3B0aW9uLCBzb2JlbF9zbGlkZXJfd3JhcHBlciwgc29iZWxfaW5mbyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdG9nZ2xlX2FsZ29yaXRobXNfc2lkZWJhcigpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHN0YXJ0cyBzb2JlbCBkZXRlY3RvciBhdCBoYWxmd2F5IGZvciB0aHJlc2hvbGRcclxuICAgICAgICAgICAgICAgIHNvYmVsX3NsaWRlci52YWx1ZSA9IDEyMztcclxuICAgICAgICAgICAgICAgIHNvYmVsX3RocmVzaG9sZC52YWx1ZSA9IDEyMztcclxuXHJcbiAgICAgICAgICAgICAgICBpbWFnZV93b3JrZXIucG9zdE1lc3NhZ2UoXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlNPQkVMXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiByYXdfaW1hZ2VzLnByZXZpZXdfaW1nKCkud2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocmVzaG9sZDogc29iZWxfc2xpZGVyLnZhbHVlQXNOdW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfSksIDMzKTtcclxuXHJcbiAgICBsZXQgaW52ZXJ0X2J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW52ZXJ0LWJ1dHRvblwiKTtcclxuICAgIGludmVydF9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGRlYm91bmNlKCgpID0+IHtcclxuICAgICAgICBpbWFnZV93b3JrZXIucG9zdE1lc3NhZ2UoXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiSU5WRVJUIEJVVFRPTlwiLFxyXG4gICAgICAgICAgICAgICAgaW1hZ2U6IHJhd19pbWFnZXMub3V0cHV0X2ltZygpLmRhdGEuYnVmZmVyLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IHJhd19pbWFnZXMub3V0cHV0X2ltZygpLndpZHRoLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBbcmF3X2ltYWdlcy5vdXRwdXRfaW1nKCkuZGF0YS5idWZmZXJdXHJcbiAgICAgICAgKTtcclxuICAgIH0pLCAzMyk7XHJcblxyXG4gICAgbGV0IGdhbW1hX3NsaWRlcl93cmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1tYS1zbGlkZXItd3JhcHBlclwiKTtcclxuICAgIGxldCBnYW1tYV9zbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbW1hLXNsaWRlclwiKTtcclxuICAgIGxldCBnYW1tYV92YWx1ZV9lbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1tYS12YWx1ZVwiKTtcclxuICAgIGxldCBnYW1tYV9zbGlkZXJfZnVuYyA9IChldmVudCkgPT4ge1xyXG4gICAgICAgIGxldCBnYW1tYSA9IGV2ZW50LnRhcmdldC52YWx1ZUFzTnVtYmVyO1xyXG4gICAgICAgIGdhbW1hX3ZhbHVlX2VsZW0udmFsdWUgPSBnYW1tYTtcclxuXHJcbiAgICAgICAgLy8gZG9lcyBhIGdhbW1hIHRyYW5zZm9ybWF0aW9uIG9uIGZ1bGwgc2l6ZSBpbWFnZSBwcmV2aWV3IFxyXG4gICAgICAgIGltYWdlX3dvcmtlci5wb3N0TWVzc2FnZShcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJHQU1NQVwiLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IHJhd19pbWFnZXMucHJldmlld19pbWcoKS53aWR0aCxcclxuICAgICAgICAgICAgICAgIGdhbW1hOiBnYW1tYSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICApO1xyXG5cclxuICAgIH1cclxuICAgIGdhbW1hX3NsaWRlci5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgZGVib3VuY2UoZ2FtbWFfc2xpZGVyX2Z1bmMsIDEwMCkpO1xyXG5cclxuICAgIGxldCBib3hfYmx1cl9zbGlkZXJfd3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYm94LWJsdXItc2xpZGVyLXdyYXBwZXJcIik7XHJcbiAgICBsZXQgYm94X2JsdXJfc2xpZGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJib3gtYmx1ci1zbGlkZXJcIik7XHJcbiAgICBsZXQgYm94X2JsdXJfdmFsdWVfZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYm94LWJsdXItdmFsdWVcIik7XHJcbiAgICBsZXQgYm94X3NsaWRlcl9mdW5jID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgbGV0IGtlcm5lbF9zaXplID0gZXZlbnQudGFyZ2V0LnZhbHVlQXNOdW1iZXI7XHJcbiAgICAgICAgYm94X2JsdXJfdmFsdWVfZWxlbS52YWx1ZSA9IGtlcm5lbF9zaXplO1xyXG5cclxuICAgICAgICAvLyBib3ggYmx1cnMgZnVsbCBzaXplIGltYWdlIHByZXZpZXcgXHJcbiAgICAgICAgaW1hZ2Vfd29ya2VyLnBvc3RNZXNzYWdlKFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkJPWCBCTFVSXCIsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogcmF3X2ltYWdlcy5wcmV2aWV3X2ltZygpLndpZHRoLFxyXG4gICAgICAgICAgICAgICAga2VybmVsX3NpemU6IGtlcm5lbF9zaXplLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgYm94X2JsdXJfc2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBkZWJvdW5jZShib3hfc2xpZGVyX2Z1bmMsIDE1MCkpO1xyXG4gICAgLy8gYm94X2JsdXJfc2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgYm94X3NsaWRlcl9mdW5jKTtcclxuXHJcbiAgICBjb25zdCBzb2JlbF9zbGlkZXJfd3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic29iZWwtc2xpZGVyLXdyYXBwZXJcIik7XHJcbiAgICBjb25zdCBzb2JlbF9zbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNvYmVsLXNsaWRlclwiKTsgXHJcbiAgICBsZXQgc29iZWxfdGhyZXNob2xkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzb2JlbC10aHJlc2hvbGRcIik7XHJcbiAgICBzb2JlbF9zbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIGRlYm91bmNlKChldmVudCkgPT4ge1xyXG4gICAgICAgIGxldCB0aHJlc2hvbGQgPSBldmVudC50YXJnZXQudmFsdWVBc051bWJlcjtcclxuICAgICAgICBzb2JlbF90aHJlc2hvbGQudmFsdWUgPSB0aHJlc2hvbGQ7XHJcbiAgICAgICAgaW1hZ2Vfd29ya2VyLnBvc3RNZXNzYWdlKFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlNPQkVMXCIsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogcmF3X2ltYWdlcy5wcmV2aWV3X2ltZygpLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkOiB0aHJlc2hvbGQsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgKTtcclxuICAgIH0pLCAxMDApO1xyXG5cclxuICAgIGZ1bmN0aW9uIHNjYWxlX2ltZ19kaW1lbnNpb25zX3RvX2NhbnZhcyhpbWcsIGNhbnZhcykge1xyXG5cclxuICAgICAgICBsZXQgc2NhbGUgPSAwO1xyXG4gICAgICAgIGxldCBuZXdfaGVpZ2h0ID0gaW1nLmhlaWdodDtcclxuICAgICAgICBsZXQgbmV3X3dpZHRoID0gaW1nLndpZHRoO1xyXG5cclxuICAgICAgICBjb25zdCB3aWR0aF9zY2FsZSA9IGNhbnZhcy5vZmZzZXRXaWR0aCAvIGltZy53aWR0aDtcclxuICAgICAgICBjb25zdCBoZWlnaHRfc2NhbGUgPSBjYW52YXMub2Zmc2V0SGVpZ2h0IC8gaW1nLmhlaWdodDtcclxuXHJcbiAgICAgICAgaWYgKHdpZHRoX3NjYWxlIDwgaGVpZ2h0X3NjYWxlKSB7XHJcbiAgICAgICAgICAgIHNjYWxlID0gd2lkdGhfc2NhbGU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2NhbGUgPSBoZWlnaHRfc2NhbGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY2FudmFzLm9mZnNldFdpZHRoIDwgaW1nLndpZHRoIHx8IGNhbnZhcy5vZmZzZXRIZWlnaHQgPCBpbWcuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIG5ld193aWR0aCA9IE1hdGgucm91bmQoaW1nLndpZHRoICogc2NhbGUpO1xyXG4gICAgICAgICAgICBuZXdfaGVpZ2h0ID0gTWF0aC5yb3VuZChpbWcuaGVpZ2h0ICogc2NhbGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIFtuZXdfd2lkdGgsIG5ld19oZWlnaHRdO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBsZXQgc2lkZWJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2lkZWJhclwiKTtcclxuICAgIGxldCBhbGdvcml0aG1zX2J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3Blbi1hbGdvcml0aG1zXCIpO1xyXG4gICAgbGV0IGFsZ29yaXRobXNfYXJyb3cgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wZW4tYWxnb3JpdGhtcy1hcnJvd1wiKTtcclxuICAgIGFsZ29yaXRobXNfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgICAgdG9nZ2xlX2FsZ29yaXRobXNfc2lkZWJhcigpO1xyXG4gICAgfSk7XHJcbiAgICBmdW5jdGlvbiB0b2dnbGVfYWxnb3JpdGhtc19zaWRlYmFyKCkge1xyXG4gICAgICAgIGlmICh3aW5kb3cubWF0Y2hNZWRpYShcIihtYXgtd2lkdGg6IDc2OHB4KVwiKS5tYXRjaGVzKSB7XHJcbiAgICAgICAgICAgICAgICBzaWRlYmFyLmNsYXNzTGlzdC50b2dnbGUoXCJtb2JpbGUtaGlkZGVuXCIpO1xyXG4gICAgICAgICAgICAgICAgc2lkZWJhci5jbGFzc0xpc3QudG9nZ2xlKFwibW9iaWxlLXZpc2libGVcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgYWxnb3JpdGhtc19hcnJvdy5jbGFzc0xpc3QudG9nZ2xlKFwiZmEtYW5nbGUtcmlnaHRcIik7XHJcbiAgICAgICAgICAgICAgICBhbGdvcml0aG1zX2Fycm93LmNsYXNzTGlzdC50b2dnbGUoXCJmYS1hbmdsZS1kb3duXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubWFpbigpO1xyXG4iLCIvLyBpbXBvcnQgeyByZXNpemVfaW1nIH0gZnJvbSBcIi4uL3dhc20vcHJvYy5qc1wiO1xyXG5cclxuY29uc3QgbWF4X2RpbWVuc2lvbiA9IDE1MDA7XHJcblxyXG5leHBvcnQgY2xhc3MgUmF3SW1hZ2Uge1xyXG4gICAgY29uc3RydWN0b3Iob3JpZ2luYWxfaW1nLCBjYW52YXMpIHtcclxuICAgICAgICB0aGlzLm91dHB1dF9pbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgICAgIHRoaXMub3JpZ2luYWxfaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgICAgICB0aGlzLnByZXZpZXdfaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcmV2aWV3X2ltYWdlX2N0eCA9IHRoaXMucHJldmlld19pbWFnZS5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICAgICAgdGhpcy5vdXRwdXRfaW1hZ2VfY3R4ID0gdGhpcy5vdXRwdXRfaW1hZ2UuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgICAgIHRoaXMub3JpZ2luYWxfaW1hZ2VfY3R4ID0gdGhpcy5vcmlnaW5hbF9pbWFnZS5nZXRDb250ZXh0KFwiMmRcIik7XHJcblxyXG4gICAgICAgIC8vIHRoaXMgcGFydCBnZXRzIHRoZSByYXcgaW1hZ2UgZGF0YSBieSB1c2luZyBhbiBvZmYgc2NyZWVuIGNhbnZhc1xyXG4gICAgICAgIC8vIHJlc2l6ZXMgdGhlIGNhbnZhcyB0byBpbWFnZSBkaW1lbnNpb25zIHNvIHRoYXQgaW1hZ2UgaXNuJ3QgY2xpcHBlZFxyXG4gICAgICAgIC8vIHdoZW4gY2FsbGluZyBnZXRJbWFnZURhdGEoKVxyXG4gICAgICAgIHRoaXMub3V0cHV0X2ltYWdlLndpZHRoID0gb3JpZ2luYWxfaW1nLndpZHRoO1xyXG4gICAgICAgIHRoaXMub3V0cHV0X2ltYWdlLmhlaWdodCA9IG9yaWdpbmFsX2ltZy5oZWlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMub3JpZ2luYWxfaW1hZ2Uud2lkdGggPSBvcmlnaW5hbF9pbWcud2lkdGg7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbF9pbWFnZS5oZWlnaHQgPSBvcmlnaW5hbF9pbWcuaGVpZ2h0O1xyXG5cclxuICAgICAgICB0aGlzLm91dHB1dF9pbWFnZV9jdHguZHJhd0ltYWdlKG9yaWdpbmFsX2ltZywgMCwgMCk7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbF9pbWFnZV9jdHguZHJhd0ltYWdlKG9yaWdpbmFsX2ltZywgMCwgMCk7XHJcbiAgICAgICAgdGhpcy5wcmV2aWV3X2ltYWdlLm9mZnNldEhlaWdodFxyXG4gICAgICAgIGxldCBbcHJldmlld193aWR0aCwgcHJldmlld19oZWlnaHRdID0gXHJcbiAgICAgICAgICAgIHJlc2l6ZV9wcmV2aWV3X2ltYWdlKFxyXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxfaW1nLCBcclxuICAgICAgICAgICAgICAgIG1heF9kaW1lbnNpb25cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB0aGlzLnByZXZpZXdfaW1hZ2Uud2lkdGggPSBwcmV2aWV3X3dpZHRoO1xyXG4gICAgICAgIHRoaXMucHJldmlld19pbWFnZS5oZWlnaHQgPSBwcmV2aWV3X2hlaWdodDtcclxuICAgICAgICB0aGlzLm91dHB1dF9pbWFnZS53aWR0aCA9IHByZXZpZXdfd2lkdGg7XHJcbiAgICAgICAgdGhpcy5vdXRwdXRfaW1hZ2UuaGVpZ2h0ID0gcHJldmlld19oZWlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMucHJldmlld19pbWFnZV9jdHguZHJhd0ltYWdlKG9yaWdpbmFsX2ltZywgMCwgMCwgcHJldmlld193aWR0aCwgcHJldmlld19oZWlnaHQpO1xyXG4gICAgICAgIHRoaXMub3V0cHV0X2ltYWdlX2N0eC5kcmF3SW1hZ2Uob3JpZ2luYWxfaW1nLCAwLCAwLCBwcmV2aWV3X3dpZHRoLCBwcmV2aWV3X2hlaWdodCk7XHJcblxyXG4gICAgICAgIC8vIHRoaXMub3V0cHV0X2ltYWdlID0gb3V0cHV0X2ltZ19jdHguZ2V0SW1hZ2VEYXRhKFxyXG4gICAgICAgIC8vICAgICAwLCBcclxuICAgICAgICAvLyAgICAgMCwgXHJcbiAgICAgICAgLy8gICAgIG91dHB1dF9pbWcud2lkdGgsIFxyXG4gICAgICAgIC8vICAgICBvdXRwdXRfaW1nLmhlaWdodFxyXG4gICAgICAgIC8vICk7XHJcbiAgICAgICAgLy8gdGhpcy5vcmlnaW5hbF9pbWFnZSA9IGltZ19jdHguZ2V0SW1hZ2VEYXRhKFxyXG4gICAgICAgIC8vICAgICAwLCBcclxuICAgICAgICAvLyAgICAgMCwgXHJcbiAgICAgICAgLy8gICAgIGltZy53aWR0aCwgXHJcbiAgICAgICAgLy8gICAgIGltZy5oZWlnaHRcclxuICAgICAgICAvLyApO1xyXG5cclxuICAgICAgICAvLyBjb25zdCBbcmVzaXplZF9pbWdfd2lkdGgsIHJlc2l6ZWRfaW1nX2hlaWdodF0gPSBcclxuICAgICAgICAvLyAgICAgdGhpcy5zY2FsZV9pbWdfZGltZW5zaW9uc190b19jYW52YXMoaW1nLCBjYW52YXMpO1xyXG4gICAgICAgIC8vIC8vIHRoaXMgaW1hZ2Ugd2lsbCBiZSB0aGUgb25lIHRoYXQgZ2V0cyBwcm9jZXNzZWQgc28gdGhlcmUgaXNuJ3QgYSBuZWVkXHJcbiAgICAgICAgLy8gLy8gdG8gY29uc3RhbnRseSByZXNpemUgdGhlIG9yaWdpbmFsIGltYWdlIG9uIGV2ZXJ5IHByb2Nlc3NpbmcgZnVuY3Rpb25cclxuICAgICAgICAvLyBjb25zdCBvdXRwdXRfaW1hZ2VfcmVzaXplZF9yYXcgPSBuZXcgVWludDhDbGFtcGVkQXJyYXkoXHJcbiAgICAgICAgLy8gICAgIHJlc2l6ZV9pbWcoXHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLm91dHB1dF9pbWFnZS5kYXRhLCBcclxuICAgICAgICAvLyAgICAgICAgIHRoaXMub3V0cHV0X2ltYWdlLndpZHRoLCBcclxuICAgICAgICAvLyAgICAgICAgIHJlc2l6ZWRfaW1nX3dpZHRoLCBcclxuICAgICAgICAvLyAgICAgICAgIHJlc2l6ZWRfaW1nX2hlaWdodFxyXG4gICAgICAgIC8vICAgICApXHJcbiAgICAgICAgLy8gKTtcclxuICAgICAgICAvLyB0aGlzLm91dHB1dF9pbWFnZV9yZXNpemVkID0gbmV3IEltYWdlRGF0YShcclxuICAgICAgICAvLyAgICAgb3V0cHV0X2ltYWdlX3Jlc2l6ZWRfcmF3LCBcclxuICAgICAgICAvLyAgICAgcmVzaXplZF9pbWdfd2lkdGhcclxuICAgICAgICAvLyApO1xyXG4gICAgICAgIC8vIG1ha2UgdGhpcyBtb3JlIHBlcmZvcm1hbnRcclxuICAgICAgICAvLyBsZXQgbHVtYV9pbWdfZGF0YSA9IGNoYW5nZV90b19ncmF5c2NhbGUob3JpZ2luYWxfaW1nX2RhdGEpO1xyXG4gICAgICAgIC8vIGxldCBvdXRwdXRfbHVtYV9kYXRhID0gY2hhbmdlX3RvX2dyYXlzY2FsZShvdXRwdXRfaW1nX2RhdGEpO1xyXG5cclxuICAgICAgICAvLyBwdXRfaW1hZ2VfZGF0YV9jYW52YXMobHVtYV9pbWdfZGF0YSwgaW5wdXRfY3R4KTtcclxuXHJcbiAgICAgICAgLy8gb3JpZ2luYWxfaW1nX2RhdGEgPSBsdW1hX2ltZ19kYXRhO1xyXG4gICAgICAgIC8vIG91dHB1dF9pbWdfZGF0YSA9IG91dHB1dF9sdW1hX2RhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgb3JpZ2luYWxfaW1nKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9yaWdpbmFsX2ltYWdlX2N0eC5nZXRJbWFnZURhdGEoXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luYWxfaW1hZ2Uud2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luYWxfaW1hZ2UuaGVpZ2h0LFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBvcmlnaW5hbF9pbWdfY2FudmFzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9yaWdpbmFsX2ltYWdlO1xyXG4gICAgfVxyXG5cclxuICAgIG91dHB1dF9pbWdfY2FudmFzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm91dHB1dF9pbWFnZTtcclxuICAgIH1cclxuICAgIG91dHB1dF9pbWcoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3V0cHV0X2ltYWdlX2N0eC5nZXRJbWFnZURhdGEoXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIHRoaXMub3V0cHV0X2ltYWdlLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLm91dHB1dF9pbWFnZS5oZWlnaHQsXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwcmV2aWV3X2ltZ19jYW52YXMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJldmlld19pbWFnZTtcclxuICAgIH1cclxuICAgIHByZXZpZXdfaW1nKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByZXZpZXdfaW1hZ2VfY3R4LmdldEltYWdlRGF0YShcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgIHRoaXMucHJldmlld19pbWFnZS53aWR0aCxcclxuICAgICAgICAgICAgdGhpcy5wcmV2aWV3X2ltYWdlLmhlaWdodCxcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHNldF9vdXRwdXRfaW1hZ2UoaW1hZ2UpIHtcclxuICAgICAgICB0aGlzLm91dHB1dF9pbWFnZV9jdHgucHV0SW1hZ2VEYXRhKGltYWdlLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRfb3V0cHV0X2ltYWdlX3RvX29yaWdpbmFsKCkge1xyXG4gICAgICAgIHRoaXMuc2V0X291dHB1dF9pbWFnZSh0aGlzLm9yaWdpbmFsX2ltZygpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBzZXRfb3JpZ2luYWxfaW1hZ2UoaW1hZ2UpIHtcclxuICAgIC8vICAgICB0aGlzLm9yaWdpbmFsX2ltYWdlID0gaW1hZ2U7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gc2NhbGVfaW1nX2RpbWVuc2lvbnNfdG9fY2FudmFzKGltZywgY2FudmFzKSB7XHJcblxyXG4gICAgLy8gICAgIGxldCBzY2FsZSA9IDA7XHJcbiAgICAvLyAgICAgbGV0IG5ld19oZWlnaHQgPSBpbWcuaGVpZ2h0O1xyXG4gICAgLy8gICAgIGxldCBuZXdfd2lkdGggPSBpbWcud2lkdGg7XHJcblxyXG4gICAgLy8gICAgIGNvbnN0IHdpZHRoX3NjYWxlID0gY2FudmFzLm9mZnNldFdpZHRoIC8gaW1nLndpZHRoO1xyXG4gICAgLy8gICAgIGNvbnN0IGhlaWdodF9zY2FsZSA9IGNhbnZhcy5vZmZzZXRIZWlnaHQgLyBpbWcuaGVpZ2h0O1xyXG5cclxuICAgIC8vICAgICBpZiAod2lkdGhfc2NhbGUgPCBoZWlnaHRfc2NhbGUpIHtcclxuICAgIC8vICAgICAgICAgc2NhbGUgPSB3aWR0aF9zY2FsZTtcclxuICAgIC8vICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICBzY2FsZSA9IGhlaWdodF9zY2FsZTtcclxuICAgIC8vICAgICB9XHJcblxyXG4gICAgLy8gICAgIGlmIChjYW52YXMub2Zmc2V0V2lkdGggPCBpbWcud2lkdGggfHwgY2FudmFzLm9mZnNldEhlaWdodCA8IGltZy5oZWlnaHQpIHtcclxuICAgIC8vICAgICAgICAgbmV3X3dpZHRoID0gTWF0aC5yb3VuZChpbWcud2lkdGggKiBzY2FsZSk7XHJcbiAgICAvLyAgICAgICAgIG5ld19oZWlnaHQgPSBNYXRoLnJvdW5kKGltZy5oZWlnaHQgKiBzY2FsZSk7XHJcbiAgICAvLyAgICAgfVxyXG5cclxuICAgIC8vICAgICByZXR1cm4gW25ld193aWR0aCwgbmV3X2hlaWdodF07XHJcbiAgICAvLyB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc2l6ZV9wcmV2aWV3X2ltYWdlKGltZywgbWF4X2xvbmdfZWRnZSkge1xyXG4gICAgbGV0IHNjYWxlID0gMDtcclxuICAgIGxldCBuZXdfaGVpZ2h0ID0gaW1nLmhlaWdodDtcclxuICAgIGxldCBuZXdfd2lkdGggPSBpbWcud2lkdGg7XHJcblxyXG4gICAgY29uc3Qgd2lkdGhfc2NhbGUgPSBtYXhfbG9uZ19lZGdlIC8gaW1nLndpZHRoO1xyXG4gICAgY29uc3QgaGVpZ2h0X3NjYWxlID0gbWF4X2xvbmdfZWRnZSAvIGltZy5oZWlnaHQ7XHJcblxyXG4gICAgaWYgKHdpZHRoX3NjYWxlIDwgaGVpZ2h0X3NjYWxlKSB7XHJcbiAgICAgICAgc2NhbGUgPSB3aWR0aF9zY2FsZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2NhbGUgPSBoZWlnaHRfc2NhbGU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1heF9sb25nX2VkZ2UgPCBpbWcud2lkdGggfHwgbWF4X2xvbmdfZWRnZSA8IGltZy5oZWlnaHQpIHtcclxuICAgICAgICBuZXdfd2lkdGggPSBNYXRoLnJvdW5kKGltZy53aWR0aCAqIHNjYWxlKTtcclxuICAgICAgICBuZXdfaGVpZ2h0ID0gTWF0aC5yb3VuZChpbWcuaGVpZ2h0ICogc2NhbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBbbmV3X3dpZHRoLCBuZXdfaGVpZ2h0XTtcclxufSJdLCJzb3VyY2VSb290IjoiIn0=


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
    let blur_option = document.getElementById("blur-options");
    let gamma_option = document.getElementById("gamma-option");
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
        if (event.target.matches("#blur-options")) {
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
    gamma_slider.addEventListener("input", debounce(gamma_slider_func, 51));

    let box_blur_slider_wrapper = document.getElementById("box-blur-slider-wrapper");
    let box_blur_slider = document.getElementById("box-blur-slider");
    let box_blur_value_elem = document.getElementById("box-blur-value");
    let box_slider_func = (event) => {
        // function slider_func(event) {
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

    box_blur_slider.addEventListener("input", debounce(box_slider_func, 51));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vZnJvbnRlbmQvanMvZHJhd19jYW52YXNlcy5qcyIsIndlYnBhY2s6Ly8vLi9mcm9udGVuZC9qcy9tYWluLmpzIiwid2VicGFjazovLy8uL2Zyb250ZW5kL2pzL3Jhd19pbWFnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQSxXQUFXLGFBQWE7QUFDakI7QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7O0FDckhBO0FBQUE7QUFBQTtBQUFrRDtBQUNSOztBQUUxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsbUJBQW1CO0FBQzlDO0FBQ0E7QUFDQSw4QkFBOEIsbUJBQW1CO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixtQkFBbUI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsbUJBQW1CO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0VBQW9FLG1CQUFtQjtBQUN2RjtBQUNBOzs7QUFHQSw4QkFBOEIsOERBQVk7QUFDMUM7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw2QkFBNkIsc0RBQVE7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBOztBQUVBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZEOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxzREFBc0Q7QUFDdEQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7O0FBRUE7O0FBRUEsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7OztBQzlhQTtBQUFBO0FBQUEsV0FBVyxhQUFhOztBQUV4Qjs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vZnJvbnRlbmQvanMvbWFpbi5qc1wiKTtcbiIsIi8vIGltcG9ydCB7IHJlc2l6ZV9pbWcgfSBmcm9tIFwiLi4vd2FzbS9wcm9jLmpzXCI7XHJcbmV4cG9ydCBjbGFzcyBEcmF3Q2FudmFzZXMge1xyXG4gICAgY29uc3RydWN0b3IoaW5wdXRfY2FudmFzKSB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzZWRfaW1hZ2VfY2FudmFzID0gaW5wdXRfY2FudmFzO1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2VkX2ltYWdlX2N0eCA9IGlucHV0X2NhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZGlzcGxheXMgaW1hZ2Ugd2hlbiB1cGxvYWRpbmcgYSBuZXcgaW1hZ2VcclxuICAgIGRpc3BsYXlfaW1hZ2UoaHRtbF9pbWcpIHtcclxuICAgICAgICAvLyB0aGlzIHNlcXVlbmNlIHNjYWxlcyB0aGUgaW1hZ2UgdXAgb3IgZG93biB0byBmaXQgaW50byBjYW52YXMgZWxlbWVudFxyXG4gICAgICAgIC8vIGNvbnNpZGVyIHNjYWxpbmcgdG8gYSBwZXJjZW50YWdlIG9mIHRoZSBjYW52YXNcclxuICAgICAgICBjb25zdCBbcmVzaXplZF93aWR0aCwgcmVzaXplZF9oZWlnaHRdID1cclxuICAgICAgICAgICAgdGhpcy5zY2FsZV9pbWdfZGltZW5zaW9uc190b19jYW52YXMoaHRtbF9pbWcsIHRoaXMucHJvY2Vzc2VkX2ltYWdlX2NhbnZhcyk7XHJcblxyXG4gICAgICAgIC8vIHJlc2l6ZSB0aGUgY2FudmFzIHRvIGZpdCBpbnRvIGNhbnZhcyBlbGVtZW50IHNpemVcclxuICAgICAgICB0aGlzLnByb2Nlc3NlZF9pbWFnZV9jYW52YXMud2lkdGggPSB0aGlzLnByb2Nlc3NlZF9pbWFnZV9jYW52YXMub2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzZWRfaW1hZ2VfY2FudmFzLmhlaWdodCA9IHRoaXMucHJvY2Vzc2VkX2ltYWdlX2NhbnZhcy5vZmZzZXRIZWlnaHQ7XHJcblxyXG4gICAgICAgIC8vIHRoZXNlIHR3byB2YXJpYWJsZXMgY2VudGVyIHRoZSBpbWFnZSB3aXRoaW4gdGhlIGNhbnZhc1xyXG4gICAgICAgIGNvbnN0IGNlbnRlcl94ID0gKHRoaXMucHJvY2Vzc2VkX2ltYWdlX2NhbnZhcy53aWR0aCAtIHJlc2l6ZWRfd2lkdGgpIC8gMjtcclxuICAgICAgICBjb25zdCBjZW50ZXJfeSA9ICh0aGlzLnByb2Nlc3NlZF9pbWFnZV9jYW52YXMuaGVpZ2h0IC0gcmVzaXplZF9oZWlnaHQpIC8gMjtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9jZXNzZWRfaW1hZ2VfY3R4LmRyYXdJbWFnZShcclxuICAgICAgICAgICAgaHRtbF9pbWcsXHJcbiAgICAgICAgICAgIGNlbnRlcl94LFxyXG4gICAgICAgICAgICBjZW50ZXJfeSxcclxuICAgICAgICAgICAgcmVzaXplZF93aWR0aCxcclxuICAgICAgICAgICAgcmVzaXplZF9oZWlnaHQsXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgc2NhbGVfaW1nX2RpbWVuc2lvbnNfdG9fY2FudmFzKGltZywgY2FudmFzKSB7XHJcblxyXG4gICAgICAgIGxldCBzY2FsZSA9IDA7XHJcbiAgICAgICAgbGV0IG5ld19oZWlnaHQgPSBpbWcuaGVpZ2h0O1xyXG4gICAgICAgIGxldCBuZXdfd2lkdGggPSBpbWcud2lkdGg7XHJcblxyXG4gICAgICAgIGNvbnN0IHdpZHRoX3NjYWxlID0gY2FudmFzLm9mZnNldFdpZHRoIC8gaW1nLndpZHRoO1xyXG4gICAgICAgIGNvbnN0IGhlaWdodF9zY2FsZSA9IGNhbnZhcy5vZmZzZXRIZWlnaHQgLyBpbWcuaGVpZ2h0O1xyXG5cclxuICAgICAgICBpZiAod2lkdGhfc2NhbGUgPCBoZWlnaHRfc2NhbGUpIHtcclxuICAgICAgICAgICAgc2NhbGUgPSB3aWR0aF9zY2FsZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzY2FsZSA9IGhlaWdodF9zY2FsZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjYW52YXMub2Zmc2V0V2lkdGggPCBpbWcud2lkdGggfHwgY2FudmFzLm9mZnNldEhlaWdodCA8IGltZy5oZWlnaHQpIHtcclxuICAgICAgICAgICAgbmV3X3dpZHRoID0gTWF0aC5yb3VuZChpbWcud2lkdGggKiBzY2FsZSk7XHJcbiAgICAgICAgICAgIG5ld19oZWlnaHQgPSBNYXRoLnJvdW5kKGltZy5oZWlnaHQgKiBzY2FsZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gW25ld193aWR0aCwgbmV3X2hlaWdodF07XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1dF9pbWFnZShpbWcpIHtcclxuICAgICAgICAvLyByZXNpemUgY2FudmFzZXMgdG8gZml0IHRoZWlyIG5ldyBvZmZzZXQgd2lkdGggYW5kIGhlaWdodFxyXG4gICAgICAgIHRoaXMucmVzaXplX2NhbnZhc2VzKCk7XHJcblxyXG4gICAgICAgIC8vIGZpbmQgbmV3IG9yaWdpbiB0byBjZW50ZXIgaW1hZ2Ugb24gY2FudmFzXHJcbiAgICAgICAgbGV0IGNlbnRlcl94ID0gKHRoaXMucHJvY2Vzc2VkX2ltYWdlX2NhbnZhcy53aWR0aCAtIGltZy53aWR0aCkgLyAyO1xyXG4gICAgICAgIGxldCBjZW50ZXJfeSA9ICh0aGlzLnByb2Nlc3NlZF9pbWFnZV9jYW52YXMuaGVpZ2h0IC0gaW1nLmhlaWdodCkgLyAyO1xyXG5cclxuICAgICAgICAvLyBsZXQgb3JpZ2luYWxfZGF0YSA9IG5ldyBJbWFnZURhdGEocmVzaXplZF9pbWcsIHJlc2l6ZWRfaW1nX3dpZHRoKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9jZXNzZWRfaW1hZ2VfY3R4LnB1dEltYWdlRGF0YShcclxuICAgICAgICAgICAgaW1nLFxyXG4gICAgICAgICAgICBjZW50ZXJfeCxcclxuICAgICAgICAgICAgY2VudGVyX3ksXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIGltZy53aWR0aCxcclxuICAgICAgICAgICAgaW1nLmhlaWdodCxcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGRyYXcgaW1hZ2Ugd2hlbiBzaG93aW5nIHByb2Nlc3NlZCBvdXRwdXQgb3IgdGhlIG9yaWdpbmFsIGltYWdlXHJcbiAgICBkcmF3X2ltYWdlKGltYWdlX2NhbnZhcykge1xyXG5cclxuICAgICAgICAvLyByZXNpemUgdGhlIGNhbnZhcyB0byBmaXQgaW50byBjYW52YXMgZWxlbWVudCBzaXplXHJcbiAgICAgICAgdGhpcy5wcm9jZXNzZWRfaW1hZ2VfY2FudmFzLndpZHRoID0gdGhpcy5wcm9jZXNzZWRfaW1hZ2VfY2FudmFzLm9mZnNldFdpZHRoO1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2VkX2ltYWdlX2NhbnZhcy5oZWlnaHQgPSB0aGlzLnByb2Nlc3NlZF9pbWFnZV9jYW52YXMub2Zmc2V0SGVpZ2h0O1xyXG5cclxuICAgICAgICBjb25zdCBbcmVzaXplZF93aWR0aCwgcmVzaXplZF9oZWlnaHRdID1cclxuICAgICAgICAgICAgdGhpcy5zY2FsZV9pbWdfZGltZW5zaW9uc190b19jYW52YXMoXHJcbiAgICAgICAgICAgICAgICBpbWFnZV9jYW52YXMsXHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NlZF9pbWFnZV9jYW52YXNcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gdGhlc2UgdHdvIHZhcmlhYmxlcyBjZW50ZXIgdGhlIGltYWdlIHdpdGhpbiB0aGUgY2FudmFzXHJcbiAgICAgICAgY29uc3QgY2VudGVyX3ggPSAodGhpcy5wcm9jZXNzZWRfaW1hZ2VfY2FudmFzLndpZHRoIC0gcmVzaXplZF93aWR0aCkgLyAyO1xyXG4gICAgICAgIGNvbnN0IGNlbnRlcl95ID0gKHRoaXMucHJvY2Vzc2VkX2ltYWdlX2NhbnZhcy5oZWlnaHQgLSByZXNpemVkX2hlaWdodCkgLyAyO1xyXG5cclxuICAgICAgICB0aGlzLnByb2Nlc3NlZF9pbWFnZV9jdHguZHJhd0ltYWdlKFxyXG4gICAgICAgICAgICBpbWFnZV9jYW52YXMsXHJcbiAgICAgICAgICAgIGNlbnRlcl94LFxyXG4gICAgICAgICAgICBjZW50ZXJfeSxcclxuICAgICAgICAgICAgcmVzaXplZF93aWR0aCxcclxuICAgICAgICAgICAgcmVzaXplZF9oZWlnaHQsXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICByZXNpemVfY2FudmFzZXMoKSB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzZWRfaW1hZ2VfY2FudmFzLndpZHRoID0gdGhpcy5wcm9jZXNzZWRfaW1hZ2VfY2FudmFzLm9mZnNldFdpZHRoO1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2VkX2ltYWdlX2NhbnZhcy5oZWlnaHQgPSB0aGlzLnByb2Nlc3NlZF9pbWFnZV9jYW52YXMub2Zmc2V0SGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIGRpc3BsYXlfb25seV9wcm9jZXNzZWRfaW1hZ2UoKSB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzZWRfaW1hZ2VfY2FudmFzLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmUtY2FudmFzZXNcIik7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzZWRfaW1hZ2VfY2FudmFzLmNsYXNzTGlzdC5hZGQoXCJvbmUtYWN0aXZlLWNhbnZhc1wiKTtcclxuICAgIH1cclxuXHJcbiAgICBkaXNwbGF5X29yaWdpbmFsX2ltYWdlX2NhbnZhcygpIHtcclxuICAgICAgICB0aGlzLnByb2Nlc3NlZF9pbWFnZV9jYW52YXMuY2xhc3NMaXN0LmFkZChcImFjdGl2ZS1jYW52YXNlc1wiKTtcclxuICAgICAgICB0aGlzLnByb2Nlc3NlZF9pbWFnZV9jYW52YXMuY2xhc3NMaXN0LnJlbW92ZShcIm9uZS1hY3RpdmUtY2FudmFzXCIpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgRHJhd0NhbnZhc2VzIH0gZnJvbSBcIi4vZHJhd19jYW52YXNlcy5qc1wiO1xyXG5pbXBvcnQgeyBSYXdJbWFnZSB9IGZyb20gXCIuL3Jhd19pbWFnZS5qc1wiO1xyXG5cclxuY29uc3QgZGVib3VuY2UgPSAoZnVuYywgZGVsYXkpID0+IHtcclxuICAgIGxldCBpbkRlYm91bmNlO1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjb25zdCBjb250ZXh0ID0gdGhpcztcclxuICAgICAgICBjb25zdCBhcmdzID0gYXJndW1lbnRzO1xyXG4gICAgICAgIGNsZWFyVGltZW91dChpbkRlYm91bmNlKTtcclxuICAgICAgICBpbkRlYm91bmNlID0gc2V0VGltZW91dCgoKSA9PiBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpLCBkZWxheSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHRocm90dGxlID0gKGZ1bmMsIGxpbWl0KSA9PiB7XHJcbiAgICBsZXQgbGFzdEZ1bmM7XHJcbiAgICBsZXQgbGFzdFJhbjtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc3QgY29udGV4dCA9IHRoaXM7XHJcbiAgICAgICAgY29uc3QgYXJncyA9IGFyZ3VtZW50cztcclxuICAgICAgICBpZiAoIWxhc3RSYW4pIHtcclxuICAgICAgICAgICAgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuICAgICAgICAgICAgbGFzdFJhbiA9IERhdGUubm93KCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGxhc3RGdW5jKTtcclxuICAgICAgICAgICAgbGFzdEZ1bmMgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmICgoRGF0ZS5ub3coKSAtIGxhc3RSYW4pID49IGxpbWl0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcclxuICAgICAgICAgICAgICAgICAgICBsYXN0UmFuID0gRGF0ZS5ub3coKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgbGltaXQgLSAoRGF0ZS5ub3coKSAtIGxhc3RSYW4pKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1haW4oKSB7XHJcbiAgICBsZXQgaW1hZ2Vfd29ya2VyID0gbmV3IFdvcmtlcihcIi4vanMvZGlzdC9idW5kbGVfd29ya2VyLmpzXCIpO1xyXG4gICAgaW1hZ2Vfd29ya2VyLm9ubWVzc2FnZSA9IGV2ZW50ID0+IHtcclxuICAgICAgICBpZiAoZXZlbnQuZGF0YS5tZXNzYWdlID09PSBcIndhc20gSU5JVElBTElaRURcIikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgJHtldmVudC5kYXRhLm1lc3NhZ2V9YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGV2ZW50LmRhdGEubWVzc2FnZSA9PT0gXCJJTlZFUlRFRFwiKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGAke2V2ZW50LmRhdGEubWVzc2FnZX1gKTtcclxuICAgICAgICAgICAgbGV0IGltYWdlID0gbmV3IEltYWdlRGF0YShcclxuICAgICAgICAgICAgICAgIG5ldyBVaW50OENsYW1wZWRBcnJheShldmVudC5kYXRhLmltYWdlKSwgZXZlbnQuZGF0YS53aWR0aFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICByYXdfaW1hZ2VzLnNldF9vdXRwdXRfaW1hZ2UoXHJcbiAgICAgICAgICAgICAgICBpbWFnZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBkcmF3X2NhbnZhc2VzLmRyYXdfaW1hZ2UocmF3X2ltYWdlcy5vdXRwdXRfaW1nX2NhbnZhcygpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZXZlbnQuZGF0YS5tZXNzYWdlID09PSBcIkJPWCBCTFVSXCIpIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYCR7ZXZlbnQuZGF0YS5tZXNzYWdlfWApO1xyXG4gICAgICAgICAgICBsZXQgaW1hZ2UgPSBuZXcgSW1hZ2VEYXRhKFxyXG4gICAgICAgICAgICAgICAgbmV3IFVpbnQ4Q2xhbXBlZEFycmF5KGV2ZW50LmRhdGEuaW1hZ2UpLCBldmVudC5kYXRhLndpZHRoXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHJhd19pbWFnZXMuc2V0X291dHB1dF9pbWFnZShpbWFnZSk7XHJcbiAgICAgICAgICAgIGRyYXdfY2FudmFzZXMuZHJhd19pbWFnZShyYXdfaW1hZ2VzLm91dHB1dF9pbWdfY2FudmFzKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChldmVudC5kYXRhLm1lc3NhZ2UgPT09IFwiR0FNTUFcIikge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgJHtldmVudC5kYXRhLm1lc3NhZ2V9YCk7XHJcbiAgICAgICAgICAgIGxldCBpbWFnZSA9IG5ldyBJbWFnZURhdGEoXHJcbiAgICAgICAgICAgICAgICBuZXcgVWludDhDbGFtcGVkQXJyYXkoZXZlbnQuZGF0YS5pbWFnZSksIGV2ZW50LmRhdGEud2lkdGhcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgcmF3X2ltYWdlcy5zZXRfb3V0cHV0X2ltYWdlKGltYWdlKTtcclxuICAgICAgICAgICAgZHJhd19jYW52YXNlcy5kcmF3X2ltYWdlKHJhd19pbWFnZXMub3V0cHV0X2ltZ19jYW52YXMoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgdW5yZWNvZ25pemVkIG1lc3NhZ2UgZnJvbSB3ZWIgd29ya2VyOiAke2V2ZW50LmRhdGEubWVzc2FnZX1gKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBjb25zdCBkcmF3X2NhbnZhc2VzID0gbmV3IERyYXdDYW52YXNlcyhcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImlucHV0LWNhbnZhc1wiKVxyXG4gICAgKTtcclxuXHJcbiAgICBsZXQgcmF3X2ltYWdlcyA9IG51bGw7XHJcblxyXG4gICAgbGV0IG9yaWdpbmFsX2ltZyA9IG5ldyBJbWFnZSgpO1xyXG5cclxuICAgIC8vIHRha2VzIHRoZSBpbWFnZSB1cmwgYW5kIGRpc3BsYXlzIGl0IG9uIGJvdGggY2FudmFzXHJcbiAgICBmdW5jdGlvbiBpbXBvcnRfYW5kX2Rpc3BsYXkoaW1hZ2VfdXJsKSB7XHJcbiAgICAgICAgb3JpZ2luYWxfaW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGRyYXdfY2FudmFzZXMuZGlzcGxheV9pbWFnZShvcmlnaW5hbF9pbWcpO1xyXG5cclxuICAgICAgICAgICAgcmF3X2ltYWdlcyA9IG5ldyBSYXdJbWFnZShcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsX2ltZyxcclxuICAgICAgICAgICAgICAgIGRyYXdfY2FudmFzZXMucHJvY2Vzc2VkX2ltYWdlX2NhbnZhcyxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgaW1hZ2Vfd29ya2VyLnBvc3RNZXNzYWdlKFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVVNFUiBJTUFHRVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGltYWdlOiByYXdfaW1hZ2VzLnByZXZpZXdfaW1nKCkuZGF0YS5idWZmZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHJhd19pbWFnZXMucHJldmlld19pbWcoKS53aWR0aCxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBbcmF3X2ltYWdlcy5vcmlnaW5hbF9pbWcoKS5kYXRhLmJ1ZmZlcl1cclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgb3JpZ2luYWxfaW1nLnNyYyA9IHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGltYWdlX3VybCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaGFuZGxlcyBnZXR0aW5nIGEgbmV3IGltYWdlXHJcbiAgICAvLyBoYXZlIHRvIGFkZCBjaGVja3MgdGhhdCBvbmx5IGdldCBqcGcgYW5kIHBuZyBpbWFnZXNcclxuICAgIGxldCBmaWxlX2lucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmaWxlLWlucHV0XCIpO1xyXG4gICAgZmlsZV9pbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsICgpID0+IHtcclxuICAgICAgICBsZXQgaW1hZ2UgPSBmaWxlX2lucHV0LmZpbGVzWzBdO1xyXG4gICAgICAgIGltcG9ydF9hbmRfZGlzcGxheShpbWFnZSk7XHJcblxyXG4gICAgICAgIGZpbGVfaW5wdXQudmFsdWUgPSBudWxsO1xyXG4gICAgICAgIGxhcmdlX3VwbG9hZF9idXR0b24uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIC8vIGRlc2VsZWN0cyBhbnkgYWN0aXZlIG9wdGlvbiBhbmQgaGlkZXMgYW55IHNsaWRlcnNcclxuICAgICAgICAvLyB0aGF0IHdlcmUgaW4gZWZmZWN0IGlmIHVzZXIgaXMgc2VsZWN0aW5nIGEgbmV3IGltYWdlXHJcbiAgICAgICAgLy8gdGhpcyB3aWxsIG5lZWQgc29tZSBtb3JlIHdvcmtpbmcgaWYgSSBkZWNpZGUgdG9cclxuICAgICAgICAvLyBtYWtlIGFjdGl2ZV9pbnB1dCBhbmQgYWN0aXZlX29wdGlvbiBudWxsIGNhcGFibGVcclxuICAgICAgICAvLyB2YXJpYWJsZXNcclxuICAgICAgICBpZiAoYWN0aXZlX29wdGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBhY3RpdmVfb3B0aW9uLmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3Qtb3B0aW9uXCIpO1xyXG4gICAgICAgICAgICBhY3RpdmVfb3B0aW9uID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChhY3RpdmVfaW5wdXQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgYWN0aXZlX2lucHV0LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIG1pZ2h0IG5lZWQgdG8gY2hlY2sgaWYgYWxnb3JpdGhpbS1pbmZvIGlzIHN0aWxsIGRpc3BsYXlpbmcgc29tZXRoaW5nXHJcbiAgICAgICAgLy8gZXZlbiBpZiBpdCdzIG5vdCBudWxsXHJcbiAgICAgICAgaWYgKGFjdGl2ZV9pbmZvICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGFjdGl2ZV9pbmZvLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gd2lsbCBoYXZlIHRvIG1ha2Ugc3VyZSB0aGlzIGRpc3BsYXlzIHRoZSBuZXcgaW1hZ2Ugd2l0aG91dCBcclxuICAgICAgICAvLyBhbnkgd2VpcmQgYnVncyBcclxuICAgICAgICBkcmF3X2NhbnZhc2VzLmRpc3BsYXlfb25seV9wcm9jZXNzZWRfaW1hZ2UoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGxldCBsYXJnZV91cGxvYWRfYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsYXJnZS11cGxvYWQtYnV0dG9uXCIpO1xyXG4gICAgbGFyZ2VfdXBsb2FkX2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICAgIGlmICh3aW5kb3cubWF0Y2hNZWRpYShcIihtYXgtd2lkdGg6IDc2OHB4KVwiKSkge1xyXG4gICAgICAgICAgICBpZiAoc2lkZWJhci5jbGFzc0xpc3QuY29udGFpbnMoXCJtb2JpbGUtdmlzaWJsZVwiKSkge1xyXG4gICAgICAgICAgICAgICAgc2lkZWJhci5jbGFzc0xpc3QucmVtb3ZlKFwibW9iaWxlLXZpc2libGVcIik7XHJcbiAgICAgICAgICAgICAgICBzaWRlYmFyLmNsYXNzTGlzdC5hZGQoXCJtb2JpbGUtaGlkZGVuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbGVfaW5wdXQuY2xpY2soKTtcclxuICAgIH0pO1xyXG4gICAgLy8gdGhpcyBidXR0b24gYWN0aXZhdGVzIHRoZSBmaWxlIGlucHV0IGV2ZW50XHJcbiAgICBsZXQgdXBsb2FkX2ltYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ1cGxvYWQtaW1hZ2VcIik7XHJcbiAgICB1cGxvYWRfaW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgICBpZiAod2luZG93Lm1hdGNoTWVkaWEoXCIobWF4LXdpZHRoOiA3NjhweClcIikpIHtcclxuICAgICAgICAgICAgaWYgKHNpZGViYXIuY2xhc3NMaXN0LmNvbnRhaW5zKFwibW9iaWxlLXZpc2libGVcIikpIHtcclxuICAgICAgICAgICAgICAgIHNpZGViYXIuY2xhc3NMaXN0LnJlbW92ZShcIm1vYmlsZS12aXNpYmxlXCIpO1xyXG4gICAgICAgICAgICAgICAgc2lkZWJhci5jbGFzc0xpc3QuYWRkKFwibW9iaWxlLWhpZGRlblwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmaWxlX2lucHV0LmNsaWNrKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyB0YWtlcyBvcmlnaW5hbCBpbWFnZSBhbmQgcmVzaXplcyBpdCBcclxuICAgIC8vIGN1cnJlbnRseSBkb2Vzbid0IHJlYXBwbHkgZWRpdCBtYWRlIGJ5IGN1cnJlbnQgcHJvY2Vzc2luZyBhbGdvcml0aG1cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHJhd19pbWFnZXMgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgLy8gdXNlcyBvcmlnaW5hbCBpbWFnZSB0byByZXNpemUgdG8gdGhlIG5ldyBvdXRwdXQgY2FudmFzIFxyXG4gICAgICAgICAgICAvLyBkaW1lbnNpb25zXHJcbiAgICAgICAgICAgIGNvbnN0IFtyZXNpemVkX2ltZ193aWR0aCwgcmVzaXplZF9pbWdfaGVpZ2h0XSA9XHJcbiAgICAgICAgICAgICAgICBzY2FsZV9pbWdfZGltZW5zaW9uc190b19jYW52YXMoXHJcbiAgICAgICAgICAgICAgICAgICAgcmF3X2ltYWdlcy5vcmlnaW5hbF9pbWcoKSxcclxuICAgICAgICAgICAgICAgICAgICBkcmF3X2NhbnZhc2VzLnByb2Nlc3NlZF9pbWFnZV9jYW52YXNcclxuICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBkcmF3X2NhbnZhc2VzLnJlc2l6ZV9jYW52YXNlcygpO1xyXG5cclxuICAgICAgICAgICAgZHJhd19jYW52YXNlcy5yZXNpemVkX3dpZHRoID0gcmVzaXplZF9pbWdfd2lkdGg7XHJcbiAgICAgICAgICAgIGRyYXdfY2FudmFzZXMucmVzaXplZF9oZWlnaHQgPSByZXNpemVkX2ltZ19oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICBkcmF3X2NhbnZhc2VzLmRyYXdfaW1hZ2UoXHJcbiAgICAgICAgICAgICAgICByYXdfaW1hZ2VzLm91dHB1dF9pbWdfY2FudmFzKCksXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgbGV0IGludmVydF9vcHRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImludmVydC1vcHRpb25cIik7XHJcbiAgICBsZXQgYmx1cl9vcHRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJsdXItb3B0aW9uc1wiKTtcclxuICAgIGxldCBnYW1tYV9vcHRpb24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbW1hLW9wdGlvblwiKTtcclxuICAgIC8vIGxldCBhY3RpdmVfb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7IC8vIGNyZWF0ZXMgZHVtbXkgZWxlbWVudCBzbyBpdCB3b3VsZG4ndCBiZSBudWxsXHJcbiAgICBsZXQgYWN0aXZlX29wdGlvbiA9IG51bGw7XHJcblxyXG4gICAgbGV0IHByb2Nlc3Npbmdfb3B0aW9ucyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvY2Vzc2luZy1vcHRpb25zXCIpO1xyXG5cclxuICAgIC8vIG1heWJlIG1ha2UgdGhpcyBudWxsXHJcbiAgICAvLyBhbHNvIG1heWJlIG1ha2UgdGhpcyBudWxsXHJcbiAgICAvLyBsZXQgYWN0aXZlX2lucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7IC8vIGNyZWF0ZXMgZHVtbXkgZWxlbWVudCBzbyBpdCB3b3VsZG4ndCBiZSBudWxsXHJcbiAgICBsZXQgYWN0aXZlX2lucHV0ID0gbnVsbDtcclxuXHJcbiAgICBsZXQgaW52ZXJ0X2luZm8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImludmVydC1pbmZvXCIpO1xyXG4gICAgbGV0IGJveF9ibHVyX2luZm8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJveC1ibHVyLWluZm9cIik7XHJcbiAgICBsZXQgZ2FtbWFfaW5mbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtbWEtaW5mb1wiKTtcclxuICAgIC8vIGxldCBhY3RpdmVfaW5mbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xyXG4gICAgbGV0IGFjdGl2ZV9pbmZvID0gbnVsbDtcclxuXHJcbiAgICBmdW5jdGlvbiBjaGFuZ2VfYWN0aXZlX29wdGlvbihhbGdvcml0aG1fb3B0aW9uLCBhbGdvcml0aG1faW5wdXQsIGFsZ29yaXRobV9pbmZvKSB7XHJcblxyXG4gICAgICAgIGlmIChhY3RpdmVfaW5mbyA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBhY3RpdmVfaW5mbyA9IGFsZ29yaXRobV9pbmZvO1xyXG4gICAgICAgICAgICBhY3RpdmVfaW5mby5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcclxuICAgICAgICB9IFxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBhY3RpdmVfaW5mby5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIGFjdGl2ZV9pbmZvID0gYWxnb3JpdGhtX2luZm87XHJcbiAgICAgICAgICAgIGFjdGl2ZV9pbmZvLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGFjdGl2ZV9pbnB1dCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBwcm9jZXNzaW5nX29wdGlvbnMuc3R5bGUuZGlzcGxheSA9IFwiXCI7XHJcbiAgICAgICAgICAgIGFjdGl2ZV9pbnB1dCA9IGFsZ29yaXRobV9pbnB1dDtcclxuICAgICAgICAgICAgYWN0aXZlX2lucHV0LnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xyXG4gICAgICAgIH0gXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGFjdGl2ZV9pbnB1dC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgICAgIGFjdGl2ZV9pbnB1dCA9IGFsZ29yaXRobV9pbnB1dDtcclxuICAgICAgICAgICAgYWN0aXZlX2lucHV0LnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xyXG4gICAgICAgICAgICBwcm9jZXNzaW5nX29wdGlvbnMuc3R5bGUuZGlzcGxheSA9IFwiXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYWN0aXZlX29wdGlvbiA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBhY3RpdmVfb3B0aW9uID0gYWxnb3JpdGhtX29wdGlvbjtcclxuICAgICAgICAgICAgYWN0aXZlX29wdGlvbi5jbGFzc0xpc3QuYWRkKFwic2VsZWN0LW9wdGlvblwiKTtcclxuICAgICAgICB9IFxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBhY3RpdmVfb3B0aW9uLmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3Qtb3B0aW9uXCIpO1xyXG4gICAgICAgICAgICBhY3RpdmVfb3B0aW9uID0gYWxnb3JpdGhtX29wdGlvbjtcclxuICAgICAgICAgICAgYWN0aXZlX29wdGlvbi5jbGFzc0xpc3QuYWRkKFwic2VsZWN0LW9wdGlvblwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBkZWFjdGl2YXRlX29wdGlvbihhbGdvcml0aG1fb3B0aW9uKSB7XHJcbiAgICAgICAgYWxnb3JpdGhtX29wdGlvbi5jbGFzc0xpc3QucmVtb3ZlKFwic2VsZWN0LW9wdGlvblwiKTtcclxuICAgICAgICBhY3RpdmVfaW5wdXQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG5cclxuICAgICAgICBhY3RpdmVfaW5mby5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcblxyXG4gICAgICAgIGFjdGl2ZV9vcHRpb24gPSBudWxsO1xyXG4gICAgICAgIGFjdGl2ZV9pbnB1dCA9IG51bGw7XHJcbiAgICAgICAgYWN0aXZlX2luZm8gPSBudWxsO1xyXG4gICAgICAgIHByb2Nlc3Npbmdfb3B0aW9ucy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcblxyXG4gICAgICAgIHRvZ2dsZV9hbGdvcml0aG1zX3NpZGViYXIoKTtcclxuXHJcbiAgICAgICAgcmF3X2ltYWdlcy5zZXRfb3V0cHV0X2ltYWdlX3RvX29yaWdpbmFsKCk7XHJcbiAgICAgICAgZHJhd19jYW52YXNlcy5kcmF3X2ltYWdlKHJhd19pbWFnZXMub3JpZ2luYWxfaW1nX2NhbnZhcygpKTtcclxuICAgICAgICBcclxuICAgIH1cclxuICAgIGxldCBvcHRpb25zID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcHRpb25zXCIpO1xyXG4gICAgLy8gdGhlc2UgZXZlbnRzIHNob3VsZCBjaGVjayBpZiB0aGV5IGFyZSB0aGUgYWN0aXZlIG9wdGlvbiBhbmQgaWYgY2xpY2tlZCBhZ2FpblxyXG4gICAgLy8gdGhleSBzaG91bGQgZGVhY3RpdmF0ZSBhbmQgcHJlc2VudCB0aGUgb3JpZ2luYWwgaW1hZ2VcclxuICAgIG9wdGlvbnMuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGRlYm91bmNlKChldmVudCkgPT4ge1xyXG4gICAgICAgIGlmIChhY3RpdmVfb3B0aW9uICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGFjdGl2ZV9vcHRpb24uY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdC1vcHRpb25cIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0Lm1hdGNoZXMoXCIjaW52ZXJ0LW9wdGlvblwiKSkge1xyXG4gICAgICAgICAgICBpZiAocmF3X2ltYWdlcyA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJVcGxvYWQgYW4gaW1hZ2UgdG8gdXNlIHRoZXNlIGFsZ29yaXRobXNcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChhY3RpdmVfb3B0aW9uID09PSBpbnZlcnRfb3B0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBkZWFjdGl2YXRlX29wdGlvbihpbnZlcnRfb3B0aW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNoYW5nZV9hY3RpdmVfb3B0aW9uKGludmVydF9vcHRpb24sIGludmVydF9idXR0b24sIGludmVydF9pbmZvKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0b2dnbGVfYWxnb3JpdGhtc19zaWRlYmFyKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaW1hZ2Vfd29ya2VyLnBvc3RNZXNzYWdlKFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJJTlZFUlRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHJhd19pbWFnZXMucHJldmlld19pbWcoKS53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChldmVudC50YXJnZXQubWF0Y2hlcyhcIiNibHVyLW9wdGlvbnNcIikpIHtcclxuICAgICAgICAgICAgaWYgKHJhd19pbWFnZXMgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiVXBsb2FkIGFuIGltYWdlIHRvIHVzZSB0aGVzZSBhbGdvcml0aG1zXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoYWN0aXZlX29wdGlvbiA9PT0gYmx1cl9vcHRpb24pIHtcclxuICAgICAgICAgICAgICAgIGRlYWN0aXZhdGVfb3B0aW9uKGJsdXJfb3B0aW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNoYW5nZV9hY3RpdmVfb3B0aW9uKGJsdXJfb3B0aW9uLCBib3hfYmx1cl9zbGlkZXJfd3JhcHBlciwgYm94X2JsdXJfaW5mbyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdG9nZ2xlX2FsZ29yaXRobXNfc2lkZWJhcigpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHB1dHMgdGhlIGJveCBibHVyIHNsaWRlciBhdCAxIGJlY2F1c2UgdGhlIGRlZmF1bHQgcG9zaXRpb24gaXMgaW4gdGhlIG1pZGRsZVxyXG4gICAgICAgICAgICAgICAgYm94X2JsdXJfc2xpZGVyLnZhbHVlID0gMTtcclxuICAgICAgICAgICAgICAgIGJveF9ibHVyX3ZhbHVlX2VsZW0udmFsdWUgPSBib3hfYmx1cl9zbGlkZXIudmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGtlcm5lbF9zaXplID0gYm94X2JsdXJfc2xpZGVyLnZhbHVlQXNOdW1iZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgaW1hZ2Vfd29ya2VyLnBvc3RNZXNzYWdlKFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJCT1ggQkxVUlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogcmF3X2ltYWdlcy5wcmV2aWV3X2ltZygpLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXJuZWxfc2l6ZToga2VybmVsX3NpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5tYXRjaGVzKFwiI2dhbW1hLW9wdGlvblwiKSkge1xyXG4gICAgICAgICAgICBpZiAocmF3X2ltYWdlcyA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJVcGxvYWQgYW4gaW1hZ2UgdG8gdXNlIHRoZXNlIGFsZ29yaXRobXNcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGFjdGl2ZV9vcHRpb24gPT09IGdhbW1hX29wdGlvbikge1xyXG4gICAgICAgICAgICAgICAgZGVhY3RpdmF0ZV9vcHRpb24oZ2FtbWFfb3B0aW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNoYW5nZV9hY3RpdmVfb3B0aW9uKGdhbW1hX29wdGlvbiwgZ2FtbWFfc2xpZGVyX3dyYXBwZXIsIGdhbW1hX2luZm8pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRvZ2dsZV9hbGdvcml0aG1zX3NpZGViYXIoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBwdXRzIHRoZSBnYW1tYSBzbGlkZXIgYXQgMSBiZWNhdXNlIHRoaXMga2VlcHMgdGhlIGltYWdlIHVuY2hhbmdlZCBcclxuICAgICAgICAgICAgICAgIGdhbW1hX3NsaWRlci52YWx1ZSA9IDE7XHJcbiAgICAgICAgICAgICAgICBnYW1tYV92YWx1ZV9lbGVtLnZhbHVlID0gMTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbWFnZV93b3JrZXIucG9zdE1lc3NhZ2UoXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkdBTU1BXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiByYXdfaW1hZ2VzLnByZXZpZXdfaW1nKCkud2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdhbW1hOiBnYW1tYV9zbGlkZXIudmFsdWVBc051bWJlcixcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfSksIDMzKTtcclxuXHJcbiAgICBsZXQgaW52ZXJ0X2J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW52ZXJ0LWJ1dHRvblwiKTtcclxuICAgIGludmVydF9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGRlYm91bmNlKCgpID0+IHtcclxuICAgICAgICBpbWFnZV93b3JrZXIucG9zdE1lc3NhZ2UoXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiSU5WRVJUIEJVVFRPTlwiLFxyXG4gICAgICAgICAgICAgICAgaW1hZ2U6IHJhd19pbWFnZXMub3V0cHV0X2ltZygpLmRhdGEuYnVmZmVyLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IHJhd19pbWFnZXMub3V0cHV0X2ltZygpLndpZHRoLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBbcmF3X2ltYWdlcy5vdXRwdXRfaW1nKCkuZGF0YS5idWZmZXJdXHJcbiAgICAgICAgKTtcclxuICAgIH0pLCAzMyk7XHJcblxyXG4gICAgbGV0IGdhbW1hX3NsaWRlcl93cmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1tYS1zbGlkZXItd3JhcHBlclwiKTtcclxuICAgIGxldCBnYW1tYV9zbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbW1hLXNsaWRlclwiKTtcclxuICAgIGxldCBnYW1tYV92YWx1ZV9lbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1tYS12YWx1ZVwiKTtcclxuICAgIGxldCBnYW1tYV9zbGlkZXJfZnVuYyA9IChldmVudCkgPT4ge1xyXG4gICAgICAgIGxldCBnYW1tYSA9IGV2ZW50LnRhcmdldC52YWx1ZUFzTnVtYmVyO1xyXG4gICAgICAgIGdhbW1hX3ZhbHVlX2VsZW0udmFsdWUgPSBnYW1tYTtcclxuXHJcbiAgICAgICAgLy8gZG9lcyBhIGdhbW1hIHRyYW5zZm9ybWF0aW9uIG9uIGZ1bGwgc2l6ZSBpbWFnZSBwcmV2aWV3IFxyXG4gICAgICAgIGltYWdlX3dvcmtlci5wb3N0TWVzc2FnZShcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJHQU1NQVwiLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IHJhd19pbWFnZXMucHJldmlld19pbWcoKS53aWR0aCxcclxuICAgICAgICAgICAgICAgIGdhbW1hOiBnYW1tYSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICApO1xyXG5cclxuICAgIH1cclxuICAgIGdhbW1hX3NsaWRlci5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgZGVib3VuY2UoZ2FtbWFfc2xpZGVyX2Z1bmMsIDUxKSk7XHJcblxyXG4gICAgbGV0IGJveF9ibHVyX3NsaWRlcl93cmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJib3gtYmx1ci1zbGlkZXItd3JhcHBlclwiKTtcclxuICAgIGxldCBib3hfYmx1cl9zbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJveC1ibHVyLXNsaWRlclwiKTtcclxuICAgIGxldCBib3hfYmx1cl92YWx1ZV9lbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJib3gtYmx1ci12YWx1ZVwiKTtcclxuICAgIGxldCBib3hfc2xpZGVyX2Z1bmMgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAvLyBmdW5jdGlvbiBzbGlkZXJfZnVuYyhldmVudCkge1xyXG4gICAgICAgIGxldCBrZXJuZWxfc2l6ZSA9IGV2ZW50LnRhcmdldC52YWx1ZUFzTnVtYmVyO1xyXG4gICAgICAgIGJveF9ibHVyX3ZhbHVlX2VsZW0udmFsdWUgPSBrZXJuZWxfc2l6ZTtcclxuXHJcbiAgICAgICAgLy8gYm94IGJsdXJzIGZ1bGwgc2l6ZSBpbWFnZSBwcmV2aWV3IFxyXG4gICAgICAgIGltYWdlX3dvcmtlci5wb3N0TWVzc2FnZShcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJCT1ggQkxVUlwiLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IHJhd19pbWFnZXMucHJldmlld19pbWcoKS53aWR0aCxcclxuICAgICAgICAgICAgICAgIGtlcm5lbF9zaXplOiBrZXJuZWxfc2l6ZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICApO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBib3hfYmx1cl9zbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIGRlYm91bmNlKGJveF9zbGlkZXJfZnVuYywgNTEpKTtcclxuXHJcbiAgICBmdW5jdGlvbiBzY2FsZV9pbWdfZGltZW5zaW9uc190b19jYW52YXMoaW1nLCBjYW52YXMpIHtcclxuXHJcbiAgICAgICAgbGV0IHNjYWxlID0gMDtcclxuICAgICAgICBsZXQgbmV3X2hlaWdodCA9IGltZy5oZWlnaHQ7XHJcbiAgICAgICAgbGV0IG5ld193aWR0aCA9IGltZy53aWR0aDtcclxuXHJcbiAgICAgICAgY29uc3Qgd2lkdGhfc2NhbGUgPSBjYW52YXMub2Zmc2V0V2lkdGggLyBpbWcud2lkdGg7XHJcbiAgICAgICAgY29uc3QgaGVpZ2h0X3NjYWxlID0gY2FudmFzLm9mZnNldEhlaWdodCAvIGltZy5oZWlnaHQ7XHJcblxyXG4gICAgICAgIGlmICh3aWR0aF9zY2FsZSA8IGhlaWdodF9zY2FsZSkge1xyXG4gICAgICAgICAgICBzY2FsZSA9IHdpZHRoX3NjYWxlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNjYWxlID0gaGVpZ2h0X3NjYWxlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNhbnZhcy5vZmZzZXRXaWR0aCA8IGltZy53aWR0aCB8fCBjYW52YXMub2Zmc2V0SGVpZ2h0IDwgaW1nLmhlaWdodCkge1xyXG4gICAgICAgICAgICBuZXdfd2lkdGggPSBNYXRoLnJvdW5kKGltZy53aWR0aCAqIHNjYWxlKTtcclxuICAgICAgICAgICAgbmV3X2hlaWdodCA9IE1hdGgucm91bmQoaW1nLmhlaWdodCAqIHNjYWxlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBbbmV3X3dpZHRoLCBuZXdfaGVpZ2h0XTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgbGV0IHNpZGViYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNpZGViYXJcIik7XHJcbiAgICBsZXQgYWxnb3JpdGhtc19idXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wZW4tYWxnb3JpdGhtc1wiKTtcclxuICAgIGxldCBhbGdvcml0aG1zX2Fycm93ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvcGVuLWFsZ29yaXRobXMtYXJyb3dcIik7XHJcbiAgICBhbGdvcml0aG1zX2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICAgIHRvZ2dsZV9hbGdvcml0aG1zX3NpZGViYXIoKTtcclxuICAgIH0pO1xyXG4gICAgZnVuY3Rpb24gdG9nZ2xlX2FsZ29yaXRobXNfc2lkZWJhcigpIHtcclxuICAgICAgICBpZiAod2luZG93Lm1hdGNoTWVkaWEoXCIobWF4LXdpZHRoOiA3NjhweClcIikubWF0Y2hlcykge1xyXG4gICAgICAgICAgICAgICAgc2lkZWJhci5jbGFzc0xpc3QudG9nZ2xlKFwibW9iaWxlLWhpZGRlblwiKTtcclxuICAgICAgICAgICAgICAgIHNpZGViYXIuY2xhc3NMaXN0LnRvZ2dsZShcIm1vYmlsZS12aXNpYmxlXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGFsZ29yaXRobXNfYXJyb3cuY2xhc3NMaXN0LnRvZ2dsZShcImZhLWFuZ2xlLXJpZ2h0XCIpO1xyXG4gICAgICAgICAgICAgICAgYWxnb3JpdGhtc19hcnJvdy5jbGFzc0xpc3QudG9nZ2xlKFwiZmEtYW5nbGUtZG93blwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbm1haW4oKTtcclxuIiwiLy8gaW1wb3J0IHsgcmVzaXplX2ltZyB9IGZyb20gXCIuLi93YXNtL3Byb2MuanNcIjtcclxuXHJcbmNvbnN0IG1heF9kaW1lbnNpb24gPSAxNTAwO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJhd0ltYWdlIHtcclxuICAgIGNvbnN0cnVjdG9yKG9yaWdpbmFsX2ltZywgY2FudmFzKSB7XHJcbiAgICAgICAgdGhpcy5vdXRwdXRfaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgICAgICB0aGlzLm9yaWdpbmFsX2ltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICAgICAgdGhpcy5wcmV2aWV3X2ltYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcblxyXG4gICAgICAgIHRoaXMucHJldmlld19pbWFnZV9jdHggPSB0aGlzLnByZXZpZXdfaW1hZ2UuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgICAgIHRoaXMub3V0cHV0X2ltYWdlX2N0eCA9IHRoaXMub3V0cHV0X2ltYWdlLmdldENvbnRleHQoXCIyZFwiKTtcclxuICAgICAgICB0aGlzLm9yaWdpbmFsX2ltYWdlX2N0eCA9IHRoaXMub3JpZ2luYWxfaW1hZ2UuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cclxuICAgICAgICAvLyB0aGlzIHBhcnQgZ2V0cyB0aGUgcmF3IGltYWdlIGRhdGEgYnkgdXNpbmcgYW4gb2ZmIHNjcmVlbiBjYW52YXNcclxuICAgICAgICAvLyByZXNpemVzIHRoZSBjYW52YXMgdG8gaW1hZ2UgZGltZW5zaW9ucyBzbyB0aGF0IGltYWdlIGlzbid0IGNsaXBwZWRcclxuICAgICAgICAvLyB3aGVuIGNhbGxpbmcgZ2V0SW1hZ2VEYXRhKClcclxuICAgICAgICB0aGlzLm91dHB1dF9pbWFnZS53aWR0aCA9IG9yaWdpbmFsX2ltZy53aWR0aDtcclxuICAgICAgICB0aGlzLm91dHB1dF9pbWFnZS5oZWlnaHQgPSBvcmlnaW5hbF9pbWcuaGVpZ2h0O1xyXG5cclxuICAgICAgICB0aGlzLm9yaWdpbmFsX2ltYWdlLndpZHRoID0gb3JpZ2luYWxfaW1nLndpZHRoO1xyXG4gICAgICAgIHRoaXMub3JpZ2luYWxfaW1hZ2UuaGVpZ2h0ID0gb3JpZ2luYWxfaW1nLmhlaWdodDtcclxuXHJcbiAgICAgICAgdGhpcy5vdXRwdXRfaW1hZ2VfY3R4LmRyYXdJbWFnZShvcmlnaW5hbF9pbWcsIDAsIDApO1xyXG4gICAgICAgIHRoaXMub3JpZ2luYWxfaW1hZ2VfY3R4LmRyYXdJbWFnZShvcmlnaW5hbF9pbWcsIDAsIDApO1xyXG4gICAgICAgIHRoaXMucHJldmlld19pbWFnZS5vZmZzZXRIZWlnaHRcclxuICAgICAgICBsZXQgW3ByZXZpZXdfd2lkdGgsIHByZXZpZXdfaGVpZ2h0XSA9IFxyXG4gICAgICAgICAgICByZXNpemVfcHJldmlld19pbWFnZShcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsX2ltZywgXHJcbiAgICAgICAgICAgICAgICBtYXhfZGltZW5zaW9uXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgdGhpcy5wcmV2aWV3X2ltYWdlLndpZHRoID0gcHJldmlld193aWR0aDtcclxuICAgICAgICB0aGlzLnByZXZpZXdfaW1hZ2UuaGVpZ2h0ID0gcHJldmlld19oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5vdXRwdXRfaW1hZ2Uud2lkdGggPSBwcmV2aWV3X3dpZHRoO1xyXG4gICAgICAgIHRoaXMub3V0cHV0X2ltYWdlLmhlaWdodCA9IHByZXZpZXdfaGVpZ2h0O1xyXG5cclxuICAgICAgICB0aGlzLnByZXZpZXdfaW1hZ2VfY3R4LmRyYXdJbWFnZShvcmlnaW5hbF9pbWcsIDAsIDAsIHByZXZpZXdfd2lkdGgsIHByZXZpZXdfaGVpZ2h0KTtcclxuICAgICAgICB0aGlzLm91dHB1dF9pbWFnZV9jdHguZHJhd0ltYWdlKG9yaWdpbmFsX2ltZywgMCwgMCwgcHJldmlld193aWR0aCwgcHJldmlld19oZWlnaHQpO1xyXG5cclxuICAgICAgICAvLyB0aGlzLm91dHB1dF9pbWFnZSA9IG91dHB1dF9pbWdfY3R4LmdldEltYWdlRGF0YShcclxuICAgICAgICAvLyAgICAgMCwgXHJcbiAgICAgICAgLy8gICAgIDAsIFxyXG4gICAgICAgIC8vICAgICBvdXRwdXRfaW1nLndpZHRoLCBcclxuICAgICAgICAvLyAgICAgb3V0cHV0X2ltZy5oZWlnaHRcclxuICAgICAgICAvLyApO1xyXG4gICAgICAgIC8vIHRoaXMub3JpZ2luYWxfaW1hZ2UgPSBpbWdfY3R4LmdldEltYWdlRGF0YShcclxuICAgICAgICAvLyAgICAgMCwgXHJcbiAgICAgICAgLy8gICAgIDAsIFxyXG4gICAgICAgIC8vICAgICBpbWcud2lkdGgsIFxyXG4gICAgICAgIC8vICAgICBpbWcuaGVpZ2h0XHJcbiAgICAgICAgLy8gKTtcclxuXHJcbiAgICAgICAgLy8gY29uc3QgW3Jlc2l6ZWRfaW1nX3dpZHRoLCByZXNpemVkX2ltZ19oZWlnaHRdID0gXHJcbiAgICAgICAgLy8gICAgIHRoaXMuc2NhbGVfaW1nX2RpbWVuc2lvbnNfdG9fY2FudmFzKGltZywgY2FudmFzKTtcclxuICAgICAgICAvLyAvLyB0aGlzIGltYWdlIHdpbGwgYmUgdGhlIG9uZSB0aGF0IGdldHMgcHJvY2Vzc2VkIHNvIHRoZXJlIGlzbid0IGEgbmVlZFxyXG4gICAgICAgIC8vIC8vIHRvIGNvbnN0YW50bHkgcmVzaXplIHRoZSBvcmlnaW5hbCBpbWFnZSBvbiBldmVyeSBwcm9jZXNzaW5nIGZ1bmN0aW9uXHJcbiAgICAgICAgLy8gY29uc3Qgb3V0cHV0X2ltYWdlX3Jlc2l6ZWRfcmF3ID0gbmV3IFVpbnQ4Q2xhbXBlZEFycmF5KFxyXG4gICAgICAgIC8vICAgICByZXNpemVfaW1nKFxyXG4gICAgICAgIC8vICAgICAgICAgdGhpcy5vdXRwdXRfaW1hZ2UuZGF0YSwgXHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLm91dHB1dF9pbWFnZS53aWR0aCwgXHJcbiAgICAgICAgLy8gICAgICAgICByZXNpemVkX2ltZ193aWR0aCwgXHJcbiAgICAgICAgLy8gICAgICAgICByZXNpemVkX2ltZ19oZWlnaHRcclxuICAgICAgICAvLyAgICAgKVxyXG4gICAgICAgIC8vICk7XHJcbiAgICAgICAgLy8gdGhpcy5vdXRwdXRfaW1hZ2VfcmVzaXplZCA9IG5ldyBJbWFnZURhdGEoXHJcbiAgICAgICAgLy8gICAgIG91dHB1dF9pbWFnZV9yZXNpemVkX3JhdywgXHJcbiAgICAgICAgLy8gICAgIHJlc2l6ZWRfaW1nX3dpZHRoXHJcbiAgICAgICAgLy8gKTtcclxuICAgICAgICAvLyBtYWtlIHRoaXMgbW9yZSBwZXJmb3JtYW50XHJcbiAgICAgICAgLy8gbGV0IGx1bWFfaW1nX2RhdGEgPSBjaGFuZ2VfdG9fZ3JheXNjYWxlKG9yaWdpbmFsX2ltZ19kYXRhKTtcclxuICAgICAgICAvLyBsZXQgb3V0cHV0X2x1bWFfZGF0YSA9IGNoYW5nZV90b19ncmF5c2NhbGUob3V0cHV0X2ltZ19kYXRhKTtcclxuXHJcbiAgICAgICAgLy8gcHV0X2ltYWdlX2RhdGFfY2FudmFzKGx1bWFfaW1nX2RhdGEsIGlucHV0X2N0eCk7XHJcblxyXG4gICAgICAgIC8vIG9yaWdpbmFsX2ltZ19kYXRhID0gbHVtYV9pbWdfZGF0YTtcclxuICAgICAgICAvLyBvdXRwdXRfaW1nX2RhdGEgPSBvdXRwdXRfbHVtYV9kYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIG9yaWdpbmFsX2ltZygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcmlnaW5hbF9pbWFnZV9jdHguZ2V0SW1hZ2VEYXRhKFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbmFsX2ltYWdlLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbmFsX2ltYWdlLmhlaWdodCxcclxuICAgICAgICApO1xyXG4gICAgfVxyXG4gICAgb3JpZ2luYWxfaW1nX2NhbnZhcygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vcmlnaW5hbF9pbWFnZTtcclxuICAgIH1cclxuXHJcbiAgICBvdXRwdXRfaW1nX2NhbnZhcygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5vdXRwdXRfaW1hZ2U7XHJcbiAgICB9XHJcbiAgICBvdXRwdXRfaW1nKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm91dHB1dF9pbWFnZV9jdHguZ2V0SW1hZ2VEYXRhKFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB0aGlzLm91dHB1dF9pbWFnZS53aWR0aCxcclxuICAgICAgICAgICAgdGhpcy5vdXRwdXRfaW1hZ2UuaGVpZ2h0LFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJldmlld19pbWdfY2FudmFzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByZXZpZXdfaW1hZ2U7XHJcbiAgICB9XHJcbiAgICBwcmV2aWV3X2ltZygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wcmV2aWV3X2ltYWdlX2N0eC5nZXRJbWFnZURhdGEoXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIDAsIFxyXG4gICAgICAgICAgICB0aGlzLnByZXZpZXdfaW1hZ2Uud2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMucHJldmlld19pbWFnZS5oZWlnaHQsXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRfb3V0cHV0X2ltYWdlKGltYWdlKSB7XHJcbiAgICAgICAgdGhpcy5vdXRwdXRfaW1hZ2VfY3R4LnB1dEltYWdlRGF0YShpbWFnZSwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0X291dHB1dF9pbWFnZV90b19vcmlnaW5hbCgpIHtcclxuICAgICAgICB0aGlzLnNldF9vdXRwdXRfaW1hZ2UodGhpcy5vcmlnaW5hbF9pbWcoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gc2V0X29yaWdpbmFsX2ltYWdlKGltYWdlKSB7XHJcbiAgICAvLyAgICAgdGhpcy5vcmlnaW5hbF9pbWFnZSA9IGltYWdlO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIHNjYWxlX2ltZ19kaW1lbnNpb25zX3RvX2NhbnZhcyhpbWcsIGNhbnZhcykge1xyXG5cclxuICAgIC8vICAgICBsZXQgc2NhbGUgPSAwO1xyXG4gICAgLy8gICAgIGxldCBuZXdfaGVpZ2h0ID0gaW1nLmhlaWdodDtcclxuICAgIC8vICAgICBsZXQgbmV3X3dpZHRoID0gaW1nLndpZHRoO1xyXG5cclxuICAgIC8vICAgICBjb25zdCB3aWR0aF9zY2FsZSA9IGNhbnZhcy5vZmZzZXRXaWR0aCAvIGltZy53aWR0aDtcclxuICAgIC8vICAgICBjb25zdCBoZWlnaHRfc2NhbGUgPSBjYW52YXMub2Zmc2V0SGVpZ2h0IC8gaW1nLmhlaWdodDtcclxuXHJcbiAgICAvLyAgICAgaWYgKHdpZHRoX3NjYWxlIDwgaGVpZ2h0X3NjYWxlKSB7XHJcbiAgICAvLyAgICAgICAgIHNjYWxlID0gd2lkdGhfc2NhbGU7XHJcbiAgICAvLyAgICAgfSBlbHNlIHtcclxuICAgIC8vICAgICAgICAgc2NhbGUgPSBoZWlnaHRfc2NhbGU7XHJcbiAgICAvLyAgICAgfVxyXG5cclxuICAgIC8vICAgICBpZiAoY2FudmFzLm9mZnNldFdpZHRoIDwgaW1nLndpZHRoIHx8IGNhbnZhcy5vZmZzZXRIZWlnaHQgPCBpbWcuaGVpZ2h0KSB7XHJcbiAgICAvLyAgICAgICAgIG5ld193aWR0aCA9IE1hdGgucm91bmQoaW1nLndpZHRoICogc2NhbGUpO1xyXG4gICAgLy8gICAgICAgICBuZXdfaGVpZ2h0ID0gTWF0aC5yb3VuZChpbWcuaGVpZ2h0ICogc2NhbGUpO1xyXG4gICAgLy8gICAgIH1cclxuXHJcbiAgICAvLyAgICAgcmV0dXJuIFtuZXdfd2lkdGgsIG5ld19oZWlnaHRdO1xyXG4gICAgLy8gfVxyXG59XHJcblxyXG5mdW5jdGlvbiByZXNpemVfcHJldmlld19pbWFnZShpbWcsIG1heF9sb25nX2VkZ2UpIHtcclxuICAgIGxldCBzY2FsZSA9IDA7XHJcbiAgICBsZXQgbmV3X2hlaWdodCA9IGltZy5oZWlnaHQ7XHJcbiAgICBsZXQgbmV3X3dpZHRoID0gaW1nLndpZHRoO1xyXG5cclxuICAgIGNvbnN0IHdpZHRoX3NjYWxlID0gbWF4X2xvbmdfZWRnZSAvIGltZy53aWR0aDtcclxuICAgIGNvbnN0IGhlaWdodF9zY2FsZSA9IG1heF9sb25nX2VkZ2UgLyBpbWcuaGVpZ2h0O1xyXG5cclxuICAgIGlmICh3aWR0aF9zY2FsZSA8IGhlaWdodF9zY2FsZSkge1xyXG4gICAgICAgIHNjYWxlID0gd2lkdGhfc2NhbGU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNjYWxlID0gaGVpZ2h0X3NjYWxlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChtYXhfbG9uZ19lZGdlIDwgaW1nLndpZHRoIHx8IG1heF9sb25nX2VkZ2UgPCBpbWcuaGVpZ2h0KSB7XHJcbiAgICAgICAgbmV3X3dpZHRoID0gTWF0aC5yb3VuZChpbWcud2lkdGggKiBzY2FsZSk7XHJcbiAgICAgICAgbmV3X2hlaWdodCA9IE1hdGgucm91bmQoaW1nLmhlaWdodCAqIHNjYWxlKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gW25ld193aWR0aCwgbmV3X2hlaWdodF07XHJcbn0iXSwic291cmNlUm9vdCI6IiJ9
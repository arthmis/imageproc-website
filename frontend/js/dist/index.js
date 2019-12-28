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
    gamma_slider.addEventListener("input", debounce(gamma_slider_func, 100));

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

    box_blur_slider.addEventListener("input", debounce(box_slider_func, 150));
    // box_blur_slider.addEventListener("change", box_slider_func);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vZnJvbnRlbmQvanMvZHJhd19jYW52YXNlcy5qcyIsIndlYnBhY2s6Ly8vLi9mcm9udGVuZC9qcy9tYWluLmpzIiwid2VicGFjazovLy8uL2Zyb250ZW5kL2pzL3Jhd19pbWFnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQSxXQUFXLGFBQWE7QUFDakI7QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7O0FDckhBO0FBQUE7QUFBQTtBQUFrRDtBQUNSOztBQUUxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsbUJBQW1CO0FBQzlDO0FBQ0E7QUFDQSw4QkFBOEIsbUJBQW1CO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixtQkFBbUI7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsbUJBQW1CO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0VBQW9FLG1CQUFtQjtBQUN2RjtBQUNBOzs7QUFHQSw4QkFBOEIsOERBQVk7QUFDMUM7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw2QkFBNkIsc0RBQVE7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBOztBQUVBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZEOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxzREFBc0Q7QUFDdEQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7O0FBRUE7O0FBRUEsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7O0FDL2FBO0FBQUE7QUFBQSxXQUFXLGFBQWE7O0FBRXhCOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9mcm9udGVuZC9qcy9tYWluLmpzXCIpO1xuIiwiLy8gaW1wb3J0IHsgcmVzaXplX2ltZyB9IGZyb20gXCIuLi93YXNtL3Byb2MuanNcIjtcclxuZXhwb3J0IGNsYXNzIERyYXdDYW52YXNlcyB7XHJcbiAgICBjb25zdHJ1Y3RvcihpbnB1dF9jYW52YXMpIHtcclxuICAgICAgICB0aGlzLnByb2Nlc3NlZF9pbWFnZV9jYW52YXMgPSBpbnB1dF9jYW52YXM7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzZWRfaW1hZ2VfY3R4ID0gaW5wdXRfY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBkaXNwbGF5cyBpbWFnZSB3aGVuIHVwbG9hZGluZyBhIG5ldyBpbWFnZVxyXG4gICAgZGlzcGxheV9pbWFnZShodG1sX2ltZykge1xyXG4gICAgICAgIC8vIHRoaXMgc2VxdWVuY2Ugc2NhbGVzIHRoZSBpbWFnZSB1cCBvciBkb3duIHRvIGZpdCBpbnRvIGNhbnZhcyBlbGVtZW50XHJcbiAgICAgICAgLy8gY29uc2lkZXIgc2NhbGluZyB0byBhIHBlcmNlbnRhZ2Ugb2YgdGhlIGNhbnZhc1xyXG4gICAgICAgIGNvbnN0IFtyZXNpemVkX3dpZHRoLCByZXNpemVkX2hlaWdodF0gPVxyXG4gICAgICAgICAgICB0aGlzLnNjYWxlX2ltZ19kaW1lbnNpb25zX3RvX2NhbnZhcyhodG1sX2ltZywgdGhpcy5wcm9jZXNzZWRfaW1hZ2VfY2FudmFzKTtcclxuXHJcbiAgICAgICAgLy8gcmVzaXplIHRoZSBjYW52YXMgdG8gZml0IGludG8gY2FudmFzIGVsZW1lbnQgc2l6ZVxyXG4gICAgICAgIHRoaXMucHJvY2Vzc2VkX2ltYWdlX2NhbnZhcy53aWR0aCA9IHRoaXMucHJvY2Vzc2VkX2ltYWdlX2NhbnZhcy5vZmZzZXRXaWR0aDtcclxuICAgICAgICB0aGlzLnByb2Nlc3NlZF9pbWFnZV9jYW52YXMuaGVpZ2h0ID0gdGhpcy5wcm9jZXNzZWRfaW1hZ2VfY2FudmFzLm9mZnNldEhlaWdodDtcclxuXHJcbiAgICAgICAgLy8gdGhlc2UgdHdvIHZhcmlhYmxlcyBjZW50ZXIgdGhlIGltYWdlIHdpdGhpbiB0aGUgY2FudmFzXHJcbiAgICAgICAgY29uc3QgY2VudGVyX3ggPSAodGhpcy5wcm9jZXNzZWRfaW1hZ2VfY2FudmFzLndpZHRoIC0gcmVzaXplZF93aWR0aCkgLyAyO1xyXG4gICAgICAgIGNvbnN0IGNlbnRlcl95ID0gKHRoaXMucHJvY2Vzc2VkX2ltYWdlX2NhbnZhcy5oZWlnaHQgLSByZXNpemVkX2hlaWdodCkgLyAyO1xyXG5cclxuICAgICAgICB0aGlzLnByb2Nlc3NlZF9pbWFnZV9jdHguZHJhd0ltYWdlKFxyXG4gICAgICAgICAgICBodG1sX2ltZyxcclxuICAgICAgICAgICAgY2VudGVyX3gsXHJcbiAgICAgICAgICAgIGNlbnRlcl95LFxyXG4gICAgICAgICAgICByZXNpemVkX3dpZHRoLFxyXG4gICAgICAgICAgICByZXNpemVkX2hlaWdodCxcclxuICAgICAgICApO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBzY2FsZV9pbWdfZGltZW5zaW9uc190b19jYW52YXMoaW1nLCBjYW52YXMpIHtcclxuXHJcbiAgICAgICAgbGV0IHNjYWxlID0gMDtcclxuICAgICAgICBsZXQgbmV3X2hlaWdodCA9IGltZy5oZWlnaHQ7XHJcbiAgICAgICAgbGV0IG5ld193aWR0aCA9IGltZy53aWR0aDtcclxuXHJcbiAgICAgICAgY29uc3Qgd2lkdGhfc2NhbGUgPSBjYW52YXMub2Zmc2V0V2lkdGggLyBpbWcud2lkdGg7XHJcbiAgICAgICAgY29uc3QgaGVpZ2h0X3NjYWxlID0gY2FudmFzLm9mZnNldEhlaWdodCAvIGltZy5oZWlnaHQ7XHJcblxyXG4gICAgICAgIGlmICh3aWR0aF9zY2FsZSA8IGhlaWdodF9zY2FsZSkge1xyXG4gICAgICAgICAgICBzY2FsZSA9IHdpZHRoX3NjYWxlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHNjYWxlID0gaGVpZ2h0X3NjYWxlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGNhbnZhcy5vZmZzZXRXaWR0aCA8IGltZy53aWR0aCB8fCBjYW52YXMub2Zmc2V0SGVpZ2h0IDwgaW1nLmhlaWdodCkge1xyXG4gICAgICAgICAgICBuZXdfd2lkdGggPSBNYXRoLnJvdW5kKGltZy53aWR0aCAqIHNjYWxlKTtcclxuICAgICAgICAgICAgbmV3X2hlaWdodCA9IE1hdGgucm91bmQoaW1nLmhlaWdodCAqIHNjYWxlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBbbmV3X3dpZHRoLCBuZXdfaGVpZ2h0XTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHV0X2ltYWdlKGltZykge1xyXG4gICAgICAgIC8vIHJlc2l6ZSBjYW52YXNlcyB0byBmaXQgdGhlaXIgbmV3IG9mZnNldCB3aWR0aCBhbmQgaGVpZ2h0XHJcbiAgICAgICAgdGhpcy5yZXNpemVfY2FudmFzZXMoKTtcclxuXHJcbiAgICAgICAgLy8gZmluZCBuZXcgb3JpZ2luIHRvIGNlbnRlciBpbWFnZSBvbiBjYW52YXNcclxuICAgICAgICBsZXQgY2VudGVyX3ggPSAodGhpcy5wcm9jZXNzZWRfaW1hZ2VfY2FudmFzLndpZHRoIC0gaW1nLndpZHRoKSAvIDI7XHJcbiAgICAgICAgbGV0IGNlbnRlcl95ID0gKHRoaXMucHJvY2Vzc2VkX2ltYWdlX2NhbnZhcy5oZWlnaHQgLSBpbWcuaGVpZ2h0KSAvIDI7XHJcblxyXG4gICAgICAgIC8vIGxldCBvcmlnaW5hbF9kYXRhID0gbmV3IEltYWdlRGF0YShyZXNpemVkX2ltZywgcmVzaXplZF9pbWdfd2lkdGgpO1xyXG5cclxuICAgICAgICB0aGlzLnByb2Nlc3NlZF9pbWFnZV9jdHgucHV0SW1hZ2VEYXRhKFxyXG4gICAgICAgICAgICBpbWcsXHJcbiAgICAgICAgICAgIGNlbnRlcl94LFxyXG4gICAgICAgICAgICBjZW50ZXJfeSxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgaW1nLndpZHRoLFxyXG4gICAgICAgICAgICBpbWcuaGVpZ2h0LFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZHJhdyBpbWFnZSB3aGVuIHNob3dpbmcgcHJvY2Vzc2VkIG91dHB1dCBvciB0aGUgb3JpZ2luYWwgaW1hZ2VcclxuICAgIGRyYXdfaW1hZ2UoaW1hZ2VfY2FudmFzKSB7XHJcblxyXG4gICAgICAgIC8vIHJlc2l6ZSB0aGUgY2FudmFzIHRvIGZpdCBpbnRvIGNhbnZhcyBlbGVtZW50IHNpemVcclxuICAgICAgICB0aGlzLnByb2Nlc3NlZF9pbWFnZV9jYW52YXMud2lkdGggPSB0aGlzLnByb2Nlc3NlZF9pbWFnZV9jYW52YXMub2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzZWRfaW1hZ2VfY2FudmFzLmhlaWdodCA9IHRoaXMucHJvY2Vzc2VkX2ltYWdlX2NhbnZhcy5vZmZzZXRIZWlnaHQ7XHJcblxyXG4gICAgICAgIGNvbnN0IFtyZXNpemVkX3dpZHRoLCByZXNpemVkX2hlaWdodF0gPVxyXG4gICAgICAgICAgICB0aGlzLnNjYWxlX2ltZ19kaW1lbnNpb25zX3RvX2NhbnZhcyhcclxuICAgICAgICAgICAgICAgIGltYWdlX2NhbnZhcyxcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc2VkX2ltYWdlX2NhbnZhc1xyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyB0aGVzZSB0d28gdmFyaWFibGVzIGNlbnRlciB0aGUgaW1hZ2Ugd2l0aGluIHRoZSBjYW52YXNcclxuICAgICAgICBjb25zdCBjZW50ZXJfeCA9ICh0aGlzLnByb2Nlc3NlZF9pbWFnZV9jYW52YXMud2lkdGggLSByZXNpemVkX3dpZHRoKSAvIDI7XHJcbiAgICAgICAgY29uc3QgY2VudGVyX3kgPSAodGhpcy5wcm9jZXNzZWRfaW1hZ2VfY2FudmFzLmhlaWdodCAtIHJlc2l6ZWRfaGVpZ2h0KSAvIDI7XHJcblxyXG4gICAgICAgIHRoaXMucHJvY2Vzc2VkX2ltYWdlX2N0eC5kcmF3SW1hZ2UoXHJcbiAgICAgICAgICAgIGltYWdlX2NhbnZhcyxcclxuICAgICAgICAgICAgY2VudGVyX3gsXHJcbiAgICAgICAgICAgIGNlbnRlcl95LFxyXG4gICAgICAgICAgICByZXNpemVkX3dpZHRoLFxyXG4gICAgICAgICAgICByZXNpemVkX2hlaWdodCxcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHJlc2l6ZV9jYW52YXNlcygpIHtcclxuICAgICAgICB0aGlzLnByb2Nlc3NlZF9pbWFnZV9jYW52YXMud2lkdGggPSB0aGlzLnByb2Nlc3NlZF9pbWFnZV9jYW52YXMub2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzZWRfaW1hZ2VfY2FudmFzLmhlaWdodCA9IHRoaXMucHJvY2Vzc2VkX2ltYWdlX2NhbnZhcy5vZmZzZXRIZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZGlzcGxheV9vbmx5X3Byb2Nlc3NlZF9pbWFnZSgpIHtcclxuICAgICAgICB0aGlzLnByb2Nlc3NlZF9pbWFnZV9jYW52YXMuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZS1jYW52YXNlc1wiKTtcclxuICAgICAgICB0aGlzLnByb2Nlc3NlZF9pbWFnZV9jYW52YXMuY2xhc3NMaXN0LmFkZChcIm9uZS1hY3RpdmUtY2FudmFzXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGRpc3BsYXlfb3JpZ2luYWxfaW1hZ2VfY2FudmFzKCkge1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2VkX2ltYWdlX2NhbnZhcy5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlLWNhbnZhc2VzXCIpO1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc2VkX2ltYWdlX2NhbnZhcy5jbGFzc0xpc3QucmVtb3ZlKFwib25lLWFjdGl2ZS1jYW52YXNcIik7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBEcmF3Q2FudmFzZXMgfSBmcm9tIFwiLi9kcmF3X2NhbnZhc2VzLmpzXCI7XHJcbmltcG9ydCB7IFJhd0ltYWdlIH0gZnJvbSBcIi4vcmF3X2ltYWdlLmpzXCI7XHJcblxyXG5jb25zdCBkZWJvdW5jZSA9IChmdW5jLCBkZWxheSkgPT4ge1xyXG4gICAgbGV0IGluRGVib3VuY2U7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzO1xyXG4gICAgICAgIGNvbnN0IGFyZ3MgPSBhcmd1bWVudHM7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KGluRGVib3VuY2UpO1xyXG4gICAgICAgIGluRGVib3VuY2UgPSBzZXRUaW1lb3V0KCgpID0+IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyksIGRlbGF5KTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgdGhyb3R0bGUgPSAoZnVuYywgbGltaXQpID0+IHtcclxuICAgIGxldCBsYXN0RnVuYztcclxuICAgIGxldCBsYXN0UmFuO1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjb25zdCBjb250ZXh0ID0gdGhpcztcclxuICAgICAgICBjb25zdCBhcmdzID0gYXJndW1lbnRzO1xyXG4gICAgICAgIGlmICghbGFzdFJhbikge1xyXG4gICAgICAgICAgICBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG4gICAgICAgICAgICBsYXN0UmFuID0gRGF0ZS5ub3coKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQobGFzdEZ1bmMpO1xyXG4gICAgICAgICAgICBsYXN0RnVuYyA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKChEYXRlLm5vdygpIC0gbGFzdFJhbikgPj0gbGltaXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxhc3RSYW4gPSBEYXRlLm5vdygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCBsaW1pdCAtIChEYXRlLm5vdygpIC0gbGFzdFJhbikpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbWFpbigpIHtcclxuICAgIGxldCBpbWFnZV93b3JrZXIgPSBuZXcgV29ya2VyKFwiLi9qcy9kaXN0L2J1bmRsZV93b3JrZXIuanNcIik7XHJcbiAgICBpbWFnZV93b3JrZXIub25tZXNzYWdlID0gZXZlbnQgPT4ge1xyXG4gICAgICAgIGlmIChldmVudC5kYXRhLm1lc3NhZ2UgPT09IFwid2FzbSBJTklUSUFMSVpFRFwiKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke2V2ZW50LmRhdGEubWVzc2FnZX1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZXZlbnQuZGF0YS5tZXNzYWdlID09PSBcIklOVkVSVEVEXCIpIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYCR7ZXZlbnQuZGF0YS5tZXNzYWdlfWApO1xyXG4gICAgICAgICAgICBsZXQgaW1hZ2UgPSBuZXcgSW1hZ2VEYXRhKFxyXG4gICAgICAgICAgICAgICAgbmV3IFVpbnQ4Q2xhbXBlZEFycmF5KGV2ZW50LmRhdGEuaW1hZ2UpLCBldmVudC5kYXRhLndpZHRoXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHJhd19pbWFnZXMuc2V0X291dHB1dF9pbWFnZShcclxuICAgICAgICAgICAgICAgIGltYWdlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGRyYXdfY2FudmFzZXMuZHJhd19pbWFnZShyYXdfaW1hZ2VzLm91dHB1dF9pbWdfY2FudmFzKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChldmVudC5kYXRhLm1lc3NhZ2UgPT09IFwiQk9YIEJMVVJcIikge1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgJHtldmVudC5kYXRhLm1lc3NhZ2V9YCk7XHJcbiAgICAgICAgICAgIGxldCBpbWFnZSA9IG5ldyBJbWFnZURhdGEoXHJcbiAgICAgICAgICAgICAgICBuZXcgVWludDhDbGFtcGVkQXJyYXkoZXZlbnQuZGF0YS5pbWFnZSksIGV2ZW50LmRhdGEud2lkdGhcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgcmF3X2ltYWdlcy5zZXRfb3V0cHV0X2ltYWdlKGltYWdlKTtcclxuICAgICAgICAgICAgZHJhd19jYW52YXNlcy5kcmF3X2ltYWdlKHJhd19pbWFnZXMub3V0cHV0X2ltZ19jYW52YXMoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGV2ZW50LmRhdGEubWVzc2FnZSA9PT0gXCJHQU1NQVwiKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGAke2V2ZW50LmRhdGEubWVzc2FnZX1gKTtcclxuICAgICAgICAgICAgbGV0IGltYWdlID0gbmV3IEltYWdlRGF0YShcclxuICAgICAgICAgICAgICAgIG5ldyBVaW50OENsYW1wZWRBcnJheShldmVudC5kYXRhLmltYWdlKSwgZXZlbnQuZGF0YS53aWR0aFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICByYXdfaW1hZ2VzLnNldF9vdXRwdXRfaW1hZ2UoaW1hZ2UpO1xyXG4gICAgICAgICAgICBkcmF3X2NhbnZhc2VzLmRyYXdfaW1hZ2UocmF3X2ltYWdlcy5vdXRwdXRfaW1nX2NhbnZhcygpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGB1bnJlY29nbml6ZWQgbWVzc2FnZSBmcm9tIHdlYiB3b3JrZXI6ICR7ZXZlbnQuZGF0YS5tZXNzYWdlfWApO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG5cclxuICAgIGNvbnN0IGRyYXdfY2FudmFzZXMgPSBuZXcgRHJhd0NhbnZhc2VzKFxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5wdXQtY2FudmFzXCIpXHJcbiAgICApO1xyXG5cclxuICAgIGxldCByYXdfaW1hZ2VzID0gbnVsbDtcclxuXHJcbiAgICBsZXQgb3JpZ2luYWxfaW1nID0gbmV3IEltYWdlKCk7XHJcblxyXG4gICAgLy8gdGFrZXMgdGhlIGltYWdlIHVybCBhbmQgZGlzcGxheXMgaXQgb24gYm90aCBjYW52YXNcclxuICAgIGZ1bmN0aW9uIGltcG9ydF9hbmRfZGlzcGxheShpbWFnZV91cmwpIHtcclxuICAgICAgICBvcmlnaW5hbF9pbWcuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgZHJhd19jYW52YXNlcy5kaXNwbGF5X2ltYWdlKG9yaWdpbmFsX2ltZyk7XHJcblxyXG4gICAgICAgICAgICByYXdfaW1hZ2VzID0gbmV3IFJhd0ltYWdlKFxyXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxfaW1nLFxyXG4gICAgICAgICAgICAgICAgZHJhd19jYW52YXNlcy5wcm9jZXNzZWRfaW1hZ2VfY2FudmFzLFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBpbWFnZV93b3JrZXIucG9zdE1lc3NhZ2UoXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJVU0VSIElNQUdFXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2U6IHJhd19pbWFnZXMucHJldmlld19pbWcoKS5kYXRhLmJ1ZmZlcixcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogcmF3X2ltYWdlcy5wcmV2aWV3X2ltZygpLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIFtyYXdfaW1hZ2VzLm9yaWdpbmFsX2ltZygpLmRhdGEuYnVmZmVyXVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgICAgICBvcmlnaW5hbF9pbWcuc3JjID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoaW1hZ2VfdXJsKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBoYW5kbGVzIGdldHRpbmcgYSBuZXcgaW1hZ2VcclxuICAgIC8vIGhhdmUgdG8gYWRkIGNoZWNrcyB0aGF0IG9ubHkgZ2V0IGpwZyBhbmQgcG5nIGltYWdlc1xyXG4gICAgbGV0IGZpbGVfaW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbGUtaW5wdXRcIik7XHJcbiAgICBmaWxlX2lucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xyXG4gICAgICAgIGxldCBpbWFnZSA9IGZpbGVfaW5wdXQuZmlsZXNbMF07XHJcbiAgICAgICAgaW1wb3J0X2FuZF9kaXNwbGF5KGltYWdlKTtcclxuXHJcbiAgICAgICAgZmlsZV9pbnB1dC52YWx1ZSA9IG51bGw7XHJcbiAgICAgICAgbGFyZ2VfdXBsb2FkX2J1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgLy8gZGVzZWxlY3RzIGFueSBhY3RpdmUgb3B0aW9uIGFuZCBoaWRlcyBhbnkgc2xpZGVyc1xyXG4gICAgICAgIC8vIHRoYXQgd2VyZSBpbiBlZmZlY3QgaWYgdXNlciBpcyBzZWxlY3RpbmcgYSBuZXcgaW1hZ2VcclxuICAgICAgICAvLyB0aGlzIHdpbGwgbmVlZCBzb21lIG1vcmUgd29ya2luZyBpZiBJIGRlY2lkZSB0b1xyXG4gICAgICAgIC8vIG1ha2UgYWN0aXZlX2lucHV0IGFuZCBhY3RpdmVfb3B0aW9uIG51bGwgY2FwYWJsZVxyXG4gICAgICAgIC8vIHZhcmlhYmxlc1xyXG4gICAgICAgIGlmIChhY3RpdmVfb3B0aW9uICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGFjdGl2ZV9vcHRpb24uY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdC1vcHRpb25cIik7XHJcbiAgICAgICAgICAgIGFjdGl2ZV9vcHRpb24gPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGFjdGl2ZV9pbnB1dCAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBhY3RpdmVfaW5wdXQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gbWlnaHQgbmVlZCB0byBjaGVjayBpZiBhbGdvcml0aGltLWluZm8gaXMgc3RpbGwgZGlzcGxheWluZyBzb21ldGhpbmdcclxuICAgICAgICAvLyBldmVuIGlmIGl0J3Mgbm90IG51bGxcclxuICAgICAgICBpZiAoYWN0aXZlX2luZm8gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgYWN0aXZlX2luZm8uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB3aWxsIGhhdmUgdG8gbWFrZSBzdXJlIHRoaXMgZGlzcGxheXMgdGhlIG5ldyBpbWFnZSB3aXRob3V0IFxyXG4gICAgICAgIC8vIGFueSB3ZWlyZCBidWdzIFxyXG4gICAgICAgIGRyYXdfY2FudmFzZXMuZGlzcGxheV9vbmx5X3Byb2Nlc3NlZF9pbWFnZSgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgbGV0IGxhcmdlX3VwbG9hZF9idXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxhcmdlLXVwbG9hZC1idXR0b25cIik7XHJcbiAgICBsYXJnZV91cGxvYWRfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgICAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogNzY4cHgpXCIpKSB7XHJcbiAgICAgICAgICAgIGlmIChzaWRlYmFyLmNsYXNzTGlzdC5jb250YWlucyhcIm1vYmlsZS12aXNpYmxlXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBzaWRlYmFyLmNsYXNzTGlzdC5yZW1vdmUoXCJtb2JpbGUtdmlzaWJsZVwiKTtcclxuICAgICAgICAgICAgICAgIHNpZGViYXIuY2xhc3NMaXN0LmFkZChcIm1vYmlsZS1oaWRkZW5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZmlsZV9pbnB1dC5jbGljaygpO1xyXG4gICAgfSk7XHJcbiAgICAvLyB0aGlzIGJ1dHRvbiBhY3RpdmF0ZXMgdGhlIGZpbGUgaW5wdXQgZXZlbnRcclxuICAgIGxldCB1cGxvYWRfaW1hZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInVwbG9hZC1pbWFnZVwiKTtcclxuICAgIHVwbG9hZF9pbWFnZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICAgIGlmICh3aW5kb3cubWF0Y2hNZWRpYShcIihtYXgtd2lkdGg6IDc2OHB4KVwiKSkge1xyXG4gICAgICAgICAgICBpZiAoc2lkZWJhci5jbGFzc0xpc3QuY29udGFpbnMoXCJtb2JpbGUtdmlzaWJsZVwiKSkge1xyXG4gICAgICAgICAgICAgICAgc2lkZWJhci5jbGFzc0xpc3QucmVtb3ZlKFwibW9iaWxlLXZpc2libGVcIik7XHJcbiAgICAgICAgICAgICAgICBzaWRlYmFyLmNsYXNzTGlzdC5hZGQoXCJtb2JpbGUtaGlkZGVuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbGVfaW5wdXQuY2xpY2soKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIHRha2VzIG9yaWdpbmFsIGltYWdlIGFuZCByZXNpemVzIGl0IFxyXG4gICAgLy8gY3VycmVudGx5IGRvZXNuJ3QgcmVhcHBseSBlZGl0IG1hZGUgYnkgY3VycmVudCBwcm9jZXNzaW5nIGFsZ29yaXRobVxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcclxuICAgICAgICBpZiAocmF3X2ltYWdlcyAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAvLyB1c2VzIG9yaWdpbmFsIGltYWdlIHRvIHJlc2l6ZSB0byB0aGUgbmV3IG91dHB1dCBjYW52YXMgXHJcbiAgICAgICAgICAgIC8vIGRpbWVuc2lvbnNcclxuICAgICAgICAgICAgY29uc3QgW3Jlc2l6ZWRfaW1nX3dpZHRoLCByZXNpemVkX2ltZ19oZWlnaHRdID1cclxuICAgICAgICAgICAgICAgIHNjYWxlX2ltZ19kaW1lbnNpb25zX3RvX2NhbnZhcyhcclxuICAgICAgICAgICAgICAgICAgICByYXdfaW1hZ2VzLm9yaWdpbmFsX2ltZygpLFxyXG4gICAgICAgICAgICAgICAgICAgIGRyYXdfY2FudmFzZXMucHJvY2Vzc2VkX2ltYWdlX2NhbnZhc1xyXG4gICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGRyYXdfY2FudmFzZXMucmVzaXplX2NhbnZhc2VzKCk7XHJcblxyXG4gICAgICAgICAgICBkcmF3X2NhbnZhc2VzLnJlc2l6ZWRfd2lkdGggPSByZXNpemVkX2ltZ193aWR0aDtcclxuICAgICAgICAgICAgZHJhd19jYW52YXNlcy5yZXNpemVkX2hlaWdodCA9IHJlc2l6ZWRfaW1nX2hlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGRyYXdfY2FudmFzZXMuZHJhd19pbWFnZShcclxuICAgICAgICAgICAgICAgIHJhd19pbWFnZXMub3V0cHV0X2ltZ19jYW52YXMoKSxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBsZXQgaW52ZXJ0X29wdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW52ZXJ0LW9wdGlvblwiKTtcclxuICAgIGxldCBibHVyX29wdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmx1ci1vcHRpb25zXCIpO1xyXG4gICAgbGV0IGdhbW1hX29wdGlvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtbWEtb3B0aW9uXCIpO1xyXG4gICAgLy8gbGV0IGFjdGl2ZV9vcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTsgLy8gY3JlYXRlcyBkdW1teSBlbGVtZW50IHNvIGl0IHdvdWxkbid0IGJlIG51bGxcclxuICAgIGxldCBhY3RpdmVfb3B0aW9uID0gbnVsbDtcclxuXHJcbiAgICBsZXQgcHJvY2Vzc2luZ19vcHRpb25zID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwcm9jZXNzaW5nLW9wdGlvbnNcIik7XHJcblxyXG4gICAgLy8gbWF5YmUgbWFrZSB0aGlzIG51bGxcclxuICAgIC8vIGFsc28gbWF5YmUgbWFrZSB0aGlzIG51bGxcclxuICAgIC8vIGxldCBhY3RpdmVfaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTsgLy8gY3JlYXRlcyBkdW1teSBlbGVtZW50IHNvIGl0IHdvdWxkbid0IGJlIG51bGxcclxuICAgIGxldCBhY3RpdmVfaW5wdXQgPSBudWxsO1xyXG5cclxuICAgIGxldCBpbnZlcnRfaW5mbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW52ZXJ0LWluZm9cIik7XHJcbiAgICBsZXQgYm94X2JsdXJfaW5mbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYm94LWJsdXItaW5mb1wiKTtcclxuICAgIGxldCBnYW1tYV9pbmZvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJnYW1tYS1pbmZvXCIpO1xyXG4gICAgLy8gbGV0IGFjdGl2ZV9pbmZvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XHJcbiAgICBsZXQgYWN0aXZlX2luZm8gPSBudWxsO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNoYW5nZV9hY3RpdmVfb3B0aW9uKGFsZ29yaXRobV9vcHRpb24sIGFsZ29yaXRobV9pbnB1dCwgYWxnb3JpdGhtX2luZm8pIHtcclxuXHJcbiAgICAgICAgaWYgKGFjdGl2ZV9pbmZvID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGFjdGl2ZV9pbmZvID0gYWxnb3JpdGhtX2luZm87XHJcbiAgICAgICAgICAgIGFjdGl2ZV9pbmZvLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xyXG4gICAgICAgIH0gXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGFjdGl2ZV9pbmZvLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgYWN0aXZlX2luZm8gPSBhbGdvcml0aG1faW5mbztcclxuICAgICAgICAgICAgYWN0aXZlX2luZm8uc3R5bGUuZGlzcGxheSA9IFwiXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYWN0aXZlX2lucHV0ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHByb2Nlc3Npbmdfb3B0aW9ucy5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcclxuICAgICAgICAgICAgYWN0aXZlX2lucHV0ID0gYWxnb3JpdGhtX2lucHV0O1xyXG4gICAgICAgICAgICBhY3RpdmVfaW5wdXQuc3R5bGUuZGlzcGxheSA9IFwiXCI7XHJcbiAgICAgICAgfSBcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgYWN0aXZlX2lucHV0LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICAgICAgYWN0aXZlX2lucHV0ID0gYWxnb3JpdGhtX2lucHV0O1xyXG4gICAgICAgICAgICBhY3RpdmVfaW5wdXQuc3R5bGUuZGlzcGxheSA9IFwiXCI7XHJcbiAgICAgICAgICAgIHByb2Nlc3Npbmdfb3B0aW9ucy5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChhY3RpdmVfb3B0aW9uID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGFjdGl2ZV9vcHRpb24gPSBhbGdvcml0aG1fb3B0aW9uO1xyXG4gICAgICAgICAgICBhY3RpdmVfb3B0aW9uLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3Qtb3B0aW9uXCIpO1xyXG4gICAgICAgIH0gXHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGFjdGl2ZV9vcHRpb24uY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdC1vcHRpb25cIik7XHJcbiAgICAgICAgICAgIGFjdGl2ZV9vcHRpb24gPSBhbGdvcml0aG1fb3B0aW9uO1xyXG4gICAgICAgICAgICBhY3RpdmVfb3B0aW9uLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3Qtb3B0aW9uXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGRlYWN0aXZhdGVfb3B0aW9uKGFsZ29yaXRobV9vcHRpb24pIHtcclxuICAgICAgICBhbGdvcml0aG1fb3B0aW9uLmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3Qtb3B0aW9uXCIpO1xyXG4gICAgICAgIGFjdGl2ZV9pbnB1dC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcblxyXG4gICAgICAgIGFjdGl2ZV9pbmZvLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuXHJcbiAgICAgICAgYWN0aXZlX29wdGlvbiA9IG51bGw7XHJcbiAgICAgICAgYWN0aXZlX2lucHV0ID0gbnVsbDtcclxuICAgICAgICBhY3RpdmVfaW5mbyA9IG51bGw7XHJcbiAgICAgICAgcHJvY2Vzc2luZ19vcHRpb25zLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuXHJcbiAgICAgICAgdG9nZ2xlX2FsZ29yaXRobXNfc2lkZWJhcigpO1xyXG5cclxuICAgICAgICByYXdfaW1hZ2VzLnNldF9vdXRwdXRfaW1hZ2VfdG9fb3JpZ2luYWwoKTtcclxuICAgICAgICBkcmF3X2NhbnZhc2VzLmRyYXdfaW1hZ2UocmF3X2ltYWdlcy5vcmlnaW5hbF9pbWdfY2FudmFzKCkpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgbGV0IG9wdGlvbnMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wdGlvbnNcIik7XHJcbiAgICAvLyB0aGVzZSBldmVudHMgc2hvdWxkIGNoZWNrIGlmIHRoZXkgYXJlIHRoZSBhY3RpdmUgb3B0aW9uIGFuZCBpZiBjbGlja2VkIGFnYWluXHJcbiAgICAvLyB0aGV5IHNob3VsZCBkZWFjdGl2YXRlIGFuZCBwcmVzZW50IHRoZSBvcmlnaW5hbCBpbWFnZVxyXG4gICAgb3B0aW9ucy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZGVib3VuY2UoKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgaWYgKGFjdGl2ZV9vcHRpb24gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgYWN0aXZlX29wdGlvbi5jbGFzc0xpc3QucmVtb3ZlKFwic2VsZWN0LW9wdGlvblwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChldmVudC50YXJnZXQubWF0Y2hlcyhcIiNpbnZlcnQtb3B0aW9uXCIpKSB7XHJcbiAgICAgICAgICAgIGlmIChyYXdfaW1hZ2VzID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydChcIlVwbG9hZCBhbiBpbWFnZSB0byB1c2UgdGhlc2UgYWxnb3JpdGhtc1wiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGFjdGl2ZV9vcHRpb24gPT09IGludmVydF9vcHRpb24pIHtcclxuICAgICAgICAgICAgICAgIGRlYWN0aXZhdGVfb3B0aW9uKGludmVydF9vcHRpb24pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY2hhbmdlX2FjdGl2ZV9vcHRpb24oaW52ZXJ0X29wdGlvbiwgaW52ZXJ0X2J1dHRvbiwgaW52ZXJ0X2luZm8pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRvZ2dsZV9hbGdvcml0aG1zX3NpZGViYXIoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpbWFnZV93b3JrZXIucG9zdE1lc3NhZ2UoXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIklOVkVSVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogcmF3X2ltYWdlcy5wcmV2aWV3X2ltZygpLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGV2ZW50LnRhcmdldC5tYXRjaGVzKFwiI2JsdXItb3B0aW9uc1wiKSkge1xyXG4gICAgICAgICAgICBpZiAocmF3X2ltYWdlcyA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJVcGxvYWQgYW4gaW1hZ2UgdG8gdXNlIHRoZXNlIGFsZ29yaXRobXNcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChhY3RpdmVfb3B0aW9uID09PSBibHVyX29wdGlvbikge1xyXG4gICAgICAgICAgICAgICAgZGVhY3RpdmF0ZV9vcHRpb24oYmx1cl9vcHRpb24pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY2hhbmdlX2FjdGl2ZV9vcHRpb24oYmx1cl9vcHRpb24sIGJveF9ibHVyX3NsaWRlcl93cmFwcGVyLCBib3hfYmx1cl9pbmZvKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0b2dnbGVfYWxnb3JpdGhtc19zaWRlYmFyKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gcHV0cyB0aGUgYm94IGJsdXIgc2xpZGVyIGF0IDEgYmVjYXVzZSB0aGUgZGVmYXVsdCBwb3NpdGlvbiBpcyBpbiB0aGUgbWlkZGxlXHJcbiAgICAgICAgICAgICAgICBib3hfYmx1cl9zbGlkZXIudmFsdWUgPSAxO1xyXG4gICAgICAgICAgICAgICAgYm94X2JsdXJfdmFsdWVfZWxlbS52YWx1ZSA9IGJveF9ibHVyX3NsaWRlci52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQga2VybmVsX3NpemUgPSBib3hfYmx1cl9zbGlkZXIudmFsdWVBc051bWJlcjtcclxuXHJcbiAgICAgICAgICAgICAgICBpbWFnZV93b3JrZXIucG9zdE1lc3NhZ2UoXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkJPWCBCTFVSXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiByYXdfaW1hZ2VzLnByZXZpZXdfaW1nKCkud2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtlcm5lbF9zaXplOiBrZXJuZWxfc2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZXZlbnQudGFyZ2V0Lm1hdGNoZXMoXCIjZ2FtbWEtb3B0aW9uXCIpKSB7XHJcbiAgICAgICAgICAgIGlmIChyYXdfaW1hZ2VzID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydChcIlVwbG9hZCBhbiBpbWFnZSB0byB1c2UgdGhlc2UgYWxnb3JpdGhtc1wiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoYWN0aXZlX29wdGlvbiA9PT0gZ2FtbWFfb3B0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBkZWFjdGl2YXRlX29wdGlvbihnYW1tYV9vcHRpb24pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY2hhbmdlX2FjdGl2ZV9vcHRpb24oZ2FtbWFfb3B0aW9uLCBnYW1tYV9zbGlkZXJfd3JhcHBlciwgZ2FtbWFfaW5mbyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdG9nZ2xlX2FsZ29yaXRobXNfc2lkZWJhcigpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIHB1dHMgdGhlIGdhbW1hIHNsaWRlciBhdCAxIGJlY2F1c2UgdGhpcyBrZWVwcyB0aGUgaW1hZ2UgdW5jaGFuZ2VkIFxyXG4gICAgICAgICAgICAgICAgZ2FtbWFfc2xpZGVyLnZhbHVlID0gMTtcclxuICAgICAgICAgICAgICAgIGdhbW1hX3ZhbHVlX2VsZW0udmFsdWUgPSAxO1xyXG5cclxuICAgICAgICAgICAgICAgIGltYWdlX3dvcmtlci5wb3N0TWVzc2FnZShcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiR0FNTUFcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHJhd19pbWFnZXMucHJldmlld19pbWcoKS53aWR0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2FtbWE6IGdhbW1hX3NsaWRlci52YWx1ZUFzTnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9KSwgMzMpO1xyXG5cclxuICAgIGxldCBpbnZlcnRfYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbnZlcnQtYnV0dG9uXCIpO1xyXG4gICAgaW52ZXJ0X2J1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZGVib3VuY2UoKCkgPT4ge1xyXG4gICAgICAgIGltYWdlX3dvcmtlci5wb3N0TWVzc2FnZShcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJJTlZFUlQgQlVUVE9OXCIsXHJcbiAgICAgICAgICAgICAgICBpbWFnZTogcmF3X2ltYWdlcy5vdXRwdXRfaW1nKCkuZGF0YS5idWZmZXIsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogcmF3X2ltYWdlcy5vdXRwdXRfaW1nKCkud2lkdGgsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFtyYXdfaW1hZ2VzLm91dHB1dF9pbWcoKS5kYXRhLmJ1ZmZlcl1cclxuICAgICAgICApO1xyXG4gICAgfSksIDMzKTtcclxuXHJcbiAgICBsZXQgZ2FtbWFfc2xpZGVyX3dyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbW1hLXNsaWRlci13cmFwcGVyXCIpO1xyXG4gICAgbGV0IGdhbW1hX3NsaWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZ2FtbWEtc2xpZGVyXCIpO1xyXG4gICAgbGV0IGdhbW1hX3ZhbHVlX2VsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImdhbW1hLXZhbHVlXCIpO1xyXG4gICAgbGV0IGdhbW1hX3NsaWRlcl9mdW5jID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgbGV0IGdhbW1hID0gZXZlbnQudGFyZ2V0LnZhbHVlQXNOdW1iZXI7XHJcbiAgICAgICAgZ2FtbWFfdmFsdWVfZWxlbS52YWx1ZSA9IGdhbW1hO1xyXG5cclxuICAgICAgICAvLyBkb2VzIGEgZ2FtbWEgdHJhbnNmb3JtYXRpb24gb24gZnVsbCBzaXplIGltYWdlIHByZXZpZXcgXHJcbiAgICAgICAgaW1hZ2Vfd29ya2VyLnBvc3RNZXNzYWdlKFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkdBTU1BXCIsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogcmF3X2ltYWdlcy5wcmV2aWV3X2ltZygpLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgZ2FtbWE6IGdhbW1hLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgfVxyXG4gICAgZ2FtbWFfc2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCBkZWJvdW5jZShnYW1tYV9zbGlkZXJfZnVuYywgMTAwKSk7XHJcblxyXG4gICAgbGV0IGJveF9ibHVyX3NsaWRlcl93cmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJib3gtYmx1ci1zbGlkZXItd3JhcHBlclwiKTtcclxuICAgIGxldCBib3hfYmx1cl9zbGlkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJveC1ibHVyLXNsaWRlclwiKTtcclxuICAgIGxldCBib3hfYmx1cl92YWx1ZV9lbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJib3gtYmx1ci12YWx1ZVwiKTtcclxuICAgIGxldCBib3hfc2xpZGVyX2Z1bmMgPSAoZXZlbnQpID0+IHtcclxuICAgICAgICAvLyBmdW5jdGlvbiBzbGlkZXJfZnVuYyhldmVudCkge1xyXG4gICAgICAgIGxldCBrZXJuZWxfc2l6ZSA9IGV2ZW50LnRhcmdldC52YWx1ZUFzTnVtYmVyO1xyXG4gICAgICAgIGJveF9ibHVyX3ZhbHVlX2VsZW0udmFsdWUgPSBrZXJuZWxfc2l6ZTtcclxuXHJcbiAgICAgICAgLy8gYm94IGJsdXJzIGZ1bGwgc2l6ZSBpbWFnZSBwcmV2aWV3IFxyXG4gICAgICAgIGltYWdlX3dvcmtlci5wb3N0TWVzc2FnZShcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJCT1ggQkxVUlwiLFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IHJhd19pbWFnZXMucHJldmlld19pbWcoKS53aWR0aCxcclxuICAgICAgICAgICAgICAgIGtlcm5lbF9zaXplOiBrZXJuZWxfc2l6ZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICApO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBib3hfYmx1cl9zbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIGRlYm91bmNlKGJveF9zbGlkZXJfZnVuYywgMTUwKSk7XHJcbiAgICAvLyBib3hfYmx1cl9zbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCBib3hfc2xpZGVyX2Z1bmMpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHNjYWxlX2ltZ19kaW1lbnNpb25zX3RvX2NhbnZhcyhpbWcsIGNhbnZhcykge1xyXG5cclxuICAgICAgICBsZXQgc2NhbGUgPSAwO1xyXG4gICAgICAgIGxldCBuZXdfaGVpZ2h0ID0gaW1nLmhlaWdodDtcclxuICAgICAgICBsZXQgbmV3X3dpZHRoID0gaW1nLndpZHRoO1xyXG5cclxuICAgICAgICBjb25zdCB3aWR0aF9zY2FsZSA9IGNhbnZhcy5vZmZzZXRXaWR0aCAvIGltZy53aWR0aDtcclxuICAgICAgICBjb25zdCBoZWlnaHRfc2NhbGUgPSBjYW52YXMub2Zmc2V0SGVpZ2h0IC8gaW1nLmhlaWdodDtcclxuXHJcbiAgICAgICAgaWYgKHdpZHRoX3NjYWxlIDwgaGVpZ2h0X3NjYWxlKSB7XHJcbiAgICAgICAgICAgIHNjYWxlID0gd2lkdGhfc2NhbGU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2NhbGUgPSBoZWlnaHRfc2NhbGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY2FudmFzLm9mZnNldFdpZHRoIDwgaW1nLndpZHRoIHx8IGNhbnZhcy5vZmZzZXRIZWlnaHQgPCBpbWcuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIG5ld193aWR0aCA9IE1hdGgucm91bmQoaW1nLndpZHRoICogc2NhbGUpO1xyXG4gICAgICAgICAgICBuZXdfaGVpZ2h0ID0gTWF0aC5yb3VuZChpbWcuaGVpZ2h0ICogc2NhbGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIFtuZXdfd2lkdGgsIG5ld19oZWlnaHRdO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBsZXQgc2lkZWJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2lkZWJhclwiKTtcclxuICAgIGxldCBhbGdvcml0aG1zX2J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3Blbi1hbGdvcml0aG1zXCIpO1xyXG4gICAgbGV0IGFsZ29yaXRobXNfYXJyb3cgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9wZW4tYWxnb3JpdGhtcy1hcnJvd1wiKTtcclxuICAgIGFsZ29yaXRobXNfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgICAgdG9nZ2xlX2FsZ29yaXRobXNfc2lkZWJhcigpO1xyXG4gICAgfSk7XHJcbiAgICBmdW5jdGlvbiB0b2dnbGVfYWxnb3JpdGhtc19zaWRlYmFyKCkge1xyXG4gICAgICAgIGlmICh3aW5kb3cubWF0Y2hNZWRpYShcIihtYXgtd2lkdGg6IDc2OHB4KVwiKS5tYXRjaGVzKSB7XHJcbiAgICAgICAgICAgICAgICBzaWRlYmFyLmNsYXNzTGlzdC50b2dnbGUoXCJtb2JpbGUtaGlkZGVuXCIpO1xyXG4gICAgICAgICAgICAgICAgc2lkZWJhci5jbGFzc0xpc3QudG9nZ2xlKFwibW9iaWxlLXZpc2libGVcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgYWxnb3JpdGhtc19hcnJvdy5jbGFzc0xpc3QudG9nZ2xlKFwiZmEtYW5nbGUtcmlnaHRcIik7XHJcbiAgICAgICAgICAgICAgICBhbGdvcml0aG1zX2Fycm93LmNsYXNzTGlzdC50b2dnbGUoXCJmYS1hbmdsZS1kb3duXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubWFpbigpO1xyXG4iLCIvLyBpbXBvcnQgeyByZXNpemVfaW1nIH0gZnJvbSBcIi4uL3dhc20vcHJvYy5qc1wiO1xyXG5cclxuY29uc3QgbWF4X2RpbWVuc2lvbiA9IDE1MDA7XHJcblxyXG5leHBvcnQgY2xhc3MgUmF3SW1hZ2Uge1xyXG4gICAgY29uc3RydWN0b3Iob3JpZ2luYWxfaW1nLCBjYW52YXMpIHtcclxuICAgICAgICB0aGlzLm91dHB1dF9pbWFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgICAgIHRoaXMub3JpZ2luYWxfaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgICAgICB0aGlzLnByZXZpZXdfaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcmV2aWV3X2ltYWdlX2N0eCA9IHRoaXMucHJldmlld19pbWFnZS5nZXRDb250ZXh0KFwiMmRcIik7XHJcbiAgICAgICAgdGhpcy5vdXRwdXRfaW1hZ2VfY3R4ID0gdGhpcy5vdXRwdXRfaW1hZ2UuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgICAgIHRoaXMub3JpZ2luYWxfaW1hZ2VfY3R4ID0gdGhpcy5vcmlnaW5hbF9pbWFnZS5nZXRDb250ZXh0KFwiMmRcIik7XHJcblxyXG4gICAgICAgIC8vIHRoaXMgcGFydCBnZXRzIHRoZSByYXcgaW1hZ2UgZGF0YSBieSB1c2luZyBhbiBvZmYgc2NyZWVuIGNhbnZhc1xyXG4gICAgICAgIC8vIHJlc2l6ZXMgdGhlIGNhbnZhcyB0byBpbWFnZSBkaW1lbnNpb25zIHNvIHRoYXQgaW1hZ2UgaXNuJ3QgY2xpcHBlZFxyXG4gICAgICAgIC8vIHdoZW4gY2FsbGluZyBnZXRJbWFnZURhdGEoKVxyXG4gICAgICAgIHRoaXMub3V0cHV0X2ltYWdlLndpZHRoID0gb3JpZ2luYWxfaW1nLndpZHRoO1xyXG4gICAgICAgIHRoaXMub3V0cHV0X2ltYWdlLmhlaWdodCA9IG9yaWdpbmFsX2ltZy5oZWlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMub3JpZ2luYWxfaW1hZ2Uud2lkdGggPSBvcmlnaW5hbF9pbWcud2lkdGg7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbF9pbWFnZS5oZWlnaHQgPSBvcmlnaW5hbF9pbWcuaGVpZ2h0O1xyXG5cclxuICAgICAgICB0aGlzLm91dHB1dF9pbWFnZV9jdHguZHJhd0ltYWdlKG9yaWdpbmFsX2ltZywgMCwgMCk7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbF9pbWFnZV9jdHguZHJhd0ltYWdlKG9yaWdpbmFsX2ltZywgMCwgMCk7XHJcbiAgICAgICAgdGhpcy5wcmV2aWV3X2ltYWdlLm9mZnNldEhlaWdodFxyXG4gICAgICAgIGxldCBbcHJldmlld193aWR0aCwgcHJldmlld19oZWlnaHRdID0gXHJcbiAgICAgICAgICAgIHJlc2l6ZV9wcmV2aWV3X2ltYWdlKFxyXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxfaW1nLCBcclxuICAgICAgICAgICAgICAgIG1heF9kaW1lbnNpb25cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB0aGlzLnByZXZpZXdfaW1hZ2Uud2lkdGggPSBwcmV2aWV3X3dpZHRoO1xyXG4gICAgICAgIHRoaXMucHJldmlld19pbWFnZS5oZWlnaHQgPSBwcmV2aWV3X2hlaWdodDtcclxuICAgICAgICB0aGlzLm91dHB1dF9pbWFnZS53aWR0aCA9IHByZXZpZXdfd2lkdGg7XHJcbiAgICAgICAgdGhpcy5vdXRwdXRfaW1hZ2UuaGVpZ2h0ID0gcHJldmlld19oZWlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMucHJldmlld19pbWFnZV9jdHguZHJhd0ltYWdlKG9yaWdpbmFsX2ltZywgMCwgMCwgcHJldmlld193aWR0aCwgcHJldmlld19oZWlnaHQpO1xyXG4gICAgICAgIHRoaXMub3V0cHV0X2ltYWdlX2N0eC5kcmF3SW1hZ2Uob3JpZ2luYWxfaW1nLCAwLCAwLCBwcmV2aWV3X3dpZHRoLCBwcmV2aWV3X2hlaWdodCk7XHJcblxyXG4gICAgICAgIC8vIHRoaXMub3V0cHV0X2ltYWdlID0gb3V0cHV0X2ltZ19jdHguZ2V0SW1hZ2VEYXRhKFxyXG4gICAgICAgIC8vICAgICAwLCBcclxuICAgICAgICAvLyAgICAgMCwgXHJcbiAgICAgICAgLy8gICAgIG91dHB1dF9pbWcud2lkdGgsIFxyXG4gICAgICAgIC8vICAgICBvdXRwdXRfaW1nLmhlaWdodFxyXG4gICAgICAgIC8vICk7XHJcbiAgICAgICAgLy8gdGhpcy5vcmlnaW5hbF9pbWFnZSA9IGltZ19jdHguZ2V0SW1hZ2VEYXRhKFxyXG4gICAgICAgIC8vICAgICAwLCBcclxuICAgICAgICAvLyAgICAgMCwgXHJcbiAgICAgICAgLy8gICAgIGltZy53aWR0aCwgXHJcbiAgICAgICAgLy8gICAgIGltZy5oZWlnaHRcclxuICAgICAgICAvLyApO1xyXG5cclxuICAgICAgICAvLyBjb25zdCBbcmVzaXplZF9pbWdfd2lkdGgsIHJlc2l6ZWRfaW1nX2hlaWdodF0gPSBcclxuICAgICAgICAvLyAgICAgdGhpcy5zY2FsZV9pbWdfZGltZW5zaW9uc190b19jYW52YXMoaW1nLCBjYW52YXMpO1xyXG4gICAgICAgIC8vIC8vIHRoaXMgaW1hZ2Ugd2lsbCBiZSB0aGUgb25lIHRoYXQgZ2V0cyBwcm9jZXNzZWQgc28gdGhlcmUgaXNuJ3QgYSBuZWVkXHJcbiAgICAgICAgLy8gLy8gdG8gY29uc3RhbnRseSByZXNpemUgdGhlIG9yaWdpbmFsIGltYWdlIG9uIGV2ZXJ5IHByb2Nlc3NpbmcgZnVuY3Rpb25cclxuICAgICAgICAvLyBjb25zdCBvdXRwdXRfaW1hZ2VfcmVzaXplZF9yYXcgPSBuZXcgVWludDhDbGFtcGVkQXJyYXkoXHJcbiAgICAgICAgLy8gICAgIHJlc2l6ZV9pbWcoXHJcbiAgICAgICAgLy8gICAgICAgICB0aGlzLm91dHB1dF9pbWFnZS5kYXRhLCBcclxuICAgICAgICAvLyAgICAgICAgIHRoaXMub3V0cHV0X2ltYWdlLndpZHRoLCBcclxuICAgICAgICAvLyAgICAgICAgIHJlc2l6ZWRfaW1nX3dpZHRoLCBcclxuICAgICAgICAvLyAgICAgICAgIHJlc2l6ZWRfaW1nX2hlaWdodFxyXG4gICAgICAgIC8vICAgICApXHJcbiAgICAgICAgLy8gKTtcclxuICAgICAgICAvLyB0aGlzLm91dHB1dF9pbWFnZV9yZXNpemVkID0gbmV3IEltYWdlRGF0YShcclxuICAgICAgICAvLyAgICAgb3V0cHV0X2ltYWdlX3Jlc2l6ZWRfcmF3LCBcclxuICAgICAgICAvLyAgICAgcmVzaXplZF9pbWdfd2lkdGhcclxuICAgICAgICAvLyApO1xyXG4gICAgICAgIC8vIG1ha2UgdGhpcyBtb3JlIHBlcmZvcm1hbnRcclxuICAgICAgICAvLyBsZXQgbHVtYV9pbWdfZGF0YSA9IGNoYW5nZV90b19ncmF5c2NhbGUob3JpZ2luYWxfaW1nX2RhdGEpO1xyXG4gICAgICAgIC8vIGxldCBvdXRwdXRfbHVtYV9kYXRhID0gY2hhbmdlX3RvX2dyYXlzY2FsZShvdXRwdXRfaW1nX2RhdGEpO1xyXG5cclxuICAgICAgICAvLyBwdXRfaW1hZ2VfZGF0YV9jYW52YXMobHVtYV9pbWdfZGF0YSwgaW5wdXRfY3R4KTtcclxuXHJcbiAgICAgICAgLy8gb3JpZ2luYWxfaW1nX2RhdGEgPSBsdW1hX2ltZ19kYXRhO1xyXG4gICAgICAgIC8vIG91dHB1dF9pbWdfZGF0YSA9IG91dHB1dF9sdW1hX2RhdGE7XHJcbiAgICB9XHJcblxyXG4gICAgb3JpZ2luYWxfaW1nKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9yaWdpbmFsX2ltYWdlX2N0eC5nZXRJbWFnZURhdGEoXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luYWxfaW1hZ2Uud2lkdGgsXHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luYWxfaW1hZ2UuaGVpZ2h0LFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBvcmlnaW5hbF9pbWdfY2FudmFzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9yaWdpbmFsX2ltYWdlO1xyXG4gICAgfVxyXG5cclxuICAgIG91dHB1dF9pbWdfY2FudmFzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm91dHB1dF9pbWFnZTtcclxuICAgIH1cclxuICAgIG91dHB1dF9pbWcoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMub3V0cHV0X2ltYWdlX2N0eC5nZXRJbWFnZURhdGEoXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgIHRoaXMub3V0cHV0X2ltYWdlLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLm91dHB1dF9pbWFnZS5oZWlnaHQsXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBwcmV2aWV3X2ltZ19jYW52YXMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJldmlld19pbWFnZTtcclxuICAgIH1cclxuICAgIHByZXZpZXdfaW1nKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByZXZpZXdfaW1hZ2VfY3R4LmdldEltYWdlRGF0YShcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgMCwgXHJcbiAgICAgICAgICAgIHRoaXMucHJldmlld19pbWFnZS53aWR0aCxcclxuICAgICAgICAgICAgdGhpcy5wcmV2aWV3X2ltYWdlLmhlaWdodCxcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHNldF9vdXRwdXRfaW1hZ2UoaW1hZ2UpIHtcclxuICAgICAgICB0aGlzLm91dHB1dF9pbWFnZV9jdHgucHV0SW1hZ2VEYXRhKGltYWdlLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRfb3V0cHV0X2ltYWdlX3RvX29yaWdpbmFsKCkge1xyXG4gICAgICAgIHRoaXMuc2V0X291dHB1dF9pbWFnZSh0aGlzLm9yaWdpbmFsX2ltZygpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBzZXRfb3JpZ2luYWxfaW1hZ2UoaW1hZ2UpIHtcclxuICAgIC8vICAgICB0aGlzLm9yaWdpbmFsX2ltYWdlID0gaW1hZ2U7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gc2NhbGVfaW1nX2RpbWVuc2lvbnNfdG9fY2FudmFzKGltZywgY2FudmFzKSB7XHJcblxyXG4gICAgLy8gICAgIGxldCBzY2FsZSA9IDA7XHJcbiAgICAvLyAgICAgbGV0IG5ld19oZWlnaHQgPSBpbWcuaGVpZ2h0O1xyXG4gICAgLy8gICAgIGxldCBuZXdfd2lkdGggPSBpbWcud2lkdGg7XHJcblxyXG4gICAgLy8gICAgIGNvbnN0IHdpZHRoX3NjYWxlID0gY2FudmFzLm9mZnNldFdpZHRoIC8gaW1nLndpZHRoO1xyXG4gICAgLy8gICAgIGNvbnN0IGhlaWdodF9zY2FsZSA9IGNhbnZhcy5vZmZzZXRIZWlnaHQgLyBpbWcuaGVpZ2h0O1xyXG5cclxuICAgIC8vICAgICBpZiAod2lkdGhfc2NhbGUgPCBoZWlnaHRfc2NhbGUpIHtcclxuICAgIC8vICAgICAgICAgc2NhbGUgPSB3aWR0aF9zY2FsZTtcclxuICAgIC8vICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICBzY2FsZSA9IGhlaWdodF9zY2FsZTtcclxuICAgIC8vICAgICB9XHJcblxyXG4gICAgLy8gICAgIGlmIChjYW52YXMub2Zmc2V0V2lkdGggPCBpbWcud2lkdGggfHwgY2FudmFzLm9mZnNldEhlaWdodCA8IGltZy5oZWlnaHQpIHtcclxuICAgIC8vICAgICAgICAgbmV3X3dpZHRoID0gTWF0aC5yb3VuZChpbWcud2lkdGggKiBzY2FsZSk7XHJcbiAgICAvLyAgICAgICAgIG5ld19oZWlnaHQgPSBNYXRoLnJvdW5kKGltZy5oZWlnaHQgKiBzY2FsZSk7XHJcbiAgICAvLyAgICAgfVxyXG5cclxuICAgIC8vICAgICByZXR1cm4gW25ld193aWR0aCwgbmV3X2hlaWdodF07XHJcbiAgICAvLyB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlc2l6ZV9wcmV2aWV3X2ltYWdlKGltZywgbWF4X2xvbmdfZWRnZSkge1xyXG4gICAgbGV0IHNjYWxlID0gMDtcclxuICAgIGxldCBuZXdfaGVpZ2h0ID0gaW1nLmhlaWdodDtcclxuICAgIGxldCBuZXdfd2lkdGggPSBpbWcud2lkdGg7XHJcblxyXG4gICAgY29uc3Qgd2lkdGhfc2NhbGUgPSBtYXhfbG9uZ19lZGdlIC8gaW1nLndpZHRoO1xyXG4gICAgY29uc3QgaGVpZ2h0X3NjYWxlID0gbWF4X2xvbmdfZWRnZSAvIGltZy5oZWlnaHQ7XHJcblxyXG4gICAgaWYgKHdpZHRoX3NjYWxlIDwgaGVpZ2h0X3NjYWxlKSB7XHJcbiAgICAgICAgc2NhbGUgPSB3aWR0aF9zY2FsZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2NhbGUgPSBoZWlnaHRfc2NhbGU7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1heF9sb25nX2VkZ2UgPCBpbWcud2lkdGggfHwgbWF4X2xvbmdfZWRnZSA8IGltZy5oZWlnaHQpIHtcclxuICAgICAgICBuZXdfd2lkdGggPSBNYXRoLnJvdW5kKGltZy53aWR0aCAqIHNjYWxlKTtcclxuICAgICAgICBuZXdfaGVpZ2h0ID0gTWF0aC5yb3VuZChpbWcuaGVpZ2h0ICogc2NhbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBbbmV3X3dpZHRoLCBuZXdfaGVpZ2h0XTtcclxufSJdLCJzb3VyY2VSb290IjoiIn0=
import { DrawCanvases } from "./draw_canvases.js";
import { RawImage } from "./raw_image.js";

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

async function main() {
    let image_worker = new Worker("./js/dist/bundle_worker.js");
    image_worker.onmessage = event => {
        if (event.data.message === "wasm INITIALIZED") {
            console.log(`${event.data.message}`);
        }
        else if (event.data.message === "INVERTED") {
            console.log(`${event.data.message}`);
            let image = new ImageData(
                new Uint8ClampedArray(event.data.image), event.data.width
            );
            raw_images.set_output_image(
                image
            );
            draw_canvases.draw_image(raw_images.output_img_canvas());
        }
        else if (event.data.message === "BOX BLUR") {
            console.log(`${event.data.message}`);
            let image = new ImageData(
                new Uint8ClampedArray(event.data.image), event.data.width
            );
            raw_images.set_output_image(image);
            draw_canvases.draw_image(raw_images.output_img_canvas());
        }
        else if (event.data.message === "GAMMA") {
            console.log(`${event.data.message}`);
            let image = new ImageData(
                new Uint8ClampedArray(event.data.image), event.data.width
            );
            raw_images.set_output_image(image);
            draw_canvases.draw_image(raw_images.output_img_canvas());
        }
        else {
            console.log(`unrecognized message from web worker: ${event.data.message}`);
        }
    };


    const draw_canvases = new DrawCanvases(
        document.getElementById("input-canvas")
    );

    let raw_images = null;

    let original_img = new Image();

    // takes the image url and displays it on both canvas
    function import_and_display(image_url) {
        original_img.addEventListener('load', function () {
            draw_canvases.display_image(original_img);

            raw_images = new RawImage(
                original_img,
                draw_canvases.processed_image_canvas,
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
        // deselects any active option and hides any sliders
        // that were in effect if user is selecting a new image
        // this will need some more working if I decide to
        // make active_input and active_option null capable
        // variables
        active_option.classList.remove("select-option");
        active_input.style.display = "none";
        active_option = document.createElement("p");
        processing_options.style.display = "none";
        document.getElementById("input-canvas").style.backgroundColor = "white";
        // will have to make sure this displays the new image without 
        // any weird bugs 
        draw_canvases.display_only_processed_image();
    });

    // this button activates the file input event
    let upload_image = document.getElementById("upload-image");
    upload_image.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 768px) and (orientation: portrait)")) {
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
    let active_option = document.createElement("p"); // creates dummy element so it wouldn't be null

    let gamma_value_elem = document.getElementById("gamma-value");
    let box_blur_value_elem = document.getElementById("box-blur-value");
    let processing_options = document.getElementById("processing-options");

    // maybe make this null
    // also maybe make this null
    let active_input = document.createElement("p"); // creates dummy element so it wouldn't be null

    let invert_info = document.getElementById("invert-info");
    let box_blur_info = document.getElementById("box-blur-info");
    let gamma_info = document.getElementById("gamma-info");
    let active_info = document.createElement("p");

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
                invert_option.classList.remove("select-option");
                active_input.style.display = "none";
                active_option = document.createElement("p");

                active_info.style.display = "none";

                toggle_algorithms_sidebar();

                raw_images.set_output_image_to_original();
                draw_canvases.draw_image(raw_images.original_img_canvas());
            } else {
                // makes active input a dummy element
                active_info.style.display = "none";
                active_info = invert_info;
                active_info.style.display = "";

                active_input.style.display = "none";
                active_input = document.createElement("p");

                invert_option.classList.add("select-option");
                active_option = invert_option;

                toggle_algorithms_sidebar();

                // modifies the original image separately in case there needs
                // to be resizing done. This way I don't have to re modify
                // the original image and resize
                // eventually this operation will occur in a web worker so it doesn't
                // block the ui
                image_worker.postMessage(
                    {
                        message: "INVERT",
                        image: raw_images.preview_img().data.buffer,
                        width: raw_images.preview_img().width,
                    },
                    [raw_images.original_img().data.buffer]
                );

            }

        }
        if (event.target.matches("#blur-options")) {
            if (raw_images === null) {
                alert("Upload an image to use these algorithms");
                return;
            }

            if (active_option === blur_option) {
                blur_option.classList.remove("select-option");
                active_option = document.createElement("p");
                active_input.style.display = "none";

                active_info.style.display = "none";

                processing_options.style.display = "none";

                toggle_algorithms_sidebar();

                raw_images.set_output_image_to_original();
                draw_canvases.draw_image(raw_images.original_img_canvas());
            } else {
                blur_option.classList.add("select-option");
                active_option = blur_option;

                active_info.style.display = "none";
                active_info = box_blur_info;
                active_info.style.display = "";

                active_input.style.display = "none";
                // displays the slider for box blur
                box_blur_slider_wrapper.style.display = "";
                active_input = box_blur_slider_wrapper;

                processing_options.style.display = "";

                toggle_algorithms_sidebar();

                // puts the box blur slider at 1 because the default is in the middle
                // this way the user doesn't get an image blurred at 500 when they
                // click on box blur
                // box_blur_slider = document.getElementById("box-blur-slider");
                box_blur_slider.value = 1;
                box_blur_value_elem.value = box_blur_slider.value;

                let kernel_size = box_blur_slider.valueAsNumber;

                // modifies the original image separately in case there needs
                // to be resizing done. This way I don't have to re modify
                // the original image and resize
                // eventually this operation will occur in a web worker so it doesn't
                // block the ui
                image_worker.postMessage(
                    {
                        message: "BOX BLUR",
                        image: raw_images.preview_img().data.buffer,
                        width: raw_images.preview_img().width,
                        kernel_size: kernel_size,
                    },
                    [raw_images.original_img().data.buffer]
                );
            }
        }
        if (event.target.matches("#gamma-option")) {
            if (raw_images === null) {
                alert("Upload an image to use these algorithms");
                return;
            }
            if (active_option === gamma_option) {
                gamma_option.classList.remove("select-option");
                active_option = document.createElement("p");
                active_input.style.display = "none";

                active_info.style.display = "none";

                processing_options.style.display = "none";

                toggle_algorithms_sidebar();

                raw_images.set_output_image_to_original();
                draw_canvases.draw_image(raw_images.original_img_canvas());
            } else {
                gamma_option.classList.add("select-option");
                active_option = gamma_option;

                active_info.style.display = "none";
                active_info = gamma_info;
                active_info.style.display = "";

                active_input.style.display = "none";
                // displays the slider for gamma transformation 
                gamma_slider_wrapper.style.display = "";
                active_input = gamma_slider_wrapper;

                processing_options.style.display = "";

                toggle_algorithms_sidebar();

                // puts the gamma slider at 1 because this keeps the image unchanged 
                gamma_slider.value = 1;
                gamma_value_elem.value = 1;

                let gamma = gamma_slider.valueAsNumber;

                image_worker.postMessage(
                    {
                        message: "GAMMA",
                        image: raw_images.preview_img().data.buffer,
                        width: raw_images.preview_img().width,
                        gamma: gamma,
                    },
                    [raw_images.original_img().data.buffer]
                );
            }

        }

    }), 33);

    let gamma_slider_wrapper = document.getElementById("gamma-slider-wrapper");
    let gamma_slider = document.getElementById("gamma-slider");
    let gamma_slider_func = (event) => {
        let gamma = event.target.valueAsNumber;
        gamma_value_elem.value = gamma;

        // does a gamma transformation on full size image preview 
        image_worker.postMessage(
            {
                message: "GAMMA",
                image: raw_images.preview_img().data.buffer,
                width: raw_images.preview_img().width,
                gamma: gamma,
            },
            [raw_images.original_img().data.buffer]
        );

    }
    gamma_slider.addEventListener("input", debounce(gamma_slider_func, 51));

    let box_blur_slider_wrapper = document.getElementById("box-blur-slider-wrapper");
    let box_blur_slider = document.getElementById("box-blur-slider");
    let box_slider_func = (event) => {
        // function slider_func(event) {
        let kernel_size = event.target.valueAsNumber;
        box_blur_value_elem.value = kernel_size;

        // box blurs full size image preview 
        image_worker.postMessage(
            {
                message: "BOX BLUR",
                image: raw_images.preview_img().data.buffer,
                width: raw_images.preview_img().width,
                kernel_size: kernel_size,
            },
            [raw_images.original_img().data.buffer]
        );

    }
    box_blur_slider.addEventListener("input", debounce(box_slider_func, 51));
    // box_blur_slider.addEventListener("input", throttle(slider_func, 100));
    // box_blur_slider.addEventListener("input", slider_func);
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
        if (window.matchMedia("(max-width: 768px) and (orientation: portrait)")) {
            if (sidebar.classList.contains("mobile-hidden")) {
                sidebar.classList.remove("mobile-hidden");        
                sidebar.classList.add("mobile-visible");        
                algorithms_arrow.classList.toggle("fa-angle-right");
                algorithms_arrow.classList.toggle("fa-angle-down");
            } else if (sidebar.classList.contains("mobile-visible")) {
                sidebar.classList.remove("mobile-visible");
                sidebar.classList.add("mobile-hidden");
                algorithms_arrow.classList.toggle("fa-angle-down");
                algorithms_arrow.classList.toggle("fa-angle-right");
            } else {
                console.log("sidebar should have either class");
            }
        }
        

    }
}

main();

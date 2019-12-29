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
    function sobel_edge_detector(event) {
        let threshold = event.target.valueAsNumber;
        sobel_threshold.value = threshold;
        image_worker.postMessage(
            {
                message: "SOBEL",
                width: raw_images.preview_img().width,
                threshold: threshold,
            },
        );
    }
    sobel_slider.addEventListener("input", debounce(sobel_edge_detector, 100)); 

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

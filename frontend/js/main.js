import { invert, resize_img, box_blur, default as init } from "../wasm/proc.js";
import { DrawCanvases } from "./draw_canvases.js";
import { RawImage } from "./raw_image.js";

async function main() {
    // web assembly initialization
    // const imageproc = await import('../../image_processing/pkg');
    await init();

    const draw_canvases = new DrawCanvases(
        document.getElementById("input-canvas"), 
        document.getElementById("output-canvas")
    );

    let raw_images = null;
    const two_canvases = document.getElementById("two-canvases");

    // create canvas for both original and output image in order to get
    // underlying pixel data
    // let raw_output_ctx = raw_output_canvas.getContext("2d");
    // let raw_img_ctx = raw_img_canvas.getContext("2d");

    let original_img = new Image();

    // function change_to_grayscale(img_data) {
    //     // let input_data = output_img_data;
    //     let width = img_data.width;
    //     let raw_data = new Uint8ClampedArray(
    //         to_grayscale(img_data.data, width),
    //     );
    //     // output_img_data = new ImageData(raw_data, width); 
    //     return new ImageData(raw_data, width); 
    //     // put_image_data_canvas(output_img_data, output_ctx);

    // }

    // let convert_button = document.getElementById("convert");
    // convert_button.addEventListener("click", () => {
    //     let input_data = output_img_data;
    //     let output_width = input_data.width;
    //     let raw_data = new Uint8ClampedArray(
    //         draw_luma_histogram(input_data.data, output_width),
    //     );
    //     output_img_data = new ImageData(raw_data, output_width); 
    //     output_canvas.classList.add("active-canvases");
    //     input_canvas.classList.add("active-canvases");
    //     input_canvas.classList.remove("one-active-canvas");
    //     output_canvas.style.display = "block";
    //     resize_canvases(input_canvas, output_canvas);

    //     // let input_data = output_img_data;
    //     // let output_width = input_data.width;
    //     // let raw_data = new Uint8ClampedArray(
    //     //     invert(input_data.data, output_width)
    //     // );
    //     // output_img_data = new ImageData(raw_data, output_width); 
    //     put_image_data_canvas(original_img_data, input_ctx);
    //     put_image_data_canvas(output_img_data, output_ctx);
    // });

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
        // will have to make sure this displays the new image without 
        // any weird bugs 
        draw_canvases.display_only_processed_image();
    });

    // this button activates the file input event
    let upload_image = document.getElementById("upload-image");
    upload_image.addEventListener("click", () => {
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
    // just make this null
    let active_option = document.createElement("p"); // creates dummy element so it wouldn't be null
    // also this will be null
    let active_input= document.createElement("p"); // creates dummy element so it wouldn't be null

    let options = document.getElementById("options");
    // these events should check if they are the active event and if clicked again
    // they should deactivate and present the original image
    options.addEventListener("click", (event) => {
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
                draw_canvases.draw_image(raw_images.original_img_canvas());
            } else {
                // makes active input a dummy element
                active_input.style.display = "none";
                active_input = document.createElement("p");

                invert_option.classList.add("select-option");
                active_option = invert_option; 

                // modifies the original image separately in case there needs
                // to be resizing done. This way I don't have to re modify
                // the original image and resize
                // eventually this operation will occur in a web worker so it doesn't
                // block the ui
                let original_image_width = raw_images.original_img().width;

                let inverted_raw_data = new Uint8ClampedArray(
                    invert(raw_images.original_img().data, original_image_width)
                );

                raw_images.set_output_image(
                    new ImageData(inverted_raw_data, original_image_width)
                ); 
                draw_canvases.draw_image(raw_images.output_img_canvas());

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
                draw_canvases.draw_image(raw_images.original_img_canvas());
            } else {
                blur_option.classList.add("select-option");
                active_option = blur_option;

                active_input.style.display = "none";
                // displays the slider for box blur
                box_blur_slider_wrapper.style.display = "";
                active_input = box_blur_slider_wrapper;

                // puts the box blur slider at 1 because the default is in the middle
                // this way the user doesn't get an image blurred at 500 when they
                // click on box blur
                // box_blur_slider = document.getElementById("box-blur-slider");
                box_blur_slider.value = 1;

                let kernel_size = box_blur_slider.valueAsNumber;

                // modifies the original image separately in case there needs
                // to be resizing done. This way I don't have to re modify
                // the original image and resize
                // eventually this operation will occur in a web worker so it doesn't
                // block the ui
                let original_image_width = raw_images.original_img().width;

                let box_blur_raw_data = new Uint8ClampedArray(
                    box_blur(
                        raw_images.original_img().data, 
                        original_image_width, 
                        kernel_size
                    )
                );

                raw_images.set_output_image(
                    new ImageData(box_blur_raw_data, original_image_width)
                ); 

                draw_canvases.draw_image(raw_images.output_img_canvas());
            }
        }
    });

    let box_blur_slider_wrapper = document.getElementById("box-blur-slider-wrapper");
    let box_blur_slider = document.getElementById("box-blur-slider");
    box_blur_slider.addEventListener("input", (event) => {
        let kernel_size = event.target.valueAsNumber;

        // box blurs full size image preview 
        let original_image_width = raw_images.original_img().width;

        let original_raw_data = new Uint8ClampedArray(
            box_blur(
                raw_images.original_img().data, 
                original_image_width, 
                kernel_size
            )
        );

        raw_images.set_output_image(new ImageData(original_raw_data, original_image_width)); 
        draw_canvases.draw_image(raw_images.output_img_canvas());
        
    });
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
}

main();

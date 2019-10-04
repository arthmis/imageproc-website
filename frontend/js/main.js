// import { invert, resize_img, to_grayscale, draw_luma_histogram, default as init } from "../wasm/proc.js";
import { invert, resize_img, default as init } from "../wasm/proc.js";
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
    let invert_button = document.getElementById("invert");
    invert_button.addEventListener("click", function() {
        let input_data = raw_images.output_img();
        let output_width = input_data.width;
        let raw_data = new Uint8ClampedArray(
            invert(input_data.data, output_width),
        );
        raw_images.set_output_image(new ImageData(raw_data, output_width)); 
        // draw_canvases.put_images(raw_images.original_img(), raw_images.output_img());
        draw_canvases.put_image(raw_images.output_img_resized());
    });

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

    // takes the offscreen canvas images and uses those to resize
    // the image and put on the two onscreen canvas
    window.addEventListener('resize', () => {
        if (raw_images !== null) {
            // uses original image to resize to the new output canvas 
            // dimensions
            const [resized_img_width, resized_img_height] = 
                scale_img_dimensions_to_canvas(
                    raw_images.output_img(), 
                draw_canvases.processed_image_canvas
            );
            let new_img = new Uint8ClampedArray(
                resize_img(
                    raw_images.output_img().data,
                    raw_images.output_img().width,
                    resized_img_width,
                    resized_img_height,
                )
            );
            raw_images.set_output_image_resized(
                new ImageData(new_img, resized_img_width)
            );
            draw_canvases.put_image(
                raw_images.output_img_resized()
            );
        }
    });

    let invert_option = document.getElementById("invert-option");
    let histogram_option = document.getElementById("histogram-option");
    let edge_detection_option = document.getElementById("edge-detection-options");
    let blur_option = document.getElementById("blur-options"); 
    let hough_option = document.getElementById("hough-option");
    let corners_option = document.getElementById("corners-option");
    let kernels_option = document.getElementById("kernels-option");
    let active_option = null;

    let options = document.getElementById("options");
    options.addEventListener("click", (event) => {
        if (active_option !== null) {
            active_option.classList.remove("select-option");
        }

        if (event.target.matches("#invert-option")) {
            // if (raw_images === null) {
            //     alert("Upload an image to use these algorithms");
            //     return;
            // }
            invert_option.classList.add("select-option");
            active_option = invert_option;


            let image_width = raw_images.output_img_resized().width;

            let raw_data = new Uint8ClampedArray(
                invert(raw_images.output_img_resized().data, image_width)
            );

            raw_images.set_output_image_resized(new ImageData(raw_data, image_width)); 

            draw_canvases.put_image(raw_images.output_img_resized());

            // modifies the original image separately in case there needs
            // to be resizing done. This way I don't have to re modify
            // the original image and resize
            // eventually this operation will occur in a web worker so it doesn't
            // block the ui
            let original_image_width = raw_images.output_img().width;

            let original_raw_data = new Uint8ClampedArray(
                invert(raw_images.original_img().data, original_image_width)
            );

            raw_images.set_output_image(new ImageData(original_raw_data, original_image_width)); 

        }
        if (event.target.matches("#histogram-option")) {
            histogram_option.classList.add("select-option");
            active_option = histogram_option;
        }
        if (event.target.matches("#edge-detection-options")) {
            edge_detection_option.classList.add("select-option");
            active_option = edge_detection_option;
        }
        if (event.target.matches("#blur-options")) {
            blur_option.classList.add("select-option");
            active_option = blur_option;
        }
        if (event.target.matches("#hough-option")) {
            hough_option.classList.add("select-option");
            active_option = hough_option;
        }
        if (event.target.matches("#corners-option")) {
            corners_option.classList.add("select-option");
            active_option = corners_option;
        }
        if (event.target.matches("#kernels-option")) {
            kernels_option.classList.add("select-option");
            active_option = kernels_option;
        }
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

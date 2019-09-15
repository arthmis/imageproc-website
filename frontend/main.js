import { invert, resize_img, default as init } from "../wasm/image_processing.js";
async function run() {
    // web assembly initialization
    // const imageproc = await import('../../image_processing/pkg');
    await init();

    const input_canvas = document.getElementById("input-canvas");
    const output_canvas = document.getElementById("output-canvas")

    const input_ctx = input_canvas.getContext("2d");
    const output_ctx = output_canvas.getContext("2d");
    // if (ctx === null) {
    //     alert("Unable to initialize canvas context. Your browser or machine may not support it");
    //     return;
    // }
    
    const two_canvases = document.getElementById("two-canvases");

    // create canvas for both original and output image in order to get
    // underlying pixel data
    let raw_output_canvas = document.createElement('canvas');
    let raw_img_canvas = document.createElement('canvas');
    let raw_output_ctx = raw_output_canvas.getContext("2d");
    let raw_img_ctx = raw_img_canvas.getContext("2d");

    // let input_image = document.getElementById("input-image");
    // input_image.addEventListener("click", function(event) {
    //     document.getElementById("file-input").click();
    // });
    let original_img = new Image();
    let output_img = new Image();
    let output_img_data = new ImageData(1, 1);
    let original_img_data = new ImageData(1, 1);
    // let canvas_img = new Image();
    // let resized_img_width = 0;
    // let resized_img_height = 0;
    let center_x = 0;
    let center_y = 0;

    function display_image(canvas, img) {
        let ctx = canvas.getContext("2d");
        let resized_img_width = 0;
        let resized_img_height = 0;
        // this sequence scales the image up or down to fit into canvas element
        // consider scaling to a percentage of the canvas
        let scale = 1; 
        // temporary solution to image scaling incorrectly, have to analyze this more
        if (canvas.offsetHeight > img.height && canvas.offsetWidth > img.width) {
            resized_img_height = img.height;
            resized_img_width = img.width;
        } else {

            let width_scale = canvas.offsetHeight / img.height;
            let height_scale = canvas.offsetWidth / img.width ;
            if (width_scale < height_scale) {
                scale = width_scale;
            } else {
                scale = height_scale;
            }

            resized_img_width = img.width * scale; 
            resized_img_height = img.height * scale; 

            resized_img_height = Math.round(resized_img_height);
            resized_img_width = Math.round(resized_img_width);
        }

        // resize the canvas to fit into canvas element size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // these two variables center the image within the canvas
        center_x = (canvas.width - resized_img_width) / 2;
        center_y = (canvas.height - resized_img_height) / 2;

        ctx.drawImage(
            img, 
            center_x, 
            center_y, 
            resized_img_width, 
            resized_img_height, 
        );
        
    }
    function scale_img_dimensions_to_canvas(img, canvas) {

        let scale = 0; 
        let new_height = 0;
        let new_width = 0;

        if (img.width > img.height) {
            scale = canvas.offsetWidth / img.width ;
        } else {
            scale = canvas.offsetHeight / img.height;
        }

        if (canvas.offsetWidth < img.width) {
            new_width = img.width * scale; 
        }
        if (input_canvas.offsetHeight < img.height) {
            new_height = img.height * scale; 
        }

        new_height = Math.round(new_height);
        new_width = Math.round(new_width);
        return [new_width, new_height]
    }
    function put_image_data(img_data, ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // get new image dimensions to fit on canvas
        const [resized_img_width, resized_img_height] = 
            scale_img_dimensions_to_canvas(img_data, ctx.canvas);

        let resized_img = new Uint8ClampedArray(
            resize_img(
                img_data.data, 
                img_data.width, 
                resized_img_width, 
                resized_img_height
            )
        );

        // find new origin to center image
        let center_x = (ctx.canvas.width - resized_img_width) / 2;
        let center_y = (ctx.canvas.height - resized_img_height) / 2;

        const output_data = new ImageData(resized_img, resized_img_width);

        ctx.putImageData(
            output_data, 
            center_x, 
            center_y, 
            0,
            0,
            resized_img_width, 
            resized_img_height, 
        );
    }
    let invert_button = document.getElementById("invert");
    invert_button.addEventListener("click", function() {
        // let output_data = raw_output_ctx.getImageData(
        //     0, 0, original_img.width, original_img.height
        // );
        let input_data = output_img_data;
        let output_width = input_data.width;
        let raw_data = new Uint8ClampedArray(
            invert(input_data.data, output_width),
        );
        output_img_data = new ImageData(raw_data, output_width); 
        put_image_data(output_img_data, output_ctx);
    });
    // extracted this because its used in the on drop and file dialog click events
    function import_and_display(image_url) {
        original_img.addEventListener('load', function () {
            output_img = original_img;

            // console.log(original_img);
            // console.log("original width", original_img.width);
            // console.log("original height", original_img.height);


            // TODO possibly rename this because the image isn't literally scaled
            // but the new scaled height and width are returned
            const [resized_img_width, resized_img_height] = 
                scale_img_dimensions_to_canvas(original_img, input_canvas);

            // resize the canvas to fit into canvas element size
            // console.log("canvas offset width", input_canvas.offsetWidth);
            // console.log("canvas offset height", input_canvas.offsetHeight);
            input_canvas.width = input_canvas.offsetWidth;
            input_canvas.height = input_canvas.offsetHeight;
            output_canvas.width = input_canvas.width;
            output_canvas.height = input_canvas.height;

            // these two variables center the image within the canvas
            center_x = (input_canvas.width - resized_img_width) / 2;
            center_y = (input_canvas.height - resized_img_height) / 2;
            // console.log("canvas width", input_canvas.width);
            // console.log("canvas height", input_canvas.height);
            // console.log("resized width", resized_img_width);
            // console.log("resized height", resized_img_height);


            display_image(input_canvas, original_img);
            display_image(output_canvas, output_img);


            // resizes the canvas to image dimensions so that image isn't clipped
            // when calling getImageData()
            raw_output_canvas.width = original_img.width;
            raw_output_canvas.height = original_img.height;
            raw_img_canvas.width = original_img.width;
            raw_img_canvas.height = original_img.height;
            raw_output_ctx.drawImage(output_img, 0, 0);
            raw_img_ctx.drawImage(original_img, 0, 0);

            output_img_data = raw_output_ctx.getImageData(
                0, 
                0, 
                raw_output_canvas.width, 
                raw_output_canvas.height
            );
            original_img_data = raw_img_ctx.getImageData(
                0, 
                0, 
                raw_img_canvas.width, 
                raw_img_canvas.height
            );


        });

        original_img.src = window.URL.createObjectURL(image_url);

    }
    let file_input = document.getElementById("file-input");
    file_input.addEventListener("change", (event) => {
        let image = file_input.files[0];
        import_and_display(image);
        file_input.value = null;
    });

    window.addEventListener('resize', () => {
        // the two canvases must be resized otherwise
        // the image will stretch if the window is resized larger
        input_canvas.width = input_canvas.offsetWidth;
        input_canvas.height = input_canvas.offsetHeight;
        output_canvas.width = input_canvas.width;
        output_canvas.height = input_canvas.height;

        put_image_data(original_img_data, input_ctx);
        put_image_data(output_img_data, output_ctx);
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
            invert_option.classList.add("select-option");
            active_option = invert_option;
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
}

run();

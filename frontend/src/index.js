async function run() {
    // First up we need to actually load the wasm file, so we use the
    // default export to inform it where the wasm file is located on the
    // server, and then we wait on the returned promise to wait for the
    // wasm to be loaded.
    // await init('./edit-algorithms/pkg/edit_algorithms_bg.wasm');
    // web assembly initialization
    const imageproc = await import('../../image_processing/pkg');

    let input_canvas = document.getElementById("input-canvas");
    let output_canvas = document.getElementById("output-canvas")

    let input_ctx = input_canvas.getContext("2d");
    let output_ctx = output_canvas.getContext("2d");
    // if (ctx === null) {
    //     alert("Unable to initialize canvas context. Your browser or machine may not support it");
    //     return;
    // }
    // my_worker.onmessage = function(event) {
    //     new_image = event.data;
    //     console.log("received modified image from worker");
    // }
    
    const two_canvases = document.getElementById("two-canvases");

    // let input_image = document.getElementById("input-image");
    // input_image.addEventListener("click", function(event) {
    //     document.getElementById("file-input").click();
    // });
    let original_img = new Image();
    let output_img = new Image();
    let output_img_data = new ImageData(1, 1);
    let original_img_data = new ImageData(1, 1);
    // let canvas_img = new Image();
    let resized_img_width = 0;
    let resized_img_height = 0;
    let center_x = 0;
    let center_y = 0;

    // extracted this because its used in the on drop and file dialog click events
    function import_and_display(image_url) {
        original_img.addEventListener('load', function () {
            output_img = original_img;

            // console.log(original_img);
            console.log("original width", original_img.width);
            console.log("original height", original_img.height);

            // this sequence scales the image up or down to fit into canvas element
            // consider scaling to a percentage of the canvas
            let scale = 1; 
            if (original_img.width > original_img.height) {
                scale = input_canvas.offsetWidth / original_img.width ;
            } else {
                scale = input_canvas.offsetHeight / original_img.height;
            }

            if (input_canvas.offsetWidth < original_img.width) {
                resized_img_width = original_img.width * scale; 
            } else {
                resized_img_width = original_img.width * scale;
            }

            if (input_canvas.offsetHeight < original_img.height) {
                resized_img_height = original_img.height * scale; 
            } else {
                resized_img_height = original_img.height * scale;
            }

            resized_img_height = Math.round(resized_img_height);
            resized_img_width = Math.round(resized_img_width);

            // resize the canvas to fit into canvas element size
            console.log("canvas offset width", input_canvas.offsetWidth);
            console.log("canvas offset height", input_canvas.offsetHeight);
            input_canvas.width = input_canvas.offsetWidth;
            input_canvas.height = input_canvas.offsetHeight;
            output_canvas.width = input_canvas.width;
            output_canvas.height = input_canvas.height;

            // these two variables center the image within the canvas
            center_x = (input_canvas.width - resized_img_width) / 2;
            center_y = (input_canvas.height - resized_img_height) / 2;
            console.log("canvas width", input_canvas.width);
            console.log("canvas height", input_canvas.height);
            console.log("resized width", resized_img_width);
            console.log("resized height", resized_img_height);


            // create canvas for both original and output image in order to get
            // underlying pixel data
            let output_img_canvas = document.createElement('canvas');
            let original_img_canvas = document.createElement('canvas');
            let output_img_ctx = output_img_canvas.getContext("2d");
            let original_img_ctx = original_img_canvas.getContext("2d");

            // resizes the canvas to image dimensions so that image isn't clipped
            // when calling getImageData()
            output_img_canvas.width = original_img.width;
            output_img_canvas.height = original_img.height;
            original_img_canvas.width = original_img.width;
            original_img_canvas.height = original_img.height;
            output_img_ctx.drawImage(output_img, 0, 0);
            original_img_ctx.drawImage(original_img, 0, 0);

            output_img_data = output_img_ctx.getImageData(
                0, 
                0, 
                output_img.width, 
                output_img.height
            );
            original_img_data = original_img_ctx.getImageData(
                0, 
                0, 
                original_img.width, 
                original_img.height
            );

            let invert_button = document.getElementById("invert");
            invert_button.addEventListener("click", function() {
                output_data = output_ctx.getImageData(
                center_x, 
                center_y, 
                resized_img_width, 
                resized_img_height, 
            );
                let inverted_raw_data = new Uint8ClampedArray(
                    imageproc.invert(output_data.data, output_data.width),
                );
                let inverted_data = new ImageData(inverted_raw_data, output_data.width);
                output_ctx.putImageData(
                    inverted_data, 
                center_x, 
                center_y, 
                    0,
                    0,
                resized_img_width, 
                resized_img_height, 
            );
            });

        });

        original_img.src = window.URL.createObjectURL(image_url);

    }
    let file_input = document.getElementById("file-input");
    file_input.addEventListener("change", function () {
        let image = this.files[0];
        import_and_display(image);

    }, false);
}

run();

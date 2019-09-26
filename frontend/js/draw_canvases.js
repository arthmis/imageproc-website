import { resize_img} from "../wasm/proc.js";
export class DrawCanvases {
    constructor(input_canvas, output_canvas) {
        this.input_canvas = input_canvas;
        this.output_canvas = output_canvas;
        this.input_ctx = input_canvas.getContext("2d");
        this.output_ctx = output_canvas.getContext("2d");
    }

    display_image(html_img) {
        // let ctx = canvas.getContext("2d");
        // this sequence scales the image up or down to fit into canvas element
        // consider scaling to a percentage of the canvas
        const [resized_img_width, resized_img_height] = 
            this.scale_img_dimensions_to_canvas(html_img, this.input_canvas);

        // resize the canvas to fit into canvas element size
        this.input_canvas.width = this.input_canvas.offsetWidth;
        this.input_canvas.height = this.input_canvas.offsetHeight;

        // these two variables center the image within the canvas
        const center_x = (this.input_canvas.width - resized_img_width) / 2;
        const center_y = (this.input_canvas.height - resized_img_height) / 2;

        this.input_ctx.drawImage(
            html_img, 
            center_x, 
            center_y, 
            resized_img_width, 
            resized_img_height, 
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

    put_images(img, output_img) {
        // resize canvases to fit their new offset width and height
        this.resize_canvases();
        // get new image dimensions to fit on canvas
        // use input canvas because output canvas by not be visible
        // therefore it would have no width or height
        const [resized_img_width, resized_img_height] = 
            this.scale_img_dimensions_to_canvas(img, this.input_canvas);

        let resized_img = new Uint8ClampedArray(
            resize_img(
                img.data, 
                img.width, 
                resized_img_width, 
                resized_img_height
            )
        );
        let resized_output_img = new Uint8ClampedArray(
            resize_img(
                output_img.data, 
                output_img.width, 
                resized_img_width, 
                resized_img_height
            )
        );

        // find new origin to center image on canvas
        let center_x = (this.input_ctx.canvas.width - resized_img_width) / 2;
        let center_y = (this.input_ctx.canvas.height - resized_img_height) / 2;

        let original_data = new ImageData(resized_img, resized_img_width);

        this.input_ctx.putImageData(
            original_data,
            center_x, 
            center_y, 
            0,
            0,
            resized_img_width, 
            resized_img_height, 
        );

        let output_data = new ImageData(resized_output_img, resized_img_width);
        this.output_ctx.putImageData(
            output_data, 
            center_x, 
            center_y, 
            0,
            0,
            resized_img_width, 
            resized_img_height, 
        );
    }

    put_image(img) {
        // resize canvases to fit their new offset width and height
        this.resize_canvases();
        // get new image dimensions to fit on canvas
        // use input canvas because output canvas by not be visible
        // therefore it would have no width or height
        const [resized_img_width, resized_img_height] = 
            this.scale_img_dimensions_to_canvas(img, this.input_canvas);

        let resized_img = new Uint8ClampedArray(
            resize_img(
                img.data, 
                img.width, 
                resized_img_width, 
                resized_img_height
            )
        );

        // find new origin to center image on canvas
        let center_x = (this.input_ctx.canvas.width - resized_img_width) / 2;
        let center_y = (this.input_ctx.canvas.height - resized_img_height) / 2;

        let original_data = new ImageData(resized_img, resized_img_width);

        this.input_ctx.putImageData(
            original_data,
            center_x, 
            center_y, 
            0,
            0,
            resized_img_width, 
            resized_img_height, 
        );
    }

    resize_canvases() {
        this.input_canvas.width = this.input_canvas.offsetWidth;
        this.input_canvas.height = this.input_canvas.offsetHeight;
        this.output_canvas.width = this.input_canvas.width;
        this.output_canvas.height = this.input_canvas.height;
    }

    display_only_input_canvas() {
        this.output_canvas.classList.remove("active-canvases");
        this.input_canvas.classList.remove("active-canvases");
        this.input_canvas.classList.add("one-active-canvas");
        this.output_canvas.style.display = "none";
    }

    display_output_canvas() {
        this.output_canvas.classList.add("active-canvases");
        this.input_canvas.classList.add("active-canvases");
        this.input_canvas.classList.remove("one-active-canvas");
        this.output_canvas.style.display = "block";
    }
}
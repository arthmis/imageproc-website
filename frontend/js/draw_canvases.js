// import { resize_img } from "../wasm/proc.js";
export class DrawCanvases {
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
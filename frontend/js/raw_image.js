import { resize_img} from "../wasm/proc.js";

export class RawImage {
    constructor(original_img, canvas) {
        this.output_image = document.createElement('canvas');
        this.original_image = document.createElement('canvas');
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

    set_output_image(image) {
        this.output_image_ctx.putImageData(image, 0, 0);
    }

    set_output_image_to_original() {
        this.set_output_image(this.original_img());
    }

    // set_original_image(image) {
    //     this.original_image = image;
    // }

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
}
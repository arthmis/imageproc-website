export class RawImage {
    constructor(original_img) {
        let output_img = document.createElement('canvas');
        let img = document.createElement('canvas');
        let output_img_ctx = output_img.getContext("2d");
        let img_ctx = img.getContext("2d");
        // this part gets the raw image data by using an off screen canvas
        // resizes the canvas to image dimensions so that image isn't clipped
        // when calling getImageData()
        output_img.width = original_img.width;
        output_img.height = original_img.height;
        img.width = original_img.width;
        img.height = original_img.height;
        output_img_ctx.drawImage(original_img, 0, 0);
        img_ctx.drawImage(original_img, 0, 0);

        this.output_image = output_img_ctx.getImageData(
            0, 
            0, 
            output_img.width, 
            output_img.height
        );
        this.original_image = img_ctx.getImageData(
            0, 
            0, 
            img.width, 
            img.height
        );
        // make this more performant
        // let luma_img_data = change_to_grayscale(original_img_data);
        // let output_luma_data = change_to_grayscale(output_img_data);

        // put_image_data_canvas(luma_img_data, input_ctx);

        // original_img_data = luma_img_data;
        // output_img_data = output_luma_data;
    }

    original_img() {
        return this.original_image;
    }
    output_img() {
        return this.output_image;
    }

    set_output_image(image) {
        this.output_image = image;
    }
    set_original_image(image) {
        this.original_image = image;
    }
}
import { invert, box_blur } from "../wasm/proc.js";

export function invert_image(img) {
    let width = img.width;
    let inverted_raw_data = new Uint8ClampedArray(
        invert(img.data, width)
    );
    return new ImageData(inverted_raw_data, width);
}

export function box_blur_image(img, kernel_size) {

    let box_blur_raw_data = new Uint8ClampedArray(
        box_blur(
            img.data,
            img.width,
            kernel_size
        )
    );

    return new ImageData(box_blur_raw_data, img.width)
}
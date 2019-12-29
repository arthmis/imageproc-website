self.importScripts('../../wasm/proc.js');

const {invert, box_blur, gamma_transform, sobel_edge_detection} = wasm_bindgen;

// let user_image = new Uint8ClampedArray(0);
let user_image = null;

async function initialize() {
    await wasm_bindgen('../../wasm/proc_bg.wasm');
    
    self.postMessage({
        message: "wasm INITIALIZED",
    });

    function invert_image(img, width) {
        let inverted_raw_data = new Uint8ClampedArray(
            invert(img, width)
        );

        return inverted_raw_data;
    }

    function box_blur_image(img, width, kernel_size) {

        let box_blur_raw_data = new Uint8ClampedArray(
            box_blur(
                img,
                width,
                kernel_size
            )
        );

        return box_blur_raw_data;
    }

    function gamma(img, width, gamma_value) {
        let gamma_transform_raw_data = new Uint8ClampedArray(
            gamma_transform(img, width, gamma_value)
        );

        return gamma_transform_raw_data;
    }

    function sobel(img, width, threshold) {
        let sobel_raw_data = new Uint8ClampedArray(
            sobel_edge_detection(img, width, threshold)
        );

        return sobel_raw_data
    }

    self.addEventListener('message', event => {
        let message = event.data.message;
        // let image_data = new Uint8Array();
        let image_data = null;
        let width = 0;

        if (message === "INVERT") {
            width = event.data.width;
        } 
        else if (message === "INVERT BUTTON") {
            width = event.data.width;
            image_data = new Uint8Array(event.data.image);
        } 
        else if (message === "BOX BLUR") {
            width = event.data.width;
        } 
        else if (message === "GAMMA") {
            width = event.data.width;
        } 
        else if(message === "SOBEL") {
            width = event.data.width;
        }
        else if(message === "USER IMAGE") {
            user_image = new Uint8ClampedArray(event.data.image);
        }

        if (message === "INVERT") {
            image_data = invert_image(user_image, width);
            self.postMessage(
                {
                    message: "INVERTED",
                    image: image_data.buffer,
                    width: width,
                },
                [image_data.buffer]
            );
        } 
        else if (message === "INVERT BUTTON") {
            image_data = invert_image(image_data, width);
            self.postMessage(
                {
                    message: "INVERTED",
                    image: image_data.buffer,
                    width: width,
                },
                [image_data.buffer]
            );
        }
        else if (message === "BOX BLUR") {
            image_data = box_blur_image(user_image, width, event.data.kernel_size);
            self.postMessage(
                {
                    message: "BOX BLUR",
                    image: image_data.buffer,
                    width: width,
                },
                [image_data.buffer]
            );
        } 
        else if (message === "GAMMA") {
            image_data = gamma(user_image, width, event.data.gamma);
            self.postMessage(
                {
                    message: "GAMMA",
                    image: image_data.buffer,
                    width: width,
                },
                [image_data.buffer]
            );
        } 
        else if (message === "SOBEL") {
            image_data = sobel(user_image, width, event.data.threshold);
            self.postMessage(
                {
                    message: "SOBEL",
                    image: image_data.buffer,
                    width: width,
                },
                [image_data.buffer]
            );
        }
        else {
            self.postMessage("Unrecognized message", []);
        }
    });
}

initialize();
self.importScripts('../../wasm/proc.js');

const {invert, box_blur, gamma_transform} = wasm_bindgen;

async function initialize() {
    await wasm_bindgen('../../wasm/proc_bg.wasm');
    
    self.postMessage({
        message: "wasm INITIALIZED",
    });

    function invert_image(img, width) {
        let inverted_raw_data = new Uint8ClampedArray(
            invert(img, width)
        );
        // return new ImageData(inverted_raw_data, width);
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

        // return new ImageData(box_blur_raw_data, img.width)
        return box_blur_raw_data;
    }

    function gamma(img, width, gamma_value) {
        let gamma_transform_raw_data = new Uint8ClampedArray(
            gamma_transform(img, width, gamma_value)
        );

        return gamma_transform_raw_data;
    }

    self.addEventListener('message', event => {
        let message = event.data.message;
        let image_data = new Uint8Array();
        let width = 0;

        if (message === "INVERT") {
            width = event.data.width;
            image_data = new Uint8Array(event.data.image);
        } else if (message === "BOX BLUR") {
            width = event.data.width;
            image_data = new Uint8Array(event.data.image); 
        } else if (message === "GAMMA") {
            width = event.data.width;
            image_data = new Uint8Array(event.data.image);
        }

        if (message === "INVERT") {
            console.log("inverting");
            image_data = invert_image(image_data, width);
            self.postMessage(
                {
                    message: "INVERTED",
                    image: image_data.buffer,
                    width: width,
                },
                [image_data.buffer]
            );
        } else if (message === "BOX BLUR") {
            console.log("box blurring");
            image_data = box_blur_image(image_data, width, event.data.kernel_size);
            self.postMessage(
                {
                    message: "BOX BLUR",
                    image: image_data.buffer,
                    width: width,
                },
                [image_data.buffer]
            );
        } else if (message === "GAMMA") {
            console.log("performing gamma transformation");
            image_data = gamma(image_data, width, event.data.gamma);
            self.postMessage(
                {
                    message: "GAMMA",
                    image: image_data.buffer,
                    width: width,
                },
                [image_data.buffer]
            )
        } else {
            console.log("Message was unrecognized");
            self.postMessage("Unrecognized message", []);
        }
    });
}

initialize();
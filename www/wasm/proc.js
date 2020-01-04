(function() {
    const __exports = {};
    let wasm;

    let cachegetUint8Memory0 = null;
    function getUint8Memory0() {
        if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
            cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
        }
        return cachegetUint8Memory0;
    }

    let WASM_VECTOR_LEN = 0;

    function passArray8ToWasm0(arg, malloc) {
        const ptr = malloc(arg.length * 1);
        getUint8Memory0().set(arg, ptr / 1);
        WASM_VECTOR_LEN = arg.length;
        return ptr;
    }

    let cachegetInt32Memory0 = null;
    function getInt32Memory0() {
        if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
            cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
        }
        return cachegetInt32Memory0;
    }

    function getArrayU8FromWasm0(ptr, len) {
        return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
    }
    /**
    * @param {Uint8Array} input_image
    * @param {number} width
    * @returns {Uint8Array}
    */
    __exports.invert = function(input_image, width) {
        var ptr0 = passArray8ToWasm0(input_image, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.invert(8, ptr0, len0, width);
        var r0 = getInt32Memory0()[8 / 4 + 0];
        var r1 = getInt32Memory0()[8 / 4 + 1];
        var v1 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v1;
    };

    /**
    * @param {Uint8Array} input_image
    * @param {number} width
    * @param {number} kernel_size
    * @returns {Uint8Array}
    */
    __exports.box_blur = function(input_image, width, kernel_size) {
        var ptr0 = passArray8ToWasm0(input_image, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.box_blur(8, ptr0, len0, width, kernel_size);
        var r0 = getInt32Memory0()[8 / 4 + 0];
        var r1 = getInt32Memory0()[8 / 4 + 1];
        var v1 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v1;
    };

    /**
    * @param {Uint8Array} input_image
    * @param {number} width
    * @returns {Uint8Array}
    */
    __exports.gamma_transform = function(input_image, width, gamma) {
        var ptr0 = passArray8ToWasm0(input_image, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.gamma_transform(8, ptr0, len0, width, gamma);
        var r0 = getInt32Memory0()[8 / 4 + 0];
        var r1 = getInt32Memory0()[8 / 4 + 1];
        var v1 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v1;
    };

    /**
    * @param {Uint8Array} input_image
    * @param {number} width
    * @param {number} threshold
    * @returns {Uint8Array}
    */
    __exports.sobel_edge_detection = function(input_image, width, threshold) {
        var ptr0 = passArray8ToWasm0(input_image, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.sobel_edge_detection(8, ptr0, len0, width, threshold);
        var r0 = getInt32Memory0()[8 / 4 + 0];
        var r1 = getInt32Memory0()[8 / 4 + 1];
        var v1 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v1;
    };

    function init(module) {

        let result;
        const imports = {};

        if ((typeof URL === 'function' && module instanceof URL) || typeof module === 'string' || (typeof Request === 'function' && module instanceof Request)) {

            const response = fetch(module);
            if (typeof WebAssembly.instantiateStreaming === 'function') {
                result = WebAssembly.instantiateStreaming(response, imports)
                .catch(e => {
                    return response
                    .then(r => {
                        if (r.headers.get('Content-Type') != 'application/wasm') {
                            console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
                            return r.arrayBuffer();
                        } else {
                            throw e;
                        }
                    })
                    .then(bytes => WebAssembly.instantiate(bytes, imports));
                });
            } else {
                result = response
                .then(r => r.arrayBuffer())
                .then(bytes => WebAssembly.instantiate(bytes, imports));
            }
        } else {

            result = WebAssembly.instantiate(module, imports)
            .then(result => {
                if (result instanceof WebAssembly.Instance) {
                    return { instance: result, module };
                } else {
                    return result;
                }
            });
        }
        return result.then(({instance, module}) => {
            wasm = instance.exports;
            init.__wbindgen_wasm_module = module;

            return wasm;
        });
    }

    self.wasm_bindgen = Object.assign(init, __exports);

})();

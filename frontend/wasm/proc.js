(function() {
    const __exports = {};
    let wasm;

    let cachegetUint8Memory = null;
    function getUint8Memory() {
        if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
            cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
        }
        return cachegetUint8Memory;
    }

    let WASM_VECTOR_LEN = 0;

    function passArray8ToWasm(arg) {
        const ptr = wasm.__wbindgen_malloc(arg.length * 1);
        getUint8Memory().set(arg, ptr / 1);
        WASM_VECTOR_LEN = arg.length;
        return ptr;
    }

    let cachegetInt32Memory = null;
    function getInt32Memory() {
        if (cachegetInt32Memory === null || cachegetInt32Memory.buffer !== wasm.memory.buffer) {
            cachegetInt32Memory = new Int32Array(wasm.memory.buffer);
        }
        return cachegetInt32Memory;
    }

    function getArrayU8FromWasm(ptr, len) {
        return getUint8Memory().subarray(ptr / 1, ptr / 1 + len);
    }
    /**
    * @param {Uint8Array} input_image
    * @param {number} width
    * @returns {Uint8Array}
    */
    __exports.invert = function(input_image, width) {
        const retptr = 8;
        const ret = wasm.invert(retptr, passArray8ToWasm(input_image), WASM_VECTOR_LEN, width);
        const memi32 = getInt32Memory();
        const v0 = getArrayU8FromWasm(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1]).slice();
        wasm.__wbindgen_free(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1] * 1);
        return v0;
    };

    /**
    * @param {Uint8Array} input_image
    * @param {number} width
    * @param {number} kernel_size
    * @returns {Uint8Array}
    */
    __exports.box_blur = function(input_image, width, kernel_size) {
        const retptr = 8;
        const ret = wasm.box_blur(retptr, passArray8ToWasm(input_image), WASM_VECTOR_LEN, width, kernel_size);
        const memi32 = getInt32Memory();
        const v0 = getArrayU8FromWasm(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1]).slice();
        wasm.__wbindgen_free(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1] * 1);
        return v0;
    };

    /**
    * @param {Uint8Array} input_image
    * @param {number} width
    * @param {number} gamma
    * @returns {Uint8Array}
    */
    __exports.gamma_transform = function(input_image, width, gamma) {
        const retptr = 8;
        const ret = wasm.gamma_transform(retptr, passArray8ToWasm(input_image), WASM_VECTOR_LEN, width, gamma);
        const memi32 = getInt32Memory();
        const v0 = getArrayU8FromWasm(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1]).slice();
        wasm.__wbindgen_free(memi32[retptr / 4 + 0], memi32[retptr / 4 + 1] * 1);
        return v0;
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

# Image Processing Website

This website aims to demonstrate different image processing algorithms and data structures used for different imaging applications.

To build this project you need [node.js](https://nodejs.org) specifically npm and [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/).

After those two are installed then you can execute these commands

```
npm install
cd proc/
wasm-pack build -t no-modules -d ../frontend/wasm/ --no-typescript
```

These commands installs webpack and eslint and compiles the proc rust library
to webassembly. From there you can start a http server and point it to frontend/index.html

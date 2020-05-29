wasm:
    just proc/wasm

deploy: 
    npm run build
    just wasm
    cp -r frontend/fonts www
    cp -r frontend/images www
    cp -r frontend/js/dist www/js
    cp frontend/index.html www
    cp frontend/index.css www
    cp frontend/main.html www
    cp frontend/main.css www
    cp -r frontend/wasm www
    rm www/wasm/.gitignore
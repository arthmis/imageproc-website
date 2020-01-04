use image::imageops::resize;
use image::ConvertBuffer;
use image::FilterType;
use image::{GrayImage, RgbaImage};
use wasm_bindgen::prelude::*;

use image_processing::pixel_ops::*;
use image_processing::blur::{box_filter_mut, MeanKernel};
use image_processing::edge_detection::sobel_mut;

use wee_alloc;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// useful console logging macro from rustwasm documentation
// macro_rules! console_log {
//     ( $( $t:tt )* ) => {
//         web_sys::console::log_1(&format!( $( $t) *).into());
//     }
// }

const CHANNEL_COUNT: u32 = 4;

#[wasm_bindgen]
pub fn invert(input_image: Vec<u8>, width: u32) -> Vec<u8> {
    let height = (input_image.len() as u32 / CHANNEL_COUNT) / width;
    let mut image: RgbaImage =
        image::ImageBuffer::from_vec(width, height, input_image)
            .expect("expected image from canvas");
    invert_mut(&mut image);

    image.into_vec()
}

#[wasm_bindgen]
pub fn box_blur(input_image: Vec<u8>, width: u32, kernel_size: u32) -> Vec<u8> {
    let height = (input_image.len() as u32 / CHANNEL_COUNT) / width;
    let mut image: RgbaImage =
        image::ImageBuffer::from_vec(width, height, input_image)
            .expect("expected image from canvas");

    let kernel = MeanKernel::new(kernel_size);
    box_filter_mut(kernel, &mut image);

    image.into_vec()
    
}

#[wasm_bindgen]
pub fn gamma_transform(input_image: Vec<u8>, width: u32, gamma: f32) -> Vec<u8> {
    let height = (input_image.len() as u32 / CHANNEL_COUNT) / width;
    let mut image: RgbaImage =
        image::ImageBuffer::from_vec(width, height, input_image)
            .expect("expected image from canvas");

    power_law_transform_mut(&mut image, gamma);

    image.into_vec()
}

#[wasm_bindgen]
pub fn sobel_edge_detection(input_image: Vec<u8>, width: u32, threshold: u8) -> Vec<u8> {
    let height = (input_image.len() as u32 / CHANNEL_COUNT) / width;
    let mut image: RgbaImage = 
        image::ImageBuffer::from_vec(width, height, input_image)
            .expect("expected image from canvas");

    let mut gray_image: GrayImage = image.convert();

    // console_log!("here");
    sobel_mut(&mut gray_image, threshold);
    for (gray_pixel, color_pixel) in gray_image.pixels().zip(image.pixels_mut()) {
        color_pixel[0] = gray_pixel[0];
        color_pixel[1] = gray_pixel[0];
        color_pixel[2] = gray_pixel[0];
    }

    image.into_vec()
}

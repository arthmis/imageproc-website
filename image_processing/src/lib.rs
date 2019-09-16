use image::{RgbaImage, GrayImage};
use image::ConvertBuffer;
use image::imageops::resize;
use image::FilterType;
use pixel_ops::*;
use wasm_bindgen::prelude::*;

pub mod hsv;
pub mod histogram;
pub mod pixel_ops;
// useful console logging macro from rustwasm documentation
macro_rules! console_log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t) *).into());
    }
}

const CHANNEL_COUNT: u32 = 4;

#[wasm_bindgen]
pub fn invert(input_image: Vec<u8>, width: u32) -> Vec<u8> {
    let height = (input_image.len() as u32 / CHANNEL_COUNT) / width;
    let mut image: RgbaImage =
        image::ImageBuffer::from_vec(width, height, input_image).expect("expected image from canvas");
    invert_mut(&mut image);

    image.into_vec()
}

#[wasm_bindgen]
pub fn resize_img(input_image: Vec<u8>, width: u32, new_width: u32, new_height: u32) -> Vec<u8> {
    let height = (input_image.len() as u32 / CHANNEL_COUNT) / width;
    let image: RgbaImage = image::ImageBuffer::from_vec(width, height, input_image).expect("expected image from canvas");
    let resized_img = resize(&image, new_width, new_height, FilterType::Triangle);
    resized_img.into_vec()
}

#[wasm_bindgen]
pub fn to_grayscale(input_image: Vec<u8>, width: u32) -> Vec<u8> {
    let height = (input_image.len() as u32 / CHANNEL_COUNT) / width;
    let mut image: RgbaImage =
        image::ImageBuffer::from_vec(width, height, input_image).expect("expected image from canvas");
    convert_to_grayscale(&mut image);
    image.into_vec()
}

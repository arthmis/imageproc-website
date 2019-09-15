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
// pub fn invert(input_image: &[u8], width: u32) -> Vec<u8> {
    let height = (input_image.len() as u32 / CHANNEL_COUNT) / width;
    // console_log!("width: {}\nheight: {}", width, height);
    // let mut image: RgbaImage =
    //     image::ImageBuffer::from_vec(width, height, input_image).expect("expected image from canvas");
    let image: RgbaImage =
        image::ImageBuffer::from_vec(width, height, input_image).expect("expected image from canvas");
    // console_log!("width: {} height: {}", image.width(), image.height());
    let mut image: GrayImage = image.convert();
    invert_mut(&mut image);
    // invert_mut()
    // let mut img: RgbaImage = ImageBuffer::from_pixel(1, 1, Rgba([100, 100, 100, 255]));
    // image::imageops::invert_mut(&mut img);
    // image::imageops::colorops::invert(&mut img);

    // console_log!("width: {} height: {}", image.width(), image.height());
    let image: RgbaImage = image.convert();
    image.into_vec()
}

#[wasm_bindgen]
pub fn resize_img(input_image: Vec<u8>, width: u32, new_width: u32, new_height: u32) -> Vec<u8> {
    let height = (input_image.len() as u32 / CHANNEL_COUNT) / width;
    let image: RgbaImage = image::ImageBuffer::from_vec(width, height, input_image).expect("expected image from canvas");
    let resized_img = resize(&image, new_width, new_height, FilterType::Triangle);
    resized_img.into_vec()
}

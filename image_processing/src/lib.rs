use image::RgbaImage;
use image::ConvertBuffer;
// use image_processing::pixel_operations::*;
// use image::Rgba;
// use image::ImageBuffer;
use wasm_bindgen::prelude::*;
// use image::ImageBuffer::from_raw;

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
    console_log!("width: {}\nheight: {}", width, height);
    // let mut image: RgbaImage =
    //     image::ImageBuffer::from_vec(width, height, input_image).expect("expected image from canvas");
    let mut image: RgbaImage =
        image::ImageBuffer::from_vec(width, height, input_image).expect("expected image from canvas");
    invert_mut(&mut image);
    // invert_mut()
    // let mut img: RgbaImage = ImageBuffer::from_pixel(1, 1, Rgba([100, 100, 100, 255]));
    // image::imageops::invert_mut(&mut img);
    // image::imageops::colorops::invert(&mut img);

    image.into_vec()
}

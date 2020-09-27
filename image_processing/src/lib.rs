pub mod blur;
pub mod conversion;
pub mod edge_detection;
pub mod exposure;
pub mod histogram;
pub mod matrix_ops;
pub mod pixel_ops;
#[cfg(feature = "display-window")]
pub mod window;

// use image::GrayImage;
use image::Primitive;

pub fn clamp<T: Primitive + PartialOrd>(value: T, min: T, max: T) -> T {
    if value < min {
        min
    } else if value > max {
        max
    } else {
        value
    }
}

// pub fn image_max(image: &RgbaImage) -> u8 {
//     // const CHANNEL_COUNT: usize = 4;
//     let mut max: u32 = 0;
//     for pixel in image.pixels() {
//         let new_max = (pixel.channels().iter().sum() / 3) as u32;
//         max = max.max(new_max);
//         // max = max.max(pixel[0]);
//     }
//     max as u8
// }

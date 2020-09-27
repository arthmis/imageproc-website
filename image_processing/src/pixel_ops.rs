//! Operations that only deal with one pixel at a time

use image::{GrayImage, RgbaImage};

pub fn invert_mut(image: &mut RgbaImage) {
    let max = std::u8::MAX;
    for pixel in image.pixels_mut() {
        pixel[0] = max - pixel[0];
        pixel[1] = max - pixel[1];
        pixel[2] = max - pixel[2];
    }
}

pub fn convert_to_grayscale(image: &mut RgbaImage) {
    let (width, height) = image.dimensions();
    let channel_count = 4;
    let alpha_count = 1;
    for y in 0..height {
        for x in 0..width {
            let pixel = image.get_pixel_mut(x, y);
            let pixel_slice = &mut pixel.0[0..channel_count - alpha_count];
            let red = pixel_slice[0] as f32 * 0.299;
            let green = pixel_slice[1] as f32 * 0.587;
            let blue = pixel_slice[2] as f32 * 0.114;
            let gray_value = red as u8 + green as u8 + blue as u8;
            pixel_slice[0] = gray_value;
            pixel_slice[1] = gray_value;
            pixel_slice[2] = gray_value;
        }
    }
}

pub fn threshold_mut(image: &mut GrayImage, threshold: u8) {
    let max = 255;
    let min = 0;
    // for pixel in image.pixels_mut() {
    //     if pixel[0] >= threshold {
    //         pixel[0] = max;
    //     } else {
    //         pixel[0] = min;
    //     }
    // }
    for pixel in image.pixels_mut() {
        if pixel[0] >= threshold {
            pixel[0] = min;
        } else {
            pixel[0] = max;
        }
    }
}

// https://homepages.inf.ed.ac.uk/rbf/HIPR2/pixlog.htm
// TODO make this adjustable by inputting constant factor
// pub fn logarithm_mut(image: &mut RgbaImage) {
//     use crate::image_max;
//     let max_pixel = image_max(image);
//     let scaling_constant = 255.0 / (1.0 + max_pixel as f32).log10();
//     let lut: [u8; 256] = {
//         let mut lut = [0_u8; 256];
//         for (i, val) in lut.iter_mut().enumerate() {
//             *val = (scaling_constant * (1.0 + i as f32).log10()).round() as u8;
//         }
//         lut
//     };

//     for pixel in image.pixels_mut() {
//         pixel[0] = lut[pixel[0] as usize];
//         pixel[1] = lut[pixel[1] as usize];
//         pixel[2] = lut[pixel[2] as usize];
//     }
// }

// https://theailearner.com/2019/01/26/power-law-gamma-transformations/
pub fn power_law_transform_mut(image: &mut RgbaImage, gamma: f32) {
    let lut = {
        let mut lut = [0_u8; 256];
        let max = 255.0;
        for (i, val) in lut.iter_mut().enumerate() {
            *val = ((i as f32 / max).powf(gamma) * max).round() as u8;
        }
        lut
    };
    for pixel in image.pixels_mut() {
        pixel[0] = lut[pixel[0] as usize];
        pixel[1] = lut[pixel[1] as usize];
        pixel[2] = lut[pixel[2] as usize];
    }
}

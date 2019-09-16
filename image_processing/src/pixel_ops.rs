//! Operations that only deal with one pixel

use image::{GenericImage, Pixel, Primitive, RgbaImage, GrayImage};
use num_traits::cast::NumCast;

pub fn clamp<T: Primitive>(value: T, min: T, max: T) -> T {
    if value < min {
        min
    } else if value > max {
        max
    } else {
        value
    }
}

// pub fn invert_mut(image: &mut GrayImage) {
pub fn invert_mut(image: &mut RgbaImage) {
    use std::u8;
    let apply_color = |x| {
        u8::MAX - x
    };
    let (width, height) = image.dimensions();
        for y in 0..height {
        for x in 0..width {
            image
                .get_pixel_mut(x, y)
                .apply_without_alpha(apply_color);
        }
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

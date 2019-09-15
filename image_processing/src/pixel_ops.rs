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

pub fn invert_mut(image: &mut GrayImage) {
    use std::u8;
    let apply_color = |x| {
        u8::MAX - x
    };
    let (width, height) = image.dimensions();
    for x in 0..width {
        for y in 0..height {
            image
                .get_pixel_mut(x, y)
                .apply_without_alpha(apply_color);
        }
    }
}

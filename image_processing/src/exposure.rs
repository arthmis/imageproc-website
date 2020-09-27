use crate::clamp;
use image::RgbaImage;

// link to explanation and conversion for srgb <-> rgb
// https://stackoverflow.com/questions/12524623/what-are-the-practical-differences-when-working-with-colors-in-a-linear-vs-a-no
pub fn srgb_to_rgb(image: &mut RgbaImage) {
    let lut = {
        let mut lut = [0_u8; 256];
        for (i, value) in lut.iter_mut().enumerate() {
            let norm_val = i as f32 / 255.0;
            let new_value: u8 = if norm_val <= 0.04045 {
                (norm_val / 12.92 * 255.0).round() as u8
            } else {
                (((norm_val + 0.055) / 1.055).powf(2.4) * 255.0).round() as u8
            };
            *value = new_value;
        }
        lut
    };
    for pixel in image.pixels_mut() {
        pixel[0] = lut[pixel[0] as usize];
        pixel[1] = lut[pixel[1] as usize];
        pixel[2] = lut[pixel[2] as usize];
    }
}
pub fn rgb_to_srgb(image: &mut RgbaImage) {
    let lut = {
        let mut lut = [0_u8; 256];
        for (i, value) in lut.iter_mut().enumerate() {
            let i = i as f32 / 255.0;
            let new_value: u8 = if i <= 0.0031308 {
                (i * 12.92 * 255.0).round() as u8
            } else {
                ((1.055 * i.powf(1.0 / 2.4) - 0.055) * 255.0).round() as u8
            };
            *value = new_value;
        }
        lut
    };
    for pixel in image.pixels_mut() {
        pixel[0] = lut[pixel[0] as usize];
        pixel[1] = lut[pixel[1] as usize];
        pixel[2] = lut[pixel[2] as usize];
    }
}
pub fn exposure_compensation(image: &RgbaImage, compensation: f32) -> RgbaImage {
    let mut new_image = image.clone();

    let lut = {
        let mut lut: [u8; 256] = [0; 256];

        for (i, val) in lut.iter_mut().enumerate() {
            // let compensation = compensation * (1.0 + i as f32).log10() / 1.0
            //     + compensation * (1.0 + i as f32).log10();
            *val = (i as f32 + 2.0_f32.powf(compensation)).round() as u8;
        }
        lut
    };

    for pixel in new_image.pixels_mut() {
        pixel[0] = lut[pixel[0] as usize];
        pixel[1] = lut[pixel[1] as usize];
        pixel[2] = lut[pixel[2] as usize];
    }
    new_image
}

pub fn brightness(image: &RgbaImage, new_brightness: u16) -> RgbaImage {
    let mut new_image = image.clone();

    for pixel in new_image.pixels_mut() {
        pixel[0] = clamp(pixel[0] as u16 + new_brightness, 0, 255) as u8;
        pixel[1] = clamp(pixel[1] as u16 + new_brightness, 0, 255) as u8;
        pixel[2] = clamp(pixel[2] as u16 + new_brightness, 0, 255) as u8;
    }
    // for pixel in new_image.pixels_mut() {
    //     pixel[0] = clamp(
    //         pixel[0] as u16 + (new_brightness as f32 * 0.212655).round() as u16,
    //         0,
    //         255,
    //     ) as u8;
    //     pixel[1] = clamp(
    //         pixel[1] as u16 + (new_brightness as f32 * 0.715158).round() as u16,
    //         0,
    //         255,
    //     ) as u8;
    //     pixel[2] = clamp(
    //         pixel[2] as u16 + (new_brightness as f32 * 0.072187).round() as u16,
    //         0,
    //         255,
    //     ) as u8;
    // }

    new_image
}

use std::convert::From;

use image::{ImageBuffer, RgbaImage};

pub struct Hsl {
    pub hue: Vec<f32>,
    pub saturation: Vec<f32>,
    pub luminance: Vec<f32>,
    pub width: usize,
    pub height: usize,
}

impl Hsl {
    pub fn new(width: usize, height: usize) -> Self {
        let hue = Vec::with_capacity(width * height);
        let saturation = Vec::with_capacity(width * height);
        let luminance = Vec::with_capacity(width * height);
        Hsl {
            hue,
            saturation,
            luminance,
            width,
            height,
        }
    }
}

impl From<&RgbaImage> for Hsl {
    fn from(rgba_image: &RgbaImage) -> Self {
        let mut hsl = Self::new(rgba_image.width() as usize, rgba_image.height() as usize);
        let mut rgb: (u8, u8, u8) = (0, 0, 0);
        for pixel in rgba_image.pixels() {
            // dbg!(pixel[0]);
            // rgb = [pixel[0], pixel[1], pixel[2]];
            rgb = (pixel[0], pixel[1], pixel[2]);
            // let (hue, saturation, luminance) = rgb_to_hsl(&rgb);
            let (hue, saturation, luminance) = rgb_to_hsl(rgb);
            // let (hue, saturation, luminance) = rgb_to_hsl(&[pixel[0], pixel[1], pixel[2]]);
            hsl.hue.push(hue);
            hsl.saturation.push(saturation);
            hsl.luminance.push(luminance);
        }
        hsl
    }
}

impl From<&Hsl> for RgbaImage {
    fn from(hsl_image: &Hsl) -> Self {
        let mut rgba: RgbaImage = ImageBuffer::new(hsl_image.width as u32, hsl_image.height as u32);
        // dbg!()
        for (((hue, saturation), luminance), pixel) in hsl_image
            .hue
            .iter()
            .zip(hsl_image.saturation.iter())
            .zip(hsl_image.luminance.iter())
            .zip(rgba.pixels_mut())
        {
            let (red, green, blue) = hsl_to_rgb((*hue, *saturation, *luminance));
            pixel[0] = red;
            pixel[1] = green;
            pixel[2] = blue;
            pixel[3] = 255;
        }
        rgba
    }
}

fn hsl_to_rgb(pixel: (f32, f32, f32)) -> (u8, u8, u8) {
    let (hue, saturation, luminance) = pixel;

    let chroma = (1.0 - (2.0 * luminance - 1.0).abs()) * saturation;
    let hue = hue / 60.0;
    let x = chroma * (1.0 - (hue % 2.0 - 1.0).abs());

    let (mut red, mut green, mut blue) = {
        if hue >= 0.0 && hue <= 1.0 {
            (chroma, x, 0.0)
        } else if hue >= 1.0 && hue <= 2.0 {
            (x, chroma, 0.0)
        } else if hue >= 2.0 && hue <= 3.0 {
            (0.0, chroma, x)
        } else if hue >= 3.0 && hue <= 4.0 {
            (0.0, x, chroma)
        } else if hue >= 4.0 && hue <= 5.0 {
            (x, 0.0, chroma)
        } else if hue >= 5.0 && hue <= 6.0 {
            (chroma, 0.0, x)
        } else {
            (0.0, 0.0, 0.0)
        }
    };
    let m = luminance - chroma / 2.0;
    red += m;
    green += m;
    blue += m;
    // dbg!(red);
    // dbg!(green);
    // dbg!(blue);
    // (0, 0, 0)
    (
        (red * 255.0).round() as u8,
        (green * 255.0).round() as u8,
        (blue * 255.0).round() as u8,
    )
}

pub fn rgb_to_hsl(pixel: (u8, u8, u8)) -> (f32, f32, f32) {
    let red = pixel.0 as f32 / 255.0;
    let green = pixel.1 as f32 / 255.0;
    let blue = pixel.2 as f32 / 255.0;

    let max = red.max(green).max(blue);
    let min = red.min(green).min(blue);
    let delta = max - min;

    let (mut hue, mut saturation, mut luminance) = (0.0_f32, 0.0_f32, 0.0_f32);

    hue = {
        if delta == 0.0 {
            0.0
        } else if max == red {
            60.0 * ((green - blue) / delta)
        // 60.0 * (((green - blue) / delta) % 6.0)
        } else if max == green {
            60.0 * (2.0 + (blue - red) / delta)
        } else if max == blue {
            60.0 * (4.0 + (red - green) / delta)
        } else {
            0.0
        }
    };

    if hue < 0.0 {
        hue += 360.0;
    }

    saturation = {
        if max == 0.0 {
            0.0
        } else if min == 1.0 {
            0.0
        } else {
            // (max - luminance) / luminance.min(1.0 - luminance)
            // (2.0 * max - 2.0 * luminance) / (1.0 - (2.0 * luminance - 1.0).abs())
            (max - min) / (1.0 - (max + min - 1.0).abs())
        }
    };
    luminance = (max + min) / 2.0;
    // dbg!(hue);
    // dbg!(saturation);
    // dbg!(luminance);
    (hue, saturation, luminance)
}

// use image::RgbaImage;
use image::GenericImageView;
use image::{GrayImage, ImageBuffer, RgbaImage};

use std::f32::consts::{E, PI};
// otherwise known as a box filter
#[derive(Clone, Copy)]
pub struct MeanKernel(u32);

impl MeanKernel {
    pub fn new(size: u32) -> Self {
        assert!(size % 2 != 0, "Size needs to be odd. Size was: {}", size);
        MeanKernel(size)
    }

    pub fn size(&self) -> u32 {
        self.0
    }
}

#[derive(Clone)]
pub struct GaussianKernel {
    pub sigma: f32,
    // pub size: u32,
    pub one_dimension_filter: Vec<f32>,
}

impl GaussianKernel {
    // think about making sigma be floating point and 1.0 and higher
    pub fn new(sigma: u32) -> Self {
        assert!(sigma >= 1, "Sigma has to be 1 or greater: {}", sigma);

        // using a standard deviation of 2 instead of 3 because
        // 95% coverage is good enough while 3 std would cover 99.7%
        let standard_deviation = 2;

        // the `+ 1` makes the size odd
        let size = standard_deviation * sigma * 2 + 1;

        // figure out how to round the size up to odd when sigma can be f32
        assert!(size % 2 != 0, "Size needs to be odd. Size was: {}", size);

        let begin = size as i32 / 2 * -1;
        let end = size as i32 / 2;

        let mut filter = vec![0_f32; size as usize];

        for (i, x) in filter.iter_mut().zip(begin..=end) {
            *i = x as f32;
        }

        let sigma = sigma as f32;
        // create gauss filter values
        for x in filter.iter_mut() {
            let exponent_of_e = x.powi(2) / sigma.powi(2) / -2.0;
            let e = E.powf(exponent_of_e);
            *x = 1.0 / ((2.0 * PI).sqrt() * sigma) * e;
        }

        GaussianKernel {
            sigma: sigma as f32,
            one_dimension_filter: filter,
        }
    }
}

pub fn gaussian_filter_mut(filter: &GaussianKernel, image: &mut GrayImage) {
    let filter = filter.one_dimension_filter.as_slice();

    let (width, height) = image.dimensions();

    let mut horizontal_blur_image: GrayImage = ImageBuffer::new(width, height);

    // want the truncated value of this division, hence not using float
    let filter_radius: i32 = filter.len() as i32 / 2;

    // blur horizontally
    for y in 0..height {
        for x in 0..width {
            let mut sum: f32 = 0.0;
            let begin: i32 = x as i32 - filter_radius;
            let end: i32 = x as i32 + filter_radius;
            for (i, filter_val) in (begin..=end).zip(filter.iter()) {
                if i < 0 {
                    unsafe {
                        sum += image.unsafe_get_pixel(x, y).0[0] as f32 * filter_val;
                    }
                } else if i >= width as i32 {
                    unsafe {
                        sum += image.unsafe_get_pixel(x, y).0[0] as f32 * filter_val;
                    }
                } else {
                    unsafe {
                        sum += image.unsafe_get_pixel(i as u32, y).0[0] as f32 * filter_val;
                    }
                }
            }
            horizontal_blur_image.get_pixel_mut(x, y).0[0] = sum.round() as u8;
        }
    }

    // blur vertically
    for y in 0..height {
        for x in 0..width {
            let mut sum: f32 = 0.0;
            let begin: i32 = y as i32 - filter_radius;
            let end: i32 = y as i32 + filter_radius;

            for (i, filter_val) in (begin..=end).zip(filter.iter()) {
                if i < 0 {
                    unsafe {
                        sum +=
                            horizontal_blur_image.unsafe_get_pixel(x, y).0[0] as f32 * filter_val;
                    }
                } else if i >= height as i32 {
                    unsafe {
                        sum +=
                            horizontal_blur_image.unsafe_get_pixel(x, y).0[0] as f32 * filter_val;
                    }
                } else {
                    unsafe {
                        sum += horizontal_blur_image.unsafe_get_pixel(x, i as u32).0[0] as f32
                            * filter_val;
                    }
                }
            }
            image.get_pixel_mut(x, y).0[0] = sum.round() as u8;
        }
    }
}


// pub fn box_filter_mut_alternate(filter: MeanKernel, image: &mut RgbaImage) {
//     use crate::matrix_ops::transpose;

//     let (width, height) = image.dimensions();

//     // want the truncated value of this division, hence not using float
//     let radius: i32 = filter.size() as i32 / 2;

//     // let mut new_image: RgbaImage = ImageBuffer::new(width, height);
//     let mut new_image: RgbaImage = ImageBuffer::new(width, height);
//     let mut vertical_image: RgbaImage = ImageBuffer::new(height, width);
//     let mut vertical_image_blur: RgbaImage = ImageBuffer::new(height, width);

//     // blur pixels row wise
//     horizontal_blur(radius, image, &mut new_image, width, height);
//     transpose(&new_image, &mut vertical_image);

//     // blur pixels column wise
//     horizontal_blur(
//         radius,
//         &vertical_image,
//         &mut vertical_image_blur,
//         height,
//         width,
//     );
//     transpose(&vertical_image_blur, image);
// }

// got the algorithm for this box blur from here
// https://fgiesen.wordpress.com/2012/07/30/fast-blurs-1/
// http://elynxsdk.free.fr/ext-docs/Blur/Fast_box_blur.pdf
// this filter still isn't complete because it can't take even sized filters
pub fn box_filter_mut(filter: MeanKernel, image: &mut RgbaImage) {
    // use crate::matrix_ops::transpose_generic;
    use crate::matrix_ops::transpose_rgba;
    use image::Pixel;
    use image::Rgba;

    let (width, height) = image.dimensions();

    // want the truncated value of this division, hence not using float
    let radius: i32 = filter.size() as i32 / 2;

    // let white_pixel = [255, 255, 255, 255_u8];
    let mut new_image: RgbaImage =
        ImageBuffer::from_pixel(width, height, Rgba::from_channels(255, 255, 255, 255));
    // let mut new_image: RgbaImage = ImageBuffer::new(width, height);

    // blur pixels row wise
    horizontal_blur(radius, image, &mut new_image, width, height);
    // transpose_generic(&new_image, image, width as usize, height as usize, STRIDE);
    transpose_rgba(&new_image, image, width as usize, height as usize);

    // blur pixels column wise
    horizontal_blur(radius, &image, &mut new_image, height, width);
    // transpose_generic(&new_image, image, height as usize, width as usize, STRIDE);
    transpose_rgba(&new_image, image, height as usize, width as usize);
}
const CHANNEL_COUNT: i32 = 4;
fn horizontal_blur(radius: i32, image: &[u8], blur_image: &mut [u8], width: u32, height: u32) {
    assert_eq!((width * height * CHANNEL_COUNT as u32) as usize, image.len());
    assert_eq!(image.len(), blur_image.len());

    let scale = 1.0 / (2 * radius + 1) as f32;

    let (width, height) = (width as i32, height as i32);

    for y in 0..height {
        let (mut sum_red, mut sum_green, mut sum_blue) = {
            // let mut sum: f32 = 0.0;
            let mut sum_red = 0.0_f32;
            let mut sum_green = 0.0_f32;
            let mut sum_blue = 0.0_f32;

            let begin = 0 - radius;
            let end = 0 + radius;
            for i in begin..=end {
                if i < 0 {
                    let pixel_index = (y * width * CHANNEL_COUNT) as usize;

                    sum_red += image[pixel_index] as f32;
                    sum_green += image[pixel_index + 1] as f32;
                    sum_blue += image[pixel_index + 2] as f32;
                } else if i >= width as i32 {
                    let pixel_index =
                        (y * width * CHANNEL_COUNT + (width - 1) * CHANNEL_COUNT) as usize;
                    sum_red += image[pixel_index] as f32;
                    sum_green += image[pixel_index + 1] as f32;
                    sum_blue += image[pixel_index + 2] as f32;
                } else {
                    let pixel_index = (y * width * CHANNEL_COUNT + i * CHANNEL_COUNT) as usize;
                    sum_red += image[pixel_index] as f32;
                    sum_green += image[pixel_index + 1] as f32;
                    sum_blue += image[pixel_index + 2] as f32;
                }
            }
            (sum_red, sum_green, sum_blue)
        };

        let begin_index = (y * width * CHANNEL_COUNT) as usize;
        let begin_pixel_red = image[begin_index] as f32;
        let begin_pixel_green = image[begin_index + 1] as f32;
        let begin_pixel_blue = image[begin_index + 2] as f32;

        let end_index = (y * width * CHANNEL_COUNT + (width - 1) * CHANNEL_COUNT) as usize;
        let end_pixel_red = image[end_index] as f32;
        let end_pixel_green = image[end_index + 1] as f32;
        let end_pixel_blue = image[end_index + 2] as f32;

        for x in 0..width {
            let current_pixel = (y * width * CHANNEL_COUNT + x * CHANNEL_COUNT) as usize;

            blur_image[current_pixel] = (sum_red * scale).round() as u8;
            blur_image[current_pixel + 1] = (sum_green * scale).round() as u8;
            blur_image[current_pixel + 2] = (sum_blue * scale).round() as u8;

            if x + radius + 1 >= width as i32 && x - radius < 0 {
                sum_red += end_pixel_red - begin_pixel_red;
                sum_green += end_pixel_green - begin_pixel_green;
                sum_blue += end_pixel_blue - begin_pixel_blue;
            } else if x + radius + 1 >= width as i32 {
                let pixel_index =
                    (y * width * CHANNEL_COUNT + (x - radius) * CHANNEL_COUNT) as usize;

                sum_red += end_pixel_red - image[pixel_index] as f32;
                sum_green += end_pixel_green - image[pixel_index + 1] as f32;
                sum_blue += end_pixel_blue - image[pixel_index + 2] as f32;
            } else if x - radius < 0 {
                let pixel_index =
                    (y * width * CHANNEL_COUNT + (x + radius + 1) * CHANNEL_COUNT) as usize;

                sum_red += image[pixel_index] as f32 - begin_pixel_red;
                sum_green += image[pixel_index + 1] as f32 - begin_pixel_green;
                sum_blue += image[pixel_index + 2] as f32 - begin_pixel_blue;
            } else {
                let last_pixel_index =
                    (y * width * CHANNEL_COUNT + (x + radius + 1) * CHANNEL_COUNT) as usize;
                let first_pixel_index =
                    (y * width * CHANNEL_COUNT + (x - radius) * CHANNEL_COUNT) as usize;

                sum_red += image[last_pixel_index] as f32 - image[first_pixel_index] as f32;
                sum_green +=
                    image[last_pixel_index + 1] as f32 - image[first_pixel_index + 1] as f32;
                sum_blue +=
                    image[last_pixel_index + 2] as f32 - image[first_pixel_index + 2] as f32;
            }
        }
    }
}

pub fn naive_box_filter_mut(filter: MeanKernel, image: &mut RgbaImage) {
    let (width, height) = image.dimensions();

    // want the truncated value of this division, hence not using float
    let filter_radius: i32 = filter.size() as i32 / 2;

    let mut horizontal_blur_image: RgbaImage = ImageBuffer::new(width, height);

        // blur horizontally
    for y in 0..height {
        for x in 0..width {
            let mut sum_red: f32 = 0.0;
            let mut sum_green: f32 = 0.0;
            let mut sum_blue: f32 = 0.0;
            let begin: i32 = x as i32 - filter_radius;
            let end: i32 = x as i32 + filter_radius;  
            // virtually loops through filter and image
            // doesn't actually access the filter because everything is 1
            for i in begin..=end {
                if i < 0 {
                    sum_red += image.get_pixel(x, y).0[0] as f32; 
                    sum_green += image.get_pixel(x, y).0[1] as f32; 
                    sum_blue += image.get_pixel(x, y).0[2] as f32; 
                } else if i >= width as i32 {
                    sum_red += image.get_pixel(x, y).0[0] as f32; 
                    sum_green += image.get_pixel(x, y).0[1] as f32; 
                    sum_blue += image.get_pixel(x, y).0[2] as f32; 
                } else {
                    sum_red += image.get_pixel(i as u32, y).0[0] as f32;
                    sum_green += image.get_pixel(i as u32, y).0[1] as f32;
                    sum_blue += image.get_pixel(i as u32, y).0[2] as f32;
                }
            }
            horizontal_blur_image.get_pixel_mut(x, y).0[0] = (sum_red as f32 / filter.size() as f32).round() as u8; 
            horizontal_blur_image.get_pixel_mut(x, y).0[1] = (sum_green as f32 / filter.size() as f32).round() as u8; 
            horizontal_blur_image.get_pixel_mut(x, y).0[2] = (sum_blue as f32 / filter.size() as f32).round() as u8; 
        }
    }

    // blur vertically
    for y in 0..height {
        for x in 0..width {
            let mut sum_red: f32 = 0.0;
            let mut sum_green: f32 = 0.0;
            let mut sum_blue: f32 = 0.0;
            let begin: i32 = y as i32 - filter_radius;
            let end: i32 = y as i32 + filter_radius;  
            for i in begin..=end {
                if i < 0 {
                    sum_red += horizontal_blur_image.get_pixel(x, y).0[0] as f32; 
                    sum_green += horizontal_blur_image.get_pixel(x, y).0[1] as f32; 
                    sum_blue += horizontal_blur_image.get_pixel(x, y).0[2] as f32; 
                } else if i >= height as i32 {
                    sum_red += horizontal_blur_image.get_pixel(x, y).0[0] as f32; 
                    sum_green += horizontal_blur_image.get_pixel(x, y).0[1] as f32; 
                    sum_blue += horizontal_blur_image.get_pixel(x, y).0[2] as f32; 
                } else {
                    sum_red += horizontal_blur_image.get_pixel(x, i as u32).0[0] as f32;
                    sum_green += horizontal_blur_image.get_pixel(x, i as u32).0[1] as f32;
                    sum_blue += horizontal_blur_image.get_pixel(x, i as u32).0[2] as f32;
                }
            }
            image.get_pixel_mut(x, y).0[0] = (sum_red as f32 / filter.size() as f32).round() as u8; 
            image.get_pixel_mut(x, y).0[1] = (sum_green as f32 / filter.size() as f32).round() as u8; 
            image.get_pixel_mut(x, y).0[2] = (sum_blue as f32 / filter.size() as f32).round() as u8; 
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_fast_box_blur() {
        let mut image = image::open("./images/england-hampton-court-palace.jpg")
            .expect("image not found")
            .to_rgba();
        let mut fast_image = image.clone();

        let size = 3;
        box_filter_mut(MeanKernel::new(size), &mut fast_image);

        for (naive, fast) in image.pixels().zip(fast_image.pixels()) {
            assert_eq!(naive[0], fast[0]);
            assert_eq!(naive[1], fast[1]);
            assert_eq!(naive[2], fast[2]);
        }
    }
}

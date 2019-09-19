use image::{GrayImage, ImageBuffer};

use crate::clamp;
use crate::pixel_ops::threshold_mut;

// implement a sobel inner x and inner y version of sobel_x
// and sobel_y functions to reuse the buffer created in each 
// of those functions so time isn't spent creating a new 
// temporary buffer for the output of each filter pass
pub fn sobel_mut(image: &mut GrayImage) {

    let mut image_copy = image.clone();
    let mut new_pixel: f32 = 0.0;
    
    sobel_y(image);
    sobel_x(&mut image_copy);

    for (sobel_y, sobel_x) in image.pixels_mut().zip(image_copy.pixels()) {
        new_pixel = (sobel_x[0] as f32).powi(2) + (sobel_y[0] as f32).powi(2);
        sobel_y[0] = new_pixel.sqrt() as u8;
    }
}

pub fn sobel_x(image: &mut GrayImage) {
    let kernel_one: [i32; 3] = [1, 0, -1];
    let kernel_two = [1, 2, 1];

    let (width, height) = image.dimensions();

    let mut kernel_image: GrayImage = ImageBuffer::new(width, height);
    let mut sum: i32 = 0;
    for y in 0..height {
        for x in 0..width {
            // x - radius
            let begin = x as i32 - 1;
            // x + radius
            let end = x as i32 + 1;
            for (i, kernel_val) in (begin..=end).zip(kernel_one.iter()) {
                if i < 0 {
                    sum += image.get_pixel(x, y).0[0] as i32 * kernel_val;
                } else if i >= width as i32 {
                    sum += image.get_pixel(x, y).0[0] as i32 * kernel_val;
                } else {
                    sum += image.get_pixel(i as u32, y).0[0] as i32 * kernel_val;
                }
            }
            kernel_image.get_pixel_mut(x, y).0[0] = sum.abs() as u8;

            sum = 0;
        }
    }

    // vertical kernel
    sum = 0;
    for y in 0..height{
        for x in 0..width {
            // x - radius
            let begin = y as i32 - 1;
            // x + radius
            let end = y as i32 + 1;
            for (i, kernel_val) in (begin..=end).zip(kernel_two.iter()) {
                if i < 0 {
                    sum += kernel_image.get_pixel(x, y).0[0] as i32 * kernel_val;
                } else if i >= height as i32 {
                    sum += kernel_image.get_pixel(x, y).0[0] as i32 * kernel_val;
                } else {
                    sum += kernel_image.get_pixel(x, i as u32).0[0] as i32 * kernel_val;
                }
            }
            image.get_pixel_mut(x, y).0[0] = clamp(sum, 0, 255) as u8;

            sum = 0;
        }
    }
}

pub fn sobel_y(image: &mut GrayImage) {
    let kernel_one: [i32; 3] = [1, 0, -1];
    let kernel_two = [1, 2, 1];

    let (width, height) = image.dimensions();
    let mut kernel_image: GrayImage = ImageBuffer::new(width, height);

    let mut sum: i32 = 0;

    // horizontal convolution
    for y in 0..height {
        for x in 0..width {
            // x - radius
            let begin = x as i32 - 1;
            // x + radius
            let end = x as i32 + 1;
            for (i, kernel_val) in (begin..=end).zip(kernel_two.iter()) {
                if i < 0 {
                    sum += image.get_pixel(x, y).0[0] as i32 * kernel_val;
                } else if i >= width as i32 {
                    sum += image.get_pixel(x, y).0[0] as i32 * kernel_val;
                } else {
                    sum += image.get_pixel(i as u32, y).0[0] as i32 * kernel_val;
                }
            }
            kernel_image.get_pixel_mut(x, y).0[0] = clamp(sum, 0, 255) as u8;

            sum = 0;
        }
    }

    sum = 0;
    // vertical convolution 
    for y in 0..height{
        for x in 0..width {
            // x - radius
            let begin = y as i32 - 1;
            // x + radius
            let end = y as i32 + 1;
            for (i, kernel_val) in (begin..=end).zip(kernel_one.iter()) {
                if i < 0 {
                    sum += kernel_image.get_pixel(x, y).0[0] as i32 * kernel_val;
                } else if i >= height as i32 {
                    sum += kernel_image.get_pixel(x, y).0[0] as i32 * kernel_val;
                } else {
                    sum += kernel_image.get_pixel(x, i as u32).0[0] as i32 * kernel_val;
                }
            }
            image.get_pixel_mut(x, y).0[0] = sum.abs() as u8;

            sum = 0;
        }
    }
}
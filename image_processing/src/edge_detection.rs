use image::{GrayImage, ImageBuffer};

use crate::clamp;
use crate::pixel_ops::threshold_mut;

pub fn sobel_mut(image: &mut GrayImage) {

    // sobel_x(image);
    sobel_y(image);
    threshold_mut(image, 80);
    // kernel_x_image
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
            // kernel_x_image.get_pixel_mut(x, y).0[0] = clamp(sum.abs(), 0, 255) as u8;
            kernel_image.get_pixel_mut(x, y).0[0] = clamp(sum.abs(), 0, 255) as u8;
            // kernel_x_image.get_pixel_mut(x, y).0[0] = sum.abs() as u8;

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
            // image.get_pixel_mut(x, y).0[0] = clamp(sum.abs(), 0, 255) as u8;

            sum = 0;
        }
    }
    // kernel_x_image
}
pub fn sobel_y(image: &mut GrayImage) {
    let kernel_one: [i32; 3] = [1, 0, -1];
    let kernel_two = [1, 2, 1];

    let (width, height) = image.dimensions();
    let mut kernel_image: GrayImage = ImageBuffer::new(width, height);
    let mut sum: i32 = 0;
    // kernel y convolution with kernel two
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
            // kernel_x_image.get_pixel_mut(x, y).0[0] = sum.abs() as u8;

            sum = 0;
        }
    }

    sum = 0;
    // kernel y convolution with kernel one 
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
            image.get_pixel_mut(x, y).0[0] = clamp(sum.abs(), 0, 255) as u8;
            // image.get_pixel_mut(x, y).0[0] = sum as u8;
            // image.get_pixel_mut(x, y).0[0] = clamp(sum.abs(), 0, 255) as u8;

            sum = 0;
        }
    }
}
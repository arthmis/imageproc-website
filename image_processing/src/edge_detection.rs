use image::GenericImageView;
use image::{GrayImage, ImageBuffer};

use crate::clamp;
use crate::matrix_ops::matrix_transpose;
use crate::pixel_ops::threshold_mut;

pub fn normal_sobel_mut(image: &mut GrayImage, threshold: u8) {
    let mut image_copy = image.clone();
    let (width, height) = image.dimensions();

    let mut output_image: GrayImage = ImageBuffer::new(width, height);
    sobel_y_inner(image, &mut output_image);
    sobel_x_inner(&mut image_copy, &mut output_image);

    for (sobel_y, sobel_x) in image.pixels_mut().zip(image_copy.pixels()) {
        sobel_y[0] = ((sobel_x[0] as f32).powi(2) + (sobel_y[0] as f32).powi(2)).sqrt() as u8;
    }
    threshold_mut(image, threshold);
}
pub fn sobel_mut(image: &mut GrayImage, threshold: u8) {
    let mut image_copy = image.clone();
    let (width, height) = image.dimensions();

    let mut output_image: GrayImage = ImageBuffer::new(width, height);

    let kernel_one: [i32; 3] = [1, 0, -1];
    let kernel_two = [1, 2, 1];

    let (width, height) = (width as i32, height as i32);

    // sobel horizontal edge detection
    sobel_horizontal_pass(kernel_one, &*image, &mut output_image, width, height);

    matrix_transpose(&output_image, image, width as usize, height as usize);

    sobel_vertical_pass(kernel_two, &*image, &mut output_image, height, width);

    matrix_transpose(&output_image, image, height as usize, width as usize);

    // sobel vertical edge detection
    sobel_vertical_pass(kernel_two, &image_copy, &mut output_image, width, height);

    matrix_transpose(
        &output_image,
        &mut image_copy,
        width as usize,
        height as usize,
    );

    sobel_horizontal_pass(kernel_one, &image_copy, &mut output_image, height, width);

    matrix_transpose(
        &output_image,
        &mut image_copy,
        height as usize,
        width as usize,
    );

    for (sobel_y, sobel_x) in image.pixels_mut().zip(image_copy.pixels()) {
        // this is an estimation of the formula for calculating
        // edges so it isn't perfect but it is faster and close enough in output
        sobel_y[0] = (sobel_x[0]) + (sobel_y[0]);
    }
    threshold_mut(image, threshold);
}

fn sobel_horizontal_pass(
    kernel: [i32; 3],
    image: &[u8],
    output_image: &mut [u8],
    width: i32,
    height: i32,
) {
    assert!(
        (width * height) as usize == image.len(),
        "width * height not equal image.len(): width: {}, height: {}, width * height: {}, image length: {}", 
        width,
        height,
        width * height,
        image.len()
    );
    assert!(
        image.len() == output_image.len(),
        "image length: {}, output_image length: {}",
        image.len(),
        output_image.len()
    );

    let mut sum: i32 = 0;
    let radius = 1;

    for y in 0..height {
        for x in 0..width {
            let begin = x as i32 - radius;
            let end = x as i32 + radius;
            for (i, kernel_val) in (begin..=end).zip(kernel.iter()) {
                if i < 0 {
                    sum += image[(y * width + x) as usize] as i32 * kernel_val;
                } else if i >= width as i32 {
                    sum += image[(y * width + x) as usize] as i32 * kernel_val;
                } else {
                    sum += image[(y * width + i) as usize] as i32 * kernel_val;
                }
            }

            output_image[(y * width + x) as usize] = sum.abs() as u8;

            sum = 0;
        }
    }
}
fn sobel_vertical_pass(
    kernel: [i32; 3],
    image: &[u8],
    output_image: &mut [u8],
    width: i32,
    height: i32,
) {
    assert!(
        (width * height) as usize == image.len(),
        "width * height not equal image.len(): width: {}, height: {}, width * height: {}, image length: {}", 
        width,
        height,
        width * height,
        image.len()
    );
    assert!(
        image.len() == output_image.len(),
        "image length: {}, output_image length: {}",
        image.len(),
        output_image.len()
    );

    let mut sum: i32 = 0;
    let radius = 1;

    for y in 0..height {
        for x in 0..width {
            let begin = x as i32 - radius;
            let end = x as i32 + radius;
            for (i, kernel_val) in (begin..=end).zip(kernel.iter()) {
                if i < 0 {
                    sum += image[(y * width + x) as usize] as i32 * kernel_val;
                } else if i >= width as i32 {
                    sum += image[(y * width + x) as usize] as i32 * kernel_val;
                } else {
                    sum += image[(y * width + i) as usize] as i32 * kernel_val;
                }
            }

            output_image[(y * width + x) as usize] = clamp(sum, 0, 255) as u8;

            sum = 0;
        }
    }
}

fn sobel_x_inner(image: &mut GrayImage, kernel_image: &mut GrayImage) {
    // assert!(
    //     image.len() == kernel_image.len(),
    //     "image length: {}, output_image length: {}",
    //     image.len(),
    //     kernel_image.len()
    // );

    let kernel_one: [i32; 3] = [1, 0, -1];
    let kernel_two = [1, 2, 1];

    let (width, height) = image.dimensions();

    let mut sum: i32 = 0;
    let radius = 1;
    for y in 0..height {
        for x in 0..width {
            let begin = x as i32 - radius;
            let end = x as i32 + radius;
            for (i, kernel_val) in (begin..=end).zip(kernel_one.iter()) {
                if i < 0 {
                    unsafe {
                        sum += image.unsafe_get_pixel(x, y).0[0] as i32 * kernel_val;
                    }
                } else if i >= width as i32 {
                    unsafe {
                        sum += image.unsafe_get_pixel(x, y).0[0] as i32 * kernel_val;
                    }
                } else {
                    unsafe {
                        sum += image.unsafe_get_pixel(i as u32, y).0[0] as i32 * kernel_val;
                    }
                }
            }
            kernel_image.get_pixel_mut(x, y).0[0] = sum.abs() as u8;

            sum = 0;
        }
    }

    // vertical kernel
    sum = 0;
    for y in 0..height {
        for x in 0..width {
            let begin = y as i32 - radius;
            let end = y as i32 + radius;
            for (i, kernel_val) in (begin..=end).zip(kernel_two.iter()) {
                if i < 0 {
                    unsafe {
                        sum += kernel_image.unsafe_get_pixel(x, y).0[0] as i32 * kernel_val;
                    }
                } else if i >= height as i32 {
                    unsafe {
                        sum += kernel_image.unsafe_get_pixel(x, y).0[0] as i32 * kernel_val;
                    }
                } else {
                    unsafe {
                        sum += kernel_image.unsafe_get_pixel(x, i as u32).0[0] as i32 * kernel_val;
                    }
                }
            }
            image.get_pixel_mut(x, y).0[0] = clamp(sum, 0, 255) as u8;

            sum = 0;
        }
    }
}

fn sobel_y_inner(image: &mut GrayImage, kernel_image: &mut GrayImage) {
    // assert!(
    //     image.len() == kernel_image.len(),
    //     "image length: {}, output_image length: {}",
    //     image.len(),
    //     kernel_image.len()
    // );

    let kernel_one: [i32; 3] = [1, 0, -1];
    let kernel_two = [1, 2, 1];

    let (width, height) = image.dimensions();

    let mut sum: i32 = 0;

    let radius = 1;

    // horizontal convolution
    for y in 0..height {
        for x in 0..width {
            let begin = x as i32 - radius;
            let end = x as i32 + radius;
            for (i, kernel_val) in (begin..=end).zip(kernel_two.iter()) {
                if i < 0 {
                    unsafe {
                        sum += image.unsafe_get_pixel(x, y).0[0] as i32 * kernel_val;
                    }
                } else if i >= width as i32 {
                    unsafe {
                        sum += image.unsafe_get_pixel(x, y).0[0] as i32 * kernel_val;
                    }
                } else {
                    unsafe {
                        sum += image.unsafe_get_pixel(i as u32, y).0[0] as i32 * kernel_val;
                    }
                }
            }
            kernel_image.get_pixel_mut(x, y).0[0] = clamp(sum, 0, 255) as u8;

            sum = 0;
        }
    }

    sum = 0;
    // vertical convolution
    for y in 0..height {
        for x in 0..width {
            let begin = y as i32 - radius;
            let end = y as i32 + radius;
            for (i, kernel_val) in (begin..=end).zip(kernel_one.iter()) {
                if i < 0 {
                    unsafe {
                        sum += kernel_image.unsafe_get_pixel(x, y).0[0] as i32 * kernel_val;
                    }
                } else if i >= height as i32 {
                    unsafe {
                        sum += kernel_image.unsafe_get_pixel(x, y).0[0] as i32 * kernel_val;
                    }
                } else {
                    unsafe {
                        sum += kernel_image.unsafe_get_pixel(x, i as u32).0[0] as i32 * kernel_val;
                    }
                }
            }
            image.get_pixel_mut(x, y).0[0] = sum.abs() as u8;

            sum = 0;
        }
    }
}

// fn sobel_horizontal(image: &mut [u8], output_image: &mut [u8], width: u32, height: u32) {
// nspose(&(*output_image), image, height as usize, width as usize);
// }

pub fn sobel_x(image: &mut GrayImage) {
    let kernel_one: [i32; 3] = [1, 0, -1];
    let kernel_two = [1, 2, 1];

    let (width, height) = image.dimensions();

    let mut kernel_image: GrayImage = ImageBuffer::new(width, height);
    let mut sum: i32 = 0;
    let radius = 1;
    for y in 0..height {
        for x in 0..width {
            let begin = x as i32 - radius;
            let end = x as i32 + radius;
            for (i, kernel_val) in (begin..=end).zip(kernel_one.iter()) {
                if i < 0 {
                    unsafe {
                        sum += image.unsafe_get_pixel(x, y).0[0] as i32 * kernel_val;
                    }
                } else if i >= width as i32 {
                    unsafe {
                        sum += image.unsafe_get_pixel(x, y).0[0] as i32 * kernel_val;
                    }
                } else {
                    unsafe {
                        sum += image.unsafe_get_pixel(i as u32, y).0[0] as i32 * kernel_val;
                    }
                }
            }
            kernel_image.get_pixel_mut(x, y).0[0] = sum.abs() as u8;

            sum = 0;
        }
    }

    // vertical kernel
    sum = 0;
    for y in 0..height {
        for x in 0..width {
            let begin = y as i32 - radius;
            let end = y as i32 + radius;
            for (i, kernel_val) in (begin..=end).zip(kernel_two.iter()) {
                if i < 0 {
                    unsafe {
                        sum += kernel_image.unsafe_get_pixel(x, y).0[0] as i32 * kernel_val;
                    }
                } else if i >= height as i32 {
                    unsafe {
                        sum += kernel_image.unsafe_get_pixel(x, y).0[0] as i32 * kernel_val;
                    }
                } else {
                    unsafe {
                        sum += kernel_image.unsafe_get_pixel(x, i as u32).0[0] as i32 * kernel_val;
                    }
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

    let radius = 1;
    // horizontal convolution
    for y in 0..height {
        for x in 0..width {
            let begin = x as i32 - radius;
            let end = x as i32 + radius;
            for (i, kernel_val) in (begin..=end).zip(kernel_two.iter()) {
                if i < 0 {
                    unsafe {
                        sum += image.unsafe_get_pixel(x, y).0[0] as i32 * kernel_val;
                    }
                } else if i >= width as i32 {
                    unsafe {
                        sum += image.unsafe_get_pixel(x, y).0[0] as i32 * kernel_val;
                    }
                } else {
                    unsafe {
                        sum += image.unsafe_get_pixel(i as u32, y).0[0] as i32 * kernel_val;
                    }
                }
            }
            kernel_image.get_pixel_mut(x, y).0[0] = clamp(sum, 0, 255) as u8;

            sum = 0;
        }
    }

    sum = 0;
    // vertical convolution
    for y in 0..height {
        for x in 0..width {
            let begin = y as i32 - radius;
            let end = y as i32 + radius;
            for (i, kernel_val) in (begin..=end).zip(kernel_one.iter()) {
                if i < 0 {
                    unsafe {
                        sum += kernel_image.unsafe_get_pixel(x, y).0[0] as i32 * kernel_val;
                    }
                } else if i >= height as i32 {
                    unsafe {
                        sum += kernel_image.unsafe_get_pixel(x, y).0[0] as i32 * kernel_val;
                    }
                } else {
                    unsafe {
                        sum += kernel_image.unsafe_get_pixel(x, i as u32).0[0] as i32 * kernel_val;
                    }
                }
            }
            image.get_pixel_mut(x, y).0[0] = sum.abs() as u8;

            sum = 0;
        }
    }
}

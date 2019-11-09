use image;
use image::{GenericImageView, GenericImage, ImageBuffer, RgbaImage};
use image_processing::window::*;

fn main() {

    let (image_width, image_height) = (1024, 100);
    // let (window_width, window_height) = (1024, 800);
    let (window_width, window_height) = (500, 500);

    // let mut image: RgbaImage = ImageBuffer::new(image_width, image_height); 

    // let arr = {
    //     let mut arra: [u8; 32] = [0_u8; 32];
    //     for i in (1..32){
    //         arra[i] = (i as u32 * 8 - 1) as u8;
    //     }
    //     arra
    // };

    // let block_size = 32;
    // let blocks = 1024 / block_size;

    // let mut block_begin = 0;
    // for val in arr.iter() {
    //     for y in 0..image_height {
    //         for x in (block_begin..block_begin + block_size) {
    //             image[(x, y)][0] = *val;
    //             image[(x, y)][1] = *val;
    //             image[(x, y)][2] = *val;
    //             image[(x, y)][3] = 255;
    //         }
    //     }
    //     block_begin = block_begin + blocks;
    // }


    // let max = 255.0;

    // let mut gamma_encoded = image.clone();
    // for pixel in gamma_encoded.pixels_mut() {
    //     pixel[0] = ((pixel[0] as f32 / max).powf(2.2)* max).round() as u8;
    //     pixel[1] = ((pixel[1] as f32 / max).powf(2.2) * max).round() as u8;
    //     pixel[2] = ((pixel[2] as f32 / max).powf(2.2) * max).round() as u8;
    // }

    // let mut gamma_decoded = image.clone();
    // for pixel in gamma_decoded.pixels_mut() {
    //     pixel[0] = ((pixel[0] as f32 / max).powf(1.0 / 2.2)* max).round() as u8;
    //     pixel[1] = ((pixel[1] as f32 / max).powf(1.0 / 2.2) * max).round() as u8;
    //     pixel[2] = ((pixel[2] as f32 / max).powf(1.0 / 2.2) * max).round() as u8;
    // }

    // // display_image("image", &image, window_width, window_height);
    // display_multiple_images(
    //     &["image", "gamma encoded", "gamma decoded"],
    //     &[&image, &gamma_encoded, &gamma_decoded],
    //     window_width,
    //     window_height,
    // );

    let (image_width, image_height) = (400, 400);

    let mut three_images: RgbaImage = ImageBuffer::new(1600, 600);
    for pixel in three_images.pixels_mut() {
        pixel[0] = 255;
        pixel[1] = 255;
        pixel[2] = 255;
        pixel[3] = 255;
    }
    let mut image: RgbaImage = ImageBuffer::new(image_width, image_height);
    let mut second_image: RgbaImage = ImageBuffer::new(image_width, image_height);
    let mut third_image: RgbaImage = ImageBuffer::new(image_width, image_height);

    let max: f32 = 255.0;

    let first_image_pixel = ((200.0 / max).powf(1.0 / 2.2)* max).round() as u8;
    let mut first_sub_image = three_images.sub_image(100, 100, 400, 400);

    for y in 0..first_sub_image.height() {
        for x in 0..first_sub_image.width() {
            let pixel = first_sub_image.get_pixel_mut(x, y);
            pixel[0] = first_image_pixel;
            pixel[1] = first_image_pixel;
            pixel[2] = first_image_pixel;
            pixel[3] = 255;
        }
    }


    let second_image_pixel = ((100.0 / max).powf(1.0 / 2.2)* max).round() as u8;
    let mut second_sub_image = three_images.sub_image(600, 100, 400, 400);
    for y in 0..second_sub_image.height() {
        for x in 0..second_sub_image.width() {
            let pixel = second_sub_image.get_pixel_mut(x, y);
            pixel[0] = second_image_pixel;
            pixel[1] = second_image_pixel;
            pixel[2] = second_image_pixel;
            pixel[3] = 255;
        }
    }

    let third_image_pixel: f32 = ((100.0 / max).powf(1.0 / 2.2) * max).round();
    let third_image_pixel: u8 = ((third_image_pixel / max).powf(1.0 / 2.2) * max).round() as u8;
    let mut third_sub_image = three_images.sub_image(1100, 100, 400, 400);
    for y in 0..third_sub_image.height() {
        for x in 0..third_sub_image.width() {
            let pixel = third_sub_image.get_pixel_mut(x, y);
            pixel[0] = third_image_pixel;
            pixel[1] = third_image_pixel;
            pixel[2] = third_image_pixel;
            pixel[3] = 255;
        }
    }

    // println!(
    //     "first {}\nsecond {}\nthird {}",
    //     first_image_pixel,
    //     second_image_pixel,
    //     third_image_pixel,
    // );

    // display_image("three images", &three_images, window_width, window_height);
    three_images.save("./images/perceptual_brightness.jpeg").unwrap();
    // display_multiple_images(
    //     &["image", "second image", "third image"],
    //     &[&image, &second_image, &third_image], 
    //     window_width, 
    //     window_height
    // ); 
}

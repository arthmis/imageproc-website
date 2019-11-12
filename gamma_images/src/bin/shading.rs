use image;
use image::{GenericImageView, GenericImage, ImageBuffer, RgbaImage};
use image_processing::window::*;

fn main() {

    let (image_width, image_height) = (1024, 100);
    let (window_width, window_height) = (500, 500);

    let mut image: RgbaImage = ImageBuffer::new(image_width, image_height); 

    let arr = {
        let mut arra: [u8; 32] = [0_u8; 32];
        for i in (1..32){
            arra[i] = (i as u32 * 8 - 1) as u8;
        }
        arra
    };

    let block_size = 32;
    let blocks = 1024 / block_size;

    let mut block_begin = 0;
    for val in arr.iter() {
        for y in 0..image_height {
            for x in (block_begin..block_begin + block_size) {
                image[(x, y)][0] = *val;
                image[(x, y)][1] = *val;
                image[(x, y)][2] = *val;
                image[(x, y)][3] = 255;
            }
        }
        block_begin = block_begin + blocks;
    }


    let max = 255.0;

    // let mut gamma_decoded = image.clone();
    // for pixel in gamma_decoded.pixels_mut() {
    //     pixel[0] = ((pixel[0] as f32 / max).powf(2.2)* max).round() as u8;
    //     pixel[1] = ((pixel[1] as f32 / max).powf(2.2) * max).round() as u8;
    //     pixel[2] = ((pixel[2] as f32 / max).powf(2.2) * max).round() as u8;
    // }

    let mut gamma_encoded = image.clone();
    for pixel in gamma_encoded.pixels_mut() {
        pixel[0] = ((pixel[0] as f32 / max).powf(1.0 / 2.2)* max).round() as u8;
        pixel[1] = ((pixel[1] as f32 / max).powf(1.0 / 2.2) * max).round() as u8;
        pixel[2] = ((pixel[2] as f32 / max).powf(1.0 / 2.2) * max).round() as u8;
    }

    // image.save("./frontend/images/linear_image.jpeg");
    // gamma_encoded.save("./frontend/images/gamma_encoded_image.jpeg");
    // display_image("image", &image, window_width, window_height);
    display_multiple_images(
        &["image", "gamma encoded"],
        &[&image, &gamma_encoded,],
        window_width,
        window_height,
    );
}
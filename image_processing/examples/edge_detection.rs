use image_processing::window::*;
use image_processing::edge_detection::*;
use image::ConvertBuffer;
use image_processing::pixel_ops::threshold_mut;

fn main() {
    let image = image::open("../images/england-hampton-court-palace.jpg")
        .expect("image not found")
        .to_luma();

    let (width, height) = (800, 800);
    let mut x_image = image.clone();
    let mut y_image = image.clone();

    sobel_x(&mut x_image);
    sobel_y(&mut y_image);
    let threshold = 70;
    threshold_mut(&mut x_image, threshold);
    threshold_mut(&mut y_image, threshold);
    // display_image("sobel", &image.convert(), width, height);
    display_multiple_images( 
        &["image", "sobel x ", "sobel y"], 
        &[&image.convert(), &x_image.convert(), &y_image.convert()], 
        width, 
        height
    );

}
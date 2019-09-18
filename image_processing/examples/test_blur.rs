use image_processing::blur::*;
use image_processing::window::*;
use image::ConvertBuffer;

fn main() {
    let mut image = image::open("../images/england-hampton-court-palace.jpg").expect("image not found").to_luma();
    let filter = MeanKernel::new(5);
    // let blur_image = mean_filter_mut(filter, &mut image);
    mean_filter_mut(filter, &mut image);
    let (width, height) = (800, 800);
    display_image("box filter image", &image.convert(), width, height);
    // display_multiple_images(&["image", "blur"], &[&image.convert(), &blur_image.convert()], width, height);

}
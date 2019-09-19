use image_processing::blur::*;
use image_processing::window::*;
use image::ConvertBuffer;

fn main() {
    let image = image::open("../images/england-hampton-court-palace.jpg")
        .expect("image not found")
        .to_luma();

    let (width, height) = (800, 800);

    let mut gauss_image = image.clone();
    let mut box_image = image.clone();

    let filter = MeanKernel::new(9);
    let gauss_filter = GaussianKernel::new(2);

    mean_filter_mut(filter, &mut box_image);
    gaussian_filter_mut(gauss_filter, &mut gauss_image);

    display_multiple_images(
        &["image", "box", "gauss"], 
        &[&image.convert(), &box_image.convert(), &gauss_image.convert()], 
        width, 
        height
    );

}
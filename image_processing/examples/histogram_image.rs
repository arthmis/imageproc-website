extern crate image;
extern crate image_processing;

use image_processing::histogram::*;
// use image::RgbaImage;
use image_processing::window::*;
    
fn main() {
    let image = image::open("../images/england-hampton-court-palace.jpg").expect("image not found").to_rgba();
    let histogram = LumaHistogram::from_rgba_image(&image);
    let hist_image = convert_to_image(256, 256, &histogram);
    let (width, height) = (800, 800);
    display_image("histogram image", &hist_image, width, height);

}
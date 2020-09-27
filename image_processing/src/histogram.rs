use image::{ImageBuffer, Rgba, RgbaImage};

pub struct RgbHistogram {
    pub red: [u32; 256],
    pub green: [u32; 256],
    pub blue: [u32; 256],
}

impl RgbHistogram {
    pub fn from_rgba_image(image: &RgbaImage) -> Self {
        let mut histogram = RgbHistogram {
            red: [0; 256],
            green: [0; 256],
            blue: [0; 256],
        };
        for pixel in image.pixels() {
            histogram.red[pixel[0] as usize] += 1;
            histogram.green[pixel[1] as usize] += 1;
            histogram.blue[pixel[2] as usize] += 1;
        }
        histogram
    }
}
pub struct LumaHistogram {
    pub values: [u32; 256],
}
impl LumaHistogram {
    pub fn from_rgba_image(image: &RgbaImage) -> Self {
        let mut histogram = LumaHistogram { values: [0; 256] };
        for pixel in image.pixels() {
            let red = pixel[0] as f32 * 0.299;
            let green = pixel[1] as f32 * 0.587;
            let blue = pixel[2] as f32 * 0.114;
            let gray_value = red as u8 + green as u8 + blue as u8;
            histogram.values[gray_value as usize] += 1;
        }
        histogram
    }
}

pub fn convert_to_image(
    image_width: u32,
    image_height: u32,
    gray_hist: &LumaHistogram,
) -> RgbaImage {
    let hist_color = { Rgba([90, 90, 90, 255]) };
    let max_hist_val: u32 = { *(gray_hist.values.iter().max().unwrap()) };
    dbg!(max_hist_val);

    let channel_count = 4;
    let raw_image_buffer = vec![255; (image_width * image_height * channel_count) as usize];
    let mut image: RgbaImage = ImageBuffer::from_raw(image_width, image_height, raw_image_buffer)
        .expect("white image could not be created");

    // let histogram_height_max: u32 = image_height / 256 * 256;
    let histogram_height_max: u8 = 255;

    // determines how many pixels a pixel value will take up horizontally
    // let step: u32 = image_width / 256;
    // let hist_width: u32 = 256;
    // let hist_begin: u32 = 0;
    let normalized_histogram = {
        let mut norm_hist: [u8; 256] = [0; 256];
        for (norm_value, hist_value) in norm_hist.iter_mut().zip(gray_hist.values.iter()) {
            *norm_value = (255.0 * *hist_value as f32 / max_hist_val as f32).round() as u8;
        }
        norm_hist
    };

    for y in 0..image.height() {
        for x in 0..image.width() {
            let n: u8 = histogram_height_max - normalized_histogram[x as usize];
            if y >= n as u32 {
                image.put_pixel(x, y, hist_color);
            }
        }
    }
    // for i in 0..256 {
    //     let mut y: u32 = histogram_height_max as u32 * gray_hist.values[i] / max_hist_val;
    //     y = histogram_height_max as u32 - y;
    //     let x_pos: u32 = i as u32;
    //     for s in 0..step {
    //         let x: u32 = x_pos + s as u32;
    //         for n in y..255 {
    //             image.put_pixel(x, n as u32, hist_color);
    //         }
    //     }
    // }
    // use image::imageops::resize;
    // use image::FilterType;
    // resize(&image, 500, 500, FilterType::Triangle)
    image
}

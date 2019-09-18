// use image::RgbaImage;
use image::GrayImage;
use image::ImageBuffer;

// otherwise known as a box filter
pub struct MeanKernel {
    pub size: u32,
    pub horizontal: Vec<u8>,
    pub vertical: Vec<u8>,
}

impl MeanKernel {
    pub fn new(size: u32) -> Self {
        assert!(size % 2 != 0, "Size needs to be odd. Size was: {}", size);
        MeanKernel {
            size,
            horizontal: vec![1; size as usize],
            vertical: vec![1; size as usize],
        }
    }
}

pub fn mean_filter_mut(filter: MeanKernel, image: &mut GrayImage) {
    let horizontal = filter.horizontal.as_slice();

    let (width, height) = image.dimensions();

    let mut horizontal_blur_image: GrayImage = ImageBuffer::new(width, height);
    // want the floor of this division, hence not using float
    let filter_radius: i32 = horizontal.len() as i32 / 2;
    let filter_size = horizontal.len();

    // blur horizontally
    for y in 0..height {
        for x in 0..width {
            let mut sum: u32 = 0;
            let begin: i32 = x as i32 - filter_radius;
            let end: i32 = x as i32 + filter_radius;  
            for i in begin..=end {
                if i < 0 {
                    sum += image.get_pixel(x, y).0[0] as u32; 
                } else if i >= width as i32 {
                    sum += image.get_pixel(x, y).0[0] as u32; 
                } else {
                    sum += image.get_pixel(i as u32, y).0[0] as u32;
                }
            }
            horizontal_blur_image.get_pixel_mut(x, y).0[0] = (sum as f32 / filter_size as f32) as u8; 
        }
    }

    // blur vertically
    for y in 0..height {
        for x in 0..width {
            let mut sum: u32 = 0;
            let begin: i32 = y as i32 - filter_radius;
            let end: i32 = y as i32 + filter_radius;  
            for i in begin..=end {
                if i < 0 {
                    sum += horizontal_blur_image.get_pixel(x, y).0[0] as u32; 
                } else if i >= height as i32 {
                    sum += horizontal_blur_image.get_pixel(x, y).0[0] as u32; 
                } else {
                    sum += horizontal_blur_image.get_pixel(x, i as u32).0[0] as u32;
                }
            }
            image.get_pixel_mut(x, y).0[0] = (sum as f32 / filter_size as f32) as u8; 
        }
    }

}


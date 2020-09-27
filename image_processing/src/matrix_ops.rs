use image::GrayImage;
use image::RgbaImage;
pub fn transpose(image: &RgbaImage, transpose: &mut RgbaImage) {
    let (width, height) = image.dimensions();

    for y in 0..height {
        for x in 0..width {
            let pixel = image.get_pixel(x, y);
            let transpose_pixel = transpose.get_pixel_mut(y, x);
            *transpose_pixel = *pixel;
        }
    }
}
pub fn transpose_gray(image: &GrayImage, transpose: &mut GrayImage) {
    assert!(image.len() == transpose.len());
    let (width, height) = image.dimensions();
    // let (width, height) = (width as usize, height as usize);

    // let image: &[u8] = &*image;
    // let transpose: &mut [u8] = &mut *transpose;

    for y in 0..height {
        for x in 0..width {
            // transpose[x * height + y] = image[y * width + x];
            let pixel = image.get_pixel(x, y);
            let transpose_pixel = transpose.get_pixel_mut(y, x);
            *transpose_pixel = *pixel;
        }
    }
}

pub fn transpose_generic<T: Copy>(
    image: &[T],
    out_image: &mut [T],
    width: usize,
    height: usize,
    stride: usize,
) {
    assert!(
        width * height * stride == image.len(),
        "width * height not equal image.len(): {} {}",
        width * height,
        image.len(),
    );
    assert!(
        image.len() == out_image.len(),
        "buf length: {}, out_buf length: {}",
        image.len(),
        out_image.len(),
    );

    for y in 0..height {
        for x in 0..width {
            let image_min_index = (y * width + x) * stride;
            let trans_min_index = (x * height + y) * stride;

            let image_pixel = &image[image_min_index..(image_min_index + stride)];
            let transpose_pixel = &mut out_image[trans_min_index..(trans_min_index + stride)];

            transpose_pixel.copy_from_slice(image_pixel);
        }
    }
}
pub fn transpose_rgba<T: Copy>(image: &[T], out_image: &mut [T], width: usize, height: usize) {
    let stride = 4;
    assert!(
        width * height * stride == image.len(),
        "width * height not equal image.len(): {} {}",
        width * height,
        image.len(),
    );
    assert!(
        image.len() == out_image.len(),
        "buf length: {}, out_buf length: {}",
        image.len(),
        out_image.len(),
    );

    for y in 0..height {
        for x in 0..width {
            let image_min_index = (y * width + x) * stride;
            let trans_min_index = (x * height + y) * stride;

            let image_pixel = &image[image_min_index..(image_min_index + stride)];
            let transpose_pixel = &mut out_image[trans_min_index..(trans_min_index + stride)];

            transpose_pixel[0] = image_pixel[0];
            transpose_pixel[1] = image_pixel[1];
            transpose_pixel[2] = image_pixel[2];
            transpose_pixel[3] = image_pixel[3];
        }
    }
}

pub fn matrix_transpose(buf: &[u8], transpose: &mut [u8], width: usize, height: usize) {
    assert!(
        width * height == buf.len(),
        "width * height not equal buf.len(): {} {}",
        width * height,
        buf.len()
    );
    assert!(
        buf.len() == transpose.len(),
        "buf length: {}, out_buf length: {}",
        buf.len(),
        transpose.len()
    );

    for y in 0..height {
        for x in 0..width {
            transpose[x * height + y] = buf[y * width + x];
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_matrix_transpose() {
        let matrix: [u8; 9] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        let mut output_matrix: [u8; 9] = [0; 9];

        matrix_transpose(&matrix, &mut output_matrix, 3, 3);
        for y in 0..3 {
            for x in 0..3 {
                let first_val = matrix[y * 3 + x];
                let second_val = output_matrix[x * 3 + y];
                assert!(first_val == second_val, "{} {}", first_val, second_val);
            }
        }
    }
    #[test]
    fn test_matrix_transpose_generic() {
        let matrix: [u8; 9] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        let mut output_matrix: [u8; 9] = [0; 9];

        let stride = 1;
        transpose_generic(&matrix, &mut output_matrix, 3, 3, stride);
        for y in 0..3 {
            for x in 0..3 {
                let first_val = matrix[y * 3 + x];
                let second_val = output_matrix[x * 3 + y];
                assert!(first_val == second_val, "{} {}", first_val, second_val);
            }
        }
    }
}

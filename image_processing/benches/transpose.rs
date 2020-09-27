#[macro_use]
extern crate criterion;
extern crate image_processing;

use core::time::Duration;
use criterion::black_box;
use criterion::Criterion;
use image;

use image::ConvertBuffer;
use image::{GrayImage, ImageBuffer, RgbaImage};
use image_processing::matrix_ops::*;

pub fn blur(c: &mut Criterion) {
    let mut group = c.benchmark_group("Transpose");
    group.confidence_level(0.05);
    group.sample_size(30);
    group.measurement_time(Duration::from_secs(120));

    let image = image::open("./images/england-hampton-court-palace.jpg")
        .expect("image not found")
        .to_rgba();
    let (width, height) = image.dimensions();

    let mut first_buffer: RgbaImage = ImageBuffer::new(height, width);

    let gray_image: GrayImage = image.convert();
    let gray_image_copy = gray_image.clone();
    let image_copy: RgbaImage = image.clone();
    let mut second_buffer: RgbaImage = ImageBuffer::new(height, width);
    let stride = 4;

    // group.bench_function("rgba", |b| {
    //     b.iter(|| {
    //         transpose_rgba(
    //             black_box(&image),
    //             black_box(&mut first_buffer),
    //             black_box(width as usize),
    //             black_box(height as usize),
    //         );
    //     });
    // });

    // group.bench_function("transpose generic", move |b| {
    //     b.iter(|| {
    //         transpose_generic(
    //             black_box(&image_copy),
    //             black_box(&mut second_buffer),
    //             black_box(width as usize),
    //             black_box(height as usize),
    //             black_box(stride),
    //         );
    //     });
    // });

    // let mut third_buffer: GrayImage = ImageBuffer::new(height, width);
    // group.bench_function("matrix transpose", move |b| {
    //     b.iter(|| {
    //         matrix_transpose(
    //             black_box(&gray_image),
    //             black_box(&mut third_buffer),
    //             black_box(width as usize),
    //             black_box(height as usize),
    //         );
    //     });
    // });

    let mut fourth_buffer: GrayImage = ImageBuffer::new(height, width);
    // group.bench_function("transpose generic gray", move |b| {
    //     b.iter(|| {
    //         transpose_generic(
    //             black_box(&gray_image_copy),
    //             black_box(&mut fourth_buffer),
    //             black_box(width as usize),
    //             black_box(height as usize),
    //             black_box(1),
    //         );
    //     });
    // });
    group.bench_function("transpose gray", move |b| {
        b.iter(|| {
            transpose_gray(black_box(&gray_image_copy), black_box(&mut fourth_buffer));
        });
    });
    group.finish();
}

criterion_group!(benches, blur);
criterion_main!(benches);

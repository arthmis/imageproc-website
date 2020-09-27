#[macro_use]
extern crate criterion;
extern crate image_processing;

use criterion::black_box;
use criterion::Criterion;

use core::time::Duration;

use image;
use image::ConvertBuffer;
use image::{GrayImage};

use image_processing::edge_detection::*;

pub fn sobel_x_y(c: &mut Criterion) {
    let mut group = c.benchmark_group("Sobel Edge Detector");
    group.confidence_level(0.01);
    group.sample_size(30);
    group.measurement_time(Duration::from_secs(120));

    let image = image::open("./images/england-hampton-court-palace.jpg")
        .expect("image not found")
        .to_rgba();

    let mut luma_image: GrayImage = image.convert();
    let mut luma_image_copy: GrayImage = luma_image.clone();
    let mut fast_sobel_copy: GrayImage = luma_image.clone();
    let mut copy_color_image = image.clone();
    let mut fast_copy_color_image = image.clone();

    group.bench_function("fast Sobel copy", move |b| {
        b.iter(|| {
            sobel_mut(black_box(&mut luma_image), 120);
            for (gray_pixel, color_pixel) in
                luma_image.pixels().zip(fast_copy_color_image.pixels_mut())
            {
                color_pixel[0] = gray_pixel[0];
                color_pixel[1] = gray_pixel[0];
                color_pixel[2] = gray_pixel[0];
            }
        });
    });
    // group.bench_function("Sobel copy", move |b| {
    //     b.iter(|| {
    //         normal_sobel_mut(black_box(&mut luma_image_copy), 120);
    //         for (gray_pixel, color_pixel) in luma_image_copy.pixels().zip(copy_color_image.pixels_mut()) {
    //             color_pixel[0] = gray_pixel[0];
    //             color_pixel[1] = gray_pixel[0];
    //             color_pixel[2] = gray_pixel[0];
    //         }
    //     });
    // });
    // group.bench_function("Sobel normal", move |b| {
    //     b.iter(|| sobel_mut(black_box(&mut luma_image), 120));
    // });
    group.bench_function("Sobel using transposes", move |b| {
        b.iter(|| sobel_mut(black_box(&mut fast_sobel_copy), 120));
    });

    group.finish();
}

pub fn sobel_x_bench(c: &mut Criterion) {
    let mut image = image::open("./images/england-hampton-court-palace.jpg")
        .expect("image not found")
        .to_luma();

    c.bench_function("Sobel x", move |b| {
        b.iter(|| sobel_x(black_box(&mut image)));
    });
}
criterion_group!(benches, sobel_x_y);
criterion_main!(benches);

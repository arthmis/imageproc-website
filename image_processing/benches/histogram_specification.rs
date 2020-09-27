#[macro_use]
extern crate criterion;
extern crate image;
extern crate image_processing;

use criterion::Criterion;
// use criterion::Fun;
use criterion::Benchmark;
use image::GrayAlphaImage;
// use image_processing::pixel_operations::match_piecewise_linear_histogram;
// use image_processing::pixel_operations::match_piecewise_linear_histogram_modified;
use image_processing::pixel_operations::*;
use std::time::Duration;

fn criterion_benchmark(c: &mut Criterion) {
    let img = image::open("images/england-hampton-court-palace.jpg")
        .expect("Image not found")
        .to_luma_alpha();

    let reference_img = image::open("images/empire-state-building.jpg")
        .expect("empire state building jpeg not found")
        .to_luma_alpha();

    let clone = img.clone();
    let reference_clone = reference_img.clone();

    let original = |image: &GrayAlphaImage, reference_image: &GrayAlphaImage| {
        match_piecewise_linear_histogram(image, reference_image);
    };

    // let modified = |image: &GrayAlphaImage, reference_image: &GrayAlphaImage| {
    //     match_piecewise_linear_histogram_modified(image, reference_image);
    let modified = |image: &GrayAlphaImage, reference_image: &GrayAlphaImage| {
        histogram_matching(image, reference_image);
    };
    c.bench(
        "benches",
        Benchmark::new("original", move |b| {
            b.iter(|| {
                original(&img, &reference_img);
            });
        })
        .with_function("modified", move |b| {
            b.iter(|| {
                modified(&clone, &reference_clone);
            })
        }), // .sample_size(200)
    );
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);

#[macro_use]
extern crate criterion;
extern crate image_processing;

use core::time::Duration;
use criterion::black_box;
use criterion::Criterion;
use image;

use image_processing::blur::*;

pub fn blur(c: &mut Criterion) {
    let mut group = c.benchmark_group("Blur");
    group.confidence_level(0.05);
    group.sample_size(30);
    group.measurement_time(Duration::from_secs(120));

    let mut gauss_image = image::open("./images/england-hampton-court-palace.jpg")
        .expect("image not found")
        // .to_luma();
        .to_rgba();

    let mut box_image = gauss_image.clone();
    let mut image_blur = gauss_image.clone();
    let imageproc_blur = gauss_image.clone();

    let gauss = GaussianKernel::new(100);
    let size = 7;
    let box_filter = MeanKernel::new(size);

    group.bench_function("box blur", |b| {
        b.iter(|| {
            box_filter_mut(black_box(box_filter), black_box(&mut box_image));
        });
    });
    // group.bench_function("box blur alternate", |b| {
    //     b.iter(|| {
    //         box_filter_mut_alternate(black_box(box_filter), black_box(&mut image_blur));
    //     });
    // });

    // group.bench_function("Image Gaussian", |b| {
    //     b.iter(|| imageops::blur(black_box(&image_blur), black_box(1.0)));
    // });
    // group.bench_function("ImageProc Gaussian", |b| {
    //     b.iter(|| gaussian_blur_f32(black_box(&imageproc_blur), black_box(3.0)));
    // });

    group.finish();
}

criterion_group!(benches, blur);
criterion_main!(benches);

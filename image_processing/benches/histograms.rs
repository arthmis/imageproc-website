#[macro_use]
extern crate criterion;
extern crate image;
extern crate image_processing;

use criterion::Criterion;
use criterion::Fun;
use image::RgbImage;

struct RgbHistogram {
    red: [u32; 256],
    green: [u32; 256],
    blue: [u32; 256],
}

impl RgbHistogram {
    fn new() -> RgbHistogram {
        RgbHistogram {
            red: [0; 256],
            green: [0; 256],
            blue: [0; 256],
        }
    }
}

fn no_struct_histogram(image: &RgbImage) -> [[u32; 256]; 3] {
    let mut histogram = [[0_u32; 256]; 3];
    for pixel in image.pixels() {
        histogram[0][pixel[0] as usize] += 1;
        histogram[1][pixel[1] as usize] += 1;
        histogram[2][pixel[2] as usize] += 1;
    }
    histogram
}

fn struct_histogram(image: &RgbImage) -> RgbHistogram {
    let mut histogram = RgbHistogram::new();
    for pixel in image.pixels() {
        histogram.red[pixel[0] as usize] += 1;
        histogram.green[pixel[1] as usize] += 1;
        histogram.blue[pixel[2] as usize] += 1;
    }
    histogram
}
fn criterion_benchmark(c: &mut Criterion) {
    let img = image::open("images/england-hampton-court-palace.jpg")
        .expect("Image not found")
        .to_rgb();

    let rgb_struct_histogram = Fun::new("no_struct", move |b, i: &RgbImage| {
        b.iter(|| no_struct_histogram(&i))
    });

    let rgb_no_struct_histogram = Fun::new("struct", move |b, i: &RgbImage| {
        b.iter(|| struct_histogram(&i))
    });

    let functions = vec![rgb_no_struct_histogram, rgb_struct_histogram];
    c.bench_functions("histogram", functions, img);
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);

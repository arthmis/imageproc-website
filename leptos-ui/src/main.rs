mod views;
use leptos::html::{Canvas, Img, Input, ToHtmlElement};
use leptos::leptos_dom::Text;
use leptos::wasm_bindgen::JsCast;
use leptos::{component, create_signal, svg::view, view, IntoView};
use leptos::*;
use log::{error, info};
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement, HtmlImageElement, Url};

#[derive(Debug, Copy, Clone)]
enum Algorithm {
    Gamma,
    Invert,
    BoxBlur,
    SobelEdgeDetector,
    None
}

impl std::fmt::Display for Algorithm {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let text = match self {
            Algorithm::Gamma => "gamma",
            Algorithm::Invert => "invert",
            Algorithm::BoxBlur => "box blur",
            Algorithm::SobelEdgeDetector => "sobel edge detector",
            Algorithm::None => "none",
        };
        write!(f, "{}", text)
    }
}

impl IntoView for Algorithm {
    fn into_view(self) -> View {
        View::Text(Text::new(self.to_string().into()))
    }
}

fn main() {
    console_error_panic_hook::set_once();
    wasm_logger::init(wasm_logger::Config::default());

    // leptos::mount_to_body(|| view! { <p>"Hi"</p> })
    leptos::mount_to_body(|| view! { <App/> } )
}

#[component]
fn App() -> impl IntoView {
    let (algorithm, set_algorithm) = create_signal(Algorithm::None);
    let (image_url, set_image_url) = create_signal("".to_string());
    let file_input_ref = create_node_ref::<Input>();
    let image_ref = create_node_ref::<Img>();
    let canvas_ref = create_node_ref::<Canvas>();
    // let mut image_element = HtmlImageElement::new().unwrap().to_leptos_element();
    // image_element.add_event_listener_with_callback("load", )

    view! {
        <NavBar/>
        <label for="file-selection" class="some-custom-css">
            Select Image
        </label>
        <input
            id="file-selection"
            class=""
            type="file"
            _ref=file_input_ref
            on:change=move |ev| {
                let node = file_input_ref.get().unwrap();
                let image_node = image_ref.get().unwrap();
                let files = node.files().unwrap();
                let file = files.item(0).unwrap();
                info!("{:?}", file.name());
                let image_url_raw = Url::create_object_url_with_blob(&file).unwrap();
                info!("{:?}", & image_url_raw);
                set_image_url(image_url_raw);
                image_node.set_src(&image_url());
                info!("{:?}", image_node.src());
            }

            style="display: none"
        />
        <img
            _ref=image_ref
            src=""
            style="display: none"
            on:load=move |ev| {
                info!("{}", "image loaded");
                let image_node = image_ref.get().unwrap();
                let canvas = canvas_ref.get().unwrap();
                let canvas_context = canvas
                    .get_context("2d")
                    .unwrap()
                    .unwrap()
                    .dyn_into::<CanvasRenderingContext2d>()
                    .unwrap();
                let ((new_width, new_height), (center_x, center_y)) = resize_image_for_canvas(
                    &image_node,
                    &canvas,
                );
                canvas_context
                    .draw_image_with_html_image_element_and_dw_and_dh(
                        &image_node,
                        center_x,
                        center_y,
                        new_width,
                        new_height,
                    )
                    .unwrap();
            }
        />

        <AlgorithmList set_algorithm=set_algorithm/>
        <canvas _ref=canvas_ref id="selected-image"></canvas>
    }

}

fn resize_image_for_canvas(image_node: &HtmlImageElement, canvas: &HtmlCanvasElement) -> ((f64, f64), (f64, f64)) {

    let canvas_offset_width = canvas.offset_width() as f64;
    let canvas_offset_height = canvas.offset_height() as f64;
    let image_width = image_node.width() as f64;
    let image_height = image_node.height() as f64;
    let width_scale = canvas.offset_width() as f64 / image_node.width() as f64;
    let height_scale = canvas.offset_height() as f64 / image_node.height() as f64;
    let scale = if width_scale < height_scale { width_scale } else { height_scale };
    let canvas_width_less_than_image_width = canvas_offset_width < image_width;
    let canvas_height_less_than_image_height = canvas_offset_height < image_height;
    let (new_width, new_height) = if canvas_width_less_than_image_width
        || canvas_height_less_than_image_height
    {
        ((image_width * scale).round(), (image_height * scale).round())
    } else {
        (image_width, image_height)
    };
    let center_x = (canvas_offset_width as f64 - new_width) / 2.0;
    let center_y = (canvas_offset_height as f64 - new_height) / 2.0;

    ((new_width, new_height), (center_x, center_y))
}

#[component]
fn NavBar() -> impl IntoView {
    view! {
        <nav class="navbar">
            <a href="index.html">
                <i class="fa fa-home" aria-hidden="true" style="font-size:2em;"></i>
            </a>

            <a href="https://github.com/arthmis/imageproc-website">
                <i class="fa fa-github" aria-hidden="true" style="font-size:1.4em;"></i>
                Github
            </a>
        </nav>
    }
}

#[component]
fn AlgorithmList(set_algorithm: WriteSignal<Algorithm>) -> impl IntoView {
    let algorithms = vec![
        ("Invert".to_string(), Algorithm::Invert),
        ("Gamma".to_string(), Algorithm::Gamma),
        ("Box Blur".to_string(), Algorithm::BoxBlur),
        ("Sobel Edge Detector".to_string(), Algorithm::SobelEdgeDetector),
    ];

    view! {
        <ul>
            {algorithms
                .into_iter()
                .map(|(item, algorithm)| {
                    view! {
                        <li>
                            <button on:click=move |_| {
                                set_algorithm(algorithm);
                            }>{item}</button>
                        </li>
                    }
                })
                .collect::<Vec<_>>()}
        </ul>
    }
}

// #[component]
// fn AlgorithmView(algorithm: ReadSignal<Algorithm>, view: impl View) -> impl IntoView {
//     view! { <p>{algorithm}</p> }
// }
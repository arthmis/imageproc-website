use leptos::{component, view, IntoView};
use log::{error, info};


#[component]
fn Gamma() -> impl IntoView {

    view! {
        <label for="gamma-slider" class="some-custom-css">
            gamma
        </label>
        <input
            id="gamma-slider"
            class=""
            type="change"
            name="gamma"
            min="0"
            max="5"
            on:change=move |ev| { info!("sliding") }
        />
    }

}
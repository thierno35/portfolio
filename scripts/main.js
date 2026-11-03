window.addEventListener("load", init);

function init() {
    let details = document.querySelector(".details");

    if (details != null) {
        details.addEventListener("click", showDetails);
    }
}

function showDetails(event) {
    let target = event.target;

    target.classList.toggle("hidden");

    let details = document.querySelector(".hidden_details");

    if (details != null) {
        details.classList.toggle("hidden");
    }

    let box = document.querySelector(".box");

    if (box != null) {
        box.classList.toggle("border-2");
        box.classList.toggle("rounded-xl");
        box.classList.toggle("p-3");
    }
}
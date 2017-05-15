let nyaanInitText = "< Nyaan";
let nyaanInitColor = "#80c0a0";

run();
function run() {
    let tweetButton = document.querySelector("button.js-send-button");//jqueryオブジェクトにするとobserve出来ない
    if (tweetButton == null) {
        setTimeout(run, 1500);
        return;
    }

    let tweetButtonContainer = $(".js-send-button-container");
    let filterButton = $("<button></button>", {
        "id": "filter-button",
        "class": "js-send-button js-spinner-button js-show-tip btn btn-positive btn-extra-height is-disabled",
        "text": nyaanInitText,
        "data-original-title": "Nyaan (alt+n)"
    });
    tweetButtonContainer.append(filterButton);
    $(document).keydown(function (e) {
        if (e.keyCode === 78 && e.altKey) {//alt+nキー
            translateToNyaan();
        }
    });
    filterButton.on("click", function () {
        translateToNyaan();
    });
    let tweetButtonObserver = new MutationObserver(function () {
        if (tweetButton.classList.contains("is-disabled")) {
            filterButton.addClass("is-disabled")
            filterButton.text(nyaanInitText)
        } else {
            filterButton.removeClass("is-disabled")
        }
        filterButton.css({"background-color":nyaanInitColor})
    });
    tweetButtonObserver.observe(tweetButton, {
        'attributes': true,
        "attributeFilter": ["class"]
    });

    let tweetTextArea = document.querySelector("textarea.js-compose-text");//jqueryオブジェクトにするとobserve出来ない
    let tweetObserver = new MutationObserver(function () {
        if (tweetTextArea.disabled) {
            filterButton.text("")
        }
        else {
            filterButton.css({"background-color":nyaanInitColor})
            filterButton.text(nyaanInitText)
        }
    })
    tweetObserver.observe(tweetTextArea, {
        "attributes": true,
        "attributeFilter": ["disabled"]
    });
}

function translateToNyaan() {
    if (!$('#filter-button').hasClass('is-disabled')) {
        let tweetTextArea = $('textarea.js-compose-text')[0];
        requestJson(tweetTextArea.value);
    }
}

function requestJson(text) {
    let requestUrl = "https://socialityfilter.takanakahiko.me/?text=" + text;
    let xhr = new XMLHttpRequest();
    let filterButton = $("#filter-button");
    xhr.open("GET", requestUrl, true);
    filterButton.css({"background-color":nyaanInitColor})
    filterButton.text("Nyaaning...")
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status == 200 || xhr.status == 304) {
                let json = JSON.parse(xhr.responseText);
                let tweetTextArea = $('textarea.js-compose-text')[0];
                tweetTextArea.value = json.response;
                tweetTextArea.dispatchEvent(new Event('change'));
                filterButton.text("Success!")
            } else {
                filterButton.css({"background-color":"#F14C4A"})
                filterButton.text("Failed")
            }
        }
    };
    xhr.send();
}

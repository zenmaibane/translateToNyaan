const nyaanInitText = "< Nyaan";
const nyaanInitColor = "#80c0a0";

run();

function run() {
    const tweetButton = document.querySelector("button.js-send-button");//jqueryオブジェクトにするとobserve出来ない
    if (tweetButton === null) {
        setTimeout(run, 1500);
        return;
    }

    const tweetButtonContainer = $(".js-send-button-container");
    const filterButton = $("<button></button>", {
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
    const tweetButtonObserver = new MutationObserver(function () {
        if (tweetButton.classList.contains("is-disabled")) {
            filterButton.addClass("is-disabled");
            filterButton.text(nyaanInitText)
        } else {
            filterButton.removeClass("is-disabled")
        }
        filterButton.css({"background-color": nyaanInitColor})
    });
    tweetButtonObserver.observe(tweetButton, {
        'attributes': true,
        "attributeFilter": ["class"]
    });

    const tweetTextArea = document.querySelector("textarea.js-compose-text");//jqueryオブジェクトにするとobserve出来ない
    const tweetObserver = new MutationObserver(function () {
        if (tweetTextArea.disabled) {
            filterButton.text("")
        }
        else {
            filterButton.css({"background-color": nyaanInitColor});
            filterButton.text(nyaanInitText);
        }
    });
    tweetObserver.observe(tweetTextArea, {
        "attributes": true,
        "attributeFilter": ["disabled"]
    });
}

function translateToNyaan() {
    if (!$('#filter-button').hasClass('is-disabled')) {
        const tweetTextArea = $('textarea.js-compose-text')[0];
        requestJson(tweetTextArea.value, function () {
            const json = JSON.parse(this.responseText);
            tweetTextArea.value = json.response;
            tweetTextArea.dispatchEvent(new Event('change'));
        });
    }
}

function requestJson(text, callback) {
    const requestUrl = "https://socialityfilter.takanakahiko.me/?text=" + text;
    const xhr = new XMLHttpRequest();
    xhr.callback = callback;
    const filterButton = $("#filter-button");
    filterButton.css({"background-color": nyaanInitColor});
    filterButton.text("Nyaaning...");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.status === 304) {
                xhr.callback.apply(this);
                filterButton.text("Success!");
            } else {
                filterButton.css({"background-color": "#F14C4A"});
                filterButton.text("Failed");
            }
        }
    };

    xhr.open("GET", requestUrl, true);
    xhr.send();
}
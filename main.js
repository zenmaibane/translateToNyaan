function requestJson(text) {
    let requestUrl = "https://socialityfilter.takanakahiko.me/?text=" + text;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", requestUrl, true);
    console.log("test")
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            let json = JSON.parse(xhr.responseText);
            json = JSON.parse(json);//chromeで受け取る値だと2回パースする必要がある形になってしまうため
            console.log(json.response)
            let tweetTextArea = $('textarea.js-compose-text')[0];
            tweetTextArea.value = json.response;
            tweetTextArea.dispatchEvent(new Event('change'));
        }
    };
    xhr.send();
}

function translateToNyaan() {
    console.log("trancerate")
    // if (!$('#filter-button').hasClass('is-disabled')) {
    let tweetTextArea = $('textarea.js-compose-text')[0];
    requestJson(tweetTextArea.value);
    // }
}

run();
function run() {
    let tweetButton = document.querySelector("button.js-send-button");//jqueryオブジェクトにするとobserve出来ない
    if (tweetButton == null) {
        console.log("retry")
        setTimeout(run, 1500);
        return;
    }

    let tweetButtonContainer = $(".js-send-button-container");
        let filterButton = $("<button></button>", {
            "id": "filter-button",
            "class": "js-send-button js-spinner-button js-show-tip btn btn-positive btn-extra-height is-disabled",
            "text": "< Nyaan",
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
        let tweetButtonObserver = new MutationObserver(function(){
            if(tweetButton.classList.contains("is-disabled")){
                filterButton.addClass("is-disabled")
            }else{
                filterButton.removeClass("is-disabled")
            }
        });
        // セレクタをセットして監視を開始
        tweetButtonObserver.observe(tweetButton, {
            'attributes': true,
            "attributeFilter": ["class"]
        });
}

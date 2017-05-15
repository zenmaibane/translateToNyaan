function requestJson(text) {
    let requestUrl = "https://socialityfilter.takanakahiko.me/?text=" + text;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", requestUrl, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            let json = JSON.parse(xhr.responseText);
            console.log(json.response);
            let tweetTextArea = document.querySelector(".compose-content .js-compose-text");
            tweetTextArea.value = json.response;
            $('textarea.js-compose-text')[0].dispatchEvent(new Event('change'));
            tweetTextArea.focus()
            let length = tweetTextArea.value.length
            tweetTextArea.selectionStart = length;
            tweetTextArea.selectionEnd = length;
        }
    };
    xhr.send();
}
function translateToNyaan(){
    if(!$('#filter-button').hasClass('is-disabled')){
        let tweetTextArea = document.querySelector(".compose-content .js-compose-text");
        requestJson(tweetTextArea.value);
    }
}

$(function () {
    setTimeout(function () {
        console.log("test");
        let tweetButton = $(".js-send-button-container");
        let filterButton = $("<button></button>", {
            id: "filter-button",
            class: "js-send-button js-spinner-button js-show-tip btn btn-positive btn-extra-height is-disabled",
            text:"< Nyaan",
            "data-original-title":"Nyaan (alt+n)"
        });
        tweetButton.append(filterButton);
        $('.compose-content .js-compose-text').keyup(function() {
            var val = $(this).val();
            if(val.length === 0){
                $("#filter-button").addClass("is-disabled")
            }else{
                $("#filter-button").removeClass("is-disabled");
            }
        });
        $("#filter-button").on("click", function () {
                 translateToNyaan();
        });
    }, 1000);

     $(document).keydown(function(e){
         console.log(e.keyCode)
         if(e.keyCode===78 && e.altKey){//alt+nキー
                 translateToNyaan();
            }
        });
     });

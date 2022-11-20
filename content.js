window.global = window;

const snackbarHtmlUrl = chrome.extension.getURL("snackbar.html");
$("body").append("<div id='mySnackPlaceholder' style='display: none'/>");
$("#mySnackPlaceholder").load(snackbarHtmlUrl, function () {});

window.addEventListener("keydown", (e) => {
    if (e.key === "b" && e.ctrlKey) {
        console.log("Starting the Download...");
        dl();
    }
});

function dl() {
    snack("Starting the Download...");
    fetch("http://localhost:8765/ytdl", {
        method: "POST",
        body: window.location.href,
    })
        .then((resp) => {
            resp.text().then((text) => {
                if (resp.status === 200) {
                    snack(text);
                } else {
                    snack(`${resp.status} : ${text}`);
                }
            });
        })
        .catch((e) => snack("Error " + e.toString()));
}

let snackTimeout;
function snack(str) {
    const snackBarContainer = document.getElementById("mySnackPlaceholder");
    snackBarContainer.style["display"] = "block";
    const snackBarElement = document.getElementById("snackbar");

    snackBarElement.textContent = str;
    snackBarElement.className = "show";

    clearTimeout(snackTimeout);
    snackTimeout = setTimeout(function () {
        snackBarElement.className = snackBarElement.className.replace("show", "");
        snackBarContainer.style["display"] = "none";
    }, 3000);
}

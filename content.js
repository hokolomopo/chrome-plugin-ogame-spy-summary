window.global = window;

window.addEventListener("keydown", (e) => {
    if (e.key === "b" && e.ctrlKey) {
        console.log("Starting the Download...");
        dl();
    }
});

function dl() {
    toast("Starting the Download...");
    fetch("http://localhost:8765/ytdl", {
        method: "POST",
        body: window.location.href,
    })
        .then((resp) => {
            resp.text().then((text) => {
                if (resp.status === 200) {
                    toast(text);
                } else {
                    toast(`${resp.status} : ${text}`);
                }
            });
        })
        .catch((e) => toast("Error " + e.toString()));
}

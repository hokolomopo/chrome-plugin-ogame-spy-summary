const toastCss = /*css*/ `
    #myToastContainer {
        position: fixed;
        bottom: 0px;
        width: 100%;

        display: flex;
        justify-content: center;
        z-index: 1000;
    }

    #myToast {
        position: relative;
        bottom: 30px;

        background-color: #333;
        color: #fff;
        text-align: center;
        border-radius: 10px;
        padding: 16px;

        font-size: large;
    }

    #myToast.show {
        visibility: visible;
        animation: toastFadeIn 0.5s;
    }

    #myToast.hide {
        animation: toastFadeOut 0.5s;
    }

    @keyframes toastFadeIn {
        from { bottom: 0; opacity: 0; }
        to { bottom: 30px; opacity: 1; }
    }

    @keyframes toastFadeOut {
        from { bottom: 30px; opacity: 1; }
        to { bottom: 0; opacity: 0; }
    }

`;

const style = document.createElement("style");
style.textContent = toastCss;
document.head.append(style);

const toastContainer = document.createElement("div");
toastContainer.id = "myToastContainer";
document.body.append(toastContainer);

let snackTimeout;
function toast(str) {
    const container = document.getElementById("myToastContainer");
    container.innerHTML = "";
    container.innerHTML = `<div id="myToast" class="show">${str}</div>`;

    const toast = document.getElementById("myToast");
    toast.addEventListener("animationend", (ev) => {
        if (ev.animationName === "toastFadeOut") {
            toast.remove();
        }
    });

    clearTimeout(snackTimeout);
    snackTimeout = setTimeout(function () {
        toast.className = toast.className.replace("show", "hide");
    }, 3000);
}

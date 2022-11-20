console.log("Loaded util removing all the shorts in the subscription feed");

setTimeOutOnRemoveShort();

function setTimeOutOnRemoveShort() {
    setTimeout(() => {
        removeShorts();
        setTimeOutOnRemoveShort();
    }, 1000);
}

function removeShorts() {
    const gridElements = document.querySelectorAll("ytd-grid-video-renderer");
    for (const gridElement of gridElements) {
        if (isYoutubeShort(gridElement)) {
            gridElement.remove();
            console.log("Removed an element");
        }
    }
}

function isYoutubeShort(gridElement) {
    const links = gridElement.querySelectorAll("a");
    for (const link of links) {
        if (link.href && link.href.includes("/shorts")) {
            return true;
        }
    }
    return false;
}

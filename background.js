let color = "#3aa757";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log("Default background color set to %cgreen", `color: ${color}`);
});

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    let url = tabs[0].url + "";
    if (url.includes("www")) {
      url = url.replace("www", "music");
    } else {
      url = url.replace("music", "www");
    }
    chrome.tabs.update({
      url: url,
    });
  });
});

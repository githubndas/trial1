chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.includes("youtube.com/watch")) {
    const queryParam = tab.url.split("?")[1];
    const urlParam = new URLSearchParams(queryParam);

    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      videoId: urlParam.get("v"),
    });
  }
});

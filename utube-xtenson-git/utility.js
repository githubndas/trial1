export async function funcGetActiveTabURL() {
    const tabList = await chrome.tabs.query({
        currentWindow: true,
        active: true
    });
  
    return tabList[0];
}


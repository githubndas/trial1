import { funcGetActiveTabURL } from "./utility.js";

const funcViewBookmarks = (currBookmarks=[]) => {
  const bookmarksEle = document.getElementById("bookmarklist");
  bookmarksEle.innerHTML = "";
  if (currBookmarks.length > 0) {
    for (let i = 0; i < currBookmarks.length; i++) {
      const bookmark = currBookmarks[i];
      funcAddNewBookmark(bookmarksEle, bookmark);
    }
  } else {
    bookmarksEle.innerHTML = '<i class="row">No bookmarks!</i>';
  }

  return;
};

const funcAddNewBookmark = (bookmarks, bookmark) => {
  const newBookmarkEle = document.createElement("div");
  const controlsElem = document.createElement("div");
  const bookmarkTitleEle = document.createElement("div");

  controlsElem.className = "bookmarkcontrols";
  bookmarkTitleEle.className = "bookmarktitle";
  bookmarkTitleEle.textContent = bookmark.desc;

  funcSetBookmarkAttributes("delete", onDeleteCb, controlsElem);
  funcSetBookmarkAttributes("play", onPlayCb, controlsElem);

  newBookmarkEle.setAttribute("timestamp", bookmark.time);
  newBookmarkEle.className = "bookmark";
  newBookmarkEle.id = "bookmark-" + bookmark.time;

  newBookmarkEle.appendChild(bookmarkTitleEle);
  newBookmarkEle.appendChild(controlsElem);
  bookmarks.appendChild(newBookmarkEle);
};

const onDeleteCb = async e => {
  const activeTab = await funcGetActiveTabURL();
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const bookmarkElementToDelete = document.getElementById(
    "bookmark-" + bookmarkTime
  );

  chrome.tabs.sendMessage(activeTab.id, {
    type: "DELETE",
    value: bookmarkTime,
  }, funcViewBookmarks);
  bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);
};

const onPlayCb = async e => {
  const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
  const activeTab = await funcGetActiveTabURL();

  chrome.tabs.sendMessage(activeTab.id, {
    type: "PLAY",
    value: bookmarkTime,
  });
};

const funcSetBookmarkAttributes =  (src, eventListener, controlParentEle) => {
  const controlEle = document.createElement("img");

  controlEle.src = "asset/" + src + ".png";
  controlEle.title = src;
  controlParentEle.appendChild(controlEle);
};

document.addEventListener("DOMContentLoaded", async () => {
  const activTab = await funcGetActiveTabURL();
  const queryParam = activTab.url.split("?")[1];
  const urlParam = new URLSearchParams(queryParam);

  const currVideo = urlParam.get("v");

  if (activTab.url.includes("youtube.com/watch") && currVideo) {
    chrome.storage.sync.get([currVideo], (data) => {
      const currVideoBookmarks = data[currVideo] ? JSON.parse(data[currVideo]) : [];

      funcViewBookmarks(currVideoBookmarks);
    });
  } else {
    const holder = document.getElementsByClassName("holder")[0];

    holder.innerHTML = '<div class="title">Sorry not a youtube video!</div>';
  }
});


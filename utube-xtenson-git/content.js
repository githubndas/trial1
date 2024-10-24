(() => {
  let currVideo = "";
  let utubePlayer, utubeLeftControls;
  let currVideoBookmarks = [];

  const funcFetchBookmarks = () => {
    return new Promise((resolve) => {
      chrome.storage.sync.get([currVideo], (obj) => {
        resolve(obj[currVideo] ? JSON.parse(obj[currVideo]) : []);
      });
    });
  };

  const funcNewVideoLoaded = async () => {

    currVideoBookmarks = await funcFetchBookmarks();
    const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];

    if (!bookmarkBtnExists) {
      const bookmarkBtn = document.createElement("img");

      bookmarkBtn.className = "ytp-button " + "bookmark-btn";
      bookmarkBtn.title = "Bookmark current timestamp";
      bookmarkBtn.src = chrome.runtime.getURL("asset/bukmark.png");

      utubePlayer = document.getElementsByClassName('video-stream')[0];
      utubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];

      utubeLeftControls.appendChild(bookmarkBtn);
      bookmarkBtn.addEventListener("click", funcAddNewBookmarkEventHandler);
    }
  };

  const funcAddNewBookmarkEventHandler = async () => {
    const currTime = utubePlayer.currentTime;

    const newBookmark = {
      time: currTime,
      desc: "Bookmark at " + getTime(currTime),
    };

    currVideoBookmarks = await funcFetchBookmarks();
    currVideoBookmarks = [...currVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time);
  };

  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value, videoId } = obj;
    if (type === "NEW") {
      currVideo = videoId;
      funcNewVideoLoaded();
    } else if (type === "PLAY") {
      utubePlayer.currentTime = value;
    } else if ( type === "DELETE") {
      currVideoBookmarks = currVideoBookmarks.filter((b) => b.time != value);
      chrome.storage.sync.set({ [currVideo]: JSON.stringify(currVideoBookmarks) });

      response(currVideoBookmarks);
    }
  });

  funcNewVideoLoaded();
})();

const getTime = t => {
  var date = new Date(0);
  date.setSeconds(t);

  return date.toISOString().substr(11, 8);
};

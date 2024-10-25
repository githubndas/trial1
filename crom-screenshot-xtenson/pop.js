document.addEventListener("DOMContentLoaded", function() {
    const screenshot = document.getElementById("screenshot");
    const holder = document.getElementById("holder");
  
    screenshot.addEventListener("click", function() {
      chrome.tabs.captureVisibleTab((dataUrl) => {
        const screenshotImg = new Image();
        holder.appendChild(screenshotImage);
        screenshotImg.src = dataUrl;
      });
    });
  });
  
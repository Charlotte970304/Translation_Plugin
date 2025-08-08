// content.js

let lastFocusedInput = null;

// 追蹤使用者聚焦在哪個輸入框
document.addEventListener("focusin", (e) => {
  const el = e.target;
  if (
    el.tagName === "TEXTAREA" ||
    el.tagName === "INPUT" ||
    el.isContentEditable
  ) {
    lastFocusedInput = el;
  }
});

// 接收來自 background 的翻譯結果
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "insertTranslation" && message.translation) {
    if (lastFocusedInput) {
      if (lastFocusedInput.isContentEditable) {
        lastFocusedInput.innerText = message.translation;
      } else {
        lastFocusedInput.value = message.translation;
      }
      lastFocusedInput.focus();
    } else {
      alert("找不到輸入框，已複製翻譯到剪貼簿！");
      navigator.clipboard.writeText(message.translation);
    }
  }
});

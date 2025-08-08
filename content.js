let lastFocusedInput = null;

// 共用的輸入函數，會同步觸發 input event
function setInputText(el, text) {
    console.log("✅ setInputText called with:", text);
    
    if (el.isContentEditable) {
      // 嘗試移除原內容再加入新翻譯
      el.focus();
      document.execCommand("selectAll", false, null);
      document.execCommand("insertText", false, text);
      
      // 強制觸發輸入事件讓框架更新狀態
      el.dispatchEvent(new InputEvent("input", {
        bubbles: true,
        cancelable: true,
        inputType: "insertText",
        data: text
      }));
    } else {
      el.value = text;
      el.dispatchEvent(new Event("input", {
        bubbles: true,
        cancelable: true
      }));
    }
  }

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
      setInputText(lastFocusedInput, message.translation);
      lastFocusedInput.focus();
    } else {
      alert("找不到輸入框，已複製翻譯到剪貼簿！");
      navigator.clipboard.writeText(message.translation);
    }
  }
});

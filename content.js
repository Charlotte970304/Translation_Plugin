// 安全設值（繞過 React）
function setNativeValue(el, value) {
  const tag = el.tagName;
  let proto = null;
  if (tag === "TEXTAREA") {
    proto = HTMLTextAreaElement.prototype;
  } else if (tag === "INPUT") {
    proto = HTMLInputElement.prototype;
  }
  const setter = proto ? Object.getOwnPropertyDescriptor(proto, "value")?.set : null;
  if (setter) {
    setter.call(el, value);
  } else {
    el.value = value;
  }
}

function replaceInInput(el, text) {
  setNativeValue(el, text);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

function replaceInContentEditable(text) {
  const sel = window.getSelection();
  if (!sel) return false;

  // 嘗試用 execCommand 插入（相容性較高）
  if (document.queryCommandSupported("insertText")) {
    elFocus();
    document.execCommand("selectAll", false, null);
    document.execCommand("insertText", false, text);
  } else {
    // Range API 備援
    if (sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  if (document.activeElement && document.activeElement.isContentEditable) {
    document.activeElement.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

let lastFocusedInput = null;

function elFocus() {
  if (lastFocusedInput) lastFocusedInput.focus();
}

document.addEventListener("focusin", (e) => {
  const el = e.target;
  if (el && (el.tagName === "TEXTAREA" || el.tagName === "INPUT" || el.isContentEditable)) {
    lastFocusedInput = el;
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message) return;

  // 讓 background.js 拿到目前輸入框內容
  if (message.type === "getCurrentInputValue") {
    if (lastFocusedInput) {
      const value = lastFocusedInput.isContentEditable
        ? lastFocusedInput.innerText
        : lastFocusedInput.value;
      sendResponse({ value });
    } else {
      sendResponse({ value: "" });
    }
    return true;
  }

  // 右鍵翻譯
  if (message.type === "insertOrReplaceSelection" && message.translation) {
    if (lastFocusedInput) {
      if (lastFocusedInput.isContentEditable) {
        replaceInContentEditable(message.translation);
      } else {
        replaceInInput(lastFocusedInput, message.translation);
      }
      elFocus();
    } else {
      navigator.clipboard.writeText(message.translation);
      alert("No input detected. Translation copied to clipboard.");
    }
  }

  // 快捷鍵翻譯
  if (message.type === "replaceCurrentInput" && message.translation) {
    if (lastFocusedInput) {
      if (lastFocusedInput.isContentEditable) {
        replaceInContentEditable(message.translation);
      } else {
        replaceInInput(lastFocusedInput, message.translation);
      }
      elFocus();
    } else {
      navigator.clipboard.writeText(message.translation);
      alert("No input detected. Translation copied to clipboard.");
    }
  }
});

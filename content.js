let lastFocusedInput = null;

// Shared input function that triggers the input event as well
function setInputText(el, text) {
    console.log("✅ setInputText called with:", text);
    
    if (el.isContentEditable) {
      // Try clearing the original content and inserting the new translation
      el.focus();
      document.execCommand("selectAll", false, null);
      document.execCommand("insertText", false, text);
      
      // Force dispatch input event to trigger framework updates
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

// Track the last focused input element
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

// Listen for translation result from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "insertTranslation" && message.translation) {
    if (lastFocusedInput) {
      setInputText(lastFocusedInput, message.translation);
      lastFocusedInput.focus();
    } else {
      alert("No input field detected. Translation copied to clipboard.");
      navigator.clipboard.writeText(message.translation);
    }
  }
});

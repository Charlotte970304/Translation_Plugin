chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "translate-selection",
      title: "使用 GPT 翻譯選取文字",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "translate-selection") {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: handleTranslationInPage
      });
    }
  });
  
  async function handleTranslationInPage() {
    const selectedText = window.getSelection().toString();
    if (!selectedText) {
      alert("請先選取文字！");
      return;
    }
  
    const { apiKey, targetLang } = await chrome.storage.sync.get(["apiKey", "targetLang"]);
  
    if (!apiKey) {
      alert("尚未設定 OpenAI API Key");
      return;
    }
  
    const prompt = `請將下列文字翻譯成${targetLang}：\n${selectedText}`;
  
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      })
    });
  
    const data = await response.json();
    const translation = data.choices?.[0]?.message?.content?.trim();
  
    if (translation) {
      await navigator.clipboard.writeText(translation);
      alert("翻譯完成，已複製到剪貼簿：\n\n" + translation);
    } else {
      alert("翻譯失敗，請檢查 API Key 或網路狀況");
    }
  }
  
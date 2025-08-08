chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "translate-selection",
      title: "使用 GPT 翻譯選取文字",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "translate-selection") {
      const selectedText = info.selectionText;
      if (!selectedText) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => alert("請先選取文字！")
        });
        return;
      }
  
      // 取得儲存的 API Key 和目標語言
      const { apiKey, targetLang } = await new Promise((resolve) =>
        chrome.storage.sync.get(["apiKey", "targetLang"], resolve)
      );
  
      if (!apiKey) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => alert("尚未設定 OpenAI API Key")
        });
        return;
      }
  
      // 組合 prompt
      const prompt = `請將下列文字翻譯成${targetLang}：\n${selectedText}`;
  
      try {
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
          // 傳送翻譯結果到 content script 插入輸入框
          chrome.tabs.sendMessage(tab.id, {
            type: "insertTranslation",
            translation
          });
        } else {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => alert("翻譯失敗，請檢查 API Key 或網路狀況")
          });
        }
      } catch (err) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => alert("呼叫 API 時出錯，請檢查網路或金鑰")
        });
      }
    }
  });
  
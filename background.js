chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "translate-selection",
      title: "Translate selected text with GPT",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "translate-selection") {
      const selectedText = info.selectionText;
      if (!selectedText) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => alert("Please select some text first!")
        });
        return;
      }
  
      // Retrieve stored API key and target language
      const { apiKey, targetLang } = await new Promise((resolve) =>
        chrome.storage.sync.get(["apiKey", "targetLang"], resolve)
      );
  
      if (!apiKey) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => alert("OpenAI API Key is not set.")
        });
        return;
      }
  
      // Build the translation prompt
      const prompt = `Please translate the following text into ${targetLang}:\n${selectedText}`;

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
          // Send the translation result to content script for insertion
          chrome.tabs.sendMessage(tab.id, {
            type: "insertTranslation",
            translation
          });
        } else {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => alert("Translation failed. Please check your API key or network connection.")
          });
        }
      } catch (err) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => alert("An error occurred while calling the API. Please check your network or API key.")
        });
      }
    }
  });
  
async function callOpenAI(apiKey, targetLang, text) {
  const safeLang = targetLang || "Traditional Chinese";
  const prompt = `Translate the following text into ${safeLang}.
- Keep meaning, tone, and formatting.
- Output translation only.

Text:
${text}`;

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: "You are a precise translator. Respond with translation only." },
        { role: "user", content: prompt }
      ]
    })
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => "");
    throw new Error(`OpenAI error ${resp.status}: ${errText || "unknown"}`);
  }

  const data = await resp.json();
  const translation = data.choices?.[0]?.message?.content?.trim();
  if (!translation) throw new Error("Empty translation from model.");
  return translation;
}

// build right key for selection
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translate-selection",
    title: "Translate selected text with GPT",
    contexts: ["selection"]
  });
});

// deal with right key translation
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "translate-selection") return;

  const selectedText = info.selectionText?.trim();
  if (!selectedText) {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => alert("Please select some text first!")
    });
    return;
  }

  const { apiKey, targetLang } = await new Promise((resolve) =>
    chrome.storage.sync.get(["apiKey", "targetLang"], resolve)
  );

  if (!apiKey) {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => alert("OpenAI API Key is not set.")
    });
    return;
  }

  try {
    const translation = await callOpenAI(apiKey, targetLang, selectedText);
    chrome.tabs.sendMessage(tab.id, { type: "insertOrReplaceSelection", translation });
  } catch (err) {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (msg) => alert(msg),
      args: [`Translation failed: ${err?.message || err}`]
    });
  }
});

// deal with shortcut translation
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "translate-current-input") {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;

    // call content script return text
    chrome.tabs.sendMessage(tab.id, { type: "getCurrentInputValue" }, async (response) => {
      const inputValue = response?.value?.trim();
      if (!inputValue) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => alert("No input field detected or it's empty.")
        });
        return;
      }

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

      try {
        const translation = await callOpenAI(apiKey, targetLang, inputValue);
        chrome.tabs.sendMessage(tab.id, { type: "replaceCurrentInput", translation });
      } catch (err) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (msg) => alert(msg),
          args: [`Translation failed: ${err?.message || err}`]
        });
      }
    });
  }
});

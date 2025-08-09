# GPT Translator Chrome Extension

A Chrome extension that lets you quickly translate text **directly on the page** using OpenAI's GPT models.  
Supports:
- **Right-click translation of selected text**
- **Keyboard shortcut to translate the entire content of the currently focused input field**
- Works in **React-controlled** input fields like Twitter, Facebook, Gmail, etc.

---

## ✨ Features
- 🌐 **Right-click selection translation** → Replace the selected text in inputs/contenteditable areas, or copy to clipboard.
- ⌨️ **Shortcut translation** → Instantly translate whatever is in the currently focused input (e.g., tweet box, comment area, search bar).
- 🛠️ **Framework compatibility** → Properly simulates native typing so React/Vue/Svelte inputs update their internal state.
- 🔧 Configurable target language and model (defaults to `gpt-4o-mini`).
- 🔒 API key stored locally in `chrome.storage.sync` (never sent anywhere except OpenAI API).

---

## ⌨️ Default Shortcut
- **Windows / Linux:** `Ctrl + Shift + T`  
- **macOS:** `Command + Shift + T`  

> You can change the shortcut in `chrome://extensions/shortcuts`

---


##  📦Installation
1. Clone this repository:
```bash
git clone https://github.com/Charlotte970304/Translation_Plugin.git
```
2. Open `chrome://extensions/` in your Chrome browser 
3. Enable Developer Mode (toggle in the top right corner)
4. Click "Load unpacked"
5. Select the cloned folder as the extension directory

## ⚙️ Configuration
- Click the extension icon in Chrome to open the settings popup.
- Enter your OpenAI API Key.
- Choose your Target Language (e.g., English, Traditional Chinese, Japanese).
- Save — your settings will be synced across Chrome if you’re logged in.

## 🖱️ Usage
### Right-click Selection Translation
1. Select any text on a webpage.
2. Right-click and choose "Translate selected text with GPT".
3. The translated text will replace the selection if it’s inside an editable field; otherwise, it will be copied to your clipboard.

### Shortcut Translation
1. Focus any input field (textarea, text input, or contenteditable area).
2. Press the shortcut (Ctrl+Shift+T by default).
3. The entire input content will be replaced with the translated text.

## 📌 Notes
- This extension does not store any text or API key remotely
- API keys are stored securely in `chrome.storage.sync` and never leave your browser
- If translating long text, be aware of your OpenAI API token usage and limits.

## 🧪 Roadmap / TODO

- [ ] 🤖 Support multiple translation providers (Google, DeepL, etc.). 
- [ ] 🔄 Add visual loading indicator during translation  
- [ ] ⌨️ Add customizable keyboard shortcut for translation  
- [ ] 📝 Option to insert translation alongside original text instead of replacing it.


## 📄 License
MIT License














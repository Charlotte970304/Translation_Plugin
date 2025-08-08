# GPT Translator Chrome Extension
A simple Chrome extension that translates selected or typed text using OpenAI's GPT API and inserts the translation directly into input fields like tweet boxes, comment areas, or search bars.

## ⌨️ Shortcut
- `Ctrl + Alt + T`：Translate the content of the currently focused input field

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
- Click the extension icon in Chrome to open the settings page (or right-click → Options)
- Enter your OpenAI API Key
- Choose your Target Language (e.g., English, Chinese, Japanese)

## 📌 Notes
- This extension does not store any text or API key remotely
- API keys are stored securely in chrome.storage.sync and never leave your browser
- You can sync settings across devices by logging into the same Google account in Chrome

## 🧪 Roadmap / TODO
- [ ] 🤖 Add GPT model selection (e.g., GPT-3.5 / GPT-4)  
- [ ] 🔄 Add visual loading indicator during translation  
- [ ] ⌨️ Add customizable keyboard shortcut for translation  

## 📄 License
MIT License














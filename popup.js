const apikeyEl = document.getElementById("apikey");
const langEl = document.getElementById("targetLang");
const saveBtn = document.getElementById("save");

saveBtn.addEventListener("click", () => {
  const apiKey = apikeyEl.value.trim();
  const targetLang = langEl.value || "Traditional Chinese";
  chrome.storage.sync.set({ apiKey, targetLang }, () => {
    alert("Settings saved!");
  });
});

window.onload = () => {
  chrome.storage.sync.get(["apiKey", "targetLang"], (data) => {
    if (data.apiKey) apikeyEl.value = data.apiKey;
    langEl.value = data.targetLang || "Traditional Chinese";
  });
};

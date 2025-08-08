document.getElementById("save").addEventListener("click", () => {
    const apiKey = document.getElementById("apikey").value;
    const targetLang = document.getElementById("targetLang").value;
  
    chrome.storage.sync.set({ apiKey, targetLang }, () => {
      alert("設定已儲存！");
    });
  });
  
  // 初始化時載入現有設定
  window.onload = () => {
    chrome.storage.sync.get(["apiKey", "targetLang"], (data) => {
      if (data.apiKey) document.getElementById("apikey").value = data.apiKey;
      if (data.targetLang) document.getElementById("targetLang").value = data.targetLang;
    });
  };
  
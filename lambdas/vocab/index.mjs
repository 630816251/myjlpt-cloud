/*******************************
 * MyJLPT Vocabulary Frontend
 * Cognito JWT + API Gateway
 *******************************/

/* ===== API 基本設定 ===== */
const API_BASE_URL =
  "https://m80hd7j644.execute-api.us-east-1.amazonaws.com/prod";

/* ===== 共用 API 呼叫 ===== */
async function apiRequest(path, method = "GET", body = null) {
  const token = localStorage.getItem("idToken");

  if (!token) {
    throw new Error("尚未登入，請重新登入");
  }

  const options = {
    method,
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(API_BASE_URL + path, options);

  if (!res.ok) {
    let errMsg = "API 發生錯誤";
    try {
      const err = await res.json();
      errMsg = err.message || errMsg;
    } catch (_) {}
    throw new Error(errMsg);
  }

  return res.json();
}

/* ===== 頁面載入時自動讀取 ===== */
window.onload = loadVocabList;

/* ===== 讀取單字（GET /vocab） ===== */
async function loadVocabList() {
  const list = document.getElementById("vocab-list");
  list.innerHTML = "<li>載入中...</li>";

  try {
    const data = await apiRequest("/vocab");
    list.innerHTML = "";

    if (!data || data.length === 0) {
      list.innerHTML = "<li>目前沒有單字</li>";
      return;
    }

    data.forEach(v => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${v.kana}</strong> ${v.kanji || ""}
        - ${v.meaning_zh}
        <button onclick="deleteVocab('${v.vocab_id}')">刪除</button>
      `;
      list.appendChild(li);
    });
  } catch (err) {
    list.innerHTML = `<li class="error">❌ 讀取失敗：${err.message}</li>`;
  }
}

/* ===== 新增單字（POST /vocab） ===== */
async function createVocab() {
  const kana = document.getElementById("kana").value.trim();
  const kanji = document.getElementById("kanji").value.trim();
  const meaning = document.getElementById("meaning").value.trim();
  const level = document.getElementById("level").value.trim();
  const msg = document.getElementById("form-msg");

  msg.textContent = "";

  if (!kana || !meaning) {
    msg.textContent = "❌ 假名與中文意思為必填";
    return;
  }

  try {
    await apiRequest("/vocab", "POST", {
      kana,
      kanji,
      meaning_zh: meaning,
      jlpt_level: level
    });

    msg.textContent = "✅ 新增成功";

    document.getElementById("kana").value = "";
    document.getElementById("kanji").value = "";
    document.getElementById("meaning").value = "";
    document.getElementById("level").value = "";

    loadVocabList();
  } catch (err) {
    msg.textContent = `❌ 新增失敗：${err.message}`;
  }
}

/* ===== 刪除單字（DELETE /vocab/{id}） ===== */
async function deleteVocab(id) {
  if (!confirm("確定要刪除這筆單字？")) return;

  try {
    await apiRequest(`/vocab/${id}`, "DELETE");
    loadVocabList();
  } catch (err) {
    alert("❌ 刪除失敗：" + err.message);
  }
}

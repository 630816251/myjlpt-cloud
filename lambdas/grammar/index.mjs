window.onload = loadGrammar;

async function loadGrammar() {
  const container = document.getElementById("grammar-list");
  container.innerHTML = "載入中...";

  try {
    const data = await apiRequest("/grammar");
    container.innerHTML = "";

    if (data.length === 0) {
      container.innerHTML = "目前沒有文法資料";
      return;
    }

    data.forEach(g => {
      const card = document.createElement("div");
      card.className = "grammar-card";

      card.innerHTML = `
        <div class="grammar-header">
          <span class="grammar-name">${g.grammar_name}</span>
          <span class="badge">${g.level}</span>
        </div>
        <div class="grammar-detail" style="display:none;">
          <p><strong>用法：</strong>${g.usage}</p>
          <p><strong>說明：</strong>${g.explanation_zh}</p>
          <p><strong>例句：</strong>${g.example_sentence}</p>
          <button onclick="deleteGrammar('${g.grammar_id}')">刪除</button>
        </div>
      `;

      card.onclick = () => toggleDetail(card);
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = "讀取失敗：" + err.message;
  }
}

function toggleDetail(card) {
  const detail = card.querySelector(".grammar-detail");
  detail.style.display = detail.style.display === "none" ? "block" : "none";
}

async function createGrammar() {
  const name = document.getElementById("g-name").value.trim();
  const usage = document.getElementById("g-usage").value.trim();
  const level = document.getElementById("g-level").value.trim();
  const exp = document.getElementById("g-exp").value.trim();
  const example = document.getElementById("g-example").value.trim();
  const msg = document.getElementById("g-msg");

  msg.textContent = "";

  if (!name || !usage) {
    msg.textContent = "❌ 文法名稱與用法為必填";
    return;
  }

  try {
    await apiRequest("/grammar", "POST", {
      grammar_name: name,
      usage,
      explanation_zh: exp,
      example_sentence: example,
      level
    });

    msg.textContent = "✅ 新增成功";
    document.querySelectorAll("input, textarea").forEach(i => i.value = "");
    loadGrammar();
  } catch (err) {
    msg.textContent = "❌ 新增失敗：" + err.message;
  }
}

async function deleteGrammar(id) {
  event.stopPropagation();
  if (!confirm("確定刪除這個文法？")) return;

  try {
    await apiRequest(`/grammar/${id}`, "DELETE");
    loadGrammar();
  } catch (err) {
    alert("刪除失敗：" + err.message);
  }
}

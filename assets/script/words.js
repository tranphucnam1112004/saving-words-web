const data = window.parent.AppData;
const helpers = window.parent.AppHelpers;
let sortBy = "alpha";
let sortDir = "asc";
let editingWordId = null;
let deletingWordId = null;

function groupFilterSelection() {
  ["input-group", "group-filter", "edit-group"].forEach((id) => {
    const sel = document.getElementById(id);
    if (!sel) return;
    const isFilter = id === "group-filter";
    const cur = sel.value;
    sel.innerHTML = isFilter ? '<option value="">Tất cả nhóm</option>' : "";
    data.groups.forEach((g) => {
      const o = document.createElement("option");
      o.value = g.id;
      o.textContent = g.name;
      sel.appendChild(o);
    });
    sel.value = cur;
  });
}

function loadWordList() {
  const q = document.getElementById("word-search").value.toLowerCase();
  const gf = document.getElementById("group-filter").value;

  document.getElementById("group-filter").style.display =
    sortBy === "group" ? "" : "none";

  let list = data.words.filter(
    (w) =>
      (!q ||
        w.word.toLowerCase().includes(q) ||
        w.meaning.toLowerCase().includes(q)) &&
      (!gf || w.groupId == gf),
  );
  list = helpers.getSortedWords(list, sortBy, sortDir);

  document.getElementById("word-table").innerHTML =
    list
      .map(
        (w) => `
    <div class="word-row">
      <span class="w">${w.word}</span>
      <span class="m">${w.meaning}</span>
      <span class="group-tag">${helpers.getGroupName(w.groupId)}</span>
      <span class="d">${helpers.formatDate(w.date)}</span>
      <div class="row-actions">
        <button class="btn-row" title="Sửa" data-edit="${w.id}">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="btn-row danger" title="Xóa" data-delete="${w.id}" data-name="${w.word}">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  `,
      )
      .join("") || '<p class="empty-msg">Không tìm thấy từ nào.</p>';

  document
    .querySelectorAll("[data-edit]")
    .forEach((btn) =>
      btn.addEventListener("click", () =>
        openEditWord(parseInt(btn.dataset.edit)),
      ),
    );
  document
    .querySelectorAll("[data-delete]")
    .forEach((btn) =>
      btn.addEventListener("click", () =>
        openDeleteWord(parseInt(btn.dataset.delete), btn.dataset.name),
      ),
    );
}
document.querySelectorAll("[data-sort]").forEach((btn) =>
  btn.addEventListener("click", () => {
    sortBy = btn.dataset.sort;
    document
      .querySelectorAll("[data-sort]")
      .forEach((b) => b.classList.toggle("active", b === btn));
    loadWordList();
  }),
);
document.getElementById("sort-dir").addEventListener("change", (e) => {
  sortDir = e.target.value;
  loadWordList();
});
document
  .getElementById("group-filter")
  .addEventListener("change", loadWordList);
document.getElementById("word-search").addEventListener("input", loadWordList);

document.getElementById("btn-add-word").addEventListener("click", () => {
  groupFilterSelection();
  document.getElementById("input-word").value = "";
  document.getElementById("input-meaning").value = "";
  document.getElementById("input-note").value = "";
  document.getElementById("form-word").classList.add("open");
  document.getElementById("input-word").focus();
});

document
  .getElementById("btn-cancel-word")
  .addEventListener("click", () =>
    document.getElementById("form-word").classList.remove("open"),
  );

document.getElementById("form-word").addEventListener("click", (e) => {
  if (e.target === document.getElementById("form-word"))
    document.getElementById("form-word").classList.remove("open");
});
document.getElementById("btn-save-word").addEventListener("click", () => {
  const word = document.getElementById("input-word").value.trim();
  const meaning = document.getElementById("input-meaning").value.trim();
  const groupId = document.getElementById("input-group").value;
  const note = document.getElementById("input-note").value.trim();

  if (!word || !meaning || !groupId) {
    alert("Vui lòng điền đầy đủ từ, nghĩa và nhóm.");
    return;
  }
  helpers.addWord(word, meaning, groupId, note);
  document.getElementById("form-word").classList.remove("open");
  loadWordList();
});

function openEditWord(id) {
  const w = data.words.find((w) => w.id === id);
  if (!w) return;

  editingWordId = id;
  groupFilterSelection();
  document.getElementById("edit-word").value = w.word;
  document.getElementById("edit-meaning").value = w.meaning;
  document.getElementById("edit-note").value = w.note || "";
  document.getElementById("edit-group").value = w.groupId;
  document.getElementById("form-edit-word").classList.add("open");
  document.getElementById("edit-word").focus();
}

document
  .getElementById("btn-cancel-edit-word")
  .addEventListener("click", () =>
    document.getElementById("form-edit-word").classList.remove("open"),
  );
document.getElementById("form-edit-word").addEventListener("click", (e) => {
  if (e.target === document.getElementById("form-edit-word"))
    document.getElementById("form-edit-word").classList.remove("open");
});

document.getElementById("btn-save-edit-word").addEventListener("click", () => {
  const word = document.getElementById("edit-word").value.trim();
  const meaning = document.getElementById("edit-meaning").value.trim();
  const groupId = document.getElementById("edit-group").value;
  const note = document.getElementById("edit-note").value.trim();
  if (!word || !meaning || !groupId) {
    alert("Vui lòng điền đầy đủ từ, nghĩa và nhóm.");
    return;
  }

  helpers.editWord(editingWordId, word, meaning, groupId, note);
  document.getElementById("form-edit-word").classList.remove("open");
  loadWordList();
});

function openDeleteWord(id, name) {
  deletingWordId = id;
  document.getElementById("delete-word-name").textContent = name;
  document.getElementById("confirm-del-word").classList.add("open");
}

document
  .getElementById("btn-cancel-delete-word")
  .addEventListener("click", () =>
    document.getElementById("confirm-del-word").classList.remove("open"),
  );
document.getElementById("confirm-del-word").addEventListener("click", (e) => {
  if (e.target === document.getElementById("confirm-del-word"))
    document.getElementById("confirm-del-word").classList.remove("open");
});

document
  .getElementById("btn-confirm-delete-word")
  .addEventListener("click", () => {
    helpers.deleteWord(deletingWordId);
    document.getElementById("confirm-del-word").classList.remove("open");
    loadWordList();
  });
groupFilterSelection();
loadWordList();

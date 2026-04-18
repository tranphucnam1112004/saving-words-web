const data = window.parent.AppData;
const helpers = window.parent.AppHelpers;

let sortBy = "alpha";
let sortDir = "asc";
let selectedIndexList = new Set();
let curWordList = [];
let reviewWordList = [];
let reviewWordIndex = 0;

function groupFilterSelection() {
  const selected = document.getElementById("review-group-filter");
  const cur = selected.value;
  selected.innerHTML = '<option value="">Tất cả nhóm</option>';
  data.groups.forEach((gr) => {
    const opt = document.createElement("option");
    opt.value = gr.id;
    opt.textContent = gr.name;
    selected.appendChild(opt);
  });
  selected.value = cur;
}

// hiện danh sách từ sau filter ----------------------------------------
function loadSelectedWrod() {
  const input_search = document
    .getElementById("review-search")
    .value.toLowerCase();
  const gr_filter = document.getElementById("review-group-filter").value;
  let list = data.words.filter(
    (w) =>
      (!input_search ||
        w.word.toLowerCase().includes(input_search) ||
        w.meaning.toLowerCase().includes(input_search)) &&
      (!gr_filter || w.groupId == gr_filter),
  );
  list = helpers.getSortedWords(list, sortBy, sortDir);
  curWordList = list;

  document.getElementById("review-table").innerHTML =
    list
      .map(
        (w) => `
    <div class="word-row">
      <input type="checkbox" class="review-cb" data-id="${w.id}"
        ${selectedIndexList.has(w.id) ? "checked" : ""}
        style="accent-color:#3c8c8c; width:15px; height:15px; flex-shrink:0;" />
      <span class="w">${w.word}</span>
      <span class="m">${w.meaning}</span>
      <span class="group-tag">${helpers.getGroupName(w.groupId)}</span>
      <span class="d">${helpers.formatDate(w.date)}</span>
    </div>
  `,
      )
      .join("") || '<p class="empty-msg">Không tìm thấy từ nào.</p>';

  document.querySelectorAll(".review-cb").forEach((cb) =>
    cb.addEventListener("change", (e) => {
      const id = parseInt(e.target.dataset.id);
      if (e.target.checked) selectedIndexList.add(id);
      else selectedIndexList.delete(id);
      updateBar();
    }),
  );

  updateBar();
}

function updateBar() {
  const cnt = selectedIndexList.size;
  const checkedIdx = curWordList.map((w) => w.id);
  const allCheckedIdx =
    checkedIdx.length > 0 &&
    checkedIdx.every((id) => selectedIndexList.has(id));
  document.getElementById("selected-count").textContent =
    cnt > 0 ? `Đã chọn ${cnt} từ` : "";
  document.getElementById("btn-start-review").disabled = cnt === 0;
  document.getElementById("check-all").checked = allCheckedIdx;
}

document.getElementById("check-all").addEventListener("change", (e) => {
  if (e.target.checked) curWordList.forEach((w) => selectedIndexList.add(w.id));
  else curWordList.forEach((w) => selectedIndexList.delete(w.id));
  loadSelectedWrod();
});
document.querySelectorAll("[data-rsort]").forEach((btn) =>
  btn.addEventListener("click", () => {
    sortBy = btn.dataset.rsort;
    document
      .querySelectorAll("[data-rsort]")
      .forEach((b) => b.classList.toggle("active", b === btn));
    loadSelectedWrod();
  }),
);
document.getElementById("review-sort-dir").addEventListener("change", (e) => {
  sortDir = e.target.value;
  loadSelectedWrod();
});
document
  .getElementById("review-group-filter")
  .addEventListener("change", loadSelectedWrod);
document
  .getElementById("review-search")
  .addEventListener("input", loadSelectedWrod);
// ôn -------------------------------------------------------------------
document.getElementById("btn-start-review").addEventListener("click", () => {
  const sel = data.words.filter((w) => selectedIndexList.has(w.id));
  reviewWordList = [...sel].sort(() => Math.random() - 0.5);
  reviewWordIndex = 0;
  showCard();
  document.getElementById("select-word-view").classList.add("hidden");
  document.getElementById("review-view").classList.add("active");
});

function showCard() {
  const w = reviewWordList[reviewWordIndex];
  document.getElementById("card-counter").textContent =
    `${reviewWordIndex + 1} / ${reviewWordList.length}`;
  document.getElementById("fc-word").textContent = w.word;
  document.getElementById("fc-meaning").textContent = w.meaning;
  document.getElementById("flashcard").classList.remove("revealed");
}

document
  .getElementById("flashcard")
  .addEventListener("click", () =>
    document.getElementById("flashcard").classList.add("revealed"),
  );
document.getElementById("flashcard").addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ")
    document.getElementById("flashcard").classList.add("revealed");
});

document.getElementById("btn-next").addEventListener("click", () => {
  if (reviewWordIndex < reviewWordList.length - 1) {
    reviewWordIndex++;
    showCard();
  }
});
document.getElementById("btn-prev").addEventListener("click", () => {
  if (reviewWordIndex > 0) {
    reviewWordIndex--;
    showCard();
  }
});

document.getElementById("btn-exit-review").addEventListener("click", () => {
  document.getElementById("review-view").classList.remove("active");
  document.getElementById("select-word-view").classList.remove("hidden");
  loadSelectedWrod();
});
groupFilterSelection();
loadSelectedWrod();

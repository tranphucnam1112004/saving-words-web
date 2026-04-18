const data = window.parent.AppData;
const helpers = window.parent.AppHelpers;

function loadStat() {
  document.getElementById("total-words").textContent = data.words.length;
  document.getElementById("total-groups").textContent = data.groups.length;
  const recent = [...data.words]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  document.getElementById("cur-list").innerHTML =
    recent
      .map(
        (w) => `
    <div class="cur-ten-words">
      <div style="min-width:0; overflow:hidden;">
        <span class="word-text">${w.word}</span>
        <span class="word-meaning-sm">${w.meaning}</span>
      </div>
      <div style="display:flex; align-items:center; gap:6px; flex-shrink:0;">
        <span class="group-ten-words">${helpers.getGroupName(w.groupId)}</span>
        <span class="date-ten-words">${helpers.formatDate(w.date)}</span>
      </div>
    </div>
  `,
      )
      .join("") || '<p class="empty-msg">Chưa có từ nào.</p>';
}
loadStat();

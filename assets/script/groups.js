let sortBy = "alpha";
let sortDir = "asc";
let editingGroupId = null;
let deletingGroupId = null;
const data = window.parent.AppData;
const helpers = window.parent.AppHelpers;

function loadGroups() {
  const q = document.getElementById("group-search").value.toLowerCase();

  let list = data.groups.filter((g) => !q || g.name.toLowerCase().includes(q));
  list = [...list].sort((a, b) => {
    const c =
      sortBy === "alpha"
        ? a.name.localeCompare(b.name)
        : new Date(a.date) - new Date(b.date);
    return sortDir === "asc" ? c : -c;
  });

  document.getElementById("group-table").innerHTML =
    list
      .map((g) => {
        const cnt = data.words.filter((w) => w.groupId === g.id).length;
        return `
      <div class="group-row">
        <div class="group-icon">
          <i class="fa-solid fa-layer-group"></i>
        </div>
        <span class="group-name">${g.name}</span>
        <span class="group-count">${cnt} từ</span>
        <span class="group-date">${helpers.formatDate(g.date)}</span>
        <div class="row-actions">
          <button class="btn-row" title="Sửa" data-edit="${g.id}">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn-row danger" title="Xóa" data-delete="${g.id}" data-name="${g.name}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;
      })
      .join("") || '<p class="empty-msg">Không tìm thấy nhóm nào.</p>';

  document
    .querySelectorAll("[data-edit]")
    .forEach((btn) =>
      btn.addEventListener("click", () =>
        openEditGroup(parseInt(btn.dataset.edit)),
      ),
    );
  document
    .querySelectorAll("[data-delete]")
    .forEach((btn) =>
      btn.addEventListener("click", () =>
        openDeleteGroup(parseInt(btn.dataset.delete), btn.dataset.name),
      ),
    );
}

document.querySelectorAll("[group-sort]").forEach((btn) =>
  btn.addEventListener("click", () => {
    sortBy = btn.dataset.gsort;
    document
      .querySelectorAll("[group-sort]")
      .forEach((b) => b.classList.toggle("active", b === btn));
    loadGroups();
  }),
);
document.getElementById("group-sort-dir").addEventListener("change", (e) => {
  sortDir = e.target.value;
  loadGroups();
});
document.getElementById("group-search").addEventListener("input", loadGroups);

document.getElementById("btn-add-group").addEventListener("click", () => {
  document.getElementById("input-group-name").value = "";
  document.getElementById("input-group-describe").value = "";
  document.getElementById("form-input").classList.add("open");
  document.getElementById("input-group-name").focus();
});

document
  .getElementById("btn-cancel-group")
  .addEventListener("click", () =>
    document.getElementById("form-input").classList.remove("open"),
  );

document.getElementById("form-input").addEventListener("click", (e) => {
  if (e.target === document.getElementById("form-input"))
    document.getElementById("form-input").classList.remove("open");
});

document.getElementById("btn-save-group").addEventListener("click", () => {
  const name = document.getElementById("input-group-name").value.trim();
  const desc = document.getElementById("input-group-describe").value.trim();

  if (!name) {
    alert("Vui lòng nhập tên nhóm.");
    return;
  }

  helpers.addGroup(name, desc);
  document.getElementById("form-input").classList.remove("open");
  loadGroups();
});

function openEditGroup(id) {
  const g = data.groups.find((g) => g.id === id);
  if (!g) return;

  editingGroupId = id;
  document.getElementById("edit-group-name").value = g.name;
  document.getElementById("edit-group-describe").value = g.desc || "";
  document.getElementById("modal-edit-group").classList.add("open");
  document.getElementById("edit-group-name").focus();
}

document
  .getElementById("btn-cancel-edit-group")
  .addEventListener("click", () =>
    document.getElementById("modal-edit-group").classList.remove("open"),
  );

document.getElementById("modal-edit-group").addEventListener("click", (e) => {
  if (e.target === document.getElementById("modal-edit-group"))
    document.getElementById("modal-edit-group").classList.remove("open");
});

document.getElementById("btn-save-edit-group").addEventListener("click", () => {
  const name = document.getElementById("edit-group-name").value.trim();
  const desc = document.getElementById("edit-group-describe").value.trim();

  if (!name) {
    alert("Vui lòng nhập tên nhóm.");
    return;
  }
  helpers.editGroup(editingGroupId, name, desc);
  document.getElementById("modal-edit-group").classList.remove("open");
  loadGroups();
});

function openDeleteGroup(id, name) {
  deletingGroupId = id;
  document.getElementById("delete-group-name").textContent = name;
  document.getElementById("confirm-del-group").classList.add("open");
}

document
  .getElementById("btn-cancel-delete-group")
  .addEventListener("click", () =>
    document.getElementById("confirm-del-group").classList.remove("open"),
  );

document.getElementById("confirm-del-group").addEventListener("click", (e) => {
  if (e.target === document.getElementById("confirm-del-group"))
    document.getElementById("confirm-del-group").classList.remove("open");
});

document
  .getElementById("btn-confirm-delete-group")
  .addEventListener("click", () => {
    helpers.deleteGroup(deletingGroupId);
    document.getElementById("confirm-del-group").classList.remove("open");
    loadGroups();
  });

loadGroups();

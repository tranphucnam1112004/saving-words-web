Auth.redirectToLogin();

window.AppData = Auth.getCurUserData();

// helper ------------------------------------------------------------
window.AppHelpers = {
  getGroupName(id) {
    const g = window.AppData.groups.find((g) => g.id === id);
    return g ? g.name : "—";
  },

  formatDate(d) {
    return new Date(d).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  },

  getSortedWords(list, by, dir) {
    return [...list].sort((a, b) => {
      let c =
        by === "alpha"
          ? a.word.localeCompare(b.word)
          : by === "group"
            ? window.AppHelpers.getGroupName(a.groupId).localeCompare(
                window.AppHelpers.getGroupName(b.groupId),
              )
            : new Date(a.date) - new Date(b.date);
      return dir === "asc" ? c : -c;
    });
  },

  addWord(word, meaning, groupId, note) {
    const entry = {
      id: window.AppData.nextWordId++,
      word,
      meaning,
      groupId: parseInt(groupId),
      note: note || "",
      date: new Date(),
    };
    window.AppData.words.push(entry);
    Auth.saveUserData(window.AppData);
    return entry;
  },

  addGroup(name, desc) {
    const entry = {
      id: window.AppData.nextGroupId++,
      name,
      desc: desc || "",
      date: new Date(),
    };
    window.AppData.groups.push(entry);
    Auth.saveUserData(window.AppData);
    return entry;
  },

  editWord(id, word, meaning, groupId, note) {
    const w = window.AppData.words.find((w) => w.id === id);
    if (!w) return;
    w.word = word;
    w.meaning = meaning;
    w.groupId = parseInt(groupId);
    w.note = note || "";
    Auth.saveUserData(window.AppData);
  },

  deleteWord(id) {
    window.AppData.words = window.AppData.words.filter((w) => w.id !== id);
    Auth.saveUserData(window.AppData);
  },

  editGroup(id, name, desc) {
    const g = window.AppData.groups.find((g) => g.id === id);
    if (!g) return;
    g.name = name;
    g.desc = desc || "";
    Auth.saveUserData(window.AppData);
  },

  deleteGroup(id) {
    window.AppData.groups = window.AppData.groups.filter((g) => g.id !== id);
    window.AppData.words.forEach((w) => {
      if (w.groupId === id) w.groupId = null;
    });
    Auth.saveUserData(window.AppData);
  },
};

window.AppNav = {
  currentPage: "overview",

  pages: {
    overview: { label: "Tổng quan", src: "pages/overview.html" },
    words: { label: "Danh sách từ", src: "pages/words.html" },
    groups: { label: "Danh sách nhóm", src: "pages/groups.html" },
    review: { label: "Ôn từ", src: "pages/review.html" },
  },

  navigate(page) {
    if (!window.AppNav.pages[page]) return;
    window.AppNav.currentPage = page;

    document
      .querySelectorAll(".nav-item, .bottom-nav-item")
      .forEach((el) => el.classList.toggle("active", el.dataset.page === page));

    const titleEl = document.getElementById("topbar-title");
    if (titleEl) titleEl.textContent = window.AppNav.pages[page].label;

    const frame = document.getElementById("content-frame");
    if (frame) frame.src = window.AppNav.pages[page].src;

    window.AppNav.closeDrawer();
  },

  openDrawer() {
    document.getElementById("sidebar")?.classList.add("open");
    document.getElementById("sub-layer")?.classList.add("open");
  },

  closeDrawer() {
    document.getElementById("sidebar")?.classList.remove("open");
    document.getElementById("sub-layer")?.classList.remove("open");
  },

  init() {
    document
      .querySelectorAll(".nav-item, .bottom-nav-item")
      .forEach((el) =>
        el.addEventListener("click", () =>
          window.AppNav.navigate(el.dataset.page),
        ),
      );

    document
      .getElementById("menu-mobile")
      ?.addEventListener("click", window.AppNav.openDrawer);
    document
      .getElementById("sub-layer")
      ?.addEventListener("click", window.AppNav.closeDrawer);

    const session = Auth.getSession();
    const user_displayName = document.getElementById("sidebar-username");
    if (user_displayName && session)
      user_displayName.textContent = session.displayName;

    document
      .getElementById("btn-logout")
      ?.addEventListener("click", () => Auth.logout());

    window.AppNav.navigate("overview");
  },
};
document.addEventListener("DOMContentLoaded", () => window.AppNav.init());

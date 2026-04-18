window.Auth = {
  getSession() {
    const raw = localStorage.getItem("cur_user");
    return raw ? JSON.parse(raw) : null;
  },
  checkLogin() {
    return !!this.getSession();
  },

  // hàm điều hướng -------------------------------------------------------
  redirectToLogin() {
    if (!this.checkLogin()) {
      window.location.href = "login.html";
    }
  },
  redirectToIndexPage() {
    if (this.checkLogin()) {
      window.location.href = "index.html";
    }
  },

  // hàm login --------------------------------------------------------------------
  login(username, password) {
    const users = this.getUserList();
    const user = users[username.trim()];
    if (!user) return { ok: false, msg: "Tên đăng nhập không tồn tại." };
    if (user.password !== password)
      return { ok: false, msg: "Mật khẩu không đúng." };
    const session = {
      username: username.trim(),
      displayName: user.displayName,
    };
    localStorage.setItem("cur_user", JSON.stringify(session));
    return { ok: true };
  },

  // hàm regis --------------------------------------------------------------------------
  register(username, password, displayName) {
    const users = this.getUserList();
    const key = username.trim();
    if (users[key]) return { ok: false, msg: "Tên đăng nhập đã tồn tại." };
    users[key] = { password, displayName: displayName || username };
    localStorage.setItem("users", JSON.stringify(users));
    this.initNewUserData(key);
    return { ok: true };
  },

  logout() {
    localStorage.removeItem("cur_user");
    window.location.href = "login.html";
  },

  // lấy data user hiện tại --------------------------------------------------
  getCurUserData() {
    const session = this.getSession();
    if (!session) return null;
    const raw = localStorage.getItem(`data_${session.username}`);
    if (!raw) return this.initNewUserData(session.username);
    const data = JSON.parse(raw);
    data.words = data.words.map((w) => ({ ...w, date: new Date(w.date) }));
    data.groups = data.groups.map((g) => ({ ...g, date: new Date(g.date) }));
    return data;
  },

  saveUserData(data) {
    const session = this.getSession();
    if (!session) return;
    localStorage.setItem(`data_${session.username}`, JSON.stringify(data));
  },

  getUserList() {
    const raw = localStorage.getItem("users");
    return raw ? JSON.parse(raw) : {};
  },
  // khởi tạo neww user ---------------------------------------
  initNewUserData(username) {
    const data = {
      groups: [],
      words: [],
      nextWordId: 1,
      nextGroupId: 1,
    };
    localStorage.setItem(`data_${username}`, JSON.stringify(data));
    return data;
  },

  createDemoAcc() {
    const users = this.getUserList();
    if (Object.keys(users).length === 0) {
      this.register("demo", "123456", "Demo User");
      // demo data
      const data = {
        groups: [
          {
            id: 1,
            name: "Gia đình",
            desc: "Từ về người thân",
            date: new Date("2025-01-10"),
          },
          {
            id: 2,
            name: "Thức ăn",
            desc: "Món ăn, đồ uống",
            date: new Date("2025-02-14"),
          },
        ],
        words: [
          {
            id: 1,
            word: "Father",
            meaning: "Cha",
            groupId: 1,
            note: "",
            date: new Date("2025-04-01"),
          },
          {
            id: 2,
            word: "Mother",
            meaning: "Mẹ",
            groupId: 1,
            note: "",
            date: new Date("2025-04-02"),
          },
          {
            id: 3,
            word: "Rice",
            meaning: "Cơm",
            groupId: 2,
            note: "",
            date: new Date("2025-04-03"),
          },
          {
            id: 4,
            word: "Noodles",
            meaning: "Mì",
            groupId: 2,
            note: "",
            date: new Date("2025-04-04"),
          },
        ],
        nextWordId: 5,
        nextGroupId: 3,
      };
      localStorage.setItem("data_demo", JSON.stringify(data));
    }
  },
};

window.Auth.createDemoAcc();

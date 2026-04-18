Auth.redirectToIndexPage();

const errorMsg = document.getElementById("error-msg");
const btnLogin = document.getElementById("btn-login");

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.add("show");
}
function hideError() {
  errorMsg.classList.remove("show");
}

btnLogin.addEventListener("click", function () {
  hideError();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  if (!username || !password) {
    showError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
    return;
  }
  const result = Auth.login(username, password);

  if (result.ok) {
    window.location.href = "index.html";
  } else {
    showError(result.msg);
  }
});

document.getElementById("login-form").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    btnLogin.click();
  }
});

Auth.redirectToIndexPage();
const errorMsg = document.getElementById("error-msg");
const successMsg = document.getElementById("success-msg");
const btnRegis = document.getElementById("btn-regis");

function showError(msg) {
  successMsg.classList.remove("show");
  errorMsg.textContent = msg;
  errorMsg.classList.add("show");
}
function showSuccess(msg) {
  errorMsg.classList.remove("show");
  successMsg.textContent = msg;
  successMsg.classList.add("show");
}
function hideAll() {
  errorMsg.classList.remove("show");
  successMsg.classList.remove("show");
}

btnRegis.addEventListener("click", function () {
  hideAll();
  const username = document.getElementById("username").value.trim();
  const displayName = document.getElementById("displayName").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;

  if (!username || !displayName || !password || !confirm) {
    showError("Vui lòng điền đầy đủ tất cả các trường.");
    return;
  }
  if (username.length < 3) {
    showError("Tên đăng nhập phải có ít nhất 3 ký tự.");
    return;
  }
  if (password.length < 6) {
    showError("Mật khẩu phải có ít nhất 6 ký tự.");
    return;
  }
  if (password !== confirm) {
    showError("Mật khẩu nhập lại không khớp.");
    return;
  }

  const result = Auth.register(username, password, displayName);

  if (result.ok) {
    showSuccess("Tạo tài khoản thành công! Đang chuyển sang đăng nhập...");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1600);
  } else {
    showError(result.msg);
  }
});
document.getElementById("regis-form").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    btnRegis.click();
  }
});

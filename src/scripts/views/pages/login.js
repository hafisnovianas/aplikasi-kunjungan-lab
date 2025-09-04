import CallApi from "../../../data/api.js";

const LoginPage = {
  async render() {
    return `
      <div id="loginView" class="formPage">
        <h1 class="form-title">Login</h1>

        <form id="loginForm" class="form-container">
          <div class="form-group">
            <label for="nimInput">NIM</label>
            <input type="number" id="nimInput" placeholder="Masukkan NIM" required>
            <div id="nimError" class="invalid-feedback"></div>
          </div>

          <div class="form-group">
            <label for="passwordInput">Password</label>
            <input type="password" id="passwordInput" placeholder="Masukkan Password" required>
            <div id="passwordError" class="invalid-feedback"></div>
          </div>
        
          <button type="submit" class="submit-button">Masuk</button>
        </form>

        <p class="text-center">Belum punya akun? <a href="#/register" return false;">Daftar di sini</a></p>
      </div>
    `
  },

  async afterRender() {
    document.getElementById('passwordInput').value = '';
    const lastNIM = localStorage.getItem('lastUsedNIM');
    if (lastNIM) {
      document.getElementById('nimInput').value = lastNIM;
      document.getElementById('passwordInput').focus();
    }
    
    document.getElementById('loginForm').addEventListener('submit', event => {
      event.preventDefault();
      login();
    });
  }
};

export default LoginPage;

async function login() {
  const nimInput = document.getElementById('nimInput');
  const passwordInput = document.getElementById('passwordInput');
  const nim = nimInput.value;
  const password = passwordInput.value;

  // Reset error-error sebelumnya setiap kali login ditekan
  nimInput.classList.remove('is-invalid');
  passwordInput.classList.remove('is-invalid');
  document.getElementById('nimError').innerText = '';
  document.getElementById('passwordError').innerText = '';

  if (!nim || !password) {
    alert('NIM dan Password tidak boleh kosong.');
    return;
  }

  const loginButton = document.querySelector('.form-container button');
  loginButton.disabled = true;
  loginButton.innerText = 'Mengecek...';

  try {
    const payload = { nim, password };
    const response = await CallApi.callApi('login', payload);

    if (response.status === 'success') {
      localStorage.setItem('lastUsedNIM', nim);
      localStorage.setItem('lastUsedName', response.nama);
      localStorage.setItem('kunjunganLabToken', response.token);

      document.getElementById('menuButton').style.display= "flex";
      document.getElementById('loginButton').style.display = "none";
      window.location.hash = '#/dashboard';
    } else {
      if (response.message.toLowerCase().includes('password')) {
        passwordInput.classList.add('is-invalid');
        document.getElementById('passwordError').innerText = response.message;
        passwordInput.focus();
      } else {
        nimInput.classList.add('is-invalid');
        document.getElementById('nimError').innerText = response.message;
        nimInput.focus();
      }
    }
  } catch (error) {
    alert('Error saat validasi: ' + error.message);
  } finally {
    loginButton.disabled = false;
    loginButton.innerText = 'Masuk';
  }
}
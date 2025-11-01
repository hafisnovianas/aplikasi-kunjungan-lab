import CallApi from "../../../data/api.js";

const ForgotPasswordPage = {
  async render() {
    return `
      <div id="forgotPasswordView" class="page-view">
        <h1 class="form-title">Lupa Password</h1>
        <p class="form-subtitle">
          Masukkan email kampus Anda. Kami akan mengirimkan link 
          untuk me-reset password Anda.
        </p>

        <form id="forgotPasswordForm" class="form-container">
          <div class="form-group">
            <label for="emailInput">Email Kampus</label>
            <input type="email" id="emailInput" placeholder="Contoh: 150203036@student.umri.ac.id" required>
          </div>
        
          <button type="submit" class="btn btn-primary">Kirim Link Reset</button>
        </form>
      </div>

      <div id="successView" class="page-view" style="display:none">
        <h2 class="form-title">Link Terkirim</h1>
        <p>Silakan periksa kotak masuk (atau spam) email Anda untuk instruksi selanjutnya.</p>
        <a class="btn btn-primary" href="#/login">Ke Halaman Login</a>
      </div>
    `
  },

  async afterRender() {
    document.getElementById('passwordInput').value = '';
    const lastNIM = localStorage.getItem('lastUsedNIM');
    if (lastNIM) {
      document.getElementById('nimInput').value = lastNIM;
    }
    
    document.getElementById('loginForm').addEventListener('submit', event => {
      event.preventDefault();
      login();
    });
  }
};

export default ForgotPasswordPage;

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
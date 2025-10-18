import CallApi from "../../../data/api.js";

const RegisterPage = {
  async render() {
    return `
      <div id="registerView" class="page-view">
        <h1 class="form-title">Daftar</h1>

        <form id="registerForm" class="form-container">
          <div class="form-group">
            <label for="nim_reg">NIM</label>
            <input type="number" id="nim_reg" required>
            <div id="nimWarning" class="invalid-feedback" style="display:none;"></div>
          </div>

          <div class="form-group">
            <label for="nama_reg">Nama Lengkap</label>
            <input type="text" id="nama_reg" required>
          </div>

          <div class="form-group">
            <label for="prodi_reg">Program Studi</label>
            <input type="text" id="prodi_reg" required>
          </div>

          <div class="form-group">
            <label for="password_reg">Password</label>
            <input type="password" id="password_reg" required>
          </div>

          <div class="form-group">
            <label for="confirm_password_reg">Konfirmasi Password</label>
            <input type="password" id="confirm_password_reg" required>
          </div>

          <button type="submit" class="btn-primary">Daftar</button>
        </form>
      </div>

      <div id="registerSuccessView" style="display:none;" class="text-center">
        <div class="alert alert-success" role="alert">Pendaftaran Berhasil!</div>
        <p>Silakan klik tombol di bawah untuk masuk ke halaman login.</p>
        <button class="btn btn-primary"><a href="#/login">Ke Halaman Login</a></button>
      </div>
    `
  },

  async afterRender() {
    document.getElementById('registerForm').addEventListener('submit', event => {
      event.preventDefault();
      registerUser();
    });
  }
};

export default RegisterPage;

async function registerUser() {
  const nim = document.getElementById('nim_reg').value;
  const nama = document.getElementById('nama_reg').value;
  const prodi = document.getElementById('prodi_reg').value;
  const password = document.getElementById('password_reg').value;
  const confirmPassword = document.getElementById('confirm_password_reg').value;

  if (password !== confirmPassword) {
    alert('Password dan Konfirmasi Password tidak cocok!');
    return;
  }
  if (!nim || !nama || !prodi) {
    alert('Semua field wajib diisi!');
    return;
  }

  const registerButton = document.querySelector('.form-container button');
  registerButton.disabled = true;
  registerButton.innerText = 'Mendaftar...';

  try {
    const payload = { nim, nama, prodi, password };
    const response = await CallApi.callApi('register', payload);
    const nimInput = document.getElementById('nim_reg');
    const nimWarning = document.getElementById('nimWarning');

    if (response.status === 'success') {
      document.getElementById('registerForm').reset();
      document.getElementById('registerView').style.display = 'none';
      document.getElementById('registerSuccessView').style.display = 'block';
    } else if (response.status === 'duplicate') {
      nimWarning.innerText = response.message;
      nimWarning.style.display = 'block';
      nimInput.classList.add('is-invalid');
    } else {
      alert(response.message);
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}
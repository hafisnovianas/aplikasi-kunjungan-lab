import CallApi from "../../../data/api.js";

const RegisterPage = {
  async render() {
    return `
      <div id="registerView">
        <h4 class="mb-3">Pendaftaran Mahasiswa</h4>
        <form id="registerForm">
          <div class="mb-3">
            <label for="nim_reg" class="form-label">NIM</label>
            <input type="number" class="form-control" id="nim_reg" required>
            <div id="nimWarning" class="form-text text-danger" style="display: none;"></div>
          </div>
          <div class="mb-3">
            <label for="nama_reg" class="form-label">Nama Lengkap</label>
            <input type="text" class="form-control" id="nama_reg" required>
          </div>
          <div class="mb-3">
            <label for="prodi_reg" class="form-label">Program Studi</label>
            <input type="text" class="form-control" id="prodi_reg" value="Fisika" required>
          </div>
          <div class="mb-3">
            <label for="password_reg" class="form-label">Password</label>
            <input type="password" class="form-control" id="password_reg" required>
          </div>
          <div class="mb-3">
            <label for="confirm_password_reg" class="form-label">Konfirmasi Password</label>
            <input type="password" class="form-control" id="confirm_password_reg" required>
          </div>
          <button type="submit" class="btn btn-success">Daftar</button>
          <button type="button" class="btn btn-secondary"><a href="#/home">Kembali</a></button>
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
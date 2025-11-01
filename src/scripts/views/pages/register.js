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
            <input type="text" id="prodi_reg" placeholder="Masukkan Prodi Asal" required>
          </div>

          <div class="form-group">
            <label for="email_reg">Email</label>
            <input type="email" id="email_reg" placeholder="masukkan email" required>
            <div id="emailWarning" class="invalid-feedback" style="display:none;"></div>
          </div>

          <div class="form-group">
            <label for="password_reg">Password</label>
            <input type="password" id="password_reg" required>
          </div>

          <div class="form-group">
            <label for="confirm_password_reg">Konfirmasi Password</label>
            <input type="password" id="confirm_password_reg" required>
          </div>

          <button type="submit" class="btn btn-primary">Daftar</button>
        </form>
      </div>

      <div id="registerSuccessView" style="display:none;" class="text-center">
        <div class="alert alert-success" role="alert">Pendaftaran Berhasil!</div>
        <p>Silakan klik tombol di bawah untuk masuk ke halaman login.</p>
        <a class="btn btn-primary" href="#/login">Ke Halaman Login</a>
      </div>
    `
  },

  async afterRender() {
    document.getElementById('registerForm').addEventListener('submit', event => {
      event.preventDefault();
      this._registerUser();
    });
  },

  async _registerUser() {
    const nim = document.getElementById('nim_reg').value;
    const nama = document.getElementById('nama_reg').value;
    const prodi = document.getElementById('prodi_reg').value;
    const email = document.getElementById('email_reg').value.trim().toLowerCase();
    const password = document.getElementById('password_reg').value;
    const confirmPassword = document.getElementById('confirm_password_reg').value;

    const nimElement = document.getElementById('nim_reg');
    const nimWarning = document.getElementById('nimWarning');
    const emailElement = document.getElementById('email_reg');
    const emailWarning = document.getElementById('emailWarning');

    nimElement.classList.remove('is-invalid');
    nimWarning.style.display = 'none';
    emailElement.classList.remove('is-invalid');
    emailWarning.style.display = 'none';

    // const campusEmailRegex = /^[a-zA-Z0-9._%+-]+@student\.umri\.ac\.id$/i;
    // if (email && !campusEmailRegex.test(email)) {
    //   emailWarning.innerText = 'Gunakan email @student.umri.ac.id';
    //   emailWarning.style.display = 'block';
    //   emailElement.classList.add('is-invalid');
    //   return;
    // }

    if (password !== confirmPassword) {
      alert('Password dan Konfirmasi Password tidak cocok!');
      return;
    }
    if (!nim || !nama || !prodi || !email || !password || !confirmPassword) {
      alert('Semua field wajib diisi!');
      return;
    }

    const registerButton = document.querySelector('.form-container button');
    registerButton.disabled = true;
    registerButton.innerText = 'Mendaftar...';

    try {
      const payload = { nim, nama, prodi, email, password };
      const response = await CallApi.callApi('register', payload);

      if (response.status === 'success') {
        document.getElementById('registerForm').reset();
        document.getElementById('registerView').style.display = 'none';
        document.getElementById('registerSuccessView').style.display = 'block';
      } else if (response.status === 'duplicate') {
        nimWarning.innerText = response.message;
        nimWarning.style.display = 'block';
        nimElement.classList.add('is-invalid');
      } else if (response.status === 'email duplicate') {
        emailWarning.innerText = response.message;
        emailWarning.style.display = 'block';
        emailElement.classList.add('is-invalid');
      } else {
        alert(response.message);
      } 
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      registerButton.disabled = false;
      registerButton.innerText = 'Daftar';
    }
  }
};

export default RegisterPage;


// !! PENTING !! URL Web App Anda
const API_URL = 'https://script.google.com/macros/s/AKfycbzdHLktOBjXDRTE1snxpqLgrpu7FyZzw2Fl0PA_MupPItiX_y05sW-TaE_XSkyrY58s/exec'; 

let userNIM = null;
const validQRCodeText = 'KUNJUNGAN_LAB_KOMPUTER_2025';

// --- FUNGSI UTAMA (LOGIN, REGISTER, API) ---

async function callApi(action, payload) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, payload }),
    redirect: 'follow'
  });
  return response.json();
}

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
    const response = await callApi('register', payload);
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

async function login(event) {
  const nimInput = document.getElementById('nimInput');
  const nim = nimInput.value;
  const password = document.getElementById('passwordInput').value;
  if (!nim || !password) {
    alert('NIM dan Password tidak boleh kosong.');
    return;
  }

  const loginButton = event.target;
  loginButton.disabled = true;
  loginButton.innerText = 'Mengecek...';

  try {
    const payload = { nim, password };
    const response = await callApi('login', payload);
    const loginWarning = document.getElementById('loginWarning');

    if (response.status === 'success') {
      userNIM = nim;
      nimInput.classList.remove('is-invalid');
      loginWarning.style.display = 'none';

      localStorage.setItem('lastUsedNIM', nim);

      showScanView(response.nama);
    } else {
      nimInput.classList.add('is-invalid');
      loginWarning.innerText = response.message;
      loginWarning.style.display = 'block';
    }
  } catch (error) {
    alert('Error saat validasi: ' + error.message);
  } finally {
    loginButton.disabled = false;
    loginButton.innerText = 'Masuk';
  }
}

// --- FUNGSI TAMPILAN (VIEW) ---

function showLoginView() {
  document.getElementById('loginView').style.display = 'block';
  document.getElementById('registerView').style.display = 'none';
  document.getElementById('successView').style.display = 'none';
  document.getElementById('registerSuccessView').style.display = 'none';
  document.getElementById('scanView').style.display = 'none';
  document.getElementById('purposeView').style.display = 'none';

  const nimLoginInput = document.getElementById('nimInput');
  nimLoginInput.addEventListener('input', function() {
    document.getElementById('loginWarning').style.display = 'none';
    nimLoginInput.classList.remove('is-invalid');
  });
}

function showRegisterView() {
  document.getElementById('loginView').style.display = 'none';
  document.getElementById('registerView').style.display = 'block';
  document.getElementById('registerSuccessView').style.display = 'none';
}

function showScanView(nama) {
    document.getElementById('loginView').style.display = 'none';
    document.getElementById('purposeView').style.display = 'none';
    document.getElementById('scanView').style.display = 'block';
    document.getElementById('welcomeMessage').innerText = `Selamat Datang, ${nama}!`;
}

async function submitPurpose() {
  const keperluan = document.getElementById('purposeInput').value;
  if (!keperluan.trim()) {
      alert('Harap isi keperluan Anda!');
      return;
  }

  // Ambil elemen tombol untuk dimanipulasi
  const submitButton = document.querySelector('#purposeView button');
  
  // Non-aktifkan tombol dan textarea, lalu ubah teks tombol
  submitButton.disabled = true;
  submitButton.innerText = 'Mengirim data...';
  document.getElementById('purposeInput').disabled = true;

  try {
      const payload = { nim: userNIM, keperluan: keperluan };
      const response = await callApi('recordVisit', payload);

      if (response.status === 'success') {
          // Jika berhasil, baru pindah ke halaman sukses
          document.getElementById('purposeView').style.display = 'none';
          const successDiv = document.getElementById('successMessage');
          successDiv.className = 'alert alert-success';
          successDiv.innerText = response.message;
          document.getElementById('successView').style.display = 'block';
      } else {
          // Jika gagal dari server, tampilkan pesan error dan aktifkan kembali form
          alert('Terjadi kesalahan: ' + response.message);
          submitButton.disabled = false;
          submitButton.innerText = 'Submit Kunjungan';
          document.getElementById('purposeInput').disabled = false;
      }
  } catch (error) {
      // Jika terjadi error koneksi, tampilkan pesan dan aktifkan kembali form
      alert('Gagal terhubung ke server. Silakan coba lagi.');
      submitButton.disabled = false;
      submitButton.innerText = 'Submit Kunjungan';
      document.getElementById('purposeInput').disabled = false;
  }
}

function logout() {
  userNIM = null;
  showLoginView();
  document.getElementById('passwordInput').value = '';

  const scanButton = document.querySelector('#scanView button');
  if (scanButton) {
    scanButton.disabled = false;
    scanButton.innerText = 'Mulai Pindai QR';
  }

  document.getElementById('qr-input-file').value = null;
}


// --- FUNGSI SCANNER (Metode File Capture) ---

function triggerFileUpload() {
    document.getElementById('qr-input-file').click();
}

document.getElementById('qr-input-file').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) { return; }

    const scanButton = document.querySelector('#scanView button');
    scanButton.disabled = true;
    scanButton.innerText = 'Memproses Gambar...';

    const html5QrCode = new Html5Qrcode("reader");
    html5QrCode.scanFile(file, true)
    .then(decodedText => {
        handleSuccessfulScan(decodedText);
    })
    .catch(err => {
        alert(`Error: Tidak dapat menemukan QR Code di gambar. Silakan coba lagi.`);
        scanButton.disabled = false;
        scanButton.innerText = 'Mulai Pindai QR';
    })
    .finally(() => {
      e.target.value = null;
    });
  });

function handleSuccessfulScan(decodedText) {
    if (decodedText !== validQRCodeText) {
        alert("QR Code tidak valid.");
        const scanButton = document.querySelector('#scanView button');
        scanButton.disabled = false;
        scanButton.innerText = 'Mulai Pindai QR';
        return;
    }
    
    document.getElementById('scanView').style.display = 'none';
    document.getElementById('purposeView').style.display = 'block';
    
    // Memberi fokus ke textarea agar keyboard langsung muncul
    setTimeout(() => {
        document.getElementById('purposeInput').focus();
    }, 100); 
}

// --- LOGIKA SAAT HALAMAN DIMUAT ---
document.addEventListener('DOMContentLoaded', () => {
  const lastNIM = localStorage.getItem('lastUsedNIM');
  if (lastNIM) {
    const nimInput = document.getElementById('nimInput');
    nimInput.value = lastNIM;
    // Untuk kenyamanan, langsung fokuskan ke field password
    document.getElementById('passwordInput').focus();
  }
});
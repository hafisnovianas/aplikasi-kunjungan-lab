// javascript.js (Versi Modifikasi untuk Netlify)

// !! PENTING !! Ganti dengan URL Web App Anda dari Langkah 2
const API_URL = 'https://script.google.com/macros/s/xxxxx/exec'; 

let userNIM = null;
const validQRCodeText = 'KUNJUNGAN_LAB_KOMPUTER_2025';

// Fungsi untuk memanggil API
async function callApi(action, payload) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8', // Apps Script doPost seringkali lebih stabil dengan text/plain
    },
    body: JSON.stringify({ action, payload }),
    redirect: 'follow'
  });
  return response.json();
}

// Fungsi Pendaftaran (diubah menggunakan fetch)
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

// Fungsi Login (diubah menggunakan fetch)
async function login(event) {
  const nim = document.getElementById('nimInput').value;
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

    const nimInput = document.getElementById('nimInput');
    const loginWarning = document.getElementById('loginWarning');

    if (response.status === 'success') {
      userNIM = nim;
      nimInput.classList.remove('is-invalid');
      loginWarning.style.display = 'none';
      showScanView(nim, response.nama);
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

// Fungsi Submit Keperluan (diubah menggunakan fetch)
async function submitPurpose() {
  const keperluan = document.getElementById('purposeInput').value;
  if (!keperluan) {
    alert('Harap isi keperluan Anda.');
    return;
  }

  document.getElementById('purposeView').style.display = 'none';
  const successDiv = document.getElementById('successMessage');
  successDiv.className = 'alert alert-info';
  successDiv.innerText = 'Mengirim data...';
  document.getElementById('successView').style.display = 'block';

  try {
    const payload = { nim: userNIM, keperluan: keperluan };
    const response = await callApi('recordVisit', payload);

    if (response.status === 'success') {
      successDiv.className = 'alert alert-success';
    } else {
      successDiv.className = 'alert alert-danger';
    }
    successDiv.innerText = response.message;
  } catch (error) {
    successDiv.className = 'alert alert-danger';
    successDiv.innerText = 'Gagal mengirim data: ' + error.message;
  }
}


// --- FUNGSI TAMPILAN DAN SCANNER (TIDAK ADA PERUBAHAN) ---
// Semua fungsi di bawah ini tetap sama persis seperti kode Anda sebelumnya.
// showLoginView, showRegisterView, showScanView, logout, startScanner, onScanSuccess, onScanError

function showLoginView() {
  document.getElementById('loginView').style.display = 'block';
  document.getElementById('registerView').style.display = 'none';
  document.getElementById('scanView').style.display = 'none';
  document.getElementById('successView').style.display = 'none';
  document.getElementById('registerSuccessView').style.display = 'none';
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
  document.getElementById('scanView').style.display = 'none';
  document.getElementById('registerSuccessView').style.display = 'none';

  const nimInput = document.getElementById('nim_reg');
  nimInput.addEventListener('input', function() {
    document.getElementById('nimWarning').style.display = 'none';
    nimInput.classList.remove('is-invalid');
  });
}

function showScanView(nim, nama) {
  document.getElementById('loginView').style.display = 'none';
  document.getElementById('registerView').style.display = 'none';
  document.getElementById('scanView').style.display = 'block';
  document.getElementById('welcomeMessage').innerText = `Selamat Datang, ${nama}!`;
  startScanner();
}

function logout() {
  userNIM = null;
  if (html5QrCode && html5QrCode.isScanning) {
    html5QrCode.stop();
  }
  showLoginView();
  document.getElementById('nimInput').value = '';
  document.getElementById('passwordInput').value = ''; // Tambahkan ini untuk membersihkan field password
}

let html5QrCode;
function startScanner() {
  html5QrCode = new Html5Qrcode("reader");
  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10 },
    onScanSuccess,
    (errorMessage) => { /* Abaikan */ }
  ).catch((err) => {
    alert("Kamera tidak dapat diakses. Pastikan Anda sudah memberikan izin.");
  });
}

function onScanSuccess(decodedText, decodedResult) {
  if (decodedText === validQRCodeText) {
    html5QrCode.stop().then(ignore => {
      document.getElementById('scanView').style.display = 'none';
      document.getElementById('purposeView').style.display = 'block';
    }).catch(err => console.error("Gagal menghentikan kamera.", err));
  }
}

function onScanError(errorMessage) { /* abaikan */ }
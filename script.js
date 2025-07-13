// !! PENTING !! Ganti dengan URL Web App Anda
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
      showScanAndPurposeView(response.nama);
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
  document.getElementById('scanAndPurposeView').style.display = 'none';

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

  const nimInput = document.getElementById('nim_reg');
  nimInput.addEventListener('input', function() {
    document.getElementById('nimWarning').style.display = 'none';
    nimInput.classList.remove('is-invalid');
  });
}

function showScanAndPurposeView(nama) {
  document.getElementById('loginView').style.display = 'none';
  document.getElementById('successView').style.display = 'none';
  document.getElementById('scanAndPurposeView').style.display = 'block';
  document.getElementById('welcomeMessageCombined').innerText = `Selamat Datang, ${nama}!`;

  document.querySelector('#scanAndPurposeView button').style.display = 'block';
  document.getElementById('reader').style.display = 'none';
}

function logout() {
  userNIM = null;
  if (html5QrCode && html5QrCode.isScanning) {
    html5QrCode.stop();
  }
  showLoginView();
  document.getElementById('nimInput').value = '';
  document.getElementById('passwordInput').value = '';
}

// --- FUNGSI SCANNER ---

let html5QrCode;
function startScanner() {
  const scanButton = document.querySelector('#scanAndPurposeView button');
  const readerDiv = document.getElementById('reader');

  // 1. Ubah tampilan UI terlebih dahulu
  scanButton.style.display = 'none';
  readerDiv.style.display = 'block';

  // 2. Beri jeda singkat sebelum meminta izin kamera
  setTimeout(() => {
    html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start(
      { facingMode: "environment" }, { fps: 10 },
      onScanSuccess,
      (errorMessage) => { /* Abaikan */ }
    ).catch((err) => {
      // Jika gagal, kembalikan UI seperti semula
      alert("Gagal mengakses kamera. Pastikan Anda sudah memberikan izin.");
      scanButton.style.display = 'block';
      readerDiv.style.display = 'none';
    });
  }, 200); // Jeda selama 0.2 detik
}

async function onScanSuccess(decodedText, decodedResult) {
  if (decodedText !== validQRCodeText) { return; }

  await html5QrCode.stop();
  const keperluan = document.getElementById('purposeInput').value;

  if (!keperluan || keperluan.trim() === '') {
    alert('Harap isi keperluan kunjungan Anda terlebih dahulu!');
    document.querySelector('#scanAndPurposeView button').style.display = 'block';
    document.getElementById('reader').style.display = 'none';
    return;
  }

  document.getElementById('scanAndPurposeView').style.display = 'none';
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
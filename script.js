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

// Ganti fungsi login() Anda dengan yang ini
async function login(event) {
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

  const loginButton = document.querySelector('#loginForm button');
  loginButton.disabled = true;
  loginButton.innerText = 'Mengecek...';

  try {
    const payload = { nim, password };
    const response = await callApi('login', payload);

    if (response.status === 'success') {
      userNIM = nim;
      localStorage.setItem('lastUsedNIM', nim);
      showVisitView(response.nama);
    } else {
      // Logika baru untuk menampilkan error yang lebih spesifik
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

// --- FUNGSI TAMPILAN (VIEW) ---

function showLoginView() {
  document.getElementById('loginView').style.display = 'block';
  document.getElementById('registerView').style.display = 'none';
  document.getElementById('successView').style.display = 'none';
  document.getElementById('registerSuccessView').style.display = 'none';
  document.getElementById('visitView').style.display = 'none'; // Ganti ke visitView
  document.getElementById('passwordInput').value = '';
}

function showRegisterView() {
  document.getElementById('loginView').style.display = 'none';
  document.getElementById('registerView').style.display = 'block';
  document.getElementById('registerSuccessView').style.display = 'none';
}

function showVisitView(nama) {
  document.getElementById('loginView').style.display = 'none';
  document.getElementById('visitView').style.display = 'block';
  document.getElementById('welcomeMessage').innerText = `Selamat Datang, ${nama}!`;
}

function logout() {
  userNIM = null;
  showLoginView();
  
  // Reset form keperluan
  document.getElementById('purposeDropdown').value = "";
  document.getElementById('otherPurposeInput').value = "";
  document.getElementById('otherPurposeContainer').style.display = 'none';
  
  // Reset tombol di visitView
  const visitButton = document.querySelector('#visitView button');
  if(visitButton) {
    visitButton.disabled = false;
    visitButton.innerText = 'Pindai QR & Submit Kunjungan';
  }
}

// --- FUNGSI SCANNER (Metode File Capture) ---
const html5QrCode = new Html5Qrcode("reader");

function processVisit() {
  // 1. Validasi Input Keperluan
  const dropdown = document.getElementById('purposeDropdown');
  const otherInput = document.getElementById('otherPurposeInput');
  let keperluan = dropdown.value;

  if (!keperluan) {
      alert('Harap pilih salah satu keperluan dari daftar.');
      return;
  }

  if (keperluan === 'Lainnya') {
      keperluan = otherInput.value.trim().toLowerCase();
      if (!keperluan) {
          alert('Harap isi keperluan Anda di kolom yang tersedia.');
          return;
      }
      localStorage.setItem('lastOtherPurpose', keperluan);
  }
  
  // 2. Memicu Kamera (File Capture)
  const fileInput = document.getElementById('qr-input-file');
  
  // Buat event listener sekali pakai untuk menangani file yang dipilih
  fileInput.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;

      const visitButton = document.querySelector('#visitView button');
      visitButton.disabled = true;
      visitButton.innerText = 'Memproses...';

      // 3. Pindai QR dari file
      html5QrCode.scanFile(file, true)
      .then(decodedText => {
          if (decodedText !== validQRCodeText) {
              throw new Error("QR Code tidak valid.");
          }
          // 4. Kirim semua data ke server
          return callApi('recordVisit', { nim: userNIM, keperluan: keperluan });
      })
      .then(response => {
          // 5. Tampilkan Halaman Sukses
          if (response.status === 'success') {
              document.getElementById('visitView').style.display = 'none';
              const successDiv = document.getElementById('successMessage');
              successDiv.className = 'alert alert-success';
              successDiv.innerText = response.message;
              document.getElementById('successView').style.display = 'block';
          } else {
              throw new Error(response.message);
          }
      })
      .catch(err => {
          alert('Error: ' + err.message);
          visitButton.disabled = false;
          visitButton.innerText = 'Pindai QR & Submit Kunjungan';
      })
      .finally(() => {
          fileInput.value = null; // Reset input file
      });
  };
  
  fileInput.click(); // Buka dialog kamera/file
}

/*
document.getElementById('qr-input-file').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) { return; }
    const scanButton = document.querySelector('#scanView button');
    scanButton.disabled = true;
    scanButton.innerText = 'Memproses Gambar...';
    html5QrCode.scanFile(file, true)
    .then(decodedText => { handleSuccessfulScan(decodedText); })
    .catch(err => {
        alert(`Error: Tidak dapat menemukan QR Code di gambar.`);
        scanButton.disabled = false;
        scanButton.innerText = 'Mulai Pindai QR';
    })
    .finally(() => { e.target.value = null; });
});
*/

// --- LOGIKA SAAT HALAMAN DIMUAT ---
document.addEventListener('DOMContentLoaded', () => {
  // Kode untuk mengingat NIM
  const lastNIM = localStorage.getItem('lastUsedNIM');
  if (lastNIM) {
    document.getElementById('nimInput').value = lastNIM;
    document.getElementById('passwordInput').focus();
  }

  // Menangani submit form login (baik via klik tombol atau Enter)
  document.getElementById('loginForm').addEventListener('submit', event => {
    event.preventDefault(); // Mencegah halaman reload
    login(event); // Panggil fungsi login yang sudah ada
  });
});

function checkOtherOption() {
  const dropdown = document.getElementById('purposeDropdown');
  const otherContainer = document.getElementById('otherPurposeContainer');
  const otherInput = document.getElementById('otherPurposeInput');

  if (dropdown.value === 'Lainnya') {
    otherContainer.style.display = 'block';
    
    const lastPurpose = localStorage.getItem('lastOtherPurpose');
    if (lastPurpose) {
      otherInput.value = lastPurpose;
    }
    otherInput.focus();
  } else {
    otherContainer.style.display = 'none';
  }
}
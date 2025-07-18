// !! PENTING !! URL Web App Anda
const API_URL = 'https://script.google.com/macros/s/AKfycbzdHLktOBjXDRTE1snxpqLgrpu7FyZzw2Fl0PA_MupPItiX_y05sW-TaE_XSkyrY58s/exec'; 

let userNIM = null;
const validQRCodeText = 'KUNJUNGAN_LAB_KOMPUTER_2025';

// --- FUNGSI UTAMA (LOGIN, REGISTER, API) ---
async function callApi(action, payload) { /* ... (Tidak berubah) ... */ }

async function registerUser() {
    const nimInput = document.getElementById('nim_reg');
    const namaInput = document.getElementById('nama_reg');
    const prodiInput = document.getElementById('prodi_reg');
    const passwordInput = document.getElementById('password_reg');
    const confirmPasswordInput = document.getElementById('confirm_password_reg');
    const confirmPasswordError = document.getElementById('confirmPasswordError');

    confirmPasswordInput.classList.remove('is-invalid');
    confirmPasswordError.innerText = '';

    if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordInput.classList.add('is-invalid');
        confirmPasswordError.innerText = 'Password dan Konfirmasi Password tidak cocok!';
        return;
    }
    if (!nimInput.value || !namaInput.value || !prodiInput.value) {
        alert('Harap lengkapi semua field pendaftaran.');
        return;
    }
    // ... sisa logika try-catch registerUser Anda, bisa tetap menggunakan alert untuk notifikasi akhir ...
}

async function login(event) { /* ... (Tidak berubah, sudah bagus) ... */ }

// --- FUNGSI TAMPILAN (VIEW) ---
function showLoginView() { /* ... (Tidak berubah) ... */ }
function showRegisterView() { /* ... (Tidak berubah) ... */ }
function showScanView(nama) { /* ... (Tidak berubah) ... */ }

async function submitPurpose() {
    const dropdown = document.getElementById('purposeDropdown');
    const otherInput = document.getElementById('otherPurposeInput');
    const dropdownError = document.getElementById('purposeDropdownError');
    const otherError = document.getElementById('otherPurposeError');
    let keperluan = dropdown.value;

    dropdown.classList.remove('is-invalid');
    otherInput.classList.remove('is-invalid');
    dropdownError.innerText = '';
    otherError.innerText = '';

    if (!keperluan) {
        dropdown.classList.add('is-invalid');
        dropdownError.innerText = 'Harap pilih salah satu keperluan dari daftar.';
        return;
    }

    if (keperluan === 'Lainnya') {
        keperluan = otherInput.value.trim().toLowerCase();
        if (!keperluan) {
            otherInput.classList.add('is-invalid');
            otherError.innerText = 'Harap isi keperluan Anda di kolom yang tersedia.';
            return;
        }
        // Simpan jawaban "Lainnya" yang terakhir
        localStorage.setItem('lastOtherPurpose', keperluan);
    }

    const submitButton = document.querySelector('#purposeView button');
    submitButton.disabled = true;
    submitButton.innerText = 'Mengirim data...';
    dropdown.disabled = true;
    otherInput.disabled = true;

    try {
        const payload = { nim: userNIM, keperluan: keperluan };
        const response = await callApi('recordVisit', payload);
        if (response.status === 'success') {
            document.getElementById('purposeView').style.display = 'none';
            const successDiv = document.getElementById('successMessage');
            successDiv.className = 'alert alert-success';
            successDiv.innerText = response.message;
            document.getElementById('successView').style.display = 'block';
        } else {
            alert('Terjadi kesalahan: ' + response.message); // Alert di sini oke untuk error tak terduga
            submitButton.disabled = false;
            submitButton.innerText = 'Submit Kunjungan';
            dropdown.disabled = false;
            otherInput.disabled = false;
        }
    } catch (error) {
        alert('Gagal terhubung ke server. Silakan coba lagi.'); // Alert di sini oke
        submitButton.disabled = false;
        submitButton.innerText = 'Submit Kunjungan';
        dropdown.disabled = false;
        otherInput.disabled = false;
    }
}

function logout() { /* ... (Tidak berubah, sudah bagus) ... */ }

// --- FUNGSI SCANNER (Metode File Capture) ---
const html5QrCode = new Html5Qrcode("reader");

function triggerFileUpload() { document.getElementById('qr-input-file').click(); }

document.getElementById('qr-input-file').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) { return; }
    
    const scanButton = document.querySelector('#scanView button');
    const scanError = document.getElementById('scanError');
    scanButton.disabled = true;
    scanButton.innerText = 'Memproses Gambar...';
    scanError.innerText = '';

    html5QrCode.scanFile(file, true)
    .then(decodedText => { handleSuccessfulScan(decodedText); })
    .catch(err => {
        scanError.innerText = 'Error: Tidak dapat menemukan QR Code di gambar. Silakan coba lagi.';
        scanButton.disabled = false;
        scanButton.innerText = 'Mulai Pindai QR';
    })
    .finally(() => { e.target.value = null; });
});

function handleSuccessfulScan(decodedText) {
    const scanButton = document.querySelector('#scanView button');
    const scanError = document.getElementById('scanError');
    
    if (decodedText !== validQRCodeText) {
        scanError.innerText = "QR Code tidak valid.";
        scanButton.disabled = false;
        scanButton.innerText = 'Mulai Pindai QR';
        return;
    }
    
    scanError.innerText = '';
    document.getElementById('scanView').style.display = 'none';
    document.getElementById('purposeView').style.display = 'block';
    setTimeout(() => { document.getElementById('purposeDropdown').focus(); }, 100); 
}

// --- LOGIKA LAINNYA ---
document.addEventListener('DOMContentLoaded', () => {
    const lastNIM = localStorage.getItem('lastUsedNIM');
    if (lastNIM) {
        document.getElementById('nimInput').value = lastNIM;
        document.getElementById('passwordInput').focus();
    }
    document.getElementById('loginForm').addEventListener('submit', event => {
        event.preventDefault();
        login(event);
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
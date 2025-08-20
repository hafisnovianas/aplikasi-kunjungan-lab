const API_URL = 'https://script.google.com/macros/s/AKfycbzdHLktOBjXDRTE1snxpqLgrpu7FyZzw2Fl0PA_MupPItiX_y05sW-TaE_XSkyrY58s/exec'; 
let userNIM = null;

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
      localStorage.setItem('lastUsedNIM', nim);
      localStorage.setItem('kunjunganLabToken', response.token);
      showDashboardView(response.nama);
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

// --- FUNGSI TAMPILAN (VIEW) --//
function showLoginView() {
  reset();
  document.getElementById('loginView').style.display = 'block';
}

function showRegisterView() {
  reset();
  document.getElementById('registerView').style.display = 'block';
}

function showVisitView() {
  reset();
  document.getElementById('visitView').style.display = 'block';
}

function hideAll() {
  document.getElementById('loginView').style.display = 'none';
  document.getElementById('registerView').style.display = 'none';
  document.getElementById('registerSuccessView').style.display = 'none';
  document.getElementById('visitView').style.display = 'none';
  document.getElementById('otherPurposeContainer').style.display = 'none';
  document.getElementById('dashboardView').style.display = 'none';
  document.getElementById('successView').style.display = 'none';
}

function logout() {
  localStorage.removeItem('kunjunganLabToken');
  checkLoginSession();
}

function reset() {
  hideAll();
  userNIM = null;
  document.getElementById('purposeDropdown').value = "";
  document.getElementById('otherPurposeInput').value = "";
  document.getElementById('passwordInput').value = '';

  const visitButton = document.querySelector('#visitView button');
  if(visitButton) {
    visitButton.disabled = false;
    visitButton.innerText = 'Pindai QR';
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
  const visitButton = document.querySelector('#visitView button');
  
  // Buat event listener sekali pakai untuk menangani file yang dipilih
  fileInput.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;

      visitButton.disabled = true;
      visitButton.innerText = 'Memproses...';

      // 3. Pindai QR dari file
      html5QrCode.scanFile(file, true)
      .then(decodedText => {
          const token = localStorage.getItem('kunjunganLabToken');
          if (!token) {
              alert('Sesi Anda tidak ditemukan. Silakan login kembali.');
              logout();
              throw new Error("Sesi tidak ditemukan.");
          }

          // 4. Kirim semua data ke server
          const payload = { 
            token: token,
            keperluan: keperluan, 
            qrData: decodedText
          };
          return callApi('recordVisit', payload);
      })
      .then(response => {
          // 5. Tampilkan Halaman Sukses
          if (response.status === 'success') {
              document.getElementById('visitView').style.display = 'none';
              const successDiv = document.getElementById('successMessage');
              successDiv.className = 'alert alert-success';
              successDiv.innerText = response.message;
              document.getElementById('successView').style.display = 'block';
          } else if (response.message && response.message.toLowerCase().includes('sesi')) {
            // Jika error spesifik tentang sesi, beri tahu pengguna lalu logout
            alert(response.message); 
            logout();
          } else {
              throw new Error(response.message);
          }
      })
      .catch(err => {
          alert('Error: ' + err.message);
          visitButton.disabled = false;
          visitButton.innerText = 'Pindai QR';
      })
      .finally(() => {
          fileInput.value = null; // Reset input file
      });
  };
  
  fileInput.click(); // Buka dialog kamera/file
}

// --- FUNGSI PEMERIKSA SESI (BARU & LEBIH BAIK) ---
async function checkLoginSession() {
  hideAll()
  const storedToken = localStorage.getItem('kunjunganLabToken');
  const loadingView = document.getElementById('loadingView');
  loadingView.style.display = 'block';

  if (storedToken) {
    try {
      const response = await callApi('validateToken', { token: storedToken });
      
      if (response.status === 'success') {
        userNIM = response.nim; // Set variabel global NIM
        showDashboardView(response.nama);
      } else {
        localStorage.removeItem('kunjunganLabToken');
        showLoginView()
      }
    } catch (error) {
      console.error("Gagal memvalidasi token:", error);
      showLoginView();
    } 
  } else {
    showLoginView();
  }
  loadingView.style.display = 'none';
}

// --- LOGIKA SAAT HALAMAN DIMUAT ---
document.addEventListener('DOMContentLoaded', () => {
  checkLoginSession();
  populatePurposeDropdown();

  // Kode untuk mengingat NIM
  const lastNIM = localStorage.getItem('lastUsedNIM');
  if (lastNIM) {
    document.getElementById('nimInput').value = lastNIM;
    document.getElementById('passwordInput').focus();
  }

  // Menangani submit form login (baik via klik tombol atau Enter)
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
      //otherInput.value = lastPurpose;
    }
    otherInput.focus();
  } else {
    otherContainer.style.display = 'none';
  }
}

async function populatePurposeDropdown() {
  try {
    const response = await callApi('getOptions');
    if (response.status === 'success') {
      const dropdown = document.getElementById('purposeDropdown');
      dropdown.innerHTML = '<option selected disabled value="">-- Pilih Keperluan --</option>';
      
      // Tambahkan setiap opsi dari server
      response.data.forEach(optionText => {
        const option = document.createElement('option');
        option.value = optionText;
        option.innerText = optionText;
        dropdown.appendChild(option);
      });

      // Tambahkan opsi "Lainnya" secara manual di akhir
      const otherOption = document.createElement('option');
      otherOption.value = 'Lainnya';
      otherOption.innerText = 'Lainnya...';
      dropdown.appendChild(otherOption);
    }
  } catch (error) {
    console.error("Gagal memuat opsi keperluan:", error);

    const dropdown = document.getElementById('purposeDropdown');
    dropdown.innerHTML = '<option selected disabled value="">-- Gagal memuat --</option>';
  }
}

function showDashboardView(nama) {
    hideAll();
    document.getElementById('dashboardView').style.display = 'block';
    document.getElementById('dashboardWelcome').innerText = `Selamat Datang, ${nama}!`;
    loadHistory();
}

function goToVisitView() {
    hideAll();
    showVisitView();
}

async function loadHistory() {
    const historyContent = document.getElementById('historyContent');
    historyContent.innerHTML = '<p class="text-center">Memuat riwayat...</p>';

    try {
        const token = localStorage.getItem('kunjunganLabToken');
        if (!token) throw new Error("Token tidak ditemukan.");

        const response = await callApi('getHistory', { token: token });

        if (response.status === 'success') {
            historyContent.innerHTML = '';
            if (response.data.length === 0) {
                historyContent.innerHTML = '<p class="text-center">Anda belum memiliki riwayat kunjungan.</p>';
            } else {
                // Hanya tampilkan 5 riwayat terakhir di dashboard
                response.data.slice(0, 5).forEach(visit => {
                    const visitDate = new Date(visit.timestamp);
                    const formattedDate = visitDate.toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });
                    const item = document.createElement('div');
                    item.className = 'list-group-item';
                    item.innerHTML = `
                      <h6><b>${visit.purpose}</b></h6>
                      <small>${formattedDate}</small>
                    `;
                    historyContent.appendChild(item);
                });
            }
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        historyContent.innerHTML = `<p class="text-center text-danger">Gagal memuat riwayat.</p>`;
    }
}
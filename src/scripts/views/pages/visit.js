import CallApi from "../../../data/api.js";

const VisitPage = {
  async render() {
    return `
      <div id="visitView">
        <p>Silakan isi keperluan Anda, lalu pindai QR Code untuk mencatat kunjungan.</p>
        
        <div class="mb-3">
            <label for="purposeDropdown" class="form-label"><b>Keperluan Kunjungan</b></label>
            <select class="form-select" id="purposeDropdown" onchange="checkOtherOption()">
                <option selected disabled value="">-- Pilih Keperluan --</option>
            </select>
        </div>
        <div class="mb-3" id="otherPurposeContainer" style="display:none;">
            <label for="otherPurposeInput" class="form-label">Keperluan Lainnya:</label>
            <input type="text" class="form-control" id="otherPurposeInput" placeholder="Sebutkan keperluan Anda">
        </div>
    
        <div class="d-grid gap-2 mt-4">
            <button class="btn btn-success btn-lg">Pindai QR</button>
            <input type="file" id="qr-input-file" accept="image/*" capture="environment" style="display:none">
        </div>
        <div id="reader" style="display:none;"></div>
      </div>
    `
  },

  async afterRender() {
    populatePurposeDropdown();
    document.getElementById('visitView').querySelector('button').addEventListener('click',()=>{
      processVisit();
    })
  }
};

export default VisitPage;

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

async function populatePurposeDropdown() {
  try {
    const response = await CallApi.callApi('getOptions');
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
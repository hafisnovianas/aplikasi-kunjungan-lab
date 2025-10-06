import CallApi from "../../../data/api.js";
import { checkOtherOption } from "../../utils/form-utils.js";

const VisitPage = {
  async render() {
    return `
      <div id="visitView" class="page-view">
        <p>Silahkan isi keperluan Anda, lalu pindai QR Code</p>
        
        <div class="form-group">
            <label for="purposeDropdown" class="form-label">Keperluan Kunjungan</label>
            <select class="form-select" id="purposeDropdown">
                <option selected disabled value="">-- Pilih Keperluan --</option>
            </select>
        </div>

        <div id="otherPurposeContainer" class="form-group" style="display:none;">
            <label for="otherPurposeInput">Keperluan Lainnya:</label>
            <input type="text" id="otherPurposeInput" placeholder="Sebutkan keperluan Anda">
        </div>
    
        <div>
            <button class="btn-primary">Pindai QR</button>
            <input type="file" id="qr-input-file" accept="image/*" capture="environment" style="display:none">
        </div>

        <div id="reader" style="display:none;"></div>
      </div>

      <div id="successView" class="page-view" style="display:none">
        <div id="successMessage">jack</div>
        <a class="btn-primary" href="#/dashboard">kembali</a>
      </div>
    `
  },

  async afterRender() {
    resetInput()
    fillPurposeDropdown();

    const visitViewElement = document.getElementById('visitView')
    visitViewElement.querySelector('button').addEventListener('click', processVisit)

    const dropdownElement = visitViewElement.querySelector('#purposeDropdown')
    const otherPurposeContainer = visitViewElement.querySelector('#otherPurposeContainer')
    const otherPurposeInput = visitViewElement.querySelector('#otherPurposeInput')
    
    visitViewElement.querySelector('select').addEventListener('change', () => {
      checkOtherOption(dropdownElement, otherPurposeContainer, otherPurposeInput)
    })
  }
};

export default VisitPage;

function resetInput () {
  document.getElementById('purposeDropdown').value = "";
  document.getElementById('otherPurposeInput').value = "";
  const visitButton = document.querySelector('#visitView button');
  if(visitButton) {
    visitButton.disabled = false;
    visitButton.innerText = 'Pindai QR';
  }
}

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
  fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      visitButton.disabled = true;
      visitButton.innerText = 'Memproses...';

      // 3. Pindai QR dari file
      await scanHandle(file, keperluan);

      visitButton.disabled = false;
      visitButton.innerText = 'Pindai QR'; 
      fileInput.value = null; // Reset input file
  };
  
  fileInput.click(); // Buka dialog kamera/file
}

async function scanHandle(file, keperluan) {
  const html5QrCode = new window.Html5Qrcode("reader");
  try {
    const decodedText = await html5QrCode.scanFile(file, true);
    const token = localStorage.getItem('kunjunganLabToken');

    if (!token) {
      window.location.hash = '#/login';
      throw new Error("Sesi Anda tidak ditemukan. Silakan login kembali.");
    }

    const payload = { 
      token: token,
      keperluan: keperluan, 
      qrData: decodedText
    };

    const response = await CallApi.callApi('recordVisit', payload);

    if (response.status === 'success') {
      console.log('sukses woi')
      showSuccessView(response.message)
    } else {
      console.log(response.message)
      throw new Error(response.message);
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

async function fillPurposeDropdown() {
  const purposeDropdownItems = [
    "Praktikum",
    "Kuliah",
    "Penelitian",
    "Mengerjakan Tugas",
    "Mengerjakan Projek",
    "Bimbingan",
    "Asistensi"
  ]

  const dropdown = document.getElementById('purposeDropdown');
  dropdown.innerHTML = '<option selected disabled value="">-- Pilih Keperluan --</option>';
  
  if (!purposeDropdownItems) {
    dropdown.innerHTML = '<option selected disabled value="">-- Gagal memuat --</option>';
    return
  }

  purposeDropdownItems.forEach(optionText => {
    const option = document.createElement('option');
    option.value = optionText;
    option.innerText = optionText;
    dropdown.appendChild(option);
  });

  const otherOption = document.createElement('option');
  otherOption.value = 'Lainnya';
  otherOption.innerText = 'Lainnya...';
  dropdown.appendChild(otherOption);
}

function showSuccessView (message) {
  const successDiv = document.getElementById('successMessage');
  successDiv.className = 'alert alert-success';
  successDiv.innerText = message;

  document.getElementById('visitView').style.display = 'none';
  document.getElementById('successView').style.display = 'flex';
}
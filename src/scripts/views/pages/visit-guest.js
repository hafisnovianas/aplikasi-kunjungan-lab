import CallApi from "../../../data/api.js";
import { checkOtherOption } from "../../utils/form-utils.js";

const VisitGuestPage = {
  async render() {
    return `
      <div id="visitGuestView" class="page-view">
        <p>Silahkan isi keperluan Anda, lalu pindai QR Code</p>
        
        <div class="form-group">
          <label for="guestNameInput">Nama Lengkap</label>
          <input type="text" id="guestNameInput" required>
        </div>

        <div class="form-group">
          <label for="guestInstInput">Asal Institusi</label>
          <input type="text" id="guestInstInput" required>
        </div>

        <div class="form-group">
            <label for="purposeDropdown--guest">Keperluan Kunjungan</label>
            <select class="form-select" id="purposeDropdown--guest">
                <option selected disabled value="">-- Pilih Keperluan --</option>
            </select>
        </div>

        <div id="otherPurposeContainer--guest" class="form-group" style="display:none;">
            <label for="otherPurposeInput--guest">Keperluan Lainnya:</label>
            <input type="text" id="otherPurposeInput--guest" placeholder="Sebutkan keperluan Anda">
        </div>
    
        <div>
            <button class="btn btn-primary">Pindai QR</button>
            <input type="file" id="qr-input-file" accept="image/png, image/jpeg" capture="environment" style="display:none">
        </div>

        <div id="reader" style="display:none;"></div>
      </div>

      <div id="successView" class="page-view" style="display:none">
        <div id="successMessage">jack</div>
        <a class="btn btn-primary" href="#/home">kembali</a>
      </div>
    `
  },

  async afterRender() {
    resetInput()
    fillPurposeDropdown();

    const visitViewElement = document.getElementById('visitGuestView')
    visitViewElement.querySelector('button').addEventListener('click', processGuestVisit)

    const dropdownElement = visitViewElement.querySelector('#purposeDropdown--guest')
    const otherPurposeContainer = visitViewElement.querySelector('#otherPurposeContainer--guest')
    const otherPurposeInput = visitViewElement.querySelector('#otherPurposeInput--guest')

    visitViewElement.querySelector('select').addEventListener('change', () => {
      checkOtherOption(dropdownElement, otherPurposeContainer, otherPurposeInput)
    })
  }
};

export default VisitGuestPage;

function processGuestVisit() {
  const guestName = document.getElementById('guestNameInput').value.trim()
  const guestInst = document.getElementById('guestInstInput').value.trim()
  const dropdown = document.getElementById('purposeDropdown--guest');
  const otherInput = document.getElementById('otherPurposeInput--guest');
  let purpose = dropdown.value;

  if (!guestName || !guestInst || !purpose) {
      alert('Harap mengisi semua data');
      return;
  }

  if (purpose === 'Lainnya') {
      purpose = otherInput.value.trim().toLowerCase();
      if (!purpose) {
          alert('Harap isi keperluan Anda di kolom yang tersedia.');
          return;
      }
      localStorage.setItem('lastGuestOtherPurpose', purpose);
  }
  
  // 2. Memicu Kamera (File Capture)
  const fileInput = document.getElementById('qr-input-file');
  const visitGuestButton = document.querySelector('#visitGuestView button');
  
  // Buat event listener sekali pakai untuk menangani file yang dipilih
  fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      visitGuestButton.disabled = true;
      visitGuestButton.innerText = 'Memproses...';

      // 3. Pindai QR dari file
      await scanGuestHandle(file, guestName, guestInst, purpose);

      visitGuestButton.disabled = false;
      visitGuestButton.innerText = 'Pindai QR'; 
      fileInput.value = null; // Reset input file
  };
  
  fileInput.click(); // Buka dialog kamera/file
}

function resetInput () {
  document.getElementById('purposeDropdown--guest').value = "";
  document.getElementById('otherPurposeInput--guest').value = "";
  const visitGuestButton = document.querySelector('#visitGuestView button');
  if(visitGuestButton) {
    visitGuestButton.disabled = false;
    visitGuestButton.innerText = 'Pindai QR';
  }
}

async function scanGuestHandle(file, guestName, guestInst, purpose) {
  const html5QrCode = new window.Html5Qrcode("reader");
  try {
    const decodedResult = await html5QrCode.scanFileV2(file, true);
    const decodedText = decodedResult.decodedText;
    console.log(decodedText)

    const payload = { 
      name: guestName,
      institution: guestInst,
      purpose: purpose, 
      qrData: decodedText
    };

    console.log(payload)

    const response = await CallApi.callApi('recordGuestVisit', payload);

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
    "Kunjungan Resmi / Studi Banding",
    "Penelitian / Kolaborasi",
    "Pertemuan / Bimbingan",
    "Workshop / Pelatihan"
  ]

  const dropdown = document.getElementById('purposeDropdown--guest');

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

  document.getElementById('visitGuestView').style.display = 'none';
  document.getElementById('successView').style.display = 'flex';
}
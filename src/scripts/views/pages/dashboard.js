import CallApi from "../../../data/api.js";

const DashboardPage = {
  async render() {
    return `
      <div id="dashboardView">
        <div class="dashboardWelcome_container">
          <h5 id="dashboardWelcome"></h5>
          <h4 id="dashboardUserName" class="mb-3"></h4>
        </div>

        <div class="d-grid gap-2 mb-4">
          <button class="btn btn-primary btn-lg">
            Catat Kunjungan Baru
          </button>
        </div>

        <h5>Riwayat Kunjungan Terakhir</h5>
        <div id="historyContent" class="list-group">
        </div>
      </div>
    `
  },

  async afterRender() {
    showDashboardView(localStorage.getItem('lastUsedName'))

    document.getElementById('dashboardView').querySelector('button').addEventListener('click', ()=> {
      window.location.hash = '#/visit';
    })
  }
};

export default DashboardPage;

function showDashboardView(name) {
    document.getElementById('dashboardView').style.display = 'block';
    document.getElementById('dashboardWelcome').innerText = `Selamat Datang!`;
    document.getElementById('dashboardUserName').innerText = `${name}`;
    loadHistory();
}

async function loadHistory() {
    const historyContent = document.getElementById('historyContent');
    historyContent.innerHTML = '<p class="text-center">Memuat riwayat...</p>';

    try {
        const token = localStorage.getItem('kunjunganLabToken');
        if (!token) throw new Error("Token tidak ditemukan.");

        const response = await CallApi.callApi('getHistory', { token: token });

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
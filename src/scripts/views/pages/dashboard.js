import CallApi from "../../../data/api.js";

const DashboardPage = {
  async render() {
    return `
      <div id="dashboardView" class="page-view">
        <div class="dashboard-welcome">
          <h5 id="dashboard-welcome__text">Selamat Datang</h5>
          <h4 id="dashboard-welcome__username"></h4>
        </div>

        <div>
          <button>
            ➕ Catat Kunjungan Baru
          </button>
        </div>

        <section class="visit-card card">
          <h3 class="visit-card__title">Riwayat Kunjungan Anda</h3>
          <ul id="historyVisitList" class="visit-card__list"></ul>
        </section>
      </div>
    `
  },

  async afterRender() {
    document.getElementById('dashboard-welcome__username').innerText = localStorage.getItem('lastUsedName');
    loadHistory();

    document.getElementById('dashboardView').querySelector('button').addEventListener('click', ()=> {
      window.location.hash = '#/visit';
    })
  }
};

export default DashboardPage;

async function loadHistory() {
    const historyContent = document.getElementById('historyVisitList');
    historyContent.innerHTML = '<p class="text-center">Memuat riwayat...</p>';

    try {
        const token = localStorage.getItem('kunjunganLabToken');
        if (!token) {
          window.location.hash = '#/login';
          throw new Error("Sesi Anda tidak ditemukan. Silakan login kembali.");
        }

        const response = await CallApi.callApi('getHistory', { token: token });

        if (response.status === 'success') {
            historyContent.innerHTML = '';
            if (response.data.length === 0) {
                historyContent.innerHTML = '<p class="text-center">Anda belum memiliki riwayat kunjungan.</p>';
            } else {
              response.data.forEach(visit => {
                const visitDate = new Date(visit.timestamp);
                
                const formattedDate = visitDate.toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });
                const item = document.createElement('li');
                item.className = 'visit-list-item';
                item.innerHTML = `
                  <div class="visit-list-item__main">
                    <h6 class="visit-list-item__name">${visit.purpose}</h6>
                    <p class="visit-list-item__purpose">${formattedDate}</p>
                  </div>
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
import CallApi from "../../../data/api.js";

const HomePage = {
  async render() {
    return `
      <div id="home" class="page-view">
        <div class="card">
          <div class="promo-card__content">
            <div class="promo-card__text">
              <h2>OPEN RECRUITMENT ASISTEN 2025</h2>
              <p>Jadilah bagian dari tim Laboratorium Fisika UMRI. Tunjukkan kemampuan dan dedikasimu!</p>
            </div>
            <div class="promo-card__image">
              <img src="src/public/asisten2.png">
            </div>
          </div>
          <a href="https://docs.google.com/forms/d/1_PSJH5d1gB_UmVtXuZ4PunvOIDW8ERrb_z4FCgtYQZM" class="btn-primary">Daftar Sekarang!</a>
        </div>

        <div class="card">
          <h3 class="card__title">🏆 LEADERBOARD 🏆</h3>
          <p class="card__subtitle">3 Pengunjung Paling Aktif</p>
          <ol id="leaderboardList" class="card-list"></ol>
        </div>

        <figure class="total-visit-card card">
          <p id="totalVisit" class="total-visit-card__value">...</p>
          <figcaption class="total-visit-card__label">Kunjungan Hari Ini</figcaption>
          <ul id="dailyVisitList" class="visit-card__list"></ul>
        </figure>

        <a class="add-visit-button a-icon" href="#/visit"><i class="fa-solid fa-plus"></i>Kunjungan</a>
      </div>
    `
  },

  // 

  async afterRender() {
    loadLeaderboard();
    loadDailyHistory();
  }
};

export default HomePage;

async function loadDailyHistory() {
    const todaysHistoryContent = document.getElementById('dailyVisitList');
    const totalVisitElement = document.getElementById('totalVisit')
    todaysHistoryContent.innerHTML = '<p class="text-center">Memuat...</p>';

    try {
        const response = await CallApi.callApi('getDailyHistory');
        const dataLength = response.data.length;
        totalVisitElement.textContent = dataLength;
        if (response.status === 'success') {
            todaysHistoryContent.innerHTML = '';
            if (dataLength === 0) {
                todaysHistoryContent.innerHTML = '<p class="text-center">Belum ada kunjungan hari ini.</p>';
            } else {
                response.data.forEach(visit => {
                    const item = document.createElement('li');
                    item.className = 'visit-list-item';
                    item.innerHTML = `
                      <div class="visit-list-item__main">
                        <h6 class="visit-list-item__name">${visit.name}</h6>
                        <p>${visit.purpose}</p>
                      </div>
                      <span class="visit-list-item__time">${visit.time}</span>
                    `;
                    todaysHistoryContent.appendChild(item);
                });
            }
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        todaysHistoryContent.innerHTML = `<p class="text-center text-danger">Gagal memuat riwayat hari ini.</p>`;
    }
}

// Ganti seluruh fungsi loadLeaderboard() dengan ini
async function loadLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = '<p class="text-center">Memuat peringkat...</p>';

    try {
        const response = await CallApi.callApi('getLeaderboard');

        if (response.status === 'success') {
            leaderboardList.innerHTML = '';
            if (response.data.length === 0) {
                leaderboardList.innerHTML = '<p class="text-center">Belum ada data.</p>';
            } else {
                response.data.forEach(user => {
                    const item = document.createElement('li');
                    item.className = 'card-list__item';
                    
                    item.innerHTML = `
                        <span>${user.name}</span>
                        <span class="leaderboard-list__badge">${user.visitCount} Kunjungan</span>
                    `;
                    leaderboardList.appendChild(item);
                });
            }
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        leaderboardList.innerHTML = `<p class="text-center text-danger">Gagal memuat peringkat.</p>`;
    }
}
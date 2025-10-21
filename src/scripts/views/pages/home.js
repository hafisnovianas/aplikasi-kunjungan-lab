import CallApi from "../../../data/api.js";

const HomePage = {
  async render() {
    return `
      <div id="home" class="page-view">
        <div id="infoList">
          <!--
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
          -->
          <info-card></info-card>
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

        <a class="add-visit-button a-icon" href="#/visit">
          <i style="margin-right: 0.5rem; font-weight: 900;" class="fa-solid fa-plus"></i>Kunjungan
        </a>
      </div>
    `
  },

  async afterRender() {
    try {
      await Promise.all([
        this._loadLeaderboard(),
        this._loadDailyHistory()
      ]);
    } catch (error) {
      console.error("Gagal memuat semua data:", error);
    }
  },

  async _loadDailyHistory() {
    const totalVisitElement = document.getElementById('totalVisit')
    const todaysHistoryContent = document.getElementById('dailyVisitList');
    todaysHistoryContent.innerHTML = '<p class="text-center">Memuat...</p>';

    try {
      const response = await CallApi.callApi('getDailyHistory');
      if (response.status !== 'success') throw new Error(response.message);

      const { data } = response;
      totalVisitElement.textContent = data.length;
      todaysHistoryContent.innerHTML = '';
      if (data.length === 0) {
        todaysHistoryContent.innerHTML = '<p class="text-center">Belum ada kunjungan hari ini.</p>';
        return
      }

      data.forEach(visit => {
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
    } catch (error) {
      todaysHistoryContent.innerHTML = `<p class="text-center text-danger">Gagal memuat riwayat hari ini.</p>`;
      throw error;
    }
  },

  async _loadLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    leaderboardList.innerHTML = '<p class="text-center">Memuat peringkat...</p>';

    try {
      const response = await CallApi.callApi('getLeaderboard');
      if (response.status !== 'success') throw new Error(response.message)
      
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
      }
    } catch (error) {
      leaderboardList.innerHTML = `<p class="text-center text-danger">Gagal memuat peringkat.</p>`;
    }
  },

  async _addInfo() {
    const infoContainer = document.querySelector('#infoList')
  }
  
};

export default HomePage;
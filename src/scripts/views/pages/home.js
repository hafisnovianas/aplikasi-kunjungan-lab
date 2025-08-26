import CallApi from "../../../data/api.js";

const HomePage = {
  async render() {
    return `
      <div id="home" class="page">
        <figure class="total-visit-card card">
          <p id="totalVisit" class="total-visit-card__value">0</p>
          <figcaption class="total-visit-card__label">Kunjungan Hari Ini</figcaption>
        </figure>

        <section class="daily-visit-card card">
          <h4 class="daily-visit-card__title">Riwayat Kunjungan Hari Ini</h4>
          <ul id="dailyVisitList" class="daily-visit-card__list">
          </ul>
        </section>
      </div>
    `
  },

  async afterRender() {
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

        if (response.status === 'success') {
            todaysHistoryContent.innerHTML = '';
            if (response.data.length === 0) {
                todaysHistoryContent.innerHTML = '<p class="text-center">Belum ada kunjungan hari ini.</p>';
            } else {
                totalVisitElement.textContent = response.data.length;
                response.data.forEach(visit => {
                    const item = document.createElement('li');
                    item.className = 'visit-list-item';
                    item.innerHTML = `
                      <div class="visit-list-item__main">
                        <h6 class="visit-list-item__name">${visit.name}</h6>
                        <p class="visit-list-item__purpose">${visit.purpose}</p>
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
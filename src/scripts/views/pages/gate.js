const GatePage = {
  async render() {
    return `
      <div id="gateView" class="page-view gate-view">
        <a href="#/login" class="card">
          <i class="fa-solid fa-user-graduate"></i>
          <span>Mahasiswa</span>
        </a>
        <a href="#/visitguest" class="card">
          <i class="fa-solid fa-user"></i>
          <span>Umum</span>
        </a>
      </div>
    `
  },

  async afterRender() {
    console.log('udah')
  }
};

export default GatePage;


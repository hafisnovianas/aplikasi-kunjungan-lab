const API_URL = 'https://script.google.com/macros/s/AKfycbzdHLktOBjXDRTE1snxpqLgrpu7FyZzw2Fl0PA_MupPItiX_y05sW-TaE_XSkyrY58s/exec'; 

class CallApi {
  static async callApi(action, payload) {
    try {
      let response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        body: JSON.stringify({ action, payload }),
        redirect: 'follow'
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || `Terjadi galat HTTP: ${response.status}`;
        throw new Error(errorMessage);
      }

      if (data.message && data.message.toLowerCase().includes('sesi')) {
        alert(data.message);
        localStorage.removeItem('kunjunganLabToken');
        window.location.hash = '#/login';
        return;
      }

      return data;
    } catch (error) {
      console.error('Panggilan API gagal:', error.message);
      throw new Error('Gagal terhubung ke server. Periksa kembali koneksi internet Anda.');
    }
  }
}

export default CallApi;
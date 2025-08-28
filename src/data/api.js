const API_URL = 'https://script.google.com/macros/s/AKfycbzdHLktOBjXDRTE1snxpqLgrpu7FyZzw2Fl0PA_MupPItiX_y05sW-TaE_XSkyrY58s/exec'; 

class CallApi {
  static async callApi(action, payload) {
    let response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, payload }),
      redirect: 'follow'
    });

    if (!(response.status >= 200 && response.status < 300)) {
      throw new Error('Tidak dapat menampilkan data restoran karena sedang offline');
    }

    response = await response.json();
    return response
  }
}

export default CallApi;
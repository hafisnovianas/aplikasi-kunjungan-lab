class Helper {
  static showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
  }

  static hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
  }

  static setUserToken(key, value) {
    return localStorage.setItem(key, value);
  }

  static getUserToken(key) {
    return localStorage.getItem(key);
  }

  static destroyUserToken(key) {
    return localStorage.removeItem(key);
  }
}

export default Helper;
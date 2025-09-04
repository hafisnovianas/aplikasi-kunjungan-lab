class Helper {
  static showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
  }

  static hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
  }

  static setUserToken(key, value) {
    return sessionStorage.setItem(key, value);
  }

  static getUserToken(key) {
    return sessionStorage.getItem(key);
  }

  static destroyUserToken(key) {
    return sessionStorage.removeItem(key);
  }
}

export default Helper;
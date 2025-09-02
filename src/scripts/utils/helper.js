class Helper {
  static showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
  }

  static hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
  }
}

export default Helper;
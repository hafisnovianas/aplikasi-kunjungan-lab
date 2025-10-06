function checkOtherOption(dropdownElement, containerElement, inputElement) {
  if (dropdownElement.value === 'Lainnya') {
    containerElement.style.display = 'flex'; //coba ini
    
    const lastPurpose = localStorage.getItem('lastOtherPurpose');
    if (lastPurpose) {
      inputElement.value = lastPurpose;
    }
    inputElement.focus();
  } else {
    containerElement.style.display = 'none';
  }
}

export { checkOtherOption };
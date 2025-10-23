const InfoPraktikum = {
  async render() {
    return `
        <div id="infoPraktikumView" class="page-view">
        </div>
    `
  },

  async afterRender() {
    const prodiName = "TEKNIK MESIN";
    const dataLink = {
      'jadwal': 'https://drive.google.com/file/d/1iHxXtmRi2sPdoOdOY2jLODL8IqUVteMF/view?usp=drive_link',
      'kelompok': 'https://drive.google.com/drive/folders/1G7SQOTll9n34PgLLNdAhmpSStd5X6zeC?usp=drive_link',
      'modul': 'https://drive.google.com/file/d/1doBETFaRI7tEOBiw5BajFklEjNmBqo9Y/view?usp=drive_link',
      'logbook': 'https://drive.google.com/file/d/1mdjPrTiCvVYI1nerAMtFzZZnSMzydva9/view?usp=drive_link',
      'asistensi': 'https://docs.google.com/presentation/d/17KmWns8_YBdtqwrBHqN2a1updYErclcx/edit?usp=drive_link',
    }

    const InfoPraktikumElement = document.getElementById('infoPraktikumView')
    const prodiCardElement = document.createElement('prodi-card')
    prodiCardElement.prodiName = prodiName;
    prodiCardElement.dataLink = dataLink;
    InfoPraktikumElement.appendChild(prodiCardElement)
  }
}

export default InfoPraktikum;
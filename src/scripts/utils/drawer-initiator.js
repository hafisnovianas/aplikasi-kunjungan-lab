const DrawerInitiator = {
  init({ menuButton, drawer, content }) {
    menuButton.addEventListener('toggle', (event) => {
      if (event.detail.active) {
        this._openDrawer(event, drawer);
      } else {
        this._closeDrawer(event, drawer);
      }
    });

    drawer.addEventListener('click', (event) => {
      this._closeDrawer(event, drawer);
      menuButton.active = false;
    });

    content.addEventListener('click', (event) => {
      this._closeDrawer(event, drawer);
      menuButton.active = false;
    });
  },

  _openDrawer(event, drawer) {
    event.stopPropagation();
    drawer.classList.add('open');
  },

  _closeDrawer(event, drawer) {
    event.stopPropagation();
    drawer.classList.remove('open');
  },
};

export default DrawerInitiator;

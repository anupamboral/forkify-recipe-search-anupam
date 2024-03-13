//*lesson 23

import View from './view.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector(`.upload`);
  _window = document.querySelector(`.add-recipe-window`);
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector(`.nav__btn--add-recipe`);
  _btnClose = document.querySelector(`.btn--close-modal`);
  message = `Your recipe was uploaded successfully`;

  constructor() {
    super();
    this._addHandlerShowWindow(); //* for immediately calling this method when this addRecipeView object will be created
    this._addHandlerHideWindow();
  }
  _generateMarkup() {}
  toggleWindow() {
    this._window.classList.toggle(`hidden`);
    this._overlay.classList.toggle(`hidden`);
  }
  addHandlerUpload(handler) {
    this._parentElement.addEventListener(`submit`, function (e) {
      e.preventDefault();

      const dataArray = [...new FormData(this)]; //* Explanation Above
      const data = Object.fromEntries(dataArray);

      handler(data);
    });
  }

  //*for opening model window on click event on the add recipe btn
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener(`click`, this.toggleWindow.bind(this));
  }
  //*For closing the model window when the user clicks on the close button or on the overlay so outside of the form
  _addHandlerHideWindow() {
    this._btnClose.addEventListener(`click`, this.toggleWindow.bind(this));
    this._overlay.addEventListener(`click`, this.toggleWindow.bind(this));
  }
}
export default new AddRecipeView();

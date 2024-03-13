//*Lesson 16
import View from './view.js';
import icons from 'url:../../img/icons.svg'; //* while importing images or icons we have to mention url: before the path
import { Fraction } from 'fractional';

//*Lesson 14
class PaginationView extends View {
  _parentElement = document.querySelector(`.pagination`);

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const clickedBtn = e.target.closest('.btn--inline');
      //*guard clause
      if (!clickedBtn) return;

      const goToPage = +clickedBtn.dataset.goto;

      // console.log(goToPage);
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const totalNumPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const currentPage = this._data.page;

    //*Page 1 and there are other pages
    if (currentPage === 1 && totalNumPages > 1)
      return this._generateMarkupNextPage(currentPage);

    //*Last page
    if (currentPage === totalNumPages && totalNumPages > 1)
      return this._generateMarkupPreviousPage(currentPage);

    //*other pages
    if (currentPage < totalNumPages) {
      return `
        ${this._generateMarkupPreviousPage(currentPage)}
        ${this._generateMarkupNextPage(currentPage)}
        `;
    }

    //*Page 1 and there is no other page
    return ``;
  }
  _generateMarkupPreviousPage(currentPage) {
    return `
    <button data-goto='${
      currentPage - 1
    }' class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${currentPage - 1}</span>
    </button>
    `;
  }
  _generateMarkupNextPage(currentPage) {
    return `
    <button data-goto='${
      currentPage + 1
    }' class="btn--inline pagination__btn--next">
       <span>Page ${currentPage + 1}</span>
       <svg class="search__icon">
         <use href="${icons}#icon-arrow-right"></use>
       </svg>
   </button> `;
  }
}
export default new PaginationView();

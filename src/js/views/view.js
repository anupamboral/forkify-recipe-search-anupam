import { Fraction } from 'fractional';

import icons from 'url:../../img/icons.svg'; //* while importing images or icons we have to mention url: before the path

export default class View {
  _data; //*now whatever data we will receive from the render method , we will save that in this data variable

  /**
   * Render the received object to the dom
   * @param {object | Array} data ;the data is to be rendered (e.g.recipe)
   * @param {boolean} {render=true} - if false, , create markUp string only and return that instead of rendering to the dom
   * @returns {undefined | string} a markUp string returned if render=false
   * @this {object}  the view instance
   * @author Anupam Boral
   */
  render(data, render = true) {
    // console.log(Array.isArray(data));

    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    //* saving the received data inside the data property of this class so we can use that to generate the markup.
    this._data = data;
    const markUp = this._generateMarkup();
    if (!render) return markUp;
    //*clearing the container
    this.clear();
    //* inserting the markup inside the container
    this._parentElement.insertAdjacentHTML(`afterbegin`, markUp);
  }

  //*this update method is from 19th lesson
  update(data) {
    //* saving the received data inside the data property of this class so we can use that to generate the markup.
    this._data = data;
    //* generating new markup with the updated data so we can compare it with old recipe data which is rendered in the Ui
    const newMarkUp = this._generateMarkup();
    //* but we can't compare the living dom object with the string we have generated so we are going to convert this markup into a dom object which will be living on the memory of our browser,So Dom that is not really a living on the page(UI) but which lives in our memory of the browser. so then we can compare two dom objects
    const newDom = document.createRange().createContextualFragment(newMarkUp);

    //* selecting all the elements from the virtual dom object
    const newElements = Array.from(newDom.querySelectorAll(`*`)); //*Array.from() is used for converting the node lists into array so we can use the useful array methods.
    // console.log(newElements); //* it will give all the elements from the virtual dom.
    const currElements = Array.from(this._parentElement.querySelectorAll(`*`));
    // console.log(currElements);
    //* Looping over two areas at the same time
    newElements.forEach((newElm, index) => {
      const curElm = currElements[index];
      //* Now we have a way to compare to Dom nodes Which is basically a method named isEqualNode().

      //*Updating changed text
      if (
        !curElm.isEqualNode(newElm) &&
        newElm.firstChild?.nodeValue.trim() !== ''
      ) {
        curElm.textContent = newElm.textContent;
      }

      //* updating changed attributes
      if (!curElm.isEqualNode(newElm)) {
        Array.from(newElm.attributes).forEach(attr => {
          curElm.setAttribute(attr.name, attr.value);
          // console.log(attr.name, attr.value);
        });
      }
    });
  }

  clear() {
    this._parentElement.innerHTML = ``;
  }

  loadSpinner() {
    //* html which will be inserted to display the spinner
    const markUp = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
    `;
    //* first clearing the container by by setting it's innerHtml to empty string
    this.clear();
    //* rendering the recipe
    this._parentElement.insertAdjacentHTML(`afterbegin`, markUp);
  }

  renderError(errMessage = this.errorMessage) {
    const markUp = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${errMessage}</p>
    </div>
    `;

    //* first clearing the container  by setting it's innerHtml to empty string
    this.clear();
    //* rendering the error
    this._parentElement.insertAdjacentHTML(`afterbegin`, markUp);
  }
  //*for success message(lesson-12 line-712)
  renderMessage(message = this.message) {
    const markUp = `
    <div class="message">
      <div>
        <svg>
          <use href="s${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;

    //* first clearing the container  by setting it's innerHtml to empty string
    this.clear();
    //* rendering the error
    this._parentElement.insertAdjacentHTML(`afterbegin`, markUp);
  }
}

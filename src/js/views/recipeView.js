import { Fraction } from 'fractional'; //* for giving the ingredients quantity a nicer formal we imported this fractional library. here we are using object destructuring because the function which we need is inside fraction object so to get it easily we are directly destructuring here.To know more use see line 591 of controller module.
// let Fraction = Fraction;
import View from './view.js';
// console.log(Fraction);
console.log(Fraction);
//* building this module started from the 9 th lesson.
//* so we don't pass any data in and so therefore we don't need any constructor even ok
import icons from 'url:../../img/icons.svg'; //* while importing images or icons we have to mention url: before the path

class RecipeView extends View {
  //* all of the common methods are inside the views class, which extended here to get access to the common properties and methods

  //*and these two properties are something that all the views(objects which will will be created using this class) are going to have in common and this will be really beautiful to work with as you will see
  _parentElement = document.querySelector('.recipe');

  errorMessage = `We could not find that recipe, please try another one`; //*(explanation at controller module line-685)
  message = ``; //* success message which will displayed inside through renderMessage function

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener(`click`, function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;
      console.log(btn);
      const updateTO = +btn.dataset.updateTo;
      console.log(updateTO);
      //*guard clause
      if (!btn) return;

      if (updateTO > 0) handler(updateTO);
      // console.log(btn);
    });
  }
  /**
   *
   * @param {*} handler
   */
  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');

      if (!btn) return;
      handler();
    });
  }

  _generateMarkup() {
    return `
    <figure class="recipe__fig">
          <img src="${this._data.imageUrl}" alt="Tomato" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data-- 
         minutes">${this._data.cookingTime}</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data-- 
         people">${this._data.servings}</span>
        <span class="recipe__info-text">servings</span>

        <div class="recipe__info-buttons">
          <button class="btn--tiny btn--update-servings" data-update-to="${
            this._data.servings - 1
          }">
            <svg>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--update-servings" data-update-to="${
            this._data.servings + 1
          }">
            <svg>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>

      <div class="recipe__user-generated ${this._data.key ? `` : `hidden`}">    
        <svg>
          <use href="${icons}#icon-user"></use>
        </svg>
      </div>
      <button class="btn--round btn--bookmark">
        <svg class="">
          <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? `-fill` : ``
    }"></use>
        </svg>
      </button>
    </div>

    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
      ${this._data.ingredients.map(this._generateMarkUpIngredient).join(``)}

      </ul>
    </div>

    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${
          this._data.publisher
        }</span>. Please check 
         out
        directions at their website.
      </p>
      <a
        class="btn--small recipe__btn"
        href="${this._data.sourceUrl}"
        target="_blank"
      >
        <span>Directions</span>
        <svg class="search__icon">
          <use href="src/img/icons.svg#icon-arrow-right"></use>
        </svg>
      </a>
    </div>
    
    `;
  }

  /**
   *
   * @param {Object} ingredient
   * @returns
   */
  _generateMarkUpIngredient(ingredient) {
    // console.log(ingredient);
    return ` <li class="recipe__ingredient">
               <svg class="recipe__icon">
                 <use href="${icons}#icon-check"></use>
               </svg>
               <div class="recipe__quantity">${
                 ingredient.quantity
                   ? new Fraction(ingredient.quantity).toString()
                   : ``
               }</div>
               <div class="recipe__description">
                 <span class="recipe__unit">${ingredient.unit}</span>
                 ${
                   ingredient.quantity === null
                     ? `${ingredient.description} according to taste`
                     : ingredient.description
                 }
               </div>
             </li>`;
  } //* now we will use this method inside the map method as a callback function.inside the generate markup method were we were creating ingredients using map. we did it for refactoring.

  /**
   *
   * @param {function controlRecipes() {}} handler we will receive the controller function as handler function
   */
  addHandlerRender(handler) {
    ['load', 'hashchange'].forEach(
      event => window.addEventListener(event, handler) //*from lesson 11
    );
  }
}
//* so if each of the views has this parentElement property then it will be really easy to do all of those tasks and again that will become really clear once we start adding more and more views but now the next thing I want to do is to actually export something from this module so of course we have to export something from this view so that the controller can then use it now what are we going to export from this view so we might export of course the entire class like this and so then here in the controller we would have to import that class and create a new object out of that class so basically create a new recipe view object right however in that situation it might be possible to create more than one view and we would never want that also that would add unnecessary work to the controller which we basically want to keep as simple as possible and so in order to avoid all that we will already create the object here using the class and then export that object and so like this no one from the outside of this class here will have access to anything except for the object. so what we will do is to export default and then a new recipe view alright
export default new RecipeView();

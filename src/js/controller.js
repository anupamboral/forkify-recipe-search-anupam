import * as model from './model.js'; //* so are importing all exports from model.js modeule , and saving that inside the model variable, this model varible is now like a object which contains all the named imports as properties.so inside inside model now we have state object and loadRecipes function as properties.
import searchView from './views/searchView.js'; //* So this import is basically an instance object of the search view class and not the whole search view class imported that's why while writing the name we have not used capital letter at first because it is not the class itself it is just an instance of that class.
//* importing from a default export from recipeview module.
import recipeView from './views/recipeView.js';
//* importing from a default export from RessultsView module.
import resultsView from './views/resultsView.js';
//* importing from a default export from PaginationView module.
import paginationView from './views/paginationView.js';
//* importing icons from source folder so then parcel can know the location of icons inside the distribution folder which was created by parcel.
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import icons from 'url:../img/icons.svg'; //* while importing images or icons we have to mention url: before the path
import 'core.js'; //*install the packages first using terminal.
import 'regenerator-runtime/runtime.js';
import { MODAL_CLOSE_SECS } from './config.js';
// const recipeContainer = document.querySelector('.recipe');
import { Fraction } from 'fractional';
if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    //* getting the id from haschange event
    const id = window.location.hash.slice(1);
    // console.log(id);
    //*guard clause (in case the id doesn't exist)
    if (!id) return;
    //*0.Updating results view and bookmarks view to mark selected recipe from the  search result and bookmark panel.
    resultsView.update(model.getSearchResultsPage());
    //*updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
    //*1.Loading spinner animation
    recipeView.loadSpinner();
    //* 2.loading recipe from the server(we impoted loadrecipe function from the model.js module and loadRecipes is async function which returns a promise , so to get results fromm this function we need await for it so our code  execution will wait untill the async function gets resolved because only after resolving this the state will be updated and then only we can get data from the state)
    await model.loadRecipes(id); //* After loading the recipe this function will save the recipe data inside the state object and as we imported all of the exports from model.js into model Object so now state is a property of the model object and inside this state we have the recipe

    //* rendering recipe on UI
    recipeView.render(model.state.recipe);
    // controlServings();//*for testing
  } catch (err) {
    console.error(err);
    recipeView.renderError(); //*explanation at line 684,685 of this file
  }
};

const controlSearchResults = async function () {
  try {
    //*Rendering the loadSpinner in the search Results section
    resultsView.loadSpinner();
    //*1.getting the search query
    const query = searchView.getQuery();
    //* So the user can click the search button but he may not enter any value in the search bar So in that case we can write a guard clause which will immediately return this function if there is no value so basically if it is a empty string which is basically a falsy value.
    if (!query) return;

    //*2. loading the search results(it will save the data inside the state object)
    await model.loadSearchResults(`${query}`);
    //*3. rendering results
    console.log(model.state.search.results);
    // resultsView.render(model.getSearchResultsPage(1)); //*start here
    resultsView.render(model.getSearchResultsPage()); //* by deafults getSearchResultsPage function's parameter's value is set to 1 so we don't need pass the argument
    //* starts here
    //* rendering pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
    resultsView.renderError();
  }
};
const controlPagination = function (goToPage) {
  // console.log(goToPage);
  //*3. rendering new results
  resultsView.render(model.getSearchResultsPage(goToPage));
  //*this actually works because render will basically override the markup that was there previously and the reason for that is that we hear have the clear() method inside the class and so before any new html is inserted into the page the parent element is first cleared so it's 1st emptied right.
  //* rendering new pagination
  paginationView.render(model.state.search); //* Now inside this render method of pagination view we will still pass the state search because while we call getSearchResultsPage above then it updated the state and so the page was also updated so we don't need to change the parameter for this render method because it is gonna be already updated on the state so from the updated state we can use that to render the new pagination buttons.
};
const controlServings = function (newServing) {
  //* updating serving on the state
  model.updateServings(newServing);
  //* rendering recipe using the updated data from the state
  //*starts here (instead of render method we have to call update method)
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  //* from lesson 20
  //*Addding/removing bbokmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  console.log(model.state.recipe);
  //* update the recipeView
  recipeView.update(model.state.recipe);
  //* rendering the bookmark on the bookmark panel
  bookmarksView.render(model.state.bookmarks);
};
//*lesson 22
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
//*from Lesson 24
const controlAddRecipe = async function (newRecipe) {
  try {
    //*showing the spinner
    addRecipeView.loadSpinner();
    // console.log(newRecipe);
    //*Upload the new recipe into the server(from lesson_25)
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //*Render the recipe on ui
    recipeView.render(model.state.recipe);

    //*showing a success messege
    addRecipeView.renderMessage();

    //*Render bookmark view(for updating the bookamrks panel)
    bookmarksView.render(model.state.bookmarks);

    //*changing the id in url using history api which is browser
    window.history.pushState(null, ``, `#${model.state.recipe.id}`);

    //* closing the modal window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SECS * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err);
  }
};
/**
 * this init function will be called at begginging when our page first loads then using this initialisation function we pass this controller functions to the views so they can use these.
 */
const welcomeUser = function () {
  console.log(`welcome to our application`);
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  welcomeUser();
};
init();

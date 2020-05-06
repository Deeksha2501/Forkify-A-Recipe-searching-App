// Global app controller
import Search from "./models/search";
import Recipe from "./models/recipe";
import List from "./models/list";
import Likes from "./models/likes";
import { elements, renderLoader, clearLoader } from "./views/base";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";

/**
 * GLOBAL STATE OF THE APP
 * SEARCH OBJECT
 * current recipe object
 * shopping list object
 * liked recipes
 */

/**
 * SEARCH CONTROLLER
 */

const state = {};

const controlSearch = async () => {
  // 1)get the query

  const query = searchView.getInput();

  if (query) {
    // 2) New search object and add it to the state
    state.search = new Search(query);

    // 3) PREPARE UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchResultList);
    // 4) SEARCH FOR RECIPES
    try {
      await state.search.getResults();

      // 5) RENDER RESULTS ON UI
      clearLoader();
      //console.log(state.search.recipes)
      searchView.renderResults(state.search.recipes, 1, 10);
    } catch(e) {
      alert("OOPS!! NOT FOUND!! Try with a different keyword!");
    }
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

window.addEventListener("load", (e) => {
  e.preventDefault();
  controlSearch();
});

elements.resPages.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto);
    searchView.clearResults();
    searchView.renderResults(state.search.recipes, goToPage, 10);
  }
});

/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
  //get id from ur;
  const id = window.location.hash.replace("#", "");
  if (id) {
    //prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    //hightlight selected
    // if (await state.search) searchView.highlightSelected(id);

    //create a new recipe object
    state.recipe = new Recipe(id);

    try {
      //get recipe data
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      //call time and servings
      state.recipe.calcTime();
      state.recipe.calcServings();
      //render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (err) {
      console.log(err);
      alert("Error processing recipe :(");
    }
  }
};

/**
 * LIST CONTROLLER
 */

const controlList = () => {
  //create a new list if not made already
  if (!state.list) state.list = new List();

  //add item to the list
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

//handle delete and update items
elements.shopping.addEventListener("click", (e) => {
  const id = e.target.closest(".shopping__item").dataset.itemid;

  //handle the delete
  if (e.target.matches(".shopping__delete , .shopping__delete *")) {
    //delete from data
    state.list.deleteItem(id);

    //delete the ui
    listView.deleteItem(id);
  } else if (
    e.target.matches(".shopping-count-value , shopping-count-value *")
  ) {
    //fetch the value
    const val = parseFloat(e.target.value);

    //update it in the data
    state.list.updateCount(id, val);
  }
});

/**
 * LIKES CONTROLLER
 */

//  //testing
//  state.likes = new Likes();
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();

  const currentID = state.recipe.id;

  if (!state.likes.isLiked(currentID)) {
    //ADD ITEM TO THE DATA
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );

    //TOGGLE THE CLASS
    likesView.likeButton(true);

    //ADD ITEM TO THE UI LIST
    likesView.renderLikes(newLike);
  } else {
    //ADD ITEM TO THE DATA
    state.likes.deleteLike(currentID);

    //TOGGLE THE CLASS
    likesView.likeButton(false);

    //ADD ITEM TO THE UI LIST
    likesView.deleteLike(currentID);
  }

  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

window.addEventListener("load", () => {
  state.likes = new Likes();
  state.likes.readStorage();
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  state.likes.likes.forEach((like) => likesView.renderLikes(like));
});

//  window.addEventListener('hashchange' , controlRecipe);
//  window.addEventListener('load' , controlRecipe);

//EASY WAY OF ADDING DIFFRENT EVENT LISTENER ON SAME FUNCTION CALL
["hashchange", "load"].forEach((event) =>
  window.addEventListener(event, controlRecipe)
);

elements.recipe.addEventListener("click", (e) => {
  if (state.recipe.servings > 1) {
    if (e.target.matches(".btn-decrease, .btn-decrease *")) {
      //decrease btn clicked
      state.recipe.updateServings("dec");
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(state.recipe.id)
      );
    }
  }
  if (e.target.matches(".btn-increase, .btn-increase *")) {
    //inc btn clicked
    state.recipe.updateServings("inc");
    recipeView.renderRecipe(state.recipe, state.likes.isLiked(state.recipe.id));
  } else if (e.target.matches(".recipe-btn-add , .recipe-btn-add *")) {
    controlList();
  } else if (e.target.matches(".recipe__love , .recipe__love *")) {
    controlLike();
  }
});

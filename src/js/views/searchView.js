import { elements } from './base';

//GETTING INPUT FROM THE SEARCH FIELD
export const getInput = () => {
    return elements.searchInput.value;
}

//CLEARING INPUT FROM SEARCH FIELD
export const clearInput = () => {
    elements.searchInput.value = '';
};

//CLEARING INPUT FROM THE RESULT LIST
export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.resPages.innerHTML = '';
};

//SHORTENING THE TITLE..
export const limitRecipeTitle = (title, limit = 18) => {
    const newTitle = [];
    if (title.length) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
    }

    return (`${newTitle.join(' ')}...`)
}

//RENDER LIST ITEMS
const renderRecipe = (recipe) => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>`
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
}

const createButton = (page, type) => {
    const html = `<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
                    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
                        <svg class="search__icon">
                            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
                        </svg>
                    </button>`
    return html;
}

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if (page === 1 && pages > 1) {
        //only forward button
        button = createButton(page, 'next');
    }
    else if (page < pages) {
        //both buttons
        button = `${createButton(page, 'prev')}
                  ${createButton(page, 'next')}`;
    }
    else if (page === pages && pages > 1) {
        //only backward button
        button = createButton(page, 'prev');
    }


    elements.resPages.insertAdjacentHTML('afterbegin', button);
}

//RENDER LIST ITEMS TO UI
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    let start = (page - 1) * resPerPage;
    let end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);

    //rendering buttons
    renderButtons(page, recipes.length, resPerPage);
}



// export const highlightSelected = id => {
//     // const resultsArr = Array.from(document.querySelectorAll('.results__link'));
//     // resultsArr.forEach(el => {
//     //     el.classList.remove('results__link--active');
//     // });
//     // console.log("id" , id)
//     document.querySelector(`a[href*="${id}"]`).classList.add('results__link--active');
// };

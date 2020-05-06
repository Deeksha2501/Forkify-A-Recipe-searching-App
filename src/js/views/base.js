export const elements = {
    searchInput: document.querySelector('.search__field'),
    searchForm: document.querySelector('.search'),
    searchResultList: document.querySelector('.results__list'),
    resPages: document.querySelector('.results__pages'),
    recipe : document.querySelector('.recipe'),
    shopping : document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
}

export const elementsStrings = {
    loader: '.loader'
}

//LOADER SPINNER
export const renderLoader = (parent) => {
    const loader = `
    <div class="loader">
        <svg>
            <use href="img/icons.svg#icon-cw"></use>
        </svg>
    </div>`;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`${elementsStrings.loader}`)
    if (loader) {
        loader.parentElement.removeChild(loader);
    }
}
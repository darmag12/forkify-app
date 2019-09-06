// where all the DOM strings are stored
export const elements ={
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResList: document.querySelector('.results__list'),
    searchResults: document.querySelector('.results'),
    searchResPages:  document.querySelector('.results__pages')
    
}

export const elementStrings = {
    loader: 'loader'
}

// reusable function for the loading spinner
export const renderLoader = parent =>{
const loader = `
<div class="${elementStrings.loader}">
  <svg>
    <use href="img/icons.svg#icon-cw"></use>
  </svg>
</div>
`;
parent.insertAdjacentHTML('afterbegin', loader);
}

export const clearLoader = () => {
const loader = document.querySelector(`.${elementStrings.loader}`);
if(loader){
    loader.parentElement.removeChild(loader);
}
}
import { updateHeroTable } from "./updateHeroTable.js";
import { 
    searchFields, searchStrOperators, searchNumOperators,
    heroTable,
    searchBarDiv, searchStrOperator, searchNumOperator, searchField,
    prevButton, viewResult, nextButton,
    pgParam
} from "./constants.js";

export function insertHeroTable(heroes){

    const optionDiv = document.createElement('div');
    optionDiv.className = 'options';
    document.body.appendChild(optionDiv);

    optionDiv.appendChild(insertPageSizeSelect(heroes));
    optionDiv.appendChild(insertSearchBar(heroes));

    const secOptionDiv = document.createElement('div');
    secOptionDiv.className = 'options';
    secOptionDiv.classList.add('secOptions');
    document.body.appendChild(secOptionDiv);
    secOptionDiv.appendChild(insertPageNav(heroes));

    updateHeroTable(heroes, pgParam);
    document.body.appendChild(heroTable);
};

function insertPageSizeSelect(heroes){
    const selectDiv = document.createElement('div');
    const selectLabel = document.createElement('label');
    selectLabel.textContent = 'Show ';
    selectDiv.appendChild(selectLabel);

    const selectInput = document.createElement('select');
    const sizeOptions = [10, 20, 50, 100, 'All'];

    sizeOptions.forEach((size) => {
        const ele = document.createElement('option');
        ele.value = size === 'All' ? heroes.length : size;
        ele.textContent = `${size} Results`;
        if (size === pgParam.pageSize || pgParam.pageSize === heroes.length) ele.selected = true;
        selectInput.appendChild(ele);
    });

    selectInput.addEventListener('change', (event) => {
        pgParam.pageSize = parseInt(event.target.value, 10);
        pgParam.currentPage.val = 1; // Reset to first page
        updateHeroTable(heroes, pgParam);
    });

    selectDiv.appendChild(selectInput);
    return selectDiv;
};

function insertPageNav(heroes){
    const pageNavDiv = document.createElement('div');
    pageNavDiv.className = 'pagination';

    prevButton.textContent = 'Previous';
    prevButton.className = 'page-button';
    prevButton.addEventListener('click', () => {
        pgParam.currentPage.val--;
        updateHeroTable(heroes, pgParam);
    });
    pageNavDiv.appendChild(prevButton);

    pageNavDiv.appendChild(viewResult);

    nextButton.textContent = 'Next';
    nextButton.className = 'page-button';
    nextButton.addEventListener('click', () => {
        pgParam.currentPage.val++;
        updateHeroTable(heroes, pgParam);
    });
    pageNavDiv.appendChild(nextButton);

    return pageNavDiv;
};

function insertSearchOptions(arrOp, searchParam, parent, heroes){
    arrOp.forEach((op) => {
        const ele = document.createElement('option');
        ele.value = op;
        ele.textContent = op;
        if (op === searchParam.val) ele.selected = true;
        parent.appendChild(ele);
    });
    parent.addEventListener('change', (event) => {
        searchParam.val = event.target.value;
        pgParam.currentPage.val = 1; // Reset to first page
        updateHeroTable(heroes, pgParam);
    });
    searchBarDiv.appendChild(parent);
}

function insertSearchBar(heroes) {
    searchBarDiv.className = "search-bar";

    insertSearchOptions(searchStrOperators, pgParam.searchOp, searchStrOperator, heroes);
    insertSearchOptions(searchNumOperators, pgParam.searchOp, searchNumOperator, heroes);

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Search heroes...";
    searchInput.classList.add("search-input");
    searchBarDiv.appendChild(searchInput);

    const searchLabel = document.createElement('label');
    searchLabel.textContent = ' in ';
    searchBarDiv.appendChild(searchLabel);

    insertSearchOptions(searchFields, pgParam.searchIn, searchField, heroes);

    searchInput.addEventListener("input", function (e) {
        pgParam.currentPage.val = 1;
        pgParam.searchStr = e.target.value.toLowerCase();
        updateHeroTable(heroes, pgParam);
    });

    return searchBarDiv;
}

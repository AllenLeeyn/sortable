import { sortTable } from "./sortFunc.js";

const pwrStatsAbrv = {
    'intelligence': 'INT',
    'strength': 'STR',
    'speed': 'SPD',
    'durability': 'DUR',
    'power': 'PWR',
    'combat': 'COM'
}
const headers = [
    '',
    'Name',
    'Full Name',
    'Powerstats',
    'Race',
    'Gender',
    'Height',
    'Weight',
    `Place Of \nBirth`,
    'Alignment'
];
const heroTable = document.createElement('table');
let pageSize = 20; //Default page value
let currentPage = 1;

export function insertHeroTable(heroes){
    const optionDiv = document.createElement('div');
    optionDiv.className = 'options';
    document.body.appendChild(optionDiv);

    optionDiv.appendChild(insertSelect(heroes));
    optionDiv.appendChild(insertPageSelect());
    optionDiv.appendChild(insertSearchBar());

    document.body.appendChild(heroTable);
    displayHeroes(heroes);
    return heroTable;
};

function insertHeaders(heroes){
    const headerRow = heroTable.insertRow();

    headers.forEach(headerTitle => {
        const th = document.createElement('th');
        th.textContent = headerTitle;
        headerRow.appendChild(th);

        th.addEventListener('click', ()=>{
            sortTable(
                heroes,
                headerTitle,
                heroTable,
                insertHeaders,
                insertHeroEntries
            );
        });
    });
}

function insertHeroEntries(hero){
    const curRow = heroTable.insertRow();
    
    const cell = curRow.insertCell();
    const img = document.createElement('img');
    img.src = hero.images.xs;
    img.alt = hero.name;
    cell.appendChild(img);

    let strContainer = '';
    Object.entries(hero.powerstats).forEach(([key, value]) => {
        strContainer += `${pwrStatsAbrv[key]}: ${value}\n`;
    });
    insertCell(curRow, hero.name);
    insertCell(curRow, hero.biography.fullName);
    insertCell(curRow, strContainer);
    insertCell(curRow, hero.appearance.race);
    insertCell(curRow, hero.appearance.gender);
    insertCell(curRow, hero.appearance.height, 'height');
    insertCell(curRow, hero.appearance.weight, 'weight');
    insertCell(curRow, hero.biography.placeOfBirth);
    insertCell(curRow, hero.biography.alignment);
}

function insertCell(curRow, value, className){
    const cell = curRow.insertCell();
    cell.textContent = value;
    if (className !== undefined) cell.className = className;
};

function displayHeroes(heroes) {
    heroTable.innerHTML = ""; // Clear previous entries

    insertHeaders(heroes);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedHeroes = heroes.slice(startIndex, endIndex);

    paginatedHeroes.forEach(hero => insertHeroEntries(hero));
}

function insertSelect(heroes){
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
        if (size === 20) ele.selected = true;
        selectInput.appendChild(ele);
    });

    selectInput.addEventListener('change', (event) => {
        pageSize = parseInt(event.target.value, 10);
        currentPage = 1; // Reset to first page
        displayHeroes(heroes);
    });

    selectDiv.appendChild(selectInput);
    return selectDiv;
};

function insertPageSelect(heroes){
    const pageSelectDiv = document.createElement('div');
    pageSelectDiv.className = 'pagination';

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayHeroes(heroes);
        }
    });
    pageSelectDiv.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => {
        const totalPages = Math.ceil(heroes.length / pageSize);
        if (currentPage < totalPages) {
            currentPage++;
            displayHeroes(heroes);
        }
    });
    pageSelectDiv.appendChild(nextButton);

    return pageSelectDiv;
};

function insertSearchBar(){
    const searchBarDiv = document.createElement('div');
    searchBarDiv.className = 'search-bar';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search...';
    searchInput.classList.add('search-input');

    searchInput.addEventListener("input", (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredHeroes = JSON.parse(localStorage.getItem("heroes")) || [];

        const results = filteredHeroes.filter(hero =>
            hero.name.toLowerCase().includes(searchTerm) ||
            hero.biography.fullName.toLowerCase().includes(searchTerm)
        );

        displayHeroes(results);
    });

    searchBarDiv.appendChild(searchInput);
    return searchBarDiv;
};

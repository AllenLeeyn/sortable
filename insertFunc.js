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

export function insertHeroTable(heroes){
    const optionDiv = document.createElement('div');
    optionDiv.className = 'options';
    document.body.appendChild(optionDiv);

    optionDiv.appendChild(insertSelect());
    optionDiv.appendChild(insertPageSelect());
    optionDiv.appendChild(insertSearchBar());

    insertHeaders(heroes);
    heroes.forEach((hero) => insertHeroEntries(hero, heroTable));

    document.body.appendChild(heroTable);
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
                heroTable
            );
            document.body.innerHTML = '';
            heroTable.innerHTML = '';
            insertHeroTable(heroes)
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

function insertSelect(){
    const selectDiv = document.createElement('div');
    const selectLabel = document.createElement('label');
    selectLabel.textContent = 'Show ';
    selectDiv.appendChild(selectLabel);

    const selectInput = document.createElement('select');
    const sizeOptions = [10, 20, 50, 100, 'All'];
    sizeOptions.forEach((size) => {
        const ele = document.createElement('option');
        ele.value = size;
        ele.textContent = `${size} Results`;
        if (size === 20) ele.selected = true;
        selectInput.appendChild(ele);
    });
    selectDiv.appendChild(selectInput);
    return selectDiv;
};

function insertPageSelect(){
    const pageSelectDiv = document.createElement('div');
    pageSelectDiv.className = 'pagination';
    const pageButton = document.createElement('a');
    pageButton.textContent = 1;
    pageButton.className = 'page-button';
    pageSelectDiv.appendChild(pageButton);
    return pageSelectDiv;
};

function insertSearchBar(){
    const searchBarDiv = document.createElement('div');
    searchBarDiv.className = 'search-bar';
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search...';
    searchInput.classList.add('search-input');
    searchBarDiv.appendChild(searchInput);
    return searchBarDiv;
};

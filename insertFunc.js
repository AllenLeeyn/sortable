import { sortTable } from "./sortFunc.js";

const pwrStatsAbrv = {
  intelligence: "INT",
  strength: "STR",
  speed: "SPD",
  durability: "DUR",
  power: "PWR",
  combat: "COM",
};
const headers = [
  "",
  "Name",
  "Full Name",
  "Powerstats",
  "Race",
  "Gender",
  "Height",
  "Weight",
  `Place Of \nBirth`,
  "Alignment",
];
const heroTable = document.createElement('table');
let pageSize = 20; //Default page value
let currentPage = 1;
let searchStr = '';

const prevButton = document.createElement('a');
const viewResult = document.createElement('a');
const nextButton = document.createElement('a');

export function insertHeroTable(heroes){

    const optionDiv = document.createElement('div');
    optionDiv.className = 'options';
    document.body.appendChild(optionDiv);

    optionDiv.appendChild(insertSelect(heroes));
    optionDiv.appendChild(insertPageSelect(heroes));
    optionDiv.appendChild(insertSearchBar(heroes));
    updateHeroTable(heroes)
    document.body.appendChild(heroTable);
};

function updateHeroTable(heroes){
    heroTable.innerHTML = '';
    insertHeaders(heroes);
    const selectedHeroes = [];

    heroes.forEach((hero)=>{
        const name = hero.name.toLowerCase();
        const fullName = hero.biography.fullName.toLowerCase();
        
        if (name.includes(searchStr) || fullName.includes(searchStr)) {
            selectedHeroes.push(hero);
        }
    });
    
    if (currentPage <= 1){
        currentPage = 1;
        prevButton.style.display = 'none';
    } else prevButton.style.display = '';
    const totalPages = Math.ceil(selectedHeroes.length / pageSize);
    if (currentPage >= totalPages){
        currentPage = totalPages;
        nextButton.style.display = 'none';
    } else nextButton.style.display = '';

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    viewResult.textContent = '[' + String(startIndex) + ' - ' + String(endIndex) + ']';
    const paginatedHeroes = selectedHeroes.slice(startIndex, endIndex);
    paginatedHeroes.forEach(hero => insertHeroEntries(hero));
};

function insertHeaders(heroes){
    const headerRow = heroTable.insertRow();
    headers.forEach(headerTitle => {
        const th = document.createElement('th');
        th.textContent = headerTitle;
        headerRow.appendChild(th);

        th.addEventListener('click', ()=>{
            sortTable(heroes, headerTitle, heroTable);
            currentPage = 1;
            updateHeroTable(heroes)
        });
    });
}

function insertHeroEntries(hero) {
  const curRow = heroTable.insertRow();

  const cell = curRow.insertCell();
  const img = document.createElement("img");
  img.src = hero.images.xs;
  img.alt = hero.name;
  cell.appendChild(img);

  let strContainer = "";
  Object.entries(hero.powerstats).forEach(([key, value]) => {
    strContainer += `${pwrStatsAbrv[key]}: ${value}\n`;
  });
  insertCell(curRow, hero.name);
  insertCell(curRow, hero.biography.fullName);
  insertCell(curRow, strContainer);
  insertCell(curRow, hero.appearance.race);
  insertCell(curRow, hero.appearance.gender);
  insertCell(curRow, hero.appearance.height, "height");
  insertCell(curRow, hero.appearance.weight, "weight");
  insertCell(curRow, hero.biography.placeOfBirth);
  insertCell(curRow, hero.biography.alignment);
}

function insertCell(curRow, value, className) {
  const cell = curRow.insertCell();
  cell.textContent = value;
  if (className !== undefined) cell.className = className;
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
        if (size === pageSize || pageSize === heroes.length) ele.selected = true;
        selectInput.appendChild(ele);
    });

    selectInput.addEventListener('change', (event) => {
        pageSize = parseInt(event.target.value, 10);
        currentPage = 1; // Reset to first page
        updateHeroTable(heroes);
    });

    selectDiv.appendChild(selectInput);
    return selectDiv;
};

function insertPageSelect(heroes){
    const pageSelectDiv = document.createElement('div');
    pageSelectDiv.className = 'pagination';

    prevButton.textContent = 'Previous';
    prevButton.className = 'page-button';
    prevButton.addEventListener('click', () => {
            currentPage--;
            updateHeroTable(heroes);
    });
    pageSelectDiv.appendChild(prevButton);

    pageSelectDiv.appendChild(viewResult);

    nextButton.textContent = 'Next';
    nextButton.className = 'page-button';
    nextButton.addEventListener('click', () => {
            currentPage++;
            updateHeroTable(heroes);
    });
    pageSelectDiv.appendChild(nextButton);

    return pageSelectDiv;
};

// In your insertFunc.js file, modify the insertSearchBar function:

function insertSearchBar(heroes) {
  const searchBarDiv = document.createElement("div");
  searchBarDiv.className = "search-bar";

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search heroes...";
  searchInput.classList.add("search-input");

  searchInput.addEventListener("input", function (e) {
    currentPage = 1;
    searchStr = e.target.value.toLowerCase();
    updateHeroTable(heroes);
  });
  searchBarDiv.appendChild(searchInput);
  return searchBarDiv;
}
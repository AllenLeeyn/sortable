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
const searchStrOperators = [
    "Include",
    "Exclude",
];
const searchNumOperators = [
    "Equal",
    "Not Equal",
    "Greater Than",
    "Lesser Than",
];
const heroTable = document.createElement('table');
let pageSize = 20; //Default page value
let currentPage = 1;
let searchStr = '';
let searchIn = 'Name';
let searchOp = 'Include';
const searchStrOperator = document.createElement('select');
const searchNumOperator = document.createElement('select');

const prevButton = document.createElement('a');
const viewResult = document.createElement('a');
const nextButton = document.createElement('a');

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

    updateHeroTable(heroes)
    document.body.appendChild(heroTable);
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

function insertPageNav(heroes){
    const pageNavDiv = document.createElement('div');
    pageNavDiv.className = 'pagination';

    prevButton.textContent = 'Previous';
    prevButton.className = 'page-button';
    prevButton.addEventListener('click', () => {
            currentPage--;
            updateHeroTable(heroes);
    });
    pageNavDiv.appendChild(prevButton);

    pageNavDiv.appendChild(viewResult);

    nextButton.textContent = 'Next';
    nextButton.className = 'page-button';
    nextButton.addEventListener('click', () => {
            currentPage++;
            updateHeroTable(heroes);
    });
    pageNavDiv.appendChild(nextButton);

    return pageNavDiv;
};

function insertOptions(op, defVal, parent){
    const ele = document.createElement('option');
    ele.value = op;
    ele.textContent = op;
    if (op === defVal) ele.selected = true;
    parent.appendChild(ele);
}

function insertSearchBar(heroes) {
  const searchBarDiv = document.createElement("div");
  searchBarDiv.className = "search-bar";

  searchStrOperators.forEach((op) => insertOptions(op, searchOp, searchStrOperator));
  searchStrOperator.addEventListener('change', (event) => {
    searchOp = event.target.value;
    currentPage = 1; // Reset to first page
    updateHeroTable(heroes);
  });
  searchBarDiv.appendChild(searchStrOperator);


  searchNumOperators.forEach((op) => insertOptions(op, searchOp, searchNumOperator));
  searchNumOperator.addEventListener('change', (event) => {
    searchOp = event.target.value;
    currentPage = 1; // Reset to first page
    updateHeroTable(heroes);
  });
  searchBarDiv.appendChild(searchNumOperator);

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search heroes...";
  searchInput.classList.add("search-input");
  searchBarDiv.appendChild(searchInput);

  const searchLabel = document.createElement('label');
  searchLabel.textContent = ' in ';
  searchBarDiv.appendChild(searchLabel);

  const searchField = document.createElement('select');
  headers.forEach((head) => {
    if (head === 'Powerstats') return;
      const ele = document.createElement('option');
      ele.value = head;
      ele.textContent = head;
      if (head === searchIn) ele.selected = true;
      searchField.appendChild(ele);
  });
  searchBarDiv.appendChild(searchField);

  searchField.addEventListener('change', (event) => {
      searchIn = event.target.value;
      currentPage = 1; // Reset to first page
      updateHeroTable(heroes);
  });

  searchInput.addEventListener("input", function (e) {
    currentPage = 1;
    searchStr = e.target.value.toLowerCase();
    updateHeroTable(heroes);
  });

  return searchBarDiv;
}

function updateHeroTable(heroes){
    heroTable.innerHTML = '';
    insertHeaders(heroes);
    const selectedHeroes = [];

    if (searchIn === 'Height' || searchIn === 'Weight') {
        searchNumOperator.style.display = '';
        searchStrOperator.style.display = 'none';
        if (searchOp === 'Include' || searchOp === 'Exclude') {
            searchOp = 'Equal';
            searchNumOperator.value = 'Equal';
        };
    } else {
        searchNumOperator.style.display = 'none';
        searchStrOperator.style.display = '';
        if (searchOp === 'Equal' || searchOp === 'Not Equal' || searchOp === 'Greater Than' || searchOp === 'Lesser Than') {
            searchOp = 'Include';
            searchStrOperator.value = 'Include';
        };
    }
    heroes.forEach((hero)=>{
        let curVal = hero.name.toLowerCase();
        if (searchIn === 'Full Name') {
            curVal = hero.biography.fullName.toLowerCase()
        } else if (searchIn === 'Race') {
            curVal = (hero.appearance.race === null) ? curVal = "" : hero.appearance.race.toLowerCase()
        } else if (searchIn === 'Gender') {
            curVal = hero.appearance.gender.toLowerCase()
        } else if (searchIn === 'Height') {
            curVal = hero.appearance.height
        } else if (searchIn === 'Weight') {
            curVal = hero.appearance.weight
        } else if (searchIn === 'Place Of \nBirth') {
            curVal = hero.biography.placeOfBirth.toLowerCase()
        } else if (searchIn === 'Alignment') {
            curVal = hero.biography.alignment.toLowerCase()
        };
        
        if (searchOp === 'Include' && curVal.includes(searchStr)) return selectedHeroes.push(hero); 
        if (searchOp === 'Exclude' && !curVal.includes(searchStr)) return selectedHeroes.push(hero);

        if (searchOp === 'Equal' && curVal === Number(searchStr)) return selectedHeroes.push(hero); 
        if (searchOp === 'Not Equal' && curVal !== Number(searchStr)) return selectedHeroes.push(hero);
        if (searchOp === 'Greater Than' && curVal > Number(searchStr)) return selectedHeroes.push(hero); 
        if (searchOp === 'Lesser Than' && curVal < Number(searchStr)) return selectedHeroes.push(hero);
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
    let endIndex = startIndex + pageSize;
    endIndex = (endIndex > selectedHeroes.length) ? selectedHeroes.length: endIndex;
    viewResult.textContent = '[' + startIndex + ' - ' + endIndex + ' of '+selectedHeroes.length+']';
    const paginatedHeroes = selectedHeroes.slice(startIndex, endIndex);
    paginatedHeroes.forEach(hero => insertHeroEntries(hero));
};

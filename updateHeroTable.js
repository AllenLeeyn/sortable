import { sortTable } from "./sortFunc.js";
import { showHeroDetails } from "./showHeroDetails.js";
import { 
    heroTable,
    pwrStatsAbrv, headers,
    searchStrOperator, searchNumOperator,
    prevButton, viewResult, nextButton
} from "./constants.js";

function insertHeaders(heroes, searchIn, searchOp, currentPage, pageSize, searchStr){
    const headerRow = heroTable.insertRow();
    headers.forEach(headerTitle => {
        const th = document.createElement('th');
        th.textContent = headerTitle;
        headerRow.appendChild(th);

        th.addEventListener('click', ()=>{
            sortTable(heroes, headerTitle, heroTable);
            currentPage.value = 1;updateHeroTable(heroes, searchIn, searchOp, currentPage, pageSize, searchStr)
        });
    });
}

function insertCell(curRow, value, className) {
    const cell = curRow.insertCell();
    cell.textContent = value;
    if (className !== undefined) cell.className = className;
}

function insertHeroEntries(hero) {
  const curRow = heroTable.insertRow();
  curRow.addEventListener("click", () => showHeroDetails(hero));

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

export function updateHeroTable(heroes, searchIn, searchOp, currentPage, pageSize, searchStr){
    heroTable.innerHTML = '';
    insertHeaders(heroes, searchIn, searchOp, currentPage, pageSize, searchStr);
    const selectedHeroes = [];

    if (searchIn.value === 'Height' || searchIn.value === 'Weight') {
        searchNumOperator.style.display = '';
        searchStrOperator.style.display = 'none';
        if (searchOp.value === 'Include' || searchOp.value === 'Exclude') {
            searchOp.value = 'Equal';
            searchNumOperator.value = 'Equal';
        };
    } else {
        searchNumOperator.style.display = 'none';
        searchStrOperator.style.display = '';
        if (!(searchOp.value === 'Include' || searchOp.value === 'Exclude')) {
            searchOp.value = 'Include';
            searchStrOperator.value = 'Include';
        };
    }
    heroes.forEach((hero)=>{
        let curVal = hero.name.toLowerCase();
        if (searchIn.value === 'Full Name') {
            curVal = hero.biography.fullName.toLowerCase()
        } else if (searchIn.value === 'Race') {
            curVal = (hero.appearance.race === null) ? curVal = "" : hero.appearance.race.toLowerCase()
        } else if (searchIn.value === 'Gender') {
            curVal = hero.appearance.gender.toLowerCase()
        } else if (searchIn.value === 'Height') {
            curVal = hero.appearance.height
        } else if (searchIn.value === 'Weight') {
            curVal = hero.appearance.weight
        } else if (searchIn.value === 'Place Of \nBirth') {
            curVal = hero.biography.placeOfBirth.toLowerCase()
        } else if (searchIn.value === 'Alignment') {
            curVal = hero.biography.alignment.toLowerCase()
        };
        
        if (searchOp.value === 'Include' && curVal.includes(searchStr)) return selectedHeroes.push(hero); 
        if (searchOp.value === 'Exclude' && !curVal.includes(searchStr)) return selectedHeroes.push(hero);

        if (searchOp.value === 'Equal' && curVal === Number(searchStr)) return selectedHeroes.push(hero); 
        if (searchOp.value === 'Not Equal' && curVal !== Number(searchStr)) return selectedHeroes.push(hero);
        if (searchOp.value === 'Greater Than' && curVal > Number(searchStr)) return selectedHeroes.push(hero); 
        if (searchOp.value === 'Lesser Than' && curVal < Number(searchStr)) return selectedHeroes.push(hero);
    });
    
    if (currentPage.value === 1){
        prevButton.style.display = 'none';
    } else prevButton.style.display = '';
    const totalPages = Math.ceil(selectedHeroes.length / pageSize);
    if (currentPage.value === totalPages){
        nextButton.style.display = 'none';
    } else nextButton.style.display = '';

    const startIndex = (currentPage.value - 1) * pageSize;
    let endIndex = startIndex + pageSize;
    endIndex = (endIndex > selectedHeroes.length) ? selectedHeroes.length: endIndex;
    viewResult.textContent = '[' + startIndex + ' - ' + endIndex + ' of '+selectedHeroes.length+']';
    const paginatedHeroes = selectedHeroes.slice(startIndex, endIndex);
    paginatedHeroes.forEach(hero => insertHeroEntries(hero));
};

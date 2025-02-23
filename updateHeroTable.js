import { sortTable } from "./sortFunc.js";
import { showHeroDetails } from "./showHeroDetails.js";
import { 
    heroTable,
    pwrStatsAbrv, headers,
    searchStrOperator, searchNumOperator,
    prevButton, viewResult, nextButton
} from "./constants.js";

function insertHeaders(heroes, pgParam){
    const headerRow = heroTable.insertRow();
    headers.forEach(headerTitle => {
        const th = document.createElement('th');
        th.textContent = headerTitle;
        headerRow.appendChild(th);

        th.addEventListener('click', ()=>{
            sortTable(heroes, headerTitle, heroTable);
            pgParam.currentPage.val = 1;
            updateHeroTable(heroes, pgParam)
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

export function updateHeroTable(heroes, pgParam){
    heroTable.innerHTML = '';
    insertHeaders(heroes, pgParam);
    const selectedHeroes = [];

    if (pgParam.searchIn.val === 'Height' || pgParam.searchIn.val === 'Weight') {
        searchNumOperator.style.display = '';
        searchStrOperator.style.display = 'none';
        if (pgParam.searchOp.val === 'Include' || pgParam.searchOp.val === 'Exclude') {
            pgParam.searchOp.val = 'Equal';
            searchNumOperator.value = 'Equal';
        };
    } else {
        searchNumOperator.style.display = 'none';
        searchStrOperator.style.display = '';
        if (!(pgParam.searchOp.val === 'Include' || pgParam.searchOp.val === 'Exclude')) {
            pgParam.searchOp.val= 'Include';
            searchStrOperator.value = 'Include';
        };
    }
    heroes.forEach((hero)=>{
        let curVal = hero.name.toLowerCase();
        if (pgParam.searchIn.val === 'Full Name') {
            curVal = hero.biography.fullName.toLowerCase()
        } else if (pgParam.searchIn.val === 'Race') {
            curVal = (hero.appearance.race === null) ? curVal = "" : hero.appearance.race.toLowerCase()
        } else if (pgParam.searchIn.val === 'Gender') {
            curVal = hero.appearance.gender.toLowerCase()
        } else if (pgParam.searchIn.val === 'Height') {
            curVal = hero.appearance.height
        } else if (pgParam.searchIn.val === 'Weight') {
            curVal = hero.appearance.weight
        } else if (pgParam.searchIn.val === 'Place Of \nBirth') {
            curVal = hero.biography.placeOfBirth.toLowerCase()
        } else if (pgParam.searchIn.val === 'Alignment') {
            curVal = hero.biography.alignment.toLowerCase()
        };
        
        if (pgParam.searchOp.val === 'Include' && curVal.includes(pgParam.searchStr)) return selectedHeroes.push(hero); 
        if (pgParam.searchOp.val === 'Exclude' && !curVal.includes(pgParam.searchStr)) return selectedHeroes.push(hero);

        if (pgParam.searchOp.val === 'Equal' && curVal === Number(pgParam.searchStr)) return selectedHeroes.push(hero); 
        if (pgParam.searchOp.val === 'Not Equal' && curVal !== Number(pgParam.searchStr)) return selectedHeroes.push(hero);
        if (pgParam.searchOp.val === 'Greater Than' && curVal > Number(pgParam.searchStr)) return selectedHeroes.push(hero); 
        if (pgParam.searchOp.val === 'Lesser Than' && curVal < Number(pgParam.searchStr)) return selectedHeroes.push(hero);
    });
    
    if (pgParam.currentPage.val === 1){
        prevButton.style.display = 'none';
    } else prevButton.style.display = '';
    const totalPages = Math.ceil(selectedHeroes.length / pgParam.pageSize);
    if (pgParam.currentPage.val === totalPages){
        nextButton.style.display = 'none';
    } else nextButton.style.display = '';

    const startIndex = (pgParam.currentPage.val - 1) * pgParam.pageSize;
    let endIndex = startIndex + pgParam.pageSize;
    endIndex = (endIndex > selectedHeroes.length) ? selectedHeroes.length: endIndex;
    viewResult.textContent = '[' + startIndex + ' - ' + endIndex + ' of '+selectedHeroes.length+']';
    const paginatedHeroes = selectedHeroes.slice(startIndex, endIndex);
    paginatedHeroes.forEach(hero => insertHeroEntries(hero));
};

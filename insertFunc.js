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
let searchIn = 'Name';

const prevButton = document.createElement('a');
const viewResult = document.createElement('a');
const nextButton = document.createElement('a');

export function insertHeroTable(heroes){

    const optionDiv = document.createElement('div');
    optionDiv.className = 'options';
    document.body.appendChild(optionDiv);

    optionDiv.appendChild(insertSelect(heroes));
    optionDiv.appendChild(insertSearchBar(heroes));


    const secOptionDiv = document.createElement('div');
    secOptionDiv.className = 'options';
    secOptionDiv.classList.add('secOptions');
    document.body.appendChild(secOptionDiv);
    secOptionDiv.appendChild(insertPageSelect(heroes));

    updateHeroTable(heroes)
    document.body.appendChild(heroTable);
};

function updateHeroTable(heroes){
    heroTable.innerHTML = '';
    insertHeaders(heroes);
    const selectedHeroes = [];

    heroes.forEach((hero)=>{
        let curVal = '';
        if (searchIn === 'Name') curVal = hero.name.toLowerCase();
        if (searchIn === 'Full Name') curVal = hero.biography.fullName.toLowerCase();
        if (searchIn === 'Race') curVal = (hero.appearance.race === null) ? curVal = "" : hero.appearance.race.toLowerCase();
        if (searchIn === 'Gender') curVal = hero.appearance.gender.toLowerCase();
        if (searchIn === 'Place Of \nBirth') curVal = hero.biography.placeOfBirth.toLowerCase();
        if (searchIn === 'Alignment')curVal = hero.biography.alignment.toLowerCase();
        
        if (curVal.includes(searchStr)) selectedHeroes.push(hero);
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
  searchBarDiv.appendChild(searchInput);

  const searchLabel = document.createElement('label');
  searchLabel.textContent = ' in ';
  searchBarDiv.appendChild(searchLabel);

  const searchField = document.createElement('select');
  const searchHeaders = [
    "Name",
    "Full Name",
    "Race",
    "Gender",
    `Place Of \nBirth`,
    "Alignment",
  ];
  searchHeaders.forEach((head) => {
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
function showHeroDetails(hero) {
  const existingModal = document.querySelector('.modal-overlay');
  if (existingModal) existingModal.remove();

  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';

  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  // Close button
  const closeButton = document.createElement('button');
  closeButton.className = 'modal-close';
  closeButton.textContent = '×';
  closeButton.onclick = () => modalOverlay.remove();

  // Left side - Image and Basic Info
  const leftSection = document.createElement('div');
  leftSection.className = 'modal-left';

  const heroImage = document.createElement('img');
  heroImage.src = hero.images.lg;
  heroImage.alt = hero.name;
  heroImage.className = 'modal-hero-image';

  const nameHeader = document.createElement('h2');
  nameHeader.textContent = hero.name;

  leftSection.append(heroImage, nameHeader);

  // Right side - Details
  const rightSection = document.createElement('div');
  rightSection.className = 'modal-right';

  // Powerstats Section
  const powerstatsSection = createSection('Powerstats');
  Object.entries(hero.powerstats).forEach(([stat, value]) => {
      const statBar = document.createElement('div');
      statBar.className = 'stat-bar';
      statBar.innerHTML = `
          <span>${stat.charAt(0).toUpperCase() + stat.slice(1)}: ${value}</span>
          <div class="stat-bar-fill" style="width: ${value}%"></div>
      `;
      powerstatsSection.appendChild(statBar);
  });

  // Appearance Section
  const appearanceSection = createSection('Appearance');
  const appearanceDetails = {
      Gender: hero.appearance.gender,
      Race: hero.appearance.race || 'Unknown',
      Height: `${hero.appearance.height[1]}`,
      Weight: `${hero.appearance.weight[1]}`,
      'Eye Color': hero.appearance.eyeColor,
      'Hair Color': hero.appearance.hairColor
  };
  appendDetails(appearanceSection, appearanceDetails);

  // Biography Section
  const biographySection = createSection('Biography');
  const biographyDetails = {
      'Full Name': hero.biography.fullName || 'Unknown',
      'Alter Egos': hero.biography.alterEgos,
      Aliases: hero.biography.aliases.join(', '),
      'Place of Birth': hero.biography.placeOfBirth,
      Alignment: hero.biography.alignment
  };
  appendDetails(biographySection, biographyDetails);

  // Work Section
  const workSection = createSection('Work');
  const workDetails = {
      Occupation: hero.work.occupation || 'Unknown',
      Base: hero.work.base || 'Unknown'
  };
  appendDetails(workSection, workDetails);

  // Connections Section
  const connectionsSection = createSection('Connections');
  const connectionDetails = {
      'Group Affiliation': hero.connections.groupAffiliation || 'None',
      Relatives: hero.connections.relatives || 'None'
  };
  appendDetails(connectionsSection, connectionDetails);

  // Append all sections
  rightSection.append(
      powerstatsSection,
      appearanceSection,
      biographySection,
      workSection,
      connectionsSection
  );

  modalContent.append(closeButton, leftSection, rightSection);
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);
}

// Helper function to create sections
function createSection(title) {
  const section = document.createElement('div');
  section.className = 'modal-section';
  const sectionTitle = document.createElement('h3');
  sectionTitle.textContent = title;
  section.appendChild(sectionTitle);
  return section;
}

// Helper function to append details to sections
function appendDetails(section, details) {
  Object.entries(details).forEach(([key, value]) => {
      const detail = document.createElement('p');
      detail.className = 'detail-item';
      detail.innerHTML = `<span class="detail-label">${key}:</span> ${value}`;
      section.appendChild(detail);
  });
}
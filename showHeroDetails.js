export function showHeroDetails(hero) {
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) existingModal.remove();

    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const closeButton = document.createElement('button');
    closeButton.className = 'modal-close';
    closeButton.textContent = 'x';
    closeButton.onclick = () => modalOverlay.remove();

    const leftSection = document.createElement('div');
    leftSection.className = 'modal-left';

    const heroImage = document.createElement('img');
    heroImage.src = hero.images.lg;
    heroImage.alt = hero.name;
    heroImage.className = 'modal-hero-image';

    const nameHeader = document.createElement('h2');
    nameHeader.textContent = hero.name;

    leftSection.append(heroImage, nameHeader);

    const rightSection = document.createElement('div');
    rightSection.className = 'modal-right';

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

    const appearanceSection = createSection('Appearance');
    const appearanceDetails = {
        Gender: hero.appearance.gender,
        Race: hero.appearance.race || 'Unknown',
        Height: `${hero.appearance.height} cm`,
        Weight: `${hero.appearance.weight} kg`,
        'Eye Color': hero.appearance.eyeColor,
        'Hair Color': hero.appearance.hairColor
    };
    appendDetails(appearanceSection, appearanceDetails);


    const biographySection = createSection('Biography');
    const biographyDetails = {
        'Full Name': hero.biography.fullName || 'Unknown',
        'Alter Egos': hero.biography.alterEgos,
        Aliases: hero.biography.aliases.join(', '),
        'Place of Birth': hero.biography.placeOfBirth,
        Alignment: hero.biography.alignment
    };
    appendDetails(biographySection, biographyDetails);


    const workSection = createSection('Work');
    const workDetails = {
        Occupation: hero.work.occupation || 'Unknown',
        Base: hero.work.base || 'Unknown'
    };
    appendDetails(workSection, workDetails);


    const connectionsSection = createSection('Connections');
    const connectionDetails = {
        'Group Affiliation': hero.connections.groupAffiliation || 'None',
        Relatives: hero.connections.relatives || 'None'
    };
    appendDetails(connectionsSection, connectionDetails);


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

let bikes = [];
let currentIndex = 0;

async function loadBikes() {
    try {
        const response = await fetch('bikes.json');
        if (!response.ok) throw new Error('Failed to load data');
        return await response.json();
    }
    catch (error) {
        console.error('Error occured: ', error);
        document.querySelector('.bike-section-menu').innerHTML =
            '<p class="error">Failed to load menu<p>';
        return [];
    }
}

async function displayBike() {
    bikes = await loadBikes();
    if (bikes.length > 0) {
        createBikeItem(0);
    }
}

function createBikeItem(index) {
    currentIndex = index;
    const container = document.querySelector('.bike-section-menu');
    container.innerHTML = `
        <div class="name-and-price-container">
            <span id="bikeName">${bikes[index].name}</span>
            <span id="bikePrice">${bikes[index].price} BYN</span>
        </div>
        <div class="gallery">
            <div class="image-button">
                <button class="arrow-button left"></button>
            </div>
            <div class="bike-image-container">
                <img src="${bikes[index].image}" alt="${bikes[index].name}">
            </div>
            <div class="image-button">
                <button class="arrow-button right"></button>
            </div>
        </div>
        <div class="bike-dots">
            ${bikes.map((b, i) => `
                <span class="dot${i === index ? ' active' : ''}" data-index="${i}">
                    <span class="dot-bg"><img src="${b.color}" alt="mini" /></span>
                </span>
            `).join('')}
        </div>
    `;
    addArrowListeners();
    addDotListeners();
}

function slideTo(newIndex, direction) {
    const container = document.querySelector('.bike-image-container');
    const oldImg = container.querySelector('img');
    const newImg = document.createElement('img');
    newImg.src = bikes[newIndex].image;
    newImg.alt = bikes[newIndex].name;
    newImg.style.position = 'absolute';
    newImg.style.top = 0;
    newImg.style.left = 0;
    newImg.style.width = '100%';
    newImg.style.height = '100%';
    newImg.style.objectFit = 'contain';
    newImg.style.transition = 'transform 0.5s cubic-bezier(.77,0,.18,1), opacity 0.3s';
    newImg.style.opacity = 1;
    // Начальная позиция нового изображения
    newImg.style.transform = `translateX(${direction === 'right' ? '-' : ''}100%)`;
    container.appendChild(newImg);
    // Запускаем анимацию
    setTimeout(() => {
        oldImg.style.transform = `translateX(${direction === 'right' ? '100%' : '-100%'})`;
        newImg.style.transform = 'translateX(0)';
    }, 20);
    // После анимации меняем содержимое
    setTimeout(() => {
        container.innerHTML = '';
        container.appendChild(newImg);
        updateNameAndPrice(newIndex);
        updateDots(newIndex);
        currentIndex = newIndex;
        addArrowListeners();
        addDotListeners();
    }, 520);
}

function updateNameAndPrice(index) {
    document.getElementById('bikeName').textContent = bikes[index].name;
    document.getElementById('bikePrice').textContent = bikes[index].price + ' ₽';
}
function updateDots(index) {
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}
function addArrowListeners() {
    document.querySelector('.arrow-button.left').onclick = () => {
        let newIndex = (currentIndex - 1 + bikes.length) % bikes.length;
        slideTo(newIndex, 'left');
    };
    document.querySelector('.arrow-button.right').onclick = () => {
        let newIndex = (currentIndex + 1) % bikes.length;
        slideTo(newIndex, 'right');
    };
}
function addDotListeners() {
    document.querySelectorAll('.dot').forEach(dot => {
        dot.onclick = () => {
            let idx = +dot.dataset.index;
            if (idx !== currentIndex) slideTo(idx, idx > currentIndex ? 'right' : 'left');
        };
    });
}

function isValidColor(strColor) {
    const s = new Option().style;
    s.color = strColor;
    return s.color !== '';
}

displayBike();
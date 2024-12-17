const $wishesContainer = $('#wishesContainer');
const apiUrl = 'https://5al5s80f32.execute-api.ap-northeast-1.amazonaws.com/dev/wedding-wishes';
const delayAppear = 15000;
const senderAnimations = [
    "shake", "pulse", "flicker", "wave",
    "bounce", "fade", "slide", "glitch",
    "flip", "zoom", "jello", "elastic",
    "swing", "rubberBand", "floating", "rainbow",
];
const contentAnimations = [
    'dropping', 'zooming', 'flipping', 'spinning',
    'fading', 'sliding-left', 'sliding-right',
];
const items = [
    '💖', '💕', '🌸', '💝',
    '💗', '💓', '💞', '🧡',
    '💛', '💚', '💜', '💑',
];

let data = [];
let wishesToDisplay = [];
let displayInterval;

// Fetch data from S3 via API Gateway and Lambda
function fetchWishes() {
    $.ajax({
        url: apiUrl,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        success: function (apiData) {
            data = apiData;
            processData();
        },
        error: function (error) {
            console.error('Error fetching data:', error);
            processData();
        }
    });
}

// Handle new and old data. Store to the Local Storage.
function processData() {
    console.log("data", data);
    // Get wishes stored in localstorage.
    const storedData = JSON.parse(localStorage.getItem('wishes')) || [];

    // Filter the deleted wishes
    const validStoredData = storedData.filter(storedWish => data.some(wish => isEqual(wish, storedWish)));

    // Detect new wishes
    const newWishes = data.filter(wish => !storedData.some(storedWish => isEqual(wish, storedWish)));

    // Push new wishes to head and shuffle old wishes.
    wishesToDisplay = [...newWishes, ...shuffleArray(validStoredData)];
    console.log("DATA SHOW: ", wishesToDisplay)
    data.length && localStorage.setItem('wishes', JSON.stringify(data));

    displayWishes();
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Handle compare 2 object
function isEqual(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (let key of keys1) {
        if (obj1[key] !== obj2[key]) {
            return false;
        }
    }

    return true;
}

// Handle display the wishes to the screen
function displayWishes() {
    if (displayInterval) {
        clearInterval(displayInterval);
    }

    let index = 0;
    displayInterval = setInterval(function () {

        if (index === wishesToDisplay.length) {
            clearInterval(displayInterval);
            fetchWishes(); // Recall API when the loop end

            handleAppearWishes("Thank you!", "Hãy quét mã QR trên bàn để nhắn gửi lời hay ý đẹp đến tụi mình nhé! ^_^")

            return;
        }

        const wish = wishesToDisplay[index];

        handleAppearWishes(wish.name, wish.content)

        index++;
    }, delayAppear);
}

function handleAppearWishes(sender, content) {
    $wishesContainer.empty();

    const contentAnimation = getRandomAnimation(contentAnimations);
    const senderAnimation = getRandomAnimation(senderAnimations);

    const contentElement = prepareParagraphEffect(content, contentAnimation);

    $wishesContainer.append(contentElement);
    animateParagraphEffect(contentAnimation)
    $wishesContainer.append(handleCharacterEffect(sender, 'sender', senderAnimation));
}

// Get a random animation type
function getRandomAnimation(animationTypes) {
    return animationTypes[Math.floor(Math.random() * animationTypes.length)];
}

// Apply the animation CSS to affect each character.
function handleCharacterEffect(text, baseClass, effect) {
    const words = text.split(' ');
    const container = document.createElement('div');

    container.className = `${baseClass} ${effect} color-change`;

    words.forEach((word, wordIndex) => {
        for (let i = 0; i < word.length; i++) {
            const span = document.createElement("span");

            span.textContent = word[i];
            span.style.setProperty("--i", i);

            container.appendChild(span);
        }

        if (wordIndex < words.length - 1) {
            const space = document.createElement("span");

            space.className = "space";

            container.appendChild(space);
        }
    });

    return container;
}

// *1 - Prepare a container to apply the animation CSS to affect each character in the paragraph.
function prepareParagraphEffect(text, className) {
    const container = document.createElement('div');
    container.innerHTML = '';
    container.className = `content ${className} color-change`;
    container.id = `${className}`;

    // Logic run each character
    // text.split('').forEach(char => {
    //     const span = document.createElement('span');
    //
    //     span.className = (char === ' ') ? 'char space' : 'char';
    //     span.textContent = char;
    //
    //     container.appendChild(span);
    // });

    // Logic run each word
    text.split(' ').forEach(char => {
        const span = document.createElement('span');

        span.className = 'char';
        span.textContent = char;

        container.appendChild(span);
    });

    return container;
}

// *2 - Display paragraph with each character effect prepared above
function animateParagraphEffect(elementId) {
    const container = document.getElementById(elementId);

    container.querySelectorAll('.char').forEach((char, index) => {
        char.style.animationDelay = `${index * 200}ms`;
    });
}

// Handle heart items falling
function createItem() {
    const item = document.createElement('div');

    item.innerHTML = items[Math.floor(Math.random() * items.length)];
    item.classList.add('falling-item');
    item.style.left = Math.random() * 100 + 'vw';
    item.style.fontSize = (Math.random() * 20 + 10) + 'px';
    item.style.animationDuration = (Math.random() * 5 + 5) + 's';
    item.style.opacity = Math.random() * 0.5 + 0.5;

    document.body.prepend(item);

    // Remove the item after animation completes
    setTimeout(() => {
        item.remove();
    }, parseFloat(item.style.animationDuration) * 1000);
}

// Create new items periodically
setInterval(createItem, 400);

// Initial items
for (let i = 0; i < 10; i++) {
    createItem();
}

// Call the first time to get the data
fetchWishes();

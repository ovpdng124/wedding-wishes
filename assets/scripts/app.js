const $wishesContainer = $('#wishesContainer');
const apiUrl = 'https://5al5s80f32.execute-api.ap-northeast-1.amazonaws.com/dev/wedding-wishes';
const delayAppear = 5000;

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
        success: function(apiData) {
            data = apiData;
            processData();
        },
        error: function(error) {
            console.error('Error fetching data:', error);
            processData();
        }
    });
}

// Handle new and old data. Store to the Local Storage.
function processData() {
    const storedData = JSON.parse(localStorage.getItem('wishes')) || [];
    const newWishes = data.filter(wish => !storedData.some(storedWish => isEqual(wish, storedWish)));

    wishesToDisplay = [...newWishes, ...shuffleArray(storedData)];

    data.length && localStorage.setItem('wishes', JSON.stringify(data));

    displayWishes();
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
    displayInterval = setInterval(function() {

        if (index === wishesToDisplay.length) {
            clearInterval(displayInterval);
            fetchWishes(); // Recall API when the loop end

            handleAppearWishes("Thank you!", "Let's scan the QR on the table to send the wish for us!")

            return;
        }

        const wish = wishesToDisplay[index];

        handleAppearWishes(wish.name, wish.content)

        index++;
    }, delayAppear);
}

function handleAppearWishes(title, content) {
    $wishesContainer.empty();

    const $wishElement = $('<div>').addClass('wish');
    $wishElement.append($('<h3>').text(title));
    $wishElement.append($('<p>').text(content));

    $wishesContainer.append($wishElement);
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Call the first time to get the data
fetchWishes();

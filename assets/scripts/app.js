const $wishesContainer = $('#wishesContainer');
const apiUrl = 'https://5al5s80f32.execute-api.ap-northeast-1.amazonaws.com/dev/wedding-wishes'; // Thay đổi đường dẫn API tại đây
const delayAppear = 5000;

let data = [];
let wishesToDisplay = [];
let displayInterval;

// Hàm để lấy dữ liệu từ API
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

// Hàm để xử lý dữ liệu mới và cũ
function processData() {
    const storedData = JSON.parse(localStorage.getItem('wishes')) || [];
    const newWishes = data.filter(wish => !storedData.some(storedWish => isEqual(wish, storedWish)));

    wishesToDisplay = [...newWishes, ...shuffleArray(storedData)];
    console.log("WISHES: ", wishesToDisplay)
    data.length && localStorage.setItem('wishes', JSON.stringify(data));

    displayWishes();
}

// Hàm để so sánh hai đối tượng
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

// Hàm để hiển thị wishes lên trang web
function displayWishes() {
    if (displayInterval) {
        clearInterval(displayInterval);
    }

    let index = 0;
    displayInterval = setInterval(function() {

        if (index === wishesToDisplay.length) {
            clearInterval(displayInterval);
            fetchWishes(); // Gọi lại API sau khi hiển thị xong

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

// Gọi lấy dữ liệu ban đầu
fetchWishes();

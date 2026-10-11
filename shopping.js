var data = [];
var cart = [];
var wishlist = [];

$("#searchBtn").on("click", function () {
    var searchRequest = $("#searchBar")[0].value;
    console.log(searchRequest);
    // $.getJSON('./api/search/' + searchRequest, function (result) {
    //     console.log('Data received:', result);
    //     data = result;
    //     loadContent('search');
    // }).fail(function (jqXHR, textStatus, errorThrown) {
    //     console.error('Request failed:', textStatus, errorThrown);
    // });

    data = testData;
    loadContent('search');
});

function loadContent(contentType) {
    for (var i = 0; i < data.length; i++) {
        var price = data[i].extracted_price;
        var oldPrice = price;
        if (data[i].extracted_old_price != null) {
            oldPrice = data[i].extracted_old_price;
        }
        data[i].percentOff = (oldPrice - price) / oldPrice * 100;
        if (data[i].id == null){
            data[i].id = crypto.randomUUID();
        }
    }


    var selectedValue = $('#resultSorts input[type="radio"]:checked').val();
    switch (selectedValue) {
    case 'ratingSort':
        sortByRating(contentType);
        break;
    case 'priceSort':
        sortByPrice(contentType);
        break;
    case 'saleSort':
        sortBySale(contentType);
        break;
    }
}

function loadItem(displayedData, contentType) {
    $.get('item.html', function (ItemHTML) {
        var ItemHTML = $(ItemHTML);

        var itemName = displayedData.title;
        var image = displayedData.thumbnail;
        var url = displayedData.product_link;
        var price = displayedData.extracted_price;
        var oldPrice = price;
        if (displayedData.extracted_old_price != null) {
            oldPrice = displayedData.extracted_old_price;
        }
        var rating = displayedData.rating;
        var ratingColor;
        var percentOff = displayedData.percentOff;

        ItemHTML.find('#itemName').text(itemName);
        ItemHTML.find("#image").attr("src", image);
        ItemHTML.find("#url").attr("url", url);
        ItemHTML.find("#linkBtn").on("click", function () {
            window.open(url, '_blank');
        });
        ItemHTML.find("#price").text(price.toFixed(2));
        if (oldPrice > price) {
            ItemHTML.find("#oldPrice").text("$" + oldPrice.toFixed(2));
            ItemHTML.find("#percentOff").text("ㅤ" + (percentOff).toFixed(2) + "% Off!");
        }

        ItemHTML.find("#rating").text(rating);
        ItemHTML.find("#ratingBar").attr("aria-valuenow", rating);
        ItemHTML.find("#ratingBar").attr("style", "width: " + (rating / 5 * 100) + "%");
        if (rating <= 2) { ratingColor = "bg-danger" }
        else if (rating <= 3) { ratingColor = "bg-warning" }
        else if (rating <= 4) { ratingColor = "bg-info" }
        else { ratingColor = "bg-success" }
        ItemHTML.find("#ratingBar").attr("class", "progress-bar progress-bar-striped progress-bar-animated " + ratingColor);



        switch (contentType) {
        case 'cart':
            ItemHTML.find("#cartBtnImg").attr('src', 'img/RmvCartBtn.png');
            ItemHTML.find("#wishlistBtnImg").attr('src', 'img/WishlistBtn.png');

            ItemHTML.find("#addToCartBtn").on("click", function () {
                cart = cart.filter(record => record.id !== displayedData.id);
                data = cart;
                loadContent('cart');
                updateCart();
            });
            ItemHTML.find("#addToWishlistBtn").on("click", function () {
                 const dataCopy = structuredClone(displayedData);
                dataCopy.id = crypto.randomUUID();
                wishlist.push(dataCopy);
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
            });
            break;
        case 'wishlist':
            ItemHTML.find("#cartBtnImg").attr('src', 'img/CartBtn.png');
            ItemHTML.find("#wishlistBtnImg").attr('src', 'img/RmvWishlistBtn.png');

            ItemHTML.find("#addToCartBtn").on("click", function () {
                const dataCopy = structuredClone(displayedData);
                dataCopy.id = crypto.randomUUID();
                cart.push(dataCopy);
                updateCart();
            });
            ItemHTML.find("#addToWishlistBtn").on("click", function () {
                wishlist = wishlist.filter(record => record.id !== displayedData.id);
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
                data = wishlist;
                loadContent('wishlist');
            });
            break;
        default:
            ItemHTML.find("#cartBtnImg").attr('src', 'img/CartBtn.png');
            ItemHTML.find("#wishlistBtnImg").attr('src', 'img/WishlistBtn.png');

            ItemHTML.find("#addToCartBtn").on("click", function () {
                const dataCopy = structuredClone(displayedData);
                dataCopy.id = crypto.randomUUID();
                cart.push(dataCopy);
                updateCart();
            });
            ItemHTML.find("#addToWishlistBtn").on("click", function () {
                const dataCopy = structuredClone(displayedData);
                dataCopy.id = crypto.randomUUID();
                wishlist.push(dataCopy);
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
            });
            break;
        }

        $('#results').append(ItemHTML);
    });
}

function updateCart() {
    var totalPrice = 0;
    $('#items').text(cart.length);
    for (var i = 0; i < cart.length; i++) {
        totalPrice += cart[i].extracted_price;
    }
    $("#fCost").text(totalPrice.toFixed(2));
}

function sortByRating(contentType) {
    $('#results').empty();
    data.sort((a, b) => b.rating - a.rating);
    for (var i = 0; i < data.length; i++) {
        loadItem(data[i], contentType);
    }
}
function sortByPrice(contentType) {
    $('#results').empty();
    data.sort((a, b) => a.extracted_price - b.extracted_price);
    for (var i = 0; i < data.length; i++) {
        loadItem(data[i], contentType);
    }
}
function sortBySale(contentType) {
    $('#results').empty();
    data.sort((a, b) => b.percentOff - a.percentOff);
    for (var i = 0; i < data.length; i++) {
        loadItem(data[i], contentType);
    }
}


// Side Bar Code
var budget = 284.01;
var fCost = 0;
$("#budget").text(budget.toFixed(2));
$("#items").text(cart.length);
$("#fCost").text("0.00");


$("#wishlistBtn").on("click", function () {
    data = wishlist;
    loadContent('wishlist');
});
$("#cartBtn").on("click", function () {
    data = cart;
    loadContent('cart');
});


$("#ratingSort").on("click", function () {
    console.log("Rating Sort");
    sortByRating();
});
$("#priceSort").on("click", function () {
    console.log("Price Sort");
    sortByPrice();
});
$("#saleSort").on("click", function () {
    console.log("Sale Sort");
    sortBySale();
});

// ON PAGE LOAD
$(document).ready(function () {
    const savedData = localStorage.getItem('wishlist');
    if (savedData != null){
        wishlist = JSON.parse(savedData);
        data = wishlist;
        loadContent('wishlist');
    }
});
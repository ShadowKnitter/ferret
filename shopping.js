var data = [];
var cart = [];
var wishlist = [];

$("#searchBtn").on("click", function () {
    var searchRequest = $("#searchBar")[0].value;
    console.log(searchRequest);
    $.getJSON('./api/search/' + searchRequest, function (result) {
        console.log('Data received:', result);
        data = result;
        loadContent('search');
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.error('Request failed:', textStatus, errorThrown);
    });

    // data = testData;
    // loadContent('search');
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
        // ItemHTML.find("#url").attr("url", url);
        ItemHTML.find("#linkBtn").on("click", function () {
            window.open(url, '_blank');
        });
        if (displayedData.installment != null){
            ItemHTML.find("#price").text(displayedData.installment.price);
        }
        else{
            ItemHTML.find("#price").text("$"+price.toFixed(2));
        }
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
            $("#cartImg").attr('src', 'img/Checkout.png');

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
            $("#cartImg").attr('src', 'img/Cart.png');

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
            $("#cartImg").attr('src', 'img/Cart.png');

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
    for (var i = 0; i < cart.length; i++) {
        totalPrice += cart[i].extracted_price;
    }
    if (totalPrice > budget){
        alert("Item does not fit in your budget. Add it to your wishlist to find it easily when you have enough!");
        cart.pop();
    }
    else{
        $('#items').text(cart.length);
        $("#fCost").text(totalPrice.toFixed(2));
    }
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
var budget = 0;
var fCost = 0;
$("#budget").text(budget.toFixed(2));
$("#items").text(cart.length);
$("#fCost").text("0.00");


$("#wishlistBtn").on("click", function () {
    data = wishlist;
    loadContent('wishlist');
});

$("#budgetBarBtn").on("click", function () {
    budget += parseFloat($("#budgetBar")[0].value);
    $("#budget").text((budget).toFixed(2));
    localStorage.setItem('budget', JSON.stringify(budget));
});
$("#cartBtn").on("click", function () {
    if($("#cartImg").attr('src') == "img/Cart.png"){
        data = cart;
        loadContent('cart');
    }
    else{
        var totalPrice = 0;
        for (var i = 0; i < cart.length; i++) {
            totalPrice += cart[i].extracted_price;
        }
        if(confirm("Would you like to buy all these items for $"+totalPrice)){
            budget-=totalPrice;
            $("#budget").text((budget).toFixed(2));
            localStorage.setItem('budget', JSON.stringify(budget));
            cart.length = [0];
            updateCart();
            data=cart;
            loadContent('cart');
        }
    }
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
    console.log("Credit to Serp API and Freetouse.com for the search functionality and music respectivly.");

    var music = $('#bg-music')[0];
    $(document).one('click', function() {
        music.play();
    });

    const clickSound = new Audio('Mouse.mp3'); 
    $(document).on('click', function() {
        clickSound.currentTime = 0;    
        clickSound.play().catch(function(error) {
            console.log("Playback blocked until user interacts with the page:", error);
        });
    });

    const savedWishlist = localStorage.getItem('wishlist');
    const savedBudget = localStorage.getItem('budget');
    if (savedWishlist != null){
        wishlist = JSON.parse(savedWishlist);
        data = wishlist;
        loadContent('wishlist');
    }
    if (savedBudget != null){
        budget = JSON.parse(savedBudget);
        $("#budget").text((budget).toFixed(2));
    }
    if (savedBudget == null && savedWishlist == null){
        alert("Welcome to Ferret! Search at the top to get started, and check around the menus by pressing any graphical icon on screen!");
    }
});
$(document).ready(function () {
    var budget = 284.01;
    var fCost = 0;
    

    var cart = [];
    var wishlist = [];

    var displayedData= []
    for (let i=0; i<data.length; i++){
        displayedData[i]=[];
        displayedData[i][0]=data[i].title;
        displayedData[i][1]=data[i].extracted_price;
        displayedData[i][2]=data[i].extracted_old_price;
        displayedData[i][3]=data[i].thumbnail;
        displayedData[i][4]=data[i].rating;
        
    }

    var itemName = displayedData[0][0];
    var image = displayedData[0][3];
    var url = "https://www.google.com/search?ibp=oshop&q=Macbook&prds=catalogid:592209059139430148,productid:11531162310095970272,headlineOfferDocid:16026323275453799959,imageDocid:14971461360516834628,rds:PC_8602998232814770163|PROD_PC_8602998232814770163,gpcid:8602998232814770163,mid:576462562025329966,pvt:hg&hl=en&gl=us&udm=28"
    var price = displayedData[0][1];
    var oldPrice = price;
    if (displayedData[0][2] != null){
        oldPrice = displayedData[0][2];
    }
    var rating = displayedData[0][4];
    var ratingColor;


    $("#budget").text(budget.toFixed(2));
    $("#items").text(cart.length);
    $("#fCost").text("0.00");


    $("#itemName").text(itemName);
    $("#image").attr("src", image);
    $("#url").attr("url", url);
    $("#linkBtn").on("click", function(){
        window.open(url, '_blank');
    });
    $("#price").text(price.toFixed(2));
    if(oldPrice > price){
        $("#oldPrice").text("$" + oldPrice.toFixed(2));
        $("#percentOff").text("ㅤㅤ"+(100-(oldPrice/price).toFixed(0)) + "% Off!");
    }

    $("#rating").text(rating);
    $("#ratingBar").attr("aria-valuenow", rating);
    $("#ratingBar").attr("style", "width: "+(rating/5*100)+"%");
    if(rating<=2){ratingColor = "bg-danger"}
    else if(rating<=3){ratingColor = "bg-warning"}
    else if(rating<=4){ratingColor = "bg-info"}
    else{ratingColor = "bg-success"}
    $("#ratingBar").attr("class", "progress-bar progress-bar-striped progress-bar-animated "+ratingColor);

    $("#addToCartBtn").on("click", function(){
        cart.push(price);
        $("#items").text(cart.length);
        var total = 0;
        for(var i = 0; i<cart.length; i++){
            total += cart[i];
        }
        $("#fCost").text(total.toFixed(2));

    });
    $("#cartBtn").on("click", function(){
        for(var i = 0; i<cart.length; i++){
            console.log(cart[i]);
        }
    });

    $("#addToWishlistBtn").on("click", function(){
        wishlist.push(itemName);
    });
    $("#wishlistBtn").on("click", function(){
        for(var i = 0; i<wishlist.length; i++){
            console.log(wishlist[i]);
        }
    });
});
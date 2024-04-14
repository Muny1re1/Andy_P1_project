document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:3000/images")
        .then(response => response.json())
        .then(data => {
            generateSlideshow(data);
        })
        .catch(err => console.log(err));
});
//coming up with function to generate a slide show at the bottom of our html page.
function generateSlideshow(data) {
    // Creating an array of image srcs using the data from our server.
    const images = data.map(image => image.src);
    //Taking our container of id slideshow and appending a child to it which acts as the initial slide.
    const slideShowContainer = document.getElementById("slideshow");
    const slide = document.createElement("img");
    slide.src = images[0]
    slideShowContainer.appendChild(slide);
    //creating a function to change the slide every 3 seconds.
    let i = 0
    setInterval(() => {
        i = (i + 1) % images.length;
        slide.src = images[i];
    }, 3000)
}
//grabbing the make order nav element.
const makeOrderButton = document.getElementById("make_order");
//adding an event listener to it with a click type and a function that changes the display.
makeOrderButton.addEventListener("click", changeDisplay);
//changeDisplay function.
function changeDisplay() {
    //grabbing the unordered list element to append li tags to it.
    const unorderedList = document.getElementById("display-description");
    unorderedList.id = "Solditems"
    //removing the li tags present first.
    if (unorderedList) {
        const liTags = unorderedList.querySelectorAll("li");

        liTags.forEach(li => {
            unorderedList.removeChild(li);
        });
    } else {
        console.log("Element with id 'display-description' not found.");
    }
    //appending litags with values of newListitems and ids of the same, to the unordered list.
    const newList = ["groceries", "toiletries", "emergencies"]
    newList.forEach(item => {
        const listTags = document.createElement("li");
        listTags.textContent = item;
        unorderedList.appendChild(listTags);
        listTags.setAttribute("id", item)
        //manipulating style of the updated unordered list.
        unorderedList.style.marginTop = "20px"
        unorderedList.style.float = "left";
    });
    //adding event listeners to each of the liTags to fetch data and change a certain part of our page by first clearing that part and then adding what is needed.
    const groceries = document.getElementById("groceries")
    groceries.addEventListener("click", () => {
        fetch("http://localhost:3000/groceries")
            .then(response => response.json())
            .then(
                data => {
                    clearChildren();
                    groceriesClick(data);
                }
            )
            .catch(error => console.log(error))
    })
    toiletries.addEventListener("click", () => {
        fetch("http://localhost:3000/toiletries")
            .then(response => response.json())
            .then(
                data => {
                    clearChildren();
                    groceriesClick(data);
                }
            )
            .catch(error => console.log(error))
    })
    emergencies.addEventListener("click", () => {
        fetch("http://localhost:3000/emergencies")
            .then(response => response.json())
            .then(
                data => {
                    clearChildren();
                    groceriesClick(data);
                }
            )
            .catch(error => console.log(error))
    })
}
//clearing the slideshow division using clearChildren function.
function clearChildren() {
    const slideShow = document.getElementById("slideshow");
    // while looping through the children of the slideshow div.
    while (slideShow.firstChild) {
        slideShow.removeChild(slideShow.firstChild)
    }
}
//declaring arrayIndex for later use and also grabing the slideshow div for a wider scope.
let arrayIndex = 0
const slideShow = document.getElementById("slideshow");
//groceriesClick function to change displayed elements.
function groceriesClick(data) {
    slideShow.style.alignContent = "center";
    //creating an image in slideShow with an src of that founc at data[arrayIndex].image
    const imageDisplayed = document.createElement("img");
    imageDisplayed.src = data[arrayIndex].image;
    imageDisplayed.style.width = "560px"
    const paragraph = document.createElement("p");
    //creating a paragraph element and updating its textContent.
    paragraph.setAttribute("id", "description");
    paragraph.textContent = `Get a package of ${data[arrayIndex].amount} ${data[arrayIndex].item} for ${data[arrayIndex].Price}`;
    //creating a button element and updating its textContent, style and id.
    const nextButton = document.createElement("button");
    nextButton.style.marginTop = "7px"
    nextButton.setAttribute("id", "nextbutton");
    nextButton.textContent = "Next";
    // adding an event listener to the next button to change the image and paragrph
    nextButton.addEventListener("click", () => {
        //cycling through the data array and updating the image and paragraph accordingly.
        arrayIndex = (arrayIndex + 1) % data.length;
        imageDisplayed.src = data[arrayIndex].image;
        paragraph.textContent = `Get a package of ${data[arrayIndex].amount} ${data[arrayIndex].item} for ${data[arrayIndex].Price}`;
        bottomButton.textContent = "Add To Cart"
        bottomButton.style.marginLeft = "1100px"
        //appending an input box to the paragraph.
        paragraph.appendChild(inputBox)
    })
    //appending image, paragraph and next button to slideshow
    slideShow.appendChild(imageDisplayed);
    slideShow.appendChild(paragraph)
    slideShow.appendChild(nextButton)
    const bottomButton = document.getElementById("make_order2")
    //input box
    const inputBox = document.createElement("input")
    inputBox.type = "text";
    inputBox.id = "amountOf";
    inputBox.placeholder = "How many packages?"
    paragraph.appendChild(inputBox)
    //adding an event listener to the inputBox of type keydown for the enter button and callback function of foward input.
    inputBox.addEventListener("keydown", () => {
        forwardInput(event, data);
    })
    //updating the textContent of the bottom button and adding an eventListener of type click and callback function od addToCCart.
    bottomButton.textContent = "Add To Cart"
    bottomButton.removeEventListener("click", addToCart);
    bottomButton.onclick=()=> {
         addToCart(data);
    }
}
let cartItems = [];
let cartItemPrices = [];
//creating a checkOut paragraph element to act as a button.
const checkOut = document.createElement("p");
//addToCart function for the above event listener.
function addToCart(data) {
    //the addToCart function  pushes order items and prices to array variables using a function called shopppingCart and logs them to the console. 
    console.log("here");
    shoppingCart(input, data);
    cartItems.push(data[arrayIndex].item);
    cartItemPrices.push(totalPrice);
    console.log(cartItems);
    console.log(cartItemPrices);
    // conditional that adds checkOut if needed.
    if(!checkOut.id){
        checkOut.setAttribute("id", "checkOut");
        checkOut.textContent = "Check Out";
        const bottom = document.getElementById("bottom");
        bottom.appendChild(checkOut);
    } 
    // adding an event listener to the checkOut element.
    checkOut.addEventListener("click", ()=>{
          if(cartItems.length > 0 && cartItemPrices.length > 0){
            tabulateSales();
            console.log(1)
          }
        }
    )
    }
    //tabulatedSaled function which tabulates the items and prices for each order made.
function tabulateSales() {
    //grabbing slideshow and bottom divs and clearing their innerHTML content.
    const bottom = document.getElementById("bottom");
    const slide = document.getElementById("slideshow");
    slide.innerHTML = "";
    bottom.innerHTML = "";
    //creating a table element and updating its id.
    const table = document.createElement("table");
    table.setAttribute("id", "table");
    //creating a table header element and table row.
    const tableHeader = document.createElement("th");
    const tableRow = document.createElement("tr");
    //creating the first row of the table with a title of RECEIPT.
    tableHeader.textContent = "RECEIPT";
    tableRow.appendChild(tableHeader);
    table.appendChild(tableRow);
    //creating other table rows depending on the length of the cartItems array and the cartItemPrices array.
    if(cartItems.length > 0 && cartItemPrices.length > 0 ){
        for (let i = 0; i < cartItems.length; i++) {
            let currentIndex = (i) % cartItems.length;
            const itemRow = document.createElement("tr");
            const itemNameData = document.createElement("td");
        itemNameData.textContent = cartItems[currentIndex];
        const itemPriceData = document.createElement("td");
        itemPriceData.textContent = cartItemPrices[currentIndex];
        itemRow.appendChild(itemNameData);
        itemRow.appendChild(itemPriceData);
        table.appendChild(itemRow);
        }
    }
    //appending the table to the slidwshow div.
    slide.appendChild(table);
    // appending a completeOrder button to the bottom div.
    const completeOrder = document.createElement("button");
    completeOrder.textContent = "Complete Order";
    completeOrder.setAttribute("id", "completeOrder");
    bottom.appendChild(completeOrder);
    // adding an event listener to the completeOrder button of click type, callback function of payment and an extra conditional that asks if tyhe client wants to proceed.
    completeOrder.addEventListener("click", () => {
        const response = prompt("Do you want to complete this order. Enter 'yes' or 'no'")
        if (response === "yes") {
            payment();
        } else {
            window.location.href = "index.html";
        }
    })
}
// forwardInput function for the inputBox eventListener that forward the entered value.
let input;
function forwardInput(event, data) {
    if (event.key === "Enter") {
        input = parseInt(event.target.value);
        if (isNaN(input) || input <= 0) {
            input = 1
        }
        console.log(input);
        shoppingCart(input, data);
        event.target.value = "";
    } else {
        console.error("error occurred")
    }
}
//shoppingCart function for the addToCart function that determines the total price of the item logged depending on the value given.
let totalPrice;
function shoppingCart(input, data) {
    if (!isNaN(input) && !isNaN(data[arrayIndex].Price)) {
        totalPrice = parseFloat(input * data[arrayIndex].Price);
    } else {
        alert("Input the amount of packages and press ENTER")
        console.error("Invalid input or price");
        totalPrice = 0;
    }
}
//grabbing the home navigation element and adding an event listener to it.
const homeElement = document.getElementById("home");
homeElement.addEventListener("click", () => {
    window.location.href = "index.html";
})
// coming up with the payment function to complete the order.
let sum = 0;
function payment(){
    // grabbing the slideshow element and clearing its contents.
    const slide = document.getElementById("slideshow");
    slide.innerHTML = "";
    // adding a message to the slideshow div.
    let itemName = "Total Amount: " ;
    // summing up values in the cartItemPrices array.
    for(let i = 0; i < cartItemPrices.length; ++i){
        sum += parseFloat(cartItemPrices[i]);
    }
    // creating a paragraph element and updating its textcontent then adding it to the slideshow div.
   let itemPrice = sum;
    const paymentParagraph = document.createElement("p");
    paymentParagraph.textContent = `${itemName}${itemPrice}`;
    slide.appendChild(paymentParagraph);
    // adding a pay button to the bottom div.
    const payButton = document.getElementById("completeOrder");
    payButton.textContent = "pay";
    //adding an event listener to the pay button of click that updates the paragraph at mainchanges and calles the timer function.
    payButton.addEventListener("click", () => {
       if (totalPrice>0){
        const displayDone = document.getElementById("mainchanges");
        displayDone.innerHTML = "";
        const displayParagraph = document.createElement("p");
        displayParagraph.textContent = "Thank you for shopping with us. Your order will be delivered in 30 mins";
        displayDone.appendChild(displayParagraph);
            timer();
        }
        })
        }
        //timer function to update the countdown timer.
function timer(){
    const slideContainer = document.getElementById("mainchanges");
    const countdown = document.createElement("p");
    countdown.setAttribute("id", "timer");
    let seconds = 0;
    let minutes = 30;
    //condition to update seconds and minutes.
    const interval = setInterval(() => {
        seconds--;
        if (seconds < 0) {
            seconds = 59;
            minutes--;
        }
        if (minutes === 0 && seconds === 0) {
            clearInterval(interval);
        }
        countdown.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
    slideContainer.appendChild(countdown);
}
//grabbing the cart element and adding an event listener of click to it.
const shoppinCart = document.getElementById("cart");
shoppinCart.addEventListener("click", () => {
    if(totalPrice > 0){
        tabulateSales();
    } else{
        alert("Please add items to your shopping cart")
    }
})

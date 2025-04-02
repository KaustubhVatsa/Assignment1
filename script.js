//container to store all the images once fetched
let images = [];
//to store the big picture index
let currentIdx = 0;

const currImg = document.getElementById("currentImage"); //puts in the entire currentImage element into the currImg
const thumbnailscont = document.querySelector(".thumbnails");
const prev_btn = document.getElementById("prev-button");
const next_btn = document.getElementById("next-button");
const addtoCart = document.getElementById("addToCart");
const addedtocartmsg = document.getElementById("addmsg");
const productName = document.getElementById("Name");
const productprice = document.getElementById("price");
const productImage = document.querySelector(".product-image");
console.log(productImage);
const api_Url = "https://picsum.photos/v2/list?page=1&limit=4";

//fetching image and saving it in Image container
async function fetchandpopulateImages() {
  try {
    const response = await fetch(api_Url);
    const data = await response.json();
    images = data;
    handleTouch();
    thumbnailFill();
  } catch (error) {
    console.log("error in fetching image ", error.message);
  }
}
//sample 0:
// author: "Alejandro Escamilla"
// download_url: "https://picsum.photos/id/0/5000/3333"
// height: 3333
// id: "0"
// url: "https://unsplash.com/photos/yC-Yzbqy7PY"
// width: 5000

function thumbnailFill() {
  //if no images returned
  if (images.length === 0) return;

  //display the first image on the product image
  displayImage(currentIdx);
  thumbnailscont.innerHTML = "";
  images.forEach((img, idx) => {
    const thumbimg = document.createElement("img");
    // console.log(image for index ${idx} is ${img})
    // console.log(img.download_url)
    thumbimg.style.width = "100px";
    thumbimg.style.height = "100px";
    thumbimg.style.borderRadius = "5px";
    thumbimg.style.overflow = "hidden";
    thumbimg.src = img.download_url;
    thumbimg.alt = "Image" + (idx + 1);
    if (idx === currentIdx) {
      thumbimg.classList.add("active");
    }
    thumbimg.addEventListener("click", () => {
      currentIdx = idx;
      displayImage(currentIdx);
    });
    thumbnailscont.appendChild(thumbimg);
  });
}

function displayImage(idx) {
  currImg.src = images[idx].download_url;
  currImg.alt = `Image ${idx + 1}`;
  thumbnailActive();
}

function thumbnailActive() {
  const thumbnails = thumbnailscont.querySelectorAll("img");
  thumbnails.forEach((obj, idx) => {
    obj.classList.remove("active");
    if (idx === currentIdx) {
      obj.classList.add("active");
    }
  });
}

prev_btn.addEventListener("click", () => {
  currentIdx = (currentIdx - 1 + images.length) % images.length;
  displayImage(currentIdx);
});
next_btn.addEventListener("click", () => {
  currentIdx = (currentIdx + 1) % images.length;
  displayImage(currentIdx);
});

//add to cart function
const cart = [];
addtoCart.addEventListener("click", () => {
  const selectedSize = document.getElementById("size").value;
  const quantity = parseInt(document.getElementById("quantity").value);
  const obj = {
    name: productName.innerHTML,
    price: productprice.innerHTML,
    size: selectedSize,
    quantity: quantity,
  };
  cart.push(obj);
  addedtocartmsg.style.display = "block";
  addedtocartmsg.innerHTML = "Successfully added to cart!";
  setTimeout(() => {
    addedtocartmsg.style.display = "none";
  }, 2000);
});

//handling touch for chanding main image on swipe
function handleTouch() {
  productImage.addEventListener("touchstart", (e) => {
    start_xco_ordinate = e.changedTouches[0].screenX;
    console.log("start x co-ordinate is ", e.changedTouches);
  });
  productImage.addEventListener("touchend", (e) => {
    end_xco_ordinate = e.changedTouches[0].screenX;
    console.log("end x co-ordinate is ", end_xco_ordinate);
    if (Math.abs(start_xco_ordinate - end_xco_ordinate) > 30) {
      if (start_xco_ordinate > end_xco_ordinate) {
        currentIdx = (currentIdx + 1) % images.length;
        displayImage(currentIdx);
      } else {
        currentIdx = (currentIdx - 1 + images.length) % images.length;
        displayImage(currentIdx);
      }
    }
  });
}
fetchandpopulateImages();

// Dark-Mode

const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode") === true) {
    themeToggle.textContent = "☀️";
  } else {
    themeToggle.textContent = "🌙";
  }

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark-mode") ? "dark" : "light",
  );
});

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
}

if (document.body.classList.contains("dark-mode") === true) {
  themeToggle.textContent = "☀️";
} else {
  themeToggle.textContent = "🌙";
}

// Added Products To Cart

const cartCount = document.getElementById("cart-count");
const cartNumber = document.getElementById("cart-number");
const addToCartButtons = document.querySelectorAll(".product-card button");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let totalItems = 0;
cart.forEach(function (item) {
  totalItems += item.quantity;
});
cartNumber.textContent = totalItems;

addToCartButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const productName = button.parentElement.dataset.name;
    const productPrice = button.parentElement.dataset.price;

    const product = {
      name: productName,
      price: Number(productPrice),
      quantity: 1,
    };

    let existingProduct = cart.find((item) => item.name === productName);

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    totalItems = 0;
    cart.forEach(function (item) {
      totalItems += item.quantity;
    });
    cartNumber.textContent = totalItems;
  });
});

const cartContainer = document.getElementById("cart-items");
const totalItemsElement = document.getElementById("total-items");
const totalPriceElement = document.getElementById("total-price");

if (cartContainer) {
  let totalItems = 0;
  let totalPrice = 0;

  if (cart.length === 0) {
    cartContainer.textContent = "Your cart is empty!";
  } else {
    cart.forEach(function (item) {
      totalItems += item.quantity;
      totalPrice += item.price * item.quantity;

      const cartItem = document.createElement("div");
      const productInfo = document.createElement("div");
      const cartActions = document.createElement("div");

      cartItem.classList.add("cart-item");
      productInfo.classList.add("product-info");
      cartActions.classList.add("cart-actions");

      const removeButton = document.createElement("button");
      const increaseButton = document.createElement("button");
      const decreaseButton = document.createElement("button");

      increaseButton.textContent = "+";
      decreaseButton.textContent = "-";
      removeButton.textContent = "Remove";

      increaseButton.classList.add("increase-btn");
      decreaseButton.classList.add("decrease-btn");
      removeButton.classList.add("remove-btn");

      productInfo.textContent =
        item.name +
        " " +
        "Price: " +
        item.price +
        " " +
        "- " +
        "Quantity: " +
        item.quantity;

      cartActions.appendChild(removeButton);
      cartActions.appendChild(increaseButton);
      cartActions.appendChild(decreaseButton);

      cartItem.appendChild(productInfo);
      cartItem.appendChild(cartActions);

      increaseButton.addEventListener("click", function () {
        item.quantity++;
        localStorage.setItem("cart", JSON.stringify(cart));
        window.location.reload();
      });

      decreaseButton.addEventListener("click", function () {
        item.quantity--;

        const itemIndex = cart.findIndex(
          (product) => item.name === product.name,
        );

        if (item.quantity === 0) {
          cart.splice(itemIndex, 1);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        window.location.reload();
      });

      removeButton.addEventListener("click", function () {
        const itemIndex = cart.findIndex(
          (product) => item.name === product.name,
        );
        cart.splice(itemIndex, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        totalItems = 0;
        window.location.reload();
      });

      cartContainer.appendChild(cartItem);
    });
  }

  totalItemsElement.textContent = totalItems;
  totalPriceElement.textContent = "$ " + totalPrice;
}

const checkoutContainer = document.querySelector(".checkout-items");
const checkoutTotalItems = document.getElementById("checkout-total-items");
const checkoutTotalPrice = document.getElementById("checkout-total-price");
let checkoutPrice = 0;

if (checkoutContainer) {
  let checkoutItemsCount = 0;

  if (cart.length === 0) {
    checkoutContainer.textContent = "Your cart is empty!";
  } else {
    cart.forEach(function (item) {
      checkoutItemsCount += item.quantity;
      checkoutPrice += item.price * item.quantity;

      const checkoutItem = document.createElement("div");
      checkoutItem.classList.add("checkout-item");

      checkoutItem.textContent =
        item.name +
        " - " +
        "$" +
        item.price +
        " - " +
        "Quantity:" +
        " " +
        item.quantity;
      checkoutContainer.appendChild(checkoutItem);
    });
    checkoutTotalItems.textContent = "Total Items: " + checkoutItemsCount;
    checkoutTotalPrice.textContent = "Total Price: $ " + checkoutPrice;
  }
}

const checkoutForm = document.getElementById("checkout-form");

if (checkoutForm) {
  checkoutForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const customerName = document.getElementById("full-name").value;
    const customerEmail = document.getElementById("email").value;
    const customerPhone = document.getElementById("phone").value;
    const customerAddress = document.getElementById("address").value;
    const customerPayment = document.querySelector(
      "input[name=payment]:checked",
    ).value;

    const orderData = {
      customerName: customerName,
      customerEmail: customerEmail,
      customerPhone: customerPhone,
      customerAddress: customerAddress,
      customerPayment: customerPayment,
      cartItems: cart,
      totalPrice: checkoutPrice,
      orderId: Date.now(),
    };
    localStorage.setItem("orderData", JSON.stringify(orderData));
    window.location.href = "order-confirmation.html";
  });
}

if (document.getElementById("order-id")) {
  const savedOrder = JSON.parse(localStorage.getItem("orderData"));
  const orderIdElement = document.getElementById("order-id");
  orderIdElement.textContent = "Order ID: " + savedOrder.orderId;
}

const checkoutBtn = document.getElementById("checkout-btn");
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", function () {
    window.location.href = "checkout.html";
  });
}

// Searching Input

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const productCards = document.querySelectorAll(".product-card");

if (searchBtn && searchInput) {
  searchBtn.addEventListener("click", function () {
    searchTerm = searchInput.value.trim().toLowerCase();
    applyFilters();
  });
}

// Fillter By Category

let selectedCategory = "all";
let searchTerm = "";
const categoryItems = document.querySelectorAll(
  ".category-btn, li[data-category]",
);
categoryItems.forEach(function (item) {
  item.addEventListener("click", function () {
    selectedCategory = item.dataset.category;

    console.log(selectedCategory);
    applyFilters();
  });
});

// All Filters

const minPrice = document.getElementById("min-price");
const maxPrice = document.getElementById("max-price");

function applyFilters() {
  const productCards = document.querySelectorAll(".product-card");

  let minValue = 0;
  let maxValue = Infinity;

  if (minPrice) {
    minValue = Number(minPrice.value);
  }

  if (maxPrice && maxPrice.value !== "") {
    maxValue = Number(maxPrice.value);
  }

  productCards.forEach(function (card) {
    const productCategory = card.dataset.category;
    const productName = card.dataset.name.toLowerCase();
    const productPrice = Number(card.dataset.price);
    const priceMatch = productPrice >= minValue && productPrice <= maxValue;
    const searchMatch = productName.includes(searchTerm) || searchTerm === "";

    const categoryMatch =
      selectedCategory === productCategory || selectedCategory === "all";
    if (categoryMatch === true && searchMatch === true && priceMatch === true) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

if (minPrice) {
  minPrice.addEventListener("input", function () {
    applyFilters();
  });
}

if (maxPrice) {
  maxPrice.addEventListener("input", function () {
    applyFilters();
  });
}

// Clear Filters

const clearFiltersBtn = document.getElementById("clear-filters");

if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener("click", function () {
    searchTerm = "";
    selectedCategory = "all";
    searchInput.value = "";
    minPrice.value = "";
    maxPrice.value = "";
    applyFilters();
  });
}
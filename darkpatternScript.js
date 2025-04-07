import { products } from "./products.js";

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("purchase-modal");

  // Open modal
  document.querySelectorAll(".buy-button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      modal.setAttribute("aria-hidden", "false");
      feedback.style.display = "none";
      clearErrors();
    });
  });

  // Close modal (X or click outside)
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Form validation + feedback
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const fullName = form.fullName;
    const email = form.email;
    const address = form.address;
    const payment = form.payment;
    const acceptTerms = form["accept-terms"]; // Select the terms checkbox

    let isValid = true;

    if (fullName.value.trim().length < 2) {
      document.getElementById("error-fullName").textContent = "Full name must be at least 2 characters.";
      fullName.classList.add("error");
      isValid = false;
    }

    if (!email.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      document.getElementById("error-email").textContent = "Please enter a valid email.";
      email.classList.add("error");
      isValid = false;
    }

    if (address.value.trim().length < 5) {
      document.getElementById("error-address").textContent = "Address must be at least 5 characters.";
      address.classList.add("error");
      isValid = false;
    }

    if (!payment.value) {
      document.getElementById("error-payment").textContent = "Please select a payment method.";
      payment.classList.add("error");
      isValid = false;
    }

    // Add validation for terms checkbox
    if (!acceptTerms.checked) {
      document.getElementById("error-terms").textContent = "You must accept the terms and conditions.";
      acceptTerms.classList.add("error");
      isValid = false;
    }

    if (!isValid) return;

    feedback.style.display = "block";
    form.reset();

    setTimeout(() => {
      modal.setAttribute("aria-hidden", "true");
      form.reset();
      feedback.style.display = "none";
      clearErrors();
    }, 3000);
  });

  // Attach live validation listeners
  form.fullName.addEventListener("input", () => {
    validateField(form.fullName, "error-fullName", (val) => val.trim().length >= 2, "Full name must be at least 2 characters.");
  });

  form.email.addEventListener("input", () => {
    validateField(form.email, "error-email", (val) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val), "Please enter a valid email.");
  });

  form.address.addEventListener("input", () => {
    validateField(form.address, "error-address", (val) => val.trim().length >= 5, "Address must be at least 5 characters.");
  });

  form.payment.addEventListener("change", () => {
    validateField(form.payment, "error-payment", (val) => val !== "", "Please select a payment method.");
  });

  // Real-time validation for terms checkbox
  form["accept-terms"].addEventListener("change", () => {
    const errorEl = document.getElementById("error-terms");
    if (!form["accept-terms"].checked) {
      errorEl.textContent = "You must accept the terms and conditions.";
      form["accept-terms"].classList.add("error");
    } else {
      errorEl.textContent = "";
      form["accept-terms"].classList.remove("error");
    }
  });


  // Toggle the 'More Info' section
  document.getElementById('toggle-info').addEventListener('click', function () {
    var infoContent = document.getElementById('info-content');
    var isVisible = infoContent.style.display === 'block';

    if (isVisible) {
      infoContent.style.display = 'none';
    } else {
      infoContent.style.display = 'block';
    }
  });

  document.getElementById('toggle-cookies-info').addEventListener('click', function () {
    var infoContent = document.getElementById('info-cookies-content');
    var isVisible = infoContent.style.display === 'block';

    if (isVisible) {
      infoContent.style.display = 'none';
    } else {
      infoContent.style.display = 'block';
    }
  });

  cacheProducts();
  loadProducts();
  lazyLoadImages();
});

const modal = document.getElementById("purchase-modal");
const closeBtn = modal.querySelector(".close-button");
const form = document.getElementById("purchase-form");
const feedback = document.getElementById("form-feedback");
const productGrid = document.getElementById("grid");
const confirmationPopup = document.getElementById("confirmation-popup");
const cancelButton = document.getElementById("cancel-btn");
const proceedButton = document.getElementById("proceed-btn");
const necessaryCookiesButton = document.getElementById("necessary-btn");
const allCookiesButton = document.getElementById("allCookies-btn");
const welcomeModal = document.getElementById("welcome-modal");

const productArray = products.map(product => ({
  ...product,
  price: Math.floor(Math.random() * 20) + 5, // random price between $5–$25
}));;

// Function to load products dynamically
function loadProducts() {
  productArray.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const requestButton = document.createElement("button");
    requestButton.classList.add("request-button");
    requestButton.textContent = "Show Image";
    requestButton.addEventListener("click", () => fetchRandomImage(img, product.id));

    const img = document.createElement("img");
    img.dataset.src = product.image; // Lazy load
    img.alt = `${product.title} - ${product.co2} impact`; // Improved accessibility
    img.classList.add("lazy-load");
    img.setAttribute("loading", "lazy"); // Native lazy loading
    img.setAttribute("width", "300"); // Set explicit width
    img.setAttribute("height", "300"); // Avoid layout shift

    const co2Tag = document.createElement("div");
    co2Tag.classList.add("co2-tag");
    co2Tag.textContent = product.co2;

    const waterTag = document.createElement("div");
    waterTag.classList.add("water-tag");
    waterTag.textContent = product.water;

    const tagsContainer = document.createElement("div");
    tagsContainer.classList.add("tags-container");
    tagsContainer.appendChild(co2Tag);
    tagsContainer.appendChild(waterTag);

    const title = document.createElement("p");
    title.textContent = product.title;

    const desc = document.createElement("p");
    desc.textContent = product.description;

    const buyButton = document.createElement("button");
    buyButton.classList.add("buy-button");
    buyButton.textContent = `Buy ${product.price}$`;


    // Pass the product details to the modal on button click
    buyButton.addEventListener("click", () => {
      const modalPrice = document.getElementById("modal-price");
      modalPrice.textContent = `${product.price}$`;

      const finalPrice = document.getElementById("summary-total");
      finalPrice.textContent = `${20 + product.price}$`

      modal.setAttribute("aria-hidden", "false");
      feedback.style.display = "none";
      clearErrors();
    });

    card.appendChild(requestButton);
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(tagsContainer);
    card.appendChild(desc);
    card.appendChild(buyButton);
    productGrid.appendChild(card);
  });
}

function fetchRandomImage(imgElement, productId) {
  const storageKey = `product-image-${productId}`;
  const cachedImage = localStorage.getItem(storageKey);

  if (cachedImage) {
    console.log("Image found in cache");

    imgElement.src = cachedImage;
    imgElement.previousElementSibling.style.display = "none"; // Hide the request button if image is cached already
  } else {
    console.log("Fetchin image...");
    const imageUrl = `https://static.vecteezy.com/system/resources/previews/028/244/679/large_2x/white-t-shirt-mockup-male-t-shirt-with-short-sleeves-front-back-view-realistic-3d-mock-up-ai-generated-photo.jpg`;
    imgElement.src = imageUrl;

    // Store the fetched image in localStorage after it loads
    imgElement.onload = () => {
      localStorage.setItem(storageKey, imgElement.src);
      imgElement.previousElementSibling.style.display = "none"; // Hide the request button after image is loaded
    };
  }
}

// Caching logic
function cacheProducts() {
  if (!localStorage.getItem("products")) {
    localStorage.setItem("products", JSON.stringify(products));
  }
}

// Lazy loading images
function lazyLoadImages() {
  const lazyImages = document.querySelectorAll(".lazy-load");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        observer.unobserve(img);
      }
    });
  });

  lazyImages.forEach((img) => observer.observe(img));
}


const clearErrors = () => {
  document.querySelectorAll(".error-message").forEach((span) => (span.textContent = ""));
  form.querySelectorAll("input, select").forEach((field) => field.classList.remove("error"));
};

const closeModal = () => {
  showConfirmationPopup();
};

// Function to show the confirmation popup
const showConfirmationPopup = () => {
  confirmationPopup.setAttribute("aria-hidden", "false");
};

// Cancel button behavior: Close the confirmation popup without closing the modal
cancelButton.addEventListener("click", () => {
  confirmationPopup.setAttribute("aria-hidden", "true");
});

// Proceed button behavior: Close the modal without saving
proceedButton.addEventListener("click", () => {
  confirmationPopup.setAttribute("aria-hidden", "true");
  modal.setAttribute("aria-hidden", "true"); // Close the original modal
  form.reset(); // Reset the form
  feedback.style.display = "none"; // Hide feedback
  clearErrors(); // Clear any errors
});

allCookiesButton.addEventListener('click', () => {
  welcomeModal.setAttribute("aria-hidden", "true");
  
})

necessaryCookiesButton.addEventListener('click', () => {
  welcomeModal.setAttribute("aria-hidden", "true");
  
})


// Real-time validation function
function validateField(field, errorId, conditionFn, errorMsg) {
  const errorEl = document.getElementById(errorId);
  if (!conditionFn(field.value)) {
    errorEl.textContent = errorMsg;
    field.classList.add("error");
  } else {
    errorEl.textContent = "";
    field.classList.remove("error");
  }
}

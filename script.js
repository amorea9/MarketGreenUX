import { products } from "./products.js";

document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.getElementById("grid");

  // Function to load products dynamically
  function loadProducts() {
    products.forEach((product) => {
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
      buyButton.textContent = `Buy For ${product.category}`;

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

  cacheProducts();
  loadProducts();
  lazyLoadImages();
});

//modal stuff
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("purchase-modal");
  const closeBtn = modal.querySelector(".close-button");
  const form = document.getElementById("purchase-form");
  const feedback = document.getElementById("form-feedback");

  const clearErrors = () => {
    document.querySelectorAll(".error-message").forEach((span) => (span.textContent = ""));
    form.querySelectorAll("input, select").forEach((field) => field.classList.remove("error"));
  };

  const closeModal = () => {
    modal.setAttribute("aria-hidden", "true");
    form.reset();
    feedback.style.display = "none";
    clearErrors();
  };

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

    if (!isValid) return;

    feedback.style.display = "block";
    form.reset();

    setTimeout(() => {
      closeModal();
    }, 3000);
  });
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
});

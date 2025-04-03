document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.getElementById("grid");
  const teeSvgPath = "./assets/Tee.svg";

  // Array of product objects
  const products = [
    {
      id: 1,
      title: "Organic Cotton T-shirt",
      description: "Eco-friendly t-shirt made from 100% organic cotton.",
      co2: "2.5kg CO2",
      image: teeSvgPath,
    },
    {
      id: 2,
      title: "Recycled Polyester Hoodie",
      description: "Hoodie made from 80% recycled polyester.",
      co2: "3.2kg CO2",
      image: teeSvgPath,
    },
    {
      id: 3,
      title: "Bamboo Socks",
      description: "Soft and sustainable bamboo fiber socks.",
      co2: "1.1kg CO2",
      image: teeSvgPath,
    },
    {
      id: 4,
      title: "Eco-Friendly Sneakers",
      description: "Sneakers made with recycled ocean plastic.",
      co2: "4.5kg CO2",
      image: teeSvgPath,
    },
    {
      id: 5,
      title: "Vegan Leather Wallet",
      description: "Wallet crafted from plant-based materials.",
      co2: "1.8kg CO2",
      image: teeSvgPath,
    },
    {
      id: 6,
      title: "Solar-Powered Backpack",
      description: "Backpack with integrated solar panel for charging.",
      co2: "5.3kg CO2",
      image: teeSvgPath,
    },
    {
      id: 7,
      title: "Recycled Denim Jacket",
      description: "Stylish jacket made from recycled denim.",
      co2: "3.9kg CO2",
      image: teeSvgPath,
    },
    {
      id: 8,
      title: "Organic Cotton Scarf",
      description: "Soft scarf made from 100% organic cotton.",
      co2: "2.2kg CO2",
      image: teeSvgPath,
    },
    {
      id: 9,
      title: "Hemp Tote Bag",
      description: "Durable and eco-friendly hemp tote bag.",
      co2: "1.5kg CO2",
      image: teeSvgPath,
    },
    {
      id: 10,
      title: "Sustainable Sunglasses",
      description: "Sunglasses made from biodegradable materials.",
      co2: "1.2kg CO2",
      image: teeSvgPath,
    },
  ];

  // Function to load products dynamically
  function loadProducts() {
    products.forEach((product) => {
      const card = document.createElement("div");
      card.classList.add("card");
      const requestButton = document.createElement("button");
      requestButton.classList.add("request-button");
      requestButton.textContent = "Request Image";
      requestButton.addEventListener("click", () => fetchRandomImage(img, product.id));

      const img = document.createElement("img");
      img.dataset.src = product.image; // Lazy load
      img.alt = `${product.title} - ${product.co2} impact`; // Improved accessibility
      img.classList.add("lazy-load");
      img.setAttribute("loading", "lazy"); // Native lazy loading
      img.setAttribute("width", "300"); // Set explicit width
      img.setAttribute("height", "300"); // Avoid layout shift

      const tag = document.createElement("div");
      tag.classList.add("tag");
      tag.textContent = product.co2;

      const title = document.createElement("p");
      title.textContent = product.title;

      const desc = document.createElement("p");
      desc.textContent = product.description;

      const buyButton = document.createElement("button");
      buyButton.classList.add("buy-button");
      buyButton.textContent = "Buy Now";

      card.appendChild(requestButton);
      card.appendChild(img);
      card.appendChild(tag);
      card.appendChild(title);
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

document.addEventListener("DOMContentLoaded", () => {
    const productGrid = document.getElementById("grid");
  
    // Array of product objects
    const products = [
      {
        id: 1,
        title: "Organic Cotton T-shirt",
        description: "Eco-friendly t-shirt made from 100% organic cotton.",
        co2: "2.5kg CO2",
        image: "placeholder.png"
      },
      {
        id: 2,
        title: "Recycled Polyester Hoodie",
        description: "Hoodie made from 80% recycled polyester.",
        co2: "3.2kg CO2",
        image: "placeholder.png"
      },
      {
        id: 3,
        title: "Bamboo Socks",
        description: "Soft and sustainable bamboo fiber socks.",
        co2: "1.1kg CO2",
        image: "placeholder.png"
      }
    ];
  
    // Function to load products dynamically
    function loadProducts() {
      products.forEach((product) => {
        const card = document.createElement("div");
        card.classList.add("card");
  
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
  
        const button = document.createElement("button");
        button.classList.add("buy-button");
        button.textContent = "Buy Now";
  
        card.appendChild(img);
        card.appendChild(tag);
        card.appendChild(title);
        card.appendChild(desc);
        card.appendChild(button);
        productGrid.appendChild(card);
      });
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
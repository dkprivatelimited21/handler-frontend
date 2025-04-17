// navigation Data
export const navItems = [
  { title: "Home", url: "/" },
  { title: "Best Selling", url: "/best-selling" },
  { title: "Products", url: "/products" },
  { title: "Events", url: "/events" },
  { title: "FAQ", url: "/faq" },
];

// branding data
export const brandingData = [
  {
    id: 1,
    title: "Shipping details",
    Description: "Shipped personally by sellers",
    icon: "svg-1",
  },
  {
    id: 2,
    title: "Daily Surprise Offers",
    Description: "Save up to 25% off",
    icon: "svg-2",
  },
  {
    id: 3,
    title: "Affordable Prices",
    Description: "Get Factory direct price",
    icon: "svg-3",
  },
  {
    id: 4,
    title: "Secure Payments",
    Description: "100% protected payments",
    icon: "svg-4",
  },
];

// updated categories
export const categoriesData = [
  { id: 1, title: "Shirts - Men", image_Url: "https://example.com/shirts-men.jpg" },
  { id: 2, title: "Shirts - Women", image_Url: "https://example.com/shirts-women.jpg" },
  { id: 3, title: "Pants - Men", image_Url: "https://example.com/pants-men.jpg" },
  { id: 4, title: "Pants - Women", image_Url: "https://example.com/pants-women.jpg" },
  { id: 5, title: "Shoes - Men", image_Url: "https://example.com/shoes-men.jpg" },
  { id: 6, title: "Shoes - Women", image_Url: "https://example.com/shoes-women.jpg" },
  { id: 7, title: "Sarees", image_Url: "https://example.com/sarees.jpg" },
  { id: 8, title: "Accessories - Men", image_Url: "https://example.com/accessories-men.jpg" },
  { id: 9, title: "Accessories - Women", image_Url: "https://example.com/accessories-women.jpg" },
  { id: 10, title: "Gifts", image_Url: "https://example.com/gifts.jpg" },
];

// cleaned product data (can be updated similarly to match new categories)
export const productData = [
  {
    id: 1,
    category: "Shirts - Men",
    name: "Men's Casual Shirt - Cotton",
    description: "Comfortable everyday shirt for men.",
    image_Url: [
      { public_id: "1a", url: "https://example.com/products/mens-shirt.jpg" }
    ],
    shop: {
      name: "Urban Fashion",
      shop_avatar: {
        public_id: "shop1",
        url: "https://example.com/shop1.jpg",
      },
      ratings: 4.5,
    },
    price: 40,
    discount_price: 35,
    rating: 4.5,
    total_sell: 120,
    stock: 25,
  },
  {
    id: 2,
    category: "Sarees",
    name: "Traditional Silk Saree",
    description: "Elegant saree perfect for festive occasions.",
    image_Url: [
      { public_id: "2a", url: "https://example.com/products/saree.jpg" }
    ],
    shop: {
      name: "Ethnic Wear",
      shop_avatar: {
        public_id: "shop2",
        url: "https://example.com/shop2.jpg",
      },
      ratings: 4.6,
    },
    price: 80,
    discount_price: 69,
    rating: 4.6,
    total_sell: 98,
    stock: 15,
  },
];

export const footerProductLinks = [
  { name: "About us", link: "/about" },
  { name: "Careers", link: "/careers" },
  { name: "Store Locations", link: "/stores" },
  { name: "Our Blog", link: "/blog" },
  { name: "Reviews", link: "/reviews" },
];

export const footercompanyLinks = [
  { name: "Shirts" },
  { name: "Shoes" },
  { name: "Accessories" },
  { name: "Sarees" },
  { name: "Events" },
];

export const footerSupportLinks = [
  { name: "FAQ" },
  { name: "Reviews" },
  { name: "Contact Us" },
  { name: "Shipping" },
  { name: "Live chat" },
];

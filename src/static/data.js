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
    icon: (
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
         />),
  },
  {
    id: 2,
    title: "Daily Surprise Offers",
    Description: "Save up to 25% off",
    icon: (
        <svg
          width="32"
          height="34"
          viewBox="0 0 32 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
         />),
  },
  {
    id: 3,
    title: "Affordable Prices",
    Description: "Get Factory direct price",
    icon:  (
        <svg
          width="32"
          height="35"
          viewBox="0 0 32 35"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        /> ),
  },
  {
    id: 4,
    title: "Secure Payments",
    Description: "100% protected payments",
    icon:  (
        <svg
          width="32"
          height="38"
          viewBox="0 0 32 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
         />),
  },
];

// updated categories
export const categoriesData = [
  { id: 1, title: "Shirts - Men", image_Url: "https://img.freepik.com/free-photo/shirt_1203-8194.jpg?ga=GA1.1.197922806.1740460915&semt=ais_hybrid&w=740" },
  { id: 2, title: "Shirts - Women", image_Url: "https://img.freepik.com/free-photo/woman-holding-shirts-choosing-what-outfit-wear_176420-16662.jpg?ga=GA1.1.197922806.1740460915&semt=ais_hybrid&w=740" },
  { id: 3, title: "Pants - Men", image_Url: "https://img.freepik.com/free-photo/low-section-man-using-smartphone_23-2147845781.jpg?ga=GA1.1.197922806.1740460915&semt=ais_hybrid&w=740" },
  { id: 4, title: "Pants - Women", image_Url: "https://img.freepik.com/free-photo/view-beige-tone-colored-pants_23-2150773371.jpg?ga=GA1.1.197922806.1740460915&semt=ais_hybrid&w=740" },
  { id: 5, title: "Shoes - Men", image_Url: "https://img.freepik.com/free-photo/fashion-shoes-sneakers_1203-7529.jpg?ga=GA1.1.197922806.1740460915&semt=ais_hybrid&w=740"},
  { id: 6, title: "Shoes - Women", image_Url: "https://img.freepik.com/free-photo/high-heels-black-velvet_53876-102771.jpg?t=st=1744915529~exp=1744919129~hmac=76d6c1e419ab72bf9002a01757eed80250223e5465cb64d6742ede015a80dca4&w=740" },
  { id: 7, title: "Sarees", image_Url: "https://img.freepik.com/free-photo/young-indian-woman-wearing-sari_23-2149400867.jpg?ga=GA1.1.197922806.1740460915&semt=ais_hybrid&w=740" },
  { id: 8, title: "Accessories - Men", image_Url: "https://img.freepik.com/free-photo/rehearsal-preparation-groom-s-watch-hand_8353-5810.jpg?ga=GA1.1.197922806.1740460915&semt=ais_hybrid&w=740" },
  { id: 9, title: "Accessories - Women", image_Url: "https://img.freepik.com/free-photo/woman-showing-her-nail-art-fingernails-with-watch_23-2149820445.jpg?ga=GA1.1.197922806.1740460915&semt=ais_hybrid&w=740" },
  { id: 10, title: "Gifts", image_Url: "https://img.freepik.com/free-photo/composition-different-traveling-elements_23-2148884935.jpg?ga=GA1.1.197922806.1740460915&semt=ais_hybrid&w=740" },
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

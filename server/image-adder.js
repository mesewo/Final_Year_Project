const axios = require("axios");

const images = [
  "https://t4.ftcdn.net/jpg/01/91/75/83/240_F_191758342_WvRI0qjXW0OCs9q15hkkLNFEj6jjm919.jpg",
];

images.forEach(async (img) => {
  await axios.post("http://localhost:5000/api/common/feature/add", { image: img });
  console.log(`Added: ${img}`);
});

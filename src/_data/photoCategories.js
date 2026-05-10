const fs = require('fs');
const path = require('path');

module.exports = () => {
  const filePath = path.join(__dirname, '../../assets/data/photo-categories.json');
  const fileText = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(fileText);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((category) => category && category.slug && category.title);
};

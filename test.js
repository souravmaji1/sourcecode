const https = require('https');

// Replace these with your actual API key and Search Engine ID
const API_KEY = 'AIzaSyCloLTxoIFVUjX51SDW8i8z5MazP8IUCQI';
const SEARCH_ENGINE_ID = 'b5e13a12243ba4550';

// google map api = AIzaSyDouThG6E25LaMNsjVJ_cYVpfh3KHQJ_jM

const query = 'real estate properties in new york with images link, property details';
const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`;

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const results = JSON.parse(data);
    if (results.items && results.items.length > 0) {
      console.log('Real Estate Agents in New York:');
      results.items.forEach((item, index) => {
        console.log(`${index + 1}. ${item.title}`);
        console.log(`   ${item.snippet}`);
        console.log(`   ${item.link}\n`);
      });
    } else {
      console.log('No results found.');
    }
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
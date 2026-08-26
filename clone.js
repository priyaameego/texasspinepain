const scrape = require('website-scraper').default;

const options = {
  urls: ['https://texasspinepain.com/'],
  directory: './texasspinepain-clone',
  recursive: true,
  maxRecursiveDepth: 3, 
  filenameGenerator: 'bySiteStructure',
  urlFilter: function(url) {
    return url.indexOf('https://texasspinepain.com') === 0 && !url.includes('wp-json');
  }
};

scrape(options).then((result) => {
    console.log("Website successfully downloaded");
}).catch((err) => {
    console.error("An error occurred", err);
});

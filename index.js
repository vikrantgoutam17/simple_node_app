const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require(`${__dirname}/modules/repalceTemplates`);
// synchronus way

/*
const textIn = fs.readFileSync('./txt/input.txt','utf-8');
const textOut = `hey there this is vikrant ${textIn}`;
fs.writeFileSync('./txt/output.txt',textOut);

console.log(textIn);*/

//asyncronous way
/*fs.readFile('./txt/start.txt', 'utf-8', (error, data) => {
    console.log(data);
    fs.readFile(`./txt/${data}.txt`, 'utf-8', (error, data2) => {
        console.log(data2);
        fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
            fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, (err) => {

            });
        });
    });
});*/

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

console.log(slugify('Vikrant KUMAR Goutam', { lower: true }));
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  //----overview-page---------------
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const tempFinal = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);
    res.end(tempFinal);
  }
  //----product-page-----------
  else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const product = dataObj[query.id];
    const tempFinal = replaceTemplate(tempProduct, product);
    res.end(tempFinal);
  }
  //--------api----------------
  else if (pathname === '/api') {
    console.log(productData);
    res.end(data);
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
    });
    res.end('<h1>page not found<h1></h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('server started');
});

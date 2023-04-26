const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");

const replaceTemplate = require("./modules/replaceTemplate");

// =======================FILES============================
// =============================================================================================================================================
// Blocking ,Synchronous way

// const txtIn=fs.readFileSync('./txt/input.txt','utf-8');
// console.log(txtIn);
// const txtOut=`eat ${txtIn} a day keeps doctore away. \n Created a new file on ${Date.now()} `;
// fs.writeFileSync('./txt/output.txt',txtOut);
// console.log('file written')

// =============================================================================================================================================
// NonBlocking ,aSynchronous way

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//     if(err) return console.log('error');
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile('./txt/final.txt',`${data2}\n${data3}`,'utf-8',err=>{
//         console.log('file has been written');
//       })
//     });
//   });
// });
// console.log("will read file");

// =============================================================================================================================================

// =======================SERVER============================

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-cards.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

//SLUGIFY = USED FOR N=STRING IN URL TO MAKE THIS READABLE AND LOOK GOOD
const slugs = dataObj.map((e) => {
  return slugify(e.productName, { lower: true });
});
console.log(slugs);

const server = http.createServer((request, response) => {
  const { query, pathname } = url.parse(request.url, true);
  // const pathName = request.url;

  // OVERVIEW
  if (pathname === "/" || pathname === "/overview") {
    response.writeHead(200, { "content-type": "text/html" });
    const cardsHtml = dataObj.map((e) => replaceTemplate(tempCard, e)).join("");
    // console.log(cardsHtml);
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    response.end(output);

    // PRODUCT
  } else if (pathname === "/product") {
    response.writeHead(200, { "content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    response.end(output);

    // API
  } else if (pathname === "/api") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(data);

    // NOT FOUND
  } else {
    response.writeHead(404, {
      "Content-Type": "text/html",
      "my-own-header": "hello-world",
    });
    response.end("<h1>Page Not Found</h1>");
  }
});

server.listen(8000, () => {
  console.log("listning to request on port 8000");
});

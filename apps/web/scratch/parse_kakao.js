const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

const rootPath = '/Users/vietphung/Data/guai-studio-website/kakao_home.html';
const html = fs.readFileSync(rootPath, 'utf8');
const $ = cheerio.load(html);

fs.writeFileSync('head.html', $('head').html());
fs.writeFileSync('header.html', $.html('.main-header'));
fs.writeFileSync('footer.html', $.html('.footer-con'));

let main = '';
if ($('.home-1-section').length) main += $.html('.home-1-section') + '\n';
if ($('#Our-Benefits').length) main += $.html('#Our-Benefits') + '\n';
if ($('#recent-work').length) main += $.html('#recent-work') + '\n';
if ($('.video-section').length) main += $.html('.video-section') + '\n';
fs.writeFileSync('main.html', main);

let scripts = '';
$('body > script').each((i, el) => {
    scripts += $.html(el) + '\n';
});
fs.writeFileSync('scripts.html', scripts);

console.log("Extraction done!");

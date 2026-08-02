const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const srcDir = path.join(__dirname, '..', 'src');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Pick .ts entry over .js if present (lets us convert one file at a time).
function pickEntry(stem) {
    const ts = path.join(srcDir, stem + '.ts');
    const js = path.join(srcDir, stem + '.js');
    if (fs.existsSync(ts)) return ts;
    if (fs.existsSync(js)) return js;
    throw new Error(`No entry found for ${stem} (.ts or .js)`);
}

const TAMPERMONKEY_HEADER = `// ==UserScript==
// @name         Capital One Shopping & Offers - Tracker FAB
// @namespace    http://tampermonkey.net/
// @version      3.5.1
// @description  Tracks hidden trip data and browses every available offer across Capital One Shopping and Offers
// @author       Will Blaschko
// @match        https://capitaloneoffers.com/*
// @match        https://www.capitaloneoffers.com/*
// @match        https://capitaloneshopping.com/*
// @match        https://www.capitaloneshopping.com/*
// @grant        none
// @run-at       document-start
// @updateURL    https://willblaschko.github.io/capital-one-shopping-and-offers-tracker/tampermonkey.user.js
// @downloadURL  https://willblaschko.github.io/capital-one-shopping-and-offers-tracker/tampermonkey.user.js
// ==/UserScript==

`;

async function build() {
    console.log('Building Capital One Shopping Tracker...\n');

    // Build Tampermonkey version
    console.log('1. Building Tampermonkey userscript...');
    const tampermonkeyResult = await esbuild.build({
        entryPoints: [pickEntry('tampermonkey')],
        bundle: true,
        format: 'iife',
        write: false,
        minify: false, // Keep readable for Tampermonkey
        target: 'es2020',
    });

    // Remove the header from bundled code (we'll add our own) and write
    let tampermonkeyCode = tampermonkeyResult.outputFiles[0].text;
    // Remove any duplicate userscript headers that might be in the source
    tampermonkeyCode = tampermonkeyCode.replace(/\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==\s*/g, '');

    fs.writeFileSync(
        path.join(distDir, 'tampermonkey.user.js'),
        TAMPERMONKEY_HEADER + tampermonkeyCode
    );
    console.log('   ✓ dist/tampermonkey.user.js');

    // Build full bookmarklet (loaded externally)
    console.log('2. Building full bookmarklet script...');
    const bookmarkletFullResult = await esbuild.build({
        entryPoints: [pickEntry('bookmarklet-full')],
        bundle: true,
        format: 'iife',
        write: false,
        minify: true,
        target: 'es2020',
    });

    const bookmarkletFullCode = bookmarkletFullResult.outputFiles[0].text;
    fs.writeFileSync(
        path.join(distDir, 'bookmarklet-full.js'),
        bookmarkletFullCode
    );
    console.log('   ✓ dist/bookmarklet-full.js');

    // Build bookmarklet loader (tiny, inlined)
    console.log('3. Building bookmarklet loader...');
    const bookmarkletLoaderResult = await esbuild.build({
        entryPoints: [pickEntry('bookmarklet')],
        bundle: true,
        format: 'iife',
        write: false,
        minify: true,
        target: 'es2020',
    });

    const bookmarkletLoaderCode = bookmarkletLoaderResult.outputFiles[0].text;
    const bookmarkletUrl = 'javascript:' + encodeURIComponent(bookmarkletLoaderCode);

    // Write loader JS for reference
    fs.writeFileSync(
        path.join(distDir, 'bookmarklet-loader.js'),
        bookmarkletLoaderCode
    );
    console.log('   ✓ dist/bookmarklet-loader.js');

    // Write bookmarklet URL
    fs.writeFileSync(
        path.join(distDir, 'bookmarklet.txt'),
        bookmarkletUrl
    );
    console.log('   ✓ dist/bookmarklet.txt');

    // Also build a standalone bookmarklet (no external loading, for offline use)
    console.log('4. Building standalone bookmarklet...');
    const standaloneUrl = 'javascript:' + encodeURIComponent(bookmarkletFullCode);
    fs.writeFileSync(
        path.join(distDir, 'bookmarklet-standalone.txt'),
        standaloneUrl
    );
    console.log('   ✓ dist/bookmarklet-standalone.txt');

    // Write HTML page with easy install
    const htmlPage = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>C1 Shopping Tracker - Bookmarklet Install</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        h1 { color: #1a237e; }
        .bookmarklet {
            display: inline-block;
            background: linear-gradient(135deg, #1a237e, #3949ab);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            margin: 10px 10px 10px 0;
        }
        .bookmarklet:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .bookmarklet.secondary {
            background: linear-gradient(135deg, #455a64, #607d8b);
        }
        .instructions {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .instructions ol { padding-left: 20px; }
        .instructions li { margin: 10px 0; }
        code {
            background: #e0e0e0;
            padding: 2px 6px;
            border-radius: 4px;
        }
        .note {
            font-size: 13px;
            color: #666;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <h1>📋 C1 Shopping Tracker</h1>
    <p>Track your Capital One Shopping & Offers trips with hidden order and cashback data.</p>
    <p style="font-size: 14px; color: #666; margin-top: -10px;">From the makers of <a href="https://useyourcredits.com/" style="color: #3949ab;">UseYourCredits.com</a> — helping you get more from your credit cards.</p>

    <h2>Install Bookmarklet</h2>
    <p>Drag one of these buttons to your bookmarks bar:</p>

    <a class="bookmarklet" href="${bookmarkletUrl}">📋 C1 Tracker</a>
    <p class="note">Recommended - tiny loader that fetches latest version from GitHub CDN</p>

    <a class="bookmarklet secondary" href="${standaloneUrl}">📋 C1 Tracker (Standalone)</a>
    <p class="note">Standalone version - works offline, but won't auto-update (~28KB)</p>

    <div class="instructions">
        <h3>How to Install</h3>
        <ol>
            <li>Make sure your bookmarks bar is visible (Ctrl+Shift+B on Chrome/Edge)</li>
            <li>Drag the blue button above to your bookmarks bar</li>
            <li>Go to <a href="https://capitaloneshopping.com">capitaloneshopping.com</a> or <a href="https://capitaloneoffers.com">capitaloneoffers.com</a></li>
            <li>Click the bookmarklet to view your trips data</li>
        </ol>

        <h3>How to Use</h3>
        <ol>
            <li>Log in to Capital One Shopping or Offers</li>
            <li>Click the bookmarklet</li>
            <li>A panel will appear showing all your shopping trips with:</li>
            <ul>
                <li>Order amounts (usually hidden)</li>
                <li>Cashback amounts</li>
                <li>Real status (Completed vs Canceled)</li>
            </ul>
        </ol>
    </div>

    <h2>Alternative: Tampermonkey</h2>
    <p>For automatic loading on every visit, install the <a href="tampermonkey.user.js">Tampermonkey userscript</a>.</p>
</body>
</html>`;

    fs.writeFileSync(
        path.join(distDir, 'install.html'),
        htmlPage
    );
    console.log('   ✓ dist/install.html');

    // Stats
    console.log('\nBuild complete!');
    console.log(`   Tampermonkey:     ${(tampermonkeyCode.length / 1024).toFixed(1)} KB`);
    console.log(`   Bookmarklet Full: ${(bookmarkletFullCode.length / 1024).toFixed(1)} KB`);
    console.log(`   Bookmarklet Loader: ${bookmarkletLoaderCode.length} bytes`);
    console.log(`   Loader URL:       ${bookmarkletUrl.length} chars`);
    console.log(`   Standalone URL:   ${(standaloneUrl.length / 1024).toFixed(1)} KB`);

    if (bookmarkletUrl.length > 2000) {
        console.log('\n⚠️  Warning: Loader bookmarklet URL is over 2KB.');
    }
    if (standaloneUrl.length > 2000) {
        console.log('⚠️  Standalone bookmarklet is large - use the loader version for best compatibility.');
    }
}

build().catch((err) => {
    console.error('Build failed:', err);
    process.exit(1);
});

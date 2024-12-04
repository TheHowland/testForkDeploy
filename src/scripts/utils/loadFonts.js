/*
This file is used to load the MathJax fonts into the document.
With this, when the font is used in the document, it will be already loaded.
*/

const fontFile = new FontFace(
    "MathJax_Zero",
    "url(./src/scripts/extern/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Zero.woff) format('woff')",
    { weight: "normal", style: "normal", display: "swap" }
);
const fontFile2 = new FontFace(
    "MathJax_Main",
    "url(./src/scripts/extern/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Main-Regular.woff) format('woff')",
    { weight: "normal", style: "normal", display: "swap" });
const fontFile3 = new FontFace(
    "MathJax_Math",
    "url(./src/scripts/extern/mathjax/es5/output/chtml/fonts/woff-v2/MathJax_Math-Italic.woff) format('woff')",
    { weight: "normal", style: "italic", display: "swap" }
);

document.fonts.add(fontFile);
document.fonts.add(fontFile2);
document.fonts.add(fontFile3);

fontFile.load();
fontFile2.load();
fontFile3.load();
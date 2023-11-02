// ==UserScript==
// @name        save manager
// @namespace   https://github.com/Syntoxr
// @downloadURL https://github.com/Syntoxr/userscripts/raw/main/games/nandgame.user.js
// @supportURL  https://github.com/Syntoxr/userscripts/tree/main/games
// @homepageURL https://github.com/Syntoxr/userscripts/tree/main
// @match       https://www.nandgame.com/
// @grant       none
// @version     1.1
// @author      Syntoxr
// @description Adds import / export functionality to nandgame
// @run-at      document-idle
// ==/UserScript==


const toolbarElem = document.getElementsByClassName("toolbar")[0]
toolbarElem.innerHTML += `
<div class="btn-group me-2"><button id="btnExport" class="btn btn-primary"><i class="bi"></i>Export</button></div>
<div class="btn-group me-2"><button id="btnImport" class="btn btn-primary"><i class="bi"></i>Import</button></div>
<form id="importForm"><input id="importInput" style="display:none" type="file"></form>`


const dlAnchorElem = document.createElement("a")
dlAnchorElem.style.display = "none"

const importForm = document.getElementById("importForm")
const ulInputElem = document.getElementById("importInput")


function exportSave() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localStorage));
  const d = new Date();

  dlAnchorElem.setAttribute("href",     dataStr     );
  dlAnchorElem.setAttribute("download", "nand-save-" + d.toLocaleString() + ".json");
  dlAnchorElem.click();
}


btnExport.addEventListener("click",() => {exportSave()})
btnImport.addEventListener("click",() => {ulInputElem.click()})

//read file and overwrite localstorage
const reader = new FileReader();
reader.onload = function() {
  var fileContent = JSON.parse(reader.result);
  localStorage.clear();
  for (const [key, value] of Object.entries(fileContent)) {
    localStorage.setItem(key, value);
  }
};

ulInputElem.addEventListener("change", (event) => {
  const file = event.target.files[0]

  if (file.type !== "application/json") {
    console.warn("uploaded wrong file type: " + file.type)
    return
  };

  reader.readAsText(file);
  importForm.reset();

})

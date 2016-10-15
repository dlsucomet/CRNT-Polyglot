function saveTextFile(filename: string, contents: string) {
  let link = document.createElement("a");
  link.style.display = "none";

  link.setAttribute('download', filename);
  link.setAttribute('href', 'data:text/text;charset=utf-8,' + encodeURIComponent(contents));

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


let Key = {
  Backspace: 8,
  Tab: 9,
  Enter: 13,
  Escape: 27,
  ArrowLeft: 37,
  ArrowUp: 38,
  ArrowRight: 39,
  ArrowDown: 40,  
};


export { saveTextFile, Key };

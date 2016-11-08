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

function naturalSort(arr) {
  arr.sort(function(a, b) {
    let aChunks = a.match(/(\d+)|(\D+)/g).map(elem => /\d+/.test(elem) ? Number(elem) : elem);
    let bChunks = b.match(/(\d+)|(\D+)/g).map(elem => /\d+/.test(elem) ? Number(elem) : elem);

    for (let i = 0; i < aChunks.length && i < bChunks.length; i++) {
      if (aChunks[i] < bChunks[i]) return -1;
      if (aChunks[i] > bChunks[i]) return 1;
    }

    if (aChunks.length < bChunks.length) return -1;
    if (aChunks.length > bChunks.length) return 1;
    return 0;
  });
}

export { saveTextFile, Key, naturalSort };

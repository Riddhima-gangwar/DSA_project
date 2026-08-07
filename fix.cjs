const fs = require('fs');
const files = [
  'src/algorithms/sorting/bubbleSort.ts',
  'src/algorithms/sorting/selectionSort.ts',
  'src/algorithms/sorting/insertionSort.ts',
  'src/algorithms/sorting/mergeSort.ts',
  'src/algorithms/sorting/quickSort.ts'
];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/order: SortOrder = 'asc'/g, "order: SortOrder = 'asc', generateFrames: boolean = true");
  content = content.replace(/frames\.push\(/g, "if (generateFrames) frames.push(");
  fs.writeFileSync(f, content);
});

const searchFiles = [
  'src/algorithms/searching/linearSearch.ts',
  'src/algorithms/searching/binarySearch.ts'
];
searchFiles.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/target: any/g, "target: any, generateFrames: boolean = true");
  content = content.replace(/frames\.push\(/g, "if (generateFrames) frames.push(");
  fs.writeFileSync(f, content);
});
console.log('Done');

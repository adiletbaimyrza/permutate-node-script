const fs = require("fs");
const readline = require("readline");

// Define your fiedls here
const fields = [
  ["Field1", [1, true, "Error"]],
  ["Field2", [true, false]],
  ["Field3", ["OK", "Error"]],
  ["Field4", [true, false]],
];

// Provide fileName like this -> node permutate.js permutations.csv
const fileName = process.argv[2]; 

function generatePermutations(fields) {
  const results = [];

  function backtrack(current, index) {
    if (index === fields.length) {
      results.push({ ...current });
      return;
    }

    const [fieldName, values] = fields[index];
    for (const value of values) {
      current[fieldName] = value;
      backtrack(current, index + 1);
    }
  }

  backtrack({}, 0);
  return results;
}

function convertToCSV(data) {
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((header) => row[header]).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

function saveCSV() {
    const permutations = generatePermutations(fields);
    const csvContent = convertToCSV(permutations);
  
    fs.writeFileSync(fileName, csvContent);
    console.log(`CSV file "${fileName}" has been created!`);
  }



if (!fileName) {
  console.error(
    "Please provide a file name as an argument: node permutate.js <filename>"
  );
  process.exit(1);
}

if (fs.existsSync(fileName)) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    `File "${fileName}" already exists. Do you want to overwrite it? (yes/no): `,
    (answer) => {
      if (answer.toLowerCase() === "yes" || answer.toLowerCase() === "y") {
        saveCSV();
      } else {
        console.log("Operation canceled. No file was written.");
      }
      rl.close();
    }
  );
} else {
  saveCSV();
}



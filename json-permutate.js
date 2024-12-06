const fs = require("fs");

function generatePermutations(baseObject, fields) {
  const results = [];

  function setValueAtPath(obj, path, value) {
    const keys = path.split(".");
    const lastKey = keys.pop();
    const target = keys.reduce((o, key) => (o[key] = o[key] || {}), obj);
    target[lastKey] = value;
  }

  function createCaseObject(fields, currentObject) {
    const caseObject = {};
    for (const [fieldPath] of fields) {
      const keys = fieldPath.split(".");
      let value = keys.reduce((o, key) => (o ? o[key] : undefined), currentObject);
      caseObject[fieldPath] = value === undefined ? "MISSING" : value;
    }
    return caseObject;
  }

  function backtrack(current, index) {
    if (index === fields.length) {
      const caseObject = createCaseObject(fields, current);
      results.push({
        case: caseObject,
        risk: JSON.parse(JSON.stringify(current)),
      });
      return;
    }

    const [fieldPath, values] = fields[index];
    for (const value of values) {
      const copy = JSON.parse(JSON.stringify(current));
      if (value === undefined) {
        const keys = fieldPath.split(".");
        const lastKey = keys.pop();
        const target = keys.reduce((o, key) => (o[key] = o[key] || {}), copy);
        delete target[lastKey];
      } else {
        setValueAtPath(copy, fieldPath, value);
      }
      backtrack(copy, index + 1);
    }
  }

  backtrack(baseObject, 0);
  return results;
}

const risk = {
  id: "1",
  proposer: {
    days: 30,
    daysBefore: 15,
  },
};

const fields = [
  ["id", ["1", "2", undefined]],
  ["proposer.days", [15, 23]],
];

const permutations = generatePermutations(risk, fields);

const outputFileName = "output.json";
fs.writeFileSync(outputFileName, JSON.stringify(permutations, null, 2));

console.log(`Permutations have been saved to "${outputFileName}"`);

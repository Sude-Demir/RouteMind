const upperRegex = /[A-Z]/;
const lowerRegex = /[a-z]/;

const testPass = "İlker123.";
console.log(`Testing: "${testPass}"`);
console.log(`Has Upper [A-Z]: ${upperRegex.test(testPass)}`);
console.log(`Has Lower [a-z]: ${lowerRegex.test(testPass)}`);

const turkishUpperRegex = /[A-ZÇĞİÖŞÜ]/;
const turkishLowerRegex = /[a-zçğıöşü]/;

console.log(`Has Turkish Upper: ${turkishUpperRegex.test(testPass)}`);
console.log(`Has Turkish Lower: ${turkishLowerRegex.test(testPass)}`);

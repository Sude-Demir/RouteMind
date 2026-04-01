const validate = (password) => {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[@$!%*?&.]/.test(password),
  };
};

["Test123.", "test123.", "Test.", "Tes1."].forEach(pass => {
  console.log(`Testing: "${pass}"`);
  console.log(JSON.stringify(validate(pass), null, 2));
  console.log('---');
});

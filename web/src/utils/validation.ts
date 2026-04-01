export const validatePassword = (password: string) => {
  const requirements = {
    length: password.length >= 8,
    upper: /[A-ZÇĞİÖŞÜ]/.test(password),
    lower: /[a-zçğıöşü]/.test(password),
    number: /[0-9]/.test(password),
    special: /[@$!%*?&._\-#/%^*+]/.test(password),
  };
  
  const isValid = Object.values(requirements).every(val => val);
  
  return {
    isValid,
    requirements
  };
};

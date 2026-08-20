export function isValidEmail(email) {
  const emailParts = email.trim().split('@');

  return (
    emailParts.length === 2 &&
    emailParts[0] &&
    emailParts[1].includes('.') &&
    !emailParts[1].startsWith('.') &&
    !emailParts[1].endsWith('.')
  );
}

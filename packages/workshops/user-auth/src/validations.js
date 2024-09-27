export function validateUsernameAndPassword(username, password) {
  validateString(username, 'Username');
  validateStringLength(username, 'Username', 3);
  validateString(password, 'Password');
  validateStringLength(password, 'Password', 6);
}

function validateString(string, stringName) {
  if (typeof string !== 'string') {
    throw new Error(`${stringName} must be a string`);
  }
}

function validateStringLength(string, stringName, length) {
  if (string.length < length) {
    throw new Error(
      `${stringName} must be at least ${length} character length`
    );
  }
}

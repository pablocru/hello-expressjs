export const {
  AUTH_FORM_ERROR_COOKIE_NAME = "auth_form_error",
  HASH_ROUNDS = process.env.NODE_ENV === "production" ? 15 : 5,
  JWT_COOKIE_NAME = "access_token",
  JWT_SECRET_KEY = "in-real-scenarios-please-do-not-leave-this-secret-hardcoded-here-use-environment-variables-instead-also-use-numbers-and-symbols-it-is-even-better-to-hash-or-encode-this-secret",
} = process.env;

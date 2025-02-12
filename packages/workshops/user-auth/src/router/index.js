import { AUTH_FORM_ERROR_COOKIE_NAME } from "../config.js";
import { isAuthenticated } from "../middleware/auth.js";
import { Router } from "express";

const router = Router();

router.get("/", (request, response) => {
  const authFormError = request.cookies[AUTH_FORM_ERROR_COOKIE_NAME];

  if (authFormError) {
    return response
      .clearCookie(AUTH_FORM_ERROR_COOKIE_NAME)
      .render("index", { status: "error", ...authFormError });
  }

  const { user } = request.session;

  if (!user) {
    return response.render("index", {
      status: "unauthenticated",
      message: "There is no user in session",
    });
  }

  response.render("index", { status: "authenticated", ...user });
});

router.get("/profile", isAuthenticated, (request, response) => {
  const { user } = request.session;

  response.render("profile", user);
});

export default router;

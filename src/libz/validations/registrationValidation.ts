import { check } from "express-validator";
export default [
  check("email").isEmail(),
  check("newusername").isLength({ min: 3 }),
  check("signUpPassword").isLength({ min: 3 })
];

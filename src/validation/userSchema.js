import { object, string } from "yup";

// Creating a user Schema to validate the form data
// fullName : string,
// email : a valid email
//  password : atleast 8 chars long, contains atleast 1 uppercase alphabet, atleast 1 lowercase alphabet, atleast 1 number
export const userSchema = object({
  name: string().required("Full Name is required."),
  email: string().email().required("A valid email is required."),
  password: string()
    .required()
    .min(8, "Password must be at least 8 characters long")
    .test("password-strength", (value, context) => {
      const password = value || "";
      if (!/[A-Z]/.test(password)) {
        return context.createError({
          message: "Password must contain at least one uppercase letter",
        });
      }

      if (!/[a-z]/.test(password)) {
        return context.createError({
          message: "Password must contain at least one lowercase letter",
        });
      }

      if (!/\d/.test(password)) {
        return context.createError({
          message: "Password must contain at least one number",
        });
      }

      return true;
    }),
});

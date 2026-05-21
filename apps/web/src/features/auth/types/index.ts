export type AuthFlowState =
  | "form"
  | "forgot_email"
  | "forgot_otp"
  | "forgot_reset"
  | "forgot_success";

export type AuthMode = "login" | "signup";

export type FormErrors = Record<string, string>;


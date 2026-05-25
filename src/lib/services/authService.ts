import { apiDelete, apiPatch, apiPost } from "../api";

export async function forgotPassword(email: string) {
  return apiPost<{ status: string; message?: string }>(
    "/users/forgotPassword",
    { email },
    { skipAuth: true }
  );
}

export async function verifyResetCode(email: string, code: string) {
  return apiPost<{ status: string; message?: string }>(
    "/users/verifyResetCode",
    { email, code },
    { skipAuth: true }
  );
}

export async function resetPassword(password: string, passwordConfirm: string) {
  return apiPatch<{ status: string; token?: string; data?: { user: unknown } }>(
    "/users/resetPassword",
    { password, passwordConfirm }
  );
}

export async function updatePassword(
  oldPassword: string,
  newPassword: string,
  newPasswordConfirm: string
) {
  return apiPatch("/users/updatePassword", {
    oldPassword,
    newPassword,
    newPasswordConfirm,
  });
}

export async function deleteMe() {
  return apiDelete("/users/deleteMe");
}

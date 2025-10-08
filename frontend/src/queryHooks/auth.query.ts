import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "../types/response";
import type { IUserPayload } from "../types/auth";
import { createNewUser, loginUser } from "../apis/auth";

export function useRegisterUser() {
  return useMutation<any, AxiosError<ErrorResponse>, IUserPayload>({
    mutationFn: async (payload) => await createNewUser(payload),
  });
}

export function useLoginUser() {
  return useMutation<any, AxiosError<ErrorResponse>, IUserPayload>({
    mutationFn: async (payload) => await loginUser(payload),
  });
}

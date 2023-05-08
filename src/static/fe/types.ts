import { GameResponse } from "../types";

export const isGameResponseType = (value: unknown): value is GameResponse => {
  return (
    typeof value === "object" &&
    value !== null &&
    "hasStarted" in value &&
    typeof value.hasStarted === "boolean" &&
    "playerIds" in value &&
    Array.isArray(value.playerIds)
  );
};

export type GenericResponse = {
  success: boolean;
  data?: object;
};

export const isGenericResponseType = (
  value: unknown
): value is GenericResponse => {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    typeof value.success === "boolean"
  );
};

import type { Diagonsis } from "../types.ts";
import data from "../../data/diagnoses.ts";

export const getDiagnoses = (): Diagonsis[] => {
  return data;
};
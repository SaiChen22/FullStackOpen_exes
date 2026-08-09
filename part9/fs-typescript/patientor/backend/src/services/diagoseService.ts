import type { Diagnosis } from "../types.ts";
import data from "../../data/diagnoses.ts";

export const getDiagnoses = (): Diagnosis[] => {
  return data;
};
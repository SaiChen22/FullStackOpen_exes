import { z } from 'zod';

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export const Gender = {
  Male: 'male',
  Female: 'female',
  Other: 'other',
} as const;

export type Gender = typeof Gender[keyof typeof Gender];

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}

const HealthCheckRating = {
  Healthy: 0,
  LowRisk: 1,
  HighRisk: 2,
  CriticalRisk: 3,
} as const;

const BaseEntrySchema = z.object({
  description: z.string(),
  date: z.string(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
});

const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal("HealthCheck"),
  healthCheckRating: z.union([
    z.literal(HealthCheckRating.Healthy),
    z.literal(HealthCheckRating.LowRisk),
    z.literal(HealthCheckRating.HighRisk),
    z.literal(HealthCheckRating.CriticalRisk),
  ]),
});

const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string(),
  sickLeave: z.object({
    startDate: z.string(),
    endDate: z.string(),
  }).optional(),
});

const HospitalEntrySchema = BaseEntrySchema.extend({
  type: z.literal("Hospital"),
  discharge: z.object({
    date: z.string(),
    criteria: z.string(),
  }),
});

export const NewEntrySchema = z.discriminatedUnion("type", [
  HealthCheckEntrySchema,
  OccupationalHealthcareEntrySchema,
  HospitalEntrySchema,
]);

type HealthCheckRating = typeof HealthCheckRating[keyof typeof HealthCheckRating];

export interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}

export interface OccupationalHealthcareEntry extends BaseEntry{
  type: "OccupationalHealthcare",
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
}

export interface HospitalEntry extends BaseEntry{
  type: "Hospital";
  discharge: {
    date: string;
    criteria: string;
  }
}


export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

type UnionOmit<T, K extends string | number | symbol> =
  T extends unknown ? Omit<T, K> : never;

export type NewEntry = UnionOmit<Entry, "id">;

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string(),
  ssn: z.string(),
  gender: z.enum(['male', 'female', 'other']),
  occupation: z.string(),
  
});


export type NewPatient = z.infer<typeof NewPatientSchema>;


export interface Patient extends NewPatient {
  id: string;
  entries: Entry[]
  
}

export type NonSensitivePatient = Omit<Patient, 'ssn'|'entries'>;
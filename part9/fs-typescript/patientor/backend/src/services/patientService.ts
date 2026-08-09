import type {
  NonSensitivePatient,
  Patient,
  NewPatient,
  Entry,
  NewEntry
} from "../types.ts";
import data from '../../data/patients.ts';

import {v1 as uuid} from 'uuid';

const getPatients = (): NonSensitivePatient[] => {
    return data.map((patient) => {
        const { id, name, dateOfBirth, gender, occupation } = patient;
        return {
            id,
            name,
            dateOfBirth,
            gender,
            occupation
        };
    });

};

const getPatientById = (id: string): Patient | undefined => {
    return data.find((patient) => patient.id === id);
};

const addPatient = (entry: NewPatient): Patient => {
    const newPatient: Patient = {
        id: uuid(),
        entries: [],
        ...entry
    };
    data.push(newPatient);
    return newPatient;
};

const addEntry = (patientId: string, entry: NewEntry): Entry | undefined => {
  const patient = data.find((patient) => patient.id === patientId);

  if (!patient) {
    return undefined;
  }

  const newEntry: Entry = {
    ...entry,
    id: uuid(),
  };

  patient.entries.push(newEntry);
  console.log("Entry added to patient:", patient.name);
  return newEntry;
};

export default { getPatients, addPatient, getPatientById,addEntry};
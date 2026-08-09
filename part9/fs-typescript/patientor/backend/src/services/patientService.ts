import type { NonSensitivePatient, Patient ,NewPatient} from '../types.ts';
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

const addPatient = (entry: NewPatient): Patient => {
    const newPatient: Patient = {
        id: uuid(),
        ...entry
    };
    data.push(newPatient);
    return newPatient;
};

export default { getPatients, addPatient };
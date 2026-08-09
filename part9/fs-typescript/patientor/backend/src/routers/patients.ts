import express, {type Response,type Request,type NextFunction} from 'express';
import {z} from 'zod';
import {type NonSensitivePatient,type Patient,type NewPatient, NewPatientSchema} from '../types.ts';
import patientService from '../services/patientService.ts';

const router = express.Router();

const newParitentParser = (req: Request, _res: Response, next: NextFunction) => {
    try {
        NewPatientSchema.parse(req.body);
        next();
    } catch (error) {
        next(error);
    }
};

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.get('/', (_req, res: Response<NonSensitivePatient[]>) => {
    const nonSenstivePatient = patientService.getPatients();
    res.json(nonSenstivePatient);
});

router.post('/', newParitentParser
    ,(req: Request<unknown,unknown,NewPatient>, res: Response<Patient>) => {
    const { name, dateOfBirth, ssn, gender, occupation } = req.body;
    const newPatient = patientService.addPatient({ name, dateOfBirth, ssn, gender, occupation });
    res.json(newPatient);
});

router.use(errorMiddleware);

export default router;

import express, {type Response,type Request,type NextFunction} from 'express';
import {z} from 'zod';
import {type NonSensitivePatient,type Patient,type NewPatient,type NewEntry, NewPatientSchema, NewEntrySchema, type Entry} from '../types.ts';
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

const newEntryParser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    NewEntrySchema.parse(req.body);
    next();
  } catch (error) {
    next(error);
  }
};

type Error = {
  error: string;
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

router.get('/:id', (req: Request<{ id: string }>, res: Response) => {
  const patient = patientService.getPatientById(req.params.id);

  if (!patient) {
    res.status(404).send({ error: 'patient not found' });
    return;
  }

  res.json(patient);
});

router.post('/', newParitentParser
    ,(req: Request<unknown,unknown,NewPatient>, res: Response<Patient>) => {
    const { name, dateOfBirth, ssn, gender, occupation } = req.body;
    const newPatient = patientService.addPatient({ name, dateOfBirth, ssn, gender, occupation });
    res.json(newPatient);
});

router.post(
  "/:id/entries",
  newEntryParser,
  (
    req: Request<{ id: string }, unknown, NewEntry>,
    res: Response<Entry|Error>
  ) => {
    const newEntry = patientService.addEntry(req.params.id, req.body);

    if (!newEntry) {
      res.status(404).send({ error: "patient not found" });
      return;
    }

    res.status(201).json(newEntry);
  }
);
router.use(errorMiddleware);

export default router;
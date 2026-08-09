import express, {type Response} from 'express';
import { getDiagnoses } from '../services/diagoseService.ts';
import type { Diagnosis } from '../types.ts';

const router = express.Router();

router.get('/', (_req, res: Response<Diagnosis[]>) => {
  res.send(getDiagnoses());
});

export default router;
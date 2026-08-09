import express, {type Response} from 'express';
import { getDiagnoses } from '../services/diagoseService.ts';
import type { Diagonsis } from '../types.ts';

const router = express.Router();

router.get('/', (_req, res: Response<Diagonsis[]>) => {
  res.send(getDiagnoses());
});

export default router;
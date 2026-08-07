import express from 'express';
import { calculateBmi } from './bmiCalculator.ts';
import { calculateExercises} from './exerciseCalculator.ts';

const app = express();
app.use(express.json());

app.get('/ping', (_req, res) => {
  res.send('pong');
});

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;

  // 1. 检查缺失参数（height 或 weight 不存在）
  if (!height || !weight) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  // 2. 转换为数字类型
  const heightNum = Number(height);
  const weightNum = Number(weight);

  // 3. 检查非数字参数（isNaN）
  if (isNaN(heightNum) || isNaN(weightNum)) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  // 4. 计算 BMI 并返回正确格式的 JSON
  const bmi = calculateBmi(heightNum, weightNum);

  return res.json({
    weight: weightNum,
    height: heightNum,
    bmi: bmi
  });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  // 1. 检查参数是否存在
  if (!daily_exercises || target === undefined) {
    return res.status(400).send({ error: 'parameters missing' });
  }

  // 2. 检查 target 是否为有效数字
  if (isNaN(Number(target))) {
    return res.status(400).send({ error: 'malformatted parameters' });
  }

  // 3. 检查 daily_exercises 是否为数组，且数组元素均为数字
  if (!Array.isArray(daily_exercises) || daily_exercises.length === 0) {
    return res.status(400).send({ error: 'malformatted parameters' });
  }

  const isAllNumbers = daily_exercises.every(item => !isNaN(Number(item)));
  if (!isAllNumbers) {
    return res.status(400).send({ error: 'malformatted parameters' });
  }

  // 类型转换并执行计算
  const dailyArray = daily_exercises.map(item => Number(item));
  const targetNumber = Number(target);

  const result = calculateExercises(dailyArray, targetNumber);

  return res.send(result);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
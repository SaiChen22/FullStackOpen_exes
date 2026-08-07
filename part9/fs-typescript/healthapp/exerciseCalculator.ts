// exerciseCalculator.ts

export interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export interface ExerciseValues {
  target: number;
  dailyExercises: number[];
}

const parseExerciseArguments = (args: string[]): ExerciseValues => {
  if (args.length < 4) throw new Error('Not enough arguments');

  // 取出 target 和 每日数据
  const target = Number(args[2]);
  const rawDaily = args.slice(3);

  // 检查 target 是否有效
  if (isNaN(target)) {
    throw new Error('Provided target is not a number!');
  }

  // 检查 dailyExercises 是否全为数字
  const dailyExercises = rawDaily.map(arg => {
    const num = Number(arg);
    if (isNaN(num)) {
      throw new Error('Provided daily exercise values contain non-number values!');
    }
    return num;
  });

  return { target, dailyExercises };
};

export const calculateExercises = (dailyExercises: number[], target: number): Result => {
  const periodLength = dailyExercises.length;
  const trainingDays = dailyExercises.filter(day => day > 0).length;
  const totalHours = dailyExercises.reduce((sum, curr) => sum + curr, 0);
  const average = totalHours / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average >= target) {
    rating = 3;
    ratingDescription = 'great job, target achieved!';
  } else if (average >= target * 0.75) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  } else {
    rating = 1;
    ratingDescription = 'bad, you need to work harder';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

// 仅在主程序执行时运行
if (process.argv[1] === import.meta.filename) {
  try {
    const { target, dailyExercises } = parseExerciseArguments(process.argv);
    console.log(calculateExercises(dailyExercises, target));
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}
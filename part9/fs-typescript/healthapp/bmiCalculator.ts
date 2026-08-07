// bmiCalculator.ts

interface BmiValues {
  height: number;
  weight: number;
}

// 校验并解析命令行参数
const parseBmiArguments = (args: string[]): BmiValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3])
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

export const calculateBmi = (height: number, weight: number): string => {
  const bmi = weight / ((height / 100) ** 2);

  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25.0) return 'Normal range';
  if (bmi < 30.0) return 'Overweight';
  return 'Obese';
};

// 仅在直接从命令行运行时执行参数解析（后续被 Express 导入时不会冲突）
if (process.argv[1] === import.meta.filename) {
  try {
    const { height, weight } = parseBmiArguments(process.argv);
    console.log(calculateBmi(height, weight));
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}
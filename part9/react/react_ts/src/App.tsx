interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDescription extends CoursePartBase{
  description: string;
}

interface CoursePartBasic extends CoursePartDescription {
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartDescription {
  backgroundMaterial: string;
  kind: "background"
}

interface CoursePartRequirement extends CoursePartDescription{
  requirements: string[];
  kind: "requirement"
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartRequirement;


const Header = (prop:{ title: string }) => <h1>{prop.title}</h1>;

const Part = (prop: { part: CoursePart }) => {
  const assertError = (value: never): never => {
    throw new Error(`Unhandled kind: ${value}`);
  };
  switch (prop.part.kind) {
    case "basic":
      return (
        <p>
          {prop.part.name} {prop.part.exerciseCount} {prop.part.description}
        </p>
      );
    case "group":
      return (
        <p>
          {prop.part.name} {prop.part.exerciseCount}  Group Project Count: {prop.part.groupProjectCount}
        </p>
      );
    case "background":
      return (
        <p>
          {prop.part.name} {prop.part.exerciseCount} {prop.part.description} Background Material: {prop.part.backgroundMaterial}
        </p>
      );
    case "requirement":
      return (
        <p>
          {prop.part.name} {prop.part.exerciseCount} {prop.part.description} Requirements: {prop.part.requirements.join(", ")}
        </p>
      );
    default:
      return assertError(prop.part);
  }
};

const Content = (prop:{ parts: CoursePart[] }) => (
  <div>
    {prop.parts.map((part, index) => (
      <Part key={index} part={part} />
    ))}
  </div>
);



const Total = (prop:{total: number}) => {
  return <p>Number of exercises {prop.total}</p>;
};

const App = () => {
  const courseName = "Half Stack application development";



const courseParts: CoursePart[] = [
  {
    name: "Fundamentals",
    exerciseCount: 10,
    description: "This is an awesome course part",
    kind: "basic"
  },
  {
    name: "Using props to pass data",
    exerciseCount: 7,
    groupProjectCount: 3,
    kind: "group"
  },
  {
    name: "Basics of type Narrowing",
    exerciseCount: 7,
    description: "How to go from unknown to string",
    kind: "basic"
  },
  {
    name: "Deeper type usage",
    exerciseCount: 14,
    description: "Confusing description",
    backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
    kind: "background"
  },
  {
    name: "TypeScript in frontend",
    exerciseCount: 10,
    description: "a hard part",
    kind: "basic",
  },
  {
  name: "Backend development",
  exerciseCount: 21,
  description: "Typing the backend",
  requirements: ["nodejs", "jest"],
  kind: "requirement"
}
];

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  

  return (
    <div>
      <Header title={courseName} />
      <Content parts={courseParts} />
      <Total total={totalExercises} />
    </div>
  );
};


export default App;
import QuizCard from "./quizCard";
import { Question } from "@/types/questions";

interface EditableQuizComponentProps {
  collectionName: string;
  questions: Question[];
}

const EditableQuizComponent: React.FC<EditableQuizComponentProps> = ({ collectionName, questions }) => {
  return (
    <>
      <h2 className="text-xl font-bold">{collectionName}</h2>
      <div className="flex flex-col gap-2">
        {questions.map((question, index) => (
          <div key={index}>
            <QuizCard question={question}></QuizCard>
          </div>
        ))}
      </div>
    </>
  );
};

export default EditableQuizComponent;
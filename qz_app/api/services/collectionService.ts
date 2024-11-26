import { deleteQuizById } from "./quizService";
import { deleteQuestionsByIds } from "./questionService";

export const deleteCollection = async (quizId: string, questionIds: string[]) => {
  await Promise.all([deleteQuestionsByIds(questionIds), deleteQuizById(quizId)]);
};

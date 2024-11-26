export const deleteCollection = async (quizId: string, questionIds: string[]) => {
  try {
    const response = await fetch("/api/collection/deleteCollection", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quizId, questionIds }),
    });
    if (!response.ok) {
      throw new Error("Failed to delete collection");
    }
    return response;
  } catch (error) {
    console.error("Failed to delete collection", error);
    throw error;
  }
};

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useQuizStore } from "@/app/store/useQuestionStore";

interface EditableQuizInfoCardProps {
  title: string;
  description?: string;
}

const EditableQuizInfoCard: React.FC<EditableQuizInfoCardProps> = ({ title, description = "" }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);
  
  const updateQuiz = useQuizStore((state) => state.updateQuiz);
  const getQuiz = useQuizStore((state) => state.getQuiz);

  const handleTitleSave = () => {
    const quiz = getQuiz();
    updateQuiz({ ...quiz, topic: editedTitle });
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setEditedTitle(title);
    setIsEditingTitle(false);
  };

  const handleDescriptionSave = () => {
    const quiz = getQuiz();
    updateQuiz({ ...quiz, description: editedDescription });
    setIsEditingDescription(false);
  };

  const handleDescriptionCancel = () => {
    setEditedDescription(description);
    setIsEditingDescription(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, type: 'title' | 'description') => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (type === 'title') {
        handleTitleSave();
      } else {
        handleDescriptionSave();
      }
    } else if (e.key === 'Escape') {
      if (type === 'title') {
        handleTitleCancel();
      } else {
        handleDescriptionCancel();
      }
    }
  };

  const handleBlur = (type: 'title' | 'description') => {
    if (type === 'title') {
      handleTitleSave();
    } else {
      handleDescriptionSave();
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Title Section */}
          <div>
            {isEditingTitle ? (
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'title')}
                onBlur={() => handleBlur('title')}
                className="text-lg font-bold h-[40px]"
                placeholder="Quiz title here"
                maxLength={75}
                autoFocus
              />
            ) : (
              <div
                onClick={() => setIsEditingTitle(true)}
                className="text-lg font-bold cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
              >
                {title || "Click to add title"}
              </div>
            )}
          </div>

          {/* Description Section */}
          <div>
            {isEditingDescription ? (
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'description')}
                onBlur={() => handleBlur('description')}
                placeholder="Add a description for your quiz..."
                className="min-h-[80px] resize-none leading-relaxed text-justify"
                maxLength={500}
                autoFocus
              />
            ) : (
              <div
                onClick={() => setIsEditingDescription(true)}
                className="cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors min-h-[60px] flex items-center leading-relaxed text-justify"
              >
                {description || "Click to add description"}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditableQuizInfoCard;

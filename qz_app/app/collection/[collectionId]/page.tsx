"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Quiz } from "@/types/quiz";
import { Collection } from "@/types/collection";
import { 
  ArrowLeft, 
  Edit, 
  Plus, 
  Trash2, 
  Eye,
  Star,
  Users,
  BookOpen,
  FolderOpen,
  ChevronDown,
  FileText,
  Save,
  X
} from "lucide-react";
import Link from "next/link";

export default function CollectionViewPage() {
  const params = useParams();
  const collectionId = params?.collectionId as string;
  
  const [collection, setCollection] = useState<Collection | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [availableQuizzes, setAvailableQuizzes] = useState<Quiz[]>([]);
  const [showAddExisting, setShowAddExisting] = useState(false);

  const fetchCollectionData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch collection details
      const collectionResponse = await fetch(`/api/collection/${collectionId}`);
      if (!collectionResponse.ok) {
        throw new Error("Collection not found");
      }
      const collectionData = await collectionResponse.json();
      setCollection(collectionData.collection);

      // Fetch quizzes in this collection
      if (collectionData.collection.quizIds.length > 0) {
        const quizzesResponse = await fetch(`/api/quiz/by-collection/${collectionId}`);
        if (quizzesResponse.ok) {
          const quizzesData = await quizzesResponse.json();
          setQuizzes(quizzesData.quizzes || []);
        }
      }
    } catch (error) {
      console.error("Error fetching collection:", error);
      setError(error instanceof Error ? error.message : "Failed to load collection");
    } finally {
      setIsLoading(false);
    }
  }, [collectionId]);

  const fetchAvailableQuizzes = useCallback(async () => {
    try {
      // Fetch user's quizzes
      const response = await fetch('/api/quiz/user-quizzes');
      if (response.ok) {
        const data = await response.json();
        const userQuizzes = data.quizzes || [];
        
        // Filter out quizzes that are already in this collection
        const currentQuizIds = quizzes.map(q => q.id);
        const available = userQuizzes.filter((quiz: Quiz) => 
          !currentQuizIds.includes(quiz.id) && 
          (!quiz.collectionId || quiz.collectionId === "none")
        );
        
        setAvailableQuizzes(available);
      }
    } catch (error) {
      console.error("Error fetching available quizzes:", error);
    }
  }, [quizzes]);

  const handleAddExistingQuiz = async (quizId: string) => {
    try {
      const response = await fetch(`/api/collection/${collectionId}/quiz/${quizId}`, {
        method: 'POST',
      });
      
      if (response.ok) {
        // Refresh the collection data
        await fetchCollectionData();
        await fetchAvailableQuizzes();
        setShowAddExisting(false);
        alert('Quiz added to collection successfully!');
      } else {
        alert('Failed to add quiz to collection');
      }
    } catch (error) {
      console.error('Error adding quiz to collection:', error);
      alert('Failed to add quiz to collection');
    }
  };

  const handleSaveAsDraft = async (quizId: string) => {
    try {
      const response = await fetch(`/api/quiz/${quizId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizState: 'draft' }),
      });
      
      if (response.ok) {
        await fetchCollectionData();
        alert('Quiz saved as draft successfully!');
      } else {
        alert('Failed to save quiz as draft');
      }
    } catch (error) {
      console.error('Error saving quiz as draft:', error);
      alert('Failed to save quiz as draft');
    }
  };

  const handlePublishQuiz = async (quizId: string) => {
    try {
      const response = await fetch(`/api/quiz/${quizId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizState: 'published' }),
      });
      
      if (response.ok) {
        await fetchCollectionData();
        alert('Quiz published successfully!');
      } else {
        alert('Failed to publish quiz');
      }
    } catch (error) {
      console.error('Error publishing quiz:', error);
      alert('Failed to publish quiz');
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/quiz/${quizId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await fetchCollectionData();
        alert('Quiz deleted successfully!');
      } else {
        alert('Failed to delete quiz');
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Failed to delete quiz');
    }
  };

  const handleRemoveFromCollection = async (quizId: string) => {
    if (!confirm("Are you sure you want to remove this quiz from the collection?")) {
      return;
    }

    try {
      console.log('Removing quiz from collection:', { collectionId, quizId });
      
      const response = await fetch(`/api/collection/${collectionId}/quiz/${quizId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Remove response:', response.status, response.statusText);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Remove result:', result);
        
        // Refresh the collection data
        await fetchCollectionData();
        alert('Quiz removed from collection successfully!');
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('Remove failed:', errorData);
        alert(`Failed to remove quiz from collection: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error removing quiz from collection:', error);
      alert('Failed to remove quiz from collection. Please try again.');
    }
  };

  useEffect(() => {
    if (collectionId) {
      fetchCollectionData();
    }
  }, [collectionId, fetchCollectionData]);

  useEffect(() => {
    if (quizzes.length > 0) {
      fetchAvailableQuizzes();
    }
  }, [quizzes, fetchAvailableQuizzes]);

  const handleDeleteCollection = async () => {
    if (!confirm("Are you sure you want to delete this collection? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/collection/${collectionId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Redirect to dashboard after successful deletion
        window.location.href = "/my-dashboard";
      } else {
        alert("Failed to delete collection");
      }
    } catch (error) {
      console.error("Failed to delete collection:", error);
      alert("Failed to delete collection");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-secondary">Loading collection...</p>
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">Collection Not Found</h1>
          <p className="text-secondary mb-6">
            {error || "The collection you're looking for doesn't exist or you don't have permission to view it."}
          </p>
          <Link href="/my-dashboard">
            <Button className="bg-orange hover:bg-orange/90 text-white font-semibold">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/my-dashboard">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
              <FolderOpen className="w-8 h-8 text-accent" />
              {collection.name}
            </h1>
            {collection.description && (
              <p className="text-secondary mt-1">{collection.description}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/collection/${collection.id}/edit`}>
            <Button variant="outline" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit Collection
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={handleDeleteCollection}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Collection Info */}
      <Card className="bg-white border border-light-gray shadow-lg mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6 text-sm text-secondary">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent" />
              <span className="font-medium">{quizzes.length} quizzes</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-accent" />
              <span className="font-medium">
                {collection.isPublic ? "Public" : "Private"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                Created {new Date(collection.createdAt!).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quizzes Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-primary">Quizzes in Collection</h2>
          
          {/* Add Quiz Dropdown */}
          <div className="relative">
            <Button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-orange hover:bg-orange/90 text-white font-semibold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Quiz
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </Button>

            {isDropdownOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsDropdownOpen(false)}
                />
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-light-gray z-20">
                  <div className="p-2">
                    <Link
                      href="/new/create"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange/10 transition-colors group w-full text-left"
                    >
                      <div className="text-muted-foreground group-hover:text-orange transition-colors">
                        <Plus className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-dark-blue group-hover:text-orange transition-colors">
                          Create New Quiz
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Create a brand new quiz
                        </div>
                      </div>
                    </Link>
                    
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setShowAddExisting(true);
                        fetchAvailableQuizzes();
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange/10 transition-colors group w-full text-left"
                    >
                      <div className="text-muted-foreground group-hover:text-orange transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-dark-blue group-hover:text-orange transition-colors">
                          Add Existing Quiz
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Add from your existing quizzes
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {quizzes.length === 0 ? (
          <Card className="bg-white border border-light-gray shadow-lg">
            <CardContent className="pt-6 text-center">
              <BookOpen className="w-16 h-16 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">No quizzes yet</h3>
              <p className="text-secondary mb-6">
                This collection is empty. Add quizzes to get started!
              </p>
              <Link href="/new/create">
                <Button className="bg-orange hover:bg-orange/90 text-white font-semibold">Create Your First Quiz</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="bg-white border border-light-gray shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-primary">
                        {quiz.topic}
                      </CardTitle>
                      {quiz.description && (
                        <p className="text-sm text-secondary line-clamp-2">
                          {quiz.description}
                        </p>
                      )}
                    </div>
                    <button 
                      onClick={() => handleRemoveFromCollection(quiz.id)}
                      className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      title="Remove from collection"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-secondary mb-4">
                    {quiz.rating !== undefined && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-orange text-orange" />
                        <span className="font-medium">{quiz.rating.toFixed(1)}</span>
                      </div>
                    )}
                    {quiz.attempts !== undefined && (
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-accent" />
                        <span className="font-medium">{quiz.attempts}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4 text-accent" />
                      <span className="font-medium">{quiz.questionIds.length} questions</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/quiz/${quiz.id}`} className="flex-1 min-w-0">
                      <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/quiz/${quiz.id}/edit`} className="flex-1 min-w-0">
                      <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                    </Link>
                    {quiz.quizState === "published" ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSaveAsDraft(quiz.id)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Save className="w-3 h-3" />
                        Save as Draft
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handlePublishQuiz(quiz.id)}
                        className="flex items-center gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <Eye className="w-3 h-3" />
                        Publish
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Existing Quiz Modal */}
      {showAddExisting && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30" 
            onClick={() => setShowAddExisting(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
            <Card className="bg-white border border-light-gray shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange" />
                    Add Existing Quiz to Collection
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddExisting(false)}
                  >
                    ✕
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto">
                {availableQuizzes.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-16 h-16 text-secondary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-primary mb-2">No Available Quizzes</h3>
                    <p className="text-secondary mb-6">
                      All your quizzes are already in collections or you don&apos;t have any quizzes yet.
                    </p>
                    <Link href="/new/create">
                      <Button className="bg-orange hover:bg-orange/90 text-white font-semibold">
                        Create New Quiz
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-secondary mb-4">
                      Select a quiz to add to this collection:
                    </p>
                    {availableQuizzes.map((quiz) => (
                      <div
                        key={quiz.id}
                        className="p-4 bg-white border border-light-gray shadow-lg rounded-lg hover:border-orange hover:bg-orange/5 transition-colors cursor-pointer"
                        onClick={() => handleAddExistingQuiz(quiz.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-primary mb-1">{quiz.topic}</h4>
                            {quiz.description && (
                              <p className="text-sm text-secondary mb-2 line-clamp-2">
                                {quiz.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-secondary">
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-3 h-3" />
                                {quiz.questionIds.length} questions
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {quiz.quizState === "published" ? "Published" : "Draft"}
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="bg-orange hover:bg-orange/90 text-white font-semibold"
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

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
  FolderOpen
} from "lucide-react";
import Link from "next/link";

export default function CollectionViewPage() {
  const params = useParams();
  const collectionId = params?.collectionId as string;
  
  const [collection, setCollection] = useState<Collection | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (collectionId) {
      fetchCollectionData();
    }
  }, [collectionId, fetchCollectionData]);

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
            <Button className="btn-primary">Back to Dashboard</Button>
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
      <Card className="card-modern mb-6">
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
          <Link href="/new/create">
            <Button className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Quiz
            </Button>
          </Link>
        </div>

        {quizzes.length === 0 ? (
          <Card className="card-modern">
            <CardContent className="pt-6 text-center">
              <BookOpen className="w-16 h-16 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">No quizzes yet</h3>
              <p className="text-secondary mb-6">
                This collection is empty. Add quizzes to get started!
              </p>
              <Link href="/new/create">
                <Button className="btn-primary">Create Your First Quiz</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="card-modern hover:scale-105 transform transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-primary">
                    {quiz.topic}
                  </CardTitle>
                  {quiz.description && (
                    <p className="text-sm text-secondary line-clamp-2">
                      {quiz.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-secondary mb-4">
                    {quiz.rating !== undefined && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-[#CAF0F8] text-[#CAF0F8]" />
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
                  
                  <div className="flex gap-2">
                    <Link href={`/quiz/${quiz.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        View Quiz
                      </Button>
                    </Link>
                    <Link href={`/quiz/${quiz.id}/edit`}>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

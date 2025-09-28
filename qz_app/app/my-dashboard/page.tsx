"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Quiz } from "@/types/quiz";
import { Collection } from "@/types/collection";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  FolderOpen,
  Star,
  Users,
  Eye,
  BookOpen
} from "lucide-react";
import Link from "next/link";

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

type TabType = "quizzes" | "collections";
type QuizFilterType = "all" | "published" | "drafts";
type CollectionFilterType = "all" | "public" | "private";

export default function MyDashboardPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<TabType>("quizzes");
  
  // Quiz state
  const [userQuizzes, setUserQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [quizSearchQuery, setQuizSearchQuery] = useState("");
  const [quizFilterType, setQuizFilterType] = useState<QuizFilterType>("all");
  
  // Collection state
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);
  const [collectionSearchQuery, setCollectionSearchQuery] = useState("");
  const [collectionFilterType, setCollectionFilterType] = useState<CollectionFilterType>("all");
  
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserData = useCallback(async () => {
    if (!session?.user || !(session.user as SessionUser).id) return;
    
    setIsLoading(true);
    try {
      // Fetch both quizzes and collections in parallel
      const [quizzesResponse, collectionsResponse] = await Promise.all([
        fetch(`/api/quiz/user-quizzes?userId=${(session.user as SessionUser).id}`),
        fetch(`/api/collection/user-collections?userId=${(session.user as SessionUser).id}`)
      ]);

      if (quizzesResponse.ok) {
        const quizzesData = await quizzesResponse.json();
        setUserQuizzes(quizzesData.quizzes || []);
      }

      if (collectionsResponse.ok) {
        const collectionsData = await collectionsResponse.json();
        setCollections(collectionsData.collections || []);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user]);

  const filterQuizzes = useCallback(() => {
    let filtered = userQuizzes;

    // Filter by type
    if (quizFilterType === "published") {
      filtered = filtered.filter(quiz => quiz.quizState === "published");
    } else if (quizFilterType === "drafts") {
      filtered = filtered.filter(quiz => quiz.quizState === "draft");
    }

    // Filter by search query
    if (quizSearchQuery.trim()) {
      const query = quizSearchQuery.toLowerCase();
      filtered = filtered.filter(quiz => 
        quiz.topic.toLowerCase().includes(query) ||
        (quiz.description && quiz.description.toLowerCase().includes(query))
      );
    }

    setFilteredQuizzes(filtered);
  }, [userQuizzes, quizSearchQuery, quizFilterType]);

  const filterCollections = useCallback(() => {
    let filtered = collections;

    // Filter by type
    if (collectionFilterType === "public") {
      filtered = filtered.filter(collection => collection.isPublic);
    } else if (collectionFilterType === "private") {
      filtered = filtered.filter(collection => !collection.isPublic);
    }

    // Filter by search query
    if (collectionSearchQuery.trim()) {
      const query = collectionSearchQuery.toLowerCase();
      filtered = filtered.filter(collection => 
        collection.name.toLowerCase().includes(query) ||
        (collection.description && collection.description.toLowerCase().includes(query))
      );
    }

    setFilteredCollections(filtered);
  }, [collections, collectionSearchQuery, collectionFilterType]);

  useEffect(() => {
    if (session?.user && (session.user as SessionUser).id) {
      fetchUserData();
    }
  }, [session, fetchUserData]);

  useEffect(() => {
    filterQuizzes();
  }, [filterQuizzes]);

  useEffect(() => {
    filterCollections();
  }, [filterCollections]);

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    try {
      const response = await fetch(`/api/quiz/${quizId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUserQuizzes(prev => prev.filter(q => q.id !== quizId));
      } else {
        alert("Failed to delete quiz");
      }
    } catch (error) {
      console.error("Failed to delete quiz:", error);
      alert("Failed to delete quiz");
    }
  };

  const handleToggleQuizDraft = async (quizId: string, currentState: string) => {
    try {
      const newState = currentState === "draft" ? "published" : "draft";
      const response = await fetch(`/api/quiz/${quizId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quizState: newState }),
      });

      if (response.ok) {
        setUserQuizzes(prev => 
          prev.map(quiz => 
            quiz.id === quizId 
              ? { ...quiz, quizState: newState }
              : quiz
          )
        );
      } else {
        alert("Failed to update quiz status");
      }
    } catch (error) {
      console.error("Failed to update quiz:", error);
      alert("Failed to update quiz");
    }
  };

  const handleDeleteCollection = async (collectionId: string) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;

    try {
      const response = await fetch(`/api/collection/${collectionId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCollections(prev => prev.filter(c => c.id !== collectionId));
      } else {
        alert("Failed to delete collection");
      }
    } catch (error) {
      console.error("Failed to delete collection:", error);
      alert("Failed to delete collection");
    }
  };

  const handleToggleCollectionPublic = async (collectionId: string, currentPublicStatus: boolean) => {
    try {
      const response = await fetch(`/api/collection/${collectionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublic: !currentPublicStatus }),
      });

      if (response.ok) {
        setCollections(prev => 
          prev.map(collection => 
            collection.id === collectionId 
              ? { ...collection, isPublic: !currentPublicStatus }
              : collection
          )
        );
      } else {
        alert("Failed to update collection status");
      }
    } catch (error) {
      console.error("Failed to update collection:", error);
      alert("Failed to update collection");
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">My Dashboard</h1>
          <p className="text-secondary mb-6">Please sign in to view your quizzes and collections.</p>
          <Link href="/auth/login">
            <Button className="btn-primary">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">My Dashboard</h1>
          <p className="text-secondary">Manage your quizzes and collections</p>
        </div>
        <div className="flex gap-2">
          <Link href="/new/create">
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Quiz
            </Button>
          </Link>
          <Link href="/new/collection">
            <Button className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Collection
            </Button>
          </Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === "quizzes" ? "default" : "outline"}
          onClick={() => setActiveTab("quizzes")}
          className="flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          Quizzes ({userQuizzes.length})
        </Button>
        <Button
          variant={activeTab === "collections" ? "default" : "outline"}
          onClick={() => setActiveTab("collections")}
          className="flex items-center gap-2"
        >
          <FolderOpen className="w-4 h-4" />
          Collections ({collections.length})
        </Button>
      </div>

      {/* Quizzes Tab */}
      {activeTab === "quizzes" && (
        <>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-4 h-4" />
              <Input
                placeholder="Search quizzes..."
                value={quizSearchQuery}
                onChange={(e) => setQuizSearchQuery(e.target.value)}
                className="pl-10 input-modern"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={quizFilterType === "all" ? "default" : "outline"}
                onClick={() => setQuizFilterType("all")}
                size="sm"
              >
                All ({userQuizzes.length})
              </Button>
              <Button
                variant={quizFilterType === "published" ? "default" : "outline"}
                onClick={() => setQuizFilterType("published")}
                size="sm"
              >
                Published ({userQuizzes.filter(q => q.quizState === "published").length})
              </Button>
              <Button
                variant={quizFilterType === "drafts" ? "default" : "outline"}
                onClick={() => setQuizFilterType("drafts")}
                size="sm"
              >
                Drafts ({userQuizzes.filter(q => q.quizState === "draft").length})
              </Button>
            </div>
          </div>

          {/* Quizzes Grid */}
          {filteredQuizzes.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">
                {quizSearchQuery ? "No quizzes found" : "No quizzes yet"}
              </h3>
              <p className="text-secondary mb-6">
                {quizSearchQuery 
                  ? "Try adjusting your search terms" 
                  : "Create your first quiz to get started"
                }
              </p>
              {!quizSearchQuery && (
                <Link href="/new/create">
                  <Button className="btn-primary">Create Quiz</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz) => (
                <Card key={quiz.id} className="card-modern hover:scale-105 transform transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-primary mb-1">
                          {quiz.topic}
                        </CardTitle>
                        {quiz.description && (
                          <p className="text-sm text-secondary line-clamp-2">
                            {quiz.description}
                          </p>
                        )}
                      </div>
                      {quiz.quizState === "draft" && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                          Draft
                        </span>
                      )}
                    </div>
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
                        <Eye className="w-4 h-4 text-accent" />
                        <span className="font-medium">{quiz.questionIds.length} questions</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link href={`/quiz/${quiz.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          View
                        </Button>
                      </Link>

                      <Link href={`/quiz/${quiz.id}/edit`}>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Edit className="w-3 h-3" />
                          Edit
                        </Button>
                      </Link>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleQuizDraft(quiz.id, quiz.quizState)}
                        className="flex items-center gap-1"
                      >
                        {quiz.quizState === "draft" ? "Publish" : "Save as Draft"}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleDeleteQuiz(quiz.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Collections Tab */}
      {activeTab === "collections" && (
        <>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-4 h-4" />
              <Input
                placeholder="Search collections..."
                value={collectionSearchQuery}
                onChange={(e) => setCollectionSearchQuery(e.target.value)}
                className="pl-10 input-modern"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={collectionFilterType === "all" ? "default" : "outline"}
                onClick={() => setCollectionFilterType("all")}
                size="sm"
              >
                All ({collections.length})
              </Button>
              <Button
                variant={collectionFilterType === "public" ? "default" : "outline"}
                onClick={() => setCollectionFilterType("public")}
                size="sm"
              >
                Public ({collections.filter(c => c.isPublic).length})
              </Button>
              <Button
                variant={collectionFilterType === "private" ? "default" : "outline"}
                onClick={() => setCollectionFilterType("private")}
                size="sm"
              >
                Private ({collections.filter(c => !c.isPublic).length})
              </Button>
            </div>
          </div>

          {/* Collections Grid */}
          {filteredCollections.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">
                {collectionSearchQuery ? "No collections found" : "No collections yet"}
              </h3>
              <p className="text-secondary mb-6">
                {collectionSearchQuery 
                  ? "Try adjusting your search terms" 
                  : "Create your first collection to organize your quizzes"
                }
              </p>
              {!collectionSearchQuery && (
                <Link href="/new/collection">
                  <Button className="btn-primary">Create Collection</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCollections.map((collection) => (
                <Card key={collection.id} className="card-modern hover:scale-105 transform transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-primary mb-1">
                          {collection.name}
                        </CardTitle>
                        {collection.description && (
                          <p className="text-sm text-secondary line-clamp-2">
                            {collection.description}
                          </p>
                        )}
                      </div>
                      {!collection.isPublic && (
                        <span className="bg-slate-200 text-slate-700 text-xs px-2 py-1 rounded">
                          Private
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-secondary mb-4">
                      <div className="flex items-center gap-1">
                        <FolderOpen className="w-4 h-4 text-accent" />
                        <span className="font-medium">{collection.quizIds.length} quizzes</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link href={`/collection/${collection.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full flex items-center gap-1">
                          <FolderOpen className="w-3 h-3" />
                          View
                        </Button>
                      </Link>

                      <Link href={`/collection/${collection.id}/edit`}>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Edit className="w-3 h-3" />
                          Edit
                        </Button>
                      </Link>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleCollectionPublic(collection.id, collection.isPublic)}
                        className="flex items-center gap-1"
                      >
                        {collection.isPublic ? "Make Private" : "Make Public"}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleDeleteCollection(collection.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

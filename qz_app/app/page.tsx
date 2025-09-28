"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Star, Users, Eye } from "lucide-react";
import { Quiz } from "@/types/quiz";

interface SearchResult {
  quizzes: Quiz[];
  total: number;
  page: number;
  pageSize: number;
}

function QuizCard({ quiz }: { quiz: Quiz }) {
  return (
    <Link href={`/quiz/${quiz.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle className="text-lg">{quiz.topic}</CardTitle>
          {quiz.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{quiz.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {quiz.rating !== undefined && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{quiz.rating.toFixed(1)}</span>
              </div>
            )}
            {quiz.attempts !== undefined && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{quiz.attempts}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{quiz.questionIds.length} questions</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [quizIdInput, setQuizIdInput] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [recommendedQuizzes, setRecommendedQuizzes] = useState<Quiz[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Load recommended quizzes on component mount
  useEffect(() => {
    const loadRecommendedQuizzes = async () => {
      try {
        const response = await fetch("/api/quiz/recommendations?limit=6");
        const data = await response.json();
        setRecommendedQuizzes(data.quizzes || []);
      } catch (error) {
        console.error("Failed to load recommended quizzes:", error);
      }
    };

    loadRecommendedQuizzes();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`/api/quiz/search?q=${encodeURIComponent(searchQuery)}&page=1&pageSize=10`);
      const data = await response.json();
      setSearchResults(data);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuizIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quizIdInput.trim()) {
      window.location.href = `/quiz/${quizIdInput.trim()}`;
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
    setShowSearchResults(false);
  };

  return (
    <div className="container relative mx-auto flex flex-col items-center justify-center min-h-screen gap-6 px-4">
      <div className="text-center">
        <h1 className="text-3xl sm:text-5xl font-bold py-6">Welcome to &quot;Quiz My Brain&quot;</h1>
        <p className="text-lg text-gray-600 mb-8">Discover, create, and share amazing quizzes</p>
      </div>

      {/* Search Section */}
      <div className="w-full max-w-2xl space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search quizzes by keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={isSearching || !searchQuery.trim()}>
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </form>

        <form onSubmit={handleQuizIdSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter Quiz ID to go directly..."
            value={quizIdInput}
            onChange={(e) => setQuizIdInput(e.target.value)}
          />
          <Button type="submit" disabled={!quizIdInput.trim()}>
            Go to Quiz
          </Button>
        </form>
      </div>

      {/* Search Results */}
      {showSearchResults && searchResults && (
        <div className="w-full max-w-4xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">
              Search Results ({searchResults.total} found)
            </h2>
            <Button variant="outline" onClick={clearSearch}>
              Clear Search
            </Button>
          </div>
          {searchResults.quizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.quizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No quizzes found matching your search.</p>
            </div>
          )}
        </div>
      )}

      {/* Recommended Quizzes */}
      {!showSearchResults && recommendedQuizzes.length > 0 && (
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-semibold mb-4">Recommended Quizzes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

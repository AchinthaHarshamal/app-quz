"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Star, Users, Eye, Tag, Shuffle } from "lucide-react";
import Link from "next/link";
import { Quiz } from "@/types/quiz";

function QuizCard({ quiz }: { quiz: Quiz }) {
  return (
    <Link href={`/quiz/${quiz.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer border-light-gray hover:border-orange">
        <CardHeader>
          <CardTitle className="text-lg text-dark-blue">{quiz.topic}</CardTitle>
          {quiz.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{quiz.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {quiz.rating !== undefined && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-orange text-orange" />
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

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Popular tags for quick selection
  const popularTags = ['science', 'history', 'math', 'programming', 'general', 'trivia', 'geography', 'literature'];

  // Load random quizzes on component mount
  useEffect(() => {
    loadRandomQuizzes();
  }, []);

  // Load random/recommended quizzes
  const loadRandomQuizzes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/quiz/recommendations?limit=20');
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data.quizzes || []);
        setShowSearchResults(false);
      } else {
        console.error('Failed to load quizzes');
        setQuizzes([]);
      }
    } catch (error) {
      console.error('Error loading quizzes:', error);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`/api/quiz/search?q=${encodeURIComponent(searchQuery)}&page=1&pageSize=20`);
      const data = await response.json();
      setQuizzes(data.quizzes || []);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle tag selection - populate search bar
  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    // Automatically trigger search
    setIsSearching(true);
    fetch(`/api/quiz/search?q=${encodeURIComponent(tag)}&page=1&pageSize=20`)
      .then(response => response.json())
      .then(data => {
        setQuizzes(data.quizzes || []);
        setShowSearchResults(true);
      })
      .catch(error => {
        console.error('Search failed:', error);
      })
      .finally(() => {
        setIsSearching(false);
      });
  };

  // Clear search and return to random quizzes
  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
    loadRandomQuizzes();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-blue mb-2">Quiz Explorer</h1>
        <p className="text-muted-foreground">
          {showSearchResults 
            ? `Search results for: "${searchQuery}"`
            : "Discover random quizzes"
          }
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search quizzes by keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-light-gray focus:border-orange focus:ring-orange"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isSearching || !searchQuery.trim()} 
            className="bg-orange hover:bg-orange/80 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </form>

        {/* Popular Tags */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Popular tags:</h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="flex items-center gap-1 px-3 py-1 bg-orange/10 text-orange hover:bg-orange hover:text-white rounded-lg transition-colors text-sm font-medium border border-orange/20"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clear Search Button */}
      {showSearchResults && (
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={clearSearch}
            className="border-orange text-orange hover:bg-orange hover:text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          >
            Clear Search
          </Button>
        </div>
      )}

      {/* Quiz Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-light-gray rounded w-3/4"></div>
                <div className="h-3 bg-light-gray rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-light-gray rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : quizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Shuffle className="w-12 h-12 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-dark-blue">No quizzes found</h3>
            <p className="text-muted-foreground max-w-md">
              {showSearchResults 
                ? "No quizzes match your search criteria. Try different keywords or browse random quizzes."
                : "No quizzes are available at the moment. Check back later!"
              }
            </p>
            {showSearchResults && (
              <Button
                onClick={clearSearch}
                className="bg-orange hover:bg-orange/90 text-white"
              >
                Browse Random Quizzes
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

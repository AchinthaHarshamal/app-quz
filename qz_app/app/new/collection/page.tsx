"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, FolderPlus } from "lucide-react";
import Link from "next/link";

interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export default function CreateCollectionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Collection name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Collection name must be at least 3 characters";
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Collection name must be less than 100 characters";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!session?.user || !(session.user as SessionUser).id) {
      alert("You must be signed in to create a collection");
      return;
    }

    setIsLoading(true);

    try {
      const collectionData = {
        id: `collection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        authorId: (session.user as SessionUser).id,
        quizIds: [],
        isPublic: formData.isPublic,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const response = await fetch("/api/collection/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(collectionData),
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/collection/${result.collection.id}`);
      } else {
        const errorData = await response.json();
        alert(`Failed to create collection: ${errorData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error creating collection:", error);
      alert("Failed to create collection. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">Create Collection</h1>
          <p className="text-secondary mb-6">Please sign in to create a collection.</p>
          <Link href="/auth/login">
            <Button className="btn-primary">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/my-dashboard">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-primary">Create Collection</h1>
          <p className="text-secondary">Organize your quizzes into collections</p>
        </div>
      </div>

      {/* Form */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-accent" />
            Collection Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Collection Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-primary">
                Collection Name *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter collection name..."
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`input-modern ${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
              <p className="text-xs text-secondary">
                Choose a descriptive name for your collection ({formData.name.length}/100 characters)
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-primary">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe what this collection is about..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className={`input-modern resize-none ${errors.description ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                rows={4}
                disabled={isLoading}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
              <p className="text-xs text-secondary">
                Optional description to help others understand your collection ({formData.description.length}/500 characters)
              </p>
            </div>

            {/* Privacy Setting */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-primary">
                Privacy Setting
              </Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => handleInputChange("isPublic", checked as boolean)}
                  disabled={isLoading}
                />
                <Label htmlFor="isPublic" className="text-sm text-secondary cursor-pointer">
                  Make this collection public
                </Label>
              </div>
              <p className="text-xs text-secondary">
                {formData.isPublic 
                  ? "Public collections can be discovered and viewed by other users"
                  : "Private collections are only visible to you"
                }
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex items-center gap-2 flex-1"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Create Collection
                  </>
                )}
              </Button>
              <Link href="/my-dashboard" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Help Text */}
      <Card className="card-modern mt-6">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-primary mb-2">About Collections</h3>
          <ul className="text-sm text-secondary space-y-1">
            <li>• Collections help you organize related quizzes together</li>
            <li>• You can add quizzes to collections after creating them</li>
            <li>• Public collections can be discovered by other users</li>
            <li>• You can always edit collection details later</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

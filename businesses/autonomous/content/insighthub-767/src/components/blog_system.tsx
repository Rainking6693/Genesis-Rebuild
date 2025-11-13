// src/components/BlogSystem.tsx
import React, { useState, useEffect } from 'react';
import { fetchArticles, createArticle, updateArticle, deleteArticle } from '../api/articleService'; // Assuming an article service exists

interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
}

interface BlogSystemProps {
  // Add any props needed for the blog system
}

const BlogSystem: React.FC<BlogSystemProps> = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const fetchedArticles = await fetchArticles();
        setArticles(fetchedArticles);
      } catch (err: any) { // Explicitly type 'err' as 'any' to avoid TypeScript errors
        setError(err.message || 'Failed to load articles.');
        console.error("Error fetching articles:", err); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const handleCreateArticle = async (newArticle: Omit<Article, 'id' | 'createdAt'>) => {
    try {
      const createdArticle = await createArticle(newArticle);
      setArticles([...articles, createdArticle]);
    } catch (err: any) {
      setError(err.message || 'Failed to create article.');
      console.error("Error creating article:", err);
    }
  };

  const handleUpdateArticle = async (articleId: string, updatedArticle: Partial<Article>) => {
    try {
      await updateArticle(articleId, updatedArticle);
      // Optimistically update the state
      setArticles(articles.map(article =>
        article.id === articleId ? { ...article, ...updatedArticle } : article
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to update article.');
      console.error("Error updating article:", err);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    try {
      await deleteArticle(articleId);
      setArticles(articles.filter(article => article.id !== articleId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete article.');
      console.error("Error deleting article:", err);
    }
  };

  if (loading) {
    return <div>Loading articles...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Blog System</h1>
      {/* Article List */}
      <ul>
        {articles.map(article => (
          <li key={article.id}>
            {article.title} - {article.author}
          </li>
        ))}
      </ul>

      {/* Create Article Form (Example) */}
      <h2>Create New Article</h2>
      <button onClick={() => handleCreateArticle({ title: "New Article", content: "...", author: "Test Author" })}>
          Create Article
      </button>

      {/* TODO: Implement Update and Delete functionality */}
    </div>
  );
};

export default BlogSystem;
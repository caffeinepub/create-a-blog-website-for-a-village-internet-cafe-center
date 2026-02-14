import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from '@tanstack/react-router';
import AdminGate from '../../components/auth/AdminGate';
import { useAdminPosts, useCreatePost, useUpdatePost } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPostEditorPage() {
  const params = useParams({ strict: false });
  const navigate = useNavigate();
  const { data: posts } = useAdminPosts();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();

  const postId = params.id ? BigInt(params.id) : null;
  const isEditing = !!postId;
  const existingPost = posts?.find((p) => p.id === postId);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');

  useEffect(() => {
    if (isEditing && existingPost) {
      setTitle(existingPost.title);
      setSlug(existingPost.slug);
      setContent(existingPost.content);
      setCoverImageUrl(existingPost.coverImageUrl || '');
    }
  }, [isEditing, existingPost]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isEditing) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !slug.trim() || !content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (isEditing && postId) {
        await updatePost.mutateAsync({
          postId,
          title: title.trim(),
          slug: slug.trim(),
          content: content.trim(),
          coverImageUrl: coverImageUrl.trim() || null,
        });
        toast.success('Post updated successfully!');
      } else {
        await createPost.mutateAsync({
          title: title.trim(),
          slug: slug.trim(),
          content: content.trim(),
          coverImageUrl: coverImageUrl.trim() || null,
        });
        toast.success('Post created successfully!');
      }
      navigate({ to: '/admin/posts' });
    } catch (error) {
      console.error('Failed to save post:', error);
      toast.error('Failed to save post. Please try again.');
    }
  };

  const isPending = createPost.isPending || updatePost.isPending;

  return (
    <AdminGate>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <Link to="/admin/posts">
            <Button variant="ghost" className="gap-2 mb-8">
              <ArrowLeft className="h-4 w-4" />
              Back to Posts
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">
                {isEditing ? 'Edit Post' : 'Create New Post'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter post title"
                    disabled={isPending}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="post-url-slug"
                    disabled={isPending}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    URL-friendly version of the title
                  </p>
                </div>

                <div>
                  <Label htmlFor="coverImageUrl">Cover Image URL (optional)</Label>
                  <Input
                    id="coverImageUrl"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    disabled={isPending}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your post content here..."
                    disabled={isPending}
                    className="mt-2 min-h-[300px]"
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={isPending} className="gap-2">
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        {isEditing ? 'Update Post' : 'Create Post'}
                      </>
                    )}
                  </Button>
                  <Link to="/admin/posts">
                    <Button type="button" variant="outline" disabled={isPending}>
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminGate>
  );
}

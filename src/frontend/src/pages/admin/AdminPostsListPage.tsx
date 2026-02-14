import { Link } from '@tanstack/react-router';
import AdminGate from '../../components/auth/AdminGate';
import { useAdminPosts, useTogglePublishStatus } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusCircle, Edit, Eye, EyeOff, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPostsListPage() {
  const { data: posts, isLoading } = useAdminPosts();
  const togglePublish = useTogglePublishStatus();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleTogglePublish = async (postId: bigint, currentStatus: boolean) => {
    try {
      await togglePublish.mutateAsync(postId);
      toast.success(currentStatus ? 'Post unpublished' : 'Post published');
    } catch (error) {
      console.error('Failed to toggle publish status:', error);
      toast.error('Failed to update post status');
    }
  };

  if (isLoading) {
    return (
      <AdminGate>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <Skeleton className="h-12 w-64 mb-8" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </div>
        </div>
      </AdminGate>
    );
  }

  return (
    <AdminGate>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Manage Posts</h1>
            <Link to="/admin/posts/new">
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                New Post
              </Button>
            </Link>
          </div>

          {posts && posts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No posts yet. Create your first post!</p>
                <Link to="/admin/posts/new">
                  <Button>Create Post</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {posts?.map((post) => (
                <Card key={Number(post.id)}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-xl">{post.title}</CardTitle>
                          <Badge variant={post.isPublished ? 'default' : 'secondary'}>
                            {post.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Created {formatDate(post.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link to="/admin/posts/$id/edit" params={{ id: String(post.id) }}>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleTogglePublish(post.id, post.isPublished)}
                          disabled={togglePublish.isPending}
                        >
                          {post.isPublished ? (
                            <>
                              <EyeOff className="h-4 w-4" />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4" />
                              Publish
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminGate>
  );
}

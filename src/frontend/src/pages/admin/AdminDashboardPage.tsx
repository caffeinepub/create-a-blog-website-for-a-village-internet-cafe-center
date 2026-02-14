import { Link } from '@tanstack/react-router';
import AdminGate from '../../components/auth/AdminGate';
import { useGetCallerUserProfile, useAdminPosts } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, PlusCircle, Settings } from 'lucide-react';

export default function AdminDashboardPage() {
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: posts } = useAdminPosts();

  const publishedCount = posts?.filter((p) => p.isPublished).length || 0;
  const draftCount = posts?.filter((p) => !p.isPublished).length || 0;

  return (
    <AdminGate>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Welcome back, {userProfile?.name || 'Admin'}!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{posts?.length || 0}</CardTitle>
                <CardDescription>Total Posts</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{publishedCount}</CardTitle>
                <CardDescription>Published</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{draftCount}</CardTitle>
                <CardDescription>Drafts</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Manage Posts</CardTitle>
                <CardDescription>
                  View, edit, and manage all your blog posts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/admin/posts">
                  <Button className="w-full">View All Posts</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <PlusCircle className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Create New Post</CardTitle>
                <CardDescription>
                  Write and publish a new blog post
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/admin/posts/new">
                  <Button className="w-full">Create Post</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminGate>
  );
}

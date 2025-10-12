import { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Heart, MessageCircle, Share2, Plus, TrendingUp, Clock } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface CommunityFeedProps {
  onBack: () => void;
}

export function CommunityFeed({ onBack }: CommunityFeedProps) {
  const { posts, likePost, addComment, user } = useAppContext();
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [filter, setFilter] = useState('all');
  const [showNewPost, setShowNewPost] = useState(false);

  const filteredPosts = filter === 'all'
    ? posts
    : posts.filter(post => post.menuType === filter);

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (filter === 'popular') {
      return b.likes - a.likes;
    }
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  const handleAddComment = (postId: string) => {
    if (!commentText.trim() || !user) return;
    
    addComment(postId, {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      text: commentText,
      timestamp: new Date(),
    });
    setCommentText('');
  };

  const currentPost = posts.find(p => p.id === selectedPost);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>← กลับ</Button>
          <h2>ชุมชน</h2>
          <Button size="icon" onClick={() => setShowNewPost(true)}>
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Filter Tabs */}
        <Card className="p-2 bg-white">
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="w-full grid grid-cols-5">
              <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
              <TabsTrigger value="main">จานหลัก</TabsTrigger>
              <TabsTrigger value="appetizer">ของทานเล่น</TabsTrigger>
          
              <TabsTrigger value="popular">
                <TrendingUp className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </Card>

        {/* Posts */}
        {sortedPosts.map(post => (
          <Card key={post.id} className="overflow-hidden bg-white">
            {/* Post Header */}
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-orange-500 flex items-center justify-center text-white">
                {post.userName[0]}
              </div>
              <div className="flex-1">
                <p>{post.userName}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(post.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Post Image */}
            <div className="aspect-square relative">
              <ImageWithFallback
                src={post.image}
                alt="Post"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Post Actions */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => likePost(post.id)}
                  className="flex items-center gap-1 hover:text-red-500 transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  <span>{post.likes}</span>
                </button>
                <button
                  onClick={() => setSelectedPost(post.id)}
                  className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{post.comments.length}</span>
                </button>
                <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Caption */}
              <div>
                <p>
                  <span>{post.userName}</span>{' '}
                  <span className="text-muted-foreground">{post.caption}</span>
                </p>
              </div>

              {/* View Comments */}
              {post.comments.length > 0 && (
                <button
                  onClick={() => setSelectedPost(post.id)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  ดูความคิดเห็นทั้งหมด {post.comments.length} รายการ
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Comments Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>ความคิดเห็น</DialogTitle>
          </DialogHeader>
          
          {currentPost && (
            <div className="flex-1 overflow-y-auto space-y-4">
              {/* Original Post */}
              <div className="flex items-start gap-3 pb-4 border-b">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-orange-500 flex items-center justify-center text-white flex-shrink-0">
                  {currentPost.userName[0]}
                </div>
                <div className="flex-1">
                  <p>{currentPost.userName}</p>
                  <p className="text-sm text-muted-foreground">{currentPost.caption}</p>
                </div>
              </div>

              {/* Comments List */}
              {currentPost.comments.map(comment => (
                <div key={comment.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center text-white flex-shrink-0 text-sm">
                    {comment.userName[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span>{comment.userName}</span>{' '}
                      <span className="text-muted-foreground">{comment.text}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(comment.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment */}
          <div className="flex gap-2 pt-4 border-t">
            <Input
              placeholder="เพิ่มความคิดเห็น..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && selectedPost && handleAddComment(selectedPost)}
            />
            <Button onClick={() => selectedPost && handleAddComment(selectedPost)}>
              โพสต์
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Post Dialog */}
      <Dialog open={showNewPost} onOpenChange={setShowNewPost}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>สร้างโพสต์ใหม่</DialogTitle>
            <DialogDescription>
              แบ่งปันประสบการณ์อาหารของคุณกับชุมชน!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">อัปโหลดรูปภาพ</p>
            </div>
            <Textarea placeholder="เขียนคำบรรยาย..." rows={3} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewPost(false)}>
              ยกเลิก
            </Button>
            <Button onClick={() => setShowNewPost(false)}>
              โพสต์
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
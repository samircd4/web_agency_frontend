'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Calendar, User, ArrowLeft, Share2, Bookmark, 
  Copy, Check, Terminal, Quote, ArrowRight, Clock, ShieldCheck,
  Eye, Heart, MessageSquare, Send, MessageCircle, Reply, CornerDownRight,
  ChevronDown, ChevronUp
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { api, isAuthenticated, getFullAvatarUrl } from '@/lib/api';
import ScrollReveal from '@/components/ScrollReveal';
import ShareModal from '@/components/ShareModal';
import Link from 'next/link';

function CodeBlock({ children, className }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : 'code';
  const codeString = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderHighlightedCode = (code) => {
    const lines = code.split('\n');
    return lines.map((line, lineIdx) => {
      const tokens = line.split(/(\s+|".*?"|'.*?'|#.*|\/\/.*|[(),:[\]{}])/);
      return (
        <div key={lineIdx} className="table-row hover:bg-white/[0.02] transition-colors">
          <span className="table-cell text-right pr-4 select-none text-slate-600 text-xs font-mono w-8 py-0.5 border-r border-white/5">
            {lineIdx + 1}
          </span>
          <span className="table-cell font-mono text-xs whitespace-pre pl-4 py-0.5">
            {line.length === 0 ? '\n' : tokens.map((token, tokIdx) => {
              if (/^(def|class|async|await|import|from|return|with|try|except|const|let|var|function|if|else|for|while|in|as|is|not|and|or)$/.test(token)) {
                return <span key={tokIdx} className="text-brand-teal font-bold">{token}</span>;
              }
              if (/^(self|True|False|None|true|false|null|undefined|\d+)$/.test(token)) {
                return <span key={tokIdx} className="text-purple-400 font-semibold">{token}</span>;
              }
              if (/^(["'].*?["'])/.test(token)) {
                return <span key={tokIdx} className="text-emerald-300">{token}</span>;
              }
              if (/^(#.*|\/\/.*)/.test(token)) {
                return <span key={tokIdx} className="text-slate-500 italic">{token}</span>;
              }
              if (/^(@\w+)/.test(token)) {
                return <span key={tokIdx} className="text-amber-400 font-bold">{token}</span>;
              }
              if (/^([A-Z]\w+)/.test(token)) {
                return <span key={tokIdx} className="text-sky-300 font-bold">{token}</span>;
              }
              return <span key={tokIdx} className="text-slate-200">{token}</span>;
            })}
          </span>
        </div>
      );
    });
  };

  return (
    <div className="my-8 rounded-2xl overflow-hidden border border-white/10 bg-[#090d16] shadow-2xl group">
      {/* IDE Topbar */}
      <div className="px-4 py-3 bg-slate-900/80 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          <span className="ml-2 px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-brand-teal">
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
        >
          {copied ? (
            <>
              <Check size={12} className="text-brand-teal" />
              <span className="text-brand-teal">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content Area */}
      <div className="p-4 sm:p-6 overflow-x-auto font-mono leading-relaxed text-xs">
        <div className="table w-full">
          {renderHighlightedCode(codeString)}
        </div>
      </div>
    </div>
  );
}

// Single Comment Component with Avatar & Collapse/Expand Nested Replies
function CommentItem({ comment, slug, loggedInUser, onReplyAdded, depth = 0 }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [replyData, setReplyData] = useState({
    author_name: loggedInUser?.name || '',
    author_email: loggedInUser?.email || '',
    content: ''
  });
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    if (loggedInUser) {
      setReplyData(prev => ({
        ...prev,
        author_name: loggedInUser.name || prev.author_name,
        author_email: loggedInUser.email || prev.author_email
      }));
    }
  }, [loggedInUser]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyData.author_name.trim() || !replyData.content.trim()) return;

    setSubmittingReply(true);
    try {
      const created = await api.createBlogComment(slug, {
        ...replyData,
        parent: comment.id
      });
      onReplyAdded(comment.id, created);
      setReplyData(prev => ({ ...prev, content: '' }));
      setShowReplyForm(false);
      setShowReplies(true);
    } catch (err) {
      console.error("Failed to post reply:", err);
    } finally {
      setSubmittingReply(false);
    }
  };

  const commentDate = comment.created_at
    ? new Date(comment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Just now';

  const avatarUrl = comment.author_avatar_url
    ? getFullAvatarUrl(comment.author_avatar_url)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author_name || 'Engineer')}&background=0d9488&color=fff&bold=true`;

  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className={`space-y-3 ${depth > 0 ? 'ml-4 sm:ml-8 mt-4 pl-4 border-l-2 border-brand-teal/20' : ''}`}>
      <div className="p-6 rounded-2xl glass border border-white/5 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={avatarUrl}
              alt={comment.author_name}
              className="w-10 h-10 rounded-xl object-cover border border-white/10 shadow-md"
            />
            <div>
              <div className="text-white font-bold text-sm flex items-center gap-1.5">
                {comment.author_name}
                {depth > 0 && <span className="text-[9px] font-black uppercase text-brand-teal/80 bg-brand-teal/10 px-2 py-0.5 rounded">Reply</span>}
              </div>
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{commentDate}</div>
            </div>
          </div>

          {/* Reply Action Button */}
          {depth < 3 && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-brand-teal/10 border border-white/5 hover:border-brand-teal/30 text-slate-400 hover:text-brand-teal text-[10px] font-black uppercase tracking-widest transition-all"
            >
              <Reply size={12} />
              <span>Reply</span>
            </button>
          )}
        </div>

        <p className="text-slate-300 text-sm leading-relaxed font-normal pl-13">
          {comment.content}
        </p>

        {/* Collapse / Expand Toggle Button for Nested Replies */}
        {hasReplies && (
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-brand-teal text-[10px] font-black uppercase tracking-widest transition-all"
            >
              {showReplies ? <ChevronUp size={12} className="text-brand-teal" /> : <ChevronDown size={12} className="text-brand-teal" />}
              <span>{showReplies ? 'Hide Replies' : `Show ${comment.replies.length} ${comment.replies.length === 1 ? 'Reply' : 'Replies'}`}</span>
            </button>
          </div>
        )}

        {/* Inline Reply Form */}
        {showReplyForm && (
          <form onSubmit={handleReplySubmit} className="mt-4 p-4 rounded-2xl bg-slate-900/80 border border-brand-teal/30 space-y-3">
            <div className="flex items-center gap-2 text-brand-teal font-black text-[10px] uppercase tracking-widest">
              <CornerDownRight size={12} /> Replying to {comment.author_name}
            </div>

            {!loggedInUser && (
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your Name *"
                  value={replyData.author_name}
                  onChange={(e) => setReplyData({ ...replyData, author_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-900/60 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-teal font-bold"
                />
                <input
                  type="email"
                  placeholder="Email (Optional)"
                  value={replyData.author_email}
                  onChange={(e) => setReplyData({ ...replyData, author_email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface-900/60 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-teal font-bold"
                />
              </div>
            )}

            <textarea
              required
              rows={2}
              placeholder="Write your reply..."
              value={replyData.content}
              onChange={(e) => setReplyData({ ...replyData, content: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-surface-900/60 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-teal font-medium"
            />

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submittingReply}
                className="px-4 py-2 bg-brand-teal text-slate-950 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-glow-teal hover:scale-105 transition-all disabled:opacity-50"
              >
                {submittingReply ? 'Sending...' : 'Post Reply'}
              </button>
              <button
                type="button"
                onClick={() => setShowReplyForm(false)}
                className="px-4 py-2 bg-white/5 text-slate-400 rounded-xl font-black uppercase tracking-widest text-[10px] hover:text-white transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Render Nested Replies */}
      {showReplies && hasReplies && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              slug={slug}
              loggedInUser={loggedInUser}
              onReplyAdded={onReplyAdded}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BlogPostDetail() {
  const { id: slug } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [copiedToast, setCopiedToast] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Likes & Comments State
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [newComment, setNewComment] = useState({ author_name: '', author_email: '', content: '' });
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Load User Profile if authenticated
  useEffect(() => {
    async function loadUserProfile() {
      if (isAuthenticated()) {
        try {
          const user = await api.getMe();
          if (user) {
            const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || '';
            const userAvatar = user.avatar
              ? getFullAvatarUrl(user.avatar)
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0d9488&color=fff&bold=true`;

            setLoggedInUser({
              name: fullName,
              email: user.email || '',
              username: user.username,
              avatar: userAvatar
            });
            setNewComment(prev => ({
              ...prev,
              author_name: fullName,
              author_email: user.email || ''
            }));
          }
        } catch (err) {
          console.error("Failed to load user profile:", err);
        }
      }
    }
    loadUserProfile();
  }, []);

  useEffect(() => {
    async function loadPostAndComments() {
      try {
        const data = await api.getBlogPostDetail(slug);
        setPost(data);
        setLikesCount(data.likes_count || 0);

        if (typeof window !== 'undefined') {
          const bookmarkedList = JSON.parse(localStorage.getItem('drpython_bookmarked_posts') || '[]');
          setIsBookmarked(bookmarkedList.includes(data.id || slug));

          const likedList = JSON.parse(localStorage.getItem('drpython_liked_posts') || '[]');
          setIsLiked(likedList.includes(data.id || slug));
        }

        // Fetch Comments
        try {
          const commentList = await api.getBlogComments(slug);
          const results = commentList.results || commentList || [];
          setComments(results);
        } catch (cErr) {
          console.error("Failed to load comments:", cErr);
        }
      } catch (err) {
        console.error('Failed to load blog post:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    if (slug) {
      loadPostAndComments();
    }
  }, [slug]);

  // Recursively calculate total comments count (top-level + replies)
  const getTotalCommentsCount = (list) => {
    let count = 0;
    list.forEach(c => {
      count += 1;
      if (c.replies && c.replies.length > 0) {
        count += getTotalCommentsCount(c.replies);
      }
    });
    return count;
  };

  const totalCommentsCount = getTotalCommentsCount(comments);

  const handleShare = () => {
    setIsShareOpen(true);
  };

  const toggleBookmark = () => {
    if (!post || typeof window === 'undefined') return;
    const targetId = post.id || slug;
    const saved = JSON.parse(localStorage.getItem('drpython_bookmarked_posts') || '[]');
    let updated;
    if (saved.includes(targetId)) {
      updated = saved.filter(id => id !== targetId);
      setIsBookmarked(false);
    } else {
      updated = [...saved, targetId];
      setIsBookmarked(true);
    }
    localStorage.setItem('drpython_bookmarked_posts', JSON.stringify(updated));
  };

  const handleLike = async () => {
    if (!post) return;
    const targetId = post.id || slug;
    const nextState = !isLiked;
    setIsLiked(nextState);
    setLikesCount(prev => nextState ? prev + 1 : Math.max(0, prev - 1));

    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem('drpython_liked_posts') || '[]');
      let updated;
      if (nextState) {
        updated = [...saved, targetId];
      } else {
        updated = saved.filter(id => id !== targetId);
      }
      localStorage.setItem('drpython_liked_posts', JSON.stringify(updated));
    }

    try {
      await api.likeBlogPost(targetId, nextState ? 'like' : 'unlike');
    } catch (err) {
      console.error("Failed to sync like with backend:", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.author_name.trim() || !newComment.content.trim()) return;

    setSubmittingComment(true);
    try {
      const created = await api.createBlogComment(slug, newComment);
      setComments(prev => [created, ...prev]);
      setNewComment(prev => ({ ...prev, content: '' }));
      setCommentSuccess(true);
      setTimeout(() => setCommentSuccess(false), 3500);
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleReplyAdded = (parentId, newReply) => {
    const addReplyRecursive = (list) => {
      return list.map(c => {
        if (c.id === parentId) {
          return { ...c, replies: [...(c.replies || []), newReply] };
        }
        if (c.replies && c.replies.length > 0) {
          return { ...c, replies: addReplyRecursive(c.replies) };
        }
        return c;
      });
    };
    setComments(prev => addReplyRecursive(prev));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        <div className="w-8 h-8 border-4 border-brand-teal/30 border-t-brand-teal rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4 tracking-tight">Technical Briefing Not Found</h1>
          <button onClick={() => router.push('/blog')} className="text-brand-teal font-bold hover:underline uppercase tracking-widest text-xs">
            Return to Journal
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = post.published_at 
    ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recent';
  const category = post.tags?.[0]?.name || 'Engineering Briefing';
  const image = post.featured_image || post.cover_image_url || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80&fit=crop';
  const readTime = post.read_time_minutes || 4;

  const authorAvatar = post.author_avatar_url
    ? getFullAvatarUrl(post.author_avatar_url)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author_username || 'Dr. Python')}&background=0d9488&color=fff&bold=true`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.content_markdown?.slice(0, 160) || post.title,
    "image": [image],
    "datePublished": post.published_at || post.created_at,
    "author": {
      "@type": "Person",
      "name": post.author_username || "Dr. Python"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Dr. Python Solutions",
      "logo": {
        "@type": "ImageObject",
        "url": "https://drpythonsolutions.com/logo/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://drpythonsolutions.com/blog/${post.slug || post.id}`
    }
  };

  return (
    <main className="pt-32 pb-24 bg-background min-h-screen">
      {/* Inject SEO JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article className="container mx-auto px-4">
        
        {/* Navigation & Action Buttons */}
        <div className="max-w-4xl mx-auto mb-12 flex items-center justify-between">
          <button 
            onClick={() => router.push('/blog')}
            className="flex items-center gap-3 text-slate-500 hover:text-white transition-colors font-black uppercase tracking-widest text-[10px] group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Journal
          </button>
          
          <div className="flex gap-3 relative">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all border ${
                isLiked 
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]' 
                  : 'bg-white/5 text-slate-400 hover:text-white border-white/5 hover:border-rose-500/40'
              }`}
              title={isLiked ? "Unlike Briefing" : "Like Briefing"}
            >
              <Heart size={18} className={isLiked ? "fill-current" : ""} />
              <span className="text-xs font-black">{likesCount}</span>
            </button>

            <button 
              onClick={handleShare}
              className="p-3 rounded-2xl bg-white/5 text-slate-400 hover:text-white transition-all border border-white/5 hover:border-brand-teal/40"
              title="Share Article"
            >
              <Share2 size={18} className="text-brand-teal" />
            </button>
            
            <button 
              onClick={toggleBookmark}
              className={`p-3 rounded-2xl transition-all border ${
                isBookmarked 
                  ? 'bg-brand-teal/20 text-brand-teal border-brand-teal/40' 
                  : 'bg-white/5 text-slate-400 hover:text-white border-white/5'
              }`}
              title={isBookmarked ? "Bookmarked" : "Bookmark Article"}
            >
              <Bookmark size={18} className={isBookmarked ? "fill-current" : ""} />
            </button>

            {copiedToast && (
              <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-brand-teal text-slate-950 font-black text-[9px] uppercase tracking-widest rounded-lg shadow-lg z-30 flex items-center gap-1.5 whitespace-nowrap">
                <Check size={12} />
                <span>Link copied to clipboard!</span>
              </div>
            )}
          </div>
        </div>

        {/* Hero Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <ScrollReveal>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-[10px] font-black uppercase tracking-widest">
                {category}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <Clock size={12} className="text-brand-teal" />
                {readTime} min read
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                <Eye size={12} className="text-brand-teal" />
                {post.views_count || 1} views
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-tight">
              {post.title}
            </h1>
            
            {/* Author Profile Bar */}
            <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-white/10 bg-white/[0.01] rounded-2xl px-6">
              <div className="flex items-center gap-3">
                <img
                  src={authorAvatar}
                  alt={post.author_username || 'Dr. Python'}
                  className="w-12 h-12 rounded-2xl object-cover border border-brand-teal/40 shadow-glow-teal"
                />
                <div>
                  <div className="text-white font-bold text-sm flex items-center gap-1.5">
                    {post.author_username || 'Dr. Python'}
                    <ShieldCheck size={14} className="text-brand-teal" />
                  </div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Lead Systems Engineer</div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-brand-teal" />
                  Published {formattedDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageCircle size={14} className="text-sky-400" />
                  {totalCommentsCount} Comments
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Cover Image Frame */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <img src={image} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          </div>
        </div>

        {/* Article Body Content */}
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-invert max-w-none text-slate-300">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-3xl font-black text-white mb-6 mt-14 first:mt-0 uppercase tracking-tight border-b border-white/10 pb-4" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-black text-white mb-4 mt-10 uppercase tracking-tight text-gradient-teal" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-black text-white mb-3 mt-8 uppercase tracking-wide" {...props} />,
                p: ({node, ...props}) => <div className="text-slate-300 text-base leading-relaxed mb-6 font-normal" {...props} />,
                pre: ({node, children, ...props}) => <div className="my-8">{children}</div>,
                ul: ({node, ...props}) => <ul className="space-y-3 mb-8 list-none pl-0" {...props} />,
                ol: ({node, ...props}) => <ol className="space-y-3 mb-8 list-decimal pl-6 text-slate-300" {...props} />,
                li: ({node, ...props}) => (
                  <li className="flex items-start gap-3 text-slate-300 text-base" {...props}>
                    <div className="w-2 h-2 rounded-full bg-brand-teal mt-2.5 flex-shrink-0 shadow-[0_0_10px_rgba(45,212,191,0.6)]" />
                    <span>{props.children}</span>
                  </li>
                ),
                // Custom Code Block component override
                code: ({node, inline, className, children, ...props}) => {
                  if (inline) {
                    return (
                      <code className="bg-brand-teal/10 text-brand-teal border border-brand-teal/20 px-2 py-0.5 rounded-md font-mono text-xs font-bold" {...props}>
                        {children}
                      </code>
                    );
                  }
                  return (
                    <CodeBlock className={className}>
                      {children}
                    </CodeBlock>
                  );
                },
                // Custom Blockquote component override
                blockquote: ({node, ...props}) => (
                  <div className="relative my-8 p-6 rounded-2xl glass border-l-4 border-brand-teal bg-gradient-to-r from-brand-teal/5 to-transparent">
                    <Quote size={24} className="text-brand-teal/40 mb-2" />
                    <blockquote className="italic text-slate-200 text-lg leading-relaxed" {...props} />
                  </div>
                ),
                // Custom Table formatting
                table: ({node, ...props}) => (
                  <div className="overflow-x-auto my-8 rounded-2xl border border-white/10">
                    <table className="w-full text-left border-collapse text-sm" {...props} />
                  </div>
                ),
                th: ({node, ...props}) => <th className="bg-white/5 p-4 text-xs font-black uppercase tracking-widest text-brand-teal border-b border-white/10" {...props} />,
                td: ({node, ...props}) => <td className="p-4 border-b border-white/5 text-slate-300 font-medium" {...props} />,
                hr: ({node, ...props}) => <hr className="border-white/10 my-12" {...props} />,
                strong: ({node, ...props}) => <strong className="text-white font-black" {...props} />,
              }}
            >
              {post.content_markdown}
            </ReactMarkdown>
          </div>

          {/* Author Biography Box */}
          <div className="mt-16 p-8 rounded-3xl glass border border-white/10 flex flex-col md:flex-row items-center gap-6">
            <img
              src={authorAvatar}
              alt={post.author_username || 'Dr. Python'}
              className="w-16 h-16 rounded-2xl object-cover border border-brand-teal/40 shadow-glow-teal flex-shrink-0"
            />
            <div>
              <h4 className="text-lg font-black text-white mb-1 uppercase tracking-tight flex items-center gap-2">
                Written by Dr. Python
                <ShieldCheck size={16} className="text-brand-teal" />
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Lead Systems Architect specializing in high-throughput backend infrastructure, asynchronous web scraping pipelines, and distributed Django ecosystems.
              </p>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-16 pt-12 border-t border-white/10">
            <div className="flex items-center gap-3 mb-8">
              <MessageSquare size={22} className="text-brand-teal" />
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                Comments ({totalCommentsCount})
              </h3>
            </div>

            {/* Main Comment Form */}
            <form onSubmit={handleCommentSubmit} className="p-8 rounded-3xl glass border border-white/10 mb-12 space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black uppercase tracking-widest text-slate-300">Leave a Comment</h4>
                {loggedInUser && (
                  <span className="px-3 py-1 rounded-full bg-brand-teal/20 border border-brand-teal/30 text-brand-teal text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    <ShieldCheck size={12} /> Logged in as {loggedInUser.name}
                  </span>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    readOnly={!!loggedInUser}
                    value={newComment.author_name}
                    onChange={(e) => !loggedInUser && setNewComment({ ...newComment, author_name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border text-xs text-white focus:outline-none transition-all font-bold ${
                      loggedInUser 
                        ? 'bg-white/5 border-brand-teal/30 text-slate-300 cursor-not-allowed' 
                        : 'bg-surface-900/60 border-white/10 focus:border-brand-teal'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="engineer@company.com"
                    readOnly={!!loggedInUser}
                    value={newComment.author_email}
                    onChange={(e) => !loggedInUser && setNewComment({ ...newComment, author_email: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border text-xs text-white focus:outline-none transition-all font-bold ${
                      loggedInUser 
                        ? 'bg-white/5 border-brand-teal/30 text-slate-300 cursor-not-allowed' 
                        : 'bg-surface-900/60 border-white/10 focus:border-brand-teal'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Comment *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share technical observations, questions, or architectural feedback..."
                  value={newComment.content}
                  onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-surface-900/60 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-teal font-medium transition-all"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={submittingComment}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-teal text-slate-950 rounded-xl font-black uppercase tracking-widest text-xs shadow-glow-teal hover:scale-105 transition-all disabled:opacity-50"
                >
                  <Send size={14} />
                  <span>{submittingComment ? 'Posting...' : 'Post Comment'}</span>
                </button>

                {commentSuccess && (
                  <span className="text-xs font-black text-brand-teal flex items-center gap-1.5">
                    <Check size={14} /> Comment posted successfully!
                  </span>
                )}
              </div>
            </form>

            {/* Comments & Threaded Replies Tree */}
            {comments.length === 0 ? (
              <div className="text-center py-12 p-8 rounded-2xl border border-dashed border-white/10 text-slate-500 uppercase font-black text-xs tracking-widest">
                No comments submitted yet. Be the first to start the conversation!
              </div>
            ) : (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    slug={slug}
                    loggedInUser={loggedInUser}
                    onReplyAdded={handleReplyAdded}
                    depth={0}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer Call to Action */}
          <div className="mt-16 p-10 rounded-3xl bg-gradient-to-br from-brand-teal/10 via-surface-900/60 to-background border border-brand-teal/30 text-center shadow-2xl">
            <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">Need Custom Automated Architecture?</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
              Our engineering team designs production-grade Python services, API gateways, and scraping infrastructure tailored to your business scale.
            </p>
            <Link 
              href="/start-project"
              className="inline-flex items-center gap-3 px-8 py-4 bg-brand-teal text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-glow-teal"
            >
              Start Project Briefing <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </article>

      {/* Professional Share Modal System */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={post.title}
        description={post.content_markdown?.slice(0, 160)}
        category={category}
        image={image}
      />
    </main>
  );
}

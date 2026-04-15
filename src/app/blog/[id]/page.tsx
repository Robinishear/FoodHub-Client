"use client";

import { metaService, BlogPost } from '@/services/metaService';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BlogDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (!params?.id) return;
        const data = await metaService.getBlogById(params.id);
        setPost(data);
      } catch {
        router.push('/blog');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [params?.id, router]);

  if (loading) {
    return <section className="min-h-screen bg-white pt-32 pb-20 px-4" />;
  }

  if (!post) {
    return null;
  }

  const publishedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString()
    : 'Recently published';

  return (
    <section className="min-h-screen bg-white pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-orange-500 transition-colors mb-8">
          <ArrowLeft size={16} /> Back to blog
        </Link>

        <img
          src={post.image}
          alt={post.title}
          className="w-full h-[420px] object-cover rounded-3xl mb-8"
        />

        <div className="space-y-4">
          <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-orange-50 text-orange-600">
            {post.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-950 leading-tight">{post.title}</h1>
          <p className="text-sm text-gray-500 font-medium">By {post.author} • {publishedDate}</p>
          <p className="text-lg text-gray-600 leading-relaxed">{post.content}</p>
        </div>
      </div>
    </section>
  );
}

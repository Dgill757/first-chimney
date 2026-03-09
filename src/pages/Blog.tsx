import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import SEO from '@/components/SEO';
import { IMAGE_ASSETS } from '@/lib/site';

export default function Blog() {
  const posts = [
    {
      id: 'how-often-should-you-sweep-your-chimney',
      title: 'How Often Should You Sweep Your Chimney?',
      excerpt: 'Understand annual maintenance intervals, warning signs, and when to schedule professional sweeping before risk increases.',
      date: 'January 12, 2026',
      author: 'First Chimney Team',
      category: 'Maintenance',
      image: IMAGE_ASSETS.chimneySweep1,
    },
    {
      id: 'the-dangers-of-creosote-buildup',
      title: 'The Hidden Dangers of Creosote Buildup',
      excerpt: 'Creosote is combustible and often invisible to homeowners. Learn how it forms and how to reduce chimney fire risk.',
      date: 'January 28, 2026',
      author: 'First Chimney Team',
      category: 'Safety',
      image: IMAGE_ASSETS.inspectionAlt,
    },
    {
      id: 'what-is-a-level-2-chimney-inspection',
      title: 'What Is a Level 2 Chimney Inspection?',
      excerpt: 'See why camera-assisted inspections are critical for real estate transactions, appliance changes, and leak investigations.',
      date: 'February 11, 2026',
      author: 'First Chimney Team',
      category: 'Inspections',
      image: IMAGE_ASSETS.inspection,
    },
  ];

  return (
    <div className="pt-24 pb-16">
      <SEO
        title="Chimney Safety Blog"
        description="Read First Chimney blog articles on chimney maintenance, creosote risks, inspections, and homeowner safety tips."
        path="/blog"
      />

      <section className="relative py-20 bg-soft-black border-b border-white/5">
        <div className="container mx-auto px-6 lg:px-12 text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-white">The First Chimney Blog</h1>
          <p className="text-xl text-warm-ivory/85 leading-relaxed">Expert guidance to help you keep your chimney system safe, clean, and efficient year-round.</p>
        </div>
      </section>

      <section className="py-24 bg-midnight">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`} className="bg-soft-black rounded-2xl overflow-hidden border border-white/10 hover:border-copper-ember/35 group flex flex-col h-full">
                <div className="relative aspect-video overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute top-4 left-4 bg-midnight/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-widest text-copper-ember uppercase border border-white/10">{post.category}</div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h2 className="text-2xl font-display font-bold mb-4 group-hover:text-copper-ember text-white line-clamp-2">{post.title}</h2>
                  <p className="text-warm-ivory/80 mb-6 line-clamp-3 flex-grow">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-warm-ivory/60 border-t border-white/10 pt-6 mt-auto">
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{post.date}</span></div>
                    <div className="flex items-center gap-2"><User className="w-4 h-4" /><span>{post.author}</span></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
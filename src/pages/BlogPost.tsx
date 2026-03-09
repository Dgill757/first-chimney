import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import SEO from '@/components/SEO';
import { IMAGE_ASSETS, SITE } from '@/lib/site';

const postContent: Record<string, { title: string; category: string; date: string; intro: string }> = {
  'how-often-should-you-sweep-your-chimney': {
    title: 'How Often Should You Sweep Your Chimney?',
    category: 'Maintenance',
    date: 'January 12, 2026',
    intro: 'Annual inspections are the baseline, but sweeping frequency depends on fuel type, usage, moisture levels, and buildup rates inside the flue.',
  },
  'the-dangers-of-creosote-buildup': {
    title: 'The Hidden Dangers of Creosote Buildup',
    category: 'Safety',
    date: 'January 28, 2026',
    intro: 'Creosote buildup is a leading contributor to chimney fire risk and can become severe long before homeowners notice visible warning signs.',
  },
  'what-is-a-level-2-chimney-inspection': {
    title: 'What Is a Level 2 Chimney Inspection?',
    category: 'Inspections',
    date: 'February 11, 2026',
    intro: 'A Level 2 inspection uses internal camera scanning to identify hidden defects and verify venting safety after system changes or property transactions.',
  },
};

export default function BlogPost() {
  const { postId } = useParams<{ postId: string }>();
  const post = postContent[postId || ''] || {
    title: 'Chimney Safety Insights',
    category: 'Education',
    date: 'February 15, 2026',
    intro: 'Professional chimney service starts with clear diagnostics and proactive maintenance.',
  };

  return (
    <div className="pt-24 md:pt-28 pb-14 md:pb-16">
      <SEO title={post.title} description={post.intro} path={`/blog/${postId || ''}`} image={IMAGE_ASSETS.inspectionAlt} />

      <section className="relative py-24 bg-soft-black border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <img src={IMAGE_ASSETS.inspectionAlt} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight to-transparent" />
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-8">
            <span className="text-sm font-medium tracking-wide text-copper-ember uppercase">{post.category}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-8 leading-tight text-white">{post.title}</h1>
          <div className="flex items-center justify-center gap-6 text-warm-ivory/75 text-sm">
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{post.date}</span></div>
            <div className="flex items-center gap-2"><User className="w-4 h-4" /><span>First Chimney Team</span></div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-midnight">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="lead text-xl text-warm-ivory/90 leading-relaxed mb-8">{post.intro}</p>
            <h2 className="text-3xl font-display font-bold text-white mt-12 mb-6">Why Diagnostics Matter</h2>
            <p className="text-warm-ivory/85 leading-relaxed mb-6">
              Visual-only assessments miss many common defects. Camera-assisted inspection gives homeowners clearer decisions, better budgeting, and fewer surprise failures.
            </p>
            <h3 className="text-2xl font-display font-bold text-white mt-10 mb-4">What Homeowners Should Watch For</h3>
            <p className="text-warm-ivory/85 leading-relaxed mb-6">
              Watch for smoke backup, musty or campfire odors, ceiling stains, and visible masonry breakdown. Any of these may indicate deeper flue or moisture issues.
            </p>
            <blockquote className="border-l-4 border-copper-ember pl-6 italic text-xl text-warm-ivory my-10">
              "The safest repair is the one diagnosed correctly before damage spreads."
            </blockquote>
            <p className="text-warm-ivory/85 leading-relaxed mb-6">
              For project-specific recommendations, call <a className="text-copper-ember hover:text-fire-gold" href={SITE.phoneHref}>{SITE.phoneDisplay}</a> or request a consultation online.
            </p>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10">
            <Link to="/blog" className="inline-flex items-center gap-2 text-copper-ember hover:text-fire-gold font-semibold">
              <ArrowLeft className="w-5 h-5" />
              Back to Blog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

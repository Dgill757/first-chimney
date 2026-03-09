import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import SEO from '@/components/SEO';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How often should I have my chimney swept?',
      answer:
        'Chimneys and fireplaces should be inspected annually. Sweeping is recommended when buildup reaches unsafe levels or draft issues are present.',
    },
    {
      question: 'What is a Level 2 Chimney Inspection?',
      answer:
        'A Level 2 inspection includes a full visual assessment plus internal flue camera scanning. It is commonly required for real estate transactions, appliance changes, and after chimney events.',
    },
    {
      question: 'Why does my chimney smell like a campfire?',
      answer:
        'Odors are often linked to creosote buildup, moisture, or negative pressure draft conditions. We inspect and isolate the root cause before recommending solutions.',
    },
    {
      question: 'Do you offer financing for major repairs?',
      answer:
        'Yes. Financing options are available for larger projects so homeowners can address safety work without delaying repairs.',
    },
    {
      question: 'What areas do you service?',
      answer:
        'We serve homeowners across Virginia, Maryland, West Virginia, and Pennsylvania.',
    },
  ];

  return (
    <div className="pt-24 md:pt-28 pb-14 md:pb-16">
      <SEO
        title="Chimney FAQ"
        description="Get answers to common chimney service questions including inspections, sweeping frequency, odor issues, and financing options."
        path="/faq"
      />

      <section className="relative py-20 bg-soft-black border-b border-white/5">
        <div className="container mx-auto px-6 lg:px-12 text-center max-w-4xl">
          <HelpCircle className="w-12 h-12 text-copper-ember mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-white">Frequently Asked Questions</h1>
          <p className="text-xl text-warm-ivory/85 leading-relaxed">Answers to the most common homeowner questions about chimney safety and service.</p>
        </div>
      </section>

      <section className="py-24 bg-midnight">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-soft-black border border-white/10 rounded-2xl overflow-hidden">
                <button className="w-full px-6 py-6 flex items-center justify-between text-left" onClick={() => setOpenIndex(openIndex === index ? null : index)}>
                  <h3 className="text-xl font-display font-bold pr-8 text-white">{faq.question}</h3>
                  {openIndex === index ? <ChevronUp className="w-6 h-6 text-copper-ember shrink-0" /> : <ChevronDown className="w-6 h-6 text-warm-ivory/60 shrink-0" />}
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                      <div className="px-6 pb-6 text-warm-ivory/85 leading-relaxed border-t border-white/10 pt-4">{faq.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-soft-black border-t border-white/5 text-center">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 text-white">Still Have Questions?</h2>
          <p className="text-xl text-warm-ivory/85 mb-10">Contact us for personalized guidance and service recommendations.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-copper-ember text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-fire-gold shadow-[0_0_20px_rgba(198,106,43,0.4)]">
            Contact Us
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

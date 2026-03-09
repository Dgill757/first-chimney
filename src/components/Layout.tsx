import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import FloatingCTA from './FloatingCTA';
import { BackgroundPaths } from './ui/background-paths';
import { SITE } from '@/lib/site';

export default function Layout() {
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: SITE.name,
    url: SITE.domain,
    logo: `${SITE.domain}${SITE.logo}`,
    telephone: SITE.phoneDisplay,
    areaServed: ['VA', 'MD', 'DC', 'WV', 'PA'],
    serviceType: [
      'Chimney Inspection',
      'Chimney Sweeping',
      'Chimney Repair',
      'Chimney Leak Repair',
      'Masonry Rebuild',
      'Fireplace Repair',
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-midnight text-warm-ivory selection:bg-copper-ember/30 selection:text-white relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <Header />
      <main className="flex-grow relative z-10">
        <Outlet />
      </main>
      <Footer />
      <FloatingCTA />
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
        <BackgroundPaths title="" />
      </div>
    </div>
  );
}

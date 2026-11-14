import { lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import Layout from './components/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Everything below the homepage loads on demand, so the first visit only pays for what it shows.
const HolidaySpecial = lazy(() => import('./pages/HolidaySpecial'));
const DesignFireplace = lazy(() => import('./pages/DesignFireplace'));
const Shop = lazy(() => import('./pages/Shop'));
const ServicesOverview = lazy(() => import('./pages/Services').then((m) => ({ default: m.ServicesOverview })));
const ServiceDetail = lazy(() => import('./pages/Services').then((m) => ({ default: m.ServiceDetail })));
const ServiceAreasHub = lazy(() => import('./pages/Areas').then((m) => ({ default: m.ServiceAreasHub })));
const StateArea = lazy(() => import('./pages/Areas').then((m) => ({ default: m.StateArea })));
const BlogIndex = lazy(() => import('./pages/Blog').then((m) => ({ default: m.BlogIndex })));
const BlogPost = lazy(() => import('./pages/Blog').then((m) => ({ default: m.BlogPost })));
const About = lazy(() => import('./pages/Company').then((m) => ({ default: m.About })));
const FaqPage = lazy(() => import('./pages/Company').then((m) => ({ default: m.FaqPage })));
const Contact = lazy(() => import('./pages/Company').then((m) => ({ default: m.Contact })));
const Gallery = lazy(() => import('./pages/Company').then((m) => ({ default: m.Gallery })));
const Reviews = lazy(() => import('./pages/Company').then((m) => ({ default: m.Reviews })));
const Privacy = lazy(() => import('./pages/Company').then((m) => ({ default: m.Privacy })));

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="holiday-chimney-special" element={<HolidaySpecial />} />
            <Route path="design-your-fireplace" element={<DesignFireplace />} />
            <Route path="fireplace-shop" element={<Shop />} />
            <Route path="fireplace-shop/:category" element={<Shop />} />
            <Route path="fireplace-shop/:category/:product" element={<Shop />} />
            <Route path="services" element={<ServicesOverview />} />
            <Route path="services/:serviceId" element={<ServiceDetail />} />
            <Route path="service-areas" element={<ServiceAreasHub />} />
            <Route path="service-areas/:state" element={<StateArea />} />
            <Route path="service-areas/:state/:city" element={<StateArea />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="about" element={<About />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="contact" element={<Contact />} />
            <Route path="blog" element={<BlogIndex />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="privacy-policy" element={<Privacy />} />
            <Route path="financing" element={<Navigate to="/contact" replace />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import ServicesOverview from './pages/ServicesOverview';
import ServiceDetail from './pages/ServiceDetail';
import ServiceAreas from './pages/ServiceAreas';
import LocationDetail from './pages/LocationDetail';
import Gallery from './pages/Gallery';
import Reviews from './pages/Reviews';
import Financing from './pages/Financing';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<ServicesOverview />} />
          <Route path="services/:serviceId" element={<ServiceDetail />} />
          <Route path="service-areas" element={<ServiceAreas />} />
          <Route path="service-areas/:locationId" element={<LocationDetail />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="financing" element={<Financing />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="contact" element={<Contact />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:postId" element={<BlogPost />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

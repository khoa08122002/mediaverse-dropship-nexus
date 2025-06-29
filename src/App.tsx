import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from "react-router-dom";
import AppLayout from './components/AppLayout';
import ErrorBoundary from './components/ErrorBoundary';
import Preloader from './components/Preloader';
import Providers from './components/Providers';

// Lazy load pages
const Index = React.lazy(() => import('./pages/Index'));
const About = React.lazy(() => import('./pages/About'));
const MediaServices = React.lazy(() => import('./pages/MediaServices'));
const Ecommerce = React.lazy(() => import('./pages/Ecommerce'));
const Blog = React.lazy(() => import('./pages/Blog'));
const BlogDetail = React.lazy(() => import('./pages/BlogDetail'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Recruitment = React.lazy(() => import('./pages/Recruitment'));
const Admin = React.lazy(() => import('./pages/Admin'));
const Login = React.lazy(() => import('./pages/Login'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const ApplicantProfile = React.lazy(() => import('./components/admin/ApplicantProfile'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Providers />}>
      {/* Standalone Routes (No Layout) */}
      <Route
        path="login"
        element={
          <Suspense fallback={<Preloader />}>
            <Login />
          </Suspense>
        }
      />
      <Route
        path="register"
        element={
          <Suspense fallback={<Preloader />}>
            <Login />
          </Suspense>
        }
      />
      <Route
        path="forgot-password"
        element={
          <Suspense fallback={<Preloader />}>
            <Login />
          </Suspense>
        }
      />
      
      {/* Admin Routes (Standalone - has own Header) */}
      <Route
        path="admin/*"
        element={
          <Suspense fallback={<Preloader />}>
            <Admin />
          </Suspense>
        }
      />
      
      {/* Routes with AppLayout */}
      <Route element={<AppLayout />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<Preloader />}>
              <Index />
            </Suspense>
          }
        />
        <Route
          path="about"
          element={
            <Suspense fallback={<Preloader />}>
              <About />
            </Suspense>
          }
        />
        <Route
          path="media-services"
          element={
            <Suspense fallback={<Preloader />}>
              <MediaServices />
            </Suspense>
          }
        />
        <Route
          path="ecommerce"
          element={
            <Suspense fallback={<Preloader />}>
              <Ecommerce />
            </Suspense>
          }
        />
        <Route
          path="blog"
          element={
            <ErrorBoundary>
              <Suspense fallback={<Preloader />}>
                <Blog />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="blog/:slug"
          element={
            <ErrorBoundary>
              <Suspense fallback={<Preloader />}>
                <BlogDetail />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="contact"
          element={
            <Suspense fallback={<Preloader />}>
              <Contact />
            </Suspense>
          }
        />
        <Route
          path="recruitment"
          element={
            <Suspense fallback={<Preloader />}>
              <Recruitment />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<Preloader />}>
              <NotFound />
            </Suspense>
          }
        />
      </Route>
    </Route>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;

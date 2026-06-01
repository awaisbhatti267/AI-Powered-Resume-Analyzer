import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RouteProtector from "./component/utils/RouteProtector";

// Eagerly load the landing page (first paint)
import SampleHome from './Pages/SampleHome/Samplehome';

// Lazy load everything else — only downloaded when needed
const Homes        = lazy(() => import('./Pages/Home/home'));
const AboutPage    = lazy(() => import('./Pages/About/About'));
const LoggedIn     = lazy(() => import('./Pages/Auth/Login/Login'));
const CreateAccount= lazy(() => import('./Pages/Auth/Signin/register'));
const ForgetPassword=lazy(() => import('./Pages/Auth/ForgetPass/forgetpassword'));
const ResetPassword= lazy(() => import('./Pages/Auth/ResetPass/Resetpass'));
const AnalyzePage  = lazy(() => import('./Pages/Analyze/AnalyzePage'));

// Simple fallback shown while lazy chunks load
const PageLoader = () => (
  <div className="fullpage-loader">
    <div className="loader-circle"></div>
  </div>
);

const router = createBrowserRouter([
  { path: '/', element: <SampleHome /> },

  {
    element: <RouteProtector />,
    children: [
      { path: '/home',    element: <Homes /> },
      { path: '/About',   element: <AboutPage /> },
      { path: '/Analyze', element: <AnalyzePage /> },
    ]
  },

  { path: '/Login',              element: <LoggedIn /> },
  { path: '/Signup',             element: <CreateAccount /> },
  { path: '/ForgotPassword',     element: <ForgetPassword /> },
  { path: '/ResetPass/:token',   element: <ResetPassword /> },
]);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;

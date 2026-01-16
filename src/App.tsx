import { useEffect } from "react"; // Effect hook for side effects like checking auth state
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // BrowserRouter: enables routing, Routes: container for all routes, Route: defines a route, Navigate: for redirection to another route
import { Provider } from "react-redux"; // Makes Redux store available to the app
import { store } from "./store/store"; // The Redux store
import { supabase } from "./lib/supabase"; // Supabase client for auth
import { setUser } from "./store/authSlice"; // To update Redux on auth state changes
// Import our page components
import Register from "./components/Register";
import Login from "./components/Login";
import Blog from "./components/Blog";
import CreatePost from "./components/CreatePost";
import EditPost from "./components/EditPost";
import ViewPost from "./components/ViewPost";

// Handles routing and auth state management
function AppContent() {

  // On component mount, check auth state and set up listener for changes
  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      store.dispatch(setUser(session?.user ?? null)); // For logged in user to stay logged in on page refresh
    });

    // Listens for auth state changes (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      store.dispatch(setUser(session?.user ?? null));
    });

    // When user logs in or out, update Redux store accordingly
    return () => subscription.unsubscribe();
  }, []); // Empty dependency array means this runs once when app loads

  return (
    <BrowserRouter> {/* Enables routing in the app */}
      <Routes>  {/* Container for all routes */}
        <Route path="/" element={<Blog />} /> {/* Main blog page */}
        <Route path="/register" element={<Register />} />   {/* Registration page */}
        <Route path="/login" element={<Login />} />   {/* Login page */}
        <Route path="/create" element={<CreatePost />} />   {/* Create new post page */}
        <Route path="/edit/:id" element={<EditPost />} />   {/* Edit existing post page */}
        <Route path="/post/:id" element={<ViewPost />} />   {/* View post page */}
        <Route path="*" element={<Navigate to="/" />} /> {/* Redirect unknown routes to home */}
      </Routes>
    </BrowserRouter>
  );
}
function App() {
  return (
    <Provider store={store}> {/* Makes Redux store available to the app */}
      <AppContent />
    </Provider>
  );
}

export default App;



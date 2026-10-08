import { Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ErrorPage from './pages/ErrorPage';
import Layout from './pages/Layout';
import FeedPage from './pages/FeedPage';

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/auth/login" element={<SignIn />}></Route>
          <Route path="/auth/signup" element={<SignUp />}></Route>
          <Route path="/auth/login" element={<SignIn />}></Route>
          <Route path="/feed" element={<FeedPage />}></Route>
        </Route>
        <Route path="/error" element={<ErrorPage />}></Route>
        <Route path="*" element={<ErrorPage />}></Route>
      </Routes>
    </>
  );
}

export default App;

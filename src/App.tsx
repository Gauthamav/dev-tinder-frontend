import { Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ErrorPage from './pages/ErrorPage';
import Layout from './pages/Layout';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import ConnectionRequest from './pages/ConnectionRequest';
import Connections from './pages/Connections';
import ConnectionView from './pages/ConnectionView';

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
          <Route path="/profile" element={<ProfilePage />}></Route>
          <Route path="/connection/requests" element={<ConnectionRequest />}></Route>
          <Route path="/connections" element={<Connections />}></Route>
          <Route path="/connection/profile/view/:id" element={<ConnectionView />}></Route>
        </Route>
        <Route path="/error" element={<ErrorPage />}></Route>
        <Route path="*" element={<ErrorPage />}></Route>
      </Routes>
    </>
  );
}

export default App;

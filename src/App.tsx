import { Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import SignIn from './pages/SignIn';
import Header from './components/Header';
import SignUp from './pages/SignUp';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/auth/login" element={<SignIn />}></Route>
        <Route path="/auth/signup" element={<SignUp />}></Route>
        <Route path="/auth/login" element={<SignIn />}></Route>
      </Routes>
    </>
  );
}

export default App;

import { LOGO_URL } from '../utils/constants';
import { Link, useLocation } from 'react-router';
export default function Header() {
  const location = useLocation();
  return (
    <>
      {location.pathname !== '/auth/login' && (
        <header className="flex p-[30px]  wrapper items-center justify-between">
          <Link to="/">
            <img className="max-w-[190px] object-cover" src={LOGO_URL} alt="Company-logo-devtinder"></img>
          </Link>
          <nav className="flex items-center gap-5">
            <Link to="/auth/login">
              <button className="bg-[#141414] rounded-full cursor-pointer text-center px-6 py-2 text-white hover:bg-[#41d87e] hover:text-black">
                Sign In{' '}
              </button>
            </Link>
          </nav>
        </header>
      )}
    </>
  );
}

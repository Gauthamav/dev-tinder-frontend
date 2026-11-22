import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL, LOGO_URL } from '../utils/constants';
import { Link, useLocation, useNavigate } from 'react-router';
import type { RootState } from '../utils/appStore';
import { useState } from 'react';
import { removeUser } from '../utils/userSlice';
export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((store: RootState) => store.user.user);
  const dispatch = useDispatch();
  const [dropDown, setDropDown] = useState<boolean>(false);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      } else {
        dispatch(removeUser());
        navigate('/auth/login');
      }
    } catch (err) {
      navigate('/error');
    }
  };

  return (
    <>
      {location.pathname !== '/auth/login' && location.pathname !== '/auth/signup'  && (
        <header className="flex py-[30px]    wrapper items-center justify-between">
          <Link to="/">
            <img
              className="sm:max-w-[190px] max-w-[150px] object-cover"
              src={LOGO_URL}
              alt="Company-logo-devtinder"></img>
          </Link>
          {user ? (
            <div className="relative z-10 flex items-center sm:gap-4 gap-2 ">
              <span className="sm:text-sm sm:max-w-[200px] md:max-w-[500px] truncate max-w-[100px] text-xs">
                Welcome,{user.firstName[0].toUpperCase() + user.firstName.slice(1)}
              </span>
              <img
                alt="user-profile-photo"
                className="sm:w-[45px] sm:h-[45px] w-[35px] h-[35px]  cursor-pointer  rounded-full object-contain"
                src={user?.photoUrl}></img>
              <button className="cursor-pointer" onClick={() => setDropDown(prev => !prev)}>
                <svg
                  aria-label="Menu"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  {' '}
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />{' '}
                </svg>
              </button>
              {dropDown && (
                <ul className=" absolute z-20 text-black p-3 flex   top-[52px] right-0  flex-col rounded-lg bg-white w-[150px] sm:max-w-[200px] border-gray-400 border-[1px] gap-[10px]">
                  <Link to="/feed" className="hover:bg-gray-300 pl-2 py-1 rounded-lg text-center text-sm ">
                    Feed Page
                  </Link>
                  <Link to="/profile" className="hover:bg-gray-300 pl-2 py-1 rounded-lg text-center text-sm ">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="hover:bg-gray-300 pl-2 py-1 rounded-lg text-sm ">
                    Log out
                  </button>
                  <Link to="/connections" className="hover:bg-gray-300 pl-2 py-1 rounded-lg text-center text-sm ">
                    Connections
                  </Link>
                  <Link
                    to="/connection/requests"
                    className="hover:bg-gray-300 pl-2 py-1 rounded-lg text-center text-sm ">
                    Connections Request
                  </Link>
                </ul>
              )}
            </div>
          ) : (
            <nav className="flex items-center gap-5">
              <Link to="/auth/login">
                <button className="bg-[#141414] rounded-full cursor-pointer text-center px-6 py-2 text-white hover:bg-[#41d87e] hover:text-black">
                  Sign In{' '}
                </button>
              </Link>
            </nav>
          )}
        </header>
      )}
    </>
  );
}

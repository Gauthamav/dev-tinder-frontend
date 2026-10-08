import { useState } from 'react';
import { LOGO_URL } from '../utils/constants';
import { Link, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { addUser, removeUser } from '../utils/userSlice';
import { BASE_URL } from '../utils/constants';
export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('samaltman@gmail.com');
  const [password, setPassword] = useState<string>('Samaltman@123');
  const [buttonDisable, setButtonDisable] = useState<boolean>(false);
  const [error, setError] = useState('');
  const handleClick = async () => {
    setError('');
    setButtonDisable(prev => !prev);
    try {
      if (!email) {
        throw new Error('Please enter a valid email');
      }
      if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new Error('Please enter a valid email');
      }
      if (!password) {
        throw new Error('Enter Strong Password');
      }
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          emailId: email,
          password: password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      dispatch(addUser(data?.data));
      navigate('/feed');
    } catch (err) {
      setButtonDisable(prev => !prev);
      dispatch(removeUser());
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something Went Wrong');
      }
    }
  };

  return (
    <section className="min-h-screen bg-[url('/images/signin-bg-img.jpeg')] flex items-center justify-center bg-cover bg-center bg-no-repeat">
      <div className="wrapper w-full flex justify-center">
        <div className="bg-white max-w-[470px] w-full rounded-3xl px-6 sm:px-10 py-6">
          <div className="flex flex-col gap-[10px] md:gap-[20px]">
            <img className="max-w-[160px] object-cover" src={LOGO_URL} alt="company-logo-devtinder"></img>
            <h4 className="lg:text-4xl font-bold md:text-3xl text-2xl">
              Welcome to <span className="text-[#41d87e] ">DevTinder</span>{' '}
            </h4>
            <p className="text-[#141414] lg:text-xl text-lg ">
              Match
              <span className="text-[#41d87e]  "> Merge </span> Build
            </p>
            <label className=" mt-5 text-sm">Email Id</label>
            <input
              type="email"
              value={email}
              maxLength={80}
              onChange={e => {
                const inputEmail = e.target.value.replace(/[^A-Za-z0-9@.]/g, '');
                setEmail(inputEmail.trim());
              }}
              placeholder="Enter your email "
              className="h-[45px] outline-none  border-[1px] pl-[10px] border-gray-200 rounded-lg border-"></input>

            <label className="text-sm mt-5">Password</label>
            <input
              type="password"
              value={password}
              maxLength={80}
              placeholder="Enter your password "
              onChange={e => {
                const inputPassword = e.target.value.replace(/[^A-Za-z0-9@.]/g, '');
                setPassword(inputPassword.trim());
              }}
              className="h-[45px]   outline-none  border-[1px] pl-[10px] border-gray-200 rounded-lg border-"></input>
            <span className="text-sm text-red-600 mb-5">{error}</span>
            <button
              disabled={buttonDisable}
              onClick={handleClick}
              className="cursor-pointer bg-[#141414] text-white rounded-md text-center w-full px-6 py-3 border-[1px] hover:bg-[#41d87e] hover:text-white border-white disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-300 disabled:hover:bg-gray-400">
              Sign In
            </button>
            <div className="flex items-center gap-2">
              <hr className="border-t w-full border-gray-300" />
              <span className="text-sm text-gray-300">or</span>
              <hr className="border-t w-full border-gray-300" />
            </div>
            <Link to="/">
              <button
                disabled={buttonDisable}
                className="w-full rounded-md border border-white bg-[#141414] px-6 py-3 text-center text-white cursor-pointer hover:bg-[#41d87e] disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-300 disabled:hover:bg-gray-400">
                Back To Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

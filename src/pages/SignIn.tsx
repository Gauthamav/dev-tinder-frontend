import { useState } from 'react';
import { LOGO_URL } from '../utils/constants';
import { Link } from 'react-router';

export default function SignIn() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [buttonDisable, setButtonDisable] = useState<boolean>(false);
  const [error, setError] = useState('');
  console.log(email);
  const handleClick = () => {
    setError('');
    setButtonDisable(prev => !prev);
  };

  return (
    <section className="min-h-screen bg-[url('/images/signin-bg-img.jpeg')] flex items-center justify-center bg-cover bg-center bg-no-repeat">
      <div className="bg-white max-w-[470px] w-full rounded-3xl px-10 py-6">
        <div className="flex flex-col gap-[20px]">
          <img className="max-w-[160px] object-cover" src={LOGO_URL} alt="company-logo-devtinder"></img>
          <h4 className="lg:text-4xl font-bold md:text-3xl text-2xl">
            Welcome to <span className="text-[#41d87e] ">DevTinder</span>{' '}
          </h4>
          <p className="text-[#141414] lg:text-xl text-lg ">
            Match
            <span className="text-[#41d87e]  "> Merge </span> Build
          </p>
          <input
            type="email"
            value={email}
            maxLength={80}
            onChange={e => {
              const inputPassword = e.target.value.replace(/[^A-Za-z0-9@.]/g, '');
              setEmail(inputPassword.trim());
            }}
            placeholder="Enter your email "
            className="h-[45px] mt-5 outline-none  border-[1px] pl-[10px] border-gray-200 rounded-lg border-"></input>
          <span></span>
          <input
            type="password"
            value={password}
            maxLength={80}
            placeholder="Enter your password "
            onChange={e => {
              const inputEmail = e.target.value.replace(/[^A-Za-z0-9@.]/g, '');
              setPassword(inputEmail);
            }}
            className="h-[45px] mb-5  outline-none  border-[1px] pl-[10px] border-gray-200 rounded-lg border-"></input>
          <span>{error}</span>
          <button
            onClick={handleClick}
            className="cursor-pointer bg-[#141414] text-white rounded-md text-center w-full px-6 py-3 border-[1px] hover:bg-[#41d87e] hover:text-white border-white">
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
    </section>
  );
}

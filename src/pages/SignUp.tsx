import { BASE_URL, LOGO_URL } from '../utils/constants';
import { Link, useNavigate } from 'react-router';
import { useState, type SubmitEvent } from 'react';

export default function SignUp() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [occupation, setOccupation] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [about, setAbout] = useState('');
  const [skills, setSkills] = useState('');

  const [buttonDisable, setButtonDisable] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const inputStyle = 'h-[45px] outline-none border-[1px] pl-[10px] border-gray-200 rounded-lg w-full';
  const nameRegex = /^[\p{L}]+(?:[ '-][\p{L}]+)*$/u;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{6,}$/;
  const occupationRegex = /^[\p{L}\p{N} .,&()'/-]+$/u;

  const handleClick = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (buttonDisable) return;

    setError('');
    setSuccess('');

    const cleanedFirstName = firstName.trim();
    const cleanedLastName = lastName.trim();
    const cleanedEmail = email.trim().toLowerCase();
    const cleanedOccupation = occupation.trim();
    const cleanedPhotoUrl = photoUrl.trim();
    const cleanedAbout = about.trim();

    const skillsArray = skills
      .split(',')
      .map(skill => skill.trim())
      .filter(Boolean);

    // Frontend validation
    if (cleanedFirstName.length < 3 || cleanedFirstName.length > 60 || !nameRegex.test(cleanedFirstName)) {
      setError('Enter a valid first name (3-60 characters).');
      return;
    }

    if (cleanedLastName && (cleanedLastName.length > 40 || !nameRegex.test(cleanedLastName))) {
      setError('Enter a valid last name.');
      return;
    }

    if (cleanedEmail.length > 200 || !emailRegex.test(cleanedEmail)) {
      setError('Enter a valid email address.');
      return;
    }

    if (!passwordRegex.test(password)) {
      setError('Password must contain at least 8 characters, uppercase, lowercase, number and special character.');
      return;
    }

    if (!age || !/^\d+$/.test(age) || Number(age) < 18 || Number(age) > 300) {
      setError('Enter a valid age between 18 and 120.');
      return;
    }

    if (!['male', 'female'].includes(gender)) {
      setError('Please select your gender.');
      return;
    }

    if (!cleanedOccupation || cleanedOccupation.length > 100 || !occupationRegex.test(cleanedOccupation)) {
      setError('Enter a valid occupation.');
      return;
    }

    if (cleanedPhotoUrl) {
      try {
        const url = new URL(cleanedPhotoUrl);

        if (!['http:', 'https:'].includes(url.protocol)) {
          throw new Error('Invalid URL');
        }
      } catch {
        setError('Enter a valid photo URL.');
        return;
      }
    }

    if (cleanedAbout.length > 120) {
      setError('About cannot exceed 120 characters.');
      return;
    }

    if (skillsArray.length > 10) {
      setError('You can add a maximum of 10 skills.');
      return;
    }

    if (skillsArray.some(skill => skill.length > 50)) {
      setError('Each skill must be 50 characters or less.');
      return;
    }

    const userData = {
      firstName: cleanedFirstName,
      lastName: cleanedLastName,
      emailId: cleanedEmail,
      password,
      age: Number(age),
      gender,
      occupation: cleanedOccupation,
      ...(cleanedPhotoUrl && { photoUrl: cleanedPhotoUrl }),
      ...(cleanedAbout && { about: cleanedAbout }),
      skills: skillsArray,
    };

    setButtonDisable(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      setSuccess('Account created successfully!');
      console.log('Signup successful');
      navigate('/feed', { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
    } finally {
      setButtonDisable(false);
    }
  };

  return (
    <section className="min-h-screen bg-[url('/images/signin-bg-img.jpeg')] flex items-center justify-center bg-cover bg-center bg-no-repeat py-10">
      <div className="wrapper w-full flex justify-center">
        <div className="bg-white max-w-[470px] w-full rounded-3xl px-6 sm:px-10 py-6">
          <div className="flex flex-col gap-[10px] md:gap-[20px]">
            <img className="max-w-[160px] object-cover" src={LOGO_URL} alt="company-logo-devtinder" />

            <h4 className="lg:text-4xl font-bold md:text-3xl text-2xl">
              Welcome to <span className="text-[#41d87e]">DevTinder</span>
            </h4>

            <p className="text-[#141414] lg:text-xl text-lg">
              Match
              <span className="text-[#41d87e]"> Merge </span>
              Build
            </p>

            <form onSubmit={handleClick} className="flex flex-col gap-[10px] md:gap-[20px]">
              <label className="mt-5 text-sm">First Name</label>
              <input
                type="text"
                value={firstName}
                minLength={3}
                maxLength={60}
                autoComplete="given-name"
                onChange={e => {
                  const value = e.target.value.replace(/[^\p{L} '-]/gu, '');
                  setFirstName(value);
                }}
                placeholder="Enter your first name"
                className={inputStyle}
                required
              />

              <label className="text-sm">Last Name</label>
              <input
                type="text"
                value={lastName}
                maxLength={40}
                autoComplete="family-name"
                onChange={e => {
                  const value = e.target.value.replace(/[^\p{L} '-]/gu, '');
                  setLastName(value);
                }}
                placeholder="Enter your last name"
                className={inputStyle}
              />

              <label className="text-sm">Email Id</label>
              <input
                type="email"
                value={email}
                maxLength={200}
                autoComplete="email"
                onChange={e => {
                  setEmail(e.target.value.replace(/\s/g, ''));
                }}
                placeholder="Enter your email"
                className={inputStyle}
                required
              />

              <label className="text-sm">Password</label>
              <input
                type="password"
                value={password}
                autoComplete="new-password"
                minLength={8}
                onChange={e => {
                  setPassword(e.target.value);
                }}
                placeholder="Enter your password"
                className={inputStyle}
                required
              />

              <label className="text-sm">Age</label>
              <input
                type="number"
                value={age}
                min={18}
                max={120}
                step={1}
                onChange={e => {
                  setAge(e.target.value.replace(/[^\d]/g, ''));
                }}
                placeholder="Enter your age"
                className={inputStyle}
                required
              />

              <label className="text-sm">Gender</label>
              <select value={gender} onChange={e => setGender(e.target.value)} className={inputStyle} required>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <label className="text-sm">Occupation</label>
              <input
                type="text"
                value={occupation}
                maxLength={100}
                autoComplete="organization-title"
                onChange={e => {
                  const value = e.target.value.replace(/[^\p{L}\p{N} .,&()'/-]/gu, '');
                  setOccupation(value);
                }}
                placeholder="Enter your occupation"
                className={inputStyle}
                required
              />

              <label className="text-sm">Photo URL</label>
              <input
                type="url"
                value={photoUrl}
                onChange={e => {
                  setPhotoUrl(e.target.value);
                }}
                placeholder="Enter your photo URL"
                className={inputStyle}
              />

              <label className="text-sm">About</label>
              <textarea
                value={about}
                maxLength={120}
                onChange={e => {
                  setAbout(e.target.value);
                }}
                placeholder="Tell us about yourself"
                className="min-h-[90px] outline-none border-[1px] pl-[10px] pt-[10px] border-gray-200 rounded-lg w-full"
              />

              <label className="text-sm">Skills</label>
              <input
                type="text"
                value={skills}
                onChange={e => {
                  setSkills(e.target.value);
                }}
                placeholder="React, Node.js, MongoDB"
                className={inputStyle}
              />

              <span className="text-xs text-gray-500">Enter up to 10 skills separated by commas.</span>

              {error && <span className="text-sm text-red-600">{error}</span>}

              {success && <span className="text-sm text-green-600">{success}</span>}

              <button
                type="submit"
                disabled={buttonDisable}
                className="cursor-pointer bg-[#141414] text-white rounded-md text-center w-full px-6 py-3 border-[1px] hover:bg-[#41d87e] hover:text-white border-white disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-300 disabled:hover:bg-gray-400">
                {buttonDisable ? 'Signing Up...' : 'SignUp'}
              </button>
            </form>

            <div className="flex items-center gap-2">
              <hr className="border-t w-full border-gray-300" />
              <span className="text-sm text-gray-300">or</span>
              <hr className="border-t w-full border-gray-300" />
            </div>

            <Link to="/auth/login">
              <button
                type="button"
                disabled={buttonDisable}
                className="w-full rounded-md border border-white bg-[#141414] px-6 py-3 text-center text-white cursor-pointer hover:bg-[#41d87e] disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-300 disabled:hover:bg-gray-400">
                SignIn
              </button>
            </Link>

            <Link to="/">
              <button
                type="button"
                disabled={buttonDisable}
                className="w-full rounded-md border border-white bg-[#141414] px-6 py-3 text-center text-white cursor-pointer hover:bg-[#41d87e] disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-300 disabled:hover:bg-gray-400 disabled:hover:text-gray-300">
                Back To Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

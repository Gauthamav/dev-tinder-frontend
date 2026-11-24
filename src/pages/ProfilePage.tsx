import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../utils/appStore';
import { useState } from 'react';
import { BASE_URL } from '../utils/constants';
import { addUser } from '../utils/userSlice';

export default function ProfilePage() {
  const user = useSelector((store: RootState) => store.user.user);
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState<string | null>(user?.firstName ?? null);

  const [lastName, setLastName] = useState<string | null>(user?.lastName ?? null);

  const [age, setAge] = useState<string | null>(user?.age != null ? String(user.age) : null);

  const [about, setAbout] = useState<string | null>(user?.about ?? null);

  const [photoUrl, setPhotoUrl] = useState<string | null>(user?.photoUrl ?? null);

  const [occupation, setOccupation] = useState<string | null>(user?.occupation ?? null);

  const [error, setError] = useState<string>('');
  const [buttonDisable, setButtonDisable] = useState<boolean>(false);

  const capitalize = (value?: string | null) => {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const handleSaveProfile = async () => {
    if (!user || buttonDisable) return;

    setButtonDisable(true);
    setError('');

    try {
      const response = await fetch(`${BASE_URL}/user/edit/profile`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName?.trim() || user.firstName,
          lastName: lastName?.trim() || user.lastName,
          age: age?.trim() ? Number(age) : user.age,
          about: about?.trim() || user.about,
          photoUrl: photoUrl?.trim() || user.photoUrl,
          occupation: occupation?.trim() || user.occupation,
        }),
      });

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res?.message || 'Profile update failed');
      }

      if (!res?.data) {
        throw new Error('User data missing from server response');
      }

      dispatch(addUser(res.data));

      alert('Updated Successfully');
      setError('');
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

  if (!user) return <p>Profile Loading...</p>;

  return (
    <section className="flex xl:max-w-[75%] my-[40px] max-w-[94%] mx-auto min-h-[87vh] w-full flex-col lg:flex-row gap-[20px]">
      {/* Profile Preview */}

      <div className="w-full sm:min-h-[70vh] lg:min-h-[80vh] min-h-[60vh] rounded-lg overflow-hidden shadow-xl relative">
        <img
          className="absolute inset-0 w-full object-center object-cover h-full"
          alt="User-profile-photo"
          src={photoUrl || user.photoUrl || undefined}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        <div className="absolute left-5 bottom-5 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <p className="flex text-lg md:text-xl max-w-[300px] truncate font-semibold lg:text-2xl text-white">
              {capitalize(firstName || user.firstName) + ' ' + capitalize(lastName || user.lastName)}
            </p>

            <p className="flex text-lg md:text-xl font-light lg:text-2xl text-white">{age || user.age || ''}</p>
          </div>

          <div className="flex items-center gap-3">
            <img className="w-5 h-5" src="/icons/occupation.svg" alt="Occupation-icon" />

            <p className="max-w-[300px] text-sm md:text-lg truncate text-white">
              {capitalize(occupation || user.occupation)}
            </p>
          </div>

          <p className="max-w-[300px] text-xs pl-8 md:text-base truncate text-white">{about || user.about || ''}</p>
        </div>
      </div>

      {/* Profile Edit Form */}

      <div className="w-full flex flex-col gap-[10px] bg-white shadow-xl p-4 rounded-lg">
        <h5 className="lg:text-2xl text-xl font-semibold">Edit Your Profile</h5>

        {/* First Name */}

        <label className="mt-5 text-sm">First Name</label>

        <input
          type="text"
          value={firstName ?? user.firstName ?? ''}
          maxLength={80}
          onChange={e => {
            const inputFirstName = e.target.value.replace(/[^A-Za-z]/g, '');

            setFirstName(inputFirstName.trim());
          }}
          placeholder="Enter your first name"
          className="h-[45px] outline-none border pl-[10px] border-gray-200 rounded-lg"
        />

        {/* Last Name */}

        <label className="mt-5 text-sm">Last Name</label>

        <input
          type="text"
          value={lastName ?? user.lastName ?? ''}
          maxLength={20}
          onChange={e => {
            const inputLastName = e.target.value.replace(/[^A-Za-z]/g, '');

            setLastName(inputLastName.trim());
          }}
          placeholder="Enter your last name"
          className="h-[45px] outline-none border pl-[10px] border-gray-200 rounded-lg"
        />

        {/* Age */}

        <label className="mt-5 text-sm">Age</label>

        <input
          type="text"
          inputMode="numeric"
          value={age ?? String(user.age ?? '')}
          maxLength={3}
          onChange={e => {
            const inputAge = e.target.value.replace(/[^0-9]/g, '');

            setAge(inputAge);
          }}
          placeholder="Enter your age"
          className="h-[45px] outline-none border pl-[10px] border-gray-200 rounded-lg"
        />

        {/* Photo URL */}

        <label className="mt-5 text-sm">Photo URL</label>

        <input
          type="text"
          value={photoUrl ?? user.photoUrl ?? ''}
          maxLength={2000}
          onChange={e => {
            setPhotoUrl(e.target.value.trim());
          }}
          placeholder="Enter your photo URL"
          className="h-[45px] outline-none border pl-[10px] border-gray-200 rounded-lg"
        />

        {/* Occupation */}

        <label className="mt-5 text-sm">Occupation</label>

        <input
          type="text"
          value={occupation ?? user.occupation ?? ''}
          maxLength={80}
          onChange={e => {
            const inputOccupation = e.target.value.replace(/[^A-Za-z\s]/g, '');

            setOccupation(inputOccupation);
          }}
          placeholder="Enter your occupation or studies"
          className="h-[45px] outline-none border pl-[10px] border-gray-200 rounded-lg"
        />

        {/* About */}

        <label className="mt-5 text-sm">About</label>

        <input
          type="text"
          value={about ?? user.about ?? ''}
          maxLength={120}
          onChange={e => {
            setAbout(e.target.value);
          }}
          placeholder="About"
          className="h-[70px] outline-none border pl-[10px] border-gray-200 rounded-lg"
        />

        {/* Error Message */}

        <span className="text-sm text-red-600 mb-5">{error}</span>

        {/* Save Button */}

        <button
          disabled={buttonDisable}
          onClick={handleSaveProfile}
          className="cursor-pointer bg-[#141414] mt-5 text-white rounded-md text-center w-full px-6 py-3 border hover:bg-[#41d87e] hover:text-white border-white disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-300 disabled:hover:bg-gray-400">
          {buttonDisable ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </section>
  );
}

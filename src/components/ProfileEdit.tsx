import { useSelector } from 'react-redux';
import type { RootState } from '../utils/appStore';
import { useState } from 'react';

export default function ProfileEdit() {
  const user = useSelector((store: RootState) => store.user.user);

    const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [firstName, setFirstName] = useState(user?.firstName);

  const [lastName, setLastName] = useState(user?.lastName);
  const [age, setAge] = useState(user?.age);
  const [about, setAbout] = useState(user?.about);
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl);
  const [occupation, setOccupation] = useState(user?.occupation);
  if (!user) {
    return <p className="text-center">Loading profile...</p>;
  }
  return (
    <div className="w-full flex flex-col gap-[10px] bg-white shadow-xl p-4 rounded-lg">
      <h5 className="lg:text-2xl text-xl  font-semibold">Edit Your Profile</h5>
      <label className=" mt-5 text-sm">First Name</label>
      <input
        type="text"
        value={firstName ?? user.firstName}
        maxLength={80}
        onChange={e => {
          const inputFirstName = e.target.value.replace(/[^A-Za-z]/g, '');
          setFirstName(inputFirstName.trim());
        }}
        placeholder="Enter your first name "
        className="h-[45px] outline-none  border-[1px] pl-[10px] border-gray-200 rounded-lg border-"></input>
      <label className=" mt-5 text-sm">Last Name</label>
      <input
        type="text"
        value={lastName ?? user.lastName}
        maxLength={20}
        onChange={e => {
          const lastName = e.target.value.replace(/[^A-Za-z]/g, '');
          setLastName(lastName.trim());
        }}
        placeholder="Enter your last name "
        className="h-[45px] outline-none  border-[1px] pl-[10px] border-gray-200 rounded-lg border-"></input>
      <label className=" mt-5 text-sm">Age</label>
      <input
        type="text"
        value={age ?? user.age}
        maxLength={3}
        onChange={e => {
          const age = e.target.value.replace(/[^0-9]/g, '');
          setAge(age.trim());
        }}
        placeholder="Enter your Age "
        className="h-[45px] outline-none  border-[1px] pl-[10px] border-gray-200 rounded-lg border-"></input>

      <div className="flex flex-col gap-3">
        {preview && <img src={preview} alt="Profile preview" className="w-10 h-8  object-cover" />}

        <input
        className='bg-gray-300  w-fit flex '
          type="file"
          accept="image/*"
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) {
              setPhoto(file);
              setPreview(URL.createObjectURL(file));
            }
          }}
        />
      </div>
    </div>
  );
}

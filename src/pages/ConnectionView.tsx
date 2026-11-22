import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { BASE_URL } from '../utils/constants';

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  about: string;
  age: number;
  occupation: string;
};

export default function ConnectionView() {
  const [result, setResult] = useState<User>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const fetchConnectionProfile = async (id: string) => {
    try {
      const response = await fetch(`${BASE_URL}/connection/profile/view/${id}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message);
      }
      if (!data) {
        throw new Error('Something Went Wrong');
      }
      setResult(data?.data);
    } catch (err) {
      setButtonDisable(prev => !prev);
      navigate('/error');
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchConnectionProfile(id);
  }, [id]);
  const [btnDisable, setButtonDisable] = useState<boolean>(false);
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${BASE_URL}/connection/delete/${id}`, {
        method: 'POST',
        credentials: 'include',
      });
      const result = await response.json();
      console.log(result);
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      alert('Connection Deleted Successfully');
      navigate('/connections')
    } catch (err) {
      navigate('/error');
    }
  };

  if (!result) return <p className="text-center ">Loading...</p>;
  return (
    <section className="flex wrapper items-center  flex-col gap-[10px]   justify-center">
      {result && (
        <div className="w-full max-w-[500px]  h-[70vh] rounded-lg  overflow-hidden shadow-xl relative ">
          <img
            className="absolute inset-0 w-full object-center object-cover h-full"
            alt="User-profile-photo"
            src={result.photoUrl}></img>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute left-5 bottom-5 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <p className=" flex  text-lg md:text-xl max-w-[300px] truncate font-semibold  lg:text-2xl  text-white">
                {result.firstName[0].toUpperCase() +
                  result.firstName.slice(1) +
                  result.lastName[0].toUpperCase() +
                  result.lastName.slice(1)}
              </p>
              <p className=" flex  text-lg md:text-xl font-light lg:text-2xl  text-white">{result.age}</p>
            </div>
            <div className="flex items-center gap-3">
              <img className="w-5 h-5" src="/icons/occupation.svg" alt="Occupation-icon"></img>
              <p className=" max-w-[300px] text-sm md:text-lg truncate text-white">{result.occupation}</p>
            </div>
            <p className="  max-w-[300px]  text-xs pl-8 md:text-base truncate  text-white">{result.about}</p>
          </div>
        </div>
      )}
      <div className="flex max-w-[500px] w-full justify-around items-center">
        <button
          onClick={() => navigate('/connections')}
          className="w-full max-w-fit rounded-md border text-xs border-white bg-[#141414] px-8 py-3  text-center text-white cursor-pointer hover:bg-[#41d87e] disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-300 disabled:hover:bg-gray-400">
          Back
        </button>
        <button
          // onClick={() => }
          className="w-full max-w-fit rounded-md border text-xs border-white bg-[#141414] px-8 py-3 text-center text-white cursor-pointer hover:bg-[#41d87e] disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-300 disabled:hover:bg-gray-400">
          {' '}
          Message
        </button>
        <button
          disabled={btnDisable}
          onClick={() => {
            if (id) {
              handleDelete(id);
              setButtonDisable(prev => !prev);
            }
          }}
          className="w-full max-w-fit rounded-md border text-xs border-white bg-red-500 px-8 py-3 text-center text-white cursor-pointer hover:bg-[#41d87e] disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-300 disabled:hover:bg-gray-400">
          {' '}
          Remove
        </button>
      </div>
    </section>
  );
}

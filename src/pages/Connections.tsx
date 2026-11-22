import { useEffect, useState } from 'react';
import { BASE_URL } from '../utils/constants';
import { useNavigate } from 'react-router';

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
};

export default function Connections() {
  const [connections, setConnection] = useState<User[]>([]);
  const navigate = useNavigate();

  const fetchConnections = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/view/allConnection`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      setConnection(data?.data);
      console.log(data);
    } catch (err) {
      console.log(err);
      navigate('/error');
    }
  };
  useEffect(() => {
    fetchConnections();
  }, []);

  // const handleMessageConnection = (id: string) => {};

  const handleViewConnectionProfile = (id: string) => {
    navigate(`/connection/profile/view/${id}`);
  };

  if (!connections) return <p className="wrapper text-center">Loading...</p>;
  if (connections.length <= 0) return <p className="wrapper text-center">No Connections Found</p>;
  return (
    <section className="wrapper flex flex-col gap-[10px]">
      {connections.map(item => (
        <div key={item._id} className="flex justify-between cursor-pointer rounded-lg items-center p-2 shadow-lg">
          <div className="flex items-center gap-[10px] sm:gap-[20px]">
            <img
              src={item.photoUrl}
              className="h-[45px] w-[45px] rounded-full object-cover"
              alt={`profile-image-${item.firstName}`}></img>
            <h6 className="max-w-[50px] sm:max-w-[100px] lg:max-w-fit truncate">
              {item.firstName[0].toUpperCase() + item.firstName.slice(1)}
            </h6>
          </div>

          <div className="flex gap-[10px]">
            <button
              onClick={() => handleViewConnectionProfile(item._id)}
              className="w-full max-w-fit rounded-md border text-xs border-white bg-[#141414] px-3 py-2 text-center text-white cursor-pointer hover:bg-[#41d87e] disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-300 disabled:hover:bg-gray-400">
              View
            </button>
            <button
              // onClick={() => handleMessageConnection(item._id)}
              className="w-full max-w-fit rounded-md border text-xs border-white bg-[#141414] px-3 py-2 text-center text-white cursor-pointer hover:bg-[#41d87e] disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-300 disabled:hover:bg-gray-400">
              Message
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}

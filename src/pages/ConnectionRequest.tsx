import { useNavigate } from 'react-router';
import { BASE_URL } from '../utils/constants';
import { useEffect, useState } from 'react';

type ConnectionRequest = {
  _id: string;
  status: string;
  senderId: {
    _id: string;
    firstName: string;
    lastName: string;
    photoUrl: string;
  };
};

export default function ConnectionRequest() {
  const navigate = useNavigate();
  const [result, setResult] = useState<ConnectionRequest[]>([]);
  const [buttonDisable, setButtonDisable] = useState<boolean>(false);

  const handleConnectionRequest = async (senderId: string, connectionStatus: string) => {
    try {
      setButtonDisable(prev => !prev);
      const response = await fetch(`${BASE_URL}/user/${connectionStatus}/${senderId}`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }
      setResult(prev => prev.filter(item => item.senderId._id !== senderId));
      setButtonDisable(prev => !prev);
    } catch (err) {
      setButtonDisable(prev => !prev);
      console.log(err);
      navigate('/error');
    }
  };

  const fetchConnections = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/view/allConnectionRequests`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();

      if (data.length === 0) {
        setResult([]);
        return;
      }
      if (!response.ok) {
        throw new Error(data.message);
      }
      setResult(data?.data);
    } catch (err) {
      console.log(err);
      navigate('/error');
    }
  };
  console.log(result);
  useEffect(() => {
    fetchConnections();
  }, []);
  if (!result) return <p className="text-center">Loading</p>;
  if (result.length === 0) return <p className="text-center">No Request Found</p>;

  return (
    <section className="wrapper flex flex-col gap-[20px]">
      {result.map(item => (
        <div
          key={item.senderId._id}
          className="flex rounded-md items-center justify-between py-[20px] px-[20px] shadow-lg ">
          <div className="flex items-center gap-[10px] sm:gap-[20px]">
            <img
              src={item.senderId.photoUrl}
              className="h-[45px] w-[45px] rounded-full object-cover"
              alt={`profile-image-${item.senderId.firstName}`}></img>
            <h6 className="max-w-[50px] sm:max-w-[100px] lg:max-w-fit truncate">
              {item.senderId.firstName[0].toUpperCase() + item.senderId.firstName.slice(1)}
            </h6>
          </div>
          <div className="flex gap-[10px]">
            <button
              disabled={buttonDisable}
              onClick={() => handleConnectionRequest(item.senderId._id, 'accepted')}
              className="w-full max-w-fit rounded-md border text-xs border-white bg-[#141414] px-3 py-2 text-center text-white cursor-pointer hover:bg-[#41d87e] disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-300 disabled:hover:bg-gray-400">
              Accept
            </button>
            <button
              disabled={buttonDisable}
              onClick={() => handleConnectionRequest(item.senderId._id, 'rejected')}
              className="w-full max-w-fit rounded-md border text-xs border-white bg-[#141414] px-3 py-2 text-center text-white cursor-pointer hover:bg-[#41d87e] disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-300 disabled:hover:bg-gray-400">
              Reject
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}

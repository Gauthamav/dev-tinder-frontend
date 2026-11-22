import { useEffect, useState } from 'react';
import { BASE_URL } from '../utils/constants';
import { useNavigate } from 'react-router';
import ProfileCard from '../components/ProfileCard';

type Users = {
  _id?: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  age: string;
  about: string;
  occupation: string;
};

export default function FeedPage1() {
  const navigate = useNavigate();
  const [data, setData] = useState<Users[]>([]);
  const fetchUser = async () => {
    try {
      const response = await fetch(`${BASE_URL + '/user/feed'}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      setData(data);
      if (!response.ok) {
        navigate('/error');
        throw new Error(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <section className="justify-center min-h-[70vh]">
      <div>
        {data?.map(item => (
          <ProfileCard
            key={item._id}
            _id={item._id}
            photoUrl={item.photoUrl}
            firstName={item.firstName}
            lastName={item.lastName}
            age={item.age}
            about={item.about}
            occupation={item.occupation}
          />
        ))}
      </div>
    </section>
  );
}

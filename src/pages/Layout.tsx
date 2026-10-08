import { Outlet, useNavigate } from 'react-router';
import Header from '../components/Header';
import { BASE_URL } from '../utils/constants';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../utils/userSlice';
import type { RootState } from '../utils/appStore';

export default function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store: RootState) => store.user.user);
  const fetchUser = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/view/profile`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/auth/login');
        } else {
          navigate('/*');
        }
      }
      dispatch(addUser(data.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!user) {
      console.log('hello')
      fetchUser();
    }
  }, []);

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

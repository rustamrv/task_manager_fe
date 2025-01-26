import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useDispatch } from 'react-redux';
import { clearToken } from '@api/AuthReducer';
import { useGetProfileQuery } from '@api/endpoints/UserApi';
import { useState } from 'react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: profile, isLoading, isError, error } = useGetProfileQuery();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const onClickLogout = () => {
    dispatch(clearToken());
    navigate('/');
  };

  if ((error as FetchBaseQueryError)?.status === 401) {
    dispatch(clearToken()); 
    localStorage.removeItem("token");
    navigate('/');
  }
  

  const MenuItem = ({
    to,
    icon,
    label,
  }: {
    to: string;
    icon: string;
    label: string;
  }) => (
    <li className="flex items-center justify-start gap-3 pl-3 py-2 w-full hover:bg-gray-100 rounded-md transition">
      <img src={icon} alt={label} className="w-5 h-5" />
      <NavLink
        to={to}
        className={({ isActive }) =>
          isActive
            ? 'font-bold text-blue-600 underline text-sm'
            : 'text-blue-600 hover:underline text-sm hover:text-blue-400'
        }
      >
        {label}
      </NavLink>
    </li>
  );

  return (
    <>
      <div className="flex items-center justify-between w-full bg-white p-4 shadow-md lg:hidden fixed top-0 left-0 z-50">
        <Button
          onClick={() => setIsMenuOpen(true)}
          className="text-gray-700 focus:outline-none bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition"
        >
          <span className="text-xl">☰</span>
        </Button>
      </div>

      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 z-50 border-r border-gray-300 rounded-lg overflow-hidden lg:mt-8 lg:ml-8 ${
          isMenuOpen ? 'w-64' : 'w-0'
        } lg:w-72 lg:h-[calc(100vh-64px)]`}
      >
        <div className="flex flex-col items-center text-center p-6">
          <Button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-4 right-4 text-gray-700 lg:hidden"
          >
            ✖
          </Button>

          {isLoading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : isError ? (
            <p className="text-sm text-red-500">Failed to load profile</p>
          ) : profile ? (
            <>
              <img
                src={profile.profileImage || 'https://via.placeholder.com/80'}
                alt="Profile"
                className="w-14 h-14 rounded-full border border-gray-300 shadow-sm"
              />
              <h2 className="text-lg font-semibold mt-2">{profile.username}</h2>
              <p className="text-sm text-gray-500">{profile.email}</p>
            </>
          ) : null}
        </div>

        <ul className="flex flex-col items-start gap-4 mt-4 lg:mt-6 pl-6 w-full">
          <MenuItem to="/dashboard" icon="/images/icon-home.png" label="Home" />
          <MenuItem
            to="/reports"
            icon="/images/icon-report.svg"
            label="Task Reports"
          />
          <MenuItem
            to="/settings"
            icon="/images/icon-setting.png"
            label="Settings"
          />
        </ul>

        <div className="mt-auto pt-8 flex justify-center">
          <Button type="submit" variant="default" onClick={onClickLogout}>
            Log out
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;

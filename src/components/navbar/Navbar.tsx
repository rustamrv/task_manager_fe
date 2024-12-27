import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useDispatch } from 'react-redux';
import { clearToken } from '../../api';
import { useGetProfileQuery } from '../../api/apiSlice';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: profile, isLoading, isError } = useGetProfileQuery();

  const onClickLogout = () => {
    dispatch(clearToken());
    navigate('/');
  };

  return (
    <nav
      className={`flex flex-row lg:flex-col bg-white lg:w-72 w-full h-auto lg:fixed top-0 left-0 lg:gap-6 gap-4 ${className}`}
    >
      {/* User Profile */}
      <div className="flex items-center lg:flex-col lg:items-center gap-4 lg:gap-6">
        {isLoading ? (
          <div className="text-center">
            <p className="text-sm text-gray-500">Loading...</p>
          </div>
        ) : isError ? (
          <div className="text-center">
            <p className="text-sm text-red-500">Failed to load profile</p>
          </div>
        ) : profile ? (
          <>
            <img
              src={profile.profileImage || 'https://via.placeholder.com/80'}
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
            <div className="text-center">
              <h2 className="text-base font-semibold">{profile.username}</h2>
              <p className="text-sm text-gray-500">{profile.email}</p>
            </div>
          </>
        ) : null}
      </div>

      {/* Menu */}
      <ul className="flex flex-row justify-center lg:flex-col gap-4 lg:gap-6 w-full">
        <li className="flex items-center justify-center lg:justify-start">
          <img
            src="/images/icon-home.png"
            alt="Home"
            className="w-5 h-5 mr-2 lg:mr-0"
          />
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? 'font-bold text-blue-600 underline text-sm pl-2'
                : 'text-blue-600 hover:underline text-sm pl-2 hover:text-blue-400'
            }
          >
            Home
          </NavLink>
        </li>
        <li className="flex items-center justify-center lg:justify-start">
          <img
            src="/images/icon-report.svg"
            alt="Task Reports"
            className="w-5 h-5 mr-2 lg:mr-0"
          />
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              isActive
                ? 'font-bold text-blue-600 underline text-sm pl-2'
                : 'text-blue-600 hover:underline text-sm pl-2 hover:text-blue-400'
            }
          >
            Task Reports
          </NavLink>
        </li>
        <li className="flex items-center justify-center lg:justify-start">
          <img
            src="/images/icon-setting.png"
            alt="Settings"
            className="w-5 h-5 mr-2 lg:mr-0"
          />
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive
                ? 'font-bold text-blue-600 underline text-sm pl-2'
                : 'text-blue-600 hover:underline text-sm pl-2 hover:text-blue-400'
            }
          >
            Settings
          </NavLink>
        </li>
      </ul>

      <div className="flex p-4">
        <Button type="submit" variant="default" onClick={onClickLogout}>
          Log out
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;

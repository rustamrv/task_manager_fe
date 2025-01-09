import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useDispatch } from 'react-redux';
import { clearToken } from '../../api/AuthReducer';
import { useGetProfileQuery } from '../../api/endpoints/UserApi';

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

  const MenuItem = ({ to, icon, label }: { to: string; icon: string; label: string }) => (
    <li className="flex items-center justify-center lg:justify-start justify-center">
      <img src={icon} alt={label} className="w-5 h-5 mr-2" />
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
    <nav
      className={`flex flex-row lg:flex-col bg-white lg:w-72 w-full h-auto lg:fixed top-0 left-0 lg:gap-6 gap-4 ${className}`}
    >
      {/* User Profile */}
      <div className="flex flex-col items-center gap-4 lg:gap-6">
        {isLoading ? (
          <p className="text-sm text-gray-500 text-center">Loading...</p>
        ) : isError ? (
          <p className="text-sm text-red-500 text-center">Failed to load profile</p>
        ) : profile ? (
          <div className="flex flex-col items-center text-center">
            <img
              src={profile.profileImage || 'https://via.placeholder.com/80'}
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
            <h2 className="text-base font-semibold">{profile.username}</h2>
            <p className="text-sm text-gray-500">{profile.email}</p>
          </div>
        ) : null}
      </div>

      {/* Menu */}
      <ul className="flex flex-col gap-4 lg:gap-6 mt-6">
        <MenuItem to="/dashboard" icon="/images/icon-home.png" label="Home" />
        <MenuItem to="/reports" icon="/images/icon-report.svg" label="Task Reports" />
        <MenuItem to="/settings" icon="/images/icon-setting.png" label="Settings" />
      </ul>

      {/* Logout Button */}
      <div className="mt-auto">
        <Button type="submit" variant="default" onClick={onClickLogout}>
          Log out
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;

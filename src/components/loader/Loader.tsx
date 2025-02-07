import { Loader } from 'lucide-react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <Loader className="animate-spin w-10 h-10 text-gray-500" />
    <p className="ml-2 text-gray-600">Loading...</p>
  </div>
);

export default LoadingSpinner;

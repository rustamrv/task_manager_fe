import { Input } from '@components/ui/Input';
import { Search } from 'lucide-react';
import { useState } from 'react';

const SearchBar: React.FC<{ onSearch: (query: string) => void }> = ({
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="relative w-full sm:w-96">
      <Input
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={handleChange}
        className="pl-10"
      />
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={20}
      />
    </div>
  );
};

export default SearchBar;

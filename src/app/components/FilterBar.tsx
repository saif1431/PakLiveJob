// src/app/components/FilterBar.tsx
import { Search, MapPin, X, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  locationFilter: string;
  setLocationFilter: (location: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
}

export default function FilterBar({
  searchTerm,
  setSearchTerm,
  locationFilter,
  setLocationFilter,
  roleFilter,
  setRoleFilter,
}: FilterBarProps) {
  const handleClear = () => {
    setSearchTerm("");
    setLocationFilter("");
    setRoleFilter("");
  };

  return (
    <div className="bg-white border-b border-zinc-200 px-8 py-4 flex flex-col lg:flex-row items-center gap-4">
      <div className="relative flex-1 w-full">
        <Search className="size-4 text-[#71717b] absolute left-3 top-1/2 -translate-y-1/2" />
        <Input 
          placeholder="Search jobs by title or company..." 
          className="pl-9 h-11 bg-white text-zinc-900 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="relative w-full lg:w-auto lg:min-w-[200px]">
        <Briefcase className="size-4 text-[#71717b] absolute left-3 top-1/2 -translate-y-1/2" />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full h-11 pl-9 pr-4 rounded-md border border-input bg-white text-zinc-900 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">All Job Roles</option>
          <option value="Frontend">Frontend Developer</option>
          <option value="Backend">Backend Developer</option>
          <option value="Full Stack">Full Stack Developer</option>
          <option value="AI">AI Engineer</option>
          <option value="Data">Data Scientist / Analyst</option>
          <option value="Design">UI/UX Designer</option>
          <option value="Manager">Product / Project Manager</option>
        </select>
      </div>
      
      <div className="relative w-full lg:w-auto lg:min-w-[200px]">
        <MapPin className="size-4 text-[#71717b] absolute left-3 top-1/2 -translate-y-1/2" />
        <Input 
          placeholder="Filter by location..." 
          className="pl-9 h-11 bg-white text-zinc-900 w-full"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />
      </div>

      <Button 
        variant="ghost" 
        className="text-[#71717b] px-4 gap-2 h-11 w-full lg:w-auto"
        onClick={handleClear}
      >
        <X className="size-4" /> Clear
      </Button>
    </div>
  );
}


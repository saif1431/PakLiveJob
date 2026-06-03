// src/app/page.tsx
"use client";

import React, { useState } from "react";
import JobListClient from "./components/JobListClient";
import Header from "./components/Header";
import FilterBar from "./components/FilterBar";
import Footer from "./components/Footer";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [newJobCount, setNewJobCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="bg-zinc-100 text-zinc-950 w-full min-h-screen flex flex-col">
      <Header newJobCount={newJobCount} onRefresh={() => setRefreshKey(prev => prev + 1)} />
      <FilterBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        locationFilter={locationFilter} 
        setLocationFilter={setLocationFilter} 
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      />
      <main className="p-8 flex-1">
        <JobListClient 
          searchTerm={searchTerm} 
          locationFilter={locationFilter} 
          roleFilter={roleFilter} 
          onNewJobs={setNewJobCount} 
          refreshKey={refreshKey}
        />
      </main>
      <Footer />
    </div>
  );
}


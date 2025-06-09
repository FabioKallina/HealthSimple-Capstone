import React, { useState } from 'react'
import "../css/SearchBar.css";

const SearchBar = ({ searchQuery, handleSearch }) => {

  return (
    <div className="search-container">
        <form className="search-form" onSubmit={(e) => e.preventDefault()} />
        <input 
            type="text"
            className="search-input" 
            placeholder="Search for an exercise..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
        />
        <button className="search-btn" type="submit">Search</button>
    </div>
  )
}

export default SearchBar
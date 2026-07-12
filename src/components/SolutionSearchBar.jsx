"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiX, FiMic, FiFileText, FiLoader } from "react-icons/fi";

function slugify(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .trim()
    .replace(/^-|-$/g, "");
}

export default function SolutionSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);
  const router = useRouter();

  const runSearch = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/solutions?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Search error:", e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search — typing ruke 350ms baad hi API call
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runSearch(query);
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [query, runSearch]);

  // Bahar click karte hi dropdown band ho jaaye
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleResultClick(sol) {
    setShowDropdown(false);
    setQuery("");
    router.push(`/solutions/${sol.id}-${slugify(sol.title)}`);
  }

  function handleClear() {
    setQuery("");
    setResults([]);
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-3xl mx-auto">
      {/* Search input — Google-style pill */}
      <div
        className={`flex items-center gap-2 sm:gap-3 bg-white rounded-full border transition-all
        ${
          showDropdown
            ? "border-orange-400 shadow-lg"
            : "border-gray-300 shadow-sm hover:shadow-md"
        } px-4 sm:px-5 py-3 sm:py-3.5`}
      >
        <FiSearch className="text-gray-400 shrink-0" size={18} />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search RTU solved papers, notes, PYQs..."
          className="flex-1 min-w-0 outline-none text-sm sm:text-base text-[#0B1F3F] placeholder:text-gray-400 p-2 bg-transparent"
        />

        {loading && (
          <FiLoader
            className="text-orange-400 animate-spin shrink-0"
            size={16}
          />
        )}

        {query && !loading && (
          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 shrink-0"
            aria-label="Clear search"
          >
            <FiX size={18} />
          </button>
        )}

        <div className="hidden sm:block h-6 w-px bg-gray-200 shrink-0" />

        <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full shrink-0">
          RTU Sold Paper
        </span>
      </div>

      {/* Dropdown results */}
      {showDropdown && query.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden z-50 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">
              Search ho raha hai...
            </div>
          ) : results.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">
              &quot;{query}&quot; ke liye koi solution nahi mila. Alag keyword try karo.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {results.map((sol) => (
                <li key={sol.id}>
                  <button
                    onClick={() => handleResultClick(sol)}
                    className="w-full flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-orange-50 transition-colors text-left"
                  >
                    <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                      {sol.thumbnail_blob_name ? (
                        <img
                          src={`/api/thumbnail?id=${sol.id}`}
                          alt=""
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <FiFileText className="text-orange-400" size={16} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#0B1F3F] truncate">
                        {sol.title}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {sol.subject_name}
                        {sol.solution_type ? ` • ${sol.solution_type}` : ""}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
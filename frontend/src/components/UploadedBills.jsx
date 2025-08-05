import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UploadedBills.css';

const API_BASE_URL = 'http://localhost:3001/api';

const WebcamGallery = () => {
  const [entries, setEntries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchWebcamEntries();
  }, [page, startDate, endDate, categoryFilter, searchTerm]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchWebcamEntries = async () => {
    try {
      const params = {
        page,
        ...(categoryFilter && { category: categoryFilter }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(searchTerm && { search: searchTerm }),
      };

      const res = await axios.get(`${API_BASE_URL}/webcam-entries`, { params });

      setEntries(res.data.data.entries || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error('Error fetching webcam entries:', err);
      setError('Failed to load webcam data');
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <h2 className="mb-4">Uploaded Webcam Entries</h2>

      {/* Filters */}
      <div className="row mb-4 g-3">
        <div className="col-md-3 col-6">
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
          />
        </div>

        <div className="col-md-3 col-6">
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
          />
        </div>

        <div className="col-md-3 col-4">
          <select
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{textTransform: 'capitalize'}}
          >
            <option value="" >All Categories</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat.name} style={{textTransform: 'capitalize'}}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3 col-8">
          <input
            type="text"
            className="form-control"
            placeholder="Search reason or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Page Selector */}
      <div className="row mb-4">
        <div className="col-md-2 ms-auto">
          <select
            className="form-select"
            value={page}
            onChange={(e) => setPage(Number(e.target.value))}
          >
            {[...Array(totalPages)].map((_, idx) => (
              <option key={idx + 1} value={idx + 1}>
                Page {idx + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {error && <div className="alert alert-danger">{error}</div>}

      {entries.length === 0 ? (
        <p className="text-muted">No webcam data found.</p>
      ) : (
        <div className="row">
          {entries.map((entry, idx) => (
            <div className="col-md-4 mb-4" key={idx}>
              <div className="card h-100 shadow-sm">
                <img
                  src={entry.imageUrl}
                  className="card-img-top"
                  alt="Webcam"
                  style={{ height: '200px', objectFit: 'cover', borderBottom: '1px solid #00000043' }}
                />
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 col-6">
                      <h5 className="card-title">{entry.category}</h5>
                    </div>
                    <div className="col-md-6 col-6 time-text">
                      <p className="card-text mb-1">Time: {entry.time}</p>
                      <p className="card-text mb-1">Date: {entry.date}</p>
                    </div>
                  </div>
                  <p className="card-text text-muted small">{entry.reason}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WebcamGallery;

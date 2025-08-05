import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BiCategoryAlt,
  BiListUl,
  BiCheckCircle,
  BiErrorCircle,
  BiPlusCircle,
} from 'react-icons/bi';

const API_BASE_URL = 'http://localhost:3001/api';

const CategoryManager = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(res.data.data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError('Failed to load categories');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await axios.post(`${API_BASE_URL}/categories`, { name, description });
      setMessage('Category added successfully!');
      setName('');
      setDescription('');
      fetchCategories();
    } catch (err) {
      console.error('Failed to add category:', err);
      setError(err.response?.data?.message || 'Error adding category');
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">
            Category Manager
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-4 mb-3">
                <label className="form-label fw-semibold">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Travel, Office"
                  className="form-control"
                  required
                />
              </div>

              <div className="col-8 mb-3">
                <label className="form-label fw-semibold">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write a short description..."
                  className="form-control"
                  rows="1"
                />
              </div>

            </div>
            <button type="submit" className="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2">
              <BiPlusCircle size={20} />
              Add Category
            </button>
          </form>

          {message && (
            <div className="alert alert-success mt-3 d-flex align-items-center gap-2">
              <BiCheckCircle size={20} />
              {message}
            </div>
          )}
          {error && (
            <div className="alert alert-danger mt-3 d-flex align-items-center gap-2">
              <BiErrorCircle size={20} />
              {error}
            </div>
          )}

          <hr className="my-4" />
          <h5 className="mb-3 d-flex align-items-center">
            <BiCategoryAlt className="me-2" />
            Existing Categories
          </h5>

          {categories.length === 0 ? (
            <p className="text-muted">No categories found.</p>
          ) : (
            <div className="d-flex flex-wrap gap-2">
              {categories.map((cat, index) => (
                <div key={index} className="badge bg-secondary text-light p-2 px-3 rounded-pill">
                  <strong style={{textTransform: 'capitalize'}}>{cat.name}</strong>
                  {cat.description && (
                    <span className="ms-2 text-white-50 small" style={{textTransform: 'capitalize'}}>({cat.description})</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;

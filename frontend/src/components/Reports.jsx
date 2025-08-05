import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Reports.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Reports = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('Date');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortOptions, setSortOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/Reports')
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });

    axios.get('http://localhost:3001/Category')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });

    axios.get('http://localhost:3001/Reports')
      .then(response => {
        setSortOptions(['Date', 'Category']);
      })
      .catch(error => {
        console.error('Error fetching sort options:', error);
      });
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  let filteredData = data.filter(item => {
    return (
      item.Date.toLowerCase().includes(search.toLowerCase()) ||
      item.Category.toLowerCase().includes(search.toLowerCase()) ||
      item.Reason.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (selectedCategory) {
    filteredData = filteredData.filter(item => item.Category === selectedCategory);
  }

  if (startDate && endDate) {
    filteredData = filteredData.filter(item => {
      const itemDate = new Date(item.Date);
      return itemDate >= startDate && itemDate <= endDate;
    });
  }

  if (sortOption === 'Date') {
    filteredData = filteredData.sort((a, b) => {
      const dateA = new Date(a.Date);
      const dateB = new Date(b.Date);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  } else if (sortOption === 'Category') {
    filteredData = filteredData.sort((a, b) => {
      const categoryA = a.Category.toLowerCase();
      const categoryB = b.Category.toLowerCase();
      return sortOrder === 'asc' ? categoryA.localeCompare(categoryB) : categoryB.localeCompare(categoryA);
    });
  }

  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between pt-20 mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by Date, Category, or Reason"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="d-flex">
          <select
            className="form-control mx-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <div>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="MM/dd/yyyy"
              placeholderText="Start Date"
            />
            <span> to </span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              dateFormat="MM/dd/yyyy"
              placeholderText="End Date"
            />
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Category</th>
              <th>Reason</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index}>
                <td>{item.Date}</td>
                <td>{item.Time}</td>
                <td>{item.Category}</td>
                <td>{item.Reason}</td>
                <td>
                  {item.Image === 'NA' ? (
                    <span>No Image</span>
                  ) : (
                    <img
                      src={item.Image}
                      alt="Captured"
                      className="img-fluid"
                      style={{ width: '100px', height: 'auto' }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-center mt-3">
        {pageNumbers.map(number => (
          <button key={number} onClick={() => paginate(number)} className="btn btn-primary mx-1">
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Reports;

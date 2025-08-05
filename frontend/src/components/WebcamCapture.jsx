import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import './WebcamCapture.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { BiScan } from 'react-icons/bi';

const API_BASE_URL = 'http://localhost:3001/api';

const WebcamForm = () => {
  const webcamRef = useRef(null);

  const [image, setImage] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState('');
  const [reason, setReason] = useState('');
  const [categories, setCategories] = useState([]);
  const [camView, setCamView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isScanning, setIsScanning] = useState(false);  

  // Fetch categories from backend API
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      if (response.data.success) {
        setCategories(response.data.data);
      } else {
        console.error('Failed to fetch categories');
        // Fallback to hardcoded categories if API fails
        setCategories([
          { name: "Books" },
          { name: "Snacks" },
          { name: "Electric" },
          { name: "Milk" }
        ]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to hardcoded categories
      setCategories([
        { name: "Books" },
        { name: "Snacks" },
        { name: "Electric" },
        { name: "Milk" }
      ]);
    }
  };

  // Capture image and set date/time
  const capture = () => {
    const screenshot = webcamRef.current.getScreenshot();
    const now = new Date();

    setImage(screenshot);
    setDate(now.toLocaleDateString());
    setTime(now.toLocaleTimeString());

    // Clear any previous messages
    setError('');
    setSuccess('');
  };

  // Submit form to backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!image) {
      setError('Please capture an image first!');
      return;
    }

    if (!category) {
      setError('Please select a category!');
      return;
    }

    if (!reason || reason.trim().length < 3) {
      setError('Please enter a reason (minimum 3 characters)!');
      return;
    }

    setLoading(true);

    try {
      const formData = {
        date,
        time,
        category,
        reason: reason.trim(),
        image,
      };

      console.log('Submitting form data:', {
        ...formData,
        image: formData.image.substring(0, 50) + '...'
      });

      const response = await axios.post(`${API_BASE_URL}/webcam-entries`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      });

      if (response.data.success) {
        setSuccess('Entry saved successfully!');
        console.log('Success response:', response.data);

        // Reset form fields after successful submission
        setImage(null);
        setDate('');
        setTime('');
        setCategory('');
        setReason('');

        // Auto-hide success message after 5 seconds
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(response.data.message || 'Error saving entry');
      }
      setIsScanning(false);
    }

    catch (error) {
      console.error('Error submitting form:', error);

      if (error.code === 'ECONNABORTED') {
        setError('Request timeout. Please check your internet connection and try again.');
      } else if (error.response?.status === 400) {
        // Handle validation errors
        if (error.response.data.errors) {
          const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
          setError(`Validation errors: ${errorMessages}`);
        } else {
          setError(error.response.data.message || 'Invalid data submitted');
        }
      } else if (error.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (error.request) {
        setError('Cannot connect to server. Please check if the backend is running on http://localhost:3001');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetake = () => {
    setImage(null);
    setDate('');
    setTime('');
  }

  // Toggle camera view
  const handleCamView = () => {
    setCamView(!camView);
  };

  // Toggle scanning mode
  const handleScan = () => {
    setIsScanning(true);
  };

  // Clear error/success messages after 10 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="container mt-4 pt-5">
      <div className="row gy-4 up-down">
        <div className="col-12">
          {/* Error Alert */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <strong>Error!</strong> {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError('')}
                aria-label="Close"
              ></button>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <strong>Success!</strong> {success}
              <button
                type="button"
                className="btn-close"
                onClick={() => setSuccess('')}
                aria-label="Close"
              ></button>
            </div>
          )}
        </div>

        {/* Webcam Section */}
        <div className="col-md-6 text-center webcam">
          {!isScanning ? (
            <div className="buttons">
              <button
              onClick={handleScan}
              className="scan-btn"
              disabled={loading}
            >
              <BiScan size={24} className='icon-scale'/>
            </button>
            </div>
          ) : !image ? (
            <>
              <Webcam
                key={camView ? 'user' : 'environment'}
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/png"
                screenshotQuality={1}
                videoConstraints={{ facingMode: camView ? 'user' : 'environment' }}
                style={{ width: '100%', borderRadius: '10px' }}
              />
              <div className='buttons'>
                <button
                  className='btn btn-primary'
                  onClick={handleCamView}
                  disabled={loading}
                >
                  {camView ? "Switch to Rear Camera" : "Switch to Front Camera"}
                </button>
                <button
                  onClick={capture}
                  className="btn btn-primary mt-2"
                  disabled={loading}
                >
                  Capture Image
                </button>
              </div>
            </>
          ) : (
            <>
              <img
                src={image}
                alt="Captured"
                style={{ width: '100%', borderRadius: '10px' }}
              />
              <div className="mt-2">
                <div className="buttons">
                  <button
                    onClick={handleRetake}
                    className="btn btn-secondary me-2"
                    disabled={loading}
                  >
                    Retake
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Form Section */}
        <div className="col-md-6 form pt-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label"><b>Date:</b></label>
              <input
                className="form-control"
                type="text"
                value={date}
                readOnly
                placeholder="Will auto-fill on capture"
              />
            </div>

            <div className="mb-3">
              <label className="form-label"><b>Time:</b></label>
              <input
                className="form-control"
                type="text"
                value={time}
                readOnly
                placeholder="Will auto-fill on capture"
              />
            </div>

            <div className="mb-3">
              <label className="form-label"><b>Category:</b></label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                disabled={loading}
                style={{textTransform: 'capitalize'}}
              >
                <option value="">Select Category</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat.name} style={{textTransform: 'capitalize'}}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label"><b>Reason:</b></label>
              <textarea
                className="form-control"
                rows="1"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                minLength="3"
                disabled={loading}
              />
            </div>

            <div className="mt-4 buttons">
              <button
                type="submit"
                className="btn btn-success"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WebcamForm;

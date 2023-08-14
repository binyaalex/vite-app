import React, { useRef, useState, useEffect } from 'react';
import './app.css'

function App() {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    fetchApplicants();
  }, []);

  async function fetchApplicants() {
    try {
      const response = await fetch('http://localhost:3000/applicants');
      const data = await response.json();
      console.log(data);
      setApplicants(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const fileInputRef = useRef(null);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    console.log(fileInputRef.current.files);
    formData.append('pdf', fileInputRef.current.files[0]);

    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('File uploaded successfully');
        fetchApplicants()
      } else {
        console.error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };


  return (
    <>
      <h1>Upload PDF</h1>
      <form onSubmit={handleFormSubmit}>
        <input className='uploadInput' type="file" name="pdf" accept=".pdf" required ref={fileInputRef}/>
        <button className='uploadButton' type="submit">Upload</button>
      </form>

      <h1>Applicants List</h1>
      <table>
        <tr>
          <th>ID</th>
          <th>Candidate name</th>
          <th>LinkedIn</th>
          <th>PDF</th>
        </tr>
        <tbody>
          {applicants.map(applicant => (
            <tr key={applicant._id}>
              <td>{applicant.id || "-"}</td>
              <td className='name'>
                {applicant.firstName || applicant.lastName
                ? `${applicant.firstName || ''} ${applicant.lastName}`
                : '-'}
              </td>
              <td>
              {applicant.linkedin ? (
                <a href={applicant.linkedin} target="_blank" rel="noopener noreferrer">
                  Open
                </a>
              ) : (
                '-'
              )}
              </td>
              <td><a href={`http://localhost:3000/download/${applicant._id}`} target="_blank">Download PDF</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default App

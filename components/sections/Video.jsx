// File: pages/create-meeting.js
'use client';
import { useState } from 'react';
import Head from 'next/head';

export default function CreateMeeting() {
  const [formData, setFormData] = useState({
    topic: '',
    invitees: '',
    start_time: '',
    duration: ''
  });
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:4000/create-zoom-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          invitees: formData.invitees.split(',').map((email) => email.trim())
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'An error occurred while creating the meeting.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>Create Zoom Meeting</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="mb-4 text-2xl font-bold">Create Zoom Meeting</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="topic" className="mb-1 block">
              Meeting Topic:
            </label>
            <input
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              required
              className="w-full rounded border p-2"
            />
          </div>
          <div>
            <label htmlFor="invitees" className="mb-1 block">
              Invitees (comma-separated emails):
            </label>
            <input
              type="text"
              id="invitees"
              name="invitees"
              value={formData.invitees}
              onChange={handleChange}
              required
              className="w-full rounded border p-2"
            />
          </div>
          <div>
            <label htmlFor="start_time" className="mb-1 block">
              Start Time:
            </label>
            <input
              type="datetime-local"
              id="start_time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              className="w-full rounded border p-2"
            />
          </div>
          <div>
            <label htmlFor="duration" className="mb-1 block">
              Duration (minutes):
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full rounded border p-2"
            />
          </div>
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Meeting'}
          </button>
        </form>

        {result && (
          <div className="mt-8">
            <h2 className="mb-2 text-xl font-semibold">Result:</h2>
            {result.success ? (
              <div>
                <p>
                  Meeting link:{' '}
                  <a
                    href={result.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {result.meetingLink}
                  </a>
                </p>
                <p>Meeting ID: {result.meetingId}</p>
                <p>Password: {result.password}</p>
                <h3 className="mt-2 font-semibold">Invitees:</h3>
                <ul>
                  {result.invitees &&
                    result.invitees.map((invitee, index) => (
                      <li key={index}>{invitee.email}</li>
                    ))}
                </ul>
              </div>
            ) : (
              <p className="text-red-500">{result.error}</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

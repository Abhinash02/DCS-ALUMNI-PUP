import React, { useState } from 'react';
import axios from 'axios';
import API from '../../api/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdminBulkEmail = () => {
  const [bulkEmailSubject, setBulkEmailSubject] = useState('');
  const [bulkEmailMessage, setBulkEmailMessage] = useState('');
  const [isSendingBulkEmail, setIsSendingBulkEmail] = useState(false);
  const [emailProgress, setEmailProgress] = useState(null);
  const [abortController, setAbortController] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleBulkEmailSubmit = async (e) => {
    e.preventDefault();
    if (!bulkEmailSubject.trim() || !bulkEmailMessage.trim()) {
      setError('Subject and message are required.');
      return;
    }

    setIsSendingBulkEmail(true);
    setError('');
    setSuccess('');
    setEmailProgress(null);

    try {
      const token = localStorage.getItem('token');
      // Using API baseURL config usually set in axios, but fetch needs absolute URL if API is on another port.
      const baseUrl = API.defaults.baseURL || 'https://dcs-alumni.vercel.app/api';

      const controller = new AbortController();
      setAbortController(controller);

      let lastParsedIndex = 0;

      await axios.post(`${baseUrl}/alumni/bulk-email`, {
        subject: bulkEmailSubject,
        message: bulkEmailMessage
      }, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
        responseType: 'text',
        onDownloadProgress: (progressEvent) => {
          const target = progressEvent.event.target || progressEvent.event.currentTarget;
          if (!target || typeof target.responseText !== 'string') return;

          const buffer = target.responseText;
          if (!buffer) return;

          // Get only the new data since last parse
          const newChunks = buffer.substring(lastParsedIndex);

          const lines = newChunks.split('\n\n');
          for (let i = 0; i < lines.length - 1; i++) {
            const line = lines[i];
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.substring(6));
                if (data.status === 'error') {
                  setError(data.error);
                } else {
                  setEmailProgress(data);
                  if (data.status === 'completed') {
                    setSuccess(`Successfully sent bulk email to ${data.sent} recipients!`);
                    setBulkEmailSubject('');
                    setBulkEmailMessage('');
                  }
                }
              } catch (e) {
                // Ignore parse errors
              }
            }
            // Update last parsed index to avoid parsing the same chunks
            lastParsedIndex += line.length + 2;
          }
        }
      });
    } catch (err) {
      console.error('Bulk Email Error:', err);
      if (err.name === 'AbortError') {
        setSuccess('Bulk email sending was cancelled.');
        setEmailProgress(prev => prev ? { ...prev, status: 'cancelled' } : null);
      } else {
        setError(err.message || 'Failed to send bulk emails.');
      }
    } finally {
      setIsSendingBulkEmail(false);
      setAbortController(null);
      setTimeout(() => setEmailProgress(null), 5000); // Hide progress after 5s
    }
  };

  const cancelBulkEmail = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  return (
    <section className="bg-gray-800 p-8 rounded-xl shadow-2xl animate__animated animate__fadeInUp">
      {error && (
        <p className="text-black bg-red-900 bg-opacity-50 p-4 rounded-lg mb-4 animate__animated animate__shakeX">{error}</p>
      )}
      {success && (
        <p className="text-white bg-green-900 bg-opacity-50 p-4 rounded-lg mb-4 animate__animated animate__shakeX">{success}</p>
      )}

      <h3 className="text-2xl font-semibold text-blue-400 mb-6">Send Bulk Email</h3>
      <p className="text-gray-300 mb-6">This will send an email to all approved alumni in the database as well as those listed in the aluminiData.json file.</p>

      <form onSubmit={handleBulkEmailSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
          <input
            type="text"
            value={bulkEmailSubject}
            onChange={(e) => setBulkEmailSubject(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border-1.5 border-black rounded-lg text-black shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3"
            placeholder="Enter email subject"
            required
            disabled={isSendingBulkEmail}
          />
        </div>

        <div className="bg-white rounded-lg text-black overflow-hidden">
          <ReactQuill
            theme="snow"
            value={bulkEmailMessage}
            onChange={setBulkEmailMessage}
            className="h-64 mb-12"
            placeholder="Type your rich text message here... (Bold, Italics, Lists, etc.)"
            readOnly={isSendingBulkEmail}
            modules={{
              toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link'],
                ['clean']
              ],
            }}
          />
        </div>

        {/* Live Progress Bar */}
        {emailProgress && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6 mt-6 shadow-lg animate__animated animate__fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-white flex items-center">
                <span className="mr-2">
                  {emailProgress.status === 'completed' ? '✅' : emailProgress.status === 'cancelled' ? '🚫' : '🚀'}
                </span>
                Sending Bulk Email
              </h4>
              {isSendingBulkEmail && (
                <button
                  type="button"
                  onClick={cancelBulkEmail}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-1 px-3 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
            <div className="flex justify-between text-sm text-gray-300 mb-2 font-medium">
              <span className={emailProgress.sent > 0 ? "text-green-400 font-bold" : ""}>
                {emailProgress.sent} Sent Successfully
              </span>
              <span>{emailProgress.total} Total Recipients</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 mb-2 shadow-inner overflow-hidden flex">
              <div
                className="bg-green-500 h-4 transition-all duration-500 ease-out"
                style={{ width: `${emailProgress.total > 0 ? (emailProgress.sent / emailProgress.total) * 100 : 0}%` }}
              ></div>
              <div
                className="bg-red-500 h-4 transition-all duration-500 ease-out"
                style={{ width: `${emailProgress.total > 0 ? (emailProgress.failed / emailProgress.total) * 100 : 0}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs mt-3">
              <span className="text-gray-400">Status: <span className="text-blue-400 capitalize">{emailProgress.status}</span></span>
              {emailProgress.failed > 0 && (
                <span className="text-red-400 font-bold text-sm bg-red-900 bg-opacity-30 px-2 py-1 rounded">
                  {emailProgress.failed} Failed (Google rate limit)
                </span>
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          className={`w-full bg-blue hover:bg-blue text-white font-semibold rounded-lg py-3 px-4 transition-colors transform ${isSendingBulkEmail || !bulkEmailSubject.trim() || !bulkEmailMessage.trim() ? 'opacity-50 cursor-not-allowed' : 'animate__animated animate__pulse animate__infinite'
            }`}
          disabled={isSendingBulkEmail || !bulkEmailSubject.trim() || !bulkEmailMessage.trim()}
        >
          {isSendingBulkEmail ? 'Broadcasting...' : 'Send Bulk Email to All Alumni'}
        </button>
      </form>
    </section>
  );
};

export default AdminBulkEmail;

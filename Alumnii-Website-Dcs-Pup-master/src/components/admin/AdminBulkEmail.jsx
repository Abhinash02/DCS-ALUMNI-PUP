import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../../api/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Mail, Send, AlertCircle, CheckCircle2 } from 'lucide-react';

const AdminBulkEmail = () => {
  const [bulkEmailSubject, setBulkEmailSubject] = useState('');
  const [bulkEmailMessage, setBulkEmailMessage] = useState('');
  const [resumeEmail, setResumeEmail] = useState('');
  const [isSendingBulkEmail, setIsSendingBulkEmail] = useState(false);
  const [emailProgress, setEmailProgress] = useState(null);
  const [abortController, setAbortController] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('All Batches');

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const baseUrl = API.defaults.baseURL || 'https://dcs-alumni.vercel.app/api';
        const response = await axios.get(`${baseUrl}/alumni/batches`);
        setBatches(response.data);
      } catch (err) {
        console.error('Failed to fetch batches:', err);
      }
    };
    fetchBatches();
  }, []);

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
        message: bulkEmailMessage,
        resumeFromEmail: resumeEmail,
        batch: selectedBatch
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
    <section className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 animate__animated animate__fadeInUp transition-colors duration-200">
      {error && (
        <div className="text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 p-4 rounded-xl mb-6 flex items-center gap-2.5 text-sm font-medium animate__animated animate__shakeX">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl mb-6 flex items-center gap-2.5 text-sm font-medium animate__animated animate__fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
          <span>{success}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
        <div className="p-2.5 bg-blue-50 dark:bg-blue-500/20 rounded-xl text-blue-700 dark:text-blue-300">
          <Mail className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Broadcast Bulk Email</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Deliver formatted newsletters, reunion invites, and career updates to approved alumni</p>
        </div>
      </div>

      <form onSubmit={handleBulkEmailSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Email Subject <span className="text-red-500 font-bold ml-1">*</span>
          </label>
          <input
            type="text"
            value={bulkEmailSubject}
            onChange={(e) => setBulkEmailSubject(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition duration-200 text-sm shadow-sm"
            placeholder="e.g., Annual Alumni Meet 2026 – Welcome Home to DCS PUP"
            required
            disabled={isSendingBulkEmail}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Target Audience
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition duration-200 text-sm shadow-sm"
              disabled={isSendingBulkEmail}
            >
              <option value="All Batches">All Graduated & Registered Batches</option>
              {batches.map((b, i) => (
                <option key={i} value={b}>Batch {b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Resume From Email Address (Optional)
            </label>
            <input
              type="email"
              value={resumeEmail}
              onChange={(e) => setResumeEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none transition duration-200 text-sm shadow-sm"
              placeholder="e.g., failed_email@example.com"
              disabled={isSendingBulkEmail}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Rich-Text Email Content <span className="text-red-500 font-bold ml-1">*</span>
          </label>
          <div className="rounded-xl border border-slate-300 dark:border-slate-600 overflow-hidden bg-white text-slate-900 shadow-sm">
            <ReactQuill
              theme="snow"
              value={bulkEmailMessage}
              onChange={setBulkEmailMessage}
              className="h-64 mb-12"
              placeholder="Compose your rich text newsletter or announcement here..."
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
        </div>

        {/* Live Progress Bar */}
        {emailProgress && (
          <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-md animate__animated animate__fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{emailProgress.status === 'completed' ? '✅' : emailProgress.status === 'cancelled' ? '🚫' : '🚀'}</span>
                <span>Broadcasting Bulk Email</span>
              </h4>
              {isSendingBulkEmail && (
                <button
                  type="button"
                  onClick={cancelBulkEmail}
                  className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold py-1.5 px-3 rounded-lg transition"
                >
                  Cancel Broadcast
                </button>
              )}
            </div>
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300 mb-2 font-semibold">
              <span className={emailProgress.sent > 0 ? "text-emerald-600 dark:text-emerald-400 font-bold" : ""}>
                {emailProgress.sent} Delivered Successfully
              </span>
              <span>{emailProgress.total} Total Recipients</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-2 shadow-inner overflow-hidden flex">
              <div
                className="bg-emerald-500 h-3 transition-all duration-500 ease-out"
                style={{ width: `${emailProgress.total > 0 ? (emailProgress.sent / emailProgress.total) * 100 : 0}%` }}
              ></div>
              <div
                className="bg-red-500 h-3 transition-all duration-500 ease-out"
                style={{ width: `${emailProgress.total > 0 ? (emailProgress.failed / emailProgress.total) * 100 : 0}%` }}
              ></div>
            </div>
            {emailProgress.lastEmail && (
              <div className="text-center text-xs text-amber-700 dark:text-yellow-400 font-mono mb-2 bg-amber-50 dark:bg-slate-800 p-1.5 rounded-lg border border-amber-200 dark:border-slate-700">
                Last Processed: {emailProgress.lastEmail}
              </div>
            )}
            <div className="flex justify-between text-xs mt-3">
              <span className="text-slate-500 dark:text-slate-400">Status: <span className="text-blue-600 dark:text-blue-400 font-bold capitalize">{emailProgress.status}</span></span>
              {emailProgress.failed > 0 && (
                <span className="text-red-600 font-bold text-xs bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded border border-red-200">
                  {emailProgress.failed} Failed
                </span>
              )}
            </div>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            className={`w-full md:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-blue to-darkBlue text-white font-semibold shadow-md shadow-blue-900/20 hover:opacity-95 active:scale-[0.99] transition duration-200 text-sm flex items-center justify-center gap-2 ${
              isSendingBulkEmail || !bulkEmailSubject.trim() || !bulkEmailMessage.trim() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isSendingBulkEmail || !bulkEmailSubject.trim() || !bulkEmailMessage.trim()}
          >
            <Send className="w-4 h-4" />
            <span>{isSendingBulkEmail ? 'Broadcasting Emails...' : 'Send Bulk Email to All Alumni'}</span>
          </button>
        </div>
      </form>
    </section>
  );
};

export default AdminBulkEmail;

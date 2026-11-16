import React, { useState } from 'react';
import { Star, Check } from 'lucide-react';
import { api } from '../services/api';

export default function FeedbackWidget({ scanId }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.submitFeedback({
        scan_id: scanId || undefined,
        rating,
        feedback_text: comment.trim() || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Feedback error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center gap-2 text-xs text-emerald-400">
        <Check className="w-4 h-4" />
        <span>Thank you for your feedback! Your rating helps calibrate our models.</span>
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-center sm:text-left">
          <p className="text-xs font-semibold text-slate-300">Was this detection accurate?</p>
          <p className="text-[11px] text-slate-500">Rate the explanation and risk assessment</p>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 text-slate-600 hover:scale-110 transition"
            >
              <Star
                className={`w-4 h-4 ${
                  (hoverRating || rating) >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Optional: How can the explanation or accuracy be improved?"
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

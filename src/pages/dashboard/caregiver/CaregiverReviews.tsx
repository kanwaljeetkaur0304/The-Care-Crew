import { useState } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { type Review } from '../../../data/dashboardMockData';
import DashboardEmptyState from '../../../components/dashboard/DashboardEmptyState';

export default function CaregiverReviews() {
  const { isDark } = useTheme();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  const submitReply = (id: string) => {
    if (!replyText.trim()) return;
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, reply: replyText.trim() } : r));
    setReplyingTo(null);
    setReplyText('');
  };

  const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className={`font-display text-2xl font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
          Reviews
        </h2>
        <p className={`text-sm mt-1 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
          What families say about you
        </p>
      </div>

      {/* Rating Summary */}
      {reviews.length > 0 && (
        <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-start gap-6 ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
          <div className="text-center shrink-0">
            <div className="font-display text-5xl font-bold text-gold">{avgRating}</div>
            <div className="flex items-center justify-center gap-0.5 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(Number(avgRating)) ? 'fill-gold text-gold' : isDark ? 'text-void-border' : 'text-light-border'}`} />
              ))}
            </div>
            <div className={`text-xs mt-1.5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{reviews.length} reviews</div>
          </div>

          {/* Distribution */}
          <div className="flex-1 space-y-2 w-full">
            {ratingDist.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-2">
                <span className={`text-xs w-2 text-right ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{star}</span>
                <Star className="w-3 h-3 fill-gold text-gold shrink-0" />
                <div className={`flex-1 h-2 rounded-full overflow-hidden ${isDark ? 'bg-void-lighter' : 'bg-light-surface-2'}`}>
                  <div
                    className="h-full bg-gradient-to-r from-maroon to-gold rounded-full"
                    style={{ width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : '0%' }}
                  />
                </div>
                <span className={`text-xs w-3 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <DashboardEmptyState
          icon={Star}
          title="No reviews yet"
          description="Complete your first job and ask the family to leave you a review."
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className={`rounded-2xl border p-5 ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}>
              {/* Reviewer */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${review.fromColor} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
                    {review.fromInitials}
                  </div>
                  <div>
                    <div className={`font-semibold text-sm ${isDark ? 'text-ink' : 'text-light-text'}`}>{review.fromFamily}</div>
                    <div className={`text-xs ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>{review.category}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-0.5 justify-end">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-gold text-gold' : isDark ? 'text-void-border' : 'text-light-border'}`} />
                    ))}
                  </div>
                  <div className={`text-xs mt-0.5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                    {new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Comment */}
              <p className={`text-sm leading-relaxed ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>{review.comment}</p>

              {/* Existing Reply */}
              {review.reply && (
                <div className={`mt-4 pl-4 border-l-2 border-gold/40`}>
                  <div className={`text-xs font-semibold mb-1 ${isDark ? 'text-gold' : 'text-maroon'}`}>Your reply</div>
                  <p className={`text-sm ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>{review.reply}</p>
                </div>
              )}

              {/* Reply UI */}
              {!review.reply && (
                replyingTo === review.id ? (
                  <div className="mt-4 space-y-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a thank-you reply..."
                      rows={3}
                      className={`w-full text-sm px-3 py-2 rounded-xl border outline-none resize-none ${isDark ? 'bg-void border-void-border text-ink placeholder:text-ink-muted' : 'bg-light-bg border-light-border text-light-text placeholder:text-light-text-muted'}`}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setReplyingTo(null); setReplyText(''); }}
                        className={`text-xs px-3 py-1.5 rounded-lg border ${isDark ? 'border-void-border text-ink-muted' : 'border-light-border text-light-text-muted'}`}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => submitReply(review.id)}
                        className="flex items-center gap-1.5 text-xs px-4 py-1.5 rounded-lg bg-gradient-to-r from-maroon to-gold text-white font-semibold btn-press"
                      >
                        <Send className="w-3 h-3" /> Post Reply
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setReplyingTo(review.id)}
                    className={`mt-3 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${isDark ? 'border-void-border text-ink-muted hover:border-gold/40 hover:text-gold' : 'border-light-border text-light-text-muted hover:border-maroon/30 hover:text-maroon'}`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Reply
                  </button>
                )
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

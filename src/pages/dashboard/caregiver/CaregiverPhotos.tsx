import { useState } from 'react';
import { Camera, Plus, Trash2, Video, Image, Edit2, Check, X } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { MOCK_MEDIA, type MediaItem } from '../../../data/dashboardMockData';
import DashboardEmptyState from '../../../components/dashboard/DashboardEmptyState';

export default function CaregiverPhotos() {
  const { isDark } = useTheme();
  const [media, setMedia] = useState<MediaItem[]>(MOCK_MEDIA);
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [captionText, setCaptionText] = useState('');
  const [filter, setFilter] = useState<'all' | 'photo' | 'video'>('all');

  const displayed = filter === 'all' ? media : media.filter((m) => m.type === filter);

  const deleteItem = (id: string) => setMedia((prev) => prev.filter((m) => m.id !== id));

  const startEditCaption = (item: MediaItem) => {
    setEditingCaption(item.id);
    setCaptionText(item.caption);
  };

  const saveCaption = (id: string) => {
    setMedia((prev) => prev.map((m) => m.id === id ? { ...m, caption: captionText } : m));
    setEditingCaption(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`font-display text-2xl font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>
            Photos &amp; Videos
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
            {media.length} items · Show families who you are
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-maroon to-gold text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity btn-press shadow-md shadow-maroon/20 shrink-0">
          <Plus className="w-4 h-4" />
          Upload Media
        </button>
      </div>

      {/* Tips Banner */}
      <div className={`p-4 rounded-2xl border flex items-start gap-3 ${isDark ? 'bg-gold/5 border-gold/20' : 'bg-gold/10 border-gold/20'}`}>
        <Camera className="w-5 h-5 text-gold shrink-0 mt-0.5" />
        <div>
          <div className={`text-sm font-semibold ${isDark ? 'text-ink' : 'text-light-text'}`}>Profile tips</div>
          <div className={`text-xs mt-0.5 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
            Profiles with a headshot photo get 3× more contact requests. Add a short intro video to stand out even more.
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'photo', 'video'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              filter === f
                ? 'bg-gradient-to-r from-maroon to-gold text-white border-transparent'
                : isDark ? 'bg-void-light border-void-border text-ink-light hover:border-gold/40' : 'bg-white border-light-border text-light-text-2 hover:border-maroon/30'
            }`}
          >
            {f === 'photo' ? <Image className="w-3.5 h-3.5" /> : f === 'video' ? <Video className="w-3.5 h-3.5" /> : null}
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== 'all' && <span className="opacity-70">({media.filter((m) => m.type === f).length})</span>}
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <DashboardEmptyState
          icon={Camera}
          title="No media yet"
          description="Upload a profile photo and a short intro video to attract more families."
          actionLabel="Upload Your First Photo"
          onAction={() => {}}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Upload Placeholder */}
          <button className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 transition-colors ${isDark ? 'border-void-border text-ink-muted hover:border-gold/40 hover:text-gold' : 'border-light-border text-light-text-muted hover:border-maroon/30 hover:text-maroon'}`}>
            <Plus className="w-8 h-8" />
            <span className="text-sm font-medium">Add Photo / Video</span>
          </button>

          {displayed.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-void-light border-void-border' : 'bg-white border-light-border'}`}
            >
              {/* Preview */}
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <img
                  src={item.type === 'video' ? item.thumbnail : item.url}
                  alt={item.caption}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x225?text=Image'; }}
                />
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                      <Video className="w-5 h-5 text-maroon ml-0.5" />
                    </div>
                  </div>
                )}
                <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${item.type === 'video' ? 'bg-maroon text-white' : 'bg-white/80 text-gray-700'}`}>
                  {item.type}
                </div>
              </div>

              {/* Caption */}
              <div className="p-3">
                {editingCaption === item.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={captionText}
                      onChange={(e) => setCaptionText(e.target.value)}
                      className={`flex-1 text-xs px-2 py-1.5 rounded-lg border outline-none ${isDark ? 'bg-void border-void-border text-ink' : 'bg-light-bg border-light-border text-light-text'}`}
                      autoFocus
                    />
                    <button onClick={() => saveCaption(item.id)} className="p-1 text-emerald-500 hover:text-emerald-600"><Check className="w-4 h-4" /></button>
                    <button onClick={() => setEditingCaption(null)} className={`p-1 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-xs flex-1 ${isDark ? 'text-ink-light' : 'text-light-text-2'}`}>{item.caption}</p>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => startEditCaption(item)}
                        className={`p-1 rounded-lg transition-colors ${isDark ? 'text-ink-muted hover:text-gold' : 'text-light-text-muted hover:text-maroon'}`}
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className={`p-1 rounded-lg transition-colors ${isDark ? 'text-ink-muted hover:text-red-400' : 'text-light-text-muted hover:text-red-500'}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
                <div className={`text-[10px] mt-1 ${isDark ? 'text-ink-muted' : 'text-light-text-muted'}`}>
                  Uploaded {new Date(item.uploadDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

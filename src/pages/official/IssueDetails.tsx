import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Link as LinkIcon,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertTriangle,
  Camera
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { OfficialTaskCard, IssueInternalNote } from '@/types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const IssueDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [issue, setIssue] = useState<OfficialTaskCard | null>(null);
  const [notes, setNotes] = useState<IssueInternalNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchIssueDetails();
      fetchInternalNotes();
    }
  }, [id]);

  const fetchIssueDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setIssue(data);
    } catch (error) {
      console.error('Error fetching issue:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInternalNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('issue_internal_notes')
        .select(`
          *,
          user_profiles!issue_internal_notes_official_id_fkey(full_name)
        `)
        .eq('issue_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleMarkInProgress = async () => {
    if (!issue) return;
    setActionLoading(true);

    try {
      const { error } = await supabase
        .from('issues')
        .update({ 
          status: 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', issue.id);

      if (error) throw error;

      // Add automatic note
      await supabase
        .from('issue_internal_notes')
        .insert({
          issue_id: issue.id,
          official_id: (await supabase.auth.getUser()).data.user?.id,
          note: 'Issue acknowledged and marked as in-progress.'
        });

      fetchIssueDetails();
      fetchInternalNotes();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkResolved = () => {
    if (!issue) return;
    navigate(`/official/issue/${issue.id}/upload-resolution`);
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !issue) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('issue_internal_notes')
        .insert({
          issue_id: issue.id,
          official_id: user?.id,
          note: newNote.trim()
        });

      if (error) throw error;

      setNewNote('');
      fetchInternalNotes();
    } catch (error) {
      console.error('Error adding note:', error);
      alert('Failed to add note. Please try again.');
    }
  };

  const handleGetDirections = () => {
    if (!issue?.latitude || !issue?.longitude) {
      alert('Location coordinates not available');
      return;
    }

    // Open native maps app
    const url = `https://www.google.com/maps/dir/?api=1&destination=${issue.latitude},${issue.longitude}`;
    window.open(url, '_blank');
  };

  const handleCopyLocation = () => {
    if (!issue?.latitude || !issue?.longitude) {
      alert('Location coordinates not available');
      return;
    }

    const url = `https://www.google.com/maps?q=${issue.latitude},${issue.longitude}`;
    navigator.clipboard.writeText(url);
    alert('Location link copied to clipboard!');
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading issue details...</p>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Issue Not Found</h2>
          <button
            onClick={() => navigate('/official/dashboard')}
            className="text-blue-600 hover:text-blue-700"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/official/dashboard')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Issue #{issue.id.slice(0, 8).toUpperCase()}
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getUrgencyColor(issue.urgency)}`}>
                  {issue.urgency?.toUpperCase() || 'NORMAL'}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {issue.category} • Reported {new Date(issue.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Section 1: The Problem */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              The Problem
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {issue.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {issue.description}
                </p>
              </div>

              {issue.image && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    "Before" Photo (from Citizen):
                  </p>
                  <img
                    src={issue.image}
                    alt="Issue"
                    className="w-full max-w-2xl rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Location & Path */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Location & Path
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {issue.location}
                  </p>
                  {issue.latitude && issue.longitude && (
                    <p className="text-sm text-gray-500">
                      {issue.latitude.toFixed(6)}, {issue.longitude.toFixed(6)}
                    </p>
                  )}
                </div>
              </div>

              {/* Map */}
              {issue.latitude && issue.longitude && (
                <div className="h-64 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <MapContainer
                    center={[issue.latitude, issue.longitude]}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <Marker position={[issue.latitude, issue.longitude]}>
                      <Popup>{issue.title}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleGetDirections}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Navigation className="w-5 h-5" />
                  GET DIRECTIONS
                </button>
                <button
                  onClick={handleCopyLocation}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  <LinkIcon className="w-5 h-5" />
                  COPY LOCATION LINK
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Status & Action */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Status & Action
            </h2>

            <div className="space-y-4">
              {/* Current Status */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Status:</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {issue.status.replace('_', ' ').toUpperCase()}
                </p>
              </div>

              {/* Action Buttons based on status */}
              {issue.status === 'assigned' && (
                <button
                  onClick={handleMarkInProgress}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold text-lg disabled:opacity-50"
                >
                  <Clock className="w-6 h-6" />
                  MARK AS 'IN-PROGRESS'
                </button>
              )}

              {issue.status === 'in_progress' && (
                <button
                  onClick={handleMarkResolved}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
                >
                  <CheckCircle className="w-6 h-6" />
                  MARK AS 'RESOLVED'
                </button>
              )}

              {issue.status === 'pending_approval' && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-green-800 dark:text-green-300 font-medium">
                    ✓ This issue has been submitted for admin approval
                  </p>
                </div>
              )}

              {/* Add Internal Note */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <button
                  onClick={() => document.getElementById('note-input')?.focus()}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium mb-4"
                >
                  <MessageSquare className="w-5 h-5" />
                  ADD INTERNAL NOTE
                </button>

                <div className="space-y-3">
                  <textarea
                    id="note-input"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="e.g., Dispatched Crew A at 10:30 AM. ETA 2 hours..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                    rows={3}
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Note
                  </button>
                </div>
              </div>

              {/* Internal Notes History */}
              {notes.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Internal Notes History
                  </h3>
                  <div className="space-y-3">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        <p className="text-gray-900 dark:text-white mb-2">{note.note}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {note.official_name || 'Official'} • {new Date(note.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IssueDetails;

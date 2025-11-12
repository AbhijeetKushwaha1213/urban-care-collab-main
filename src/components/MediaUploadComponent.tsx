import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Video, 
  Mic, 
  Upload, 
  X, 
  Play, 
  Pause, 
  Square, 
  Image as ImageIcon,
  FileImage,
  FileVideo,
  Volume2,
  Trash2,
  Plus,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface MediaFile {
  id: string;
  file: File;
  type: 'image' | 'video' | 'audio';
  url: string;
  name: string;
  size: number;
  duration?: number;
}

interface MediaUploadComponentProps {
  onMediaChange: (files: MediaFile[]) => void;
  maxImages?: number;
  maxVideos?: number;
  maxAudioFiles?: number;
  maxFileSize?: number; // in MB
}

const MediaUploadComponent: React.FC<MediaUploadComponentProps> = ({
  onMediaChange,
  maxImages = 5,
  maxVideos = 2,
  maxAudioFiles = 3,
  maxFileSize = 50 // 50MB default
}) => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioElementsRef = useRef<{ [key: string]: HTMLAudioElement }>({});

  // File size validation
  const validateFileSize = (file: File): boolean => {
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxFileSize}MB. Current size: ${fileSizeMB.toFixed(1)}MB`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  // Count files by type
  const getFileCount = (type: 'image' | 'video' | 'audio') => {
    return mediaFiles.filter(file => file.type === type).length;
  };

  // Check if can add more files of a type
  const canAddMore = (type: 'image' | 'video' | 'audio'): boolean => {
    const counts = {
      image: getFileCount('image'),
      video: getFileCount('video'),
      audio: getFileCount('audio')
    };

    const limits = {
      image: maxImages,
      video: maxVideos,
      audio: maxAudioFiles
    };

    return counts[type] < limits[type];
  };

  // Add media file
  const addMediaFile = useCallback((file: File, type: 'image' | 'video' | 'audio') => {
    if (!validateFileSize(file)) return;
    if (!canAddMore(type)) {
      toast({
        title: "Upload limit reached",
        description: `Maximum ${type === 'image' ? maxImages : type === 'video' ? maxVideos : maxAudioFiles} ${type}s allowed`,
        variant: "destructive",
      });
      return;
    }

    const mediaFile: MediaFile = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file,
      type,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    };

    // Get duration for video/audio files
    if (type === 'video' || type === 'audio') {
      const element = document.createElement(type);
      element.src = mediaFile.url;
      element.onloadedmetadata = () => {
        mediaFile.duration = element.duration;
        setMediaFiles(prev => {
          const updated = [...prev, mediaFile];
          onMediaChange(updated);
          return updated;
        });
      };
    } else {
      setMediaFiles(prev => {
        const updated = [...prev, mediaFile];
        onMediaChange(updated);
        return updated;
      });
    }

    toast({
      title: "Media added",
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully`,
    });
  }, [maxImages, maxVideos, maxAudioFiles, maxFileSize, onMediaChange]);

  // Remove media file
  const removeMediaFile = (id: string) => {
    setMediaFiles(prev => {
      const updated = prev.filter(file => {
        if (file.id === id) {
          URL.revokeObjectURL(file.url);
          return false;
        }
        return true;
      });
      onMediaChange(updated);
      return updated;
    });

    // Stop playing audio if it's the one being removed
    if (playingAudio === id) {
      setPlayingAudio(null);
    }

    toast({
      title: "Media removed",
      description: "File removed successfully",
    });
  };

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = Array.from(event.target.files || []);
    files.forEach(file => {
      if (type === 'image' && file.type.startsWith('image/')) {
        addMediaFile(file, 'image');
      } else if (type === 'video' && file.type.startsWith('video/')) {
        addMediaFile(file, 'video');
      }
    });
    event.target.value = '';
  };

  // Start voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], `voice-note-${Date.now()}.wav`, { type: 'audio/wav' });
        addMediaFile(audioFile, 'audio');
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording failed",
        description: "Please allow microphone access to record voice notes",
        variant: "destructive",
      });
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }

      toast({
        title: "Recording stopped",
        description: "Voice note saved successfully",
      });
    }
  };

  // Play/pause audio
  const toggleAudioPlayback = (mediaFile: MediaFile) => {
    if (playingAudio === mediaFile.id) {
      // Pause current audio
      const audio = audioElementsRef.current[mediaFile.id];
      if (audio) {
        audio.pause();
      }
      setPlayingAudio(null);
    } else {
      // Stop any currently playing audio
      Object.values(audioElementsRef.current).forEach(audio => audio.pause());
      
      // Play new audio
      if (!audioElementsRef.current[mediaFile.id]) {
        const audio = new Audio(mediaFile.url);
        audio.onended = () => setPlayingAudio(null);
        audioElementsRef.current[mediaFile.id] = audio;
      }
      
      audioElementsRef.current[mediaFile.id].play();
      setPlayingAudio(mediaFile.id);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format duration
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Upload Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Image Upload */}
        <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
          <CardContent className="p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileChange(e, 'image')}
              className="hidden"
            />
            <div className="space-y-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <ImageIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Add Photos</h3>
                <p className="text-sm text-gray-500">
                  {getFileCount('image')}/{maxImages} images
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={!canAddMore('image')}
                className="w-full"
              >
                <Camera className="w-4 h-4 mr-2" />
                {canAddMore('image') ? 'Add Images' : 'Limit Reached'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Video Upload */}
        <Card className="border-2 border-dashed border-gray-300 hover:border-green-400 transition-colors">
          <CardContent className="p-6 text-center">
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={(e) => handleFileChange(e, 'video')}
              className="hidden"
            />
            <div className="space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Video className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Add Video</h3>
                <p className="text-sm text-gray-500">
                  {getFileCount('video')}/{maxVideos} videos
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => videoInputRef.current?.click()}
                disabled={!canAddMore('video')}
                className="w-full"
              >
                <Video className="w-4 h-4 mr-2" />
                {canAddMore('video') ? 'Add Video' : 'Limit Reached'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Voice Recording */}
        <Card className="border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors">
          <CardContent className="p-6 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Mic className={`w-6 h-6 text-purple-600 ${isRecording ? 'animate-pulse' : ''}`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Voice Note</h3>
                <p className="text-sm text-gray-500">
                  {isRecording ? `Recording: ${formatDuration(recordingTime)}` : `${getFileCount('audio')}/${maxAudioFiles} notes`}
                </p>
              </div>
              <Button
                type="button"
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={!isRecording && !canAddMore('audio')}
                className="w-full"
              >
                {isRecording ? (
                  <>
                    <Square className="w-4 h-4 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    {canAddMore('audio') ? 'Record Voice' : 'Limit Reached'}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Media Preview Grid */}
      {mediaFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Uploaded Media</h3>
            <Badge variant="secondary">
              {mediaFiles.length} file{mediaFiles.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {mediaFiles.map((mediaFile) => (
                <motion.div
                  key={mediaFile.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      {/* Media Preview */}
                      <div className="relative">
                        {mediaFile.type === 'image' && (
                          <img
                            src={mediaFile.url}
                            alt="Preview"
                            className="w-full h-48 object-cover"
                          />
                        )}
                        
                        {mediaFile.type === 'video' && (
                          <video
                            src={mediaFile.url}
                            className="w-full h-48 object-cover"
                            controls
                          />
                        )}
                        
                        {mediaFile.type === 'audio' && (
                          <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                            <div className="text-center">
                              <Volume2 className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => toggleAudioPlayback(mediaFile)}
                                className="bg-white/80 backdrop-blur-sm"
                              >
                                {playingAudio === mediaFile.id ? (
                                  <>
                                    <Pause className="w-4 h-4 mr-2" />
                                    Pause
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-4 h-4 mr-2" />
                                    Play
                                  </>
                                )}
                              </Button>
                              {mediaFile.duration && (
                                <p className="text-sm text-purple-600 mt-2">
                                  {formatDuration(mediaFile.duration)}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Delete Button */}
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeMediaFile(mediaFile.id)}
                          className="absolute top-2 right-2 w-8 h-8 p-0 rounded-full shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </Button>

                        {/* Type Badge */}
                        <Badge 
                          className="absolute top-2 left-2"
                          variant={mediaFile.type === 'image' ? 'default' : mediaFile.type === 'video' ? 'secondary' : 'outline'}
                        >
                          {mediaFile.type === 'image' && <FileImage className="w-3 h-3 mr-1" />}
                          {mediaFile.type === 'video' && <FileVideo className="w-3 h-3 mr-1" />}
                          {mediaFile.type === 'audio' && <Volume2 className="w-3 h-3 mr-1" />}
                          {mediaFile.type.toUpperCase()}
                        </Badge>
                      </div>

                      {/* File Info */}
                      <div className="p-3 bg-gray-50">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {mediaFile.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatFileSize(mediaFile.size)}
                          {mediaFile.duration && ` • ${formatDuration(mediaFile.duration)}`}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Info Message */}
      {mediaFiles.length === 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-1">Add Media to Your Report</h4>
                <p className="text-sm text-blue-700">
                  Upload photos, videos, or record voice notes to provide more details about the issue.
                  Visual evidence helps authorities understand and resolve problems faster.
                </p>
                <ul className="text-sm text-blue-600 mt-2 space-y-1">
                  <li>• Photos: Up to {maxImages} images (max {maxFileSize}MB each)</li>
                  <li>• Videos: Up to {maxVideos} videos (max {maxFileSize}MB each)</li>
                  <li>• Voice Notes: Up to {maxAudioFiles} recordings</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MediaUploadComponent;

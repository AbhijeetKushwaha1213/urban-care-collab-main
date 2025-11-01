import React, { useEffect, useRef, useState } from 'react';
import { Loader2, MapPin, AlertTriangle } from 'lucide-react';

interface Issue {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  status: string;
  created_at: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

interface SimpleMapProps {
  issues: Issue[];
  onIssueSelect?: (issue: Issue) => void;
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyD7nJAmr4M4-qfzUQtubXAgWpc1P4ATh9E';

// Color mapping based on priority/intensity
const getPriorityColor = (priority: string, status: string) => {
  if (status === 'resolved') return '#10B981'; // Green for resolved
  
  switch (priority) {
    case 'critical': return '#EF4444'; // Red
    case 'high': return '#F97316'; // Orange
    case 'medium': return '#F59E0B'; // Yellow
    case 'low': return '#3B82F6'; // Blue
    default: return '#6B7280'; // Gray
  }
};

const calculatePriority = (category: string, createdAt: string): 'low' | 'medium' | 'high' | 'critical' => {
  const priorityMap: { [key: string]: 'low' | 'medium' | 'high' | 'critical' } = {
    'Safety': 'critical',
    'Water': 'high',
    'Electricity': 'high',
    'Infrastructure': 'medium',
    'Transportation': 'medium',
    'Trash': 'low',
    'Other': 'low'
  };

  let basePriority = priorityMap[category] || 'medium';
  
  // Increase priority based on age
  const daysSinceCreated = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceCreated > 7) {
    const priorities: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
    const currentIndex = priorities.indexOf(basePriority);
    if (currentIndex < priorities.length - 1) {
      basePriority = priorities[currentIndex + 1];
    }
  }

  return basePriority;
};

const SimpleMap: React.FC<SimpleMapProps> = ({ issues, onIssueSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Google Maps script loaded');
        initializeMap();
      };
      
      script.onerror = (err) => {
        console.error('Failed to load Google Maps script:', err);
        setError('Failed to load Google Maps API');
        setIsLoading(false);
      };

      document.head.appendChild(script);
    };

    const initializeMap = () => {
      try {
        if (!mapRef.current) {
          throw new Error('Map container not found');
        }

        console.log('Initializing map...');
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 40.7128, lng: -74.0060 },
          zoom: 12,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        // Add markers for issues
        issues.forEach((issue, index) => {
          // Generate coordinates based on index for demo
          const lat = 40.7128 + (Math.sin(index) * 0.05);
          const lng = -74.0060 + (Math.cos(index) * 0.05);
          
          const priority = issue.priority || calculatePriority(issue.category, issue.created_at);
          const color = getPriorityColor(priority, issue.status);

          const marker = new google.maps.Marker({
            position: { lat, lng },
            map: map,
            title: issue.title,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: color,
              fillOpacity: 0.8,
              strokeColor: '#ffffff',
              strokeWeight: 2,
              scale: priority === 'critical' ? 12 : priority === 'high' ? 10 : 8
            }
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="max-width: 250px; padding: 8px;">
                <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">
                  ${issue.title}
                </h3>
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">
                  ${issue.description.substring(0, 80)}...
                </p>
                <div style="display: flex; gap: 4px; margin-bottom: 4px;">
                  <span style="background: ${color}; color: white; padding: 1px 6px; border-radius: 8px; font-size: 10px;">
                    ${priority.toUpperCase()}
                  </span>
                  <span style="background: #eee; color: #333; padding: 1px 6px; border-radius: 8px; font-size: 10px;">
                    ${issue.category}
                  </span>
                </div>
                <p style="margin: 0; font-size: 10px; color: #999;">
                  📍 ${issue.location}
                </p>
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(map, marker);
            if (onIssueSelect) {
              onIssueSelect(issue);
            }
          });
        });

        setIsLoading(false);
        console.log('Map initialized successfully');
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to initialize map');
        setIsLoading(false);
      }
    };

    loadGoogleMaps();
  }, [issues, onIssueSelect]);

  if (error) {
    return (
      <div className="h-96 flex items-center justify-center bg-red-50 rounded-lg border-2 border-red-200">
        <div className="text-center text-red-600">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Map Loading Error</h3>
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-2 text-gray-600">
            Check browser console for details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      
      <div ref={mapRef} className="w-full h-96 rounded-lg" />
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border">
        <h4 className="text-sm font-semibold mb-2">Priority</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Resolved</span>
          </div>
        </div>
      </div>

      {/* Issue count */}
      <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow-lg border">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-blue-600" />
          <span className="font-semibold">{issues.length} Issues</span>
        </div>
      </div>
    </div>
  );
};

export default SimpleMap;
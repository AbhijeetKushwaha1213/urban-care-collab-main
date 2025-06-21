import React, { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, Clock, ArrowRight, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from "@/contexts/AuthContext";
import { getEvents, createEvent, EventData, getPaginatedEvents } from "@/services/firestoreService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from 'react-router-dom';

const Events = () => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [showCreateEventForm, setShowCreateEventForm] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    categories: ''
  });

  const EVENTS_PAGE_SIZE = 10;

  const [eventsData, setEventsData] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Fetch first page on mount
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    getPaginatedEvents(EVENTS_PAGE_SIZE)
      .then(({ events, lastVisible }) => {
        if (isMounted) {
          setEventsData(events);
          setLastVisible(lastVisible);
          setHasMore(events.length === EVENTS_PAGE_SIZE);
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load events");
      })
      .finally(() => {
        setIsLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const loadMoreEvents = async () => {
    if (!lastVisible) return;
    setIsLoadingMore(true);
    setError(null);
    try {
      const { events, lastVisible: newLastVisible } = await getPaginatedEvents(EVENTS_PAGE_SIZE, lastVisible);
      setEventsData((prev) => [...prev, ...events]);
      setLastVisible(newLastVisible);
      setHasMore(events.length === EVENTS_PAGE_SIZE);
    } catch (err: any) {
      setError(err.message || "Failed to load more events");
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (eventData: {
      title: string;
      description: string;
      location: string;
      date: string;
      time: string;
      categories: string[];
    }) => {
      if (!currentUser) throw new Error("You must be logged in to create an event");
      return await createEvent(eventData, currentUser.uid);
    },
    onSuccess: () => {
      // Invalidate and refetch events after a new event is created
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Event Created",
        description: "Your event has been successfully created!",
      });
      setShowCreateEventForm(false);
      setNewEvent({
        title: '',
        description: '',
        location: '',
        date: '',
        time: '',
        categories: ''
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create event",
        variant: "destructive",
      });
    }
  });

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create an event",
        variant: "destructive",
      });
      return;
    }

    // Convert comma-separated categories to array
    const categoriesArray = newEvent.categories
      .split(',')
      .map(category => category.trim())
      .filter(category => category !== '');

    createEventMutation.mutate({
      ...newEvent,
      categories: categoriesArray,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-20 px-4 md:px-6 container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-semibold mb-6">Community Events</h1>
            <p className="text-xl text-muted-foreground mb-12">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-20 px-4 md:px-6 container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-semibold mb-6">Community Events</h1>
            <p className="text-xl text-muted-foreground mb-12">Error loading events: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4 md:px-6 container mx-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-semibold mb-6">Community Events</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Join upcoming events organized by your community to solve local issues together.
          </p>
          
          {/* Create Event Button/Form */}
          {!showCreateEventForm ? (
            <Button 
              className="w-full mb-8 py-8 text-lg gap-3"
              onClick={() => {
                if (!currentUser) {
                  toast({
                    title: "Authentication Required",
                    description: "Please sign in to create an event",
                    variant: "destructive",
                  });
                  return;
                }
                setShowCreateEventForm(true);
              }}
            >
              <span>Create New Event</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          ) : (
            <div className="bg-card border rounded-xl p-6 mb-8 animate-fade-in">
              <h2 className="text-2xl font-semibold mb-4">Create New Event</h2>
              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">Event Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newEvent.title}
                    onChange={handleInputChange}
                    className="w-full p-2.5 rounded-lg border border-input bg-background"
                    placeholder="Enter event title"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newEvent.description}
                    onChange={handleInputChange}
                    className="w-full p-2.5 rounded-lg border border-input bg-background min-h-24"
                    placeholder="Describe your event"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium mb-1">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={newEvent.location}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-lg border border-input bg-background"
                      placeholder="Enter event location"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="categories" className="block text-sm font-medium mb-1">Categories</label>
                    <input
                      type="text"
                      id="categories"
                      name="categories"
                      value={newEvent.categories}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-lg border border-input bg-background"
                      placeholder="e.g. Cleanup, Water, Infrastructure"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium mb-1">Date</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={newEvent.date}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-lg border border-input bg-background"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium mb-1">Time</label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={newEvent.time}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-lg border border-input bg-background"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCreateEventForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create Event</Button>
                </div>
              </form>
            </div>
          )}
          
          <div className="flex flex-col gap-6">
            {eventsData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No events found. Create the first one!</p>
              </div>
            ) : (
              eventsData.map((event: EventData) => (
                <div key={event.id} className="rounded-xl border p-6 bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${event.status === 'Upcoming' ? 'bg-primary/10 text-primary' : 'bg-secondary'} px-3 py-1 rounded-full`}>
                        {event.status}
                      </span>
                      <span className="text-sm text-muted-foreground">{event.timeRemaining}</span>
                    </div>
                    
                    <h3 className="text-xl font-semibold">{event.title}</h3>
                    <p className="text-muted-foreground">{event.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{event.volunteersCount || 0} volunteers attending</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {event.categories && event.categories.map((category, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-secondary rounded-md">{category}</span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex -space-x-2">
                        {[...Array(Math.min(event.volunteersCount || 0, 5))].map((_, i) => (
                          <div key={i} className="h-8 w-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center overflow-hidden">
                            <User className="h-4 w-4" />
                          </div>
                        ))}
                      </div>
                      <Button variant="link" onClick={() => navigate(`/events/${event.id}`)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
            {hasMore && (
              <div className="flex justify-center mt-6">
                <Button onClick={loadMoreEvents} disabled={isLoadingMore}>
                  {isLoadingMore ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;

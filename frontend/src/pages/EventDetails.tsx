import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Clock,
  Globe,
  Star,
  User,
  Building,
  Tag,
  ArrowLeft,
  ExternalLink,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { EventCard } from "@/components/events/EventCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Event } from "@/types";
import { apiService } from "@/services/api";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewsExpanded, setReviewsExpanded] = useState(false);

  useEffect(() => {
    const loadEventDetails = async () => {
      try {
        if (id) {
          // Fetch main event
          const eventData = await apiService.getEventById(id);
          setEvent(eventData);

          // Fetch related events (same category/tags)
          const allEvents = await apiService.getEvents();
          if (eventData) {
            const related = allEvents
              .filter(
                (e) =>
                  e.id !== eventData.id && e._shops?.id === eventData._shops?.id
              )
              .slice(0, 3);
            setRelatedEvents(related);
          }
        }
      } catch (error) {
        console.error("Failed to load event details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEventDetails();
  }, [id]);

  // Hardcoded reviews for now
  const reviews = [
    {
      id: 1,
      author: "Sarah Johnson",
      rating: 5,
      comment: "Amazing event! Great organization and fantastic atmosphere.",
      date: "2025-01-15",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=32&h=32&fit=crop&crop=face",
    },
    {
      id: 2,
      author: "Mike Chen",
      rating: 4,
      comment: "Really enjoyed this event. Would definitely attend again!",
      date: "2025-01-10",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
    },
    {
      id: 3,
      author: "Emily Rodriguez",
      rating: 5,
      comment:
        "Exceeded my expectations. The venue was perfect and the performer was incredible.",
      date: "2025-01-08",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Event Not Found
          </h1>
          <p className="text-muted-foreground mb-8">
            The event you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/events">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const eventTags = event.SEO_Tags
    ? event.SEO_Tags.split(",").map((tag) => tag.trim())
    : [];
  const eventImage =
    // @ts-ignore
    event._item_images_of_items?.items?.[0]?.display_image ||
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1920&auto=format&fit=crop&q=80";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Back Button */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/events">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${eventImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-12 text-white">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              {event.title}
            </h1>
            <p className="text-xl md:text-2xl mb-6 text-white/90 leading-relaxed">
              {event.description}
            </p>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-6 mb-6">
              {event._events_seo_of_items?.start_time && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>
                    {formatDate(event._events_seo_of_items.start_time)}
                  </span>
                </div>
              )}
              {event._events_seo_of_items?.start_time && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>
                    {formatTime(event._events_seo_of_items.start_time)}
                  </span>
                </div>
              )}
              {event._events_seo_of_items?.address && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{event._events_seo_of_items.address}</span>
                </div>
              )}
            </div>

            {/* CTA Button */}
            {event._events_seo_of_items?.price && (
              <Button
                size="lg"
                className="btn-glow bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Ticket className="w-5 h-5 mr-2" />
                Get Tickets - ₹{event._events_seo_of_items.price}
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Event Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Event Information */}
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-6 h-6 text-primary" />
                    <span>Event Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {event._events_seo_of_items?.start_time && (
                      <div>
                        <h4 className="font-semibold mb-2">Date & Time</h4>
                        <p className="text-muted-foreground">
                          {formatDate(event._events_seo_of_items.start_time)}
                        </p>
                        <p className="text-muted-foreground">
                          {formatTime(event._events_seo_of_items.start_time)} -{" "}
                          {formatTime(
                            event._events_seo_of_items.end_time ||
                              event._events_seo_of_items.start_time + 7200000
                          )}
                        </p>
                      </div>
                    )}

                    {event._events_seo_of_items?.address && (
                      <div>
                        <h4 className="font-semibold mb-2">Location</h4>
                        <p className="text-muted-foreground">
                          {event._events_seo_of_items.address}
                        </p>
                      </div>
                    )}

                    {event._events_seo_of_items?.performer_name && (
                      <div>
                        <h4 className="font-semibold mb-2">Performer</h4>
                        <p className="text-muted-foreground">
                          {event._events_seo_of_items.performer_name}
                        </p>
                      </div>
                    )}

                    {event._events_seo_of_items?.organizer_name && (
                      <div>
                        <h4 className="font-semibold mb-2">Organizer</h4>
                        <p className="text-muted-foreground">
                          {event._events_seo_of_items.organizer_name}
                        </p>
                      </div>
                    )}
                  </div>

                  {event._events_seo_of_items?.url && (
                    <div className="pt-4 border-t border-border">
                      <Button variant="outline" asChild>
                        <a
                          href={event._events_seo_of_items.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Event Website
                        </a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tags */}
              {eventTags.length > 0 && (
                <Card className="bg-gradient-card border-0 shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Tag className="w-6 h-6 text-primary" />
                      <span>Tags</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {eventTags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Reviews */}
              <Card className="bg-gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="w-6 h-6 text-primary" />
                      <span>Reviews & Ratings</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-bold">4.7</span>
                      <span className="text-muted-foreground">
                        ({reviews.length} reviews)
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {reviews
                      .slice(0, reviewsExpanded ? reviews.length : 2)
                      .map((review) => (
                        <div
                          key={review.id}
                          className="border-b border-border last:border-b-0 pb-4 last:pb-0"
                        >
                          <div className="flex items-start space-x-4">
                            <Avatar className="w-10 h-10">
                              <AvatarImage
                                src={review.avatar}
                                alt={review.author}
                              />
                              <AvatarFallback>
                                {review.author.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-semibold">
                                  {review.author}
                                </h4>
                                <div className="flex items-center">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {review.date}
                                </span>
                              </div>
                              <p className="text-muted-foreground">
                                {review.comment}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                    {reviews.length > 2 && (
                      <Button
                        variant="ghost"
                        onClick={() => setReviewsExpanded(!reviewsExpanded)}
                        className="w-full"
                      >
                        {reviewsExpanded
                          ? "Show Less"
                          : `Show ${reviews.length - 2} More Reviews`}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Organizer Info */}
              {event._shops && (
                <Card className="bg-gradient-card border-0 shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="w-6 h-6 text-primary" />
                      <span>Organizer</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1">
                        <img
                          src={event._shops.logo}
                          alt={event._shops.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            // @ts-ignore
                            e.currentTarget.nextElementSibling.style.display =
                              "flex";
                          }}
                        />
                        <div className="w-full h-full bg-gradient-primary rounded-lg items-center justify-center hidden">
                          <Building className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">
                          {event._shops.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Event Organizer
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {event._shops.description}
                    </p>

                    {
                      // @ts-ignore
                      event._shops.custom_domain && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="w-full"
                        >
                          <a
                            // @ts-ignore
                            href={event._shops.custom_domain}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Globe className="w-4 h-4 mr-2" />
                            Visit Website
                          </a>
                        </Button>
                      )
                    }
                  </CardContent>
                </Card>
              )}

              {/* Event Stats */}

              <Card className="bg-gradient-card border-0 shadow-card">
                <CardHeader>
                  <CardTitle>Event Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      {event._events_seo_of_items?.event_status || "Active"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Availability</span>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800"
                    >
                      {
                        // @ts-ignore
                        event._events_seo_of_items?.availability || "Available"
                      }
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Currency</span>
                    <span className="font-semibold">
                      {event._events_seo_of_items?.currency || "INR"}
                    </span>
                  </div>

                  {
                    // @ts-ignore
                    event._events_seo_of_items?.valid_from && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Valid From
                        </span>
                        <span className="font-semibold">
                          {
                            // @ts-ignore
                            event._events_seo_of_items.valid_from
                          }
                        </span>
                      </div>
                    )
                  }
                </CardContent>
              </Card>

              {/* Purchase Ticket */}
              {event._events_seo_of_items?.price && (
                <Card className="bg-gradient-hero text-white border-0 shadow-card">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-2xl font-bold mb-2">
                      ₹{event._events_seo_of_items.price}
                    </h3>
                    <p className="text-white/90 mb-4">Per Ticket</p>
                    <Button
                      size="lg"
                      className="w-full btn-glow bg-white text-foreground hover:bg-white/90"
                    >
                      <Ticket className="w-5 h-5 mr-2" />
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Events */}
      {relatedEvents.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Related Events</h2>
              <p className="text-xl text-muted-foreground">
                More events from {event._shops?.name}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedEvents.map((relatedEvent) => (
                <EventCard key={relatedEvent.id} event={relatedEvent} />
              ))}
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link to="/events">
                  View All Events
                  {/* @ts-ignore */}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1">
                  <img
                    src="https://elegantapt.com/wp-content/uploads/2024/04/Elegant_Revised_T_Logo_cropped.png.webp"
                    alt="Elegant Enterprise Logo"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      // @ts-ignore
                      e.currentTarget.nextElementSibling.style.display = "flex";
                    }}
                  />
                  <div className="w-full h-full bg-gradient-primary rounded-lg items-center justify-center hidden">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                </div>
                <span className="text-xl font-bold gradient-text">
                  Elegant Enterprise
                </span>
              </div>
              <p className="text-muted-foreground">
                Connecting people through amazing events worldwide.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link
                    to="/events"
                    className="hover:text-primary transition-colors"
                  >
                    Browse Events
                  </Link>
                </li>
                <li>
                  <Link
                    to="/auth"
                    className="hover:text-primary transition-colors"
                  >
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    className="hover:text-primary transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link
                    to="/help"
                    className="hover:text-primary transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-primary transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="hover:text-primary transition-colors"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link
                    to="/about"
                    className="hover:text-primary transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="hover:text-primary transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-primary transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
            <p>&copy; 2024 Elegant Enterprise. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EventDetails;

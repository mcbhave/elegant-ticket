import React from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Clock, Users, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/types";
import { format } from "date-fns";

interface EventCardProps {
  event: Event;
  className?: string;
}

type EventImage = {
  is_primary?: boolean;
  display_image?: string;
  file_url?: string;
  alt_text?: string;
};

export const EventCard: React.FC<EventCardProps> = ({
  event,
  className = "",
}) => {
  const eventDetails = event._events_seo_of_items;

  // Normalize images from API, handling both array and object formats
  const rawImages =
    (event._item_images_of_items as
      | EventImage[]
      | { items?: EventImage[] }
      | undefined) || [];

  const imagesArray: EventImage[] = Array.isArray(rawImages)
    ? rawImages
    : rawImages.items || [];

  const primaryImage =
    imagesArray.find((img) => img.is_primary) || imagesArray[0];

  const formatEventDate = (timestamp: number) =>
    format(new Date(timestamp * 1000), "MMM dd, yyyy");

  const formatEventTime = (timestamp: number) =>
    format(new Date(timestamp * 1000), "h:mm a");

  const getEventStatus = () => {
    if (!eventDetails) return "unknown";
    const now = Date.now() / 1000;
    if (eventDetails.event_status === "cancelled") return "cancelled";
    if (eventDetails.event_status === "postponed") return "postponed";
    if (eventDetails.end_time < now) return "completed";
    if (eventDetails.start_time > now) return "upcoming";
    return "live";
  };

  const getStatusBadge = () => {
    const status = getEventStatus();
    const configMap = {
      upcoming: { label: "Upcoming", variant: "default" as const },
      live: { label: "Live Now", variant: "destructive" as const },
      completed: { label: "Completed", variant: "secondary" as const },
      cancelled: { label: "Cancelled", variant: "destructive" as const },
      postponed: { label: "Postponed", variant: "secondary" as const },
      unknown: { label: "TBD", variant: "secondary" as const },
    };
    const config = configMap[status];
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  return (
    <Card
      className={`group card-hover overflow-hidden bg-gradient-card border-0 shadow-card ${className}`}
    >
      {/* Event Image */}
      <div className="relative overflow-hidden aspect-[16/10]">
        <img
          src={
            primaryImage?.display_image ||
            primaryImage?.file_url ||
            "/placeholder.svg"
          }
          alt={primaryImage?.alt_text || event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-4 left-4">{getStatusBadge()}</div>

        {/* Price Badge */}
        {eventDetails?.price && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-primary text-primary-foreground font-semibold">
              {eventDetails.currency} {eventDetails.price}
            </Badge>
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex gap-2">
            <Button size="sm" asChild className="btn-glow">
              <Link to={`/events/${event.id}`}>View Details</Link>
            </Button>
            {eventDetails?.url && (
              <Button size="sm" variant="secondary" asChild>
                <a
                  href={eventDetails.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Title */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          <Link to={`/event/${event.id}`} className="hover:underline">
            {event.title}
          </Link>
        </h3>

        {/* Event Info */}
        <div className="space-y-2 text-sm text-muted-foreground">
          {eventDetails && (
            <>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>
                  {formatEventDate(eventDetails.start_time)}
                  {eventDetails.start_time !== eventDetails.end_time &&
                    ` - ${formatEventDate(eventDetails.end_time)}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>
                  {formatEventTime(eventDetails.start_time)}
                  {eventDetails.start_time !== eventDetails.end_time &&
                    ` - ${formatEventTime(eventDetails.end_time)}`}
                </span>
              </div>
              {eventDetails.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="line-clamp-1">{eventDetails.address}</span>
                </div>
              )}
              {eventDetails.organizer_name && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="line-clamp-1">
                    by {eventDetails.organizer_name}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Tags */}
        {event.SEO_Tags && (
          <div className="flex flex-wrap gap-1 mt-3">
            {event.SEO_Tags.split(",")
              .slice(0, 3)
              .map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {tag.trim()}
                </Badge>
              ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0">
        <div className="flex w-full gap-2">
          {/* <Button variant="outline" className="flex-1" asChild>
            <Link to={`/events/${event.id}`}>View Event</Link>
          </Button> */}
          {getEventStatus() === "upcoming" && (
            <Button className="flex-1 btn-glow" asChild>
              <Link to={`/get-pass/${event.id}`}>Get Pass</Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

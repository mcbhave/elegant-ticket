import React, { useState } from "react";
import { Star, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReviewData, ReviewsResponse } from "@/services/api";

interface ReviewsSectionProps {
  reviews: ReviewData[];
  reviewsData: ReviewsResponse | null;
  className?: string;
  initialDisplayCount?: number;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  reviewsData,
  className = "",
  initialDisplayCount = 2,
}) => {
  const [reviewsExpanded, setReviewsExpanded] = useState(false);

  const formatReviewDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getAverageRating = () => {
    if (reviewsData?.ratings_avg && reviewsData.ratings_avg.length > 0) {
      return reviewsData.ratings_avg[0].reviews_Rating1;
    }
    return 0;
  };

  const getTotalReviews = () => {
    if (reviewsData?.ratings_avg && reviewsData.ratings_avg.length > 0) {
      return reviewsData.ratings_avg[0].Total_items;
    }
    return 0;
  };

  // Don't render if no reviews
  if (!reviews.length) {
    return null;
  }

  return (
    <Card className={`bg-gradient-card border-0 shadow-card ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="w-6 h-6 text-primary" />
            <span>Reviews & Ratings</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="font-bold">
              {getAverageRating() > 0 ? getAverageRating().toFixed(1) : "N/A"}
            </span>
            <span className="text-muted-foreground">
              ({getTotalReviews()} reviews)
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reviews
            .slice(0, reviewsExpanded ? reviews.length : initialDisplayCount)
            .map((review) => (
              <div
                key={review.id}
                className="border-b border-border last:border-b-0 pb-4 last:pb-0"
              >
                <div className="flex items-start space-x-4">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {review.user_info?.name
                        ? review.user_info.name.charAt(0).toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold">
                        {review.user_info?.name || "Anonymous User"}
                      </h4>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.Rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatReviewDate(review.created_at)}
                      </span>
                    </div>
                    <h5 className="font-medium mb-1">{review.Title}</h5>
                    <p className="text-muted-foreground">{review.Comments}</p>
                    {review.Helpful_count > 0 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {review.Helpful_count} people found this helpful
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

          {reviews.length > initialDisplayCount && (
            <Button
              variant="ghost"
              onClick={() => setReviewsExpanded(!reviewsExpanded)}
              className="w-full"
            >
              {reviewsExpanded
                ? "Show Less"
                : `Show ${reviews.length - initialDisplayCount} More Reviews`}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

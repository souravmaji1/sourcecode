"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";

interface ReviewProps {
  image: string;
  name: string;
  userName: string;
  comment: string;
  rating: number;
}

const reviewList: ReviewProps[] = [
  {
    image: "https://github.com/shadcn.png",
    name: "John Doe",
    userName: "E-commerce Owner",
    comment:
      "This AI chatbot platform has revolutionized our customer service. Our response times have improved dramatically!",
    rating: 5.0,
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Sophia Collins",
    userName: "SaaS Entrepreneur",
    comment:
      "Creating a custom chatbot was incredibly easy. It's like having a 24/7 support team without the overhead.",
    rating: 4.8,
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Adam Johnson",
    userName: "Digital Marketing Agency CEO",
    comment:
      "We've integrated this chatbot into multiple client websites. The customization options are fantastic!",
    rating: 4.9,
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Ethan Parker",
    userName: "Tech Startup Founder",
    comment:
      "The AI's ability to understand context and provide accurate responses is impressive. Our users love it!",
    rating: 5.0,
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Ava Mitchell",
    userName: "Customer Support Manager",
    comment:
      "This platform has significantly reduced our support ticket volume. It's a game-changer for our team.",
    rating: 5.0,
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Isabella Reed",
    userName: "Online Education Platform Owner",
    comment:
      "The chatbot handles student queries brilliantly. It's like having a knowledgeable assistant available at all times.",
    rating: 4.9,
  },
];

export const TestimonialSection = () => {
  return (
    <section id="testimonials" className="container py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          Testimonials
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
          Hear What Our Clients Say About Our AI Chatbot Platform
        </h2>
      </div>

      <Carousel
        opts={{
          align: "start",
        }}
        className="relative w-[80%] sm:w-[90%] lg:max-w-screen-xl mx-auto"
      >
        <CarouselContent>
          {reviewList.map((review) => (
            <CarouselItem
              key={review.name}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <Card className="bg-muted/50 dark:bg-card border-0">
                <CardContent className="pt-6 pb-0">
                  <div className="flex gap-1 pb-6">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`size-4 ${
                          index < review.rating
                            ? "fill-primary text-primary"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  {`"${review.comment}"`}
                </CardContent>

                <CardHeader>
                  <div className="flex flex-row items-center gap-4">
                    <Avatar>
                      <AvatarImage src={review.image} alt={review.name} />
                      <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <CardTitle className="text-lg">{review.name}</CardTitle>
                      <CardDescription>{review.userName}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};
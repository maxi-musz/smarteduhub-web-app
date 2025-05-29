import React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Principal, Westside High School",
    text: "EduManage has completely transformed how we run our school. We've reduced paperwork by over 90% and our staff can focus on what really matters - teaching our students.",
    avatar: "/imgs/testimonial-01.jpg",
    rating: 5,
  },
  {
    name: "Michael Rodriguez",
    role: "Administrator, Lincoln Elementary",
    text: "The administrative time savings have been incredible. Tasks that used to take days now take minutes, and our parents love having digital access to their children's information.",
    avatar: "/imgs/testimonial-02.jpg",
    rating: 5,
  },
  {
    name: "Emma Parker",
    role: "5th Grade Teacher, Oakridge Academy",
    text: "As a teacher, I can easily track student progress, plan lessons, and communicate with parents all in one place. EduManage has made my job so much easier and more effective.",
    avatar: "/imgs/testimonial-03.jpg",
    rating: 5,
  },
  {
    name: "David Chen",
    role: "IT Director, Metro Schools",
    text: "Implementation was seamless and the support team was exceptional. Our entire district is now more efficient and data-driven than ever before.",
    avatar: "/imgs/testimonial-04.jpg",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-brand-heading mb-4">
            What school leaders are saying
          </h2>
          <p className="text-xl text-gray-600">
            Don&apos;t just take our word for it. Here&apos;s what educators
            using SmartEdu Hub have to say.
          </p>
        </div>

        <Carousel className="max-w-6xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <Card className="p-6 h-full transition-all duration-300 hover:bg-brand-primary hover:text-white group shadow-brand">
                  <CardContent className="p-0">
                    <div className="flex items-center mb-4">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        style={{
                          objectFit: "cover",
                          objectPosition: "center center",
                        }}
                        className="size-14 rounded-full"
                      />

                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm opacity-70">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-current text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="italic">&quot;{testimonial.text}&quot;</p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}

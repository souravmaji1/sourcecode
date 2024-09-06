"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

export const HeroSection = () => {
  const { theme } = useTheme();

  return (
    <section className="container w-full">
      <div className="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto py-20 md:py-32">
        <div className="text-center space-y-8">
         

          <div className="max-w-screen-md mx-auto text-center text-4xl md:text-6xl font-bold">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Agency First Platform to Empower Conversational AI Agents
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
        We provide all the software & integrations you may need for an AI agent out of the box.
      </p>
    
          </div>

          

          <div className="space-y-4 md:space-y-0 md:space-x-4">
            <Link href="/chatbotgenerate">
              <Button className="w-5/6 md:w-1/4 font-bold group/arrow">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative group mt-14">
          <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-24 lg:h-80 bg-primary/50 rounded-full blur-3xl"></div>
          <Image
            width={1200}
            height={1200}
            className="w-full md:w-[1200px] mx-auto rounded-lg relative rouded-lg leading-none flex items-center border border-t-2 border-secondary  border-t-primary/30"
            src={
              theme === "light"
                ? "/h.png"
                : "/h.png"
            }
            alt="AI bot creator dashboard"
          />

          <div className="absolute bottom-0 left-0 w-full h-20 md:h-28 bg-gradient-to-b from-background/0 via-background/50 to-background rounded-lg"></div>
        </div>
      </div>
    </section>
  );
};
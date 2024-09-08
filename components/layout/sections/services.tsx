import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

enum ProService {
  YES = 1,
  NO = 0,
}

interface ServiceProps {
  title: string;
  pro: ProService;
  description: string;
}

const serviceList: ServiceProps[] = [
  {
    title: "Custom Chatbot Creation",
    description:
      "Design and build tailored AI chatbots to match your brand voice and address specific customer needs.",
    pro: 0,
  },
  {
    title: "Multi-language Support",
    description:
      "Create chatbots that communicate fluently in multiple languages to serve a global audience.",
    pro: 0,
  },
  {
    title: "Knowledge Base Integration",
    description: "Connect your chatbot to your existing knowledge base for accurate and consistent responses.",
    pro: 0,
  },
  {
    title: "Advanced Analytics",
    description: "Gain deep insights into customer interactions and chatbot performance with detailed analytics.",
    pro: 1,
  },
  {
    title: "Human Handoff",
    description: "Seamlessly transfer complex queries from the AI to human support agents when needed.",
    pro: 1,
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="container py-24 sm:py-32">
     
      
      <h2 className="text-5xl md:text-6xl text-center font-bold mb-4">
      Dashboards Overview
      </h2>
      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
      Out of the box, we have everything you could think of built in.
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"></div>
      
      <div className="relative group mt-14">
          <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-24 lg:h-80 bg-primary/50 rounded-full blur-3xl"></div>
          <Image
            width={1200}
            height={1200}
            className="w-full md:w-[1200px] mx-auto rounded-lg relative rouded-lg leading-none flex items-center border border-t-2 border-secondary  border-t-primary/30"
            src=
               "/last.png"
            
            alt="AI bot creator dashboard"
          />

          <div className="absolute bottom-0 left-0 w-full h-20 md:h-28 bg-gradient-to-b from-background/0 via-background/50 to-background rounded-lg"></div>
        </div>
     
    </section>
  );
};
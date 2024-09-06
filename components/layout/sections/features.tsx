import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface FeaturesProps {
  icon: string;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: "Bot",
    title: "Custom AI Chatbots",
    description:
      "Create your own AI-powered chatbot tailored to your brand and customer needs, enhancing user engagement.",
  },
  {
    icon: "Puzzle",
    title: "Easy Integration",
    description:
      "Seamlessly integrate your custom chatbot into any platform, providing versatile customer support options.",
  },
  {
    icon: "MessageSquare",
    title: "Intelligent Query Resolution",
    description:
      "Leverage AI to understand and accurately respond to a wide range of customer queries, improving satisfaction.",
  },
  {
    icon: "BarChart2",
    title: "Performance Analytics",
    description:
      "Gain valuable insights into chatbot interactions, allowing you to continually refine and improve your service.",
  },
  {
    icon: "Settings",
    title: "Customizable Responses",
    description:
      "Tailor your chatbot's personality and responses to align perfectly with your brand voice and customer expectations.",
  },
  {
    icon: "Zap",
    title: "24/7 Availability",
    description:
      "Provide round-the-clock customer support, ensuring queries are addressed promptly at any time.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="container py-24 sm:py-32 ">
      <div className="max-w-3xl mx-auto text-center mb-12">
       
        <h2 className="text-5xl md:text-6xl text-center font-bold mb-4">
        Agent Creation Tool
      </h2>
        <p className="text-xl text-muted-foreground">
        Create an agent with our built in or use ReplyGen , paste agent API
key and you are done, instantly have a beautiful, customizable
branded agent in seconds.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {featureList.map(({ icon, title, description }) => (
          <Card key={title} className="group overflow-hidden transition-all hover:shadow-lg hover:scale-105">
            <CardHeader className="flex flex-col items-center p-6 bg-gradient-to-br from-primary/10 to-secondary/10 transition-colors group-hover:from-primary/20 group-hover:to-secondary/20">
              <div className="rounded-full p-3 bg-background shadow-inner mb-4 group-hover:shadow-md transition-all">
                <Icon
                  name={icon as keyof typeof icons}
                  size={32}
                  color="hsl(var(--primary))"
                  className="text-primary group-hover:text-secondary transition-colors"
                />
              </div>
              <CardTitle className="text-xl text-center transition-colors group-hover:text-primary">{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-muted-foreground text-center">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
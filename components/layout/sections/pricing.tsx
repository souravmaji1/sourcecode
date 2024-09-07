'use client'
import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Check } from "lucide-react"

enum PopularPlan {
  NO = 0,
  YES = 1,
}

interface PlanProps {
  title: string
  popular: PopularPlan
  price: number
  description: string
  buttonText: string
  benefitList: string[]
}

const plans: PlanProps[] = [
  {
    title: "Free",
    popular: PopularPlan.NO,
    price: 0,
    description: "Experience the basics of AI chatbot generation with the free trial.",
    buttonText: "Start Free Trial",
    benefitList: ["1 project", "25 Free Credits"],
  },
  {
    title: "Premium",
    popular: PopularPlan.YES,
    price: 29,
    description: "Unlock advanced features with community support for your AI chatbot generation journey.",
    buttonText: "Get Started",
    benefitList: ["5 projects", "125 credits", "community support", "Access to new feature", "Regular updates"],
  },
  {
    title: "Enterprise",
    popular: PopularPlan.NO,
    price: 89,
    description: "Tailored solutions and dedicated support for large teams and enterprises.",
    buttonText: "Contact Us",
    benefitList: [
      "20 Projects",
      "Text and Voice chatbot",
      "Phone & email support",
      "Custom bot template",
      "Custom Data training",
      "Access to new feature",
      "Regular updates",
    ],
  },
]

export default function PricingSection() {
  return (
    <section className="px-4 md:px-24 py-12 md:py-24 sm:py-32" style={{background:'linear-gradient(164deg, #fbd8d8, #b280f3)'}}>
      <style jsx>{`
        @media (max-width: 768px) {
          .pricing-grid {
            grid-template-columns: 1fr !important;
          }
          .pricing-card {
            transform: scale(1) !important;
          }
          .pricing-card-popular {
            order: -1;
          }
        }
      `}</style>
      <h2 className="text-4xl md:text-5xl lg:text-6xl text-center font-bold mb-4">Plan and Pricing</h2>
      <h3 className="md:w-3/4 lg:w-1/2 mx-auto text-lg md:text-xl text-center text-muted-foreground pb-8 md:pb-14">
        Choose the plan that best fits your content creation needs and unlock the full potential of AI.
      </h3>
      <div className="pricing-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-4">
        {plans.map(({ title, popular, price, description, buttonText, benefitList }) => (
          <Card
            key={title}
            className={`pricing-card ${
              popular === PopularPlan.YES
                ? "pricing-card-popular border-0 drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-[1.5px] border-primary lg:scale-[1.1] bg-[#231D4F] text-white"
                : "border-0"
            }`}
          >
            <CardHeader>
              <CardTitle className="pb-2">{title}</CardTitle>
              <CardDescription className={popular === PopularPlan.YES ? "pb-4 text-gray-300" : "pb-4"}>
                {description}
              </CardDescription>
              <div>
                <span className="text-3xl font-bold">${price}</span>
                <span className={popular === PopularPlan.YES ? "text-gray-300" : "text-muted-foreground"}>
                  {" "}
                  /month
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex">
              <div className="space-y-4">
                {benefitList.map((benefit) => (
                  <span key={benefit} className="flex">
                    <Check className={popular === PopularPlan.YES ? "text-white mr-2" : "text-primary mr-2"} />
                    <h3>{benefit}</h3>
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant={popular === PopularPlan.YES ? "secondary" : "default"}
                className={`w-full ${popular === PopularPlan.YES ? "bg-white text-[#231D4F] hover:bg-gray-200" : ""}`}
              >
                {buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
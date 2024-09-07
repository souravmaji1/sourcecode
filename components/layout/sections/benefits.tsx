'use client'
import React from 'react'
import { Card, CardContent } from "@/components/ui/card"

export default function Component() {
  const steps = [
    {
      number: '01',
      title: 'Create an agent and customize it to your liking',
      description: 'You can choose from a variety of templates and themes.',
      image: '/first.png'
    },
    {
      number: '02',
      title: 'Get your agent\'s data and organize it in documents',
      description: 'Then test different queries and how the agent responds, preview the KB for the best settings.',
      image: '/second.png'
    },
    {
      number: '03',
      title: 'Adjust the LLM prompt, the similarity search prompt',
      description: 'Do A/B testing and get the prototype ready.',
      image: '/third.png'
    },
    {
      number: '04',
      title: 'Deploy on web, whatsapp, discord, google business',
      description: 'And more in seconds, built-in to support interactive messages and rich media.',
      image: '/fourth.png'
    },
    {
      number: '05',
      title: 'See transcripts in realtime, built-in live handoff',
      description: 'Monitor performance, analytics and manage the agent with ease.',
      image: '/fifth.png'
    }
  ]

  return (
    <div className="min-h-screen text-white p-8">
      <style jsx>{`
        @media (max-width: 768px) {
          .step-container {
            flex-direction: column !important;
            gap: 2rem !important;
          }
          .step-content, .step-image {
            width: 100% !important;
          }
          .step-content {
            text-align: center;
          }
          .step-number {
            font-size: 3rem !important;
          }
          .step-title {
            font-size: 1.5rem !important;
          }
          .step-description {
            font-size: 1rem !important;
          }
        }
      `}</style>
      <h2 className="text-5xl md:text-6xl text-center text-black font-bold mb-4">
        How it works?
      </h2>
      <p className="text-xl text-muted-foreground text-center">
        🚀 Get started in 5 simple steps.
      </p>
      <div className="max-w-6xl mx-auto mt-20 space-y-24">
        {steps.map((step, index) => (
          <div key={index} className={`step-container flex items-center gap-8 ${index % 2 !== 0 ? 'flex-row-reverse' : ''}`}>
            <div className="step-content flex-1 space-y-4">
              <h2 className="step-number text-6xl font-bold text-purple-600">{step.number}</h2>
              <h3 className="step-title text-2xl font-semibold text-black">{step.title}</h3>
              <p className="step-description text-gray-600">{step.description}</p>
            </div>
            <Card className="step-image flex-1 bg-gray-900 border-gray-800">
              <CardContent className="p-0">
                <img src={step.image} alt={`Step ${step.number}`} className="w-full h-auto" />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
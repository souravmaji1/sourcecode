'use client'

import React from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

const SettingsForm = () => (
  <Card className="w-full max-w-3xl">
    <CardContent className="p-6">
      <form>
        <div className="space-y-6">
          <div>
            <label htmlFor="messageDelay" className="block text-sm font-medium text-gray-700">Message Delay (MS)</label>
            <Input id="messageDelay" type="number" placeholder="1000" className="mt-1" />
            <p className="mt-1 text-sm text-gray-500">Default delay between every message (Milliseconds)</p>
          </div>
          <div>
            <label htmlFor="monthlyInteractionsLimit" className="block text-sm font-medium text-gray-700">Monthly Interactions Limit</label>
            <Input id="monthlyInteractionsLimit" type="number" placeholder="0" className="mt-1" />
            <p className="mt-1 text-sm text-gray-500">Interactions limit for this agent, if set to 0 means unlimited</p>
          </div>
          <div>
            <label htmlFor="monthlyAITokenLimit" className="block text-sm font-medium text-gray-700">Monthly AI Token Limit</label>
            <Input id="monthlyAITokenLimit" type="number" placeholder="100,000" className="mt-1" />
            <p className="mt-1 text-sm text-gray-500">Monthly total AI tokens limit (input + output), if set to 0 means unlimited</p>
          </div>
          <div>
            <label htmlFor="usedInputDelay" className="block text-sm font-medium text-gray-700">Used Input Delay</label>
            <Input id="usedInputDelay" type="number" placeholder="0" className="mt-1" />
            <p className="mt-1 text-sm text-gray-500">Monthly total AI tokens limit (input + output), if set to 0 means unlimited</p>
          </div>
          <div>
            <label htmlFor="monthlyInteractionsLimit2" className="block text-sm font-medium text-gray-700">Monthly Interactions Limit</label>
            <Input id="monthlyInteractionsLimit2" type="number" placeholder="0" className="mt-1" />
            <p className="mt-1 text-sm text-gray-500">Monthly total AI tokens limit (input + output), if set to 0 means unlimited</p>
          </div>
          <div>
            <label htmlFor="doesKnowThreshold" className="block text-sm font-medium text-gray-700">Does Know Threshold</label>
            <Input id="doesKnowThreshold" type="number" placeholder="0" className="mt-1" />
            <p className="mt-1 text-sm text-gray-500">Adjust this value to make the agent only reply to messages that it is confident about on some channels (specifically discord).</p>
          </div>
        </div>
      </form>
    </CardContent>
  </Card>
);

const ReplyGenSettingsPage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <ScrollArea className="flex-1 p-10">
        <SettingsForm />
      </ScrollArea>
    </div>
  );
};

export default ReplyGenSettingsPage;
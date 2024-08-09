'use client'

import { useState } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { chatSession } from '@/constants/GeminiAIModel';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Your Goal' },
    position: { x: 150, y: 200 },
    style: { width: 200, height: 50 },
  },
];

const initialEdges = [];

export default function RoadmapGenerator() {
  const [goal, setGoal] = useState('');
  const [roadmap, setRoadmap] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [isLoading, setIsLoading] = useState(false);

  const generateRoadmap = async () => {
    setIsLoading(true);
    try {
      const prompt = `Generate a detailed roadmap with skills and steps to achieve the following goal: ${goal}`;
      const result = await chatSession.sendMessage(prompt);
      const response = await result.response;
      console.log(response);
      const roadmapData = parseMarkdownRoadmap(response.text());
      setRoadmap(roadmapData.nodes);
      setEdges(roadmapData.edges);
    } catch (error) {
      console.error('Error generating roadmap:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const parseMarkdownRoadmap = (markdown) => {
    const lines = markdown.split('\n');
    let nodes = [];
    let edges = [];
    let currentNodeId = 1;
  
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('##')) {
        const label = line.slice(2).trim();
        nodes.push({
          id: currentNodeId.toString(),
          type: 'default',
          data: { label },
          position: { x: 0, y: currentNodeId * 200 },
        });
        currentNodeId++;
      } else if (line.startsWith('* ') || line.startsWith('- ')) {
        const skill = line.slice(2).trim();
        nodes.push({
          id: currentNodeId.toString(),
          type: 'default',
          data: { label: skill },
          position: { x: 200, y: currentNodeId * 200 },
        });
        edges.push({
          id: `e${currentNodeId - 1}-${currentNodeId}`,
          source: (currentNodeId - 1).toString(),
          target: currentNodeId.toString(),
        });
        currentNodeId++;
      }
    }
  
    return { nodes, edges };
  };

  return (
    <Card className="w-full max-w-md mx-auto" style={{ borderRadius: '1px' }}>
      <CardHeader>
        <CardTitle>Roadmap Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal">What do you want to become or achieve?</Label>
            <Input
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>
          <Button onClick={generateRoadmap} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Roadmap'}
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full h-[500px]">
          <ReactFlow nodes={roadmap} edges={edges} fitView>
            <Controls />
            <Background />
            <MiniMap />
          </ReactFlow>
        </div>
      </CardFooter>
    </Card>
  );
}
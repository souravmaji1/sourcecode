'use client';
import React, { useState } from 'react';
import FirecrawlApp from '@mendable/firecrawl-js';
import { z } from 'zod';

// Initialize the FirecrawlApp
const app = new FirecrawlApp({
  apiKey: 'fc-f0bf114ce99744408a2571e4370bdb04'
});

// Define the schema for agent information
const AgentSchema = z.object({
  broker_address: z.string(),
  screenname: z.string(),
  cell_phone: z.string().optional(),
  websites: z.array(z.string()).optional(),
  member_since: z.string().optional(),
  real_estate_licenses: z.array(z.string()).optional(),
  other_licenses: z.array(z.string()).optional()
});

const AgentsSchema = z.object({
  agents: z
    .array(AgentSchema)
    .max(10)
    .describe('List of up to 10 real estate agents')
});

// Define the URL to scrape (replace with the actual Zillow page URL)
const url = 'https://www.zillow.com/professionals/real-estate-agent-reviews/';

export default function ZillowAgentScraper() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const scrapeZillowAgents = async () => {
    setLoading(true);
    setError(null);
    try {
      const scrapeResult = await app.scrapeUrl(url, {
        extractorOptions: {
          extractionSchema: AgentsSchema,
          mode: 'llm-extraction',
          extractionPrompt:
            'Extract the Professional Information for real estate agents from the page. Include broker address, cell phone, websites, screenname, member since date, real estate licenses, and other licenses if available.'
        },
        pageOptions: {
          onlyMainContent: true
        }
      });

      setAgents(scrapeResult.data['llm_extraction'].agents);
    } catch (error) {
      console.error('Error scraping Zillow agents:', error);
      setError('An error occurred while scraping data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Zillow Agent Scraper</h1>
      <button
        onClick={scrapeZillowAgents}
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Scrape Agents'}
      </button>
      {error && <p className="mt-2 text-red-500">{error}</p>}
      {agents.length > 0 && (
        <div className="mt-4">
          <h2 className="mb-2 text-xl font-semibold">Scraped Agents</h2>
          {agents.map((agent, index) => (
            <div key={index} className="mb-4 rounded border p-4">
              <h3 className="font-bold">{agent.screenname}</h3>
              <p>
                <strong>Broker Address:</strong> {agent.broker_address}
              </p>
              {agent.cell_phone && (
                <p>
                  <strong>Cell Phone:</strong> {agent.cell_phone}
                </p>
              )}
              {agent.websites && (
                <p>
                  <strong>Websites:</strong> {agent.websites.join(', ')}
                </p>
              )}
              {agent.member_since && (
                <p>
                  <strong>Member Since:</strong> {agent.member_since}
                </p>
              )}
              {agent.real_estate_licenses && (
                <p>
                  <strong>Real Estate Licenses:</strong>{' '}
                  {agent.real_estate_licenses.join(', ')}
                </p>
              )}
              {agent.other_licenses && (
                <p>
                  <strong>Other Licenses:</strong>{' '}
                  {agent.other_licenses.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

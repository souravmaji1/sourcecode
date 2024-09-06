'use client'  // pages/index.js
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreditCard, DollarSign, AlertCircle } from "lucide-react";

const supabaseUrl = 'https://tnijqmtoqpmgdhvltuhl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuaWpxbXRvcXBtZ2Rodmx0dWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwOTE3MzcsImV4cCI6MjA0MDY2NzczN30.3c2EqGn5n0jLmG4l2NO_ovN_aIAhaLDBa0EKdwdnhCg';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const { user } = useUser();
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchCredits(user.id);
    }
  }, [user]);

  const fetchCredits = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('credits')
        .eq('userid', userId)
        .single();

      if (error) throw error;
      setCredits(data.credits);
    } catch (err) {
      console.error('Error fetching credits:', err);
      setError('Failed to fetch credits. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaypalSuccess = async (details) => {
    if (details.status === 'COMPLETED') {
      try {
        const { data, error } = await supabase
          .from('users')
          .update({ credits: credits + 10 })
          .eq('userid', user.id);

        if (error) throw error;
        setCredits(credits + 10);
      } catch (err) {
        console.error('Error updating credits:', err);
        setError('Failed to update credits. Please contact support.');
      }
    }
  };

  return (
    <div className="container mx-auto p-4 h-screen flex flex-col">
      <Card className="w-full flex-grow overflow-hidden">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold">Billing Dashboard</CardTitle>
          <CardDescription>
            {user ? `Welcome, ${user.firstName || 'User'}` : 'Please log in to view your credits and make purchases.'}
          </CardDescription>
        </CardHeader>
        <ScrollArea className="h-[70vh]  flex-grow">
          <CardContent className="space-y-8">
            {user ? (
              <>
                {loading ? (
                  <Skeleton className="w-full h-20" />
                ) : error ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                    <div className="flex items-center space-x-4">
                      <CreditCard className="h-10 w-10 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Your current credits</p>
                        <p className="text-3xl font-bold">{credits}</p>
                      </div>
                    </div>
                   
                  </div>
                )}

                <div>
                  <h2 className="text-2xl font-semibold mb-4">Increase Your Credits</h2>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <DollarSign className="mr-2 h-5 w-5" />
                        Pay $10 for 10 Credits
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PayPalScriptProvider options={{ "client-id": "AXC4JKA3ulvAfjFBGh1t4-kd7Y1m-0rJdxp90WdfIidXyQYoACiKOabDX-8v0MNyff4cO0dffx8GlBge" }}>
                        <PayPalButtons
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              purchase_units: [
                                {
                                  amount: {
                                    value: "10.00",
                                  },
                                },
                              ],
                            });
                          }}
                          onApprove={(data, actions) => {
                            return actions.order.capture().then(handlePaypalSuccess);
                          }}
                        />
                      </PayPalScriptProvider>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <Alert>
                <AlertTitle>Not logged in</AlertTitle>
                <AlertDescription>
                  Please log in to view your credits and make purchases.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </ScrollArea>
        <CardFooter className="text-sm text-muted-foreground">
          Need help? Contact our support team.
        </CardFooter>
      </Card>
    </div>
  );
}
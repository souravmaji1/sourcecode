import React from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

const PricingTier = ({ title, price, description, features, buttonText }) => (
  <Card className="flex w-[300px] flex-col">
    <CardHeader>
      <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      <CardDescription className="text-xl font-semibold">
        ${price}/month
      </CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
      <p className="mb-4 text-sm text-gray-600">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            {feature.included ? (
              <Check className="mr-2 h-5 w-5 text-green-500" />
            ) : (
              <X className="mr-2 h-5 w-5 text-red-500" />
            )}
            <span
              className={feature.included ? '' : 'text-gray-400 line-through'}
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter>
      <Button className="w-full">{buttonText}</Button>
    </CardFooter>
  </Card>
);

const PricingTable = () => {
  const tiers = [
    {
      title: 'Basic',
      price: 9.99,
      description: 'Perfect for individuals and small projects',
      features: [
        { text: '1 User', included: true },
        { text: '5GB Storage', included: true },
        { text: 'Basic Support', included: true },
        { text: 'Advanced Features', included: false }
      ],
      buttonText: 'Get Started'
    },
    {
      title: 'Pro',
      price: 29.99,
      description: 'Ideal for growing businesses',
      features: [
        { text: '5 Users', included: true },
        { text: '50GB Storage', included: true },
        { text: 'Priority Support', included: true },
        { text: 'Advanced Features', included: true }
      ],
      buttonText: 'Upgrade to Pro'
    },
    {
      title: 'Enterprise',
      price: 99.99,
      description: 'For large-scale operations',
      features: [
        { text: 'Unlimited Users', included: true },
        { text: '500GB Storage', included: true },
        { text: '24/7 Dedicated Support', included: true },
        { text: 'Custom Features', included: true }
      ],
      buttonText: 'Contact Sales'
    }
  ];

  return (
    <Card>
      <div className="mb-8 mt-8 flex flex-col items-center py-12">
        <h2 className="mb-8 text-3xl font-bold">Choose Your Plan</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {tiers.map((tier, index) => (
            <PricingTier key={index} {...tier} />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default PricingTable;

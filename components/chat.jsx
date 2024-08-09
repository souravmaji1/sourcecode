'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PropertyMessageCenter from './propertychat';
import ProfessionalMessageCenter from './professionalchat';
import InvestmentChat from './investmentchat';
import { Home, Briefcase, TrendingUp } from 'lucide-react';

const MessageCenterSelector = () => {
  const [selectedView, setSelectedView] = useState('property');

  const renderSelectedComponent = () => {
    switch (selectedView) {
      case 'property':
        return <PropertyMessageCenter />;
      case 'professional':
        return <ProfessionalMessageCenter />;
      case 'investment':
        return <InvestmentChat />;
      default:
        return <PropertyMessageCenter />;
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-4">
          
          <CardContent className='mt-6'>
            <div className="flex justify-center space-x-4">
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                  onClick={() => setSelectedView('property')}
                  variant={selectedView === 'property' ? 'default' : 'outline'}
                  className="flex items-center space-x-2"
                >
                  <Home size={18} />
                  <span>Property Messages</span>
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                  onClick={() => setSelectedView('professional')}
                  variant={selectedView === 'professional' ? 'default' : 'outline'}
                  className="flex items-center space-x-2"
                >
                  <Briefcase size={18} />
                  <span>Professional Messages</span>
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                  onClick={() => setSelectedView('investment')}
                  variant={selectedView === 'investment' ? 'default' : 'outline'}
                  className="flex items-center space-x-2"
                >
                  <TrendingUp size={18} />
                  <span>Investment Messages</span>
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        key={selectedView}
        variants={contentVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5 }}
      >
        {renderSelectedComponent()}
      </motion.div>
    </div>
  );
};

export default MessageCenterSelector;
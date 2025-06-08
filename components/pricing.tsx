import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const PricingSection = () => {
  const pricingTiers = [
    {
      name: "Starter",
      description: "Begin issuing verified credentials easily",
      price: "₱0",
      period: "free forever",
      buttonText: "TRY NOW",
      features: [
        "Access to Quick Templates",
        "Upload & Stamp Option",
        "20 Tokenized Certificates per Month",
        "Basic Profile Visibility"
      ]
    },
    {
      name: "Basic",
      description: "Create and manage more tokens with added tools",
      price: "₱299",
      period: "/ month",
      buttonText: "TRY NOW",
      features: [
        "All Starter Features",
        "Edit in Platform (custom certificate creator)",
        "Add Custom Branding",
        "200 Tokenized Certificates per Month"
      ],
      popular: true
    },
    {
      name: "Pro",
      description: "Streamline credential issuance with advanced features",
      price: "₱999",
      period: "/ month",
      buttonText: "TRY NOW",
      features: [
        "All Basic Features",
        "Team Collaboration Tools",
        "Analytics Dashboard",
        "Priority Support",
        "Unlimited Tokenized Certificates"
      ]
    }
  ];

  return (
    <div className="container w-full mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <Card 
              key={tier.name} 
              className={`card-clean h-full group cursor-pointer transition-all duration-300 relative overflow-hidden ${
                tier.popular 
                  ? 'hover:shadow-lg border-2 border-green-500 shadow-md' 
                  : 'hover:shadow-md'
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center py-2 text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              <CardHeader className={`text-center ${tier.popular ? 'pt-16' : 'pt-8'} pb-4`}>
                <CardTitle className="text-2xl font-bold text-green-800 mb-2">
                  {tier.name}
                </CardTitle>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  {tier.description}
                </p>
                
                <div className="mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-green-800">
                      {tier.price}
                    </span>
                    <span className="text-gray-600 ml-2">
                      {tier.period}
                    </span>
                  </div>
                </div>
                <div className='w-full h-2'></div>
                <Button 
                  className={`w-full py-3 font-semibold transition-all duration-300 ${
                    tier.popular 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-sm' 
                      : 'bg-white text-green-800 hover:bg-gray-50 border border-green-200 hover:border-green-300'
                  }`}
                  size="lg"
                >
                  {tier.buttonText}
                </Button>
              </CardHeader>
              
              <CardContent className="pt-4">
                <ul className="space-y-4">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              {/* Bottom gradient bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity" />
            </Card>
          ))}
        </div>
      </div>
  );
};

export default PricingSection;
'use client'

import React from "react";
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target, ShoppingCart, PiggyBank, Receipt } from "lucide-react";

const InsightCarousel = () => {
  const [emblaRef] = useEmblaCarousel({
    loop: true,
    align: 'center',
  }, [
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  ]);

  const insights = [
    {
      title: "Budget Tracking",
      description: "Current spending at $1,248.56 is well within your $3,500 monthly budget",
      icon: <Target className="h-8 w-8 text-green-500" />,
      metric: "64% of budget remaining",
      trend: "positive"
    },
    {
      title: "Spending Trend",
      description: "Monthly expenses increased by 20.1% compared to last month",
      icon: <TrendingUp className="h-8 w-8 text-amber-500" />,
      metric: "+20.1%",
      trend: "warning"
    },
    {
      title: "Savings Growth",
      description: "Your monthly savings increased by 12.5% to $425.00",
      icon: <PiggyBank className="h-8 w-8 text-blue-500" />,
      metric: "+$47.22",
      trend: "positive"
    },
    {
      title: "Recent Purchases",
      description: "Largest recent purchase: Amazon Electronics ($245.50)",
      icon: <ShoppingCart className="h-8 w-8 text-purple-500" />,
      metric: "3 new receipts",
      trend: "neutral"
    },
    {
      title: "Tax Tracking",
      description: "Sales tax represents 12.12% of your total spending",
      icon: <Receipt className="h-8 w-8 text-gray-500" />,
      metric: "$103.01",
      trend: "neutral"
    }
  ];

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {insights.map((insight, index) => (
          <div key={index} className="flex-[0_0_100%] min-w-0">
            <Card className="mx-4 border border-border/40 bg-card/50 backdrop-blur-sm bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {insight.icon}
                      <h3 className="font-semibold text-lg">{insight.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {insight.description}
                    </p>
                    <div className="text-lg font-bold text-primary">
                      {insight.metric}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsightCarousel;
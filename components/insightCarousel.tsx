import React from "react";
import { Carousel,CarouselItem,CarouselContent } from "@/components/ui/carousel";
import InsightCard from "@/components/insightCard";

const insights = [
  { title: "Walmart", category: "Groceries", date: "14/03/2024", amount: "$156.78" },
  { title: "Amazon", category: "Shopping", date: "10/03/2024", amount: "$299.99" },
  { title: "Starbucks", category: "Coffee", date: "12/03/2024", amount: "$5.75" },
];

const InsightCarousel = () => {
  return (
    <Carousel>
        <CarouselContent className="flex flex-nowrap"> 
            {insights.map((insight, index) => (
                <CarouselItem key={index}>
                <InsightCard
                    title={insight.title}
                    category={insight.category}
                    date={insight.date}
                    amount={insight.amount}
                />
        </CarouselItem>
        ))}
        </CarouselContent>
    </Carousel>
  );
};

export default InsightCarousel;

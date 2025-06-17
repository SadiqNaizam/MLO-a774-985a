import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import {
  Pizza,
  Fish,
  Soup,
  Beef,
  Salad,
  CakeSlice,
  Coffee,
  LucideIcon,
  UtensilsCrossed
} from 'lucide-react';

// Define the structure for a cuisine item
export interface Cuisine {
  id: string;
  name: string;
  icon: LucideIcon; // Using LucideIcon type for clarity
}

// Props for the CuisineSelectorCarousel component
interface CuisineSelectorCarouselProps {
  cuisines: Cuisine[];
  selectedCuisineId?: string | null;
  onSelectCuisine: (cuisineId: string) => void;
  className?: string;
}

// Placeholder data if needed, or parent component can provide it.
// For this example, we assume `cuisines` prop will be populated.
// const defaultCuisines: Cuisine[] = [
//   { id: 'pizza', name: 'Pizza', icon: Pizza },
//   { id: 'sushi', name: 'Sushi', icon: Fish },
//   { id: 'indian', name: 'Indian', icon: Soup },
//   { id: 'burgers', name: 'Burgers', icon: Beef },
//   { id: 'salads', name: 'Salads', icon: Salad },
//   { id: 'desserts', name: 'Desserts', icon: CakeSlice },
//   { id: 'cafes', name: 'Cafes', icon: Coffee },
//   { id: 'chinese', name: 'Chinese', icon: UtensilsCrossed },
// ];

const CuisineSelectorCarousel: React.FC<CuisineSelectorCarouselProps> = ({
  cuisines,
  selectedCuisineId,
  onSelectCuisine,
  className,
}) => {
  console.log('CuisineSelectorCarousel loaded');

  if (!cuisines || cuisines.length === 0) {
    return (
      <div className={cn("py-4 text-center", className)}>
        <p>No cuisines to display.</p>
      </div>
    );
  }

  return (
    <div className={cn("w-full px-4 md:px-0 py-4", className)}>
      <Carousel
        opts={{
          align: "start",
          slidesToScroll: 'auto', // Scroll by number of items visible or 1 by 1
          // loop: true, // Optional: if you want the carousel to loop
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {cuisines.map((cuisine) => (
            <CarouselItem
              key={cuisine.id}
              className="pl-2 md:pl-4 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 xl:basis-1/8"
            >
              <Card
                onClick={() => onSelectCuisine(cuisine.id)}
                className={cn(
                  "cursor-pointer transition-all duration-200 ease-in-out hover:shadow-md hover:border-primary/50",
                  selectedCuisineId === cuisine.id
                    ? "border-2 border-primary ring-2 ring-primary ring-offset-2 shadow-lg"
                    : "border",
                  "overflow-hidden group"
                )}
                role="button"
                aria-pressed={selectedCuisineId === cuisine.id}
                aria-label={`Select ${cuisine.name} cuisine`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectCuisine(cuisine.id);
                  }
                }}
              >
                <CardContent className="flex flex-col items-center justify-center p-3 sm:p-4 aspect-square gap-2">
                  <cuisine.icon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-700 group-hover:text-primary transition-colors" />
                  <span className="text-xs sm:text-sm text-center font-medium text-gray-700 group-hover:text-primary transition-colors line-clamp-1">
                    {cuisine.name}
                  </span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-2 hidden sm:flex disabled:hidden" />
        <CarouselNext className="mr-2 hidden sm:flex disabled:hidden" />
      </Carousel>
    </div>
  );
};

export default CuisineSelectorCarousel;
import React from 'react';
import { ClipboardList, ChefHat, Truck, PackageCheck, CheckCircle2 } from 'lucide-react';

// Define OrderStatusId type for stronger typing of status identifiers
export type OrderStatusId = 'ORDER_PLACED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED';

// Interface for individual status configuration, allowing icon components to be passed
interface StatusConfig {
  id: OrderStatusId;
  label: string;
  icon: React.ElementType; // Expects a Lucide icon component (or any React component)
}

// Props for the OrderStatusTracker component
interface OrderStatusTrackerProps {
  currentStatusId: OrderStatusId;
  statuses?: StatusConfig[]; // Optional: allows passing a custom list of statuses
}

// Default statuses configuration, used if no `statuses` prop is provided
const DEFAULT_STATUSES: StatusConfig[] = [
  { id: 'ORDER_PLACED', label: 'Order Placed', icon: ClipboardList },
  { id: 'PREPARING', label: 'Preparing', icon: ChefHat },
  { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
  { id: 'DELIVERED', label: 'Delivered', icon: PackageCheck },
];

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  currentStatusId,
  statuses = DEFAULT_STATUSES,
}) => {
  console.log('OrderStatusTracker loaded with currentStatusId:', currentStatusId);

  const currentIndex = statuses.findIndex(status => status.id === currentStatusId);

  // Handle cases where the currentStatusId is not found in the provided statuses
  if (currentIndex === -1) {
    console.error('OrderStatusTracker: currentStatusId "' + currentStatusId + '" not found in statuses array.');
    return <div className="text-center text-red-600 dark:text-red-400 p-4">Error: Invalid order status provided.</div>;
  }
  
  // Handle cases where statuses array is empty
  if (statuses.length === 0) {
    console.warn('OrderStatusTracker: Statuses array is empty.');
    return <div className="text-center text-gray-500 dark:text-gray-400 p-4">No order statuses to display.</div>;
  }

  return (
    <div className="w-full py-4 px-2 sm:px-4">
      <div className="flex items-start w-full">
        {statuses.map((status, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          // isPending can be inferred as !isCompleted && !isActive

          let iconWrapperBgColor = 'bg-gray-200 dark:bg-gray-700';
          let iconColor = 'text-gray-500 dark:text-gray-400';
          let textColor = 'text-gray-500 dark:text-gray-400';
          let IconComponent = status.icon;

          if (isCompleted) {
            iconWrapperBgColor = 'bg-green-500';
            iconColor = 'text-white';
            textColor = 'text-green-600 dark:text-green-400 font-medium';
            IconComponent = CheckCircle2; // Use CheckCircle2 for completed steps
          } else if (isActive) {
            iconWrapperBgColor = 'bg-blue-600 animate-pulse'; // Pulsing animation for active step
            iconColor = 'text-white';
            textColor = 'text-blue-600 dark:text-blue-400 font-semibold';
            // IconComponent remains status.icon for the active step
          }
          // For pending steps, default colors and icon are used.

          return (
            <React.Fragment key={status.id}>
              {/* Step Node (Icon and Label) */}
              <div className="flex flex-col items-center text-center px-1 sm:px-2 flex-shrink-0">
                <div
                  className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center 
                              ${iconWrapperBgColor} 
                              transition-all duration-300 ease-in-out mb-2`}
                >
                  <IconComponent className={`h-5 w-5 sm:h-6 sm:w-6 ${iconColor}`} />
                </div>
                <p
                  className={`text-xs sm:text-sm ${textColor} transition-colors duration-300 ease-in-out 
                              max-w-[70px] sm:max-w-[100px] break-words leading-tight`}
                >
                  {status.label}
                </p>
              </div>

              {/* Connector Line between Step Nodes */}
              {index < statuses.length - 1 && (
                <div
                  className={`flex-auto h-1 sm:h-1.5 rounded-full self-start mt-[18px] sm:mt-[22px] 
                              ${index < currentIndex ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}
                              transition-colors duration-500 ease-in-out mx-1 sm:mx-2`}
                  // Connector is green if the step it originates from is completed, otherwise gray.
                  // Adjusted margin-top (mt) to vertically align with center of icons.
                  // flex-auto allows it to grow and fill space.
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTracker;
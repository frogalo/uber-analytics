//Replace content of ./components/ui/card.tsx (Delete Newcard file if exists)
import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white shadow-md overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

// function Progress({
//   className,
//   value,
//   ...props
// }: React.ComponentProps<typeof ProgressPrimitive.Root>) {
//   return (
//     <ProgressPrimitive.Root
//       data-slot="progress"
//       className={cn(
//         "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
//         className
//       )}
//       {...props}
//     >
//       <ProgressPrimitive.Indicator
//         data-slot="progress-indicator"
//         className="bg-[#276D8D] h-full w-full flex-1 transition-all"
//         style={{ transform: `translateX(-${100 - (value || 0)}%)`  }}
//       />
//     </ProgressPrimitive.Root>
//   )
// }

import clsx from "clsx";

interface CustomProgressProps {
  value: number; // can be >100
}

function Progress({ value }:{value:number}){
  return (
    <div className="relative h-3 w-full overflow-hidden rounded-full bg-[#ededed]" >
      <div
        className={clsx(
          "h-full rounded-full bg-primary transition-all duration-300 bg-[#3088AF]",
          value > 100 && "bg-destructive"
        )}
        style={{
          width: `${value}%`,
        }}
      />
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
        {/* {value}% */}
      </span>
    </div>
  );
};

// function Progress(){
//   return(
//     <div>progress</div>
//   )
// }
export { Progress }

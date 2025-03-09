import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const spinnerVariants = cva(
  "inline-block animate-spin",
  {
    variants: {
      variant: {
        default: "text-primary",
        destructive: "text-destructive",
        outline: "text-input",
        secondary: "text-secondary",
        ghost: "text-accent",
        link: "text-primary",
      },
      size: {
        default: "w-6 h-6",
        sm: "w-4 h-4",
        lg: "w-8 h-8",
        icon: "w-5 h-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface SpinnerProps
  extends React.SVGAttributes<SVGSVGElement>,
    VariantProps<typeof spinnerVariants> {}

const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        className={cn(spinnerVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <path 
          fill="currentColor" 
          d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"
        >
          <animateTransform 
            attributeName="transform" 
            dur="0.75s" 
            repeatCount="indefinite" 
            type="rotate" 
            values="0 12 12;360 12 12"
          />
        </path>
      </svg>
    )
  }
)
Spinner.displayName = "Spinner"

export { Spinner, spinnerVariants }
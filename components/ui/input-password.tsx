import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    // Fix the input type logic - show password when showPassword is true
    const isPasswordInput = type === "text";
    const inputType = isPasswordInput
      ? showPassword
        ? "text"
        : "password"
      : type;

    return (
      <div className="group flex h-9 w-full rounded-md border-2 border-light bg-transparent px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-accent md:text-sm">
        <input
          type={inputType}
          className={cn(
            "focus-visible:outline-none outline-none w-full bg-transparent ",
            className
          )}
          ref={ref}
          {...props}
        />

        <button
          role="button"
          type="button"
          onClick={togglePasswordVisibility}
          className="flex aspect-square text-color-secondary justify-center items-center rounded-md hover:bg-accent hover:text-color-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            className="icons"
          >
            {showPassword ? (
              // Eye closed icon when password is visible
              <>
                <path
                  d="M22 8C22 8 18 14 12 14C6 14 2 8 2 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M15 13.5L16.5 16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 11L22 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 13L4 11"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 13.5L7.5 16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            ) : (
              // Eye open icon when password is hidden
              <>
                <path
                  d="M21.544 11.045C21.848 11.4713 22 11.6845 22 12C22 12.3155 21.848 12.5287 21.544 12.955C20.1779 14.8706 16.6892 19 12 19C7.31078 19 3.8221 14.8706 2.45604 12.955C2.15201 12.5287 2 12.3155 2 12C2 11.6845 2.15201 11.4713 2.45604 11.045C3.8221 9.12944 7.31078 5 12 5C16.6892 5 20.1779 9.12944 21.544 11.045Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </>
            )}
          </svg>
        </button>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };

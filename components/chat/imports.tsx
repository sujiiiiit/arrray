import React from "react";

import { Button } from "@/components/ui/button";

const ChatComponent: React.FC = () => {
  return (
    <div className="flex justify-center items-center flex-wrap  sm:gap-3 gap-2 ">
      <Button
        variant={"outline"}
        className="rounded-full sm:h-10 h-8 text-color-secondary sm:dark:border-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          className="h-[18px] w-[18px]"
        >
          <path
            d="M22 16C21.4102 15.3932 19.8403 13 19 13C18.1597 13 16.5898 15.3932 16 16M19 14L19 21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.0035 21H12.0027C7.28739 21 4.92973 21 3.46487 19.5355C2 18.0711 2 15.714 2 11V7.94427C2 6.1278 2 5.21956 2.38042 4.53806C2.6516 4.05227 3.05255 3.65142 3.53848 3.38032C4.22017 3 5.12865 3 6.94562 3C8.10968 3 8.69172 3 9.20122 3.19101C10.3645 3.62712 10.8442 4.68358 11.3691 5.73313L12.0027 7M8.00163 7H16.754C18.8613 7 19.9149 7 20.6718 7.50559C20.9995 7.72447 21.2808 8.00572 21.4997 8.33329C21.8937 8.92282 21.9808 9.69244 22 11"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        Import folder
      </Button>
      <Button
        variant={"outline"}
        className="rounded-full  sm:h-10 h-8 text-color-secondary sm:dark:border-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          className="h-[18px] w-[18px]"
        >
          <path
            d="M7 20C8.10457 20 9 19.1046 9 18C9 16.8954 8.10457 16 7 16C5.89543 16 5 16.8954 5 18C5 19.1046 5.89543 20 7 20Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M7 8C8.10457 8 9 7.10457 9 6C9 4.89543 8.10457 4 7 4C5.89543 4 5 4.89543 5 6C5 7.10457 5.89543 8 7 8Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M17 14C18.1046 14 19 13.1046 19 12C19 10.8954 18.1046 10 17 10C15.8954 10 15 10.8954 15 12C15 13.1046 15.8954 14 17 14Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M7.02116 8.2793V15.4073M14.4113 12.0047L10.0193 12.0048C8.92158 12.0048 6.86182 11.1254 7.01818 8.78001"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Clone <span className="sm:flex hidden">git</span> repo
      </Button>
    </div>
  );
};

export default ChatComponent;

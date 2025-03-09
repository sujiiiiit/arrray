import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/common-dropdown";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { Button } from "../ui/button";

function ProfileDropdown() {
  const { user, isLoading, signOut } = useAuth();

  const handleClickSignOutButton = async () => {
    await signOut();
  };

  if (isLoading) {
    return <div className="h-8 w-8 rounded-full bg-accent animate-pulse" />;
  }

  return (
    <>
      {user ? (
        <>
          <DropdownMenu>
            <Tooltip>
              <DropdownMenuTrigger asChild>
                <TooltipTrigger asChild>
                  <Avatar className="w-8 h-8 cursor-pointer">
                    <AvatarImage src={user.avatar_url || "https://github.com/shadcn.png"} />
                    <AvatarFallback>{user.full_name?.substring(0, 2) || "CN"}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="bottom"
                align="start"
                alignOffset={-100}
              >
                <DropdownMenuItem>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-[18px] w-[18px] shrink-0"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6.578 15.482c-1.415.842-5.125 2.562-2.865 4.715C4.816 21.248 6.045 22 7.59 22h8.818c1.546 0 2.775-.752 3.878-1.803c2.26-2.153-1.45-3.873-2.865-4.715a10.66 10.66 0 0 0-10.844 0M16.5 6.5a4.5 4.5 0 1 1-9 0a4.5 4.5 0 0 1 9 0"
                      color="currentColor"
                    />
                  </svg>
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleClickSignOutButton} className="danger focus:bg-destructive-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-[18px] w-[18px] shrink-0 !text-destructive"
                  >
                    <path
                      d="M14 3.09502C13.543 3.03241 13.0755 3 12.6 3C7.29807 3 3 7.02944 3 12C3 16.9706 7.29807 21 12.6 21C13.0755 21 13.543 20.9676 14 20.905"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M21 12L11 12M21 12C21 11.2998 19.0057 9.99153 18.5 9.5M21 12C21 12.7002 19.0057 14.0085 18.5 14.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
              <TooltipContent>
                <p>{user.full_name || user.username || "User"}</p>
              </TooltipContent>
            </Tooltip>
          </DropdownMenu>
        </>
      ) : (
        <>
          <Link href={"/login"} className="">
          <Button variant={"default"} className="h-8 rounded-full">
            Login
          </Button>
          </Link>
        </>
      )}
    </>
  );
}

export default ProfileDropdown;
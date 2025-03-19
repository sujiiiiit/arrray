import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SearchInput({ className, onSearch }: { className?: string; onSearch: (value: string) => void }) {
  return (
    <Input
      placeholder="Search projects..."
      className={cn(
        "h-12 bg-transparent border-0 outline-0 px-4 border-x border-light rounded-none",
        className
      )}
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}
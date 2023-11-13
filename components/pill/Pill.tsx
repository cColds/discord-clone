import { cn } from "@/lib/utils";

type PillProps = { selected: boolean };

export default function Pill({ selected }: PillProps) {
  console.log({ selected });

  return (
    <div
      className="absolute left-0 top-0 w-2 h-12 flex items-center"
      aria-label="hidden"
    >
      <span
        className={cn(
          "h-5 w-2 rounded-tr-sm rounded-br-sm bg-header-primary absolute -ml-1 duration-100 transition-all",
          {
            "h-10": selected,
          }
        )}
      ></span>
    </div>
  );
}

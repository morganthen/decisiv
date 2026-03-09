"use client";

import { prioritize } from "@/lib/actions";
import { Button } from "./ui/button";
import { toast } from "sonner";

type PrioritizeButtonProps = {
  isBusy: boolean;
  isPrioritising: boolean;
  startPrioritising: (callback: () => void) => void;
};

export default function PrioritizeButton({
  isBusy,
  isPrioritising,
  startPrioritising,
}: PrioritizeButtonProps) {
  function handleClick() {
    startPrioritising(async () => {
      await prioritize();
      toast("refreshing list");
    });
  }
  return (
    <div>
      <Button onClick={handleClick} disabled={isBusy}>
        {isPrioritising ? "prioritising..." : "prioritise"}
      </Button>
    </div>
  );
}

"use client";

import { Button } from "./ui/button";

type PrioritizeButtonProps = {
  isBusy: boolean;
  isPrioritising: boolean;
  handlePrioritise: () => void;
};

export default function PrioritizeButton({
  isBusy,
  isPrioritising,
  handlePrioritise,
}: PrioritizeButtonProps) {
  return (
    <div>
      <Button onClick={handlePrioritise} disabled={isBusy}>
        {isPrioritising ? "prioritising..." : "prioritise"}
      </Button>
    </div>
  );
}

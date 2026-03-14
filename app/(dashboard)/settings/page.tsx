import { Separator } from "@/components/ui/separator";
import ContextForm from "@/components/settings/ContextForm";
import DeleteAccountCard from "@/components/settings/DeleteAccountCard";

export default function Settings() {
  return (
    <div className="w-dvw min-h-dvh flex flex-col items-center justify-start px-6 py-12 space-y-6">
      <div className="w-full max-w-3xl space-y-6">
        <ContextForm />
        <Separator />
        <DeleteAccountCard />
      </div>
    </div>
  );
}

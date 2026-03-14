import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/auth/supabase";
import { deleteUser } from "@/lib/auth/actions";
import { TriangleAlert } from "lucide-react";

export default async function DeleteAccountCard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex gap-4">
            <TriangleAlert></TriangleAlert>
            <span>danger zone</span>
          </div>
        </CardTitle>
        <CardDescription>
          these are irreversible actions. proceed with caution — we&apos;ll ask
          you to confirm before anything permanent happens.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            deleting your account will permanently remove your profile, tasks,
            and any personalized settings from decisiv&apos;s data stores. this
            cannot be undone.
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">delete account</div>
              <div className="text-xs text-muted-foreground">
                permanently remove your account and all associated data.
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">delete account</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm account deletion</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. All your data will be
                    permanently deleted. If you&apos;re sure, click the red
                    button below.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <form className="contents">
                    <input type="hidden" name="id" value={user?.id}></input>
                    <Button formAction={deleteUser} variant="destructive">
                      delete account
                    </Button>
                  </form>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

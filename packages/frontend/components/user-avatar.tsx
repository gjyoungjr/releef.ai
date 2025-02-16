import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/auth";
import { Session } from "@releef.ai/types";

export async function UserAvatar() {
  const session = (await auth()) as Session;
  const user = session.user;
  return (
    <Avatar className="h-8 w-8 rounded-lg">
      <AvatarImage
        src={`https://avatar.tobi.sh/${user.name}`}
        alt={user.name}
      />
      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
    </Avatar>
  );
}

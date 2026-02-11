import { redirect } from "next/navigation";

export default function LegacyChatPage() {
  redirect("/members/chat");
}

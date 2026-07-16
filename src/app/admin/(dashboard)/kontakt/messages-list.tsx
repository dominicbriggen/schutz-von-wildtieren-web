"use client";

import { useTransition } from "react";
import { Mail, MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { deleteMessage, markMessageRead } from "@/lib/actions/messages";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export function MessagesList({ messages }: { messages: Message[] }) {
  const [, startTransition] = useTransition();

  if (messages.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Es sind keine Nachrichten über das Kontaktformular eingegangen.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {messages.map((msg) => (
        <li
          key={msg.id}
          className={`rounded-lg border p-4 ${
            msg.is_read ? "border-border bg-card" : "border-accent/50 bg-accent/5"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-medium text-foreground">
                {msg.name}{" "}
                <span className="font-normal text-muted-foreground">
                  &lt;{msg.email}&gt;
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(msg.created_at).toLocaleString("de-CH")}
              </p>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={msg.is_read ? "Als ungelesen markieren" : "Als gelesen markieren"}
                onClick={() => startTransition(() => markMessageRead(msg.id))}
              >
                {msg.is_read ? (
                  <MailOpen className="size-4" />
                ) : (
                  <Mail className="size-4 text-accent" />
                )}
              </Button>
              <DeleteConfirmDialog
                itemLabel={`Nachricht von ${msg.name}`}
                onConfirm={() => deleteMessage(msg.id)}
              />
            </div>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm text-foreground">{msg.message}</p>
        </li>
      ))}
    </ul>
  );
}

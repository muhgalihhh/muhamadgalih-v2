"use client";

import { useState, useTransition } from "react";
import { MailOpen, Trash2, Loader2, Mail } from "lucide-react";
import { markMessageRead, deleteMessage } from "@/app/actions/admin";
import type { ContactMessage } from "@/types/portfolio";

export default function MessagesAdminClient({ messages: initial }: { messages: ContactMessage[] }) {
  const [items, setItems] = useState(initial);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const unreadCount = items.filter((m) => !m.read).length;

  const handleSelect = (msg: ContactMessage) => {
    setSelected(msg);
    if (!msg.read) {
      startTransition(async () => {
        await markMessageRead(msg.id);
        setItems((prev) => prev.map((m) => m.id === msg.id ? { ...m, read: true } : m));
      });
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this message? This cannot be undone.")) return;
    setLoadingId(id);
    startTransition(async () => {
      await deleteMessage(id);
      setItems((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
      setLoadingId(null);
    });
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
        {unreadCount > 0 && (
          <p className="text-sm text-indigo-600 font-medium mt-1">{unreadCount} unread</p>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 text-slate-400 text-sm">No messages yet.</div>
      ) : (
        <div className="flex gap-5 items-start">
          {/* List */}
          <div className="w-80 shrink-0 flex flex-col gap-2">
            {items.map((msg) => (
              <button
                key={msg.id}
                onClick={() => handleSelect(msg)}
                className={`w-full text-left rounded-xl border px-4 py-3 transition-colors ${
                  selected?.id === msg.id
                    ? "border-indigo-400 bg-indigo-50"
                    : msg.read
                    ? "border-slate-200 bg-white hover:bg-slate-50"
                    : "border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {!msg.read && <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />}
                  <p className={`text-sm truncate ${msg.read ? "font-medium text-slate-700" : "font-bold text-slate-900"}`}>
                    {msg.name}
                  </p>
                </div>
                <p className="text-xs text-slate-500 truncate">{msg.subject}</p>
                <p className="text-[10px] text-slate-400 mt-1">
                  {new Date(msg.created_at).toLocaleDateString("en-GB", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </p>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          {selected ? (
            <div className="flex-1 bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">{selected.subject}</h2>
                  <p className="text-sm text-slate-500 mt-0.5">
                    From: <span className="font-medium text-slate-700">{selected.name}</span>{" "}
                    &lt;{selected.email}&gt;
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(selected.created_at).toLocaleString("en-GB")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                  >
                    <MailOpen size={12} />
                    Reply
                  </a>
                  <button
                    onClick={() => handleDelete(selected.id)}
                    disabled={loadingId === selected.id}
                    className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loadingId === selected.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Trash2 size={12} />
                    )}
                    Delete
                  </button>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-300">
              <Mail size={40} strokeWidth={1} />
              <p className="text-sm mt-3">Select a message to read</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

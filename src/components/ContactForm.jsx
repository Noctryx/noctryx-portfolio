import { useEffect } from "react";
import { useForm as useFormspree, ValidationError } from "@formspree/react";
import { ArcaneButton } from "./ArcaneButton";

export function ContactForm({ onSuccess }) {
  const formKey = resolveFormKey();

  if (!formKey) {
    return (
      <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-200">
        Set <span className="font-semibold">VITE_FORMSPREE_FORM_ID</span> or
        <span className="font-semibold"> VITE_FORMSPREE_ENDPOINT</span> to
        enable the contact form.
      </div>
    );
  }

  return <ContactFormForm formKey={formKey} onSuccess={onSuccess} />;
}

function ContactFormForm({ formKey, onSuccess }) {
  const [state, handleSubmit, resetForm] = useFormspree(formKey);

  useEffect(() => {
    if (!state.succeeded) return;
    onSuccess?.();
    resetForm();
  }, [onSuccess, resetForm, state.succeeded]);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <input
          type="text"
          name="name"
          placeholder="Adventurer's Name"
          className="w-full px-4 py-3 rounded-xl bg-[var(--app-surface)] dark:bg-zinc-800/70 border border-[var(--app-border)] dark:border-zinc-700 text-[var(--app-text)] placeholder-[var(--app-placeholder)] focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition"
          required
        />
        <ValidationError
          prefix="Name"
          field="name"
          errors={state.errors}
          className="text-red-400 text-sm mt-1"
        />
      </div>

      <div>
        <input
          type="email"
          name="email"
          placeholder="Return Address (Email)"
          className="w-full px-4 py-3 rounded-xl bg-[var(--app-surface)] dark:bg-zinc-800/70 border border-[var(--app-border)] dark:border-zinc-700 text-[var(--app-text)] placeholder-[var(--app-placeholder)] focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition"
          required
        />
        <ValidationError
          prefix="Email"
          field="email"
          errors={state.errors}
          className="text-red-400 text-sm mt-1"
        />
      </div>

      <div>
        <input
          type="text"
          name="subject"
          placeholder="Scroll Title (Subject)"
          className="w-full px-4 py-3 rounded-xl bg-[var(--app-surface)] dark:bg-zinc-800/70 border border-[var(--app-border)] dark:border-zinc-700 text-[var(--app-text)] placeholder-[var(--app-placeholder)] focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition"
          required
        />
        <ValidationError
          prefix="Subject"
          field="subject"
          errors={state.errors}
          className="text-red-400 text-sm mt-1"
        />
      </div>

      <div>
        <textarea
          name="message"
          placeholder="Inscribe your message here..."
          rows="5"
          className="w-full px-4 py-3 rounded-xl bg-[var(--app-surface)] dark:bg-zinc-800/70 border border-[var(--app-border)] dark:border-zinc-700 text-[var(--app-text)] placeholder-[var(--app-placeholder)] focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition resize-none"
          required
        />
        <ValidationError
          prefix="Message"
          field="message"
          errors={state.errors}
          className="text-red-400 text-sm mt-1"
        />
      </div>

      <ArcaneButton type="submit" disabled={state.submitting} size="full">
        {state.submitting ? "Raven in flight..." : "Dispatch"}
      </ArcaneButton>
    </form>
  );
}

function resolveFormKey() {
  const explicitKey = import.meta.env.VITE_FORMSPREE_FORM_ID;
  if (explicitKey) return explicitKey;

  const endpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT;
  if (!endpoint) return null;

  try {
    const parsedUrl = new URL(endpoint);
    const segments = parsedUrl.pathname.split("/").filter(Boolean);
    return segments[segments.length - 1] ?? null;
  } catch {
    return endpoint;
  }
}

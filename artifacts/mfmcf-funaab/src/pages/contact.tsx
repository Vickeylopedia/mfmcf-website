import { useState, type ReactNode } from "react";
import { ArrowUpRight, Check, Clock3, Mail, MapPin, Mic2, Send } from "lucide-react";
import { useSubmitContact } from "@workspace/api-client-react";
import { Shell } from "@/components/layout/site-shell";
import { PageIntro } from "@/components/layout/page-intro";
import { Reveal } from "@/components/reveal";
import { Eyebrow } from "@/components/foundation";
import { useDocumentTitle } from "@/hooks/use-document-title";

function Contact() {
  useDocumentTitle("Connect & Plan Your Visit");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("Planning my first visit");
  const [message, setMessage] = useState("");
  const submit = useSubmitContact();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit.mutate({ data: { name, email, topic, message } });
  };

  const sendAnother = () => {
    setName("");
    setEmail("");
    setTopic("Planning my first visit");
    setMessage("");
    submit.reset();
  };

  const sent = submit.isSuccess;

  return (
    <Shell>
      <PageIntro
        eyebrow="Come as you are"
        ghost="HELLO"
        title={
          <>
            Let’s make
            <br />
            <em className="font-normal">a plan.</em>
          </>
        }
        intro="Questions about a first visit, joining a unit, or finding your people? Send a note. A real person from the family will get back to you."
      />
      <section className="px-5 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-[1380px] gap-14 lg:grid-cols-[.7fr_1.3fr]">
          <Reveal variant="left">
            <div>
              <p className="mono-label text-[10px] text-[hsl(var(--primary))]">
                Your next Sunday
              </p>
              <div className="mt-8 space-y-7">
                <ContactDetail
                  icon={<MapPin />}
                  title="Find us"
                  body={
                    <>
                      Fellowship Auditorium
                      <br />
                      Federal University of Agriculture, Abeokuta
                    </>
                  }
                />
                <ContactDetail
                  icon={<Clock3 />}
                  title="Gather with us"
                  body={
                    <>
                      Sundays at 7:30 AM
                      <br />
                      Wednesdays at 5:00 PM
                    </>
                  }
                />
                <ContactDetail
                  icon={<Mail />}
                  title="Write to us"
                  body={
                    <>
                      mfmcf.funaab@gmail.com
                      <br />
                      We usually reply within a day.
                    </>
                  }
                />
              </div>
            </div>
          </Reveal>
          <Reveal variant="right" delay={100}>
            <form
            onSubmit={handleSubmit}
            className="border border-[hsl(var(--foreground)/.16)] bg-[hsl(var(--card))] p-6 sm:p-9"
          >
            <div className="flex items-center justify-between border-b border-[hsl(var(--foreground)/.12)] pb-5">
              <div>
                <p className="mono-label text-[10px] text-[hsl(var(--primary))]">
                  Say hello
                </p>
                <h2 className="display-font mt-2 text-3xl">
                  {sent ? "Message received." : "We’d love to hear from you."}
                </h2>
              </div>
              <Mic2 className="size-7 text-[hsl(var(--accent))]" />
            </div>
            {sent ? (
              <div className="py-16">
                <Check className="size-8 text-[hsl(var(--primary))]" />
                <p className="mt-5 max-w-sm text-lg leading-7">
                  Thank you for reaching out. Someone from the family will be
                  in touch soon.
                </p>
                <button
                  type="button"
                  data-testid="button-send-another-message"
                  onClick={sendAnother}
                  className="mt-7 text-sm font-bold text-[hsl(var(--primary))]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <div className="grid gap-6 pt-7 sm:grid-cols-2">
                <Field
                  id="contact-name"
                  label="Your name"
                  value={name}
                  onChange={setName}
                />
                <Field
                  id="contact-email"
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={setEmail}
                />
                <label
                  htmlFor="contact-topic"
                  className="text-sm font-semibold sm:col-span-2"
                >
                  What can we help with?
                  <select
                    id="contact-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    data-testid="select-contact-topic"
                    className="mt-2 block w-full border border-[hsl(var(--foreground)/.16)] bg-transparent px-4 py-3 text-sm font-normal outline-none focus:border-[hsl(var(--primary))]"
                  >
                    <option>Planning my first visit</option>
                    <option>Joining a unit</option>
                    <option>Prayer request</option>
                    <option>Something else</option>
                  </select>
                </label>
                <label
                  htmlFor="contact-message"
                  className="text-sm font-semibold sm:col-span-2"
                >
                  Your message
                  <textarea
                    id="contact-message"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    data-testid="textarea-contact-message"
                    className="mt-2 block min-h-32 w-full resize-y border border-[hsl(var(--foreground)/.16)] bg-transparent px-4 py-3 text-sm font-normal outline-none focus:border-[hsl(var(--primary))]"
                    placeholder="Tell us a little about what you need..."
                  />
                </label>
                {submit.isError && (
                  <p
                    role="alert"
                    data-testid="text-contact-error"
                    className="sm:col-span-2 text-sm font-semibold text-red-600"
                  >
                    Your note could not be sent just now. Please try again in a
                    moment.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={submit.isPending}
                  data-testid="button-submit-contact"
                  className="inline-flex w-fit items-center gap-3 bg-[hsl(var(--primary))] px-5 py-3 text-sm font-bold text-white transition hover:bg-[hsl(var(--foreground))] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submit.isPending ? "Sending…" : "Send your note"}{" "}
                  <Send className="size-4" />
                </button>
              </div>
            )}
          </form>
          </Reveal>
        </div>
      </section>

      {/* ── CAMPUS LOCATION MAP ── */}
      <section className="border-t border-[hsl(var(--foreground)/.14)] bg-[hsl(var(--card))] px-5 py-12 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-[1380px]">
          <Reveal>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <Eyebrow>Find our gathering</Eyebrow>
                <h2 className="display-font mt-2 text-3xl sm:text-4xl font-bold">
                  Fellowship location on campus.
                </h2>
                <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                  Federal University of Agriculture, Abeokuta (FUNAAB) · Fellowship Auditorium &amp; Chapel Grounds
                </p>
              </div>
              <a
                href="https://maps.app.goo.gl/xihdgqYP4ARSGjYLA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-2 border-[hsl(var(--foreground))] bg-[hsl(var(--accent))] px-4 py-2 font-mono text-xs font-black uppercase text-[hsl(var(--foreground))] shadow-[2px_2px_0px_hsl(var(--foreground))] transition hover:-translate-y-0.5 hover:bg-white"
              >
                Open in Google Maps <ArrowUpRight className="size-4" />
              </a>
            </div>

            <div className="mt-6 overflow-hidden border-2 border-[hsl(var(--foreground))] shadow-[4px_4px_0px_hsl(var(--foreground))]">
              <iframe
                title="MFMCF FUNAAB Location Map"
                src="https://maps.google.com/maps?q=Federal%20University%20of%20Agriculture%2C%20Abeokuta%2C%20Nigeria&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="h-[360px] w-full border-0 sm:h-[460px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </Shell>
  );
}

function ContactDetail({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center bg-[hsl(var(--secondary))] text-[hsl(var(--primary))] [&_svg]:size-4">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-bold">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))]">
          {body}
        </p>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label htmlFor={id} className="text-sm font-semibold">
      {label}
      <input
        id={id}
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid={`input-${id}`}
        className="mt-2 block w-full border border-[hsl(var(--foreground)/.16)] bg-transparent px-4 py-3 text-sm font-normal outline-none focus:border-[hsl(var(--primary))]"
      />
    </label>
  );
}

export default Contact;

import { CheckCircle2, Clock3, Send, ShieldAlert, XCircle } from "lucide-react";
import React from "react";
import { t } from "../i18n.js";
import { LiquidGlass } from "./LiquidGlass.jsx";

const statusIcon = {
  review: Clock3,
  closed: CheckCircle2,
  rejected: XCircle,
};

export default function SupportPanel({ tickets, setTickets, language }) {
  const [draft, setDraft] = React.useState({
    subject: "",
    type: "course",
    priority: "medium",
    message: "",
  });

  const createTicket = () => {
    if (!draft.subject.trim() || !draft.message.trim()) return;
    setTickets((items) => [
      {
        ...draft,
        id: `MH-${Math.floor(1100 + Math.random() * 8000)}`,
        status: "review",
        createdAt: new Date().toISOString().slice(0, 10),
      },
      ...items,
    ]);
    setDraft({ subject: "", type: "course", priority: "medium", message: "" });
  };

  const cycleStatus = (id) => {
    const next = { review: "closed", closed: "rejected", rejected: "review" };
    setTickets((items) => items.map((ticket) => ticket.id === id ? { ...ticket, status: next[ticket.status] } : ticket));
  };

  return (
    <section className="screen">
      <div className="section-title">
        <div>
          <span className="eyebrow">{t(language, "support.eyebrow")}</span>
          <h2>{t(language, "support.title")}</h2>
          <p>{t(language, "support.intro")}</p>
        </div>
      </div>
      <div className="support-grid">
        <LiquidGlass className="support-form">
          <h3>{t(language, "support.create")}</h3>
          <label>
            {t(language, "support.subject")}
            <input value={draft.subject} onChange={(event) => setDraft({ ...draft, subject: event.target.value })} placeholder="SAT worksheet / Deadline / Login" />
          </label>
          <div className="support-pair">
            <label>
              {t(language, "support.type")}
              <select value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value })}>
                {["course", "opportunity", "tech"].map((key) => <option value={key} key={key}>{t(language, `support.types.${key}`)}</option>)}
              </select>
            </label>
            <label>
              {t(language, "support.priority")}
              <select value={draft.priority} onChange={(event) => setDraft({ ...draft, priority: event.target.value })}>
                {["low", "medium", "high"].map((key) => <option value={key} key={key}>{t(language, `support.priorities.${key}`)}</option>)}
              </select>
            </label>
          </div>
          <label>
            {t(language, "support.message")}
            <textarea value={draft.message} onChange={(event) => setDraft({ ...draft, message: event.target.value })} rows="5" />
          </label>
          <button className="primary" onClick={createTicket}><Send size={17} />{t(language, "support.create")}</button>
        </LiquidGlass>
        <LiquidGlass className="ticket-list">
          <div className="section-title compact">
            <h3>{t(language, "support.queue")}</h3>
            <ShieldAlert size={20} />
          </div>
          {tickets.map((ticket) => {
            const Icon = statusIcon[ticket.status];
            return (
              <article className={`ticket-row ${ticket.status}`} key={ticket.id}>
                <div className="ticket-status">
                  <Icon size={18} />
                  <span>{t(language, `support.statuses.${ticket.status}`)}</span>
                </div>
                <strong>{ticket.subject}</strong>
                <p>{ticket.message}</p>
                <div className="ticket-meta">
                  <span>{ticket.id}</span>
                  <span>{t(language, `support.types.${ticket.type}`)}</span>
                  <span>{t(language, `support.priorities.${ticket.priority}`)}</span>
                  <span>{ticket.createdAt}</span>
                </div>
                <button className="secondary" onClick={() => cycleStatus(ticket.id)}>{t(language, `support.statuses.${ticket.status}`)}</button>
              </article>
            );
          })}
        </LiquidGlass>
      </div>
    </section>
  );
}

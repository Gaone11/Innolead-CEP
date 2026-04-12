"use client";

import { useState } from "react";
import { Calendar, Clock, User, Star, CheckCircle, ArrowRight, Video, MapPin, Brain } from "lucide-react";

const consultants = [
  {
    id: 1,
    name: "Thabo Mokoena",
    role: "Senior Strategy Consultant",
    specialties: ["Strategy Execution", "Governance", "Change Management"],
    rating: 4.9,
    sessions: 248,
    avatar: "TM",
    color: "#3BC2FB",
    aiMatch: 96,
    available: ["Mon", "Wed", "Fri"],
    bio: "15 years experience in strategy execution and organisational transformation across Southern Africa.",
  },
  {
    id: 2,
    name: "Dr. Aisha Dlamini",
    role: "Governance & Compliance Advisor",
    specialties: ["Corporate Governance", "Board Advisory", "Risk"],
    rating: 4.8,
    sessions: 192,
    avatar: "AD",
    color: "#007B5F",
    aiMatch: 91,
    available: ["Tue", "Thu"],
    bio: "Former Chief Compliance Officer with expertise in Botswana Companies Act and NBFIRA frameworks.",
  },
  {
    id: 3,
    name: "Kagiso Sithole",
    role: "Execution & Operations Specialist",
    specialties: ["PMO Setup", "Process Improvement", "OKRs"],
    rating: 4.7,
    sessions: 130,
    avatar: "KS",
    color: "#FF9933",
    aiMatch: 84,
    available: ["Mon", "Tue", "Thu", "Fri"],
    bio: "Certified Project Management Professional specialising in building execution systems for growing organisations.",
  },
];

const services = [
  { id: "diagnostic", label: "60-min Governance Review", duration: "60 min", price: "BWP 850", type: "video" },
  { id: "workshop", label: "Strategy Execution Workshop", duration: "2 days", price: "BWP 12,500", type: "in-person" },
  { id: "advisory", label: "OKR Implementation Advisory", duration: "3 × 90 min", price: "BWP 3,200", type: "video" },
  { id: "full", label: "Full Strategy Engagement", duration: "Custom", price: "BWP 45,000+", type: "in-person" },
];

const times = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
const dates = ["Mon 14 Apr", "Tue 15 Apr", "Wed 16 Apr", "Thu 17 Apr", "Fri 18 Apr"];

export default function BookingView() {
  const [selectedConsultant, setSelectedConsultant] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  const consultant = consultants.find(c => c.id === selectedConsultant);
  const service = services.find(s => s.id === selectedService);
  const canBook = selectedConsultant && selectedService && selectedDate && selectedTime;

  if (booked) {
    return (
      <div className="fade-in-up" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 480 }}>
        <div style={{
          backgroundColor: "#1A1F2E", border: "1px solid #374151", borderRadius: 20,
          padding: 48, textAlign: "center", maxWidth: 520,
        }}>
          <div className="glow-cyan" style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "linear-gradient(135deg, #3BC2FB, #007B5F)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
          }}>
            <CheckCircle size={36} color="#0F1419" />
          </div>
          <h2 style={{ fontFamily: "Montserrat, sans-serif", marginBottom: 8 }}>Session Confirmed!</h2>
          <p style={{ color: "#9CA3AF", marginBottom: 24, lineHeight: 1.6 }}>
            Your session with <strong style={{ color: "#fff" }}>{consultant?.name}</strong> has been booked for{" "}
            <strong style={{ color: "#3BC2FB" }}>{selectedDate} at {selectedTime}</strong>.
            A confirmation and pre-session briefing has been sent to your email.
          </p>
          <div style={{
            backgroundColor: "#252B3A", borderRadius: 12, padding: 18, marginBottom: 24, textAlign: "left",
          }}>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 12 }}>SESSION DETAILS</div>
            {[
              { label: "Service", value: service?.label },
              { label: "Consultant", value: consultant?.name },
              { label: "Date & Time", value: `${selectedDate}, ${selectedTime}` },
              { label: "Duration", value: service?.duration },
              { label: "Format", value: service?.type === "video" ? "Video Call (Zoom link will be sent)" : "In-Person (Gaborone)" },
              { label: "Investment", value: service?.price },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "#6B7280" }}>{item.label}</span>
                <span style={{ fontSize: 12, color: "#E5E7EB", fontWeight: 500 }}>{item.value}</span>
              </div>
            ))}
          </div>
          <div style={{
            backgroundColor: "rgba(59,194,251,0.08)", border: "1px solid rgba(59,194,251,0.2)",
            borderRadius: 10, padding: 14, marginBottom: 24,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Brain size={14} color="#3BC2FB" />
              <span style={{ fontSize: 12, color: "#3BC2FB", fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>CONSULTANT BRIEFING AGENT</span>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF" }}>
              {consultant?.name} has received an AI-generated briefing with your diagnostic results, toolkit usage, and recommended focus areas.
            </p>
          </div>
          <button
            onClick={() => { setBooked(false); setSelectedConsultant(null); setSelectedService(null); setSelectedDate(null); setSelectedTime(null); }}
            className="btn-primary"
            style={{ padding: "12px 28px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 14 }}
          >
            Book Another Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in-up">
      {/* AI Recommendation */}
      <div style={{
        background: "linear-gradient(135deg, rgba(59,194,251,0.08), rgba(0,123,95,0.06))",
        border: "1px solid rgba(59,194,251,0.2)", borderRadius: 14, padding: "16px 22px", marginBottom: 24,
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <Brain size={20} color="#3BC2FB" />
        <div>
          <span style={{ fontSize: 12, color: "#3BC2FB", fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>CONSULTANT MATCHING AGENT — </span>
          <span style={{ fontSize: 13, color: "#E5E7EB" }}>
            Based on your diagnostic, I recommend <strong style={{ color: "#fff" }}>Thabo Mokoena</strong> (96% match) for the{" "}
            <strong style={{ color: "#fff" }}>Strategy Execution Workshop</strong>. His profile aligns with your Execution and Governance gaps.
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>
        {/* Left: Consultant + Service + Time */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Consultants */}
          <div style={{ backgroundColor: "#1A1F2E", border: "1px solid #374151", borderRadius: 14, padding: 22 }}>
            <h3 style={{ margin: "0 0 18px", fontFamily: "Montserrat, sans-serif", fontSize: 14 }}>Choose a Consultant</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {consultants.map(c => {
                const selected = selectedConsultant === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedConsultant(c.id)}
                    style={{
                      textAlign: "left", padding: 16, borderRadius: 12,
                      border: selected ? `1px solid ${c.color}` : "1px solid #374151",
                      background: selected ? `${c.color}08` : "#252B3A",
                      cursor: "pointer", transition: "all 0.2s",
                      display: "flex", alignItems: "flex-start", gap: 14,
                    }}
                  >
                    <div style={{
                      width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                      background: `linear-gradient(135deg, ${c.color}, ${c.color}88)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 14, color: "#0F1419",
                    }}>
                      {c.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontFamily: "Montserrat, sans-serif", fontWeight: 700, color: "#fff" }}>{c.name}</span>
                        <span style={{
                          padding: "2px 8px", borderRadius: 6, fontSize: 10,
                          backgroundColor: `${c.color}18`, color: c.color,
                          fontFamily: "Montserrat, sans-serif", fontWeight: 700,
                        }}>
                          {c.aiMatch}% match
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 6 }}>{c.role}</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {c.specialties.map(sp => (
                          <span key={sp} style={{
                            padding: "2px 7px", borderRadius: 5,
                            backgroundColor: "#1A1F2E", border: "1px solid #374151",
                            fontSize: 11, color: "#9CA3AF",
                          }}>{sp}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
                        <Star size={12} color="#F59E0B" fill="#F59E0B" />
                        <span style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>{c.rating}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>{c.sessions} sessions</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Services */}
          <div style={{ backgroundColor: "#1A1F2E", border: "1px solid #374151", borderRadius: 14, padding: 22 }}>
            <h3 style={{ margin: "0 0 18px", fontFamily: "Montserrat, sans-serif", fontSize: 14 }}>Select a Service</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {services.map(svc => {
                const selected = selectedService === svc.id;
                return (
                  <button
                    key={svc.id}
                    onClick={() => setSelectedService(svc.id)}
                    style={{
                      textAlign: "left", padding: 14, borderRadius: 10,
                      border: selected ? "1px solid #3BC2FB" : "1px solid #374151",
                      background: selected ? "rgba(59,194,251,0.08)" : "#252B3A",
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      {svc.type === "video" ? <Video size={14} color="#3BC2FB" /> : <MapPin size={14} color="#007B5F" />}
                      {selected && <CheckCircle size={14} color="#3BC2FB" fill="#3BC2FB" />}
                    </div>
                    <div style={{ fontSize: 13, fontFamily: "Montserrat, sans-serif", fontWeight: 600, color: "#fff", marginBottom: 4, lineHeight: 1.3 }}>{svc.label}</div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11, color: "#9CA3AF" }}>{svc.duration}</span>
                      <span style={{ fontSize: 12, color: "#3BC2FB", fontWeight: 700 }}>{svc.price}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Time */}
          {selectedConsultant && selectedService && (
            <div style={{ backgroundColor: "#1A1F2E", border: "1px solid #374151", borderRadius: 14, padding: 22 }}>
              <h3 style={{ margin: "0 0 18px", fontFamily: "Montserrat, sans-serif", fontSize: 14 }}>Pick a Date & Time</h3>
              <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto" }}>
                {dates.map(date => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    style={{
                      padding: "10px 14px", borderRadius: 9, border: "none",
                      background: selectedDate === date ? "#3BC2FB" : "#252B3A",
                      color: selectedDate === date ? "#0F1419" : "#9CA3AF",
                      cursor: "pointer", fontSize: 12, whiteSpace: "nowrap",
                      fontFamily: "Montserrat, sans-serif", fontWeight: 600,
                      transition: "all 0.2s",
                    }}
                  >
                    {date}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {times.map(time => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    style={{
                      padding: "9px 16px", borderRadius: 8, border: "none",
                      background: selectedTime === time ? "#3BC2FB" : "#252B3A",
                      color: selectedTime === time ? "#0F1419" : "#9CA3AF",
                      cursor: "pointer", fontSize: 13,
                      fontFamily: "Montserrat, sans-serif", fontWeight: 600,
                      transition: "all 0.2s",
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Summary */}
        <div>
          <div style={{
            backgroundColor: "#1A1F2E", border: "1px solid #374151", borderRadius: 14, padding: 22,
            position: "sticky", top: 80,
          }}>
            <h3 style={{ margin: "0 0 20px", fontFamily: "Montserrat, sans-serif", fontSize: 14 }}>Booking Summary</h3>

            {consultant ? (
              <div style={{ marginBottom: 18, padding: 14, backgroundColor: "#252B3A", borderRadius: 10 }}>
                <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 8 }}>CONSULTANT</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 9,
                    background: `linear-gradient(135deg, ${consultant.color}, ${consultant.color}88)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 12, color: "#0F1419",
                  }}>
                    {consultant.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{consultant.name}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>{consultant.role}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: 14, backgroundColor: "#252B3A", borderRadius: 10, marginBottom: 18, textAlign: "center" }}>
                <User size={20} color="#6B7280" style={{ margin: "0 auto 8px", display: "block" }} />
                <div style={{ fontSize: 12, color: "#6B7280" }}>No consultant selected</div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              {[
                { icon: Calendar, label: "Service", value: service?.label || "—" },
                { icon: Clock, label: "Duration", value: service?.duration || "—" },
                { icon: Calendar, label: "Date", value: selectedDate || "—" },
                { icon: Clock, label: "Time", value: selectedTime || "—" },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Icon size={14} color="#6B7280" />
                      <span style={{ fontSize: 12, color: "#6B7280" }}>{item.label}</span>
                    </div>
                    <span style={{ fontSize: 12, color: "#E5E7EB", fontWeight: 500 }}>{item.value}</span>
                  </div>
                );
              })}
              <div style={{ borderTop: "1px solid #374151", paddingTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontFamily: "Montserrat, sans-serif", fontWeight: 700, color: "#fff" }}>Total</span>
                  <span style={{ fontSize: 18, fontFamily: "Montserrat, sans-serif", fontWeight: 800, color: "#3BC2FB" }}>
                    {service?.price || "BWP —"}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>+ 14% VAT on invoice</div>
              </div>
            </div>

            {/* AI Briefing note */}
            <div style={{
              backgroundColor: "rgba(59,194,251,0.06)", border: "1px solid rgba(59,194,251,0.15)",
              borderRadius: 10, padding: 12, marginBottom: 18,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <Brain size={12} color="#3BC2FB" />
                <span style={{ fontSize: 11, color: "#3BC2FB", fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>AI BRIEFING</span>
              </div>
              <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF", lineHeight: 1.5 }}>
                Your consultant will receive an AI-generated briefing with your diagnostic results, toolkit usage history, and key focus areas before the session.
              </p>
            </div>

            <button
              onClick={() => canBook && setBooked(true)}
              className={canBook ? "btn-primary" : ""}
              style={{
                width: "100%", padding: "13px", borderRadius: 10, border: "none",
                background: canBook ? undefined : "#252B3A",
                color: canBook ? undefined : "#4B5563",
                cursor: canBook ? "pointer" : "not-allowed",
                fontSize: 14, fontFamily: "Montserrat, sans-serif", fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {canBook ? (<><CheckCircle size={16} /> Confirm Booking</>)
                : (<>Complete selection to book</>)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

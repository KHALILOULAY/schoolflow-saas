"use client";

import { useEffect, useMemo, useState } from "react";

type Student = {
  id: number;
  name: string;
  className: string;
  age: number;
  attendance: number;
  parent: string;
  status: "Actif" | "En attente" | "Évaluation";
};

type Teacher = {
  id: number;
  name: string;
  subject: string;
  workload: string;
  availability: string;
};

type Fee = {
  id: number;
  student: string;
  className: string;
  amount: number;
  status: "Payé" | "En retard" | "À venir";
  dueDate: string;
};

type OverviewData = {
  stats: {
    students: number;
    teachers: number;
    classes: number;
    monthlyRevenue: number;
    attendanceRate: number;
    pendingFees: number;
  };
  students: Student[];
  teachers: Teacher[];
  fees: Fee[];
};

const currency = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "XAF",
  maximumFractionDigits: 0,
});

export default function Home() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/overview");
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error("Erreur lors du chargement des données", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const attendanceBands = useMemo(() => {
    if (!data) return [];
    return [
      { label: "Présence", value: data.stats.attendanceRate, color: "#2563eb" },
      { label: "Retards", value: 100 - data.stats.attendanceRate, color: "#f59e0b" },
    ];
  }, [data]);

  if (loading || !data) {
    return (
      <main style={{ padding: 32, textAlign: "center", color: "#102033" }}>
        Chargement du tableau de bord...
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1400, margin: "0 auto", padding: "28px 20px 60px" }}>
      <header
        style={{
          background: "#ffffff",
          border: "1px solid #dfe8f4",
          borderRadius: 20,
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 14px 35px rgba(37, 99, 235, 0.06)",
        }}
      >
        <div>
          <div style={{ fontSize: 12, color: "#5e7187", textTransform: "uppercase", letterSpacing: 1.3 }}>
            SaaS school management
          </div>
          <h1 style={{ margin: "8px 0 0", fontSize: 32 }}>SchoolFlow</h1>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div
            style={{
              background: "#eaf1ff",
              color: "#1d4ed8",
              borderRadius: 999,
              padding: "10px 14px",
              fontWeight: 700,
            }}
          >
            Année scolaire 2025-2026
          </div>
          <button
            style={{
              border: "none",
              background: "#2563eb",
              color: "white",
              borderRadius: 10,
              padding: "12px 18px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            + Nouveau rapport
          </button>
        </div>
      </header>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18, marginTop: 28 }}>
        {[
          { label: "Étudiants", value: data.stats.students, accent: "#2563eb", background: "#dbeafe", icon: "🎓" },
          { label: "Enseignants", value: data.stats.teachers, accent: "#16a34a", background: "#dcfce7", icon: "👩‍🏫" },
          { label: "Classes", value: data.stats.classes, accent: "#f59e0b", background: "#fef3c7", icon: "🏫" },
          { label: "Revenu mensuel", value: currency.format(data.stats.monthlyRevenue), accent: "#7c3aed", background: "#ede9fe", icon: "💰" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              background: "#ffffff",
              border: "1px solid var(--border)",
              borderRadius: 18,
              padding: 20,
              boxShadow: "0 12px 24px rgba(15, 23, 42, 0.04)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: 14, color: "#5e7187" }}>{item.label}</span>
              <span style={{ background: item.background, width: 36, height: 36, borderRadius: 12, display: "grid", placeItems: "center" }}>{item.icon}</span>
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, color: item.accent }}>{item.value}</div>
          </div>
        ))}
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, marginTop: 28 }}>
        <div style={{ background: "#ffffff", border: "1px solid #dfe8f4", borderRadius: 20, padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ margin: 0, fontSize: 22 }}>Étudiants de la semaine</h2>
            <span style={{ color: "#5e7187" }}>{data.students.length} inscrits</span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>
              <thead>
                <tr style={{ color: "#5e7187", textAlign: "left", borderBottom: "1px solid #e5edf8" }}>
                  <th style={{ padding: "12px 10px" }}>Nom</th>
                  <th style={{ padding: "12px 10px" }}>Classe</th>
                  <th style={{ padding: "12px 10px" }}>Présence</th>
                  <th style={{ padding: "12px 10px" }}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {data.students.map((student) => (
                  <tr key={student.id} style={{ borderBottom: "1px solid #eef3fb" }}>
                    <td style={{ padding: "12px 10px" }}>
                      <strong>{student.name}</strong>
                      <div style={{ fontSize: 12, color: "#5e7187" }}>{student.parent}</div>
                    </td>
                    <td style={{ padding: "12px 10px" }}>{student.className}</td>
                    <td style={{ padding: "12px 10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 90, height: 8, background: "#eaf1ff", borderRadius: 999, overflow: "hidden" }}>
                          <div style={{ width: `${student.attendance}%`, height: "100%", background: "#2563eb" }} />
                        </div>
                        <span>{student.attendance}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                      <span
                        style={{
                          background:
                            student.status === "Actif"
                              ? "#dcfce7"
                              : student.status === "Évaluation"
                                ? "#fef3c7"
                                : "#f3f4f6",
                          color:
                            student.status === "Actif"
                              ? "#166534"
                              : student.status === "Évaluation"
                                ? "#92400e"
                                : "#374151",
                          padding: "7px 10px",
                          borderRadius: 999,
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                      >
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          <div style={{ background: "#ffffff", border: "1px solid #dfe8f4", borderRadius: 20, padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h2 style={{ margin: 0, fontSize: 20 }}>Présence globale</h2>
              <span style={{ fontWeight: 700, color: "#2563eb" }}>{data.stats.attendanceRate}%</span>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {attendanceBands.map((item) => (
                <div key={item.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, color: "#5e7187" }}>
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div style={{ background: "#edf3ff", height: 10, borderRadius: 999, overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${item.value}%`,
                        background: item.color,
                        height: "100%",
                        borderRadius: 999,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#ffffff", border: "1px solid #dfe8f4", borderRadius: 20, padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h2 style={{ margin: 0, fontSize: 20 }}>Paiements</h2>
              <span style={{ fontWeight: 700, color: "#ef4444" }}>{data.stats.pendingFees} en attente</span>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {data.fees.slice(0, 4).map((fee) => (
                <div key={fee.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{fee.student}</div>
                    <div style={{ fontSize: 12, color: "#5e7187" }}>{fee.className}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700 }}>{currency.format(fee.amount)}</div>
                    <span
                      style={{
                        display: "inline-block",
                        marginTop: 4,
                        padding: "5px 8px",
                        background:
                          fee.status === "Payé"
                            ? "#dcfce7"
                            : fee.status === "En retard"
                              ? "#fee2e2"
                              : "#fef3c7",
                        color:
                          fee.status === "Payé"
                            ? "#166534"
                            : fee.status === "En retard"
                              ? "#b91c1c"
                              : "#92400e",
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {fee.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 28 }}>
        <div style={{ background: "#ffffff", border: "1px solid #dfe8f4", borderRadius: 20, padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h2 style={{ margin: 0, fontSize: 20 }}>Équipe enseignante</h2>
            <span style={{ color: "#5e7187" }}>{data.teachers.length} membres</span>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            {data.teachers.map((teacher) => (
              <div key={teacher.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "#f8fafc", borderRadius: 12 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{teacher.name}</div>
                  <div style={{ color: "#5e7187", fontSize: 13 }}>{teacher.subject}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, color: "#5e7187" }}>{teacher.workload}</div>
                  <div style={{ fontSize: 12, color: "#2563eb", fontWeight: 700 }}>{teacher.availability}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#ffffff", border: "1px solid #dfe8f4", borderRadius: 20, padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h2 style={{ margin: 0, fontSize: 20 }}>Suivi des paiements</h2>
            <span style={{ color: "#5e7187" }}>Derniers versements</span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ color: "#5e7187", textAlign: "left" }}>
                  <th style={{ padding: "10px 8px" }}>Étudiant</th>
                  <th style={{ padding: "10px 8px" }}>Montant</th>
                  <th style={{ padding: "10px 8px" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.fees.map((fee) => (
                  <tr key={fee.id} style={{ borderTop: "1px solid #eef3fb" }}>
                    <td style={{ padding: "10px 8px" }}>{fee.student}</td>
                    <td style={{ padding: "10px 8px", fontWeight: 700 }}>{currency.format(fee.amount)}</td>
                    <td style={{ padding: "10px 8px", color: "#5e7187" }}>{fee.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

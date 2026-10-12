import fs from "fs/promises";
import path from "path";

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

type SchoolData = {
  classes: { id: number; label: string; capacity: number; enrolled: number }[];
  students: Student[];
  teachers: Teacher[];
  fees: Fee[];
};

const dataPath = path.join(process.cwd(), "data", "school-data.json");

export async function getSchoolData(): Promise<SchoolData> {
  const payload = await fs.readFile(dataPath, "utf8");
  return JSON.parse(payload) as SchoolData;
}

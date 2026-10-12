import { NextResponse } from "next/server";
import { getSchoolData } from "@/lib/school-data";

export async function GET() {
  const data = await getSchoolData();

  const attendanceRate = Math.round(
    data.students.reduce((sum, student) => sum + student.attendance, 0) / data.students.length
  );

  const pendingFees = data.fees.filter((fee) => fee.status !== "Payé").length;

  const monthlyRevenue = data.fees
    .filter((fee) => fee.status === "Payé")
    .reduce((sum, fee) => sum + fee.amount, 0);

  return NextResponse.json({
    stats: {
      students: data.students.length,
      teachers: data.teachers.length,
      classes: data.classes.length,
      monthlyRevenue,
      attendanceRate,
      pendingFees,
    },
    students: data.students,
    teachers: data.teachers,
    fees: data.fees,
  });
}

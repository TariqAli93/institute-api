import { prismaErrorHandling, prismaInstance } from "../middlewares/handleError.middleware.js";

const prisma = prismaInstance;

export default class Teachers {
  static async FindTeachers(req, res) {
    try {
      const teachers = await prisma.user.findMany({
        where: {
          AND: [{ is_deleted: false, role: "TEACHER" }],
        },
      });

      if (teachers.length > 0) {
        const teachersMap = teachers.map(teacher => ({
          teacher_id: teacher.user_id,
          teacher_name: teacher.first_name + " " + teacher.last_name,
          teacher_phone: teacher.phone !== null ? teacher.phone : "لم يتم تحديد الهاتف",
          teacher_email: teacher.email,
          teacher_address: teacher.governorate + " / " + teacher.district,
          teacher_dob: teacher.dob,
          is_blocked: teacher.is_blocked,
          is_deleted: teacher.is_deleted,
          created_at: teacher.created_at,
          updated_at: teacher.updated_at,
        }));
        res.status(200).send(teachersMap);
      } else res.status(404).send("لم يتم العثور على معلمين");
    } catch (e) {
      res.status(500).send(prismaErrorHandling(e));
    }
  }

  static async FindTeacherById(req, res) {
    try {
      const teacher = await prisma.user.findMany({
        where: {
          AND: [{ user_id: parseInt(req.params.id), is_deleted: false, role: "TEACHER" }],
        },
      });

      if (teacher) {
        const teachersMap = teacher.map(tch => ({
          teacher_id: tch.user_id,
          teacher_name: tch.first_name + " " + tch.last_name,
          teacher_phone: tch.phone !== null ? tch.phone : "لم يتم تحديد الهاتف",
          teacher_email: tch.email,
          teacher_address: tch.governorate + " / " + tch.district,
          teacher_dob: tch.dob,
          is_blocked: tch.is_blocked,
          is_deleted: tch.is_deleted,
          created_at: tch.created_at,
          updated_at: tch.updated_at,
        }));

        res.status(200).send(teachersMap[0]);
      } else res.status(404).send("لم يتم العثور على المعلم");
    } catch (e) {
      res.status(500).send(prismaErrorHandling(e));
    }
  }
}

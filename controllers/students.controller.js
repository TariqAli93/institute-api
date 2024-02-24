import { prismaErrorHandling, prismaInstance } from "../middlewares/handleError.middleware.js";

const prisma = prismaInstance;

export default class Students {
  static async RegisterStudents(req, res) {
    try {
      const uniques = {
        username: await prisma.user.findMany({ where: { username: req.body.username, is_deleted: false, role: "STUDENT" } }).then(data => {
          if (req.body.username === undefined || req.body.username === null) {
            return false;
          }
          if (data.length > 0) {
            return true;
          }
        }),
        phone: await prisma.user.findMany({ where: { phone: req.body.phone, is_deleted: false, role: "STUDENT" } }).then(data => {
          if (req.body.phone === undefined || req.body.phone === null) {
            return false;
          }
          if (data.length > 0) {
            return true;
          }
        }),
        email: await prisma.user.findMany({ where: { email: req.body.email, is_deleted: false, role: "STUDENT" } }).then(data => {
          if (req.body.email === undefined || req.body.email === null) {
            return false;
          }
          if (data.length > 0) {
            return true;
          }
        }),
      };

      if (uniques.username) return res.status(409).send("اسم الطالب موجود مسبقا");
      else if (uniques.email) return res.status(409).send("البريد الالكتروني موجود مسبقا");
      else if (uniques.phone) return res.status(409).send("رقم الهاتف موجود مسبقا");
      else if (req.body.role !== undefined && req.body.role !== "STUDENT") return res.status(400).send("الرجاء اختيار دور المستخدم");
      else {
        const student_data = {
          username: req.body.username,
          email: req.body.email,
          phone: req.body.phone,
          role: "STUDENT",
          district: req.body.district,
          governorate: req.body.governorate,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          dob: req.body.dob,
          Students: {
            create: {
              parent_phone: req.body.parent_phone,
              parent_phone2: req.body.parent_phone2,
            },
          },
        };

        const students = await prisma.user.create({
          data: student_data,
        });

        res.status(201).send(students);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send(prismaErrorHandling(error));
    }
  }

  static async FindStudents(req, res) {
    try {
      const students = await prisma.user.findMany({
        where: {
          role: "STUDENT",
          is_deleted: false,
        },

        include: {
          Students: true,
        },
      });

      if (students.length > 0) {
        const studentsData = students.map(student => {
          return {
            student_id: student.Students[0].student_id,
            student_name: student.first_name + " " + student.last_name,
            username: student.username,
            email: student.email,
            password: student.password,
            phone: student.phone,
            parent_phone: student.Students[0].parent_phone,
            parent_phone2: student.Students[0].parent_phone2,
            district: student.district,
            governorate: student.governorate,
            dob: student.dob,
            created_at: student.created_at,
            updated_at: student.updated_at,
            is_deleted: student.is_deleted,
            is_blocked: student.is_blocked,
          };
        });
        res.status(200).send(studentsData);
      } else res.status(404).send("لا توجد بيانات لعرضها");
    } catch (error) {
      console.error(error);
      res.status(500).send(prismaErrorHandling(error));
    }
  }

  static async FindStudentsById(req, res) {
    try {
      const { id } = req.params;
      const student = await prisma.user.findFirst({
        where: {
          role: "STUDENT",
          user_id: parseInt(id),
          is_deleted: false,
        },
      });

      if (student) res.status(200).send(student);
      else res.status(404).send("لا توجد بيانات لعرضها");
    } catch (error) {
      console.error(error);
      res.status(500).send(prismaErrorHandling(error));
    }
  }
}

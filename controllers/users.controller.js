import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prismaErrorHandling, prismaInstance } from "../middlewares/handleError.middleware.js";

const prisma = prismaInstance;

export default class Users {
  static async FindUsers(req, res) {
    try {
      const users = await prisma.user.findMany({
        where: {
          AND: [{ is_deleted: false }, { OR: [{ role: "ADMIN" }, { role: "USER" }] }],
        },
      });

      if (users.length > 0) res.status(200).send(users);
      else res.status(404).send("لا توجد بيانات لعرضها");
    } catch (e) {
      res.status(500).send(prismaErrorHandling(e));
    }
  }

  // this function get user by id with admin role or user role
  static async FindUserById(req, res) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          AND: [{ user_id: parseInt(req.params.id) }, { is_deleted: false }, { OR: [{ role: "ADMIN" }, { role: "USER" }] }],
        },
      });

      if (user) res.status(200).send(user);
      else res.status(404).send("لا توجد بيانات لعرضها");
    } catch (e) {
      res.status(500).send(prismaErrorHandling(e));
    }
  }

  static async FindStudents(req, res) {
    try {
      const students = await prisma.user.findMany({
        where: {
          AND: [{ is_deleted: false, role: "STUDENT" }],
        },
      });

      if (students.length > 0) {
        const studentsMap = students.map(student => ({
          student_id: student.user_id,
          student_name: student.first_name + " " + student.last_name,
          student_phone: student.phone !== null ? student.phone : "لم يتم تحديد الهاتف",
          student_email: student.email,
          student_address: student.governorate + " / " + student.district,
          student_dob: student.dob,
          is_blocked: student.is_blocked,
          is_deleted: student.is_deleted,
          created_at: student.created_at,
          updated_at: student.updated_at,
        }));
        res.status(200).send(studentsMap);
      } else res.status(404).send("لم يتم العثور على طلاب");
    } catch (e) {
      res.status(500).send(prismaErrorHandling(e));
    }
  }

  static async FindStudentById(req, res) {
    try {
      const student = await prisma.user.findMany({
        where: {
          AND: [{ user_id: parseInt(req.params.id), is_deleted: false, role: "STUDENT" }],
        },
      });

      if (student) {
        const studentsMap = student.map(std => ({
          student_id: std.user_id,
          student_name: std.first_name + " " + std.last_name,
          student_phone: std.phone !== null ? std.phone : "لم يتم تحديد الهاتف",
          student_email: std.email,
          student_address: std.governorate + " / " + std.district,
          student_dob: std.dob,
          is_blocked: std.is_blocked,
          is_deleted: std.is_deleted,
          created_at: std.created_at,
          updated_at: std.updated_at,
        }));

        res.status(200).send(studentsMap[0]);
      } else res.status(404).send("لم يتم العثور على الطالب");
    } catch (e) {
      res.status(500).send(prismaErrorHandling(e));
    }
  }

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

  static async RegisterUsers(req, res) {
    try {
      const { username, password, role } = req.body;

      const salt = await bycrypt.genSalt(10);
      const hashedPassword = await bycrypt.hash(password, salt);

      await prisma.user.create({
        data: { username: username, password: hashedPassword, role: role },
      });

      res.status(201).send("تم انشاء الحساب بنجاح");
    } catch (e) {
      res.status(500).send(prismaErrorHandling(e));
    }
  }

  static async UpdateUsers(req, res) {
    try {
      const { first_name, last_name, phone, email, role, dob, governorate, district, username } = req.body;
      const { user_id } = req.params;

      await prisma.user.update({
        where: { user_id: parseInt(user_id) },
        data: {
          username: username,
          role: role,
          email: email,
          first_name: first_name,
          last_name: last_name,
          phone: phone,
          governorate: governorate,
          district: district,
          dob: dob,
        },
      });

      res.status(201).send("تم تعديل الحساب بنجاح");
    } catch (e) {
      res.status(500).send(prismaErrorHandling(e));
    }
  }

  static async LoginHandler(req, res) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          AND: [{ username: req.body.username }, { OR: [{ role: "ADMIN" }, { role: "USER" }] }],
        },
      });

      if (!user || user.is_deleted) return res.status(404).send("لم يتم العثور على حسابك يرجى المحاولة مرة اخرى");
      else {
        const validPassword = await bycrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(401).send("اسم المستخدم او كلمة المرور غير صحيحة");
        else if (validPassword && user.is_blocked) return res.status(423).send("تم حظر حسابك يرجى التواصل مع الادارة");
        else {
          const token = jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "24h",
          });

          res.send({ user, token });
        }
      }
    } catch (e) {
      console.log(prismaErrorHandling(e));
      res.status(500).send(prismaErrorHandling(e));
    }
  }
}

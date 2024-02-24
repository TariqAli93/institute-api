import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prismaErrorHandling, prismaInstance } from "../middlewares/handleError.middleware.js";

const prisma = prismaInstance;

const { compareSync, genSalt, hash } = bcrypt;
export default class Users {
  static async RegisterUsers(req, res) {
    try {
      const { password, role } = req.body;

      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);

      const uniques = {
        username: await prisma.user.count({ where: { AND: [{ username: req.body.username }, { is_deleted: false }, { OR: [{ role: "ADMIN" }, { role: "USER" }] }] } }),
        phone: await prisma.user.count({ where: { AND: [{ phone: req.body.phone }, { is_deleted: false }, { OR: [{ role: "ADMIN" }, { role: "USER" }] }] } }),
        email: await prisma.user.count({ where: { AND: [{ email: req.body.email }, { is_deleted: false }, { OR: [{ role: "ADMIN" }, { role: "USER" }] }] } }),
      };

      if (uniques.username > 0) return res.status(409).send("اسم المستخدم موجود مسبقا");
      else if (uniques.email > 0) return res.status(409).send("البريد الالكتروني موجود مسبقا");
      else if (uniques.phone > 0) return res.status(409).send("رقم الهاتف موجود مسبقا");
      else if (req.body.role !== undefined && req.body.role !== "ADMIN" && req.body.role !== "USER") return res.status(400).send("الرجاء اختيار دور المستخدم");
      else {
        await prisma.user.create({
          data: {
            ...req.body,
            password: hashedPassword,
            role: role,
          },
        });

        res.status(201).send("تم انشاء الحساب بنجاح");
      }
    } catch (e) {
      res.status(prismaErrorHandling(e).code).send(prismaErrorHandling(e).error);
    }
  }

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

  static async UpdateUsers(req, res) {
    try {
      const { id } = req.params;

      const uniques = {
        username: await prisma.user.count({ where: { username: req.body.username } }),
        phone: await prisma.user.count({ where: { phone: req.body.phone } }),
        email: await prisma.user.count({ where: { email: req.body.email } }),
      };

      if (req.body.username !== undefined && uniques.username > 0) return res.status(409).send("اسم المستخدم موجود مسبقا");
      else if (req.body.email !== undefined && uniques.email > 0) return res.status(409).send("البريد الالكتروني موجود مسبقا");
      else if (req.body.phone !== undefined && uniques.phone > 0) return res.status(409).send("رقم الهاتف موجود مسبقا");
      else if (req.body.role !== undefined && req.body.role !== "ADMIN" && req.body.role !== "USER") return res.status(400).send("الرجاء اختيار دور المستخدم");
      else {
        await prisma.user.update({
          where: { user_id: parseInt(id) },
          data: req.body,
        });

        res.status(201).send("تم تعديل الحساب بنجاح");
      }
    } catch (e) {
      res.status(500).send(prismaErrorHandling(e));
    }
  }

  static async SoftDelete(req, res) {
    try {
      const { id } = req.params;

      await prisma.user.update({
        where: { user_id: parseInt(id) },
        data: { is_deleted: true },
      });

      res.status(200).send("تم حذف الحساب بنجاح");
    } catch (e) {
      res.status(500).send(prismaErrorHandling(e));
    }
  }

  static async HardDelete(req, res) {
    try {
      const { id } = req.params;

      await prisma.user.delete({
        where: { user_id: parseInt(id) },
      });

      res.status(200).send("تم حذف الحساب بنجاح");
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
        const valid_password = compareSync(req.body.password, user.password);

        switch (true) {
          case valid_password && user.is_blocked:
            return res.status(423).send("تم حظر حسابك يرجى التواصل مع الادارة");
          case !valid_password:
            return res.status(401).send("اسم المستخدم او كلمة المرور غير صحيحة");
          default: {
            const token = jwt.sign({ user_id: user.user_id, role: user.role }, process.env.JWT_SECRET, {
              expiresIn: "10h",
            });

            res.send({ user, token });
          }
        }
      }
    } catch (e) {
      console.error(prismaErrorHandling(e));
      res.status(500).send(prismaErrorHandling(e));
    }
  }
}

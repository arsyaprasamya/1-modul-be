/* eslint-disable @typescript-eslint/no-unsafe-call */
import Postgres from "../config/postgres";

import StatusCodes from "http-status-codes";
import { Request, Response } from "express";

import UserDao from "@daos/User/UserDao.mock";
import { paramMissingError } from "@shared/constants";

const userDao = new UserDao();
const { BAD_REQUEST, CREATED, OK, INTERNAL_SERVER_ERROR } = StatusCodes;

/**
 * Get all users.
 *
 * @param req
 * @param res
 * @returns
 */
export async function getAllUsers(req: Request, res: Response) {
  const users = await userDao.getAll();

  const postgres = new Postgres();
  postgres.query(
    'SELECT * FROM "role"',
    (result: any) => {
      // kalo berhasil
      console.log("BERHASIL", result.rows);
      return res.status(OK).json({
        message: "Success",
        data: {
          role: result.rows,
        },
      });
    },
    (reason: any) => {
      // kalo gagal
      console.log("GAGAL", reason);
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: "Failed",
        data: null,
      });
    }
  );
}

/**
 * Add one user.
 *
 * @param req
 * @param res
 * @returns
 */
export async function addOneUser(req: Request, res: Response) {
  const { user } = req.body;
  if (!user) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  await userDao.add(user);
  return res.status(CREATED).end();
}

/**
 * Update one user.
 *
 * @param req
 * @param res
 * @returns
 */
export async function updateOneUser(req: Request, res: Response) {
  const { user } = req.body;
  if (!user) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  user.id = Number(user.id);
  await userDao.update(user);
  return res.status(OK).end();
}

/**
 * Delete one user.
 *
 * @param req
 * @param res
 * @returns
 */
export async function deleteOneUser(req: Request, res: Response) {
  const { id } = req.params;
  await userDao.delete(Number(id));
  return res.status(OK).end();
}

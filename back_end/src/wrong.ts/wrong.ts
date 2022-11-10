import { Knex } from "knex";
import * as bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  const txn = await knex.transaction();
  try {
    // Deletes ALL existing entries
    await txn("users").del();

    // Inserts seed entries
    let password_hash = await bcrypt.hash('123', 10)
    let users = await txn("users")
      .insert([
        { username: "caleb", password: password_hash, nickname: "caleb", phone: "12345678", email: "123@gmail.com", point: 0, is_admin: true},
      ])

    await txn.commit();
    return;
  } catch (error) {
    await txn.rollback();
    console.log(error as any);
    return;
  }
}
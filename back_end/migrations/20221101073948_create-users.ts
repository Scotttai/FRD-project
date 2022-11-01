import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  //
  await knex.schema.createTableIfNotExists('users', (table) => {
    table.increments('id');
    table.string('username', 40).notNullable();
    table.string('password_hash').notNullable();
    table.string('nickname').notNullable();
    table.string('phone').notNullable();
    table.string('email').notNullable();
    table.string('point').notNullable().defaultTo(0);
    table.boolean('is_admin').notNullable().defaultTo(false);
  });

  await knex.schema.createTableIfNotExists('banned_users', (table) => {
    table.increments('id');
    table.integer('user_id').notNullable().references('users.id');
    table.timestamp('banned_time').notNullable();
  });

  await knex.schema.createTableIfNotExists('storages', (table) => {
    table.increments('id');
    table.string('code').notNullable();
    table.integer('seller_id').notNullable().references('users.id');
    table.timestamp('in_time').notNullable();
    table.timestamp('out_time').notNullable();
  });

  await knex.schema.createTableIfNotExists('posts', (table) => {
    table.increments('id');
    table.integer('user_id').notNullable().references('users.id');
    table.string('post_title').notNullable();
    table.text('post_description').notNullable();
    table.integer('original_price').notNullable();
    table.integer('min_price');
    table.boolean('is_pending_in').notNullable().defaultTo(false);
    table.boolean('is_pending_out').notNullable().defaultTo(false);
    table.boolean('is_sold').notNullable().defaultTo(false);
    table.integer('priority').notNullable().defaultTo(0);
  });

  await knex.schema.createTableIfNotExists('bid_records', (table) => {
    table.increments('id');
    table.integer('post_id').notNullable().references('posts.id');
    table.integer('buyer_id').notNullable();
    table.integer('bid_price').notNullable();
    table.timestamp('bid_time').notNullable();
  });

  await knex.schema.createTableIfNotExists('histories', (table) => {
    table.increments('id');
    table.integer('buyer_id').notNullable().references('users.id');
    table.integer('post_id').notNullable().references('posts.id');
    table.integer('final_price').notNullable();
    table.timestamp('sold_time').notNullable();
  });

  await knex.schema.createTableIfNotExists('tags', (table) => {
    table.increments('id');
    table.string('tag_name');
    table.integer('post_id').notNullable().references('posts.id');
  });

  await knex.schema.createTableIfNotExists('images', (table) => {
    table.increments('id');
    table.string('src').notNullable();
    table.integer('post_id').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('images');
  await knex.schema.dropTableIfExists('tags');
  await knex.schema.dropTableIfExists('histories');
  await knex.schema.dropTableIfExists('bid_records');
  await knex.schema.dropTableIfExists('posts');
  await knex.schema.dropTableIfExists('storages');
  await knex.schema.dropTableIfExists('banned_users');
  await knex.schema.dropTableIfExists('users');
}

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
    table.integer('points').notNullable().defaultTo(0);
    table.boolean('is_admin').notNullable().defaultTo(false);
    table.timestamp('joinedTime').notNullable().defaultTo(knex.fn.now());
    table.text('bank_account');
    table
      .text('icon_name')
      .defaultTo('/default/new_usericon.jpeg+1+1669717126192');
    table.text('icon_src').defaultTo("https://firebasestorage.googleapis.com/v0/b/test-6e6e8.appspot.com/o/default%2Fnew_usericon.jpeg%2B1%2B1669717126192?alt=media&token=aad5a75f-811c-48a2-80d1-673cef3e5d3d");
  });

  await knex.schema.createTableIfNotExists('client_secret', (table) => {
    table.increments('id');
    table.integer('amount').notNullable();
    table.string('client_secret').notNullable();
    table.integer('user_id').notNullable().references('users.id');
    table.boolean('captured').defaultTo(false);
  });

  await knex.schema.createTableIfNotExists('followers', (table) => {
    table.increments('id');
    table.integer('follower_id').notNullable().references('users.id');
    table.integer('followee_id').notNullable().references('users.id');
  });

  await knex.schema.createTableIfNotExists('banned_users', (table) => {
    table.increments('id');
    table.integer('user_id').notNullable().references('users.id');
    table.timestamp('banned_time').defaultTo(knex.fn.now());
  });

  await knex.schema.createTableIfNotExists('search_histories', (table) => {
    table.increments('id');
    table.integer('user_id').notNullable().references('users.id');
    table.string('content').notNullable();
    table.timestamp('search_time').notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTableIfNotExists('store_location', (table) => {
    table.increments('id');
    table.string('location').notNullable();
  });

  await knex.schema.createTableIfNotExists('posts', (table) => {
    table.increments('id');
    table.integer('user_id').notNullable().references('users.id');
    table.string('post_title').notNullable();
    table.text('post_description').notNullable();
    table.integer('original_price').notNullable();
    table.boolean('q_mark').notNullable().defaultTo(false);
    table.string('admin_title');
    table.text('admin_comment');
    table
      .enum('status', [
        'pending_in', // waiting to store
        'verifying', // stored but waiting to verify description
        'deny', // deny due to some reason (eg 18+)
        'selling', // posted on mainPage
        'cancel', // seller cancel the post
        'holding', // sold but buyer still doesn't collect the product
        'sold&out', // sold and buyer collected the product
      ])
      .notNullable()
      .defaultTo('selling');
    table.timestamp('post_time');
    table.integer('priority').notNullable().defaultTo(0);
    table.integer('location_id').references('store_location.id');
    table.boolean('auto_adjust_plan').defaultTo(false);
  });

  await knex.schema.createTableIfNotExists('storages', (table) => {
    table.increments('id');
    table.string('receipt_code').notNullable();
    table.integer('product_id').notNullable().references('posts.id');
    table.integer('seller_id').notNullable().references('users.id');
    table.timestamp('in_time').notNullable().defaultTo(knex.fn.now());
    table.timestamp('out_time');
  });
  await knex.schema.createTableIfNotExists('bid_records', (table) => {
    table.increments('id');
    table.integer('post_id').notNullable().references('posts.id');
    table.integer('buyer_id').notNullable();
    table.integer('bid_price').notNullable();
    table.timestamp('bid_time').notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTableIfNotExists('bid_histories', (table) => {
    table.increments('id');
    table.integer('buyer_id').notNullable().references('users.id');
    table.integer('post_id').notNullable().references('posts.id');
    table.integer('final_price').notNullable();
    table.timestamp('sold_time').notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTableIfNotExists('tags', (table) => {
    table.increments('id');
    table.string('tag_name');
    table.integer('post_id').notNullable().references('posts.id');
  });

  await knex.schema.createTableIfNotExists('images', (table) => {
    table.increments('id');
    table.text('src').notNullable();
    table.integer('post_id').notNullable().references('posts.id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('search_histories');
  await knex.schema.dropTableIfExists('followers');
  await knex.schema.dropTableIfExists('images');
  await knex.schema.dropTableIfExists('tags');
  await knex.schema.dropTableIfExists('bid_histories');
  await knex.schema.dropTableIfExists('bid_records');
  await knex.schema.dropTableIfExists('storages');
  await knex.schema.dropTableIfExists('banned_users');
  await knex.schema.dropTableIfExists('posts');
  await knex.schema.dropTableIfExists('store_location');
  await knex.schema.dropTableIfExists('client_secret');
  await knex.schema.dropTableIfExists('users');
}

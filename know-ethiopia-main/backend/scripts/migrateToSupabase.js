// One-time migration script: copy data from MySQL to Supabase
// Usage (from backend folder):
//   NODE_ENV=development node scripts/migrateToSupabase.js

require('dotenv').config();

const mysql = require('mysql2/promise');
const { createClient } = require('@supabase/supabase-js');

async function main() {
  const {
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_USER,
    DB_PASSWORD,
    DB_DATABASE,
    DB_NAME,
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
  } = process.env;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend/.env');
    process.exit(1);
  }

  if (!DB_HOST || !(DB_DATABASE || DB_NAME) || !(DB_USERNAME || DB_USER)) {
    console.error('Missing MySQL env vars (DB_HOST, DB_USERNAME/DB_USER, DB_DATABASE/DB_NAME) in backend/.env');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const mysqlConnection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT ? parseInt(DB_PORT, 10) : 3306,
    user: DB_USERNAME || DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE || DB_NAME,
  });

  console.log('Connected to MySQL and Supabase. Starting migration...');

  try {
    await migrateUsers(mysqlConnection, supabase);
    await migrateTravelPosts(mysqlConnection, supabase);
    await migratePostVotes(mysqlConnection, supabase);
    await migrateProfilePosts(mysqlConnection, supabase);
    await migrateProfilePostVotes(mysqlConnection, supabase);
    await migrateSavedPlaces(mysqlConnection, supabase);

    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err.message);
  } finally {
    await mysqlConnection.end();
  }
}

async function batchInsert(supabase, table, rows, batchSize = 100) {
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await supabase.from(table).insert(batch, { upsert: false });
    if (error) {
      console.error(`Error inserting into ${table}:`, error.message);
      throw error;
    }
    console.log(`Inserted ${batch.length} rows into ${table}`);
  }
}

async function migrateUsers(mysqlConnection, supabase) {
  console.log('Migrating users...');
  const [rows] = await mysqlConnection.query('SELECT * FROM users');
  if (!rows.length) {
    console.log('No users to migrate.');
    return;
  }

  // Columns: id, google_id, name, email, avatar, role, created_at, updated_at
  const data = rows.map((row) => ({
    id: row.id,
    google_id: row.google_id,
    name: row.name,
    email: row.email,
    avatar: row.avatar,
    role: row.role || 'user',
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));

  await batchInsert(supabase, 'users', data);
}

async function migrateTravelPosts(mysqlConnection, supabase) {
  console.log('Migrating travel_posts...');
  const [rows] = await mysqlConnection.query('SELECT * FROM travel_posts');
  if (!rows.length) {
    console.log('No travel_posts to migrate.');
    return;
  }

  const data = rows.map((row) => ({
    id: row.id,
    user_id: row.user_id,
    content: row.content,
    rating: row.rating,
    images: row.images ? safeParseJson(row.images) : null,
    upvotes: row.upvotes || 0,
    downvotes: row.downvotes || 0,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));

  await batchInsert(supabase, 'travel_posts', data);
}

async function migratePostVotes(mysqlConnection, supabase) {
  console.log('Migrating post_votes...');
  const [rows] = await mysqlConnection.query('SELECT * FROM post_votes');
  if (!rows.length) {
    console.log('No post_votes to migrate.');
    return;
  }

  const data = rows.map((row) => ({
    id: row.id,
    post_id: row.post_id,
    user_id: row.user_id,
    vote_type: row.vote_type,
    created_at: row.created_at,
  }));

  await batchInsert(supabase, 'post_votes', data);
}

async function migrateProfilePosts(mysqlConnection, supabase) {
  console.log('Migrating profile_posts...');
  const [rows] = await mysqlConnection.query('SELECT * FROM profile_posts');
  if (!rows.length) {
    console.log('No profile_posts to migrate.');
    return;
  }

  const data = rows.map((row) => ({
    id: row.id,
    user_id: row.user_id,
    place_name: row.place_name,
    state: row.state,
    content: row.content,
    rating: row.rating,
    images: row.images ? safeParseJson(row.images) : null,
    upvotes: row.upvotes || 0,
    downvotes: row.downvotes || 0,
    status: row.status || 'pending',
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));

  await batchInsert(supabase, 'profile_posts', data);
}

async function migrateProfilePostVotes(mysqlConnection, supabase) {
  console.log('Migrating profile_post_votes...');
  const [rows] = await mysqlConnection.query('SELECT * FROM profile_post_votes');
  if (!rows.length) {
    console.log('No profile_post_votes to migrate.');
    return;
  }

  const data = rows.map((row) => ({
    id: row.id,
    post_id: row.post_id,
    user_id: row.user_id,
    vote_type: row.vote_type,
    created_at: row.created_at,
  }));

  await batchInsert(supabase, 'profile_post_votes', data);
}

async function migrateSavedPlaces(mysqlConnection, supabase) {
  console.log('Migrating saved_places...');
  const [rows] = await mysqlConnection.query('SELECT * FROM saved_places');
  if (!rows.length) {
    console.log('No saved_places to migrate.');
    return;
  }

  const data = rows.map((row) => ({
    id: row.id,
    user_id: row.user_id,
    place_id: row.place_id,
    place_name: row.place_name,
    state: row.state,
    state_slug: row.state_slug,
    category: row.category,
    image: row.image,
    description: row.description,
    created_at: row.created_at,
  }));

  await batchInsert(supabase, 'saved_places', data);
}

function safeParseJson(value) {
  if (!value) return null;
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    return parsed;
  } catch {
    return null;
  }
}

main().catch((err) => {
  console.error('Unexpected error in migration script:', err);
  process.exit(1);
});

// chore: know-ethiopia backfill 1774943306

// chore: know-ethiopia backfill 1774943307

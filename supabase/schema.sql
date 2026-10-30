-- ====================================================================
-- SUPABASE LOCAL DATABASE SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- Project: SOUMANGOUROU TECHNOLOGIE
-- ====================================================================

-- 1. Ensure Supabase Roles exist (anon, authenticated, service_role)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
        CREATE ROLE anon NOLOGIN;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
        CREATE ROLE authenticated NOLOGIN;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'service_role') THEN
        CREATE ROLE service_role NOLOGIN;
    END IF;
END $$;

-- 2. Create Enums if not existing
DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'SCHEDULED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Create Tables

-- Users Table
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "email" TEXT UNIQUE NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" DEFAULT 'ADMIN' NOT NULL,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Project Categories Table
CREATE TABLE IF NOT EXISTS "project_categories" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "name" TEXT UNIQUE NOT NULL,
    "slug" TEXT UNIQUE NOT NULL,
    "description" TEXT
);

-- Projects Table
CREATE TABLE IF NOT EXISTS "projects" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "title" TEXT NOT NULL,
    "slug" TEXT UNIQUE NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "images" TEXT[] DEFAULT '{}',
    "liveUrl" TEXT,
    "githubUrl" TEXT,
    "technologies" TEXT[] DEFAULT '{}',
    "isFeatured" BOOLEAN DEFAULT false NOT NULL,
    "order" INTEGER DEFAULT 0 NOT NULL,
    "categoryId" TEXT REFERENCES "project_categories"("id") ON DELETE SET NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Blog Categories Table
CREATE TABLE IF NOT EXISTS "categories" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "name" TEXT UNIQUE NOT NULL,
    "slug" TEXT UNIQUE NOT NULL,
    "description" TEXT
);

-- Tags Table
CREATE TABLE IF NOT EXISTS "tags" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "name" TEXT UNIQUE NOT NULL,
    "slug" TEXT UNIQUE NOT NULL
);

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS "blog_posts" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "title" TEXT NOT NULL,
    "slug" TEXT UNIQUE NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "featuredImage" TEXT NOT NULL,
    "galleryImages" TEXT[] DEFAULT '{}',
    "status" "PostStatus" DEFAULT 'PUBLISHED' NOT NULL,
    "publishedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "readingTime" INTEGER DEFAULT 5 NOT NULL,
    "authorId" TEXT REFERENCES "users"("id") ON DELETE SET NULL,
    "authorName" TEXT DEFAULT 'Équipe Soumangourou',
    "authorAvatar" TEXT,
    "categoryId" TEXT REFERENCES "categories"("id") ON DELETE SET NULL,
    "allowComments" BOOLEAN DEFAULT true NOT NULL,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "views" INTEGER DEFAULT 0 NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Post Tags Pivot Table
CREATE TABLE IF NOT EXISTS "post_tags" (
    "postId" TEXT REFERENCES "blog_posts"("id") ON DELETE CASCADE,
    "tagId" TEXT REFERENCES "tags"("id") ON DELETE CASCADE,
    PRIMARY KEY ("postId", "tagId")
);

-- Comments Table
CREATE TABLE IF NOT EXISTS "comments" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "postId" TEXT REFERENCES "blog_posts"("id") ON DELETE CASCADE NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isApproved" BOOLEAN DEFAULT true NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS "testimonials" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "clientName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "avatar" TEXT,
    "quote" TEXT NOT NULL,
    "rating" INTEGER DEFAULT 5 NOT NULL,
    "order" INTEGER DEFAULT 0 NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Services Table
CREATE TABLE IF NOT EXISTS "services" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "title" TEXT NOT NULL,
    "slug" TEXT UNIQUE NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "order" INTEGER DEFAULT 0 NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- FAQ Table
CREATE TABLE IF NOT EXISTS "faq" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "order" INTEGER DEFAULT 0 NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Galleries Table
CREATE TABLE IF NOT EXISTS "galleries" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "title" TEXT NOT NULL,
    "slug" TEXT UNIQUE NOT NULL,
    "category" TEXT DEFAULT 'Général' NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Gallery Images Table
CREATE TABLE IF NOT EXISTS "gallery_images" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "galleryId" TEXT REFERENCES "galleries"("id") ON DELETE CASCADE NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "title" TEXT,
    "caption" TEXT,
    "order" INTEGER DEFAULT 0 NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- YouTube Videos Table
CREATE TABLE IF NOT EXISTS "youtube_videos" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "title" TEXT NOT NULL,
    "youtubeId" TEXT NOT NULL,
    "description" TEXT,
    "isPlaylist" BOOLEAN DEFAULT false NOT NULL,
    "order" INTEGER DEFAULT 0 NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- YouTube Playlists Table
CREATE TABLE IF NOT EXISTS "youtube_playlists" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "title" TEXT NOT NULL,
    "playlistId" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER DEFAULT 0 NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Social Links Table
CREATE TABLE IF NOT EXISTS "social_links" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "platform" TEXT UNIQUE NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "isActive" BOOLEAN DEFAULT true NOT NULL,
    "order" INTEGER DEFAULT 0 NOT NULL
);

-- Contacts Table
CREATE TABLE IF NOT EXISTS "contacts" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "fullName" TEXT NOT NULL,
    "company" TEXT,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN DEFAULT false NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS "newsletters" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "email" TEXT UNIQUE NOT NULL,
    "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN DEFAULT true NOT NULL
);

-- Media Table
CREATE TABLE IF NOT EXISTS "media" (
    "id" TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT,
    "format" TEXT,
    "size" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Settings Table (Site Info: Hero, Contact, Map)
CREATE TABLE IF NOT EXISTS "settings" (
    "id" TEXT PRIMARY KEY DEFAULT 'default',
    "heroTitle" TEXT DEFAULT 'SOUMANGOUROU TECHNOLOGIE' NOT NULL,
    "heroSubtitle" TEXT DEFAULT 'Nous créons des solutions numériques modernes inspirées par notre héritage africain.' NOT NULL,
    "heroVideoUrl" TEXT DEFAULT '/videos/hero.mp4' NOT NULL,
    "companyEmail" TEXT DEFAULT 'info@soumangouroutechnologie.com' NOT NULL,
    "companyPhone" TEXT DEFAULT '+2250706045256' NOT NULL,
    "companyAddress" TEXT DEFAULT 'Abidjan, Côte d''Ivoire' NOT NULL,
    "mapEmbedUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- SEO Settings Table
CREATE TABLE IF NOT EXISTS "seo_settings" (
    "id" TEXT PRIMARY KEY DEFAULT 'default',
    "siteTitle" TEXT DEFAULT 'SOUMANGOUROU TECHNOLOGIE | Digital Agency & Heritage' NOT NULL,
    "siteDescription" TEXT DEFAULT 'Solutions numériques modernes inspirées par l''héritage africain.' NOT NULL,
    "ogImage" TEXT,
    "keywords" TEXT[] DEFAULT '{}',
    "twitterHandle" TEXT DEFAULT '@soumangourou_tech',
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Enable Row Level Security (RLS) on ALL Tables
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "project_categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tags" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "blog_posts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "post_tags" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "comments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "testimonials" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "services" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "faq" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "galleries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "gallery_images" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "youtube_videos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "youtube_playlists" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "social_links" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "contacts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "newsletters" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "media" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "seo_settings" ENABLE ROW LEVEL SECURITY;

-- 5. Helper Function to create/update RLS policy safely
CREATE OR REPLACE FUNCTION create_rls_policy(
    t_name text,
    p_name text,
    action text,
    role_name text,
    using_expr text,
    check_expr text DEFAULT NULL
) RETURNS void AS $$
BEGIN
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', p_name, t_name);
    IF action = 'INSERT' THEN
        EXECUTE format('CREATE POLICY %I ON %I FOR INSERT TO %s WITH CHECK (%s)', p_name, t_name, role_name, using_expr);
    ELSIF check_expr IS NOT NULL THEN
        EXECUTE format('CREATE POLICY %I ON %I FOR %s TO %s USING (%s) WITH CHECK (%s)', p_name, t_name, action, role_name, using_expr, check_expr);
    ELSE
        EXECUTE format('CREATE POLICY %I ON %I FOR %s TO %s USING (%s)', p_name, t_name, action, role_name, using_expr);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 6. Apply RLS Policies for Public & Admin access

DO $$
DECLARE
    tbl text;
    -- Public tables readable by anyone (website visitors)
    public_readable_tables text[] := ARRAY[
        'project_categories', 'projects', 'categories', 'tags',
        'blog_posts', 'post_tags', 'comments', 'testimonials', 'services',
        'faq', 'galleries', 'gallery_images', 'youtube_videos', 'youtube_playlists',
        'social_links', 'media', 'settings', 'seo_settings'
    ];
    -- All application tables
    all_tables text[] := ARRAY[
        'users', 'project_categories', 'projects', 'categories', 'tags',
        'blog_posts', 'post_tags', 'comments', 'testimonials', 'services',
        'faq', 'galleries', 'gallery_images', 'youtube_videos', 'youtube_playlists',
        'social_links', 'contacts', 'newsletters', 'media', 'settings', 'seo_settings'
    ];
BEGIN
    -- Public Read Access: ONLY for public website content (never users, contacts, newsletters)
    FOREACH tbl IN ARRAY public_readable_tables LOOP
        PERFORM create_rls_policy(tbl, 'Public Read Access', 'SELECT', 'public', 'true');
    END LOOP;

    -- Authenticated Users Full Access (Admin / Editor) & Service Role Access
    FOREACH tbl IN ARRAY all_tables LOOP
        PERFORM create_rls_policy(tbl, 'Admin Full Access', 'ALL', 'authenticated', 'true', 'true');
        PERFORM create_rls_policy(tbl, 'Service Role Access', 'ALL', 'service_role', 'true', 'true');
    END LOOP;
END $$;

-- 7. Public Insert Policies for Guest Form Submissions
SELECT create_rls_policy('contacts', 'Public Insert Contacts', 'INSERT', 'public', 'true', 'true');
SELECT create_rls_policy('newsletters', 'Public Insert Newsletters', 'INSERT', 'public', 'true', 'true');
SELECT create_rls_policy('comments', 'Public Insert Comments', 'INSERT', 'public', 'true', 'true');

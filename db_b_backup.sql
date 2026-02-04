--
-- PostgreSQL database dump
--

\restrict xMn9M2wETThgGffciBPez944DsaEjfnp2DEkrqLwQkFJCAO6mRc5X64GRAqkzjv

-- Dumped from database version 17.7 (bdd1736)
-- Dumped by pg_dump version 17.7 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: neondb_owner
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO neondb_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: neondb_owner
--

COMMENT ON SCHEMA public IS '';


--
-- Name: vector; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;


--
-- Name: EXTENSION vector; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION vector IS 'vector data type and ivfflat and hnsw access methods';


--
-- Name: AcademicSessionStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."AcademicSessionStatus" AS ENUM (
    'active',
    'inactive',
    'completed'
);


ALTER TYPE public."AcademicSessionStatus" OWNER TO neondb_owner;

--
-- Name: AcademicTerm; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."AcademicTerm" AS ENUM (
    'first',
    'second',
    'third'
);


ALTER TYPE public."AcademicTerm" OWNER TO neondb_owner;

--
-- Name: AccessLevel; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."AccessLevel" AS ENUM (
    'FULL',
    'READ_ONLY',
    'LIMITED'
);


ALTER TYPE public."AccessLevel" OWNER TO neondb_owner;

--
-- Name: AchievementType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."AchievementType" AS ENUM (
    'ACADEMIC',
    'ATTENDANCE',
    'SPORTS',
    'EXTRACURRICULAR',
    'BEHAVIOR',
    'LEADERSHIP',
    'OTHER'
);


ALTER TYPE public."AchievementType" OWNER TO neondb_owner;

--
-- Name: AssessmentType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."AssessmentType" AS ENUM (
    'FORMATIVE',
    'SUMMATIVE',
    'DIAGNOSTIC',
    'BENCHMARK',
    'PRACTICE',
    'MOCK_EXAM',
    'QUIZ',
    'TEST',
    'EXAM',
    'ASSIGNMENT',
    'CBT',
    'OTHER'
);


ALTER TYPE public."AssessmentType" OWNER TO neondb_owner;

--
-- Name: AssignmentStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."AssignmentStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'ACTIVE',
    'CLOSED',
    'ARCHIVED'
);


ALTER TYPE public."AssignmentStatus" OWNER TO neondb_owner;

--
-- Name: AssignmentType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."AssignmentType" AS ENUM (
    'HOMEWORK',
    'PROJECT',
    'ESSAY',
    'RESEARCH',
    'PRACTICAL',
    'PRESENTATION'
);


ALTER TYPE public."AssignmentType" OWNER TO neondb_owner;

--
-- Name: AttendancePeriodType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."AttendancePeriodType" AS ENUM (
    'DAILY',
    'WEEKLY',
    'MONTHLY',
    'TERM',
    'YEARLY'
);


ALTER TYPE public."AttendancePeriodType" OWNER TO neondb_owner;

--
-- Name: AttendanceRecordStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."AttendanceRecordStatus" AS ENUM (
    'PRESENT',
    'ABSENT',
    'LATE',
    'EXCUSED',
    'PARTIAL'
);


ALTER TYPE public."AttendanceRecordStatus" OWNER TO neondb_owner;

--
-- Name: AttendanceSessionType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."AttendanceSessionType" AS ENUM (
    'DAILY',
    'MORNING',
    'AFTERNOON',
    'EVENING',
    'SPECIAL'
);


ALTER TYPE public."AttendanceSessionType" OWNER TO neondb_owner;

--
-- Name: AttendanceStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."AttendanceStatus" AS ENUM (
    'PENDING',
    'SUBMITTED',
    'APPROVED',
    'REJECTED',
    'CANCELLED'
);


ALTER TYPE public."AttendanceStatus" OWNER TO neondb_owner;

--
-- Name: BillingCycle; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."BillingCycle" AS ENUM (
    'MONTHLY',
    'QUARTERLY',
    'YEARLY',
    'ONE_TIME'
);


ALTER TYPE public."BillingCycle" OWNER TO neondb_owner;

--
-- Name: ChapterStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."ChapterStatus" AS ENUM (
    'active',
    'deleted'
);


ALTER TYPE public."ChapterStatus" OWNER TO neondb_owner;

--
-- Name: ChunkType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."ChunkType" AS ENUM (
    'TEXT',
    'HEADING',
    'PARAGRAPH',
    'LIST',
    'TABLE',
    'IMAGE_CAPTION',
    'FOOTNOTE'
);


ALTER TYPE public."ChunkType" OWNER TO neondb_owner;

--
-- Name: ConversationStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."ConversationStatus" AS ENUM (
    'ACTIVE',
    'PAUSED',
    'ENDED',
    'ARCHIVED'
);


ALTER TYPE public."ConversationStatus" OWNER TO neondb_owner;

--
-- Name: DayOfWeek; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."DayOfWeek" AS ENUM (
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY'
);


ALTER TYPE public."DayOfWeek" OWNER TO neondb_owner;

--
-- Name: DifficultyLevel; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."DifficultyLevel" AS ENUM (
    'EASY',
    'MEDIUM',
    'HARD',
    'EXPERT'
);


ALTER TYPE public."DifficultyLevel" OWNER TO neondb_owner;

--
-- Name: ExamBodyStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."ExamBodyStatus" AS ENUM (
    'active',
    'inactive',
    'archived'
);


ALTER TYPE public."ExamBodyStatus" OWNER TO neondb_owner;

--
-- Name: Gender; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."Gender" AS ENUM (
    'male',
    'female',
    'other'
);


ALTER TYPE public."Gender" OWNER TO neondb_owner;

--
-- Name: GradeStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."GradeStatus" AS ENUM (
    'PENDING',
    'GRADED',
    'RETURNED',
    'DISPUTED',
    'FINAL'
);


ALTER TYPE public."GradeStatus" OWNER TO neondb_owner;

--
-- Name: GradingType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."GradingType" AS ENUM (
    'AUTOMATIC',
    'MANUAL',
    'MIXED'
);


ALTER TYPE public."GradingType" OWNER TO neondb_owner;

--
-- Name: LibraryAssignmentStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."LibraryAssignmentStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'CLOSED',
    'ARCHIVED'
);


ALTER TYPE public."LibraryAssignmentStatus" OWNER TO neondb_owner;

--
-- Name: LibraryAssignmentType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."LibraryAssignmentType" AS ENUM (
    'HOMEWORK',
    'PROJECT',
    'ESSAY',
    'QUIZ',
    'PRACTICAL',
    'OTHER'
);


ALTER TYPE public."LibraryAssignmentType" OWNER TO neondb_owner;

--
-- Name: LibraryContentStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."LibraryContentStatus" AS ENUM (
    'draft',
    'published',
    'archived'
);


ALTER TYPE public."LibraryContentStatus" OWNER TO neondb_owner;

--
-- Name: LibraryMaterialType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."LibraryMaterialType" AS ENUM (
    'PDF',
    'DOC',
    'PPT',
    'VIDEO',
    'NOTE',
    'LINK',
    'OTHER'
);


ALTER TYPE public."LibraryMaterialType" OWNER TO neondb_owner;

--
-- Name: LibraryPlatformStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."LibraryPlatformStatus" AS ENUM (
    'active',
    'inactive',
    'archived'
);


ALTER TYPE public."LibraryPlatformStatus" OWNER TO neondb_owner;

--
-- Name: LibraryResourceType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."LibraryResourceType" AS ENUM (
    'SUBJECT',
    'TOPIC',
    'VIDEO',
    'MATERIAL',
    'ASSESSMENT',
    'ALL'
);


ALTER TYPE public."LibraryResourceType" OWNER TO neondb_owner;

--
-- Name: LibraryUserRole; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."LibraryUserRole" AS ENUM (
    'admin',
    'manager',
    'content_creator',
    'reviewer',
    'viewer'
);


ALTER TYPE public."LibraryUserRole" OWNER TO neondb_owner;

--
-- Name: LibraryUserType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."LibraryUserType" AS ENUM (
    'libraryresourceowner',
    'librarymanager',
    'contentcreator',
    'reviewer',
    'viewer'
);


ALTER TYPE public."LibraryUserType" OWNER TO neondb_owner;

--
-- Name: MaterialProcessingStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."MaterialProcessingStatus" AS ENUM (
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'FAILED',
    'RETRYING'
);


ALTER TYPE public."MaterialProcessingStatus" OWNER TO neondb_owner;

--
-- Name: MessageRole; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."MessageRole" AS ENUM (
    'USER',
    'ASSISTANT',
    'SYSTEM'
);


ALTER TYPE public."MessageRole" OWNER TO neondb_owner;

--
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."NotificationType" AS ENUM (
    'all',
    'teachers',
    'students',
    'school_director',
    'admin'
);


ALTER TYPE public."NotificationType" OWNER TO neondb_owner;

--
-- Name: PaymentType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."PaymentType" AS ENUM (
    'full',
    'partial'
);


ALTER TYPE public."PaymentType" OWNER TO neondb_owner;

--
-- Name: PurchaseStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."PurchaseStatus" AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED',
    'REFUNDED',
    'CANCELLED'
);


ALTER TYPE public."PurchaseStatus" OWNER TO neondb_owner;

--
-- Name: QuestionType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."QuestionType" AS ENUM (
    'MULTIPLE_CHOICE_SINGLE',
    'MULTIPLE_CHOICE_MULTIPLE',
    'SHORT_ANSWER',
    'LONG_ANSWER',
    'TRUE_FALSE',
    'FILL_IN_BLANK',
    'MATCHING',
    'ORDERING',
    'FILE_UPLOAD',
    'NUMERIC',
    'DATE',
    'RATING_SCALE'
);


ALTER TYPE public."QuestionType" OWNER TO neondb_owner;

--
-- Name: QuizAttemptStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."QuizAttemptStatus" AS ENUM (
    'NOT_STARTED',
    'IN_PROGRESS',
    'SUBMITTED',
    'GRADED',
    'EXPIRED'
);


ALTER TYPE public."QuizAttemptStatus" OWNER TO neondb_owner;

--
-- Name: QuizStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."QuizStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'ACTIVE',
    'CLOSED',
    'ARCHIVED'
);


ALTER TYPE public."QuizStatus" OWNER TO neondb_owner;

--
-- Name: Roles; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."Roles" AS ENUM (
    'student',
    'teacher',
    'school_director',
    'school_admin',
    'parent',
    'super_admin',
    'ict_staff'
);


ALTER TYPE public."Roles" OWNER TO neondb_owner;

--
-- Name: RubricScale; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."RubricScale" AS ENUM (
    'POINTS',
    'PERCENTAGE',
    'LETTER_GRADE',
    'CUSTOM'
);


ALTER TYPE public."RubricScale" OWNER TO neondb_owner;

--
-- Name: SchoolOwnership; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."SchoolOwnership" AS ENUM (
    'government',
    'private'
);


ALTER TYPE public."SchoolOwnership" OWNER TO neondb_owner;

--
-- Name: SchoolStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."SchoolStatus" AS ENUM (
    'not_verified',
    'pending',
    'approved',
    'rejected',
    'failed',
    'suspended',
    'closed',
    'archived'
);


ALTER TYPE public."SchoolStatus" OWNER TO neondb_owner;

--
-- Name: SchoolType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."SchoolType" AS ENUM (
    'primary',
    'secondary',
    'primary_and_secondary'
);


ALTER TYPE public."SchoolType" OWNER TO neondb_owner;

--
-- Name: SubmissionStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."SubmissionStatus" AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'GRADED',
    'RETURNED',
    'RESUBMITTED'
);


ALTER TYPE public."SubmissionStatus" OWNER TO neondb_owner;

--
-- Name: SubscriptionPlanType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."SubscriptionPlanType" AS ENUM (
    'FREE',
    'BASIC',
    'PREMIUM',
    'ENTERPRISE',
    'CUSTOM'
);


ALTER TYPE public."SubscriptionPlanType" OWNER TO neondb_owner;

--
-- Name: SubscriptionStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."SubscriptionStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'SUSPENDED',
    'EXPIRED',
    'CANCELLED',
    'TRIAL'
);


ALTER TYPE public."SubscriptionStatus" OWNER TO neondb_owner;

--
-- Name: TransactionType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."TransactionType" AS ENUM (
    'credit',
    'debit'
);


ALTER TYPE public."TransactionType" OWNER TO neondb_owner;

--
-- Name: UserStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."UserStatus" AS ENUM (
    'active',
    'suspended',
    'inactive'
);


ALTER TYPE public."UserStatus" OWNER TO neondb_owner;

--
-- Name: WalletTransactionStatus; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."WalletTransactionStatus" AS ENUM (
    'PENDING',
    'COMPLETED',
    'FAILED',
    'CANCELLED',
    'REVERSED'
);


ALTER TYPE public."WalletTransactionStatus" OWNER TO neondb_owner;

--
-- Name: WalletTransactionType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."WalletTransactionType" AS ENUM (
    'CREDIT',
    'DEBIT',
    'TRANSFER',
    'WITHDRAWAL',
    'REFUND',
    'FEE_PAYMENT',
    'SCHOLARSHIP',
    'GRANT',
    'DONATION'
);


ALTER TYPE public."WalletTransactionType" OWNER TO neondb_owner;

--
-- Name: WalletType; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public."WalletType" AS ENUM (
    'SCHOOL_WALLET',
    'STUDENT_WALLET',
    'TEACHER_WALLET'
);


ALTER TYPE public."WalletType" OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: AcademicSession; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."AcademicSession" (
    id text NOT NULL,
    school_id text NOT NULL,
    academic_year text NOT NULL,
    start_year integer NOT NULL,
    end_year integer NOT NULL,
    term public."AcademicTerm" NOT NULL,
    start_date timestamp(3) without time zone NOT NULL,
    end_date timestamp(3) without time zone NOT NULL,
    status public."AcademicSessionStatus" DEFAULT 'active'::public."AcademicSessionStatus" NOT NULL,
    is_current boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AcademicSession" OWNER TO neondb_owner;

--
-- Name: AccessControlAuditLog; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."AccessControlAuditLog" (
    id text NOT NULL,
    "entityType" text NOT NULL,
    "entityId" text NOT NULL,
    action text NOT NULL,
    "performedById" text NOT NULL,
    "performedByRole" text NOT NULL,
    "schoolId" text,
    "platformId" text,
    changes jsonb,
    reason text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AccessControlAuditLog" OWNER TO neondb_owner;

--
-- Name: Achievement; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Achievement" (
    id text NOT NULL,
    school_id text NOT NULL,
    academic_session_id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    type public."AchievementType" NOT NULL,
    icon_url text,
    points integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Achievement" OWNER TO neondb_owner;

--
-- Name: Assessment; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Assessment" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    duration integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    topic_id text,
    "order" integer DEFAULT 0 NOT NULL,
    academic_session_id text NOT NULL,
    allow_review boolean DEFAULT true NOT NULL,
    auto_submit boolean DEFAULT false NOT NULL,
    created_by text NOT NULL,
    end_date timestamp(3) without time zone,
    grading_type public."GradingType" DEFAULT 'AUTOMATIC'::public."GradingType" NOT NULL,
    instructions text,
    is_published boolean DEFAULT false NOT NULL,
    is_result_released boolean DEFAULT false NOT NULL,
    max_attempts integer DEFAULT 1 NOT NULL,
    passing_score double precision DEFAULT 50.0 NOT NULL,
    published_at timestamp(3) without time zone,
    result_released_at timestamp(3) without time zone,
    school_id text NOT NULL,
    show_correct_answers boolean DEFAULT false NOT NULL,
    show_feedback boolean DEFAULT true NOT NULL,
    shuffle_options boolean DEFAULT false NOT NULL,
    shuffle_questions boolean DEFAULT false NOT NULL,
    start_date timestamp(3) without time zone,
    tags text[],
    time_limit integer,
    total_points double precision DEFAULT 100.0 NOT NULL,
    status public."QuizStatus" DEFAULT 'DRAFT'::public."QuizStatus" NOT NULL,
    subject_id text NOT NULL,
    assessment_type public."AssessmentType" DEFAULT 'CBT'::public."AssessmentType" NOT NULL,
    submissions jsonb,
    student_can_view_grading boolean DEFAULT true NOT NULL
);


ALTER TABLE public."Assessment" OWNER TO neondb_owner;

--
-- Name: AssessmentAnalytics; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."AssessmentAnalytics" (
    id text NOT NULL,
    assessment_id text NOT NULL,
    total_attempts integer DEFAULT 0 NOT NULL,
    total_students integer DEFAULT 0 NOT NULL,
    average_score double precision DEFAULT 0 NOT NULL,
    average_time integer DEFAULT 0 NOT NULL,
    pass_rate double precision DEFAULT 0 NOT NULL,
    question_stats jsonb NOT NULL,
    daily_attempts jsonb NOT NULL,
    hourly_attempts jsonb NOT NULL,
    completion_rate double precision DEFAULT 0 NOT NULL,
    abandonment_rate double precision DEFAULT 0 NOT NULL,
    last_updated timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AssessmentAnalytics" OWNER TO neondb_owner;

--
-- Name: AssessmentAttempt; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."AssessmentAttempt" (
    id text NOT NULL,
    assessment_id text NOT NULL,
    student_id text NOT NULL,
    school_id text NOT NULL,
    academic_session_id text NOT NULL,
    attempt_number integer DEFAULT 1 NOT NULL,
    status public."QuizAttemptStatus" DEFAULT 'NOT_STARTED'::public."QuizAttemptStatus" NOT NULL,
    started_at timestamp(3) without time zone,
    submitted_at timestamp(3) without time zone,
    time_spent integer,
    total_score double precision DEFAULT 0 NOT NULL,
    max_score double precision NOT NULL,
    percentage double precision DEFAULT 0 NOT NULL,
    passed boolean DEFAULT false NOT NULL,
    is_graded boolean DEFAULT false NOT NULL,
    graded_at timestamp(3) without time zone,
    graded_by text,
    overall_feedback text,
    grade_letter text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AssessmentAttempt" OWNER TO neondb_owner;

--
-- Name: AssessmentCorrectAnswer; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."AssessmentCorrectAnswer" (
    id text NOT NULL,
    question_id text NOT NULL,
    answer_text text,
    answer_number double precision,
    answer_date timestamp(3) without time zone,
    option_ids text[],
    answer_json jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AssessmentCorrectAnswer" OWNER TO neondb_owner;

--
-- Name: AssessmentOption; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."AssessmentOption" (
    id text NOT NULL,
    question_id text NOT NULL,
    option_text text NOT NULL,
    "order" integer NOT NULL,
    is_correct boolean DEFAULT false NOT NULL,
    image_url text,
    audio_url text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AssessmentOption" OWNER TO neondb_owner;

--
-- Name: AssessmentQuestion; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."AssessmentQuestion" (
    id text NOT NULL,
    assessment_id text NOT NULL,
    question_text text NOT NULL,
    question_type public."QuestionType" NOT NULL,
    "order" integer NOT NULL,
    points double precision DEFAULT 1.0 NOT NULL,
    is_required boolean DEFAULT true NOT NULL,
    time_limit integer,
    image_url text,
    image_s3_key text,
    audio_url text,
    video_url text,
    allow_multiple_attempts boolean DEFAULT false NOT NULL,
    show_hint boolean DEFAULT false NOT NULL,
    hint_text text,
    min_length integer,
    max_length integer,
    min_value double precision,
    max_value double precision,
    explanation text,
    difficulty_level public."DifficultyLevel" DEFAULT 'MEDIUM'::public."DifficultyLevel" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AssessmentQuestion" OWNER TO neondb_owner;

--
-- Name: AssessmentResponse; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."AssessmentResponse" (
    id text NOT NULL,
    attempt_id text NOT NULL,
    question_id text NOT NULL,
    student_id text NOT NULL,
    text_answer text,
    numeric_answer double precision,
    date_answer timestamp(3) without time zone,
    selected_options text[],
    file_urls text[],
    is_correct boolean,
    points_earned double precision DEFAULT 0 NOT NULL,
    max_points double precision NOT NULL,
    time_spent integer,
    feedback text,
    is_graded boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AssessmentResponse" OWNER TO neondb_owner;

--
-- Name: AssessmentSubmission; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."AssessmentSubmission" (
    id text NOT NULL,
    assessment_id text NOT NULL,
    student_id text NOT NULL,
    school_id text NOT NULL,
    academic_session_id text NOT NULL,
    submission_type public."AssessmentType" DEFAULT 'EXAM'::public."AssessmentType" NOT NULL,
    content text,
    attachment_url text,
    attachment_type text,
    status public."SubmissionStatus" DEFAULT 'SUBMITTED'::public."SubmissionStatus" NOT NULL,
    submitted_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    late_submission boolean DEFAULT false NOT NULL,
    word_count integer,
    file_size text,
    total_score double precision,
    max_score double precision,
    percentage double precision,
    passed boolean DEFAULT false NOT NULL,
    is_graded boolean DEFAULT false NOT NULL,
    graded_at timestamp(3) without time zone,
    graded_by text,
    feedback text,
    grade_letter text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AssessmentSubmission" OWNER TO neondb_owner;

--
-- Name: Assignment; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Assignment" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    topic_id text NOT NULL,
    "order" integer DEFAULT 1 NOT NULL,
    academic_session_id text NOT NULL,
    allow_late_submission boolean DEFAULT false NOT NULL,
    assignment_type public."AssignmentType" DEFAULT 'HOMEWORK'::public."AssignmentType" NOT NULL,
    attachment_type text,
    attachment_url text,
    auto_grade boolean DEFAULT false NOT NULL,
    created_by text NOT NULL,
    difficulty_level public."DifficultyLevel" DEFAULT 'MEDIUM'::public."DifficultyLevel" NOT NULL,
    due_date timestamp(3) without time zone,
    grading_rubric_id text,
    instructions text,
    is_published boolean DEFAULT false NOT NULL,
    late_penalty double precision,
    max_score integer DEFAULT 100 NOT NULL,
    published_at timestamp(3) without time zone,
    school_id text NOT NULL,
    time_limit integer,
    status public."AssignmentStatus" DEFAULT 'DRAFT'::public."AssignmentStatus" NOT NULL
);


ALTER TABLE public."Assignment" OWNER TO neondb_owner;

--
-- Name: AssignmentGrade; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."AssignmentGrade" (
    id text NOT NULL,
    assignment_id text NOT NULL,
    submission_id text NOT NULL,
    student_id text NOT NULL,
    teacher_id text NOT NULL,
    school_id text NOT NULL,
    academic_session_id text NOT NULL,
    score double precision NOT NULL,
    max_score double precision NOT NULL,
    percentage double precision NOT NULL,
    letter_grade text,
    feedback text,
    comments text,
    rubric_scores jsonb,
    status public."GradeStatus" DEFAULT 'PENDING'::public."GradeStatus" NOT NULL,
    graded_at timestamp(3) without time zone,
    returned_at timestamp(3) without time zone,
    grading_time integer,
    is_final boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AssignmentGrade" OWNER TO neondb_owner;

--
-- Name: AssignmentSubmission; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."AssignmentSubmission" (
    id text NOT NULL,
    assignment_id text NOT NULL,
    student_id text NOT NULL,
    school_id text NOT NULL,
    academic_session_id text NOT NULL,
    content text,
    attachment_url text,
    attachment_type text,
    status public."SubmissionStatus" DEFAULT 'SUBMITTED'::public."SubmissionStatus" NOT NULL,
    submitted_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    late_submission boolean DEFAULT false NOT NULL,
    word_count integer,
    file_size text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "topicId" text
);


ALTER TABLE public."AssignmentSubmission" OWNER TO neondb_owner;

--
-- Name: AttendanceRecord; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."AttendanceRecord" (
    id text NOT NULL,
    attendance_session_id text NOT NULL,
    student_id text NOT NULL,
    school_id text NOT NULL,
    academic_session_id text NOT NULL,
    class_id text NOT NULL,
    status public."AttendanceRecordStatus" DEFAULT 'ABSENT'::public."AttendanceRecordStatus" NOT NULL,
    marked_at timestamp(3) without time zone,
    marked_by text,
    reason text,
    is_excused boolean DEFAULT false NOT NULL,
    excuse_note text,
    parent_notified boolean DEFAULT false NOT NULL,
    parent_notified_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AttendanceRecord" OWNER TO neondb_owner;

--
-- Name: AttendanceSession; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."AttendanceSession" (
    id text NOT NULL,
    school_id text NOT NULL,
    academic_session_id text NOT NULL,
    class_id text NOT NULL,
    teacher_id text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    session_type public."AttendanceSessionType" DEFAULT 'DAILY'::public."AttendanceSessionType" NOT NULL,
    status public."AttendanceStatus" DEFAULT 'PENDING'::public."AttendanceStatus" NOT NULL,
    total_students integer DEFAULT 0 NOT NULL,
    present_count integer DEFAULT 0 NOT NULL,
    absent_count integer DEFAULT 0 NOT NULL,
    late_count integer DEFAULT 0 NOT NULL,
    excused_count integer DEFAULT 0 NOT NULL,
    attendance_rate double precision DEFAULT 0.0 NOT NULL,
    notes text,
    submitted_at timestamp(3) without time zone,
    approved_at timestamp(3) without time zone,
    approved_by text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AttendanceSession" OWNER TO neondb_owner;

--
-- Name: AttendanceSettings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."AttendanceSettings" (
    id text NOT NULL,
    school_id text NOT NULL,
    academic_session_id text NOT NULL,
    late_threshold_minutes integer DEFAULT 15 NOT NULL,
    auto_mark_absent_minutes integer DEFAULT 30 NOT NULL,
    require_excuse_note boolean DEFAULT true NOT NULL,
    parent_notification_enabled boolean DEFAULT true NOT NULL,
    attendance_tracking_enabled boolean DEFAULT true NOT NULL,
    minimum_attendance_rate double precision DEFAULT 75.0 NOT NULL,
    max_consecutive_absences integer DEFAULT 5 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AttendanceSettings" OWNER TO neondb_owner;

--
-- Name: AttendanceSummary; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."AttendanceSummary" (
    id text NOT NULL,
    school_id text NOT NULL,
    academic_session_id text NOT NULL,
    class_id text NOT NULL,
    student_id text,
    period_type public."AttendancePeriodType" NOT NULL,
    period_start timestamp(3) without time zone NOT NULL,
    period_end timestamp(3) without time zone NOT NULL,
    total_days integer DEFAULT 0 NOT NULL,
    present_days integer DEFAULT 0 NOT NULL,
    absent_days integer DEFAULT 0 NOT NULL,
    late_days integer DEFAULT 0 NOT NULL,
    excused_days integer DEFAULT 0 NOT NULL,
    attendance_rate double precision DEFAULT 0.0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."AttendanceSummary" OWNER TO neondb_owner;

--
-- Name: ChatAnalytics; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."ChatAnalytics" (
    id text NOT NULL,
    school_id text NOT NULL,
    material_id text,
    user_id text,
    total_conversations integer DEFAULT 0 NOT NULL,
    total_messages integer DEFAULT 0 NOT NULL,
    total_tokens_used integer DEFAULT 0 NOT NULL,
    average_response_time_ms integer DEFAULT 0 NOT NULL,
    average_relevance_score double precision DEFAULT 0 NOT NULL,
    most_used_chunks text[],
    popular_questions text[],
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    daily_usage integer DEFAULT 0 NOT NULL,
    weekly_usage integer DEFAULT 0 NOT NULL,
    monthly_usage integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ChatAnalytics" OWNER TO neondb_owner;

--
-- Name: ChatContext; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."ChatContext" (
    id text NOT NULL,
    conversation_id text NOT NULL,
    message_id text NOT NULL,
    chunk_id text NOT NULL,
    school_id text NOT NULL,
    relevance_score double precision NOT NULL,
    context_type text DEFAULT 'semantic'::text NOT NULL,
    position_in_context integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ChatContext" OWNER TO neondb_owner;

--
-- Name: ChatConversation; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."ChatConversation" (
    id text NOT NULL,
    user_id text NOT NULL,
    school_id text NOT NULL,
    material_id text,
    title text,
    status public."ConversationStatus" DEFAULT 'ACTIVE'::public."ConversationStatus" NOT NULL,
    system_prompt text,
    context_summary text,
    total_messages integer DEFAULT 0 NOT NULL,
    last_activity timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ChatConversation" OWNER TO neondb_owner;

--
-- Name: ChatMessage; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."ChatMessage" (
    id text NOT NULL,
    conversation_id text,
    user_id text NOT NULL,
    school_id text NOT NULL,
    material_id text,
    role public."MessageRole" DEFAULT 'USER'::public."MessageRole" NOT NULL,
    content text NOT NULL,
    message_type text DEFAULT 'TEXT'::text NOT NULL,
    model_used text,
    tokens_used integer,
    response_time_ms integer,
    context_chunks text[],
    context_summary text,
    is_edited boolean DEFAULT false NOT NULL,
    edited_at timestamp(3) without time zone,
    parent_message_id text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ChatMessage" OWNER TO neondb_owner;

--
-- Name: Class; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Class" (
    id text NOT NULL,
    "classId" integer NOT NULL,
    name text NOT NULL,
    "schoolId" text NOT NULL,
    academic_session_id text NOT NULL,
    "classTeacherId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Class" OWNER TO neondb_owner;

--
-- Name: Class_classId_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public."Class_classId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Class_classId_seq" OWNER TO neondb_owner;

--
-- Name: Class_classId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public."Class_classId_seq" OWNED BY public."Class"."classId";


--
-- Name: Developer; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Developer" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role text DEFAULT 'developer'::text NOT NULL,
    note text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Developer" OWNER TO neondb_owner;

--
-- Name: DeviceToken; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."DeviceToken" (
    id text NOT NULL,
    token text NOT NULL,
    "deviceType" text NOT NULL,
    user_id text NOT NULL,
    school_id text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."DeviceToken" OWNER TO neondb_owner;

--
-- Name: Document; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Document" (
    id text NOT NULL,
    secure_url text NOT NULL,
    public_id text NOT NULL
);


ALTER TABLE public."Document" OWNER TO neondb_owner;

--
-- Name: DocumentChunk; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."DocumentChunk" (
    id text NOT NULL,
    material_processing_id text NOT NULL,
    material_id text NOT NULL,
    school_id text NOT NULL,
    content text NOT NULL,
    chunk_type public."ChunkType" DEFAULT 'TEXT'::public."ChunkType" NOT NULL,
    page_number integer,
    section_title text,
    embedding public.vector NOT NULL,
    embedding_model text NOT NULL,
    token_count integer DEFAULT 0 NOT NULL,
    word_count integer DEFAULT 0 NOT NULL,
    order_index integer NOT NULL,
    keywords text[] DEFAULT ARRAY[]::text[],
    summary text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."DocumentChunk" OWNER TO neondb_owner;

--
-- Name: ExamBody; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."ExamBody" (
    id text NOT NULL,
    name text NOT NULL,
    "fullName" text NOT NULL,
    code text NOT NULL,
    description text,
    "logoUrl" text,
    "websiteUrl" text,
    status public."ExamBodyStatus" DEFAULT 'active'::public."ExamBodyStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ExamBody" OWNER TO neondb_owner;

--
-- Name: ExamBodyAssessment; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."ExamBodyAssessment" (
    id text NOT NULL,
    "examBodyId" text NOT NULL,
    "subjectId" text NOT NULL,
    "yearId" text NOT NULL,
    title text NOT NULL,
    description text,
    instructions text,
    "assessmentType" public."AssessmentType" DEFAULT 'CBT'::public."AssessmentType" NOT NULL,
    duration integer,
    "totalPoints" double precision DEFAULT 0 NOT NULL,
    "passingScore" double precision DEFAULT 50 NOT NULL,
    "maxAttempts" integer DEFAULT 999,
    "allowReview" boolean DEFAULT true NOT NULL,
    "shuffleQuestions" boolean DEFAULT true NOT NULL,
    "shuffleOptions" boolean DEFAULT true NOT NULL,
    "showCorrectAnswers" boolean DEFAULT true NOT NULL,
    "showFeedback" boolean DEFAULT true NOT NULL,
    "showExplanation" boolean DEFAULT true NOT NULL,
    status public."ExamBodyStatus" DEFAULT 'active'::public."ExamBodyStatus" NOT NULL,
    "isPublished" boolean DEFAULT false NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "platformId" text
);


ALTER TABLE public."ExamBodyAssessment" OWNER TO neondb_owner;

--
-- Name: ExamBodyAssessmentAttempt; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."ExamBodyAssessmentAttempt" (
    id text NOT NULL,
    "assessmentId" text NOT NULL,
    "userId" text NOT NULL,
    "attemptNumber" integer DEFAULT 1 NOT NULL,
    status public."QuizAttemptStatus" DEFAULT 'IN_PROGRESS'::public."QuizAttemptStatus" NOT NULL,
    "startedAt" timestamp(3) without time zone,
    "submittedAt" timestamp(3) without time zone,
    "timeSpent" integer,
    "totalScore" double precision DEFAULT 0 NOT NULL,
    "maxScore" double precision DEFAULT 0 NOT NULL,
    percentage double precision DEFAULT 0 NOT NULL,
    passed boolean DEFAULT false NOT NULL,
    "isGraded" boolean DEFAULT false NOT NULL,
    "gradedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ExamBodyAssessmentAttempt" OWNER TO neondb_owner;

--
-- Name: ExamBodyAssessmentCorrectAnswer; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."ExamBodyAssessmentCorrectAnswer" (
    id text NOT NULL,
    "questionId" text NOT NULL,
    "answerText" text,
    "answerNumber" double precision,
    "answerDate" timestamp(3) without time zone,
    "optionIds" text[],
    "answerJson" jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ExamBodyAssessmentCorrectAnswer" OWNER TO neondb_owner;

--
-- Name: ExamBodyAssessmentOption; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."ExamBodyAssessmentOption" (
    id text NOT NULL,
    "questionId" text NOT NULL,
    "optionText" text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "isCorrect" boolean DEFAULT false NOT NULL,
    "imageUrl" text,
    "audioUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ExamBodyAssessmentOption" OWNER TO neondb_owner;

--
-- Name: ExamBodyAssessmentQuestion; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."ExamBodyAssessmentQuestion" (
    id text NOT NULL,
    "assessmentId" text NOT NULL,
    "questionText" text NOT NULL,
    "questionType" public."QuestionType" DEFAULT 'MULTIPLE_CHOICE_SINGLE'::public."QuestionType" NOT NULL,
    "imageUrl" text,
    "audioUrl" text,
    "videoUrl" text,
    points double precision DEFAULT 1 NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "isRequired" boolean DEFAULT true NOT NULL,
    explanation text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ExamBodyAssessmentQuestion" OWNER TO neondb_owner;

--
-- Name: ExamBodyAssessmentResponse; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."ExamBodyAssessmentResponse" (
    id text NOT NULL,
    "attemptId" text NOT NULL,
    "questionId" text NOT NULL,
    "userId" text NOT NULL,
    "textAnswer" text,
    "numericAnswer" double precision,
    "dateAnswer" timestamp(3) without time zone,
    "selectedOptions" text[],
    "fileUrls" text[],
    "answerJson" jsonb,
    "isCorrect" boolean,
    "pointsEarned" double precision DEFAULT 0 NOT NULL,
    "maxPoints" double precision DEFAULT 0 NOT NULL,
    feedback text,
    "isGraded" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ExamBodyAssessmentResponse" OWNER TO neondb_owner;

--
-- Name: ExamBodySubject; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."ExamBodySubject" (
    id text NOT NULL,
    "examBodyId" text NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    description text,
    "iconUrl" text,
    "order" integer DEFAULT 0 NOT NULL,
    status public."ExamBodyStatus" DEFAULT 'active'::public."ExamBodyStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ExamBodySubject" OWNER TO neondb_owner;

--
-- Name: ExamBodyYear; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."ExamBodyYear" (
    id text NOT NULL,
    "examBodyId" text NOT NULL,
    year text NOT NULL,
    description text,
    "startDate" timestamp(3) without time zone,
    "endDate" timestamp(3) without time zone,
    "order" integer DEFAULT 0 NOT NULL,
    status public."ExamBodyStatus" DEFAULT 'active'::public."ExamBodyStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ExamBodyYear" OWNER TO neondb_owner;

--
-- Name: Finance; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Finance" (
    id text NOT NULL,
    school_id text NOT NULL,
    total_revenue double precision DEFAULT 0 NOT NULL,
    outstanding_fee double precision DEFAULT 0 NOT NULL,
    amount_withdrawn double precision DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Finance" OWNER TO neondb_owner;

--
-- Name: GradingRubric; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."GradingRubric" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    school_id text NOT NULL,
    academic_session_id text NOT NULL,
    created_by text NOT NULL,
    criteria jsonb NOT NULL,
    total_points double precision NOT NULL,
    scale_type public."RubricScale" DEFAULT 'POINTS'::public."RubricScale" NOT NULL,
    is_template boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."GradingRubric" OWNER TO neondb_owner;

--
-- Name: LibraryAssessment; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryAssessment" (
    id text NOT NULL,
    "platformId" text NOT NULL,
    "subjectId" text NOT NULL,
    "topicId" text,
    "createdById" text NOT NULL,
    title text NOT NULL,
    description text,
    instructions text,
    "assessmentType" public."AssessmentType" DEFAULT 'CBT'::public."AssessmentType" NOT NULL,
    "gradingType" public."GradingType" DEFAULT 'AUTOMATIC'::public."GradingType" NOT NULL,
    status public."QuizStatus" DEFAULT 'DRAFT'::public."QuizStatus" NOT NULL,
    duration integer,
    "timeLimit" integer,
    "startDate" timestamp(3) without time zone,
    "endDate" timestamp(3) without time zone,
    "maxAttempts" integer DEFAULT 1 NOT NULL,
    "allowReview" boolean DEFAULT true NOT NULL,
    "autoSubmit" boolean DEFAULT false NOT NULL,
    "totalPoints" double precision DEFAULT 100.0 NOT NULL,
    "passingScore" double precision DEFAULT 50.0 NOT NULL,
    "showCorrectAnswers" boolean DEFAULT false NOT NULL,
    "showFeedback" boolean DEFAULT true NOT NULL,
    "studentCanViewGrading" boolean DEFAULT true NOT NULL,
    "shuffleQuestions" boolean DEFAULT false NOT NULL,
    "shuffleOptions" boolean DEFAULT false NOT NULL,
    "isPublished" boolean DEFAULT false NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    "isResultReleased" boolean DEFAULT false NOT NULL,
    "resultReleasedAt" timestamp(3) without time zone,
    tags text[] DEFAULT ARRAY[]::text[],
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LibraryAssessment" OWNER TO neondb_owner;

--
-- Name: LibraryAssessmentAnalytics; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryAssessmentAnalytics" (
    id text NOT NULL,
    "assessmentId" text NOT NULL,
    "totalAttempts" integer DEFAULT 0 NOT NULL,
    "totalUsers" integer DEFAULT 0 NOT NULL,
    "averageScore" double precision DEFAULT 0 NOT NULL,
    "averageTime" integer DEFAULT 0 NOT NULL,
    "passRate" double precision DEFAULT 0 NOT NULL,
    "questionStats" jsonb NOT NULL,
    "dailyAttempts" jsonb NOT NULL,
    "hourlyAttempts" jsonb NOT NULL,
    "completionRate" double precision DEFAULT 0 NOT NULL,
    "abandonmentRate" double precision DEFAULT 0 NOT NULL,
    "lastUpdated" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LibraryAssessmentAnalytics" OWNER TO neondb_owner;

--
-- Name: LibraryAssessmentAttempt; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryAssessmentAttempt" (
    id text NOT NULL,
    "assessmentId" text NOT NULL,
    "userId" text NOT NULL,
    "attemptNumber" integer DEFAULT 1 NOT NULL,
    status public."QuizAttemptStatus" DEFAULT 'NOT_STARTED'::public."QuizAttemptStatus" NOT NULL,
    "startedAt" timestamp(3) without time zone,
    "submittedAt" timestamp(3) without time zone,
    "timeSpent" integer,
    "totalScore" double precision DEFAULT 0 NOT NULL,
    "maxScore" double precision NOT NULL,
    percentage double precision DEFAULT 0 NOT NULL,
    passed boolean DEFAULT false NOT NULL,
    "isGraded" boolean DEFAULT false NOT NULL,
    "gradedAt" timestamp(3) without time zone,
    "gradedBy" text,
    "overallFeedback" text,
    "gradeLetter" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LibraryAssessmentAttempt" OWNER TO neondb_owner;

--
-- Name: LibraryAssessmentCorrectAnswer; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryAssessmentCorrectAnswer" (
    id text NOT NULL,
    "questionId" text NOT NULL,
    "answerText" text,
    "answerNumber" double precision,
    "answerDate" timestamp(3) without time zone,
    "optionIds" text[],
    "answerJson" jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LibraryAssessmentCorrectAnswer" OWNER TO neondb_owner;

--
-- Name: LibraryAssessmentOption; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryAssessmentOption" (
    id text NOT NULL,
    "questionId" text NOT NULL,
    "optionText" text NOT NULL,
    "order" integer NOT NULL,
    "isCorrect" boolean DEFAULT false NOT NULL,
    "imageUrl" text,
    "audioUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LibraryAssessmentOption" OWNER TO neondb_owner;

--
-- Name: LibraryAssessmentQuestion; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryAssessmentQuestion" (
    id text NOT NULL,
    "assessmentId" text NOT NULL,
    "questionText" text NOT NULL,
    "questionType" public."QuestionType" NOT NULL,
    "order" integer NOT NULL,
    points double precision DEFAULT 1.0 NOT NULL,
    "isRequired" boolean DEFAULT true NOT NULL,
    "timeLimit" integer,
    "imageUrl" text,
    "imageS3Key" text,
    "audioUrl" text,
    "videoUrl" text,
    "allowMultipleAttempts" boolean DEFAULT false NOT NULL,
    "showHint" boolean DEFAULT false NOT NULL,
    "hintText" text,
    "minLength" integer,
    "maxLength" integer,
    "minValue" double precision,
    "maxValue" double precision,
    explanation text,
    "difficultyLevel" public."DifficultyLevel" DEFAULT 'MEDIUM'::public."DifficultyLevel" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LibraryAssessmentQuestion" OWNER TO neondb_owner;

--
-- Name: LibraryAssessmentResponse; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryAssessmentResponse" (
    id text NOT NULL,
    "attemptId" text NOT NULL,
    "questionId" text NOT NULL,
    "userId" text NOT NULL,
    "textAnswer" text,
    "numericAnswer" double precision,
    "dateAnswer" timestamp(3) without time zone,
    "selectedOptions" text[],
    "fileUrls" text[],
    "isCorrect" boolean,
    "pointsEarned" double precision DEFAULT 0 NOT NULL,
    "maxPoints" double precision NOT NULL,
    "timeSpent" integer,
    feedback text,
    "isGraded" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LibraryAssessmentResponse" OWNER TO neondb_owner;

--
-- Name: LibraryAssignment; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryAssignment" (
    id text NOT NULL,
    "platformId" text NOT NULL,
    "subjectId" text NOT NULL,
    "topicId" text NOT NULL,
    "uploadedById" text NOT NULL,
    title text NOT NULL,
    description text,
    "assignmentType" public."LibraryAssignmentType" DEFAULT 'HOMEWORK'::public."LibraryAssignmentType" NOT NULL,
    instructions text,
    "attachmentUrl" text,
    "attachmentS3Key" text,
    "dueDate" timestamp(3) without time zone,
    "maxScore" integer DEFAULT 100 NOT NULL,
    "allowLateSubmission" boolean DEFAULT false NOT NULL,
    "latePenalty" double precision,
    status public."LibraryAssignmentStatus" DEFAULT 'DRAFT'::public."LibraryAssignmentStatus" NOT NULL,
    "order" integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LibraryAssignment" OWNER TO neondb_owner;

--
-- Name: LibraryClass; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryClass" (
    id text NOT NULL,
    name text NOT NULL,
    "order" integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LibraryClass" OWNER TO neondb_owner;

--
-- Name: LibraryComment; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryComment" (
    id text NOT NULL,
    "platformId" text NOT NULL,
    "subjectId" text,
    "topicId" text,
    "commentedById" text,
    "userId" text,
    content text NOT NULL,
    "parentCommentId" text,
    "isEdited" boolean DEFAULT false NOT NULL,
    "editedAt" timestamp(3) without time zone,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LibraryComment" OWNER TO neondb_owner;

--
-- Name: LibraryGeneralMaterial; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryGeneralMaterial" (
    id text NOT NULL,
    "platformId" text NOT NULL,
    "uploadedById" text NOT NULL,
    title text NOT NULL,
    description text,
    author text,
    isbn text,
    publisher text,
    "materialType" public."LibraryMaterialType" DEFAULT 'PDF'::public."LibraryMaterialType" NOT NULL,
    url text NOT NULL,
    "s3Key" text,
    "sizeBytes" integer,
    "pageCount" integer,
    "thumbnailUrl" text,
    "thumbnailS3Key" text,
    price double precision,
    currency text DEFAULT 'NGN'::text,
    "isFree" boolean DEFAULT false NOT NULL,
    "isAvailable" boolean DEFAULT true NOT NULL,
    "subjectId" text,
    "isAiEnabled" boolean DEFAULT false NOT NULL,
    "processingStatus" public."MaterialProcessingStatus" DEFAULT 'PENDING'::public."MaterialProcessingStatus" NOT NULL,
    status public."LibraryContentStatus" DEFAULT 'published'::public."LibraryContentStatus" NOT NULL,
    "order" integer DEFAULT 1 NOT NULL,
    views integer DEFAULT 0 NOT NULL,
    downloads integer DEFAULT 0 NOT NULL,
    "salesCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LibraryGeneralMaterial" OWNER TO neondb_owner;

--
-- Name: LibraryGeneralMaterialChapter; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryGeneralMaterialChapter" (
    id text NOT NULL,
    "materialId" text NOT NULL,
    "platformId" text NOT NULL,
    title text NOT NULL,
    description text,
    "pageStart" integer,
    "pageEnd" integer,
    "order" integer DEFAULT 1 NOT NULL,
    "isAiEnabled" boolean DEFAULT false NOT NULL,
    "isProcessed" boolean DEFAULT false NOT NULL,
    "chunkCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "chapterStatus" public."ChapterStatus" DEFAULT 'active'::public."ChapterStatus" NOT NULL
);


ALTER TABLE public."LibraryGeneralMaterialChapter" OWNER TO neondb_owner;

--
-- Name: LibraryGeneralMaterialChapterFile; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryGeneralMaterialChapterFile" (
    id text NOT NULL,
    "chapterId" text NOT NULL,
    "platformId" text NOT NULL,
    "uploadedById" text NOT NULL,
    "fileName" text NOT NULL,
    "fileType" public."LibraryMaterialType" DEFAULT 'PDF'::public."LibraryMaterialType" NOT NULL,
    url text NOT NULL,
    "s3Key" text,
    "sizeBytes" integer,
    "pageCount" integer,
    title text,
    description text,
    "order" integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LibraryGeneralMaterialChapterFile" OWNER TO neondb_owner;

--
-- Name: LibraryGeneralMaterialChatContext; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryGeneralMaterialChatContext" (
    id text NOT NULL,
    "conversationId" text NOT NULL,
    "chunkId" text NOT NULL,
    "materialId" text NOT NULL,
    "relevanceScore" double precision,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."LibraryGeneralMaterialChatContext" OWNER TO neondb_owner;

--
-- Name: LibraryGeneralMaterialChatConversation; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryGeneralMaterialChatConversation" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "materialId" text NOT NULL,
    "platformId" text NOT NULL,
    title text,
    status public."ConversationStatus" DEFAULT 'ACTIVE'::public."ConversationStatus" NOT NULL,
    "systemPrompt" text,
    "contextSummary" text,
    "totalMessages" integer DEFAULT 0 NOT NULL,
    "lastActivity" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LibraryGeneralMaterialChatConversation" OWNER TO neondb_owner;

--
-- Name: LibraryGeneralMaterialChatMessage; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryGeneralMaterialChatMessage" (
    id text NOT NULL,
    "conversationId" text NOT NULL,
    "materialId" text NOT NULL,
    "userId" text NOT NULL,
    role public."MessageRole" NOT NULL,
    content text NOT NULL,
    "tokensUsed" integer,
    model text,
    "referencedChunks" text[],
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."LibraryGeneralMaterialChatMessage" OWNER TO neondb_owner;

--
-- Name: LibraryGeneralMaterialChunk; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryGeneralMaterialChunk" (
    id text NOT NULL,
    "materialId" text NOT NULL,
    "chapterId" text,
    "processingId" text NOT NULL,
    "platformId" text NOT NULL,
    content text NOT NULL,
    "chunkType" public."ChunkType" DEFAULT 'TEXT'::public."ChunkType" NOT NULL,
    "pageNumber" integer,
    "sectionTitle" text,
    embedding public.vector NOT NULL,
    "embeddingModel" text NOT NULL,
    "tokenCount" integer DEFAULT 0 NOT NULL,
    "wordCount" integer DEFAULT 0 NOT NULL,
    "orderIndex" integer NOT NULL,
    keywords text[] DEFAULT ARRAY[]::text[],
    summary text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LibraryGeneralMaterialChunk" OWNER TO neondb_owner;

--
-- Name: LibraryGeneralMaterialClass; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryGeneralMaterialClass" (
    id text NOT NULL,
    "materialId" text NOT NULL,
    "classId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LibraryGeneralMaterialClass" OWNER TO neondb_owner;

--
-- Name: LibraryGeneralMaterialProcessing; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryGeneralMaterialProcessing" (
    id text NOT NULL,
    "materialId" text NOT NULL,
    "platformId" text NOT NULL,
    status public."MaterialProcessingStatus" DEFAULT 'PENDING'::public."MaterialProcessingStatus" NOT NULL,
    "totalChunks" integer DEFAULT 0 NOT NULL,
    "processedChunks" integer DEFAULT 0 NOT NULL,
    "failedChunks" integer DEFAULT 0 NOT NULL,
    "processingStartedAt" timestamp(3) without time zone,
    "processingCompletedAt" timestamp(3) without time zone,
    "errorMessage" text,
    "retryCount" integer DEFAULT 0 NOT NULL,
    "vectorDatabaseId" text,
    "embeddingModel" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LibraryGeneralMaterialProcessing" OWNER TO neondb_owner;

--
-- Name: LibraryGeneralMaterialPurchase; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryGeneralMaterialPurchase" (
    id text NOT NULL,
    "materialId" text NOT NULL,
    "userId" text NOT NULL,
    "platformId" text NOT NULL,
    price double precision NOT NULL,
    currency text DEFAULT 'NGN'::text NOT NULL,
    "paymentMethod" text,
    "transactionId" text,
    status public."PurchaseStatus" DEFAULT 'PENDING'::public."PurchaseStatus" NOT NULL,
    "purchasedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LibraryGeneralMaterialPurchase" OWNER TO neondb_owner;

--
-- Name: LibraryLink; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryLink" (
    id text NOT NULL,
    "platformId" text NOT NULL,
    "subjectId" text NOT NULL,
    "topicId" text,
    "uploadedById" text NOT NULL,
    title text NOT NULL,
    description text,
    url text NOT NULL,
    "linkType" text,
    "thumbnailUrl" text,
    domain text,
    status public."LibraryContentStatus" DEFAULT 'published'::public."LibraryContentStatus" NOT NULL,
    "order" integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LibraryLink" OWNER TO neondb_owner;

--
-- Name: LibraryMaterial; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryMaterial" (
    id text NOT NULL,
    "platformId" text NOT NULL,
    "subjectId" text NOT NULL,
    "topicId" text,
    "uploadedById" text NOT NULL,
    title text NOT NULL,
    description text,
    "materialType" public."LibraryMaterialType" DEFAULT 'PDF'::public."LibraryMaterialType" NOT NULL,
    url text NOT NULL,
    "s3Key" text,
    "sizeBytes" integer,
    "pageCount" integer,
    status public."LibraryContentStatus" DEFAULT 'published'::public."LibraryContentStatus" NOT NULL,
    "order" integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LibraryMaterial" OWNER TO neondb_owner;

--
-- Name: LibraryPermissionDefinition; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryPermissionDefinition" (
    id text NOT NULL,
    code text NOT NULL,
    name text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LibraryPermissionDefinition" OWNER TO neondb_owner;

--
-- Name: LibraryPlatform; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryPlatform" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    description text,
    status public."LibraryPlatformStatus" DEFAULT 'active'::public."LibraryPlatformStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LibraryPlatform" OWNER TO neondb_owner;

--
-- Name: LibraryResource; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryResource" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    "resourceType" text NOT NULL,
    url text,
    "schoolId" text,
    "platformId" text NOT NULL,
    "uploadedById" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    topic_id text,
    format text,
    status text DEFAULT 'available'::text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."LibraryResource" OWNER TO neondb_owner;

--
-- Name: LibraryResourceAccess; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryResourceAccess" (
    id text NOT NULL,
    "platformId" text NOT NULL,
    "schoolId" text NOT NULL,
    "subjectId" text,
    "topicId" text,
    "videoId" text,
    "materialId" text,
    "assessmentId" text,
    "resourceType" public."LibraryResourceType" NOT NULL,
    "accessLevel" public."AccessLevel" DEFAULT 'FULL'::public."AccessLevel" NOT NULL,
    "grantedById" text NOT NULL,
    "grantedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expiresAt" timestamp(3) without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LibraryResourceAccess" OWNER TO neondb_owner;

--
-- Name: LibraryResourceUser; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryResourceUser" (
    id text NOT NULL,
    "platformId" text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone_number text,
    role public."LibraryUserRole" DEFAULT 'content_creator'::public."LibraryUserRole" NOT NULL,
    "userType" public."LibraryUserType" DEFAULT 'libraryresourceowner'::public."LibraryUserType" NOT NULL,
    status public."UserStatus" DEFAULT 'active'::public."UserStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "permissionLevel" integer,
    permissions text[] DEFAULT ARRAY[]::text[]
);


ALTER TABLE public."LibraryResourceUser" OWNER TO neondb_owner;

--
-- Name: LibrarySubject; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibrarySubject" (
    id text NOT NULL,
    "platformId" text NOT NULL,
    "classId" text,
    name text NOT NULL,
    code text,
    color text DEFAULT '#3B82F6'::text NOT NULL,
    description text,
    "thumbnailUrl" text,
    "thumbnailKey" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LibrarySubject" OWNER TO neondb_owner;

--
-- Name: LibraryTopic; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryTopic" (
    id text NOT NULL,
    "platformId" text NOT NULL,
    "subjectId" text NOT NULL,
    title text NOT NULL,
    description text,
    "order" integer DEFAULT 1 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LibraryTopic" OWNER TO neondb_owner;

--
-- Name: LibraryVideoLesson; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryVideoLesson" (
    id text NOT NULL,
    "platformId" text NOT NULL,
    "subjectId" text NOT NULL,
    "topicId" text,
    "uploadedById" text NOT NULL,
    title text NOT NULL,
    description text,
    "videoUrl" text NOT NULL,
    "videoS3Key" text,
    "thumbnailUrl" text,
    "thumbnailS3Key" text,
    "durationSeconds" integer,
    "sizeBytes" integer,
    views integer DEFAULT 0 NOT NULL,
    status public."LibraryContentStatus" DEFAULT 'published'::public."LibraryContentStatus" NOT NULL,
    "order" integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LibraryVideoLesson" OWNER TO neondb_owner;

--
-- Name: LibraryVideoView; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryVideoView" (
    id text NOT NULL,
    "videoId" text NOT NULL,
    "userId" text,
    "libraryResourceUserId" text,
    "viewedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."LibraryVideoView" OWNER TO neondb_owner;

--
-- Name: LibraryVideoWatchHistory; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LibraryVideoWatchHistory" (
    id text NOT NULL,
    "videoId" text NOT NULL,
    "userId" text,
    "libraryResourceUserId" text,
    "schoolId" text,
    "classId" text,
    "userRole" text,
    "watchedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "watchDurationSeconds" integer,
    "videoDurationSeconds" integer,
    "completionPercentage" double precision DEFAULT 0,
    "isCompleted" boolean DEFAULT false NOT NULL,
    "lastWatchPosition" integer DEFAULT 0,
    "watchCount" integer DEFAULT 1 NOT NULL,
    "deviceType" text,
    platform text,
    "userAgent" text,
    "ipAddress" text,
    "referrerSource" text,
    "referrerUrl" text,
    "videoQuality" text,
    "bufferingEvents" integer DEFAULT 0,
    "playbackSpeed" double precision DEFAULT 1.0,
    "sessionId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LibraryVideoWatchHistory" OWNER TO neondb_owner;

--
-- Name: LiveClass; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LiveClass" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    "meetingUrl" text NOT NULL,
    "startTime" timestamp(3) without time zone NOT NULL,
    "endTime" timestamp(3) without time zone NOT NULL,
    "schoolId" text,
    "platformId" text NOT NULL,
    "createdById" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    topic_id text,
    "maxParticipants" integer,
    status text DEFAULT 'scheduled'::text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."LiveClass" OWNER TO neondb_owner;

--
-- Name: MaterialProcessing; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."MaterialProcessing" (
    id text NOT NULL,
    material_id text NOT NULL,
    school_id text NOT NULL,
    status public."MaterialProcessingStatus" DEFAULT 'PENDING'::public."MaterialProcessingStatus" NOT NULL,
    total_chunks integer DEFAULT 0 NOT NULL,
    processed_chunks integer DEFAULT 0 NOT NULL,
    failed_chunks integer DEFAULT 0 NOT NULL,
    processing_started_at timestamp(3) without time zone,
    processing_completed_at timestamp(3) without time zone,
    error_message text,
    retry_count integer DEFAULT 0 NOT NULL,
    vector_database_id text,
    embedding_model text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."MaterialProcessing" OWNER TO neondb_owner;

--
-- Name: Notification; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    school_id text NOT NULL,
    academic_session_id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    type public."NotificationType" NOT NULL,
    "comingUpOn" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Notification" OWNER TO neondb_owner;

--
-- Name: Organisation; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Organisation" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Organisation" OWNER TO neondb_owner;

--
-- Name: PDFMaterial; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."PDFMaterial" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    url text NOT NULL,
    "schoolId" text,
    "platformId" text NOT NULL,
    "uploadedById" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    topic_id text,
    downloads integer DEFAULT 0 NOT NULL,
    size text,
    status text DEFAULT 'published'::text NOT NULL,
    "order" integer DEFAULT 1 NOT NULL,
    "fileType" text,
    "originalName" text,
    "materialId" text
);


ALTER TABLE public."PDFMaterial" OWNER TO neondb_owner;

--
-- Name: Parent; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Parent" (
    id text NOT NULL,
    school_id text NOT NULL,
    user_id text NOT NULL,
    parent_id text NOT NULL,
    occupation text,
    employer text,
    address text,
    emergency_contact text,
    relationship text,
    is_primary_contact boolean DEFAULT true NOT NULL,
    status public."UserStatus" DEFAULT 'active'::public."UserStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Parent" OWNER TO neondb_owner;

--
-- Name: Payment; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Payment" (
    id text NOT NULL,
    finance_id text NOT NULL,
    academic_session_id text NOT NULL,
    student_id text NOT NULL,
    class_id text NOT NULL,
    payment_for text NOT NULL,
    amount double precision NOT NULL,
    payment_type public."PaymentType" NOT NULL,
    transaction_type public."TransactionType" NOT NULL,
    payment_date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Payment" OWNER TO neondb_owner;

--
-- Name: PlatformSubscriptionPlan; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."PlatformSubscriptionPlan" (
    id text NOT NULL,
    school_id text,
    name text DEFAULT 'Free'::text NOT NULL,
    plan_type public."SubscriptionPlanType" DEFAULT 'FREE'::public."SubscriptionPlanType" NOT NULL,
    description text,
    cost double precision DEFAULT 0 NOT NULL,
    currency text DEFAULT 'USD'::text NOT NULL,
    billing_cycle public."BillingCycle" DEFAULT 'MONTHLY'::public."BillingCycle" NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    max_allowed_teachers integer DEFAULT 30 NOT NULL,
    max_allowed_students integer DEFAULT 100 NOT NULL,
    max_allowed_classes integer,
    max_allowed_subjects integer,
    allowed_document_types text[] DEFAULT ARRAY['pdf'::text],
    max_file_size_mb integer DEFAULT 10 NOT NULL,
    max_document_uploads_per_student_per_day integer DEFAULT 3 NOT NULL,
    max_document_uploads_per_teacher_per_day integer DEFAULT 10 NOT NULL,
    max_storage_mb integer DEFAULT 500 NOT NULL,
    max_files_per_month integer DEFAULT 10 NOT NULL,
    max_daily_tokens_per_user integer DEFAULT 50000 NOT NULL,
    max_weekly_tokens_per_user integer,
    max_monthly_tokens_per_user integer,
    max_total_tokens_per_school integer,
    max_messages_per_week integer DEFAULT 100 NOT NULL,
    max_conversations_per_user integer,
    max_chat_sessions_per_user integer,
    features jsonb,
    start_date timestamp(3) without time zone,
    end_date timestamp(3) without time zone,
    status public."SubscriptionStatus" DEFAULT 'ACTIVE'::public."SubscriptionStatus" NOT NULL,
    auto_renew boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    is_template boolean DEFAULT false NOT NULL
);


ALTER TABLE public."PlatformSubscriptionPlan" OWNER TO neondb_owner;

--
-- Name: Result; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Result" (
    id text NOT NULL,
    school_id text NOT NULL,
    academic_session_id text NOT NULL,
    student_id text NOT NULL,
    class_id text,
    subject_results jsonb NOT NULL,
    total_ca_score double precision DEFAULT 0 NOT NULL,
    total_exam_score double precision DEFAULT 0 NOT NULL,
    total_score double precision DEFAULT 0 NOT NULL,
    total_max_score double precision DEFAULT 0 NOT NULL,
    overall_percentage double precision DEFAULT 0 NOT NULL,
    overall_grade text,
    class_position integer,
    total_students integer,
    released_by text,
    released_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_final boolean DEFAULT true NOT NULL,
    released_by_school_admin boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Result" OWNER TO neondb_owner;

--
-- Name: School; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."School" (
    id text NOT NULL,
    school_name text NOT NULL,
    school_email text NOT NULL,
    school_phone text NOT NULL,
    school_address text NOT NULL,
    school_type public."SchoolType" NOT NULL,
    school_ownership public."SchoolOwnership" NOT NULL,
    status public."SchoolStatus" DEFAULT 'pending'::public."SchoolStatus" NOT NULL,
    school_icon jsonb,
    "cacId" text,
    "utilityBillId" text,
    "taxClearanceId" text,
    "platformId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."School" OWNER TO neondb_owner;

--
-- Name: SchoolResourceAccess; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."SchoolResourceAccess" (
    id text NOT NULL,
    "schoolId" text NOT NULL,
    "libraryResourceAccessId" text NOT NULL,
    "userId" text,
    "roleType" public."Roles",
    "classId" text,
    "subjectId" text,
    "topicId" text,
    "videoId" text,
    "materialId" text,
    "assessmentId" text,
    "resourceType" public."LibraryResourceType" NOT NULL,
    "accessLevel" public."AccessLevel" DEFAULT 'READ_ONLY'::public."AccessLevel" NOT NULL,
    "grantedById" text NOT NULL,
    "grantedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expiresAt" timestamp(3) without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SchoolResourceAccess" OWNER TO neondb_owner;

--
-- Name: SchoolResourceExclusion; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."SchoolResourceExclusion" (
    id text NOT NULL,
    "schoolId" text NOT NULL,
    "platformId" text NOT NULL,
    "subjectId" text NOT NULL,
    "excludedById" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."SchoolResourceExclusion" OWNER TO neondb_owner;

--
-- Name: SchoolVideoView; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."SchoolVideoView" (
    id text NOT NULL,
    "videoId" text NOT NULL,
    "userId" text NOT NULL,
    "viewedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."SchoolVideoView" OWNER TO neondb_owner;

--
-- Name: SchoolVideoWatchHistory; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."SchoolVideoWatchHistory" (
    id text NOT NULL,
    "videoId" text NOT NULL,
    "userId" text NOT NULL,
    "schoolId" text,
    "classId" text,
    "userRole" text,
    "watchedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "watchDurationSeconds" integer,
    "videoDurationSeconds" integer,
    "completionPercentage" double precision DEFAULT 0,
    "isCompleted" boolean DEFAULT false NOT NULL,
    "lastWatchPosition" integer DEFAULT 0,
    "watchCount" integer DEFAULT 1 NOT NULL,
    "deviceType" text,
    platform text,
    "userAgent" text,
    "referrerSource" text,
    "referrerUrl" text,
    "videoQuality" text,
    "bufferingEvents" integer DEFAULT 0,
    "playbackSpeed" double precision DEFAULT 1.0,
    "sessionId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SchoolVideoWatchHistory" OWNER TO neondb_owner;

--
-- Name: Student; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Student" (
    id text NOT NULL,
    school_id text NOT NULL,
    academic_session_id text NOT NULL,
    user_id text NOT NULL,
    student_id text NOT NULL,
    admission_number text,
    date_of_birth timestamp(3) without time zone,
    admission_date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    current_class_id text,
    guardian_name text,
    guardian_phone text,
    guardian_email text,
    address text,
    emergency_contact text,
    blood_group text,
    medical_conditions text,
    allergies text,
    previous_school text,
    academic_level text,
    parent_id text,
    status public."UserStatus" DEFAULT 'active'::public."UserStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    city text,
    country text,
    postal_code text,
    state text
);


ALTER TABLE public."Student" OWNER TO neondb_owner;

--
-- Name: StudentAchievement; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."StudentAchievement" (
    id text NOT NULL,
    student_id text NOT NULL,
    achievement_id text NOT NULL,
    earned_date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    points_earned integer DEFAULT 0 NOT NULL,
    is_visible boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."StudentAchievement" OWNER TO neondb_owner;

--
-- Name: StudentPerformance; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."StudentPerformance" (
    id text NOT NULL,
    student_id text NOT NULL,
    class_id text NOT NULL,
    academic_session_id text NOT NULL,
    term integer NOT NULL,
    year integer NOT NULL,
    total_score double precision NOT NULL,
    max_score double precision NOT NULL,
    "position" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."StudentPerformance" OWNER TO neondb_owner;

--
-- Name: Subject; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Subject" (
    id text NOT NULL,
    name text NOT NULL,
    code text,
    color text DEFAULT '#3B82F6'::text NOT NULL,
    description text,
    "schoolId" text NOT NULL,
    academic_session_id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "classId" text,
    thumbnail jsonb
);


ALTER TABLE public."Subject" OWNER TO neondb_owner;

--
-- Name: SupportInfo; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."SupportInfo" (
    id text NOT NULL,
    school_id text NOT NULL,
    faq_count integer DEFAULT 0 NOT NULL,
    last_faq_update timestamp(3) without time zone,
    faq_categories jsonb DEFAULT '[]'::jsonb NOT NULL,
    email_support text DEFAULT 'support@school.edu'::text NOT NULL,
    phone_support text DEFAULT '+1-800-SCHOOL'::text NOT NULL,
    live_chat_available boolean DEFAULT false NOT NULL,
    response_time text DEFAULT '24 hours'::text NOT NULL,
    app_version text DEFAULT '1.0.0'::text NOT NULL,
    build_number text DEFAULT '100'::text NOT NULL,
    last_updated timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    minimum_ios_version text DEFAULT '13.0'::text NOT NULL,
    minimum_android_version text DEFAULT '8.0'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SupportInfo" OWNER TO neondb_owner;

--
-- Name: Teacher; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Teacher" (
    id text NOT NULL,
    email text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone_number text NOT NULL,
    display_picture jsonb,
    school_id text NOT NULL,
    academic_session_id text DEFAULT '1'::text NOT NULL,
    user_id text NOT NULL,
    gender public."Gender" DEFAULT 'other'::public."Gender" NOT NULL,
    role public."Roles" DEFAULT 'teacher'::public."Roles" NOT NULL,
    password text DEFAULT ''::text NOT NULL,
    teacher_id text NOT NULL,
    employee_number text,
    qualification text,
    specialization text,
    years_of_experience integer,
    hire_date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    salary double precision,
    department text,
    is_class_teacher boolean DEFAULT false NOT NULL,
    status public."UserStatus" DEFAULT 'active'::public."UserStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Teacher" OWNER TO neondb_owner;

--
-- Name: TeacherResourceAccess; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."TeacherResourceAccess" (
    id text NOT NULL,
    "teacherId" text NOT NULL,
    "schoolId" text NOT NULL,
    "schoolResourceAccessId" text NOT NULL,
    "studentId" text,
    "classId" text,
    "subjectId" text,
    "topicId" text,
    "videoId" text,
    "materialId" text,
    "assessmentId" text,
    "resourceType" public."LibraryResourceType" NOT NULL,
    "accessLevel" public."AccessLevel" DEFAULT 'READ_ONLY'::public."AccessLevel" NOT NULL,
    "grantedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expiresAt" timestamp(3) without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."TeacherResourceAccess" OWNER TO neondb_owner;

--
-- Name: TeacherResourceExclusion; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."TeacherResourceExclusion" (
    id text NOT NULL,
    "teacherId" text NOT NULL,
    "schoolId" text NOT NULL,
    "subjectId" text NOT NULL,
    "resourceType" text NOT NULL,
    "resourceId" text NOT NULL,
    "classId" text,
    "studentId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "libraryClassId" text
);


ALTER TABLE public."TeacherResourceExclusion" OWNER TO neondb_owner;

--
-- Name: TeacherSubject; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."TeacherSubject" (
    id text NOT NULL,
    "teacherId" text NOT NULL,
    "subjectId" text NOT NULL
);


ALTER TABLE public."TeacherSubject" OWNER TO neondb_owner;

--
-- Name: TimeSlot; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."TimeSlot" (
    id text NOT NULL,
    "startTime" text NOT NULL,
    "endTime" text NOT NULL,
    label text NOT NULL,
    "order" integer NOT NULL,
    "schoolId" text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."TimeSlot" OWNER TO neondb_owner;

--
-- Name: TimetableEntry; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."TimetableEntry" (
    id text NOT NULL,
    class_id text NOT NULL,
    subject_id text NOT NULL,
    teacher_id text NOT NULL,
    school_id text NOT NULL,
    academic_session_id text NOT NULL,
    "timeSlotId" text NOT NULL,
    day_of_week public."DayOfWeek" NOT NULL,
    room text,
    notes text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."TimetableEntry" OWNER TO neondb_owner;

--
-- Name: Topic; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Topic" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    "order" integer NOT NULL,
    subject_id text NOT NULL,
    school_id text NOT NULL,
    academic_session_id text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_by text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    instructions text
);


ALTER TABLE public."Topic" OWNER TO neondb_owner;

--
-- Name: User; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."User" (
    id text NOT NULL,
    school_id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone_number text NOT NULL,
    display_picture jsonb,
    gender public."Gender" DEFAULT 'other'::public."Gender" NOT NULL,
    otp text DEFAULT ''::text,
    otp_expires_at timestamp(3) without time zone,
    is_email_verified boolean DEFAULT true,
    is_otp_verified boolean DEFAULT true,
    role public."Roles" DEFAULT 'student'::public."Roles" NOT NULL,
    status public."UserStatus" DEFAULT 'active'::public."UserStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "filesUploadedThisMonth" integer DEFAULT 0 NOT NULL,
    "lastFileResetDate" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "lastTokenResetDateAllTime" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "maxFileSizeMB" integer DEFAULT 100 NOT NULL,
    "maxFilesPerMonth" integer DEFAULT 10 NOT NULL,
    "maxMessagesPerWeek" integer DEFAULT 100 NOT NULL,
    "maxStorageMB" integer DEFAULT 500 NOT NULL,
    "maxTokensPerDay" integer DEFAULT 50000 NOT NULL,
    "maxTokensPerWeek" integer DEFAULT 50000 NOT NULL,
    "messagesSentThisWeek" integer DEFAULT 0 NOT NULL,
    "tokensUsedAllTime" integer DEFAULT 0 NOT NULL,
    "tokensUsedThisDay" integer DEFAULT 0 NOT NULL,
    "tokensUsedThisWeek" integer DEFAULT 0 NOT NULL,
    "totalFilesUploadedAllTime" integer DEFAULT 0 NOT NULL,
    "totalStorageUsedMB" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."User" OWNER TO neondb_owner;

--
-- Name: UserSettings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."UserSettings" (
    id text NOT NULL,
    user_id text NOT NULL,
    school_id text NOT NULL,
    push_notifications boolean DEFAULT true NOT NULL,
    email_notifications boolean DEFAULT true NOT NULL,
    assessment_reminders boolean DEFAULT true NOT NULL,
    grade_notifications boolean DEFAULT true NOT NULL,
    announcement_notifications boolean DEFAULT false NOT NULL,
    dark_mode boolean DEFAULT false NOT NULL,
    sound_effects boolean DEFAULT true NOT NULL,
    haptic_feedback boolean DEFAULT true NOT NULL,
    auto_save boolean DEFAULT true NOT NULL,
    offline_mode boolean DEFAULT false NOT NULL,
    profile_visibility text DEFAULT 'classmates'::text NOT NULL,
    show_contact_info boolean DEFAULT true NOT NULL,
    show_academic_progress boolean DEFAULT true NOT NULL,
    data_sharing boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."UserSettings" OWNER TO neondb_owner;

--
-- Name: VideoContent; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."VideoContent" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    url text NOT NULL,
    "schoolId" text,
    "platformId" text NOT NULL,
    "uploadedById" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    topic_id text,
    duration text,
    size text,
    status text DEFAULT 'published'::text NOT NULL,
    thumbnail jsonb,
    views integer DEFAULT 0 NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public."VideoContent" OWNER TO neondb_owner;

--
-- Name: Wallet; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Wallet" (
    id text NOT NULL,
    school_id text NOT NULL,
    balance double precision DEFAULT 0 NOT NULL,
    currency text DEFAULT 'NGN'::text NOT NULL,
    wallet_type public."WalletType" DEFAULT 'SCHOOL_WALLET'::public."WalletType" NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    last_updated timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "financeId" text
);


ALTER TABLE public."Wallet" OWNER TO neondb_owner;

--
-- Name: WalletTransaction; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."WalletTransaction" (
    id text NOT NULL,
    wallet_id text NOT NULL,
    transaction_type public."WalletTransactionType" NOT NULL,
    amount double precision NOT NULL,
    description text NOT NULL,
    reference text,
    status public."WalletTransactionStatus" DEFAULT 'PENDING'::public."WalletTransactionStatus" NOT NULL,
    metadata jsonb,
    processed_at timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."WalletTransaction" OWNER TO neondb_owner;

--
-- Name: _LibraryResponseOptions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."_LibraryResponseOptions" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_LibraryResponseOptions" OWNER TO neondb_owner;

--
-- Name: _ResponseOptions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."_ResponseOptions" (
    "A" text NOT NULL,
    "B" text NOT NULL
);


ALTER TABLE public."_ResponseOptions" OWNER TO neondb_owner;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO neondb_owner;

--
-- Name: Class classId; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Class" ALTER COLUMN "classId" SET DEFAULT nextval('public."Class_classId_seq"'::regclass);


--
-- Data for Name: AcademicSession; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."AcademicSession" (id, school_id, academic_year, start_year, end_year, term, start_date, end_date, status, is_current, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: AccessControlAuditLog; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."AccessControlAuditLog" (id, "entityType", "entityId", action, "performedById", "performedByRole", "schoolId", "platformId", changes, reason, "createdAt") FROM stdin;
\.


--
-- Data for Name: Achievement; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Achievement" (id, school_id, academic_session_id, title, description, type, icon_url, points, is_active, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Assessment; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Assessment" (id, title, description, duration, "createdAt", "updatedAt", topic_id, "order", academic_session_id, allow_review, auto_submit, created_by, end_date, grading_type, instructions, is_published, is_result_released, max_attempts, passing_score, published_at, result_released_at, school_id, show_correct_answers, show_feedback, shuffle_options, shuffle_questions, start_date, tags, time_limit, total_points, status, subject_id, assessment_type, submissions, student_can_view_grading) FROM stdin;
\.


--
-- Data for Name: AssessmentAnalytics; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."AssessmentAnalytics" (id, assessment_id, total_attempts, total_students, average_score, average_time, pass_rate, question_stats, daily_attempts, hourly_attempts, completion_rate, abandonment_rate, last_updated, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: AssessmentAttempt; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."AssessmentAttempt" (id, assessment_id, student_id, school_id, academic_session_id, attempt_number, status, started_at, submitted_at, time_spent, total_score, max_score, percentage, passed, is_graded, graded_at, graded_by, overall_feedback, grade_letter, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: AssessmentCorrectAnswer; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."AssessmentCorrectAnswer" (id, question_id, answer_text, answer_number, answer_date, option_ids, answer_json, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: AssessmentOption; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."AssessmentOption" (id, question_id, option_text, "order", is_correct, image_url, audio_url, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: AssessmentQuestion; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."AssessmentQuestion" (id, assessment_id, question_text, question_type, "order", points, is_required, time_limit, image_url, image_s3_key, audio_url, video_url, allow_multiple_attempts, show_hint, hint_text, min_length, max_length, min_value, max_value, explanation, difficulty_level, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: AssessmentResponse; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."AssessmentResponse" (id, attempt_id, question_id, student_id, text_answer, numeric_answer, date_answer, selected_options, file_urls, is_correct, points_earned, max_points, time_spent, feedback, is_graded, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: AssessmentSubmission; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."AssessmentSubmission" (id, assessment_id, student_id, school_id, academic_session_id, submission_type, content, attachment_url, attachment_type, status, submitted_at, late_submission, word_count, file_size, total_score, max_score, percentage, passed, is_graded, graded_at, graded_by, feedback, grade_letter, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Assignment; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Assignment" (id, title, description, "createdAt", "updatedAt", topic_id, "order", academic_session_id, allow_late_submission, assignment_type, attachment_type, attachment_url, auto_grade, created_by, difficulty_level, due_date, grading_rubric_id, instructions, is_published, late_penalty, max_score, published_at, school_id, time_limit, status) FROM stdin;
\.


--
-- Data for Name: AssignmentGrade; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."AssignmentGrade" (id, assignment_id, submission_id, student_id, teacher_id, school_id, academic_session_id, score, max_score, percentage, letter_grade, feedback, comments, rubric_scores, status, graded_at, returned_at, grading_time, is_final, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: AssignmentSubmission; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."AssignmentSubmission" (id, assignment_id, student_id, school_id, academic_session_id, content, attachment_url, attachment_type, status, submitted_at, late_submission, word_count, file_size, "createdAt", "updatedAt", "topicId") FROM stdin;
\.


--
-- Data for Name: AttendanceRecord; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."AttendanceRecord" (id, attendance_session_id, student_id, school_id, academic_session_id, class_id, status, marked_at, marked_by, reason, is_excused, excuse_note, parent_notified, parent_notified_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: AttendanceSession; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."AttendanceSession" (id, school_id, academic_session_id, class_id, teacher_id, date, session_type, status, total_students, present_count, absent_count, late_count, excused_count, attendance_rate, notes, submitted_at, approved_at, approved_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: AttendanceSettings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."AttendanceSettings" (id, school_id, academic_session_id, late_threshold_minutes, auto_mark_absent_minutes, require_excuse_note, parent_notification_enabled, attendance_tracking_enabled, minimum_attendance_rate, max_consecutive_absences, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: AttendanceSummary; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."AttendanceSummary" (id, school_id, academic_session_id, class_id, student_id, period_type, period_start, period_end, total_days, present_days, absent_days, late_days, excused_days, attendance_rate, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: ChatAnalytics; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."ChatAnalytics" (id, school_id, material_id, user_id, total_conversations, total_messages, total_tokens_used, average_response_time_ms, average_relevance_score, most_used_chunks, popular_questions, date, daily_usage, weekly_usage, monthly_usage, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ChatContext; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."ChatContext" (id, conversation_id, message_id, chunk_id, school_id, relevance_score, context_type, position_in_context, "createdAt") FROM stdin;
\.


--
-- Data for Name: ChatConversation; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."ChatConversation" (id, user_id, school_id, material_id, title, status, system_prompt, context_summary, total_messages, last_activity, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ChatMessage; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."ChatMessage" (id, conversation_id, user_id, school_id, material_id, role, content, message_type, model_used, tokens_used, response_time_ms, context_chunks, context_summary, is_edited, edited_at, parent_message_id, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Class; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Class" (id, "classId", name, "schoolId", academic_session_id, "classTeacherId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Developer; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Developer" (id, name, email, password, role, note, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: DeviceToken; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."DeviceToken" (id, token, "deviceType", user_id, school_id, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Document; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Document" (id, secure_url, public_id) FROM stdin;
\.


--
-- Data for Name: DocumentChunk; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."DocumentChunk" (id, material_processing_id, material_id, school_id, content, chunk_type, page_number, section_title, embedding, embedding_model, token_count, word_count, order_index, keywords, summary, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ExamBody; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."ExamBody" (id, name, "fullName", code, description, "logoUrl", "websiteUrl", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ExamBodyAssessment; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."ExamBodyAssessment" (id, "examBodyId", "subjectId", "yearId", title, description, instructions, "assessmentType", duration, "totalPoints", "passingScore", "maxAttempts", "allowReview", "shuffleQuestions", "shuffleOptions", "showCorrectAnswers", "showFeedback", "showExplanation", status, "isPublished", "publishedAt", "createdAt", "updatedAt", "platformId") FROM stdin;
\.


--
-- Data for Name: ExamBodyAssessmentAttempt; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."ExamBodyAssessmentAttempt" (id, "assessmentId", "userId", "attemptNumber", status, "startedAt", "submittedAt", "timeSpent", "totalScore", "maxScore", percentage, passed, "isGraded", "gradedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ExamBodyAssessmentCorrectAnswer; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."ExamBodyAssessmentCorrectAnswer" (id, "questionId", "answerText", "answerNumber", "answerDate", "optionIds", "answerJson", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ExamBodyAssessmentOption; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."ExamBodyAssessmentOption" (id, "questionId", "optionText", "order", "isCorrect", "imageUrl", "audioUrl", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ExamBodyAssessmentQuestion; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."ExamBodyAssessmentQuestion" (id, "assessmentId", "questionText", "questionType", "imageUrl", "audioUrl", "videoUrl", points, "order", "isRequired", explanation, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ExamBodyAssessmentResponse; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."ExamBodyAssessmentResponse" (id, "attemptId", "questionId", "userId", "textAnswer", "numericAnswer", "dateAnswer", "selectedOptions", "fileUrls", "answerJson", "isCorrect", "pointsEarned", "maxPoints", feedback, "isGraded", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ExamBodySubject; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."ExamBodySubject" (id, "examBodyId", name, code, description, "iconUrl", "order", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ExamBodyYear; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."ExamBodyYear" (id, "examBodyId", year, description, "startDate", "endDate", "order", status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Finance; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Finance" (id, school_id, total_revenue, outstanding_fee, amount_withdrawn, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: GradingRubric; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."GradingRubric" (id, name, description, school_id, academic_session_id, created_by, criteria, total_points, scale_type, is_template, is_active, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LibraryAssessment; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryAssessment" (id, "platformId", "subjectId", "topicId", "createdById", title, description, instructions, "assessmentType", "gradingType", status, duration, "timeLimit", "startDate", "endDate", "maxAttempts", "allowReview", "autoSubmit", "totalPoints", "passingScore", "showCorrectAnswers", "showFeedback", "studentCanViewGrading", "shuffleQuestions", "shuffleOptions", "isPublished", "publishedAt", "isResultReleased", "resultReleasedAt", tags, "order", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LibraryAssessmentAnalytics; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryAssessmentAnalytics" (id, "assessmentId", "totalAttempts", "totalUsers", "averageScore", "averageTime", "passRate", "questionStats", "dailyAttempts", "hourlyAttempts", "completionRate", "abandonmentRate", "lastUpdated", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LibraryAssessmentAttempt; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryAssessmentAttempt" (id, "assessmentId", "userId", "attemptNumber", status, "startedAt", "submittedAt", "timeSpent", "totalScore", "maxScore", percentage, passed, "isGraded", "gradedAt", "gradedBy", "overallFeedback", "gradeLetter", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LibraryAssessmentCorrectAnswer; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryAssessmentCorrectAnswer" (id, "questionId", "answerText", "answerNumber", "answerDate", "optionIds", "answerJson", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LibraryAssessmentOption; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryAssessmentOption" (id, "questionId", "optionText", "order", "isCorrect", "imageUrl", "audioUrl", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LibraryAssessmentQuestion; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryAssessmentQuestion" (id, "assessmentId", "questionText", "questionType", "order", points, "isRequired", "timeLimit", "imageUrl", "imageS3Key", "audioUrl", "videoUrl", "allowMultipleAttempts", "showHint", "hintText", "minLength", "maxLength", "minValue", "maxValue", explanation, "difficultyLevel", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LibraryAssessmentResponse; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryAssessmentResponse" (id, "attemptId", "questionId", "userId", "textAnswer", "numericAnswer", "dateAnswer", "selectedOptions", "fileUrls", "isCorrect", "pointsEarned", "maxPoints", "timeSpent", feedback, "isGraded", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LibraryAssignment; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryAssignment" (id, "platformId", "subjectId", "topicId", "uploadedById", title, description, "assignmentType", instructions, "attachmentUrl", "attachmentS3Key", "dueDate", "maxScore", "allowLateSubmission", "latePenalty", status, "order", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LibraryClass; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryClass" (id, name, "order", "createdAt", "updatedAt") FROM stdin;
cml68teik0000u5vle00rmqxi	KG-1	1	2026-02-03 06:54:04.987	2026-02-03 06:54:04.987
cml68tjyx0001u5vlnh6hrq99	KG-2	2	2026-02-03 06:54:12.057	2026-02-03 06:54:12.057
cml68tvqv0002u5vlce4cts52	Pry-1	3	2026-02-03 06:54:27.319	2026-02-03 06:54:27.319
cml68tzq50003u5vlixeua8n5	Pry-2	4	2026-02-03 06:54:32.477	2026-02-03 06:54:32.477
cml68u3qv0004u5vlu62wizjo	Pry-3	5	2026-02-03 06:54:37.687	2026-02-03 06:54:37.687
cml68u7gi0005u5vlsmxjoqmq	Pry-4	6	2026-02-03 06:54:42.498	2026-02-03 06:54:42.498
cml68ubpt0006u5vl1q6eanq1	Pry-5	7	2026-02-03 06:54:48.017	2026-02-03 06:54:48.017
cml68uhpa0007u5vlx4eia2fo	Pry-6	8	2026-02-03 06:54:55.774	2026-02-03 06:54:55.774
cml68up6a0008u5vl40nuhzax	JSS-1	9	2026-02-03 06:55:05.457	2026-02-03 06:55:05.457
cml68utzu0009u5vl3ro1gwkr	JSS-2	10	2026-02-03 06:55:11.706	2026-02-03 06:55:11.706
cml68uxwo000au5vlsb68c5si	JSS-3	11	2026-02-03 06:55:16.776	2026-02-03 06:55:16.776
cml68v45h000bu5vlxo5n44o9	SS-1	12	2026-02-03 06:55:24.869	2026-02-03 06:55:24.869
cml68v92g000cu5vl0pucczbz	SS-2	13	2026-02-03 06:55:31.24	2026-02-03 06:55:31.24
cml68vduz000du5vl79qd0te2	SS-3	14	2026-02-03 06:55:37.451	2026-02-03 06:55:37.451
\.


--
-- Data for Name: LibraryComment; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryComment" (id, "platformId", "subjectId", "topicId", "commentedById", "userId", content, "parentCommentId", "isEdited", "editedAt", "isDeleted", "deletedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LibraryGeneralMaterial; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryGeneralMaterial" (id, "platformId", "uploadedById", title, description, author, isbn, publisher, "materialType", url, "s3Key", "sizeBytes", "pageCount", "thumbnailUrl", "thumbnailS3Key", price, currency, "isFree", "isAvailable", "subjectId", "isAiEnabled", "processingStatus", status, "order", views, downloads, "salesCount", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LibraryGeneralMaterialChapter; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryGeneralMaterialChapter" (id, "materialId", "platformId", title, description, "pageStart", "pageEnd", "order", "isAiEnabled", "isProcessed", "chunkCount", "createdAt", "updatedAt", "chapterStatus") FROM stdin;
\.


--
-- Data for Name: LibraryGeneralMaterialChapterFile; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryGeneralMaterialChapterFile" (id, "chapterId", "platformId", "uploadedById", "fileName", "fileType", url, "s3Key", "sizeBytes", "pageCount", title, description, "order", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LibraryGeneralMaterialChatContext; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryGeneralMaterialChatContext" (id, "conversationId", "chunkId", "materialId", "relevanceScore", "createdAt") FROM stdin;
\.


--
-- Data for Name: LibraryGeneralMaterialChatConversation; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryGeneralMaterialChatConversation" (id, "userId", "materialId", "platformId", title, status, "systemPrompt", "contextSummary", "totalMessages", "lastActivity", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LibraryGeneralMaterialChatMessage; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryGeneralMaterialChatMessage" (id, "conversationId", "materialId", "userId", role, content, "tokensUsed", model, "referencedChunks", "createdAt") FROM stdin;
\.


--
-- Data for Name: LibraryGeneralMaterialChunk; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryGeneralMaterialChunk" (id, "materialId", "chapterId", "processingId", "platformId", content, "chunkType", "pageNumber", "sectionTitle", embedding, "embeddingModel", "tokenCount", "wordCount", "orderIndex", keywords, summary, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LibraryGeneralMaterialClass; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryGeneralMaterialClass" (id, "materialId", "classId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LibraryGeneralMaterialProcessing; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryGeneralMaterialProcessing" (id, "materialId", "platformId", status, "totalChunks", "processedChunks", "failedChunks", "processingStartedAt", "processingCompletedAt", "errorMessage", "retryCount", "vectorDatabaseId", "embeddingModel", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LibraryGeneralMaterialPurchase; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryGeneralMaterialPurchase" (id, "materialId", "userId", "platformId", price, currency, "paymentMethod", "transactionId", status, "purchasedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LibraryLink; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryLink" (id, "platformId", "subjectId", "topicId", "uploadedById", title, description, url, "linkType", "thumbnailUrl", domain, status, "order", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LibraryMaterial; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryMaterial" (id, "platformId", "subjectId", "topicId", "uploadedById", title, description, "materialType", url, "s3Key", "sizeBytes", "pageCount", status, "order", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LibraryPermissionDefinition; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryPermissionDefinition" (id, code, name, description, "createdAt", "updatedAt") FROM stdin;
cml68lta60003wxvlkfjmm8yk	manage_library_users	Manage All Users	To be able to manage all users under a library	2026-02-03 06:48:10.878	2026-02-03 06:48:10.878
\.


--
-- Data for Name: LibraryPlatform; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryPlatform" (id, name, slug, description, status, "createdAt", "updatedAt") FROM stdin;
cml680odd0000wxvlzumocems	Smart Edu Hub	Smart Edu Hub's-global-library	Official Smart Edu Hub's public content library for West Africa.	active	2026-02-03 06:31:44.737	2026-02-03 06:31:44.737
\.


--
-- Data for Name: LibraryResource; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryResource" (id, title, description, "resourceType", url, "schoolId", "platformId", "uploadedById", "createdAt", "updatedAt", topic_id, format, status, "order") FROM stdin;
\.


--
-- Data for Name: LibraryResourceAccess; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryResourceAccess" (id, "platformId", "schoolId", "subjectId", "topicId", "videoId", "materialId", "assessmentId", "resourceType", "accessLevel", "grantedById", "grantedAt", "expiresAt", "isActive", notes, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LibraryResourceUser; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryResourceUser" (id, "platformId", email, password, first_name, last_name, phone_number, role, "userType", status, "createdAt", "updatedAt", "permissionLevel", permissions) FROM stdin;
cml680ojy0001wxvlxcr56e7j	cml680odd0000wxvlzumocems	hello@smart-edu-hub.com	$argon2id$v=19$m=65536,t=3,p=4$e0aQ2uy70lyu8THrSebyjQ$oopCq+M+qv2xyP36D6PtVRnbZLwVJIBlHTeA+V8Jcy4	Smart Edu Hub	Owner	\N	admin	libraryresourceowner	active	2026-02-03 06:31:44.973	2026-02-03 06:31:44.973	\N	{}
cml68167p0002wxvlxc5psjph	cml680odd0000wxvlzumocems	maximus@smart-edu-hub.com	$argon2id$v=19$m=65536,t=3,p=4$XWthvuhg9nDvCIscq1hjsQ$RdG5JXaLzeL4R9kfEODUy0UNv77aCsmXHIGm8feu0Wc	Mayowa	Oluwaremi	+2348146694787	admin	libraryresourceowner	active	2026-02-03 06:32:07.861	2026-02-03 06:50:48.216	\N	{manage_library_users}
\.


--
-- Data for Name: LibrarySubject; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibrarySubject" (id, "platformId", "classId", name, code, color, description, "thumbnailUrl", "thumbnailKey", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LibraryTopic; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryTopic" (id, "platformId", "subjectId", title, description, "order", is_active, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LibraryVideoLesson; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryVideoLesson" (id, "platformId", "subjectId", "topicId", "uploadedById", title, description, "videoUrl", "videoS3Key", "thumbnailUrl", "thumbnailS3Key", "durationSeconds", "sizeBytes", views, status, "order", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LibraryVideoView; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryVideoView" (id, "videoId", "userId", "libraryResourceUserId", "viewedAt") FROM stdin;
\.


--
-- Data for Name: LibraryVideoWatchHistory; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LibraryVideoWatchHistory" (id, "videoId", "userId", "libraryResourceUserId", "schoolId", "classId", "userRole", "watchedAt", "watchDurationSeconds", "videoDurationSeconds", "completionPercentage", "isCompleted", "lastWatchPosition", "watchCount", "deviceType", platform, "userAgent", "ipAddress", "referrerSource", "referrerUrl", "videoQuality", "bufferingEvents", "playbackSpeed", "sessionId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LiveClass; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LiveClass" (id, title, description, "meetingUrl", "startTime", "endTime", "schoolId", "platformId", "createdById", "createdAt", "updatedAt", topic_id, "maxParticipants", status, "order") FROM stdin;
\.


--
-- Data for Name: MaterialProcessing; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."MaterialProcessing" (id, material_id, school_id, status, total_chunks, processed_chunks, failed_chunks, processing_started_at, processing_completed_at, error_message, retry_count, vector_database_id, embedding_model, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Notification" (id, school_id, academic_session_id, title, description, type, "comingUpOn", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Organisation; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Organisation" (id, name, email, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PDFMaterial; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."PDFMaterial" (id, title, description, url, "schoolId", "platformId", "uploadedById", "createdAt", "updatedAt", topic_id, downloads, size, status, "order", "fileType", "originalName", "materialId") FROM stdin;
\.


--
-- Data for Name: Parent; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Parent" (id, school_id, user_id, parent_id, occupation, employer, address, emergency_contact, relationship, is_primary_contact, status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Payment" (id, finance_id, academic_session_id, student_id, class_id, payment_for, amount, payment_type, transaction_type, payment_date, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PlatformSubscriptionPlan; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."PlatformSubscriptionPlan" (id, school_id, name, plan_type, description, cost, currency, billing_cycle, is_active, max_allowed_teachers, max_allowed_students, max_allowed_classes, max_allowed_subjects, allowed_document_types, max_file_size_mb, max_document_uploads_per_student_per_day, max_document_uploads_per_teacher_per_day, max_storage_mb, max_files_per_month, max_daily_tokens_per_user, max_weekly_tokens_per_user, max_monthly_tokens_per_user, max_total_tokens_per_school, max_messages_per_week, max_conversations_per_user, max_chat_sessions_per_user, features, start_date, end_date, status, auto_renew, created_at, updated_at, is_template) FROM stdin;
\.


--
-- Data for Name: Result; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Result" (id, school_id, academic_session_id, student_id, class_id, subject_results, total_ca_score, total_exam_score, total_score, total_max_score, overall_percentage, overall_grade, class_position, total_students, released_by, released_at, is_final, released_by_school_admin, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: School; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."School" (id, school_name, school_email, school_phone, school_address, school_type, school_ownership, status, school_icon, "cacId", "utilityBillId", "taxClearanceId", "platformId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: SchoolResourceAccess; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."SchoolResourceAccess" (id, "schoolId", "libraryResourceAccessId", "userId", "roleType", "classId", "subjectId", "topicId", "videoId", "materialId", "assessmentId", "resourceType", "accessLevel", "grantedById", "grantedAt", "expiresAt", "isActive", notes, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: SchoolResourceExclusion; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."SchoolResourceExclusion" (id, "schoolId", "platformId", "subjectId", "excludedById", "createdAt") FROM stdin;
\.


--
-- Data for Name: SchoolVideoView; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."SchoolVideoView" (id, "videoId", "userId", "viewedAt") FROM stdin;
\.


--
-- Data for Name: SchoolVideoWatchHistory; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."SchoolVideoWatchHistory" (id, "videoId", "userId", "schoolId", "classId", "userRole", "watchedAt", "watchDurationSeconds", "videoDurationSeconds", "completionPercentage", "isCompleted", "lastWatchPosition", "watchCount", "deviceType", platform, "userAgent", "referrerSource", "referrerUrl", "videoQuality", "bufferingEvents", "playbackSpeed", "sessionId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Student; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Student" (id, school_id, academic_session_id, user_id, student_id, admission_number, date_of_birth, admission_date, current_class_id, guardian_name, guardian_phone, guardian_email, address, emergency_contact, blood_group, medical_conditions, allergies, previous_school, academic_level, parent_id, status, "createdAt", "updatedAt", city, country, postal_code, state) FROM stdin;
\.


--
-- Data for Name: StudentAchievement; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."StudentAchievement" (id, student_id, achievement_id, earned_date, points_earned, is_visible, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: StudentPerformance; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."StudentPerformance" (id, student_id, class_id, academic_session_id, term, year, total_score, max_score, "position", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Subject; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Subject" (id, name, code, color, description, "schoolId", academic_session_id, "createdAt", "updatedAt", "classId", thumbnail) FROM stdin;
\.


--
-- Data for Name: SupportInfo; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."SupportInfo" (id, school_id, faq_count, last_faq_update, faq_categories, email_support, phone_support, live_chat_available, response_time, app_version, build_number, last_updated, minimum_ios_version, minimum_android_version, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Teacher; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Teacher" (id, email, first_name, last_name, phone_number, display_picture, school_id, academic_session_id, user_id, gender, role, password, teacher_id, employee_number, qualification, specialization, years_of_experience, hire_date, salary, department, is_class_teacher, status, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: TeacherResourceAccess; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."TeacherResourceAccess" (id, "teacherId", "schoolId", "schoolResourceAccessId", "studentId", "classId", "subjectId", "topicId", "videoId", "materialId", "assessmentId", "resourceType", "accessLevel", "grantedAt", "expiresAt", "isActive", notes, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: TeacherResourceExclusion; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."TeacherResourceExclusion" (id, "teacherId", "schoolId", "subjectId", "resourceType", "resourceId", "classId", "studentId", "createdAt", "libraryClassId") FROM stdin;
\.


--
-- Data for Name: TeacherSubject; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."TeacherSubject" (id, "teacherId", "subjectId") FROM stdin;
\.


--
-- Data for Name: TimeSlot; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."TimeSlot" (id, "startTime", "endTime", label, "order", "schoolId", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: TimetableEntry; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."TimetableEntry" (id, class_id, subject_id, teacher_id, school_id, academic_session_id, "timeSlotId", day_of_week, room, notes, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Topic; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Topic" (id, title, description, "order", subject_id, school_id, academic_session_id, is_active, created_by, "createdAt", "updatedAt", instructions) FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."User" (id, school_id, email, password, first_name, last_name, phone_number, display_picture, gender, otp, otp_expires_at, is_email_verified, is_otp_verified, role, status, "createdAt", "updatedAt", "filesUploadedThisMonth", "lastFileResetDate", "lastTokenResetDateAllTime", "maxFileSizeMB", "maxFilesPerMonth", "maxMessagesPerWeek", "maxStorageMB", "maxTokensPerDay", "maxTokensPerWeek", "messagesSentThisWeek", "tokensUsedAllTime", "tokensUsedThisDay", "tokensUsedThisWeek", "totalFilesUploadedAllTime", "totalStorageUsedMB") FROM stdin;
\.


--
-- Data for Name: UserSettings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."UserSettings" (id, user_id, school_id, push_notifications, email_notifications, assessment_reminders, grade_notifications, announcement_notifications, dark_mode, sound_effects, haptic_feedback, auto_save, offline_mode, profile_visibility, show_contact_info, show_academic_progress, data_sharing, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: VideoContent; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."VideoContent" (id, title, description, url, "schoolId", "platformId", "uploadedById", "createdAt", "updatedAt", topic_id, duration, size, status, thumbnail, views, "order") FROM stdin;
\.


--
-- Data for Name: Wallet; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Wallet" (id, school_id, balance, currency, wallet_type, is_active, last_updated, "createdAt", "updatedAt", "financeId") FROM stdin;
\.


--
-- Data for Name: WalletTransaction; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."WalletTransaction" (id, wallet_id, transaction_type, amount, description, reference, status, metadata, processed_at, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: _LibraryResponseOptions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."_LibraryResponseOptions" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _ResponseOptions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."_ResponseOptions" ("A", "B") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
0ca30aa2-17be-4f69-8b46-844351172c55	246cb9c7d5d5204239c2d2afa40eff86f99cd4b284cf7e57915695f2ad64f94c	2026-02-03 06:17:54.632773+00	20260120122050_init	\N	\N	2026-02-03 06:17:51.196582+00	1
aa8eb12b-d860-41ca-b2c4-7215655eda3b	612a3831a480593307b69f4dc8ee814406180cc1f04a667af1be260865602a4e	2026-02-03 06:17:56.193785+00	20260120222511_add_school_video_view_tracking	\N	\N	2026-02-03 06:17:55.10052+00	1
d5cf9c9d-c0b2-4deb-9dc6-550347b28ba4	ec7a54464741d512eae90abbcde8015e06803e1f2cac17fa4c70e01f39ecc78c	2026-02-03 06:17:57.980297+00	20260121133712_remove_library_chapters	\N	\N	2026-02-03 06:17:56.630448+00	1
f772f399-357d-4e7d-9de4-f741d3abf9ef	633830c903ed4dec90aa3415775d11addf5a05aa93f05ac6f2de88e0a12757fc	2026-02-03 06:17:59.660154+00	20260121220419_add_many_to_many_material_classes	\N	\N	2026-02-03 06:17:58.594859+00	1
67b64ac4-9579-4082-b567-ab527de32e33	6c6f2dd427f4d5baaa6c306745e4f8b45af2fa8f7053620d4285927cc807306d	2026-02-03 06:18:01.329791+00	20260122144057_addded_chapter_status	\N	\N	2026-02-03 06:18:00.11976+00	1
ea4aa3c7-ce1a-471c-8ad2-70092e083829	9c4ff19b7775727e4e34e90b742dc6c9188298b5e5c0e34ae30912602e0d64cd	2026-02-03 06:18:02.9828+00	20260123_baseline	\N	\N	2026-02-03 06:18:01.769899+00	1
23afc0e8-b220-4f60-809b-d160d0f1aaf7	210cbaff45992bdfe5a250cda929bf1c81ef52a4df30380e3491b021c319b4a7	2026-02-03 06:18:04.554504+00	20260125140000_add_exam_body_assessment_platform_id	\N	\N	2026-02-03 06:18:03.424672+00	1
0c6cf17e-4d68-4438-85de-f0c41c78a19c	f7e3c7d0abd4bc044c78dfbe1782ee36d19f91029bd641a6c349dd986a3f3b70	2026-02-03 06:18:06.350627+00	20260201225047_add_multi_level_access_control	\N	\N	2026-02-03 06:18:04.985412+00	1
3afc1608-74ae-4861-9ccf-8787d97d67b2	e8daec196bc3f95b5255bb8384a3abbaa91fc06c58b2a8b8a9b2a174d90d23c2	2026-02-03 06:18:07.923848+00	20260202102546_add_school_and_teacher_exclusions	\N	\N	2026-02-03 06:18:06.803672+00	1
4bf1de4e-704b-4b57-8844-5241ef6a9b93	79bd5ee51f1d7fbdbe0ea4e03df57f11c52b1148ab46ac1d01464eee5b49e40d	2026-02-03 06:18:09.377789+00	20260202133834_add_library_permissions_and_user_permission_level	\N	\N	2026-02-03 06:18:08.3374+00	1
4f53f47c-428e-4388-9802-b11c8feb28e1	4bbd259b7733529936ef10fe35420001eb14cdf0f6b80b57fd469593c332735a	2026-02-03 06:18:11.130788+00	20260202140000_add_teacher_exclusion_library_class_id	\N	\N	2026-02-03 06:18:09.7981+00	1
\.


--
-- Name: Class_classId_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public."Class_classId_seq"', 1, false);


--
-- Name: AcademicSession AcademicSession_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AcademicSession"
    ADD CONSTRAINT "AcademicSession_pkey" PRIMARY KEY (id);


--
-- Name: AccessControlAuditLog AccessControlAuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AccessControlAuditLog"
    ADD CONSTRAINT "AccessControlAuditLog_pkey" PRIMARY KEY (id);


--
-- Name: Achievement Achievement_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Achievement"
    ADD CONSTRAINT "Achievement_pkey" PRIMARY KEY (id);


--
-- Name: AssessmentAnalytics AssessmentAnalytics_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssessmentAnalytics"
    ADD CONSTRAINT "AssessmentAnalytics_pkey" PRIMARY KEY (id);


--
-- Name: AssessmentAttempt AssessmentAttempt_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssessmentAttempt"
    ADD CONSTRAINT "AssessmentAttempt_pkey" PRIMARY KEY (id);


--
-- Name: AssessmentCorrectAnswer AssessmentCorrectAnswer_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssessmentCorrectAnswer"
    ADD CONSTRAINT "AssessmentCorrectAnswer_pkey" PRIMARY KEY (id);


--
-- Name: AssessmentOption AssessmentOption_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssessmentOption"
    ADD CONSTRAINT "AssessmentOption_pkey" PRIMARY KEY (id);


--
-- Name: AssessmentQuestion AssessmentQuestion_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssessmentQuestion"
    ADD CONSTRAINT "AssessmentQuestion_pkey" PRIMARY KEY (id);


--
-- Name: AssessmentResponse AssessmentResponse_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssessmentResponse"
    ADD CONSTRAINT "AssessmentResponse_pkey" PRIMARY KEY (id);


--
-- Name: AssessmentSubmission AssessmentSubmission_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssessmentSubmission"
    ADD CONSTRAINT "AssessmentSubmission_pkey" PRIMARY KEY (id);


--
-- Name: Assessment Assessment_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Assessment"
    ADD CONSTRAINT "Assessment_pkey" PRIMARY KEY (id);


--
-- Name: AssignmentGrade AssignmentGrade_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssignmentGrade"
    ADD CONSTRAINT "AssignmentGrade_pkey" PRIMARY KEY (id);


--
-- Name: AssignmentSubmission AssignmentSubmission_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssignmentSubmission"
    ADD CONSTRAINT "AssignmentSubmission_pkey" PRIMARY KEY (id);


--
-- Name: Assignment Assignment_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_pkey" PRIMARY KEY (id);


--
-- Name: AttendanceRecord AttendanceRecord_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AttendanceRecord"
    ADD CONSTRAINT "AttendanceRecord_pkey" PRIMARY KEY (id);


--
-- Name: AttendanceSession AttendanceSession_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AttendanceSession"
    ADD CONSTRAINT "AttendanceSession_pkey" PRIMARY KEY (id);


--
-- Name: AttendanceSettings AttendanceSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AttendanceSettings"
    ADD CONSTRAINT "AttendanceSettings_pkey" PRIMARY KEY (id);


--
-- Name: AttendanceSummary AttendanceSummary_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AttendanceSummary"
    ADD CONSTRAINT "AttendanceSummary_pkey" PRIMARY KEY (id);


--
-- Name: ChatAnalytics ChatAnalytics_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ChatAnalytics"
    ADD CONSTRAINT "ChatAnalytics_pkey" PRIMARY KEY (id);


--
-- Name: ChatContext ChatContext_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ChatContext"
    ADD CONSTRAINT "ChatContext_pkey" PRIMARY KEY (id);


--
-- Name: ChatConversation ChatConversation_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ChatConversation"
    ADD CONSTRAINT "ChatConversation_pkey" PRIMARY KEY (id);


--
-- Name: ChatMessage ChatMessage_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ChatMessage"
    ADD CONSTRAINT "ChatMessage_pkey" PRIMARY KEY (id);


--
-- Name: Class Class_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Class"
    ADD CONSTRAINT "Class_pkey" PRIMARY KEY (id);


--
-- Name: Developer Developer_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Developer"
    ADD CONSTRAINT "Developer_pkey" PRIMARY KEY (id);


--
-- Name: DeviceToken DeviceToken_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."DeviceToken"
    ADD CONSTRAINT "DeviceToken_pkey" PRIMARY KEY (id);


--
-- Name: DocumentChunk DocumentChunk_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."DocumentChunk"
    ADD CONSTRAINT "DocumentChunk_pkey" PRIMARY KEY (id);


--
-- Name: Document Document_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Document"
    ADD CONSTRAINT "Document_pkey" PRIMARY KEY (id);


--
-- Name: ExamBodyAssessmentAttempt ExamBodyAssessmentAttempt_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ExamBodyAssessmentAttempt"
    ADD CONSTRAINT "ExamBodyAssessmentAttempt_pkey" PRIMARY KEY (id);


--
-- Name: ExamBodyAssessmentCorrectAnswer ExamBodyAssessmentCorrectAnswer_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ExamBodyAssessmentCorrectAnswer"
    ADD CONSTRAINT "ExamBodyAssessmentCorrectAnswer_pkey" PRIMARY KEY (id);


--
-- Name: ExamBodyAssessmentOption ExamBodyAssessmentOption_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ExamBodyAssessmentOption"
    ADD CONSTRAINT "ExamBodyAssessmentOption_pkey" PRIMARY KEY (id);


--
-- Name: ExamBodyAssessmentQuestion ExamBodyAssessmentQuestion_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ExamBodyAssessmentQuestion"
    ADD CONSTRAINT "ExamBodyAssessmentQuestion_pkey" PRIMARY KEY (id);


--
-- Name: ExamBodyAssessmentResponse ExamBodyAssessmentResponse_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ExamBodyAssessmentResponse"
    ADD CONSTRAINT "ExamBodyAssessmentResponse_pkey" PRIMARY KEY (id);


--
-- Name: ExamBodyAssessment ExamBodyAssessment_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ExamBodyAssessment"
    ADD CONSTRAINT "ExamBodyAssessment_pkey" PRIMARY KEY (id);


--
-- Name: ExamBodySubject ExamBodySubject_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ExamBodySubject"
    ADD CONSTRAINT "ExamBodySubject_pkey" PRIMARY KEY (id);


--
-- Name: ExamBodyYear ExamBodyYear_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ExamBodyYear"
    ADD CONSTRAINT "ExamBodyYear_pkey" PRIMARY KEY (id);


--
-- Name: ExamBody ExamBody_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ExamBody"
    ADD CONSTRAINT "ExamBody_pkey" PRIMARY KEY (id);


--
-- Name: Finance Finance_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Finance"
    ADD CONSTRAINT "Finance_pkey" PRIMARY KEY (id);


--
-- Name: GradingRubric GradingRubric_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."GradingRubric"
    ADD CONSTRAINT "GradingRubric_pkey" PRIMARY KEY (id);


--
-- Name: LibraryAssessmentAnalytics LibraryAssessmentAnalytics_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryAssessmentAnalytics"
    ADD CONSTRAINT "LibraryAssessmentAnalytics_pkey" PRIMARY KEY (id);


--
-- Name: LibraryAssessmentAttempt LibraryAssessmentAttempt_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryAssessmentAttempt"
    ADD CONSTRAINT "LibraryAssessmentAttempt_pkey" PRIMARY KEY (id);


--
-- Name: LibraryAssessmentCorrectAnswer LibraryAssessmentCorrectAnswer_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryAssessmentCorrectAnswer"
    ADD CONSTRAINT "LibraryAssessmentCorrectAnswer_pkey" PRIMARY KEY (id);


--
-- Name: LibraryAssessmentOption LibraryAssessmentOption_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryAssessmentOption"
    ADD CONSTRAINT "LibraryAssessmentOption_pkey" PRIMARY KEY (id);


--
-- Name: LibraryAssessmentQuestion LibraryAssessmentQuestion_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryAssessmentQuestion"
    ADD CONSTRAINT "LibraryAssessmentQuestion_pkey" PRIMARY KEY (id);


--
-- Name: LibraryAssessmentResponse LibraryAssessmentResponse_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryAssessmentResponse"
    ADD CONSTRAINT "LibraryAssessmentResponse_pkey" PRIMARY KEY (id);


--
-- Name: LibraryAssessment LibraryAssessment_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryAssessment"
    ADD CONSTRAINT "LibraryAssessment_pkey" PRIMARY KEY (id);


--
-- Name: LibraryAssignment LibraryAssignment_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryAssignment"
    ADD CONSTRAINT "LibraryAssignment_pkey" PRIMARY KEY (id);


--
-- Name: LibraryClass LibraryClass_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryClass"
    ADD CONSTRAINT "LibraryClass_pkey" PRIMARY KEY (id);


--
-- Name: LibraryComment LibraryComment_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryComment"
    ADD CONSTRAINT "LibraryComment_pkey" PRIMARY KEY (id);


--
-- Name: LibraryGeneralMaterialChapterFile LibraryGeneralMaterialChapterFile_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialChapterFile"
    ADD CONSTRAINT "LibraryGeneralMaterialChapterFile_pkey" PRIMARY KEY (id);


--
-- Name: LibraryGeneralMaterialChapter LibraryGeneralMaterialChapter_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialChapter"
    ADD CONSTRAINT "LibraryGeneralMaterialChapter_pkey" PRIMARY KEY (id);


--
-- Name: LibraryGeneralMaterialChatContext LibraryGeneralMaterialChatContext_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialChatContext"
    ADD CONSTRAINT "LibraryGeneralMaterialChatContext_pkey" PRIMARY KEY (id);


--
-- Name: LibraryGeneralMaterialChatConversation LibraryGeneralMaterialChatConversation_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialChatConversation"
    ADD CONSTRAINT "LibraryGeneralMaterialChatConversation_pkey" PRIMARY KEY (id);


--
-- Name: LibraryGeneralMaterialChatMessage LibraryGeneralMaterialChatMessage_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialChatMessage"
    ADD CONSTRAINT "LibraryGeneralMaterialChatMessage_pkey" PRIMARY KEY (id);


--
-- Name: LibraryGeneralMaterialChunk LibraryGeneralMaterialChunk_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialChunk"
    ADD CONSTRAINT "LibraryGeneralMaterialChunk_pkey" PRIMARY KEY (id);


--
-- Name: LibraryGeneralMaterialClass LibraryGeneralMaterialClass_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialClass"
    ADD CONSTRAINT "LibraryGeneralMaterialClass_pkey" PRIMARY KEY (id);


--
-- Name: LibraryGeneralMaterialProcessing LibraryGeneralMaterialProcessing_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialProcessing"
    ADD CONSTRAINT "LibraryGeneralMaterialProcessing_pkey" PRIMARY KEY (id);


--
-- Name: LibraryGeneralMaterialPurchase LibraryGeneralMaterialPurchase_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialPurchase"
    ADD CONSTRAINT "LibraryGeneralMaterialPurchase_pkey" PRIMARY KEY (id);


--
-- Name: LibraryGeneralMaterial LibraryGeneralMaterial_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterial"
    ADD CONSTRAINT "LibraryGeneralMaterial_pkey" PRIMARY KEY (id);


--
-- Name: LibraryLink LibraryLink_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryLink"
    ADD CONSTRAINT "LibraryLink_pkey" PRIMARY KEY (id);


--
-- Name: LibraryMaterial LibraryMaterial_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryMaterial"
    ADD CONSTRAINT "LibraryMaterial_pkey" PRIMARY KEY (id);


--
-- Name: LibraryPermissionDefinition LibraryPermissionDefinition_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryPermissionDefinition"
    ADD CONSTRAINT "LibraryPermissionDefinition_pkey" PRIMARY KEY (id);


--
-- Name: LibraryPlatform LibraryPlatform_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryPlatform"
    ADD CONSTRAINT "LibraryPlatform_pkey" PRIMARY KEY (id);


--
-- Name: LibraryResourceAccess LibraryResourceAccess_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryResourceAccess"
    ADD CONSTRAINT "LibraryResourceAccess_pkey" PRIMARY KEY (id);


--
-- Name: LibraryResourceUser LibraryResourceUser_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryResourceUser"
    ADD CONSTRAINT "LibraryResourceUser_pkey" PRIMARY KEY (id);


--
-- Name: LibraryResource LibraryResource_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryResource"
    ADD CONSTRAINT "LibraryResource_pkey" PRIMARY KEY (id);


--
-- Name: LibrarySubject LibrarySubject_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibrarySubject"
    ADD CONSTRAINT "LibrarySubject_pkey" PRIMARY KEY (id);


--
-- Name: LibraryTopic LibraryTopic_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryTopic"
    ADD CONSTRAINT "LibraryTopic_pkey" PRIMARY KEY (id);


--
-- Name: LibraryVideoLesson LibraryVideoLesson_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryVideoLesson"
    ADD CONSTRAINT "LibraryVideoLesson_pkey" PRIMARY KEY (id);


--
-- Name: LibraryVideoView LibraryVideoView_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryVideoView"
    ADD CONSTRAINT "LibraryVideoView_pkey" PRIMARY KEY (id);


--
-- Name: LibraryVideoWatchHistory LibraryVideoWatchHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryVideoWatchHistory"
    ADD CONSTRAINT "LibraryVideoWatchHistory_pkey" PRIMARY KEY (id);


--
-- Name: LiveClass LiveClass_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LiveClass"
    ADD CONSTRAINT "LiveClass_pkey" PRIMARY KEY (id);


--
-- Name: MaterialProcessing MaterialProcessing_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."MaterialProcessing"
    ADD CONSTRAINT "MaterialProcessing_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: Organisation Organisation_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Organisation"
    ADD CONSTRAINT "Organisation_pkey" PRIMARY KEY (id);


--
-- Name: PDFMaterial PDFMaterial_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."PDFMaterial"
    ADD CONSTRAINT "PDFMaterial_pkey" PRIMARY KEY (id);


--
-- Name: Parent Parent_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Parent"
    ADD CONSTRAINT "Parent_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: PlatformSubscriptionPlan PlatformSubscriptionPlan_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."PlatformSubscriptionPlan"
    ADD CONSTRAINT "PlatformSubscriptionPlan_pkey" PRIMARY KEY (id);


--
-- Name: Result Result_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Result"
    ADD CONSTRAINT "Result_pkey" PRIMARY KEY (id);


--
-- Name: SchoolResourceAccess SchoolResourceAccess_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."SchoolResourceAccess"
    ADD CONSTRAINT "SchoolResourceAccess_pkey" PRIMARY KEY (id);


--
-- Name: SchoolResourceExclusion SchoolResourceExclusion_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."SchoolResourceExclusion"
    ADD CONSTRAINT "SchoolResourceExclusion_pkey" PRIMARY KEY (id);


--
-- Name: SchoolVideoView SchoolVideoView_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."SchoolVideoView"
    ADD CONSTRAINT "SchoolVideoView_pkey" PRIMARY KEY (id);


--
-- Name: SchoolVideoWatchHistory SchoolVideoWatchHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."SchoolVideoWatchHistory"
    ADD CONSTRAINT "SchoolVideoWatchHistory_pkey" PRIMARY KEY (id);


--
-- Name: School School_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_pkey" PRIMARY KEY (id);


--
-- Name: StudentAchievement StudentAchievement_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."StudentAchievement"
    ADD CONSTRAINT "StudentAchievement_pkey" PRIMARY KEY (id);


--
-- Name: StudentPerformance StudentPerformance_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."StudentPerformance"
    ADD CONSTRAINT "StudentPerformance_pkey" PRIMARY KEY (id);


--
-- Name: Student Student_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_pkey" PRIMARY KEY (id);


--
-- Name: Subject Subject_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Subject"
    ADD CONSTRAINT "Subject_pkey" PRIMARY KEY (id);


--
-- Name: SupportInfo SupportInfo_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."SupportInfo"
    ADD CONSTRAINT "SupportInfo_pkey" PRIMARY KEY (id);


--
-- Name: TeacherResourceAccess TeacherResourceAccess_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TeacherResourceAccess"
    ADD CONSTRAINT "TeacherResourceAccess_pkey" PRIMARY KEY (id);


--
-- Name: TeacherResourceExclusion TeacherResourceExclusion_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TeacherResourceExclusion"
    ADD CONSTRAINT "TeacherResourceExclusion_pkey" PRIMARY KEY (id);


--
-- Name: TeacherSubject TeacherSubject_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TeacherSubject"
    ADD CONSTRAINT "TeacherSubject_pkey" PRIMARY KEY (id);


--
-- Name: Teacher Teacher_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Teacher"
    ADD CONSTRAINT "Teacher_pkey" PRIMARY KEY (id);


--
-- Name: TimeSlot TimeSlot_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TimeSlot"
    ADD CONSTRAINT "TimeSlot_pkey" PRIMARY KEY (id);


--
-- Name: TimetableEntry TimetableEntry_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TimetableEntry"
    ADD CONSTRAINT "TimetableEntry_pkey" PRIMARY KEY (id);


--
-- Name: Topic Topic_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Topic"
    ADD CONSTRAINT "Topic_pkey" PRIMARY KEY (id);


--
-- Name: UserSettings UserSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."UserSettings"
    ADD CONSTRAINT "UserSettings_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: VideoContent VideoContent_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."VideoContent"
    ADD CONSTRAINT "VideoContent_pkey" PRIMARY KEY (id);


--
-- Name: WalletTransaction WalletTransaction_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."WalletTransaction"
    ADD CONSTRAINT "WalletTransaction_pkey" PRIMARY KEY (id);


--
-- Name: Wallet Wallet_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Wallet"
    ADD CONSTRAINT "Wallet_pkey" PRIMARY KEY (id);


--
-- Name: _LibraryResponseOptions _LibraryResponseOptions_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."_LibraryResponseOptions"
    ADD CONSTRAINT "_LibraryResponseOptions_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _ResponseOptions _ResponseOptions_AB_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."_ResponseOptions"
    ADD CONSTRAINT "_ResponseOptions_AB_pkey" PRIMARY KEY ("A", "B");


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: AcademicSession_academic_year_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AcademicSession_academic_year_idx" ON public."AcademicSession" USING btree (academic_year);


--
-- Name: AcademicSession_school_id_academic_year_term_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "AcademicSession_school_id_academic_year_term_key" ON public."AcademicSession" USING btree (school_id, academic_year, term);


--
-- Name: AcademicSession_school_id_is_current_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AcademicSession_school_id_is_current_idx" ON public."AcademicSession" USING btree (school_id, is_current);


--
-- Name: AcademicSession_start_year_end_year_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AcademicSession_start_year_end_year_idx" ON public."AcademicSession" USING btree (start_year, end_year);


--
-- Name: AccessControlAuditLog_createdAt_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AccessControlAuditLog_createdAt_idx" ON public."AccessControlAuditLog" USING btree ("createdAt");


--
-- Name: AccessControlAuditLog_entityType_entityId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AccessControlAuditLog_entityType_entityId_idx" ON public."AccessControlAuditLog" USING btree ("entityType", "entityId");


--
-- Name: AccessControlAuditLog_performedById_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AccessControlAuditLog_performedById_idx" ON public."AccessControlAuditLog" USING btree ("performedById");


--
-- Name: AccessControlAuditLog_platformId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AccessControlAuditLog_platformId_idx" ON public."AccessControlAuditLog" USING btree ("platformId");


--
-- Name: AccessControlAuditLog_schoolId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AccessControlAuditLog_schoolId_idx" ON public."AccessControlAuditLog" USING btree ("schoolId");


--
-- Name: Achievement_academic_session_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Achievement_academic_session_id_idx" ON public."Achievement" USING btree (academic_session_id);


--
-- Name: Achievement_school_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Achievement_school_id_idx" ON public."Achievement" USING btree (school_id);


--
-- Name: Achievement_type_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Achievement_type_idx" ON public."Achievement" USING btree (type);


--
-- Name: AssessmentAnalytics_assessment_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AssessmentAnalytics_assessment_id_idx" ON public."AssessmentAnalytics" USING btree (assessment_id);


--
-- Name: AssessmentAnalytics_assessment_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "AssessmentAnalytics_assessment_id_key" ON public."AssessmentAnalytics" USING btree (assessment_id);


--
-- Name: AssessmentAttempt_assessment_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AssessmentAttempt_assessment_id_idx" ON public."AssessmentAttempt" USING btree (assessment_id);


--
-- Name: AssessmentAttempt_assessment_id_student_id_attempt_number_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "AssessmentAttempt_assessment_id_student_id_attempt_number_key" ON public."AssessmentAttempt" USING btree (assessment_id, student_id, attempt_number);


--
-- Name: AssessmentAttempt_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AssessmentAttempt_status_idx" ON public."AssessmentAttempt" USING btree (status);


--
-- Name: AssessmentAttempt_student_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AssessmentAttempt_student_id_idx" ON public."AssessmentAttempt" USING btree (student_id);


--
-- Name: AssessmentAttempt_submitted_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AssessmentAttempt_submitted_at_idx" ON public."AssessmentAttempt" USING btree (submitted_at);


--
-- Name: AssessmentCorrectAnswer_question_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AssessmentCorrectAnswer_question_id_idx" ON public."AssessmentCorrectAnswer" USING btree (question_id);


--
-- Name: AssessmentOption_question_id_order_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AssessmentOption_question_id_order_idx" ON public."AssessmentOption" USING btree (question_id, "order");


--
-- Name: AssessmentQuestion_assessment_id_order_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AssessmentQuestion_assessment_id_order_idx" ON public."AssessmentQuestion" USING btree (assessment_id, "order");


--
-- Name: AssessmentQuestion_question_type_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AssessmentQuestion_question_type_idx" ON public."AssessmentQuestion" USING btree (question_type);


--
-- Name: AssessmentResponse_attempt_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AssessmentResponse_attempt_id_idx" ON public."AssessmentResponse" USING btree (attempt_id);


--
-- Name: AssessmentResponse_attempt_id_question_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "AssessmentResponse_attempt_id_question_id_key" ON public."AssessmentResponse" USING btree (attempt_id, question_id);


--
-- Name: AssessmentResponse_question_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AssessmentResponse_question_id_idx" ON public."AssessmentResponse" USING btree (question_id);


--
-- Name: AssessmentResponse_student_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AssessmentResponse_student_id_idx" ON public."AssessmentResponse" USING btree (student_id);


--
-- Name: AssessmentSubmission_assessment_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AssessmentSubmission_assessment_id_idx" ON public."AssessmentSubmission" USING btree (assessment_id);


--
-- Name: AssessmentSubmission_assessment_id_student_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "AssessmentSubmission_assessment_id_student_id_key" ON public."AssessmentSubmission" USING btree (assessment_id, student_id);


--
-- Name: AssessmentSubmission_school_id_academic_session_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AssessmentSubmission_school_id_academic_session_id_idx" ON public."AssessmentSubmission" USING btree (school_id, academic_session_id);


--
-- Name: AssessmentSubmission_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AssessmentSubmission_status_idx" ON public."AssessmentSubmission" USING btree (status);


--
-- Name: AssessmentSubmission_student_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AssessmentSubmission_student_id_idx" ON public."AssessmentSubmission" USING btree (student_id);


--
-- Name: AssessmentSubmission_submitted_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AssessmentSubmission_submitted_at_idx" ON public."AssessmentSubmission" USING btree (submitted_at);


--
-- Name: Assessment_assessment_type_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Assessment_assessment_type_idx" ON public."Assessment" USING btree (assessment_type);


--
-- Name: Assessment_created_by_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Assessment_created_by_idx" ON public."Assessment" USING btree (created_by);


--
-- Name: Assessment_is_published_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Assessment_is_published_idx" ON public."Assessment" USING btree (is_published);


--
-- Name: Assessment_school_id_academic_session_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Assessment_school_id_academic_session_id_idx" ON public."Assessment" USING btree (school_id, academic_session_id);


--
-- Name: Assessment_start_date_end_date_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Assessment_start_date_end_date_idx" ON public."Assessment" USING btree (start_date, end_date);


--
-- Name: Assessment_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Assessment_status_idx" ON public."Assessment" USING btree (status);


--
-- Name: Assessment_topic_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Assessment_topic_id_idx" ON public."Assessment" USING btree (topic_id);


--
-- Name: AssignmentGrade_assignment_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AssignmentGrade_assignment_id_idx" ON public."AssignmentGrade" USING btree (assignment_id);


--
-- Name: AssignmentGrade_graded_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AssignmentGrade_graded_at_idx" ON public."AssignmentGrade" USING btree (graded_at);


--
-- Name: AssignmentGrade_school_id_academic_session_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AssignmentGrade_school_id_academic_session_id_idx" ON public."AssignmentGrade" USING btree (school_id, academic_session_id);


--
-- Name: AssignmentGrade_student_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AssignmentGrade_student_id_idx" ON public."AssignmentGrade" USING btree (student_id);


--
-- Name: AssignmentGrade_submission_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "AssignmentGrade_submission_id_key" ON public."AssignmentGrade" USING btree (submission_id);


--
-- Name: AssignmentGrade_teacher_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AssignmentGrade_teacher_id_idx" ON public."AssignmentGrade" USING btree (teacher_id);


--
-- Name: AssignmentSubmission_assignment_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AssignmentSubmission_assignment_id_idx" ON public."AssignmentSubmission" USING btree (assignment_id);


--
-- Name: AssignmentSubmission_assignment_id_student_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "AssignmentSubmission_assignment_id_student_id_key" ON public."AssignmentSubmission" USING btree (assignment_id, student_id);


--
-- Name: AssignmentSubmission_school_id_academic_session_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AssignmentSubmission_school_id_academic_session_id_idx" ON public."AssignmentSubmission" USING btree (school_id, academic_session_id);


--
-- Name: AssignmentSubmission_student_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AssignmentSubmission_student_id_idx" ON public."AssignmentSubmission" USING btree (student_id);


--
-- Name: AssignmentSubmission_submitted_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AssignmentSubmission_submitted_at_idx" ON public."AssignmentSubmission" USING btree (submitted_at);


--
-- Name: Assignment_created_by_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Assignment_created_by_idx" ON public."Assignment" USING btree (created_by);


--
-- Name: Assignment_due_date_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Assignment_due_date_idx" ON public."Assignment" USING btree (due_date);


--
-- Name: Assignment_is_published_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Assignment_is_published_idx" ON public."Assignment" USING btree (is_published);


--
-- Name: Assignment_school_id_academic_session_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Assignment_school_id_academic_session_id_idx" ON public."Assignment" USING btree (school_id, academic_session_id);


--
-- Name: Assignment_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Assignment_status_idx" ON public."Assignment" USING btree (status);


--
-- Name: Assignment_topic_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Assignment_topic_id_idx" ON public."Assignment" USING btree (topic_id);


--
-- Name: AttendanceRecord_attendance_session_id_student_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "AttendanceRecord_attendance_session_id_student_id_key" ON public."AttendanceRecord" USING btree (attendance_session_id, student_id);


--
-- Name: AttendanceRecord_class_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AttendanceRecord_class_id_idx" ON public."AttendanceRecord" USING btree (class_id);


--
-- Name: AttendanceRecord_marked_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AttendanceRecord_marked_at_idx" ON public."AttendanceRecord" USING btree (marked_at);


--
-- Name: AttendanceRecord_school_id_academic_session_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AttendanceRecord_school_id_academic_session_id_idx" ON public."AttendanceRecord" USING btree (school_id, academic_session_id);


--
-- Name: AttendanceRecord_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AttendanceRecord_status_idx" ON public."AttendanceRecord" USING btree (status);


--
-- Name: AttendanceRecord_student_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AttendanceRecord_student_id_idx" ON public."AttendanceRecord" USING btree (student_id);


--
-- Name: AttendanceSession_attendance_rate_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AttendanceSession_attendance_rate_idx" ON public."AttendanceSession" USING btree (attendance_rate);


--
-- Name: AttendanceSession_class_id_date_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AttendanceSession_class_id_date_idx" ON public."AttendanceSession" USING btree (class_id, date);


--
-- Name: AttendanceSession_class_id_date_session_type_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "AttendanceSession_class_id_date_session_type_key" ON public."AttendanceSession" USING btree (class_id, date, session_type);


--
-- Name: AttendanceSession_date_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AttendanceSession_date_idx" ON public."AttendanceSession" USING btree (date);


--
-- Name: AttendanceSession_school_id_academic_session_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AttendanceSession_school_id_academic_session_id_idx" ON public."AttendanceSession" USING btree (school_id, academic_session_id);


--
-- Name: AttendanceSession_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AttendanceSession_status_idx" ON public."AttendanceSession" USING btree (status);


--
-- Name: AttendanceSession_teacher_id_date_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AttendanceSession_teacher_id_date_idx" ON public."AttendanceSession" USING btree (teacher_id, date);


--
-- Name: AttendanceSettings_school_id_academic_session_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AttendanceSettings_school_id_academic_session_id_idx" ON public."AttendanceSettings" USING btree (school_id, academic_session_id);


--
-- Name: AttendanceSettings_school_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "AttendanceSettings_school_id_key" ON public."AttendanceSettings" USING btree (school_id);


--
-- Name: AttendanceSummary_attendance_rate_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AttendanceSummary_attendance_rate_idx" ON public."AttendanceSummary" USING btree (attendance_rate);


--
-- Name: AttendanceSummary_class_id_period_type_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AttendanceSummary_class_id_period_type_idx" ON public."AttendanceSummary" USING btree (class_id, period_type);


--
-- Name: AttendanceSummary_period_start_period_end_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AttendanceSummary_period_start_period_end_idx" ON public."AttendanceSummary" USING btree (period_start, period_end);


--
-- Name: AttendanceSummary_school_id_academic_session_id_class_id_st_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "AttendanceSummary_school_id_academic_session_id_class_id_st_key" ON public."AttendanceSummary" USING btree (school_id, academic_session_id, class_id, student_id, period_type, period_start);


--
-- Name: AttendanceSummary_school_id_academic_session_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AttendanceSummary_school_id_academic_session_id_idx" ON public."AttendanceSummary" USING btree (school_id, academic_session_id);


--
-- Name: AttendanceSummary_student_id_period_type_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "AttendanceSummary_student_id_period_type_idx" ON public."AttendanceSummary" USING btree (student_id, period_type);


--
-- Name: ChatAnalytics_date_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ChatAnalytics_date_idx" ON public."ChatAnalytics" USING btree (date);


--
-- Name: ChatAnalytics_material_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ChatAnalytics_material_id_idx" ON public."ChatAnalytics" USING btree (material_id);


--
-- Name: ChatAnalytics_school_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ChatAnalytics_school_id_idx" ON public."ChatAnalytics" USING btree (school_id);


--
-- Name: ChatAnalytics_user_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ChatAnalytics_user_id_idx" ON public."ChatAnalytics" USING btree (user_id);


--
-- Name: ChatContext_chunk_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ChatContext_chunk_id_idx" ON public."ChatContext" USING btree (chunk_id);


--
-- Name: ChatContext_conversation_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ChatContext_conversation_id_idx" ON public."ChatContext" USING btree (conversation_id);


--
-- Name: ChatContext_message_id_chunk_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "ChatContext_message_id_chunk_id_key" ON public."ChatContext" USING btree (message_id, chunk_id);


--
-- Name: ChatContext_message_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ChatContext_message_id_idx" ON public."ChatContext" USING btree (message_id);


--
-- Name: ChatContext_relevance_score_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ChatContext_relevance_score_idx" ON public."ChatContext" USING btree (relevance_score);


--
-- Name: ChatContext_school_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ChatContext_school_id_idx" ON public."ChatContext" USING btree (school_id);


--
-- Name: ChatConversation_last_activity_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ChatConversation_last_activity_idx" ON public."ChatConversation" USING btree (last_activity);


--
-- Name: ChatConversation_material_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ChatConversation_material_id_idx" ON public."ChatConversation" USING btree (material_id);


--
-- Name: ChatConversation_school_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ChatConversation_school_id_idx" ON public."ChatConversation" USING btree (school_id);


--
-- Name: ChatConversation_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ChatConversation_status_idx" ON public."ChatConversation" USING btree (status);


--
-- Name: ChatConversation_user_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ChatConversation_user_id_idx" ON public."ChatConversation" USING btree (user_id);


--
-- Name: ChatMessage_conversation_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ChatMessage_conversation_id_idx" ON public."ChatMessage" USING btree (conversation_id);


--
-- Name: ChatMessage_createdAt_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ChatMessage_createdAt_idx" ON public."ChatMessage" USING btree ("createdAt");


--
-- Name: ChatMessage_material_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ChatMessage_material_id_idx" ON public."ChatMessage" USING btree (material_id);


--
-- Name: ChatMessage_role_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ChatMessage_role_idx" ON public."ChatMessage" USING btree (role);


--
-- Name: ChatMessage_school_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ChatMessage_school_id_idx" ON public."ChatMessage" USING btree (school_id);


--
-- Name: ChatMessage_user_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ChatMessage_user_id_idx" ON public."ChatMessage" USING btree (user_id);


--
-- Name: Class_classId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Class_classId_idx" ON public."Class" USING btree ("classId");


--
-- Name: Class_schoolId_academic_session_id_classId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "Class_schoolId_academic_session_id_classId_key" ON public."Class" USING btree ("schoolId", academic_session_id, "classId");


--
-- Name: Class_schoolId_academic_session_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Class_schoolId_academic_session_id_idx" ON public."Class" USING btree ("schoolId", academic_session_id);


--
-- Name: Developer_email_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "Developer_email_key" ON public."Developer" USING btree (email);


--
-- Name: DeviceToken_isActive_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "DeviceToken_isActive_idx" ON public."DeviceToken" USING btree ("isActive");


--
-- Name: DeviceToken_school_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "DeviceToken_school_id_idx" ON public."DeviceToken" USING btree (school_id);


--
-- Name: DeviceToken_token_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "DeviceToken_token_idx" ON public."DeviceToken" USING btree (token);


--
-- Name: DeviceToken_token_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "DeviceToken_token_key" ON public."DeviceToken" USING btree (token);


--
-- Name: DeviceToken_user_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "DeviceToken_user_id_idx" ON public."DeviceToken" USING btree (user_id);


--
-- Name: DocumentChunk_chunk_type_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "DocumentChunk_chunk_type_idx" ON public."DocumentChunk" USING btree (chunk_type);


--
-- Name: DocumentChunk_createdAt_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "DocumentChunk_createdAt_idx" ON public."DocumentChunk" USING btree ("createdAt");


--
-- Name: DocumentChunk_material_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "DocumentChunk_material_id_idx" ON public."DocumentChunk" USING btree (material_id);


--
-- Name: DocumentChunk_order_index_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "DocumentChunk_order_index_idx" ON public."DocumentChunk" USING btree (order_index);


--
-- Name: DocumentChunk_page_number_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "DocumentChunk_page_number_idx" ON public."DocumentChunk" USING btree (page_number);


--
-- Name: DocumentChunk_school_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "DocumentChunk_school_id_idx" ON public."DocumentChunk" USING btree (school_id);


--
-- Name: ExamBodyAssessmentAttempt_assessmentId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ExamBodyAssessmentAttempt_assessmentId_idx" ON public."ExamBodyAssessmentAttempt" USING btree ("assessmentId");


--
-- Name: ExamBodyAssessmentAttempt_assessmentId_userId_attemptNumber_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "ExamBodyAssessmentAttempt_assessmentId_userId_attemptNumber_key" ON public."ExamBodyAssessmentAttempt" USING btree ("assessmentId", "userId", "attemptNumber");


--
-- Name: ExamBodyAssessmentAttempt_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ExamBodyAssessmentAttempt_status_idx" ON public."ExamBodyAssessmentAttempt" USING btree (status);


--
-- Name: ExamBodyAssessmentAttempt_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ExamBodyAssessmentAttempt_userId_idx" ON public."ExamBodyAssessmentAttempt" USING btree ("userId");


--
-- Name: ExamBodyAssessmentCorrectAnswer_questionId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ExamBodyAssessmentCorrectAnswer_questionId_idx" ON public."ExamBodyAssessmentCorrectAnswer" USING btree ("questionId");


--
-- Name: ExamBodyAssessmentOption_questionId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ExamBodyAssessmentOption_questionId_idx" ON public."ExamBodyAssessmentOption" USING btree ("questionId");


--
-- Name: ExamBodyAssessmentQuestion_assessmentId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ExamBodyAssessmentQuestion_assessmentId_idx" ON public."ExamBodyAssessmentQuestion" USING btree ("assessmentId");


--
-- Name: ExamBodyAssessmentQuestion_questionType_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ExamBodyAssessmentQuestion_questionType_idx" ON public."ExamBodyAssessmentQuestion" USING btree ("questionType");


--
-- Name: ExamBodyAssessmentResponse_attemptId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ExamBodyAssessmentResponse_attemptId_idx" ON public."ExamBodyAssessmentResponse" USING btree ("attemptId");


--
-- Name: ExamBodyAssessmentResponse_attemptId_questionId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "ExamBodyAssessmentResponse_attemptId_questionId_key" ON public."ExamBodyAssessmentResponse" USING btree ("attemptId", "questionId");


--
-- Name: ExamBodyAssessmentResponse_questionId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ExamBodyAssessmentResponse_questionId_idx" ON public."ExamBodyAssessmentResponse" USING btree ("questionId");


--
-- Name: ExamBodyAssessmentResponse_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ExamBodyAssessmentResponse_userId_idx" ON public."ExamBodyAssessmentResponse" USING btree ("userId");


--
-- Name: ExamBodyAssessment_examBodyId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ExamBodyAssessment_examBodyId_idx" ON public."ExamBodyAssessment" USING btree ("examBodyId");


--
-- Name: ExamBodyAssessment_isPublished_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ExamBodyAssessment_isPublished_idx" ON public."ExamBodyAssessment" USING btree ("isPublished");


--
-- Name: ExamBodyAssessment_platformId_examBodyId_subjectId_yearId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "ExamBodyAssessment_platformId_examBodyId_subjectId_yearId_key" ON public."ExamBodyAssessment" USING btree ("platformId", "examBodyId", "subjectId", "yearId");


--
-- Name: ExamBodyAssessment_platformId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ExamBodyAssessment_platformId_idx" ON public."ExamBodyAssessment" USING btree ("platformId");


--
-- Name: ExamBodyAssessment_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ExamBodyAssessment_status_idx" ON public."ExamBodyAssessment" USING btree (status);


--
-- Name: ExamBodyAssessment_subjectId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ExamBodyAssessment_subjectId_idx" ON public."ExamBodyAssessment" USING btree ("subjectId");


--
-- Name: ExamBodyAssessment_yearId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ExamBodyAssessment_yearId_idx" ON public."ExamBodyAssessment" USING btree ("yearId");


--
-- Name: ExamBodySubject_examBodyId_code_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "ExamBodySubject_examBodyId_code_key" ON public."ExamBodySubject" USING btree ("examBodyId", code);


--
-- Name: ExamBodySubject_examBodyId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ExamBodySubject_examBodyId_idx" ON public."ExamBodySubject" USING btree ("examBodyId");


--
-- Name: ExamBodySubject_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ExamBodySubject_status_idx" ON public."ExamBodySubject" USING btree (status);


--
-- Name: ExamBodyYear_examBodyId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ExamBodyYear_examBodyId_idx" ON public."ExamBodyYear" USING btree ("examBodyId");


--
-- Name: ExamBodyYear_examBodyId_year_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "ExamBodyYear_examBodyId_year_key" ON public."ExamBodyYear" USING btree ("examBodyId", year);


--
-- Name: ExamBodyYear_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ExamBodyYear_status_idx" ON public."ExamBodyYear" USING btree (status);


--
-- Name: ExamBody_code_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "ExamBody_code_key" ON public."ExamBody" USING btree (code);


--
-- Name: ExamBody_name_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "ExamBody_name_key" ON public."ExamBody" USING btree (name);


--
-- Name: Finance_school_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "Finance_school_id_key" ON public."Finance" USING btree (school_id);


--
-- Name: GradingRubric_created_by_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "GradingRubric_created_by_idx" ON public."GradingRubric" USING btree (created_by);


--
-- Name: GradingRubric_is_template_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "GradingRubric_is_template_idx" ON public."GradingRubric" USING btree (is_template);


--
-- Name: GradingRubric_school_id_academic_session_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "GradingRubric_school_id_academic_session_id_idx" ON public."GradingRubric" USING btree (school_id, academic_session_id);


--
-- Name: LibraryAssessmentAnalytics_assessmentId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryAssessmentAnalytics_assessmentId_idx" ON public."LibraryAssessmentAnalytics" USING btree ("assessmentId");


--
-- Name: LibraryAssessmentAnalytics_assessmentId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "LibraryAssessmentAnalytics_assessmentId_key" ON public."LibraryAssessmentAnalytics" USING btree ("assessmentId");


--
-- Name: LibraryAssessmentAttempt_assessmentId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryAssessmentAttempt_assessmentId_idx" ON public."LibraryAssessmentAttempt" USING btree ("assessmentId");


--
-- Name: LibraryAssessmentAttempt_assessmentId_userId_attemptNumber_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "LibraryAssessmentAttempt_assessmentId_userId_attemptNumber_key" ON public."LibraryAssessmentAttempt" USING btree ("assessmentId", "userId", "attemptNumber");


--
-- Name: LibraryAssessmentAttempt_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryAssessmentAttempt_status_idx" ON public."LibraryAssessmentAttempt" USING btree (status);


--
-- Name: LibraryAssessmentAttempt_submittedAt_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryAssessmentAttempt_submittedAt_idx" ON public."LibraryAssessmentAttempt" USING btree ("submittedAt");


--
-- Name: LibraryAssessmentAttempt_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryAssessmentAttempt_userId_idx" ON public."LibraryAssessmentAttempt" USING btree ("userId");


--
-- Name: LibraryAssessmentCorrectAnswer_questionId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryAssessmentCorrectAnswer_questionId_idx" ON public."LibraryAssessmentCorrectAnswer" USING btree ("questionId");


--
-- Name: LibraryAssessmentOption_questionId_order_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryAssessmentOption_questionId_order_idx" ON public."LibraryAssessmentOption" USING btree ("questionId", "order");


--
-- Name: LibraryAssessmentQuestion_assessmentId_order_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryAssessmentQuestion_assessmentId_order_idx" ON public."LibraryAssessmentQuestion" USING btree ("assessmentId", "order");


--
-- Name: LibraryAssessmentQuestion_questionType_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryAssessmentQuestion_questionType_idx" ON public."LibraryAssessmentQuestion" USING btree ("questionType");


--
-- Name: LibraryAssessmentResponse_attemptId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryAssessmentResponse_attemptId_idx" ON public."LibraryAssessmentResponse" USING btree ("attemptId");


--
-- Name: LibraryAssessmentResponse_attemptId_questionId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "LibraryAssessmentResponse_attemptId_questionId_key" ON public."LibraryAssessmentResponse" USING btree ("attemptId", "questionId");


--
-- Name: LibraryAssessmentResponse_questionId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryAssessmentResponse_questionId_idx" ON public."LibraryAssessmentResponse" USING btree ("questionId");


--
-- Name: LibraryAssessmentResponse_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryAssessmentResponse_userId_idx" ON public."LibraryAssessmentResponse" USING btree ("userId");


--
-- Name: LibraryAssessment_assessmentType_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryAssessment_assessmentType_idx" ON public."LibraryAssessment" USING btree ("assessmentType");


--
-- Name: LibraryAssessment_createdById_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryAssessment_createdById_idx" ON public."LibraryAssessment" USING btree ("createdById");


--
-- Name: LibraryAssessment_isPublished_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryAssessment_isPublished_idx" ON public."LibraryAssessment" USING btree ("isPublished");


--
-- Name: LibraryAssessment_platformId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryAssessment_platformId_idx" ON public."LibraryAssessment" USING btree ("platformId");


--
-- Name: LibraryAssessment_startDate_endDate_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryAssessment_startDate_endDate_idx" ON public."LibraryAssessment" USING btree ("startDate", "endDate");


--
-- Name: LibraryAssessment_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryAssessment_status_idx" ON public."LibraryAssessment" USING btree (status);


--
-- Name: LibraryAssessment_subjectId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryAssessment_subjectId_idx" ON public."LibraryAssessment" USING btree ("subjectId");


--
-- Name: LibraryAssessment_topicId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryAssessment_topicId_idx" ON public."LibraryAssessment" USING btree ("topicId");


--
-- Name: LibraryAssignment_dueDate_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryAssignment_dueDate_idx" ON public."LibraryAssignment" USING btree ("dueDate");


--
-- Name: LibraryAssignment_platformId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryAssignment_platformId_idx" ON public."LibraryAssignment" USING btree ("platformId");


--
-- Name: LibraryAssignment_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryAssignment_status_idx" ON public."LibraryAssignment" USING btree (status);


--
-- Name: LibraryAssignment_subjectId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryAssignment_subjectId_idx" ON public."LibraryAssignment" USING btree ("subjectId");


--
-- Name: LibraryAssignment_topicId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryAssignment_topicId_idx" ON public."LibraryAssignment" USING btree ("topicId");


--
-- Name: LibraryAssignment_uploadedById_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryAssignment_uploadedById_idx" ON public."LibraryAssignment" USING btree ("uploadedById");


--
-- Name: LibraryComment_commentedById_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryComment_commentedById_idx" ON public."LibraryComment" USING btree ("commentedById");


--
-- Name: LibraryComment_createdAt_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryComment_createdAt_idx" ON public."LibraryComment" USING btree ("createdAt");


--
-- Name: LibraryComment_isDeleted_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryComment_isDeleted_idx" ON public."LibraryComment" USING btree ("isDeleted");


--
-- Name: LibraryComment_parentCommentId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryComment_parentCommentId_idx" ON public."LibraryComment" USING btree ("parentCommentId");


--
-- Name: LibraryComment_platformId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryComment_platformId_idx" ON public."LibraryComment" USING btree ("platformId");


--
-- Name: LibraryComment_subjectId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryComment_subjectId_idx" ON public."LibraryComment" USING btree ("subjectId");


--
-- Name: LibraryComment_topicId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryComment_topicId_idx" ON public."LibraryComment" USING btree ("topicId");


--
-- Name: LibraryComment_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryComment_userId_idx" ON public."LibraryComment" USING btree ("userId");


--
-- Name: LibraryGeneralMaterialChapterFile_chapterId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialChapterFile_chapterId_idx" ON public."LibraryGeneralMaterialChapterFile" USING btree ("chapterId");


--
-- Name: LibraryGeneralMaterialChapterFile_order_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialChapterFile_order_idx" ON public."LibraryGeneralMaterialChapterFile" USING btree ("order");


--
-- Name: LibraryGeneralMaterialChapterFile_platformId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialChapterFile_platformId_idx" ON public."LibraryGeneralMaterialChapterFile" USING btree ("platformId");


--
-- Name: LibraryGeneralMaterialChapterFile_uploadedById_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialChapterFile_uploadedById_idx" ON public."LibraryGeneralMaterialChapterFile" USING btree ("uploadedById");


--
-- Name: LibraryGeneralMaterialChapter_chapterStatus_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialChapter_chapterStatus_idx" ON public."LibraryGeneralMaterialChapter" USING btree ("chapterStatus");


--
-- Name: LibraryGeneralMaterialChapter_isAiEnabled_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialChapter_isAiEnabled_idx" ON public."LibraryGeneralMaterialChapter" USING btree ("isAiEnabled");


--
-- Name: LibraryGeneralMaterialChapter_materialId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialChapter_materialId_idx" ON public."LibraryGeneralMaterialChapter" USING btree ("materialId");


--
-- Name: LibraryGeneralMaterialChapter_order_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialChapter_order_idx" ON public."LibraryGeneralMaterialChapter" USING btree ("order");


--
-- Name: LibraryGeneralMaterialChapter_platformId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialChapter_platformId_idx" ON public."LibraryGeneralMaterialChapter" USING btree ("platformId");


--
-- Name: LibraryGeneralMaterialChatContext_chunkId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialChatContext_chunkId_idx" ON public."LibraryGeneralMaterialChatContext" USING btree ("chunkId");


--
-- Name: LibraryGeneralMaterialChatContext_conversationId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialChatContext_conversationId_idx" ON public."LibraryGeneralMaterialChatContext" USING btree ("conversationId");


--
-- Name: LibraryGeneralMaterialChatContext_materialId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialChatContext_materialId_idx" ON public."LibraryGeneralMaterialChatContext" USING btree ("materialId");


--
-- Name: LibraryGeneralMaterialChatConversation_materialId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialChatConversation_materialId_idx" ON public."LibraryGeneralMaterialChatConversation" USING btree ("materialId");


--
-- Name: LibraryGeneralMaterialChatConversation_platformId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialChatConversation_platformId_idx" ON public."LibraryGeneralMaterialChatConversation" USING btree ("platformId");


--
-- Name: LibraryGeneralMaterialChatConversation_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialChatConversation_status_idx" ON public."LibraryGeneralMaterialChatConversation" USING btree (status);


--
-- Name: LibraryGeneralMaterialChatConversation_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialChatConversation_userId_idx" ON public."LibraryGeneralMaterialChatConversation" USING btree ("userId");


--
-- Name: LibraryGeneralMaterialChatMessage_conversationId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialChatMessage_conversationId_idx" ON public."LibraryGeneralMaterialChatMessage" USING btree ("conversationId");


--
-- Name: LibraryGeneralMaterialChatMessage_createdAt_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialChatMessage_createdAt_idx" ON public."LibraryGeneralMaterialChatMessage" USING btree ("createdAt");


--
-- Name: LibraryGeneralMaterialChatMessage_materialId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialChatMessage_materialId_idx" ON public."LibraryGeneralMaterialChatMessage" USING btree ("materialId");


--
-- Name: LibraryGeneralMaterialChatMessage_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialChatMessage_userId_idx" ON public."LibraryGeneralMaterialChatMessage" USING btree ("userId");


--
-- Name: LibraryGeneralMaterialChunk_chapterId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialChunk_chapterId_idx" ON public."LibraryGeneralMaterialChunk" USING btree ("chapterId");


--
-- Name: LibraryGeneralMaterialChunk_materialId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialChunk_materialId_idx" ON public."LibraryGeneralMaterialChunk" USING btree ("materialId");


--
-- Name: LibraryGeneralMaterialChunk_orderIndex_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialChunk_orderIndex_idx" ON public."LibraryGeneralMaterialChunk" USING btree ("orderIndex");


--
-- Name: LibraryGeneralMaterialChunk_platformId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialChunk_platformId_idx" ON public."LibraryGeneralMaterialChunk" USING btree ("platformId");


--
-- Name: LibraryGeneralMaterialChunk_processingId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialChunk_processingId_idx" ON public."LibraryGeneralMaterialChunk" USING btree ("processingId");


--
-- Name: LibraryGeneralMaterialClass_classId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialClass_classId_idx" ON public."LibraryGeneralMaterialClass" USING btree ("classId");


--
-- Name: LibraryGeneralMaterialClass_createdAt_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialClass_createdAt_idx" ON public."LibraryGeneralMaterialClass" USING btree ("createdAt");


--
-- Name: LibraryGeneralMaterialClass_materialId_classId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "LibraryGeneralMaterialClass_materialId_classId_key" ON public."LibraryGeneralMaterialClass" USING btree ("materialId", "classId");


--
-- Name: LibraryGeneralMaterialClass_materialId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialClass_materialId_idx" ON public."LibraryGeneralMaterialClass" USING btree ("materialId");


--
-- Name: LibraryGeneralMaterialProcessing_materialId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "LibraryGeneralMaterialProcessing_materialId_key" ON public."LibraryGeneralMaterialProcessing" USING btree ("materialId");


--
-- Name: LibraryGeneralMaterialProcessing_platformId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialProcessing_platformId_idx" ON public."LibraryGeneralMaterialProcessing" USING btree ("platformId");


--
-- Name: LibraryGeneralMaterialProcessing_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialProcessing_status_idx" ON public."LibraryGeneralMaterialProcessing" USING btree (status);


--
-- Name: LibraryGeneralMaterialPurchase_materialId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialPurchase_materialId_idx" ON public."LibraryGeneralMaterialPurchase" USING btree ("materialId");


--
-- Name: LibraryGeneralMaterialPurchase_platformId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialPurchase_platformId_idx" ON public."LibraryGeneralMaterialPurchase" USING btree ("platformId");


--
-- Name: LibraryGeneralMaterialPurchase_purchasedAt_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialPurchase_purchasedAt_idx" ON public."LibraryGeneralMaterialPurchase" USING btree ("purchasedAt");


--
-- Name: LibraryGeneralMaterialPurchase_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialPurchase_status_idx" ON public."LibraryGeneralMaterialPurchase" USING btree (status);


--
-- Name: LibraryGeneralMaterialPurchase_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterialPurchase_userId_idx" ON public."LibraryGeneralMaterialPurchase" USING btree ("userId");


--
-- Name: LibraryGeneralMaterial_createdAt_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterial_createdAt_idx" ON public."LibraryGeneralMaterial" USING btree ("createdAt");


--
-- Name: LibraryGeneralMaterial_isAiEnabled_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterial_isAiEnabled_idx" ON public."LibraryGeneralMaterial" USING btree ("isAiEnabled");


--
-- Name: LibraryGeneralMaterial_platformId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterial_platformId_idx" ON public."LibraryGeneralMaterial" USING btree ("platformId");


--
-- Name: LibraryGeneralMaterial_price_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterial_price_idx" ON public."LibraryGeneralMaterial" USING btree (price);


--
-- Name: LibraryGeneralMaterial_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterial_status_idx" ON public."LibraryGeneralMaterial" USING btree (status);


--
-- Name: LibraryGeneralMaterial_subjectId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterial_subjectId_idx" ON public."LibraryGeneralMaterial" USING btree ("subjectId");


--
-- Name: LibraryGeneralMaterial_uploadedById_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryGeneralMaterial_uploadedById_idx" ON public."LibraryGeneralMaterial" USING btree ("uploadedById");


--
-- Name: LibraryLink_platformId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryLink_platformId_idx" ON public."LibraryLink" USING btree ("platformId");


--
-- Name: LibraryLink_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryLink_status_idx" ON public."LibraryLink" USING btree (status);


--
-- Name: LibraryLink_subjectId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryLink_subjectId_idx" ON public."LibraryLink" USING btree ("subjectId");


--
-- Name: LibraryLink_topicId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryLink_topicId_idx" ON public."LibraryLink" USING btree ("topicId");


--
-- Name: LibraryLink_uploadedById_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryLink_uploadedById_idx" ON public."LibraryLink" USING btree ("uploadedById");


--
-- Name: LibraryMaterial_platformId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryMaterial_platformId_idx" ON public."LibraryMaterial" USING btree ("platformId");


--
-- Name: LibraryMaterial_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryMaterial_status_idx" ON public."LibraryMaterial" USING btree (status);


--
-- Name: LibraryMaterial_subjectId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryMaterial_subjectId_idx" ON public."LibraryMaterial" USING btree ("subjectId");


--
-- Name: LibraryMaterial_topicId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryMaterial_topicId_idx" ON public."LibraryMaterial" USING btree ("topicId");


--
-- Name: LibraryMaterial_uploadedById_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryMaterial_uploadedById_idx" ON public."LibraryMaterial" USING btree ("uploadedById");


--
-- Name: LibraryPermissionDefinition_code_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "LibraryPermissionDefinition_code_key" ON public."LibraryPermissionDefinition" USING btree (code);


--
-- Name: LibraryPlatform_name_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "LibraryPlatform_name_key" ON public."LibraryPlatform" USING btree (name);


--
-- Name: LibraryPlatform_slug_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "LibraryPlatform_slug_key" ON public."LibraryPlatform" USING btree (slug);


--
-- Name: LibraryResourceAccess_expiresAt_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryResourceAccess_expiresAt_idx" ON public."LibraryResourceAccess" USING btree ("expiresAt");


--
-- Name: LibraryResourceAccess_grantedById_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryResourceAccess_grantedById_idx" ON public."LibraryResourceAccess" USING btree ("grantedById");


--
-- Name: LibraryResourceAccess_platformId_isActive_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryResourceAccess_platformId_isActive_idx" ON public."LibraryResourceAccess" USING btree ("platformId", "isActive");


--
-- Name: LibraryResourceAccess_platformId_schoolId_isActive_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryResourceAccess_platformId_schoolId_isActive_idx" ON public."LibraryResourceAccess" USING btree ("platformId", "schoolId", "isActive");


--
-- Name: LibraryResourceAccess_platformId_schoolId_resourceType_subj_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "LibraryResourceAccess_platformId_schoolId_resourceType_subj_key" ON public."LibraryResourceAccess" USING btree ("platformId", "schoolId", "resourceType", "subjectId", "topicId", "videoId", "materialId", "assessmentId");


--
-- Name: LibraryResourceAccess_schoolId_isActive_resourceType_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryResourceAccess_schoolId_isActive_resourceType_idx" ON public."LibraryResourceAccess" USING btree ("schoolId", "isActive", "resourceType");


--
-- Name: LibraryResourceUser_email_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "LibraryResourceUser_email_key" ON public."LibraryResourceUser" USING btree (email);


--
-- Name: LibraryResourceUser_platformId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryResourceUser_platformId_idx" ON public."LibraryResourceUser" USING btree ("platformId");


--
-- Name: LibraryResource_createdAt_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryResource_createdAt_idx" ON public."LibraryResource" USING btree ("createdAt");


--
-- Name: LibraryResource_platformId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryResource_platformId_idx" ON public."LibraryResource" USING btree ("platformId");


--
-- Name: LibraryResource_resourceType_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryResource_resourceType_idx" ON public."LibraryResource" USING btree ("resourceType");


--
-- Name: LibraryResource_schoolId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryResource_schoolId_idx" ON public."LibraryResource" USING btree ("schoolId");


--
-- Name: LibraryResource_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryResource_status_idx" ON public."LibraryResource" USING btree (status);


--
-- Name: LibraryResource_topic_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryResource_topic_id_idx" ON public."LibraryResource" USING btree (topic_id);


--
-- Name: LibrarySubject_platformId_code_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "LibrarySubject_platformId_code_key" ON public."LibrarySubject" USING btree ("platformId", code);


--
-- Name: LibrarySubject_platformId_name_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibrarySubject_platformId_name_idx" ON public."LibrarySubject" USING btree ("platformId", name);


--
-- Name: LibraryTopic_platformId_subjectId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryTopic_platformId_subjectId_idx" ON public."LibraryTopic" USING btree ("platformId", "subjectId");


--
-- Name: LibraryTopic_subjectId_order_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryTopic_subjectId_order_idx" ON public."LibraryTopic" USING btree ("subjectId", "order");


--
-- Name: LibraryVideoLesson_platformId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryVideoLesson_platformId_idx" ON public."LibraryVideoLesson" USING btree ("platformId");


--
-- Name: LibraryVideoLesson_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryVideoLesson_status_idx" ON public."LibraryVideoLesson" USING btree (status);


--
-- Name: LibraryVideoLesson_subjectId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryVideoLesson_subjectId_idx" ON public."LibraryVideoLesson" USING btree ("subjectId");


--
-- Name: LibraryVideoLesson_topicId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryVideoLesson_topicId_idx" ON public."LibraryVideoLesson" USING btree ("topicId");


--
-- Name: LibraryVideoLesson_uploadedById_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryVideoLesson_uploadedById_idx" ON public."LibraryVideoLesson" USING btree ("uploadedById");


--
-- Name: LibraryVideoView_libraryResourceUserId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryVideoView_libraryResourceUserId_idx" ON public."LibraryVideoView" USING btree ("libraryResourceUserId");


--
-- Name: LibraryVideoView_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryVideoView_userId_idx" ON public."LibraryVideoView" USING btree ("userId");


--
-- Name: LibraryVideoView_videoId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryVideoView_videoId_idx" ON public."LibraryVideoView" USING btree ("videoId");


--
-- Name: LibraryVideoView_videoId_userId_libraryResourceUserId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "LibraryVideoView_videoId_userId_libraryResourceUserId_key" ON public."LibraryVideoView" USING btree ("videoId", "userId", "libraryResourceUserId");


--
-- Name: LibraryVideoView_viewedAt_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryVideoView_viewedAt_idx" ON public."LibraryVideoView" USING btree ("viewedAt");


--
-- Name: LibraryVideoWatchHistory_classId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryVideoWatchHistory_classId_idx" ON public."LibraryVideoWatchHistory" USING btree ("classId");


--
-- Name: LibraryVideoWatchHistory_completionPercentage_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryVideoWatchHistory_completionPercentage_idx" ON public."LibraryVideoWatchHistory" USING btree ("completionPercentage");


--
-- Name: LibraryVideoWatchHistory_isCompleted_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryVideoWatchHistory_isCompleted_idx" ON public."LibraryVideoWatchHistory" USING btree ("isCompleted");


--
-- Name: LibraryVideoWatchHistory_libraryResourceUserId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryVideoWatchHistory_libraryResourceUserId_idx" ON public."LibraryVideoWatchHistory" USING btree ("libraryResourceUserId");


--
-- Name: LibraryVideoWatchHistory_schoolId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryVideoWatchHistory_schoolId_idx" ON public."LibraryVideoWatchHistory" USING btree ("schoolId");


--
-- Name: LibraryVideoWatchHistory_sessionId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryVideoWatchHistory_sessionId_idx" ON public."LibraryVideoWatchHistory" USING btree ("sessionId");


--
-- Name: LibraryVideoWatchHistory_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryVideoWatchHistory_userId_idx" ON public."LibraryVideoWatchHistory" USING btree ("userId");


--
-- Name: LibraryVideoWatchHistory_userId_watchedAt_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryVideoWatchHistory_userId_watchedAt_idx" ON public."LibraryVideoWatchHistory" USING btree ("userId", "watchedAt");


--
-- Name: LibraryVideoWatchHistory_videoId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryVideoWatchHistory_videoId_idx" ON public."LibraryVideoWatchHistory" USING btree ("videoId");


--
-- Name: LibraryVideoWatchHistory_videoId_schoolId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryVideoWatchHistory_videoId_schoolId_idx" ON public."LibraryVideoWatchHistory" USING btree ("videoId", "schoolId");


--
-- Name: LibraryVideoWatchHistory_videoId_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryVideoWatchHistory_videoId_userId_idx" ON public."LibraryVideoWatchHistory" USING btree ("videoId", "userId");


--
-- Name: LibraryVideoWatchHistory_watchedAt_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LibraryVideoWatchHistory_watchedAt_idx" ON public."LibraryVideoWatchHistory" USING btree ("watchedAt");


--
-- Name: LiveClass_createdAt_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LiveClass_createdAt_idx" ON public."LiveClass" USING btree ("createdAt");


--
-- Name: LiveClass_platformId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LiveClass_platformId_idx" ON public."LiveClass" USING btree ("platformId");


--
-- Name: LiveClass_schoolId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LiveClass_schoolId_idx" ON public."LiveClass" USING btree ("schoolId");


--
-- Name: LiveClass_startTime_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LiveClass_startTime_idx" ON public."LiveClass" USING btree ("startTime");


--
-- Name: LiveClass_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LiveClass_status_idx" ON public."LiveClass" USING btree (status);


--
-- Name: LiveClass_topic_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LiveClass_topic_id_idx" ON public."LiveClass" USING btree (topic_id);


--
-- Name: MaterialProcessing_createdAt_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "MaterialProcessing_createdAt_idx" ON public."MaterialProcessing" USING btree ("createdAt");


--
-- Name: MaterialProcessing_material_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "MaterialProcessing_material_id_key" ON public."MaterialProcessing" USING btree (material_id);


--
-- Name: MaterialProcessing_school_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "MaterialProcessing_school_id_idx" ON public."MaterialProcessing" USING btree (school_id);


--
-- Name: MaterialProcessing_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "MaterialProcessing_status_idx" ON public."MaterialProcessing" USING btree (status);


--
-- Name: Organisation_name_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "Organisation_name_key" ON public."Organisation" USING btree (name);


--
-- Name: PDFMaterial_createdAt_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "PDFMaterial_createdAt_idx" ON public."PDFMaterial" USING btree ("createdAt");


--
-- Name: PDFMaterial_materialId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "PDFMaterial_materialId_key" ON public."PDFMaterial" USING btree ("materialId");


--
-- Name: PDFMaterial_platformId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "PDFMaterial_platformId_idx" ON public."PDFMaterial" USING btree ("platformId");


--
-- Name: PDFMaterial_schoolId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "PDFMaterial_schoolId_idx" ON public."PDFMaterial" USING btree ("schoolId");


--
-- Name: PDFMaterial_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "PDFMaterial_status_idx" ON public."PDFMaterial" USING btree (status);


--
-- Name: PDFMaterial_topic_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "PDFMaterial_topic_id_idx" ON public."PDFMaterial" USING btree (topic_id);


--
-- Name: Parent_is_primary_contact_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Parent_is_primary_contact_idx" ON public."Parent" USING btree (is_primary_contact);


--
-- Name: Parent_parent_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Parent_parent_id_idx" ON public."Parent" USING btree (parent_id);


--
-- Name: Parent_parent_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "Parent_parent_id_key" ON public."Parent" USING btree (parent_id);


--
-- Name: Parent_relationship_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Parent_relationship_idx" ON public."Parent" USING btree (relationship);


--
-- Name: Parent_school_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Parent_school_id_idx" ON public."Parent" USING btree (school_id);


--
-- Name: Parent_user_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "Parent_user_id_key" ON public."Parent" USING btree (user_id);


--
-- Name: PlatformSubscriptionPlan_is_active_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "PlatformSubscriptionPlan_is_active_idx" ON public."PlatformSubscriptionPlan" USING btree (is_active);


--
-- Name: PlatformSubscriptionPlan_is_template_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "PlatformSubscriptionPlan_is_template_idx" ON public."PlatformSubscriptionPlan" USING btree (is_template);


--
-- Name: PlatformSubscriptionPlan_plan_type_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "PlatformSubscriptionPlan_plan_type_idx" ON public."PlatformSubscriptionPlan" USING btree (plan_type);


--
-- Name: PlatformSubscriptionPlan_school_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "PlatformSubscriptionPlan_school_id_idx" ON public."PlatformSubscriptionPlan" USING btree (school_id);


--
-- Name: PlatformSubscriptionPlan_school_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "PlatformSubscriptionPlan_school_id_key" ON public."PlatformSubscriptionPlan" USING btree (school_id);


--
-- Name: PlatformSubscriptionPlan_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "PlatformSubscriptionPlan_status_idx" ON public."PlatformSubscriptionPlan" USING btree (status);


--
-- Name: Result_academic_session_id_student_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "Result_academic_session_id_student_id_key" ON public."Result" USING btree (academic_session_id, student_id);


--
-- Name: Result_class_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Result_class_id_idx" ON public."Result" USING btree (class_id);


--
-- Name: Result_released_at_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Result_released_at_idx" ON public."Result" USING btree (released_at);


--
-- Name: Result_school_id_academic_session_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Result_school_id_academic_session_id_idx" ON public."Result" USING btree (school_id, academic_session_id);


--
-- Name: Result_student_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Result_student_id_idx" ON public."Result" USING btree (student_id);


--
-- Name: SchoolResourceAccess_classId_isActive_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "SchoolResourceAccess_classId_isActive_idx" ON public."SchoolResourceAccess" USING btree ("classId", "isActive");


--
-- Name: SchoolResourceAccess_grantedById_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "SchoolResourceAccess_grantedById_idx" ON public."SchoolResourceAccess" USING btree ("grantedById");


--
-- Name: SchoolResourceAccess_libraryResourceAccessId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "SchoolResourceAccess_libraryResourceAccessId_idx" ON public."SchoolResourceAccess" USING btree ("libraryResourceAccessId");


--
-- Name: SchoolResourceAccess_roleType_isActive_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "SchoolResourceAccess_roleType_isActive_idx" ON public."SchoolResourceAccess" USING btree ("roleType", "isActive");


--
-- Name: SchoolResourceAccess_schoolId_isActive_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "SchoolResourceAccess_schoolId_isActive_idx" ON public."SchoolResourceAccess" USING btree ("schoolId", "isActive");


--
-- Name: SchoolResourceAccess_userId_isActive_resourceType_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "SchoolResourceAccess_userId_isActive_resourceType_idx" ON public."SchoolResourceAccess" USING btree ("userId", "isActive", "resourceType");


--
-- Name: SchoolResourceExclusion_platformId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "SchoolResourceExclusion_platformId_idx" ON public."SchoolResourceExclusion" USING btree ("platformId");


--
-- Name: SchoolResourceExclusion_schoolId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "SchoolResourceExclusion_schoolId_idx" ON public."SchoolResourceExclusion" USING btree ("schoolId");


--
-- Name: SchoolResourceExclusion_schoolId_platformId_subjectId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "SchoolResourceExclusion_schoolId_platformId_subjectId_key" ON public."SchoolResourceExclusion" USING btree ("schoolId", "platformId", "subjectId");


--
-- Name: SchoolVideoView_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "SchoolVideoView_userId_idx" ON public."SchoolVideoView" USING btree ("userId");


--
-- Name: SchoolVideoView_videoId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "SchoolVideoView_videoId_idx" ON public."SchoolVideoView" USING btree ("videoId");


--
-- Name: SchoolVideoView_videoId_userId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "SchoolVideoView_videoId_userId_key" ON public."SchoolVideoView" USING btree ("videoId", "userId");


--
-- Name: SchoolVideoView_viewedAt_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "SchoolVideoView_viewedAt_idx" ON public."SchoolVideoView" USING btree ("viewedAt");


--
-- Name: SchoolVideoWatchHistory_classId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "SchoolVideoWatchHistory_classId_idx" ON public."SchoolVideoWatchHistory" USING btree ("classId");


--
-- Name: SchoolVideoWatchHistory_completionPercentage_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "SchoolVideoWatchHistory_completionPercentage_idx" ON public."SchoolVideoWatchHistory" USING btree ("completionPercentage");


--
-- Name: SchoolVideoWatchHistory_isCompleted_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "SchoolVideoWatchHistory_isCompleted_idx" ON public."SchoolVideoWatchHistory" USING btree ("isCompleted");


--
-- Name: SchoolVideoWatchHistory_schoolId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "SchoolVideoWatchHistory_schoolId_idx" ON public."SchoolVideoWatchHistory" USING btree ("schoolId");


--
-- Name: SchoolVideoWatchHistory_sessionId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "SchoolVideoWatchHistory_sessionId_idx" ON public."SchoolVideoWatchHistory" USING btree ("sessionId");


--
-- Name: SchoolVideoWatchHistory_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "SchoolVideoWatchHistory_userId_idx" ON public."SchoolVideoWatchHistory" USING btree ("userId");


--
-- Name: SchoolVideoWatchHistory_userId_watchedAt_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "SchoolVideoWatchHistory_userId_watchedAt_idx" ON public."SchoolVideoWatchHistory" USING btree ("userId", "watchedAt");


--
-- Name: SchoolVideoWatchHistory_videoId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "SchoolVideoWatchHistory_videoId_idx" ON public."SchoolVideoWatchHistory" USING btree ("videoId");


--
-- Name: SchoolVideoWatchHistory_videoId_schoolId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "SchoolVideoWatchHistory_videoId_schoolId_idx" ON public."SchoolVideoWatchHistory" USING btree ("videoId", "schoolId");


--
-- Name: SchoolVideoWatchHistory_videoId_userId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "SchoolVideoWatchHistory_videoId_userId_idx" ON public."SchoolVideoWatchHistory" USING btree ("videoId", "userId");


--
-- Name: SchoolVideoWatchHistory_watchedAt_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "SchoolVideoWatchHistory_watchedAt_idx" ON public."SchoolVideoWatchHistory" USING btree ("watchedAt");


--
-- Name: School_cacId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "School_cacId_key" ON public."School" USING btree ("cacId");


--
-- Name: School_school_email_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "School_school_email_key" ON public."School" USING btree (school_email);


--
-- Name: School_taxClearanceId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "School_taxClearanceId_key" ON public."School" USING btree ("taxClearanceId");


--
-- Name: School_utilityBillId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "School_utilityBillId_key" ON public."School" USING btree ("utilityBillId");


--
-- Name: StudentAchievement_achievement_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "StudentAchievement_achievement_id_idx" ON public."StudentAchievement" USING btree (achievement_id);


--
-- Name: StudentAchievement_student_id_achievement_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "StudentAchievement_student_id_achievement_id_key" ON public."StudentAchievement" USING btree (student_id, achievement_id);


--
-- Name: StudentAchievement_student_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "StudentAchievement_student_id_idx" ON public."StudentAchievement" USING btree (student_id);


--
-- Name: Student_academic_level_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Student_academic_level_idx" ON public."Student" USING btree (academic_level);


--
-- Name: Student_academic_session_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Student_academic_session_id_idx" ON public."Student" USING btree (academic_session_id);


--
-- Name: Student_admission_number_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Student_admission_number_idx" ON public."Student" USING btree (admission_number);


--
-- Name: Student_admission_number_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "Student_admission_number_key" ON public."Student" USING btree (admission_number);


--
-- Name: Student_current_class_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Student_current_class_id_idx" ON public."Student" USING btree (current_class_id);


--
-- Name: Student_parent_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Student_parent_id_idx" ON public."Student" USING btree (parent_id);


--
-- Name: Student_school_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Student_school_id_idx" ON public."Student" USING btree (school_id);


--
-- Name: Student_student_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Student_student_id_idx" ON public."Student" USING btree (student_id);


--
-- Name: Student_student_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "Student_student_id_key" ON public."Student" USING btree (student_id);


--
-- Name: Student_user_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "Student_user_id_key" ON public."Student" USING btree (user_id);


--
-- Name: Subject_code_schoolId_academic_session_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "Subject_code_schoolId_academic_session_id_key" ON public."Subject" USING btree (code, "schoolId", academic_session_id);


--
-- Name: SupportInfo_school_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "SupportInfo_school_id_idx" ON public."SupportInfo" USING btree (school_id);


--
-- Name: SupportInfo_school_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "SupportInfo_school_id_key" ON public."SupportInfo" USING btree (school_id);


--
-- Name: TeacherResourceAccess_classId_isActive_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "TeacherResourceAccess_classId_isActive_idx" ON public."TeacherResourceAccess" USING btree ("classId", "isActive");


--
-- Name: TeacherResourceAccess_schoolId_teacherId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "TeacherResourceAccess_schoolId_teacherId_idx" ON public."TeacherResourceAccess" USING btree ("schoolId", "teacherId");


--
-- Name: TeacherResourceAccess_schoolResourceAccessId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "TeacherResourceAccess_schoolResourceAccessId_idx" ON public."TeacherResourceAccess" USING btree ("schoolResourceAccessId");


--
-- Name: TeacherResourceAccess_studentId_isActive_resourceType_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "TeacherResourceAccess_studentId_isActive_resourceType_idx" ON public."TeacherResourceAccess" USING btree ("studentId", "isActive", "resourceType");


--
-- Name: TeacherResourceAccess_teacherId_isActive_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "TeacherResourceAccess_teacherId_isActive_idx" ON public."TeacherResourceAccess" USING btree ("teacherId", "isActive");


--
-- Name: TeacherResourceExclusion_classId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "TeacherResourceExclusion_classId_idx" ON public."TeacherResourceExclusion" USING btree ("classId");


--
-- Name: TeacherResourceExclusion_libraryClassId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "TeacherResourceExclusion_libraryClassId_idx" ON public."TeacherResourceExclusion" USING btree ("libraryClassId");


--
-- Name: TeacherResourceExclusion_schoolId_subjectId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "TeacherResourceExclusion_schoolId_subjectId_idx" ON public."TeacherResourceExclusion" USING btree ("schoolId", "subjectId");


--
-- Name: TeacherResourceExclusion_studentId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "TeacherResourceExclusion_studentId_idx" ON public."TeacherResourceExclusion" USING btree ("studentId");


--
-- Name: TeacherResourceExclusion_teacherId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "TeacherResourceExclusion_teacherId_idx" ON public."TeacherResourceExclusion" USING btree ("teacherId");


--
-- Name: TeacherResourceExclusion_teacherId_schoolId_subjectId_resou_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "TeacherResourceExclusion_teacherId_schoolId_subjectId_resou_key" ON public."TeacherResourceExclusion" USING btree ("teacherId", "schoolId", "subjectId", "resourceType", "resourceId", "classId", "studentId", "libraryClassId");


--
-- Name: TeacherSubject_teacherId_subjectId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "TeacherSubject_teacherId_subjectId_key" ON public."TeacherSubject" USING btree ("teacherId", "subjectId");


--
-- Name: Teacher_academic_session_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Teacher_academic_session_id_idx" ON public."Teacher" USING btree (academic_session_id);


--
-- Name: Teacher_department_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Teacher_department_idx" ON public."Teacher" USING btree (department);


--
-- Name: Teacher_email_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "Teacher_email_key" ON public."Teacher" USING btree (email);


--
-- Name: Teacher_employee_number_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Teacher_employee_number_idx" ON public."Teacher" USING btree (employee_number);


--
-- Name: Teacher_employee_number_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "Teacher_employee_number_key" ON public."Teacher" USING btree (employee_number);


--
-- Name: Teacher_is_class_teacher_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Teacher_is_class_teacher_idx" ON public."Teacher" USING btree (is_class_teacher);


--
-- Name: Teacher_school_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Teacher_school_id_idx" ON public."Teacher" USING btree (school_id);


--
-- Name: Teacher_teacher_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Teacher_teacher_id_idx" ON public."Teacher" USING btree (teacher_id);


--
-- Name: Teacher_teacher_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "Teacher_teacher_id_key" ON public."Teacher" USING btree (teacher_id);


--
-- Name: Teacher_user_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "Teacher_user_id_key" ON public."Teacher" USING btree (user_id);


--
-- Name: TimeSlot_order_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "TimeSlot_order_idx" ON public."TimeSlot" USING btree ("order");


--
-- Name: TimeSlot_schoolId_startTime_endTime_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "TimeSlot_schoolId_startTime_endTime_idx" ON public."TimeSlot" USING btree ("schoolId", "startTime", "endTime");


--
-- Name: TimeSlot_startTime_endTime_schoolId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "TimeSlot_startTime_endTime_schoolId_key" ON public."TimeSlot" USING btree ("startTime", "endTime", "schoolId");


--
-- Name: TimetableEntry_class_id_timeSlotId_day_of_week_academic_ses_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "TimetableEntry_class_id_timeSlotId_day_of_week_academic_ses_key" ON public."TimetableEntry" USING btree (class_id, "timeSlotId", day_of_week, academic_session_id);


--
-- Name: TimetableEntry_school_id_day_of_week_timeSlotId_academic_se_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "TimetableEntry_school_id_day_of_week_timeSlotId_academic_se_idx" ON public."TimetableEntry" USING btree (school_id, day_of_week, "timeSlotId", academic_session_id);


--
-- Name: TimetableEntry_teacher_id_timeSlotId_day_of_week_academic_s_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "TimetableEntry_teacher_id_timeSlotId_day_of_week_academic_s_idx" ON public."TimetableEntry" USING btree (teacher_id, "timeSlotId", day_of_week, academic_session_id);


--
-- Name: Topic_created_by_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Topic_created_by_idx" ON public."Topic" USING btree (created_by);


--
-- Name: Topic_school_id_academic_session_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Topic_school_id_academic_session_id_idx" ON public."Topic" USING btree (school_id, academic_session_id);


--
-- Name: Topic_subject_id_order_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Topic_subject_id_order_idx" ON public."Topic" USING btree (subject_id, "order");


--
-- Name: Topic_subject_id_title_academic_session_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "Topic_subject_id_title_academic_session_id_key" ON public."Topic" USING btree (subject_id, title, academic_session_id);


--
-- Name: UserSettings_school_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "UserSettings_school_id_idx" ON public."UserSettings" USING btree (school_id);


--
-- Name: UserSettings_user_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "UserSettings_user_id_idx" ON public."UserSettings" USING btree (user_id);


--
-- Name: UserSettings_user_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "UserSettings_user_id_key" ON public."UserSettings" USING btree (user_id);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: VideoContent_createdAt_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "VideoContent_createdAt_idx" ON public."VideoContent" USING btree ("createdAt");


--
-- Name: VideoContent_platformId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "VideoContent_platformId_idx" ON public."VideoContent" USING btree ("platformId");


--
-- Name: VideoContent_schoolId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "VideoContent_schoolId_idx" ON public."VideoContent" USING btree ("schoolId");


--
-- Name: VideoContent_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "VideoContent_status_idx" ON public."VideoContent" USING btree (status);


--
-- Name: VideoContent_topic_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "VideoContent_topic_id_idx" ON public."VideoContent" USING btree (topic_id);


--
-- Name: WalletTransaction_createdAt_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "WalletTransaction_createdAt_idx" ON public."WalletTransaction" USING btree ("createdAt");


--
-- Name: WalletTransaction_reference_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "WalletTransaction_reference_idx" ON public."WalletTransaction" USING btree (reference);


--
-- Name: WalletTransaction_reference_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "WalletTransaction_reference_key" ON public."WalletTransaction" USING btree (reference);


--
-- Name: WalletTransaction_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "WalletTransaction_status_idx" ON public."WalletTransaction" USING btree (status);


--
-- Name: WalletTransaction_transaction_type_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "WalletTransaction_transaction_type_idx" ON public."WalletTransaction" USING btree (transaction_type);


--
-- Name: WalletTransaction_wallet_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "WalletTransaction_wallet_id_idx" ON public."WalletTransaction" USING btree (wallet_id);


--
-- Name: Wallet_school_id_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Wallet_school_id_idx" ON public."Wallet" USING btree (school_id);


--
-- Name: Wallet_school_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "Wallet_school_id_key" ON public."Wallet" USING btree (school_id);


--
-- Name: Wallet_wallet_type_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Wallet_wallet_type_idx" ON public."Wallet" USING btree (wallet_type);


--
-- Name: _LibraryResponseOptions_B_index; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "_LibraryResponseOptions_B_index" ON public."_LibraryResponseOptions" USING btree ("B");


--
-- Name: _ResponseOptions_B_index; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "_ResponseOptions_B_index" ON public."_ResponseOptions" USING btree ("B");


--
-- Name: AcademicSession AcademicSession_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AcademicSession"
    ADD CONSTRAINT "AcademicSession_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Achievement Achievement_academic_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Achievement"
    ADD CONSTRAINT "Achievement_academic_session_id_fkey" FOREIGN KEY (academic_session_id) REFERENCES public."AcademicSession"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Achievement Achievement_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Achievement"
    ADD CONSTRAINT "Achievement_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AssessmentAnalytics AssessmentAnalytics_assessment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssessmentAnalytics"
    ADD CONSTRAINT "AssessmentAnalytics_assessment_id_fkey" FOREIGN KEY (assessment_id) REFERENCES public."Assessment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AssessmentAttempt AssessmentAttempt_academic_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssessmentAttempt"
    ADD CONSTRAINT "AssessmentAttempt_academic_session_id_fkey" FOREIGN KEY (academic_session_id) REFERENCES public."AcademicSession"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AssessmentAttempt AssessmentAttempt_assessment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssessmentAttempt"
    ADD CONSTRAINT "AssessmentAttempt_assessment_id_fkey" FOREIGN KEY (assessment_id) REFERENCES public."Assessment"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AssessmentAttempt AssessmentAttempt_graded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssessmentAttempt"
    ADD CONSTRAINT "AssessmentAttempt_graded_by_fkey" FOREIGN KEY (graded_by) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: AssessmentAttempt AssessmentAttempt_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssessmentAttempt"
    ADD CONSTRAINT "AssessmentAttempt_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AssessmentAttempt AssessmentAttempt_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssessmentAttempt"
    ADD CONSTRAINT "AssessmentAttempt_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AssessmentCorrectAnswer AssessmentCorrectAnswer_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssessmentCorrectAnswer"
    ADD CONSTRAINT "AssessmentCorrectAnswer_question_id_fkey" FOREIGN KEY (question_id) REFERENCES public."AssessmentQuestion"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AssessmentOption AssessmentOption_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssessmentOption"
    ADD CONSTRAINT "AssessmentOption_question_id_fkey" FOREIGN KEY (question_id) REFERENCES public."AssessmentQuestion"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AssessmentQuestion AssessmentQuestion_assessment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssessmentQuestion"
    ADD CONSTRAINT "AssessmentQuestion_assessment_id_fkey" FOREIGN KEY (assessment_id) REFERENCES public."Assessment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AssessmentResponse AssessmentResponse_attempt_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssessmentResponse"
    ADD CONSTRAINT "AssessmentResponse_attempt_id_fkey" FOREIGN KEY (attempt_id) REFERENCES public."AssessmentAttempt"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AssessmentResponse AssessmentResponse_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssessmentResponse"
    ADD CONSTRAINT "AssessmentResponse_question_id_fkey" FOREIGN KEY (question_id) REFERENCES public."AssessmentQuestion"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AssessmentResponse AssessmentResponse_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssessmentResponse"
    ADD CONSTRAINT "AssessmentResponse_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AssessmentSubmission AssessmentSubmission_academic_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssessmentSubmission"
    ADD CONSTRAINT "AssessmentSubmission_academic_session_id_fkey" FOREIGN KEY (academic_session_id) REFERENCES public."AcademicSession"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AssessmentSubmission AssessmentSubmission_assessment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssessmentSubmission"
    ADD CONSTRAINT "AssessmentSubmission_assessment_id_fkey" FOREIGN KEY (assessment_id) REFERENCES public."Assessment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AssessmentSubmission AssessmentSubmission_graded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssessmentSubmission"
    ADD CONSTRAINT "AssessmentSubmission_graded_by_fkey" FOREIGN KEY (graded_by) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: AssessmentSubmission AssessmentSubmission_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssessmentSubmission"
    ADD CONSTRAINT "AssessmentSubmission_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AssessmentSubmission AssessmentSubmission_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssessmentSubmission"
    ADD CONSTRAINT "AssessmentSubmission_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Assessment Assessment_academic_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Assessment"
    ADD CONSTRAINT "Assessment_academic_session_id_fkey" FOREIGN KEY (academic_session_id) REFERENCES public."AcademicSession"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Assessment Assessment_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Assessment"
    ADD CONSTRAINT "Assessment_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Assessment Assessment_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Assessment"
    ADD CONSTRAINT "Assessment_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Assessment Assessment_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Assessment"
    ADD CONSTRAINT "Assessment_subject_id_fkey" FOREIGN KEY (subject_id) REFERENCES public."Subject"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Assessment Assessment_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Assessment"
    ADD CONSTRAINT "Assessment_topic_id_fkey" FOREIGN KEY (topic_id) REFERENCES public."Topic"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: AssignmentGrade AssignmentGrade_academic_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssignmentGrade"
    ADD CONSTRAINT "AssignmentGrade_academic_session_id_fkey" FOREIGN KEY (academic_session_id) REFERENCES public."AcademicSession"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AssignmentGrade AssignmentGrade_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssignmentGrade"
    ADD CONSTRAINT "AssignmentGrade_assignment_id_fkey" FOREIGN KEY (assignment_id) REFERENCES public."Assignment"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AssignmentGrade AssignmentGrade_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssignmentGrade"
    ADD CONSTRAINT "AssignmentGrade_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AssignmentGrade AssignmentGrade_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssignmentGrade"
    ADD CONSTRAINT "AssignmentGrade_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AssignmentGrade AssignmentGrade_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssignmentGrade"
    ADD CONSTRAINT "AssignmentGrade_submission_id_fkey" FOREIGN KEY (submission_id) REFERENCES public."AssignmentSubmission"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AssignmentGrade AssignmentGrade_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssignmentGrade"
    ADD CONSTRAINT "AssignmentGrade_teacher_id_fkey" FOREIGN KEY (teacher_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AssignmentSubmission AssignmentSubmission_academic_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssignmentSubmission"
    ADD CONSTRAINT "AssignmentSubmission_academic_session_id_fkey" FOREIGN KEY (academic_session_id) REFERENCES public."AcademicSession"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AssignmentSubmission AssignmentSubmission_assignment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssignmentSubmission"
    ADD CONSTRAINT "AssignmentSubmission_assignment_id_fkey" FOREIGN KEY (assignment_id) REFERENCES public."Assignment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AssignmentSubmission AssignmentSubmission_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssignmentSubmission"
    ADD CONSTRAINT "AssignmentSubmission_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AssignmentSubmission AssignmentSubmission_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssignmentSubmission"
    ADD CONSTRAINT "AssignmentSubmission_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AssignmentSubmission AssignmentSubmission_topicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AssignmentSubmission"
    ADD CONSTRAINT "AssignmentSubmission_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES public."Topic"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Assignment Assignment_academic_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_academic_session_id_fkey" FOREIGN KEY (academic_session_id) REFERENCES public."AcademicSession"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Assignment Assignment_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Assignment Assignment_grading_rubric_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_grading_rubric_id_fkey" FOREIGN KEY (grading_rubric_id) REFERENCES public."GradingRubric"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Assignment Assignment_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Assignment Assignment_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Assignment"
    ADD CONSTRAINT "Assignment_topic_id_fkey" FOREIGN KEY (topic_id) REFERENCES public."Topic"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AttendanceRecord AttendanceRecord_academic_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AttendanceRecord"
    ADD CONSTRAINT "AttendanceRecord_academic_session_id_fkey" FOREIGN KEY (academic_session_id) REFERENCES public."AcademicSession"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AttendanceRecord AttendanceRecord_attendance_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AttendanceRecord"
    ADD CONSTRAINT "AttendanceRecord_attendance_session_id_fkey" FOREIGN KEY (attendance_session_id) REFERENCES public."AttendanceSession"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AttendanceRecord AttendanceRecord_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AttendanceRecord"
    ADD CONSTRAINT "AttendanceRecord_class_id_fkey" FOREIGN KEY (class_id) REFERENCES public."Class"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AttendanceRecord AttendanceRecord_marked_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AttendanceRecord"
    ADD CONSTRAINT "AttendanceRecord_marked_by_fkey" FOREIGN KEY (marked_by) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: AttendanceRecord AttendanceRecord_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AttendanceRecord"
    ADD CONSTRAINT "AttendanceRecord_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AttendanceRecord AttendanceRecord_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AttendanceRecord"
    ADD CONSTRAINT "AttendanceRecord_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AttendanceSession AttendanceSession_academic_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AttendanceSession"
    ADD CONSTRAINT "AttendanceSession_academic_session_id_fkey" FOREIGN KEY (academic_session_id) REFERENCES public."AcademicSession"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AttendanceSession AttendanceSession_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AttendanceSession"
    ADD CONSTRAINT "AttendanceSession_approved_by_fkey" FOREIGN KEY (approved_by) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: AttendanceSession AttendanceSession_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AttendanceSession"
    ADD CONSTRAINT "AttendanceSession_class_id_fkey" FOREIGN KEY (class_id) REFERENCES public."Class"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AttendanceSession AttendanceSession_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AttendanceSession"
    ADD CONSTRAINT "AttendanceSession_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AttendanceSession AttendanceSession_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AttendanceSession"
    ADD CONSTRAINT "AttendanceSession_teacher_id_fkey" FOREIGN KEY (teacher_id) REFERENCES public."Teacher"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AttendanceSettings AttendanceSettings_academic_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AttendanceSettings"
    ADD CONSTRAINT "AttendanceSettings_academic_session_id_fkey" FOREIGN KEY (academic_session_id) REFERENCES public."AcademicSession"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AttendanceSettings AttendanceSettings_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AttendanceSettings"
    ADD CONSTRAINT "AttendanceSettings_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AttendanceSummary AttendanceSummary_academic_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AttendanceSummary"
    ADD CONSTRAINT "AttendanceSummary_academic_session_id_fkey" FOREIGN KEY (academic_session_id) REFERENCES public."AcademicSession"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AttendanceSummary AttendanceSummary_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AttendanceSummary"
    ADD CONSTRAINT "AttendanceSummary_class_id_fkey" FOREIGN KEY (class_id) REFERENCES public."Class"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AttendanceSummary AttendanceSummary_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AttendanceSummary"
    ADD CONSTRAINT "AttendanceSummary_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AttendanceSummary AttendanceSummary_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."AttendanceSummary"
    ADD CONSTRAINT "AttendanceSummary_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ChatAnalytics ChatAnalytics_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ChatAnalytics"
    ADD CONSTRAINT "ChatAnalytics_material_id_fkey" FOREIGN KEY (material_id) REFERENCES public."PDFMaterial"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ChatAnalytics ChatAnalytics_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ChatAnalytics"
    ADD CONSTRAINT "ChatAnalytics_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ChatAnalytics ChatAnalytics_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ChatAnalytics"
    ADD CONSTRAINT "ChatAnalytics_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ChatContext ChatContext_chunk_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ChatContext"
    ADD CONSTRAINT "ChatContext_chunk_id_fkey" FOREIGN KEY (chunk_id) REFERENCES public."DocumentChunk"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ChatContext ChatContext_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ChatContext"
    ADD CONSTRAINT "ChatContext_conversation_id_fkey" FOREIGN KEY (conversation_id) REFERENCES public."ChatConversation"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ChatContext ChatContext_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ChatContext"
    ADD CONSTRAINT "ChatContext_message_id_fkey" FOREIGN KEY (message_id) REFERENCES public."ChatMessage"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ChatContext ChatContext_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ChatContext"
    ADD CONSTRAINT "ChatContext_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ChatConversation ChatConversation_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ChatConversation"
    ADD CONSTRAINT "ChatConversation_material_id_fkey" FOREIGN KEY (material_id) REFERENCES public."PDFMaterial"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ChatConversation ChatConversation_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ChatConversation"
    ADD CONSTRAINT "ChatConversation_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ChatConversation ChatConversation_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ChatConversation"
    ADD CONSTRAINT "ChatConversation_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ChatMessage ChatMessage_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ChatMessage"
    ADD CONSTRAINT "ChatMessage_conversation_id_fkey" FOREIGN KEY (conversation_id) REFERENCES public."ChatConversation"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ChatMessage ChatMessage_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ChatMessage"
    ADD CONSTRAINT "ChatMessage_material_id_fkey" FOREIGN KEY (material_id) REFERENCES public."PDFMaterial"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ChatMessage ChatMessage_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ChatMessage"
    ADD CONSTRAINT "ChatMessage_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ChatMessage ChatMessage_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ChatMessage"
    ADD CONSTRAINT "ChatMessage_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Class Class_academic_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Class"
    ADD CONSTRAINT "Class_academic_session_id_fkey" FOREIGN KEY (academic_session_id) REFERENCES public."AcademicSession"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Class Class_classTeacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Class"
    ADD CONSTRAINT "Class_classTeacherId_fkey" FOREIGN KEY ("classTeacherId") REFERENCES public."Teacher"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Class Class_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Class"
    ADD CONSTRAINT "Class_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DeviceToken DeviceToken_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."DeviceToken"
    ADD CONSTRAINT "DeviceToken_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: DeviceToken DeviceToken_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."DeviceToken"
    ADD CONSTRAINT "DeviceToken_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DocumentChunk DocumentChunk_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."DocumentChunk"
    ADD CONSTRAINT "DocumentChunk_material_id_fkey" FOREIGN KEY (material_id) REFERENCES public."PDFMaterial"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DocumentChunk DocumentChunk_material_processing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."DocumentChunk"
    ADD CONSTRAINT "DocumentChunk_material_processing_id_fkey" FOREIGN KEY (material_processing_id) REFERENCES public."MaterialProcessing"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DocumentChunk DocumentChunk_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."DocumentChunk"
    ADD CONSTRAINT "DocumentChunk_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ExamBodyAssessmentAttempt ExamBodyAssessmentAttempt_assessmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ExamBodyAssessmentAttempt"
    ADD CONSTRAINT "ExamBodyAssessmentAttempt_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES public."ExamBodyAssessment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExamBodyAssessmentAttempt ExamBodyAssessmentAttempt_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ExamBodyAssessmentAttempt"
    ADD CONSTRAINT "ExamBodyAssessmentAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExamBodyAssessmentCorrectAnswer ExamBodyAssessmentCorrectAnswer_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ExamBodyAssessmentCorrectAnswer"
    ADD CONSTRAINT "ExamBodyAssessmentCorrectAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public."ExamBodyAssessmentQuestion"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExamBodyAssessmentOption ExamBodyAssessmentOption_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ExamBodyAssessmentOption"
    ADD CONSTRAINT "ExamBodyAssessmentOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public."ExamBodyAssessmentQuestion"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExamBodyAssessmentQuestion ExamBodyAssessmentQuestion_assessmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ExamBodyAssessmentQuestion"
    ADD CONSTRAINT "ExamBodyAssessmentQuestion_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES public."ExamBodyAssessment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExamBodyAssessmentResponse ExamBodyAssessmentResponse_attemptId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ExamBodyAssessmentResponse"
    ADD CONSTRAINT "ExamBodyAssessmentResponse_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES public."ExamBodyAssessmentAttempt"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExamBodyAssessmentResponse ExamBodyAssessmentResponse_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ExamBodyAssessmentResponse"
    ADD CONSTRAINT "ExamBodyAssessmentResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public."ExamBodyAssessmentQuestion"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExamBodyAssessmentResponse ExamBodyAssessmentResponse_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ExamBodyAssessmentResponse"
    ADD CONSTRAINT "ExamBodyAssessmentResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExamBodyAssessment ExamBodyAssessment_examBodyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ExamBodyAssessment"
    ADD CONSTRAINT "ExamBodyAssessment_examBodyId_fkey" FOREIGN KEY ("examBodyId") REFERENCES public."ExamBody"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExamBodyAssessment ExamBodyAssessment_platformId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ExamBodyAssessment"
    ADD CONSTRAINT "ExamBodyAssessment_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES public."LibraryPlatform"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ExamBodyAssessment ExamBodyAssessment_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ExamBodyAssessment"
    ADD CONSTRAINT "ExamBodyAssessment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."ExamBodySubject"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExamBodyAssessment ExamBodyAssessment_yearId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ExamBodyAssessment"
    ADD CONSTRAINT "ExamBodyAssessment_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES public."ExamBodyYear"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExamBodySubject ExamBodySubject_examBodyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ExamBodySubject"
    ADD CONSTRAINT "ExamBodySubject_examBodyId_fkey" FOREIGN KEY ("examBodyId") REFERENCES public."ExamBody"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ExamBodyYear ExamBodyYear_examBodyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ExamBodyYear"
    ADD CONSTRAINT "ExamBodyYear_examBodyId_fkey" FOREIGN KEY ("examBodyId") REFERENCES public."ExamBody"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Finance Finance_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Finance"
    ADD CONSTRAINT "Finance_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GradingRubric GradingRubric_academic_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."GradingRubric"
    ADD CONSTRAINT "GradingRubric_academic_session_id_fkey" FOREIGN KEY (academic_session_id) REFERENCES public."AcademicSession"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GradingRubric GradingRubric_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."GradingRubric"
    ADD CONSTRAINT "GradingRubric_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: GradingRubric GradingRubric_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."GradingRubric"
    ADD CONSTRAINT "GradingRubric_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryAssessmentAnalytics LibraryAssessmentAnalytics_assessmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryAssessmentAnalytics"
    ADD CONSTRAINT "LibraryAssessmentAnalytics_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES public."LibraryAssessment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryAssessmentAttempt LibraryAssessmentAttempt_assessmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryAssessmentAttempt"
    ADD CONSTRAINT "LibraryAssessmentAttempt_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES public."LibraryAssessment"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryAssessmentAttempt LibraryAssessmentAttempt_gradedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryAssessmentAttempt"
    ADD CONSTRAINT "LibraryAssessmentAttempt_gradedBy_fkey" FOREIGN KEY ("gradedBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LibraryAssessmentAttempt LibraryAssessmentAttempt_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryAssessmentAttempt"
    ADD CONSTRAINT "LibraryAssessmentAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryAssessmentCorrectAnswer LibraryAssessmentCorrectAnswer_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryAssessmentCorrectAnswer"
    ADD CONSTRAINT "LibraryAssessmentCorrectAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public."LibraryAssessmentQuestion"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryAssessmentOption LibraryAssessmentOption_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryAssessmentOption"
    ADD CONSTRAINT "LibraryAssessmentOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public."LibraryAssessmentQuestion"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryAssessmentQuestion LibraryAssessmentQuestion_assessmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryAssessmentQuestion"
    ADD CONSTRAINT "LibraryAssessmentQuestion_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES public."LibraryAssessment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryAssessmentResponse LibraryAssessmentResponse_attemptId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryAssessmentResponse"
    ADD CONSTRAINT "LibraryAssessmentResponse_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES public."LibraryAssessmentAttempt"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryAssessmentResponse LibraryAssessmentResponse_questionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryAssessmentResponse"
    ADD CONSTRAINT "LibraryAssessmentResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES public."LibraryAssessmentQuestion"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryAssessmentResponse LibraryAssessmentResponse_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryAssessmentResponse"
    ADD CONSTRAINT "LibraryAssessmentResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryAssessment LibraryAssessment_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryAssessment"
    ADD CONSTRAINT "LibraryAssessment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."LibraryResourceUser"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryAssessment LibraryAssessment_platformId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryAssessment"
    ADD CONSTRAINT "LibraryAssessment_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES public."LibraryPlatform"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryAssessment LibraryAssessment_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryAssessment"
    ADD CONSTRAINT "LibraryAssessment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."LibrarySubject"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryAssessment LibraryAssessment_topicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryAssessment"
    ADD CONSTRAINT "LibraryAssessment_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES public."LibraryTopic"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryAssignment LibraryAssignment_platformId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryAssignment"
    ADD CONSTRAINT "LibraryAssignment_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES public."LibraryPlatform"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryAssignment LibraryAssignment_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryAssignment"
    ADD CONSTRAINT "LibraryAssignment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."LibrarySubject"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryAssignment LibraryAssignment_topicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryAssignment"
    ADD CONSTRAINT "LibraryAssignment_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES public."LibraryTopic"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryAssignment LibraryAssignment_uploadedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryAssignment"
    ADD CONSTRAINT "LibraryAssignment_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES public."LibraryResourceUser"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryComment LibraryComment_commentedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryComment"
    ADD CONSTRAINT "LibraryComment_commentedById_fkey" FOREIGN KEY ("commentedById") REFERENCES public."LibraryResourceUser"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LibraryComment LibraryComment_parentCommentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryComment"
    ADD CONSTRAINT "LibraryComment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES public."LibraryComment"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LibraryComment LibraryComment_platformId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryComment"
    ADD CONSTRAINT "LibraryComment_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES public."LibraryPlatform"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryComment LibraryComment_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryComment"
    ADD CONSTRAINT "LibraryComment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."LibrarySubject"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LibraryComment LibraryComment_topicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryComment"
    ADD CONSTRAINT "LibraryComment_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES public."LibraryTopic"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LibraryComment LibraryComment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryComment"
    ADD CONSTRAINT "LibraryComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LibraryGeneralMaterialChapterFile LibraryGeneralMaterialChapterFile_chapterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialChapterFile"
    ADD CONSTRAINT "LibraryGeneralMaterialChapterFile_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES public."LibraryGeneralMaterialChapter"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryGeneralMaterialChapterFile LibraryGeneralMaterialChapterFile_platformId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialChapterFile"
    ADD CONSTRAINT "LibraryGeneralMaterialChapterFile_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES public."LibraryPlatform"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryGeneralMaterialChapterFile LibraryGeneralMaterialChapterFile_uploadedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialChapterFile"
    ADD CONSTRAINT "LibraryGeneralMaterialChapterFile_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES public."LibraryResourceUser"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryGeneralMaterialChapter LibraryGeneralMaterialChapter_materialId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialChapter"
    ADD CONSTRAINT "LibraryGeneralMaterialChapter_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES public."LibraryGeneralMaterial"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryGeneralMaterialChapter LibraryGeneralMaterialChapter_platformId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialChapter"
    ADD CONSTRAINT "LibraryGeneralMaterialChapter_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES public."LibraryPlatform"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryGeneralMaterialChatContext LibraryGeneralMaterialChatContext_chunkId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialChatContext"
    ADD CONSTRAINT "LibraryGeneralMaterialChatContext_chunkId_fkey" FOREIGN KEY ("chunkId") REFERENCES public."LibraryGeneralMaterialChunk"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryGeneralMaterialChatContext LibraryGeneralMaterialChatContext_conversationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialChatContext"
    ADD CONSTRAINT "LibraryGeneralMaterialChatContext_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES public."LibraryGeneralMaterialChatConversation"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryGeneralMaterialChatContext LibraryGeneralMaterialChatContext_materialId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialChatContext"
    ADD CONSTRAINT "LibraryGeneralMaterialChatContext_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES public."LibraryGeneralMaterial"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryGeneralMaterialChatConversation LibraryGeneralMaterialChatConversation_materialId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialChatConversation"
    ADD CONSTRAINT "LibraryGeneralMaterialChatConversation_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES public."LibraryGeneralMaterial"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryGeneralMaterialChatConversation LibraryGeneralMaterialChatConversation_platformId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialChatConversation"
    ADD CONSTRAINT "LibraryGeneralMaterialChatConversation_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES public."LibraryPlatform"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryGeneralMaterialChatConversation LibraryGeneralMaterialChatConversation_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialChatConversation"
    ADD CONSTRAINT "LibraryGeneralMaterialChatConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryGeneralMaterialChatMessage LibraryGeneralMaterialChatMessage_conversationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialChatMessage"
    ADD CONSTRAINT "LibraryGeneralMaterialChatMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES public."LibraryGeneralMaterialChatConversation"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryGeneralMaterialChatMessage LibraryGeneralMaterialChatMessage_materialId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialChatMessage"
    ADD CONSTRAINT "LibraryGeneralMaterialChatMessage_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES public."LibraryGeneralMaterial"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryGeneralMaterialChatMessage LibraryGeneralMaterialChatMessage_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialChatMessage"
    ADD CONSTRAINT "LibraryGeneralMaterialChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryGeneralMaterialChunk LibraryGeneralMaterialChunk_chapterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialChunk"
    ADD CONSTRAINT "LibraryGeneralMaterialChunk_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES public."LibraryGeneralMaterialChapter"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryGeneralMaterialChunk LibraryGeneralMaterialChunk_materialId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialChunk"
    ADD CONSTRAINT "LibraryGeneralMaterialChunk_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES public."LibraryGeneralMaterial"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryGeneralMaterialChunk LibraryGeneralMaterialChunk_platformId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialChunk"
    ADD CONSTRAINT "LibraryGeneralMaterialChunk_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES public."LibraryPlatform"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryGeneralMaterialChunk LibraryGeneralMaterialChunk_processingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialChunk"
    ADD CONSTRAINT "LibraryGeneralMaterialChunk_processingId_fkey" FOREIGN KEY ("processingId") REFERENCES public."LibraryGeneralMaterialProcessing"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryGeneralMaterialClass LibraryGeneralMaterialClass_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialClass"
    ADD CONSTRAINT "LibraryGeneralMaterialClass_classId_fkey" FOREIGN KEY ("classId") REFERENCES public."LibraryClass"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryGeneralMaterialClass LibraryGeneralMaterialClass_materialId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialClass"
    ADD CONSTRAINT "LibraryGeneralMaterialClass_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES public."LibraryGeneralMaterial"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryGeneralMaterialProcessing LibraryGeneralMaterialProcessing_materialId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialProcessing"
    ADD CONSTRAINT "LibraryGeneralMaterialProcessing_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES public."LibraryGeneralMaterial"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryGeneralMaterialProcessing LibraryGeneralMaterialProcessing_platformId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialProcessing"
    ADD CONSTRAINT "LibraryGeneralMaterialProcessing_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES public."LibraryPlatform"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryGeneralMaterialPurchase LibraryGeneralMaterialPurchase_materialId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialPurchase"
    ADD CONSTRAINT "LibraryGeneralMaterialPurchase_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES public."LibraryGeneralMaterial"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryGeneralMaterialPurchase LibraryGeneralMaterialPurchase_platformId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialPurchase"
    ADD CONSTRAINT "LibraryGeneralMaterialPurchase_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES public."LibraryPlatform"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryGeneralMaterialPurchase LibraryGeneralMaterialPurchase_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterialPurchase"
    ADD CONSTRAINT "LibraryGeneralMaterialPurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryGeneralMaterial LibraryGeneralMaterial_platformId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterial"
    ADD CONSTRAINT "LibraryGeneralMaterial_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES public."LibraryPlatform"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryGeneralMaterial LibraryGeneralMaterial_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterial"
    ADD CONSTRAINT "LibraryGeneralMaterial_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."LibrarySubject"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LibraryGeneralMaterial LibraryGeneralMaterial_uploadedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryGeneralMaterial"
    ADD CONSTRAINT "LibraryGeneralMaterial_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES public."LibraryResourceUser"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryLink LibraryLink_platformId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryLink"
    ADD CONSTRAINT "LibraryLink_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES public."LibraryPlatform"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryLink LibraryLink_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryLink"
    ADD CONSTRAINT "LibraryLink_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."LibrarySubject"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryLink LibraryLink_topicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryLink"
    ADD CONSTRAINT "LibraryLink_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES public."LibraryTopic"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LibraryLink LibraryLink_uploadedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryLink"
    ADD CONSTRAINT "LibraryLink_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES public."LibraryResourceUser"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryMaterial LibraryMaterial_platformId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryMaterial"
    ADD CONSTRAINT "LibraryMaterial_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES public."LibraryPlatform"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryMaterial LibraryMaterial_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryMaterial"
    ADD CONSTRAINT "LibraryMaterial_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."LibrarySubject"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryMaterial LibraryMaterial_topicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryMaterial"
    ADD CONSTRAINT "LibraryMaterial_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES public."LibraryTopic"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LibraryMaterial LibraryMaterial_uploadedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryMaterial"
    ADD CONSTRAINT "LibraryMaterial_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES public."LibraryResourceUser"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryResourceAccess LibraryResourceAccess_assessmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryResourceAccess"
    ADD CONSTRAINT "LibraryResourceAccess_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES public."LibraryAssessment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryResourceAccess LibraryResourceAccess_grantedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryResourceAccess"
    ADD CONSTRAINT "LibraryResourceAccess_grantedById_fkey" FOREIGN KEY ("grantedById") REFERENCES public."LibraryResourceUser"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryResourceAccess LibraryResourceAccess_materialId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryResourceAccess"
    ADD CONSTRAINT "LibraryResourceAccess_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES public."LibraryMaterial"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryResourceAccess LibraryResourceAccess_platformId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryResourceAccess"
    ADD CONSTRAINT "LibraryResourceAccess_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES public."LibraryPlatform"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryResourceAccess LibraryResourceAccess_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryResourceAccess"
    ADD CONSTRAINT "LibraryResourceAccess_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryResourceAccess LibraryResourceAccess_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryResourceAccess"
    ADD CONSTRAINT "LibraryResourceAccess_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."LibrarySubject"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryResourceAccess LibraryResourceAccess_topicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryResourceAccess"
    ADD CONSTRAINT "LibraryResourceAccess_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES public."LibraryTopic"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryResourceAccess LibraryResourceAccess_videoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryResourceAccess"
    ADD CONSTRAINT "LibraryResourceAccess_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES public."LibraryVideoLesson"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryResourceUser LibraryResourceUser_platformId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryResourceUser"
    ADD CONSTRAINT "LibraryResourceUser_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES public."LibraryPlatform"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryResource LibraryResource_platformId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryResource"
    ADD CONSTRAINT "LibraryResource_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES public."Organisation"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryResource LibraryResource_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryResource"
    ADD CONSTRAINT "LibraryResource_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LibraryResource LibraryResource_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryResource"
    ADD CONSTRAINT "LibraryResource_topic_id_fkey" FOREIGN KEY (topic_id) REFERENCES public."Topic"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LibraryResource LibraryResource_uploadedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryResource"
    ADD CONSTRAINT "LibraryResource_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibrarySubject LibrarySubject_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibrarySubject"
    ADD CONSTRAINT "LibrarySubject_classId_fkey" FOREIGN KEY ("classId") REFERENCES public."LibraryClass"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LibrarySubject LibrarySubject_platformId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibrarySubject"
    ADD CONSTRAINT "LibrarySubject_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES public."LibraryPlatform"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryTopic LibraryTopic_platformId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryTopic"
    ADD CONSTRAINT "LibraryTopic_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES public."LibraryPlatform"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryTopic LibraryTopic_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryTopic"
    ADD CONSTRAINT "LibraryTopic_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."LibrarySubject"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryVideoLesson LibraryVideoLesson_platformId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryVideoLesson"
    ADD CONSTRAINT "LibraryVideoLesson_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES public."LibraryPlatform"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryVideoLesson LibraryVideoLesson_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryVideoLesson"
    ADD CONSTRAINT "LibraryVideoLesson_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."LibrarySubject"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryVideoLesson LibraryVideoLesson_topicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryVideoLesson"
    ADD CONSTRAINT "LibraryVideoLesson_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES public."LibraryTopic"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LibraryVideoLesson LibraryVideoLesson_uploadedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryVideoLesson"
    ADD CONSTRAINT "LibraryVideoLesson_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES public."LibraryResourceUser"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LibraryVideoView LibraryVideoView_libraryResourceUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryVideoView"
    ADD CONSTRAINT "LibraryVideoView_libraryResourceUserId_fkey" FOREIGN KEY ("libraryResourceUserId") REFERENCES public."LibraryResourceUser"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryVideoView LibraryVideoView_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryVideoView"
    ADD CONSTRAINT "LibraryVideoView_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryVideoView LibraryVideoView_videoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryVideoView"
    ADD CONSTRAINT "LibraryVideoView_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES public."LibraryVideoLesson"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryVideoWatchHistory LibraryVideoWatchHistory_libraryResourceUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryVideoWatchHistory"
    ADD CONSTRAINT "LibraryVideoWatchHistory_libraryResourceUserId_fkey" FOREIGN KEY ("libraryResourceUserId") REFERENCES public."LibraryResourceUser"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryVideoWatchHistory LibraryVideoWatchHistory_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryVideoWatchHistory"
    ADD CONSTRAINT "LibraryVideoWatchHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LibraryVideoWatchHistory LibraryVideoWatchHistory_videoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LibraryVideoWatchHistory"
    ADD CONSTRAINT "LibraryVideoWatchHistory_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES public."LibraryVideoLesson"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LiveClass LiveClass_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LiveClass"
    ADD CONSTRAINT "LiveClass_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LiveClass LiveClass_platformId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LiveClass"
    ADD CONSTRAINT "LiveClass_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES public."Organisation"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: LiveClass LiveClass_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LiveClass"
    ADD CONSTRAINT "LiveClass_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LiveClass LiveClass_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LiveClass"
    ADD CONSTRAINT "LiveClass_topic_id_fkey" FOREIGN KEY (topic_id) REFERENCES public."Topic"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: MaterialProcessing MaterialProcessing_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."MaterialProcessing"
    ADD CONSTRAINT "MaterialProcessing_material_id_fkey" FOREIGN KEY (material_id) REFERENCES public."PDFMaterial"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MaterialProcessing MaterialProcessing_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."MaterialProcessing"
    ADD CONSTRAINT "MaterialProcessing_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Notification Notification_academic_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_academic_session_id_fkey" FOREIGN KEY (academic_session_id) REFERENCES public."AcademicSession"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Notification Notification_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PDFMaterial PDFMaterial_platformId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."PDFMaterial"
    ADD CONSTRAINT "PDFMaterial_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES public."Organisation"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PDFMaterial PDFMaterial_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."PDFMaterial"
    ADD CONSTRAINT "PDFMaterial_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PDFMaterial PDFMaterial_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."PDFMaterial"
    ADD CONSTRAINT "PDFMaterial_topic_id_fkey" FOREIGN KEY (topic_id) REFERENCES public."Topic"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PDFMaterial PDFMaterial_uploadedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."PDFMaterial"
    ADD CONSTRAINT "PDFMaterial_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Parent Parent_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Parent"
    ADD CONSTRAINT "Parent_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Parent Parent_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Parent"
    ADD CONSTRAINT "Parent_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Payment Payment_academic_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_academic_session_id_fkey" FOREIGN KEY (academic_session_id) REFERENCES public."AcademicSession"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Payment Payment_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_class_id_fkey" FOREIGN KEY (class_id) REFERENCES public."Class"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Payment Payment_finance_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_finance_id_fkey" FOREIGN KEY (finance_id) REFERENCES public."Finance"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Payment Payment_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PlatformSubscriptionPlan PlatformSubscriptionPlan_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."PlatformSubscriptionPlan"
    ADD CONSTRAINT "PlatformSubscriptionPlan_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Result Result_academic_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Result"
    ADD CONSTRAINT "Result_academic_session_id_fkey" FOREIGN KEY (academic_session_id) REFERENCES public."AcademicSession"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Result Result_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Result"
    ADD CONSTRAINT "Result_class_id_fkey" FOREIGN KEY (class_id) REFERENCES public."Class"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Result Result_released_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Result"
    ADD CONSTRAINT "Result_released_by_fkey" FOREIGN KEY (released_by) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Result Result_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Result"
    ADD CONSTRAINT "Result_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Result Result_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Result"
    ADD CONSTRAINT "Result_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."Student"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SchoolResourceAccess SchoolResourceAccess_assessmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."SchoolResourceAccess"
    ADD CONSTRAINT "SchoolResourceAccess_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES public."LibraryAssessment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SchoolResourceAccess SchoolResourceAccess_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."SchoolResourceAccess"
    ADD CONSTRAINT "SchoolResourceAccess_classId_fkey" FOREIGN KEY ("classId") REFERENCES public."Class"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SchoolResourceAccess SchoolResourceAccess_grantedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."SchoolResourceAccess"
    ADD CONSTRAINT "SchoolResourceAccess_grantedById_fkey" FOREIGN KEY ("grantedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SchoolResourceAccess SchoolResourceAccess_libraryResourceAccessId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."SchoolResourceAccess"
    ADD CONSTRAINT "SchoolResourceAccess_libraryResourceAccessId_fkey" FOREIGN KEY ("libraryResourceAccessId") REFERENCES public."LibraryResourceAccess"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SchoolResourceAccess SchoolResourceAccess_materialId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."SchoolResourceAccess"
    ADD CONSTRAINT "SchoolResourceAccess_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES public."LibraryMaterial"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SchoolResourceAccess SchoolResourceAccess_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."SchoolResourceAccess"
    ADD CONSTRAINT "SchoolResourceAccess_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SchoolResourceAccess SchoolResourceAccess_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."SchoolResourceAccess"
    ADD CONSTRAINT "SchoolResourceAccess_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."LibrarySubject"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SchoolResourceAccess SchoolResourceAccess_topicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."SchoolResourceAccess"
    ADD CONSTRAINT "SchoolResourceAccess_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES public."LibraryTopic"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SchoolResourceAccess SchoolResourceAccess_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."SchoolResourceAccess"
    ADD CONSTRAINT "SchoolResourceAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SchoolResourceAccess SchoolResourceAccess_videoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."SchoolResourceAccess"
    ADD CONSTRAINT "SchoolResourceAccess_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES public."LibraryVideoLesson"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SchoolResourceExclusion SchoolResourceExclusion_excludedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."SchoolResourceExclusion"
    ADD CONSTRAINT "SchoolResourceExclusion_excludedById_fkey" FOREIGN KEY ("excludedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SchoolResourceExclusion SchoolResourceExclusion_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."SchoolResourceExclusion"
    ADD CONSTRAINT "SchoolResourceExclusion_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SchoolResourceExclusion SchoolResourceExclusion_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."SchoolResourceExclusion"
    ADD CONSTRAINT "SchoolResourceExclusion_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."LibrarySubject"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SchoolVideoView SchoolVideoView_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."SchoolVideoView"
    ADD CONSTRAINT "SchoolVideoView_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SchoolVideoView SchoolVideoView_videoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."SchoolVideoView"
    ADD CONSTRAINT "SchoolVideoView_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES public."VideoContent"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SchoolVideoWatchHistory SchoolVideoWatchHistory_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."SchoolVideoWatchHistory"
    ADD CONSTRAINT "SchoolVideoWatchHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SchoolVideoWatchHistory SchoolVideoWatchHistory_videoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."SchoolVideoWatchHistory"
    ADD CONSTRAINT "SchoolVideoWatchHistory_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES public."VideoContent"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: School School_cacId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_cacId_fkey" FOREIGN KEY ("cacId") REFERENCES public."Document"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: School School_platformId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES public."Organisation"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: School School_taxClearanceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_taxClearanceId_fkey" FOREIGN KEY ("taxClearanceId") REFERENCES public."Document"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: School School_utilityBillId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."School"
    ADD CONSTRAINT "School_utilityBillId_fkey" FOREIGN KEY ("utilityBillId") REFERENCES public."Document"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: StudentAchievement StudentAchievement_achievement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."StudentAchievement"
    ADD CONSTRAINT "StudentAchievement_achievement_id_fkey" FOREIGN KEY (achievement_id) REFERENCES public."Achievement"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StudentAchievement StudentAchievement_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."StudentAchievement"
    ADD CONSTRAINT "StudentAchievement_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: StudentPerformance StudentPerformance_academic_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."StudentPerformance"
    ADD CONSTRAINT "StudentPerformance_academic_session_id_fkey" FOREIGN KEY (academic_session_id) REFERENCES public."AcademicSession"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StudentPerformance StudentPerformance_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."StudentPerformance"
    ADD CONSTRAINT "StudentPerformance_class_id_fkey" FOREIGN KEY (class_id) REFERENCES public."Class"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: StudentPerformance StudentPerformance_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."StudentPerformance"
    ADD CONSTRAINT "StudentPerformance_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Student Student_academic_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_academic_session_id_fkey" FOREIGN KEY (academic_session_id) REFERENCES public."AcademicSession"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Student Student_current_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_current_class_id_fkey" FOREIGN KEY (current_class_id) REFERENCES public."Class"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Student Student_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES public."Parent"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Student Student_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Student Student_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Student"
    ADD CONSTRAINT "Student_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Subject Subject_academic_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Subject"
    ADD CONSTRAINT "Subject_academic_session_id_fkey" FOREIGN KEY (academic_session_id) REFERENCES public."AcademicSession"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Subject Subject_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Subject"
    ADD CONSTRAINT "Subject_classId_fkey" FOREIGN KEY ("classId") REFERENCES public."Class"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Subject Subject_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Subject"
    ADD CONSTRAINT "Subject_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SupportInfo SupportInfo_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."SupportInfo"
    ADD CONSTRAINT "SupportInfo_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TeacherResourceAccess TeacherResourceAccess_assessmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TeacherResourceAccess"
    ADD CONSTRAINT "TeacherResourceAccess_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES public."LibraryAssessment"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeacherResourceAccess TeacherResourceAccess_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TeacherResourceAccess"
    ADD CONSTRAINT "TeacherResourceAccess_classId_fkey" FOREIGN KEY ("classId") REFERENCES public."Class"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeacherResourceAccess TeacherResourceAccess_materialId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TeacherResourceAccess"
    ADD CONSTRAINT "TeacherResourceAccess_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES public."LibraryMaterial"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeacherResourceAccess TeacherResourceAccess_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TeacherResourceAccess"
    ADD CONSTRAINT "TeacherResourceAccess_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeacherResourceAccess TeacherResourceAccess_schoolResourceAccessId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TeacherResourceAccess"
    ADD CONSTRAINT "TeacherResourceAccess_schoolResourceAccessId_fkey" FOREIGN KEY ("schoolResourceAccessId") REFERENCES public."SchoolResourceAccess"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeacherResourceAccess TeacherResourceAccess_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TeacherResourceAccess"
    ADD CONSTRAINT "TeacherResourceAccess_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeacherResourceAccess TeacherResourceAccess_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TeacherResourceAccess"
    ADD CONSTRAINT "TeacherResourceAccess_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."LibrarySubject"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeacherResourceAccess TeacherResourceAccess_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TeacherResourceAccess"
    ADD CONSTRAINT "TeacherResourceAccess_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TeacherResourceAccess TeacherResourceAccess_topicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TeacherResourceAccess"
    ADD CONSTRAINT "TeacherResourceAccess_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES public."LibraryTopic"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeacherResourceAccess TeacherResourceAccess_videoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TeacherResourceAccess"
    ADD CONSTRAINT "TeacherResourceAccess_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES public."LibraryVideoLesson"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeacherResourceExclusion TeacherResourceExclusion_classId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TeacherResourceExclusion"
    ADD CONSTRAINT "TeacherResourceExclusion_classId_fkey" FOREIGN KEY ("classId") REFERENCES public."Class"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeacherResourceExclusion TeacherResourceExclusion_libraryClassId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TeacherResourceExclusion"
    ADD CONSTRAINT "TeacherResourceExclusion_libraryClassId_fkey" FOREIGN KEY ("libraryClassId") REFERENCES public."LibraryClass"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeacherResourceExclusion TeacherResourceExclusion_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TeacherResourceExclusion"
    ADD CONSTRAINT "TeacherResourceExclusion_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeacherResourceExclusion TeacherResourceExclusion_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TeacherResourceExclusion"
    ADD CONSTRAINT "TeacherResourceExclusion_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeacherResourceExclusion TeacherResourceExclusion_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TeacherResourceExclusion"
    ADD CONSTRAINT "TeacherResourceExclusion_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."LibrarySubject"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeacherResourceExclusion TeacherResourceExclusion_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TeacherResourceExclusion"
    ADD CONSTRAINT "TeacherResourceExclusion_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TeacherSubject TeacherSubject_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TeacherSubject"
    ADD CONSTRAINT "TeacherSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public."Subject"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TeacherSubject TeacherSubject_teacherId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TeacherSubject"
    ADD CONSTRAINT "TeacherSubject_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES public."Teacher"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Teacher Teacher_academic_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Teacher"
    ADD CONSTRAINT "Teacher_academic_session_id_fkey" FOREIGN KEY (academic_session_id) REFERENCES public."AcademicSession"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Teacher Teacher_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Teacher"
    ADD CONSTRAINT "Teacher_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Teacher Teacher_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Teacher"
    ADD CONSTRAINT "Teacher_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TimeSlot TimeSlot_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TimeSlot"
    ADD CONSTRAINT "TimeSlot_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TimetableEntry TimetableEntry_academic_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TimetableEntry"
    ADD CONSTRAINT "TimetableEntry_academic_session_id_fkey" FOREIGN KEY (academic_session_id) REFERENCES public."AcademicSession"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TimetableEntry TimetableEntry_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TimetableEntry"
    ADD CONSTRAINT "TimetableEntry_class_id_fkey" FOREIGN KEY (class_id) REFERENCES public."Class"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TimetableEntry TimetableEntry_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TimetableEntry"
    ADD CONSTRAINT "TimetableEntry_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TimetableEntry TimetableEntry_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TimetableEntry"
    ADD CONSTRAINT "TimetableEntry_subject_id_fkey" FOREIGN KEY (subject_id) REFERENCES public."Subject"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TimetableEntry TimetableEntry_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TimetableEntry"
    ADD CONSTRAINT "TimetableEntry_teacher_id_fkey" FOREIGN KEY (teacher_id) REFERENCES public."Teacher"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TimetableEntry TimetableEntry_timeSlotId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TimetableEntry"
    ADD CONSTRAINT "TimetableEntry_timeSlotId_fkey" FOREIGN KEY ("timeSlotId") REFERENCES public."TimeSlot"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Topic Topic_academic_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Topic"
    ADD CONSTRAINT "Topic_academic_session_id_fkey" FOREIGN KEY (academic_session_id) REFERENCES public."AcademicSession"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Topic Topic_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Topic"
    ADD CONSTRAINT "Topic_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Topic Topic_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Topic"
    ADD CONSTRAINT "Topic_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Topic Topic_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Topic"
    ADD CONSTRAINT "Topic_subject_id_fkey" FOREIGN KEY (subject_id) REFERENCES public."Subject"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserSettings UserSettings_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."UserSettings"
    ADD CONSTRAINT "UserSettings_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserSettings UserSettings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."UserSettings"
    ADD CONSTRAINT "UserSettings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: User User_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: VideoContent VideoContent_platformId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."VideoContent"
    ADD CONSTRAINT "VideoContent_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES public."Organisation"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: VideoContent VideoContent_schoolId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."VideoContent"
    ADD CONSTRAINT "VideoContent_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: VideoContent VideoContent_topic_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."VideoContent"
    ADD CONSTRAINT "VideoContent_topic_id_fkey" FOREIGN KEY (topic_id) REFERENCES public."Topic"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: VideoContent VideoContent_uploadedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."VideoContent"
    ADD CONSTRAINT "VideoContent_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: WalletTransaction WalletTransaction_wallet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."WalletTransaction"
    ADD CONSTRAINT "WalletTransaction_wallet_id_fkey" FOREIGN KEY (wallet_id) REFERENCES public."Wallet"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Wallet Wallet_financeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Wallet"
    ADD CONSTRAINT "Wallet_financeId_fkey" FOREIGN KEY ("financeId") REFERENCES public."Finance"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Wallet Wallet_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Wallet"
    ADD CONSTRAINT "Wallet_school_id_fkey" FOREIGN KEY (school_id) REFERENCES public."School"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: _LibraryResponseOptions _LibraryResponseOptions_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."_LibraryResponseOptions"
    ADD CONSTRAINT "_LibraryResponseOptions_A_fkey" FOREIGN KEY ("A") REFERENCES public."LibraryAssessmentOption"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _LibraryResponseOptions _LibraryResponseOptions_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."_LibraryResponseOptions"
    ADD CONSTRAINT "_LibraryResponseOptions_B_fkey" FOREIGN KEY ("B") REFERENCES public."LibraryAssessmentResponse"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ResponseOptions _ResponseOptions_A_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."_ResponseOptions"
    ADD CONSTRAINT "_ResponseOptions_A_fkey" FOREIGN KEY ("A") REFERENCES public."AssessmentOption"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: _ResponseOptions _ResponseOptions_B_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."_ResponseOptions"
    ADD CONSTRAINT "_ResponseOptions_B_fkey" FOREIGN KEY ("B") REFERENCES public."AssessmentResponse"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: neondb_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict xMn9M2wETThgGffciBPez944DsaEjfnp2DEkrqLwQkFJCAO6mRc5X64GRAqkzjv


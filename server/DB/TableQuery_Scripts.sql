CREATE TABLE IF NOT EXISTS public."ODsummary"
(
    "RegNo" integer NOT NULL,
    "OD" smallint,
    "Permission" smallint,
    CONSTRAINT "ODsummary_pkey" PRIMARY KEY ("RegNo")
)


CREATE TABLE IF NOT EXISTS public."OdReqTable"
(
    "RegNo" integer NOT NULL,
    "Type" character varying COLLATE pg_catalog."default" NOT NULL,
    "Reason" text COLLATE pg_catalog."default" NOT NULL,
    "EndDate" date NOT NULL,
    "Subject" text COLLATE pg_catalog."default",
    "StartDate" date,
    "ReqDate" date,
    id integer NOT NULL DEFAULT nextval('"OdReqTable_id_seq"'::regclass),
    "Astatus" integer NOT NULL DEFAULT 0,
    CONSTRAINT "OdReqTable_pkey" PRIMARY KEY (id)
)

CREATE TABLE IF NOT EXISTS public.liveod
(
    regno integer NOT NULL,
    type character varying COLLATE pg_catalog."default" NOT NULL,
    reason text COLLATE pg_catalog."default" NOT NULL,
    enddate date NOT NULL,
    subject text COLLATE pg_catalog."default" NOT NULL,
    startdate date NOT NULL,
    reqdate date NOT NULL,
    id integer NOT NULL DEFAULT nextval('liveod_id_seq'::regclass),
    CONSTRAINT liveod_pkey PRIMARY KEY (id)
)

CREATE TABLE IF NOT EXISTS public.staff_login
(
    email character varying(255) COLLATE pg_catalog."default",
    hashed_password character varying(255) COLLATE pg_catalog."default"
)

CREATE TABLE IF NOT EXISTS public.student
(
    email character varying(255) COLLATE pg_catalog."default",
    pwd character varying(255) COLLATE pg_catalog."default",
    stud_name character varying(255) COLLATE pg_catalog."default",
    rollno integer NOT NULL,
    department character varying(255) COLLATE pg_catalog."default",
    cgpa double precision,
    year integer,
    sem integer,
    sec character varying COLLATE pg_catalog."default",
    "Attendence" integer,
    CONSTRAINT student_pkey PRIMARY KEY (rollno)
)

CREATE TABLE IF NOT EXISTS public.student_login
(
    email character varying(255) COLLATE pg_catalog."default",
    hashed_pwd character varying(255) COLLATE pg_catalog."default"
)

--------------------------------ATTENDENCE------------------------------------- 10/2/2024

CREATE TABLE IF NOT EXISTS public.student_attendance_summary
(
    student_id bigint NOT NULL,
    total_classes integer NOT NULL,
    absent_count integer NOT NULL,
    CONSTRAINT student_attendance_summary_pkey PRIMARY KEY (student_id)
)



ALTER TABLE public."ODsummary"
ALTER COLUMN "RegNo" TYPE BIGINT USING "RegNo"::BIGINT;


ALTER TABLE public."OdReqTable"
ALTER COLUMN "RegNo" TYPE BIGINT USING "RegNo"::BIGINT;

ALTER TABLE public.student
ALTER COLUMN rollno TYPE BIGINT USING rollno::BIGINT;

ALTER TABLE public.student_attendance_summary
ALTER COLUMN student_id TYPE BIGINT USING student_id::BIGINT;
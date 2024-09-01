CREATE TABLE IF NOT EXISTS public.OdReqTable
(
    RegNo integer NOT NULL,
    Type varchar NOT NULL,
    Reason text NOT NULL,
    EndDate date NOT NULL,
    Subject text,
    StartDate date,
    ReqDate date,
    id serial PRIMARY KEY
);


CREATE TABLE IF NOT EXISTS staff_login (
    email VARCHAR(255),
    hashed_password VARCHAR(255)
);


CREATE TABLE IF NOT EXISTS student (
    email VARCHAR(255),
    pwd VARCHAR(255),
    stud_name VARCHAR(255),
    rollno VARCHAR(255),
    department VARCHAR(255),
    cgpa FLOAT,
    year INT
);

create table  IF NOT EXISTS  student_login(
email VARCHAR(255),
	hashed_pwd VARCHAR(255)
);
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
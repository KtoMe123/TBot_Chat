--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0
-- Dumped by pg_dump version 16.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bot; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bot (
    mail character varying(50),
    pass character varying(50),
    token character varying(50),
    server character varying(50),
    socket_chat character varying(50),
    socket_list character varying(50),
    socket_main character varying(50)
);


ALTER TABLE public.bot OWNER TO postgres;

--
-- Name: mess; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mess (
    id bigint NOT NULL,
    id_chat character varying(50),
    main jsonb,
    seen boolean,
    token character varying(50)
);


ALTER TABLE public.mess OWNER TO postgres;

--
-- Name: mess_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mess_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mess_id_seq OWNER TO postgres;

--
-- Name: mess_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mess_id_seq OWNED BY public.mess.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    id_chat character varying(50),
    username character varying(50),
    link character varying(50),
    count integer,
    token character varying(50)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: mess id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mess ALTER COLUMN id SET DEFAULT nextval('public.mess_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: bot; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bot (mail, pass, token, server, socket_chat, socket_list, socket_main) FROM stdin;
mail1@mail.ru	123	6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4	Hz1xG6QpbpqY82XRAAAB	fK97xW227UcCmKCuAAAI	zN7A01PWidGCovGvAAAH	NgK1kLiQMclfljxYAAAF
mail2@mail.ru	123	6487861417:AAGH0pr-gDPohpbqYBU2xUWJhD7MDCIhp9M	Hz1xG6QpbpqY82XRAAAB	5MKXQuJtflBWgZcuAAAT	ohFrjr9HdSPkMih8AAAw	rWPEpKc9PVlsKOezAAAv
\.


--
-- Data for Name: mess; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mess (id, id_chat, main, seen, token) FROM stdin;
571	\N	\N	\N	\N
1130	6636682538	{"text": "sdf", "time": "02:21", "username": "Admin"}	t	6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4
1133	6636682538	{"text": "hh", "time": "02:24", "username": "Admin"}	t	6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4
1137	6636682538	{"text": "767]", "time": "02:26", "username": "Admin"}	t	6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4
1138	6636682538	{"text": "fgh", "time": "02:38", "username": "Admin"}	t	6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4
1119	718588586	{"text": "Hdhdh", "time": "04:16", "username": "Vladick"}	t	6487861417:AAGH0pr-gDPohpbqYBU2xUWJhD7MDCIhp9M
1121	718588586	{"file": "Add.txt", "time": "04:16", "username": "Admin"}	t	6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4
1123	718588586	{"img": "Снимок экрана 2023-09-24 190901.png", "time": "04:18", "username": "Admin"}	t	6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4
1127	718588586	{"file": "Jeepers.Creepers.2001.AVC_5234.torrent", "time": "04:23", "username": "Admin"}	t	6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4
569	\N	\N	\N	\N
1141	718588586	{"text": "sdf", "time": "03:16", "username": "Admin"}	t	6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4
1142	718588586	{"text": "fgh", "time": "04:24", "username": "Admin"}	t	6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4
1131	6636682538	{"text": "55", "time": "02:22", "username": "Admin"}	t	6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4
1134	6636682538	{"text": "55", "time": "02:25", "username": "Admin"}	t	6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4
1135	6636682538	{"text": "hjkhjk", "time": "02:25", "username": "Admin"}	t	6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4
1139	718588586	{"text": "Hhh", "time": "03:04", "username": "Vladick"}	t	6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4
1116	718588586	{"text": "dfg", "time": "04:04", "username": "Admin"}	t	6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4
1117	718588586	{"text": "kl;", "time": "04:04", "username": "Admin"}	t	6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4
1120	718588586	{"text": "8383", "time": "04:16", "username": "Vladick"}	t	6487861417:AAGH0pr-gDPohpbqYBU2xUWJhD7MDCIhp9M
1124	718588586	{"time": "04:20", "video": "AgAD-zsAAvexqUo.mp4", "username": "Vladick"}	t	6487861417:AAGH0pr-gDPohpbqYBU2xUWJhD7MDCIhp9M
1143	718588586	{"text": "dfg", "time": "04:25", "username": "Admin"}	t	6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4
570	\N	\N	\N	\N
1132	6636682538	{"text": "gg", "time": "02:23", "username": "Admin"}	t	6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4
1136	6636682538	{"text": ";;;", "time": "02:25", "username": "Admin"}	t	6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4
1125	718588586	{"img": "AQADd84xG5z5OUp-.png", "time": "04:20", "username": "Vladick"}	t	6487861417:AAGH0pr-gDPohpbqYBU2xUWJhD7MDCIhp9M
1144	718588586	{"text": "ghj", "time": "04:25", "username": "Admin"}	t	6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4
1128	718588586	{"time": "04:33", "voice": "AgADgz4AAufrwUo.ogg", "username": "Vladick"}	t	6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4
1118	718588586	{"text": "dfgdfg", "time": "04:04", "username": "Admin"}	t	6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4
1122	718588586	{"time": "04:17", "video": "Desktop 2023.11.13 - 17.50.27.12.mp4", "username": "Admin"}	t	6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4
1126	718588586	{"time": "04:20", "voice": "AgADyjIAAq6FwUo.ogg", "username": "Vladick"}	t	6487861417:AAGH0pr-gDPohpbqYBU2xUWJhD7MDCIhp9M
1129	718588586	{"text": "Ddd", "time": "04:41", "username": "Vladick"}	t	6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4
1140	718588586	{"text": "sdf", "time": "03:04", "username": "Admin"}	t	6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, id_chat, username, link, count, token) FROM stdin;
76	718588586	Vladick	KtoMe	0	6487861417:AAGH0pr-gDPohpbqYBU2xUWJhD7MDCIhp9M
75	6636682538	Vlad	TBotTestUser	0	6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4
72	718588586	Vladick	KtoMe	0	6592179212:AAGqTKaFg13WSw5Ywz7AKv0KfPpJYU72fc4
\.


--
-- Name: mess_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mess_id_seq', 1144, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 76, true);


--
-- PostgreSQL database dump complete
--


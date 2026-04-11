/*==============================================================*/
/* DBMS name:      PostgreSQL 9.x                               */
/* Created on:     10/4/2026 06:11:07                           */
/*==============================================================*/


drop index RELATIONSHIP_7_FK;

drop index ASSIGNMENT_PK;

drop table ASSIGNMENT;

drop index RELATIONSHIP_5_FK;

drop index CLASS_PK;

drop table CLASS;

drop index RELATIONSHIP_6_FK;

drop index RELATIONSHIP_4_FK;

drop index ENROLLMENT_PK;

drop table ENROLLMENT;

drop index RELATIONSHIP_3_FK;

drop index RELATIONSHIP_2_FK;

drop index RELATIONSHIP_1_FK;

drop index NOTIFICATION_PK;

drop table NOTIFICATION;

drop index STUDENT_PK;

drop table STUDENT;

drop index TEACHER_PK;

drop table TEACHER;

/*==============================================================*/
/* Table: ASSIGNMENT                                            */
/*==============================================================*/
create table ASSIGNMENT (
   ID_TEACHER           NUMERIC              not null,
   ID_CLASS             NUMERIC              not null,
   ID_ASSIGNMENT        NUMERIC              not null,
   TITLE                TEXT                 not null,
   DESCRIPTION_ASS      TEXT                 not null,
   MAX_SCORE            NUMERIC              not null,
   DUE_DATE             DATE                 not null,
   ATTACHMENT_URL       TEXT                 not null,
   CREATED_AT_ASS       DATE                 not null,
   constraint PK_ASSIGNMENT primary key (ID_TEACHER, ID_CLASS, ID_ASSIGNMENT)
);

/*==============================================================*/
/* Index: ASSIGNMENT_PK                                         */
/*==============================================================*/
create unique index ASSIGNMENT_PK on ASSIGNMENT (
ID_TEACHER,
ID_CLASS,
ID_ASSIGNMENT
);

/*==============================================================*/
/* Index: RELATIONSHIP_7_FK                                     */
/*==============================================================*/
create  index RELATIONSHIP_7_FK on ASSIGNMENT (
ID_TEACHER,
ID_CLASS
);

/*==============================================================*/
/* Table: CLASS                                                 */
/*==============================================================*/
create table CLASS (
   ID_TEACHER           NUMERIC              not null,
   ID_CLASS             NUMERIC              not null,
   NAME                 TEXT                 not null,
   ACCESS_CODE          TEXT                 not null,
   CREATED_AT_CLA       DATE                 not null,
   DESCRIPTION_CLA      TEXT                 not null,
   constraint PK_CLASS primary key (ID_TEACHER, ID_CLASS)
);

/*==============================================================*/
/* Index: CLASS_PK                                              */
/*==============================================================*/
create unique index CLASS_PK on CLASS (
ID_TEACHER,
ID_CLASS
);

/*==============================================================*/
/* Index: RELATIONSHIP_5_FK                                     */
/*==============================================================*/
create  index RELATIONSHIP_5_FK on CLASS (
ID_TEACHER
);

/*==============================================================*/
/* Table: ENROLLMENT                                            */
/*==============================================================*/
create table ENROLLMENT (
   ID_TEACHER           NUMERIC              not null,
   ID_CLASS             NUMERIC              not null,
   ID_STUDENT           NUMERIC              not null,
   ID_ENROLLMENT        NUMERIC              not null,
   CREATED_AT_ENR       DATE                 not null,
   constraint PK_ENROLLMENT primary key (ID_TEACHER, ID_CLASS, ID_STUDENT, ID_ENROLLMENT)
);

/*==============================================================*/
/* Index: ENROLLMENT_PK                                         */
/*==============================================================*/
create unique index ENROLLMENT_PK on ENROLLMENT (
ID_TEACHER,
ID_CLASS,
ID_STUDENT,
ID_ENROLLMENT
);

/*==============================================================*/
/* Index: RELATIONSHIP_4_FK                                     */
/*==============================================================*/
create  index RELATIONSHIP_4_FK on ENROLLMENT (
ID_STUDENT
);

/*==============================================================*/
/* Index: RELATIONSHIP_6_FK                                     */
/*==============================================================*/
create  index RELATIONSHIP_6_FK on ENROLLMENT (
ID_TEACHER,
ID_CLASS
);

/*==============================================================*/
/* Table: NOTIFICATION                                          */
/*==============================================================*/
create table NOTIFICATION (
   ID_STUDENT           NUMERIC              not null,
   ID_TEACHER           NUMERIC              not null,
   ID_CLASS             NUMERIC              not null,
   ID_ASSIGNMENT        NUMERIC              not null,
   ID_NOTIFICATION      NUMERIC              not null,
   MESSAGE              TEXT                 not null,
   IS_READ              BOOL                 not null,
   CREATED_AT_NOT       DATE                 not null,
   constraint PK_NOTIFICATION primary key (ID_STUDENT, ID_TEACHER, ID_CLASS, ID_ASSIGNMENT, ID_NOTIFICATION)
);

/*==============================================================*/
/* Index: NOTIFICATION_PK                                       */
/*==============================================================*/
create unique index NOTIFICATION_PK on NOTIFICATION (
ID_STUDENT,
ID_TEACHER,
ID_CLASS,
ID_ASSIGNMENT,
ID_NOTIFICATION
);

/*==============================================================*/
/* Index: RELATIONSHIP_1_FK                                     */
/*==============================================================*/
create  index RELATIONSHIP_1_FK on NOTIFICATION (
ID_TEACHER,
ID_CLASS,
ID_ASSIGNMENT
);

/*==============================================================*/
/* Index: RELATIONSHIP_2_FK                                     */
/*==============================================================*/
create  index RELATIONSHIP_2_FK on NOTIFICATION (
ID_TEACHER,
ID_CLASS
);

/*==============================================================*/
/* Index: RELATIONSHIP_3_FK                                     */
/*==============================================================*/
create  index RELATIONSHIP_3_FK on NOTIFICATION (
ID_STUDENT
);

/*==============================================================*/
/* Table: STUDENT                                               */
/*==============================================================*/
create table STUDENT (
   ID_STUDENT           NUMERIC              not null,
   constraint PK_STUDENT primary key (ID_STUDENT)
);

/*==============================================================*/
/* Index: STUDENT_PK                                            */
/*==============================================================*/
create unique index STUDENT_PK on STUDENT (
ID_STUDENT
);

/*==============================================================*/
/* Table: TEACHER                                               */
/*==============================================================*/
create table TEACHER (
   ID_TEACHER           NUMERIC              not null,
   constraint PK_TEACHER primary key (ID_TEACHER)
);

/*==============================================================*/
/* Index: TEACHER_PK                                            */
/*==============================================================*/
create unique index TEACHER_PK on TEACHER (
ID_TEACHER
);

alter table ASSIGNMENT
   add constraint FK_ASSIGNME_RELATIONS_CLASS foreign key (ID_TEACHER, ID_CLASS)
      references CLASS (ID_TEACHER, ID_CLASS)
      on delete restrict on update restrict;

alter table CLASS
   add constraint FK_CLASS_RELATIONS_TEACHER foreign key (ID_TEACHER)
      references TEACHER (ID_TEACHER)
      on delete restrict on update restrict;

alter table ENROLLMENT
   add constraint FK_ENROLLME_RELATIONS_STUDENT foreign key (ID_STUDENT)
      references STUDENT (ID_STUDENT)
      on delete restrict on update restrict;

alter table ENROLLMENT
   add constraint FK_ENROLLME_RELATIONS_CLASS foreign key (ID_TEACHER, ID_CLASS)
      references CLASS (ID_TEACHER, ID_CLASS)
      on delete restrict on update restrict;

alter table NOTIFICATION
   add constraint FK_NOTIFICA_RELATIONS_ASSIGNME foreign key (ID_TEACHER, ID_CLASS, ID_ASSIGNMENT)
      references ASSIGNMENT (ID_TEACHER, ID_CLASS, ID_ASSIGNMENT)
      on delete restrict on update restrict;

alter table NOTIFICATION
   add constraint FK_NOTIFICA_RELATIONS_CLASS foreign key (ID_TEACHER, ID_CLASS)
      references CLASS (ID_TEACHER, ID_CLASS)
      on delete restrict on update restrict;

alter table NOTIFICATION
   add constraint FK_NOTIFICA_RELATIONS_STUDENT foreign key (ID_STUDENT)
      references STUDENT (ID_STUDENT)
      on delete restrict on update restrict;


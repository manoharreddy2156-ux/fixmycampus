package app.model;

public enum Role {
    STUDENT,
    ADMIN,
    /** Staff of one specific Department - sees and works only their own department's queue. */
    DEPARTMENT_STAFF
}

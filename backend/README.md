# FixMyCampus — Backend

A Java full-stack web app for reporting and tracking campus issues (broken lights,
leaks, Wi-Fi failures, damaged furniture, cleanliness, classroom/lab faults), built
with **Spring Boot, Spring Security, Spring Data JPA, MySQL, Thymeleaf and vanilla CSS**.

This is a real, runnable Maven project — not a mock-up. It implements every feature
described in the original brief: student registration/login, reporting with optional
photo evidence, search/track/notifications for students, and view/search/assign/
prioritise/status-update/monitor for admins, through the shared lifecycle:

It also adds a third role beyond the original brief: **department staff**, who log in
and see only the complaints assigned to their own department, and can move a ticket to
`IN_PROGRESS` or `RESOLVED` (not `CLOSED` — that stays an admin/student confirmation
step). Admins create these accounts from **Department Accounts** in the nav bar; there
is no self-registration for this role.

```
Submitted → Assigned → In Progress → Resolved → Closed
```

## 1. One honest change from the original dependency list

The brief's `spring init` command only listed `web, thymeleaf, lombok, mysql, security,
devtools`. That combination has no way to talk to MySQL through an object model — it's
missing the ORM. **`spring-boot-starter-data-jpa` has been added** so the app can use
Spring Data repositories (`UserRepository`, `ComplaintRepository`, ...) against MySQL
instead of hand-written JDBC. Everything else matches the brief.

## 2. Prerequisites

- Java 17+ (project targets 17, but compiles fine with newer JDKs too — see note below)
- Maven 3.9+ (or just use the included `mvnw` if you add one)
- MySQL 8 running locally (or update the URL in `application.properties` to point
  elsewhere)

> **On a JDK newer than 23?** Lombok pins its own `javac`-internals patch to a specific
> JDK range, so an old Lombok version against a brand-new JDK fails with a cryptic
> `ExceptionInInitializerError` instead of a clear version error. This project pins
> `lombok.version` to a current release in `pom.xml`'s `<properties>` for exactly that
> reason — if you're on a JDK released after this was written, bump that property to
> whatever https://projectlombok.org/changelog lists as current. Also note: since
> JDK 23, `javac` no longer runs annotation processors by default, which is why this
> `pom.xml` explicitly registers Lombok via `annotationProcessorPaths` in the
> `maven-compiler-plugin` configuration rather than relying on the old default behavior.

## 3. Set up the database

```sql
CREATE DATABASE fixmycampus;
```

That's it — `spring.jpa.hibernate.ddl-auto=update` lets Hibernate create and evolve the
tables for you from the `@Entity` classes the first time the app starts.

## 4. Configure credentials

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

## 5. Run it

```bash
mvn spring-boot:run
```

Then open **http://localhost:8080**.

## 6. Try the look without logging in

Once the app is running, **http://localhost:8080/preview.html** is a self-contained demo
page with sample data — click through Student, Admin and Department views to see the
full flow (report → assign → resolve → status counters update) without needing an
account. It's plain HTML/CSS/JS with an in-memory mock complaint list, served as a
static resource (`src/main/resources/static/preview.html`) — **not** wired to the real
database, so nothing you do there is saved or shows up in the real app. It's there for
a quick look, and it's linked from the landing page. Everything below this is the real
app.

## 7. Logging in

A default admin account and six starter departments are seeded automatically on first
run (see `app/config/DataSeeder.java`):

| Role             | Email                       | Password  |
|------------------|-----------------------------|-----------|
| Admin            | admin@fixmycampus.edu       | admin123  |
| Department staff | electrical@fixmycampus.edu  | dept123   |

Students self-register from the **Register** page — every self-registered account is
created as a `STUDENT`. Department accounts are created by an admin from **Department
Accounts** in the nav bar (one demo account above is seeded automatically so the role
is testable right away).

> Change or remove the seeded admin password before using this anywhere real.

## 8. Project layout

```
src/main/java/app/
  BackendApplication.java      entry point
  config/
    SecurityConfig.java        role-based access, login/logout, password hashing
    WebConfig.java              serves uploaded evidence photos at /uploads/**
    DataSeeder.java              creates the default admin + departments on first run
  model/                        JPA entities: User, Complaint, Department, StatusLog
                                 + enums Role, Category, Priority, ComplaintStatus
  repository/                   Spring Data JPA interfaces (incl. the search/filter query)
  service/                      UserDetailsServiceImpl, UserService, ComplaintService,
                                 FileStorageService
  controller/                   HomeController, AuthController, StudentController,
                                 AdminController, DepartmentController
  dto/                          RegistrationForm, ComplaintForm, DepartmentUserForm

src/main/resources/
  application.properties
  templates/                    Thymeleaf views (index, login, register, student/*,
                                 admin/*, department/*)
  static/css/style.css          hand-written, responsive vanilla CSS (no front-end framework)
```

## 9. What's deliberately simple (and why)

- **One `User` table, not separate Student/Admin tables.** Spring Security's
  `UserDetailsService` needs one consistent place to authenticate against, so `role`
  is just a column (`STUDENT` / `ADMIN`) rather than two separate entities. This is the
  standard, practical pattern — the conceptual ER diagram in the project abstract can
  stay as two boxes; the implementation merges them for a working login system.
- **`spring.jpa.open-in-view=true`.** The Thymeleaf templates read lazily-fetched
  associations (`complaint.student`, `complaint.department`) directly while rendering,
  so the Hibernate session is kept open through view rendering rather than forcing a
  `JOIN FETCH` on every single query. Fine at this scale; worth revisiting if the
  dataset grows large.
- **Evidence photos are stored on local disk** (`./uploads`), not in the database or
  cloud storage — simplest option for a college project; swap `FileStorageService` for
  an S3/GCS-backed implementation later if needed.

## 10. Natural next steps

- Email/SMS notifications when a complaint's status changes (currently it's "pull"
  only — the student sees updates on their dashboard, nothing is pushed yet).
- Pagination on the admin dashboard once complaint volume grows.
- An "Reopen" action if a student is unsatisfied with a Closed complaint.
- Unit tests for `ComplaintService` (a starter test folder is included at
  `src/test/java/app/`).

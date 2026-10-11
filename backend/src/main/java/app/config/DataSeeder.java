package app.config;

import app.model.Department;
import app.model.Role;
import app.model.User;
import app.repository.DepartmentRepository;
import app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Runs once at startup so the app is usable immediately after `mvn spring-boot:run`,
 * without anyone having to hand-insert rows into MySQL first.
 *
 * Default logins:
 *   Admin              admin@fixmycampus.edu      / admin123
 *   Department staff   electrical@fixmycampus.edu / dept123   (Electrical Maintenance)
 * (change these passwords, or delete the rows, once you have real accounts)
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail("admin@fixmycampus.edu").isEmpty()) {
            User admin = new User();
            admin.setName("Campus Admin");
            admin.setEmail("admin@fixmycampus.edu");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
        }

        if (departmentRepository.count() == 0) {
            departmentRepository.saveAll(List.of(
                    new Department(null, "Electrical Maintenance", "Mr. R. Kumar"),
                    new Department(null, "Plumbing & Civil", "Mr. S. Iyer"),
                    new Department(null, "IT / Network Support", "Ms. A. Rao"),
                    new Department(null, "Housekeeping", "Mrs. P. Nair"),
                    new Department(null, "Carpentry & Furniture", "Mr. D. Singh"),
                    new Department(null, "Laboratory Services", "Dr. M. Verma")
            ));
        }

        // One demo department-staff login, so the new role is testable immediately
        // without an admin having to create one by hand first.
        if (userRepository.findByEmail("electrical@fixmycampus.edu").isEmpty()) {
            departmentRepository.findAll().stream()
                    .filter(d -> d.getName().equals("Electrical Maintenance"))
                    .findFirst()
                    .ifPresent(dept -> {
                        User deptStaff = new User();
                        deptStaff.setName("Electrical Maintenance Staff");
                        deptStaff.setEmail("electrical@fixmycampus.edu");
                        deptStaff.setPassword(passwordEncoder.encode("dept123"));
                        deptStaff.setRole(Role.DEPARTMENT_STAFF);
                        deptStaff.setDepartment(dept);
                        userRepository.save(deptStaff);
                    });
        }
    }
}

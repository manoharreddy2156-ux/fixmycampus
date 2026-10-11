package app.service;

import app.dto.DepartmentUserForm;
import app.dto.RegistrationForm;
import app.model.Department;
import app.model.Role;
import app.model.User;
import app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public boolean emailTaken(String email) {
        return userRepository.existsByEmail(email);
    }

    /** Self-registration always creates a STUDENT account; admins are seeded separately. */
    public User registerStudent(RegistrationForm form) {
        User user = new User();
        user.setName(form.getName());
        user.setRollNo(form.getRollNo());
        user.setEmail(form.getEmail());
        user.setPhone(form.getPhone());
        user.setPassword(passwordEncoder.encode(form.getPassword()));
        user.setRole(Role.STUDENT);
        return userRepository.save(user);
    }

    /** Only an admin can create a department login - there is no self-registration for this role. */
    public User createDepartmentStaff(DepartmentUserForm form, Department department) {
        User user = new User();
        user.setName(form.getName());
        user.setEmail(form.getEmail());
        user.setPhone(form.getPhone());
        user.setPassword(passwordEncoder.encode(form.getPassword()));
        user.setRole(Role.DEPARTMENT_STAFF);
        user.setDepartment(department);
        return userRepository.save(user);
    }

    public List<User> allDepartmentStaff() {
        return userRepository.findByRole(Role.DEPARTMENT_STAFF);
    }
}

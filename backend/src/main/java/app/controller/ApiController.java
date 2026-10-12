package app.controller;

import app.dto.ComplaintForm;
import app.dto.DepartmentUserForm;
import app.dto.DepartmentWorkStatus;
import app.dto.RegistrationForm;
import app.model.*;
import app.repository.ComplaintRepository;
import app.repository.DepartmentRepository;
import app.repository.UserRepository;
import app.service.ComplaintService;
import app.service.UserService;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ApiController {

    private final UserService userService;
    private final ComplaintService complaintService;
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    // ==================== DTOs ====================
    @Data
    @Builder
    public static class UserDto {
        private Long id;
        private String name;
        private String email;
        private String rollNo;
        private String phone;
        private Role role;
        private Long departmentId;
        private String departmentName;
    }

    @Data
    @Builder
    public static class ComplaintDto {
        private Long id;
        private String studentName;
        private String studentRollNo;
        private String studentEmail;
        private Long studentId;
        private Category category;
        private String location;
        private String description;
        private Priority priority;
        private ComplaintStatus status;
        private String imagePath;
        private Long departmentId;
        private String departmentName;
        private LocalDateTime dateReported;
    }

    @Data
    @Builder
    public static class StatusLogDto {
        private Long id;
        private Long complaintId;
        private String changedByName;
        private Role changedByRole;
        private ComplaintStatus status;
        private String remarks;
        private LocalDateTime updatedOn;
    }

    private UserDto mapUser(User u) {
        if (u == null) return null;
        return UserDto.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .rollNo(u.getRollNo())
                .phone(u.getPhone())
                .role(u.getRole())
                .departmentId(u.getDepartment() != null ? u.getDepartment().getId() : null)
                .departmentName(u.getDepartment() != null ? u.getDepartment().getName() : null)
                .build();
    }

    private ComplaintDto mapComplaint(Complaint c) {
        if (c == null) return null;
        return ComplaintDto.builder()
                .id(c.getId())
                .studentId(c.getStudent() != null ? c.getStudent().getId() : null)
                .studentName(c.getStudent() != null ? c.getStudent().getName() : "Anonymous")
                .studentRollNo(c.getStudent() != null ? c.getStudent().getRollNo() : "")
                .studentEmail(c.getStudent() != null ? c.getStudent().getEmail() : "")
                .category(c.getCategory())
                .location(c.getLocation())
                .description(c.getDescription())
                .priority(c.getPriority())
                .status(c.getStatus())
                .imagePath(c.getImagePath())
                .departmentId(c.getDepartment() != null ? c.getDepartment().getId() : null)
                .departmentName(c.getDepartment() != null ? c.getDepartment().getName() : "Unassigned")
                .dateReported(c.getDateReported())
                .build();
    }

    private StatusLogDto mapStatusLog(StatusLog l) {
        if (l == null) return null;
        return StatusLogDto.builder()
                .id(l.getId())
                .complaintId(l.getComplaint() != null ? l.getComplaint().getId() : null)
                .changedByName(l.getUpdatedBy() != null ? l.getUpdatedBy().getName() : "System")
                .changedByRole(l.getUpdatedBy() != null ? l.getUpdatedBy().getRole() : null)
                .status(l.getStatus())
                .remarks(l.getRemarks())
                .updatedOn(l.getUpdatedOn())
                .build();
    }

    // ==================== Metadata ====================
    @GetMapping("/meta")
    public ResponseEntity<Map<String, Object>> getMetadata() {
        Map<String, Object> meta = new HashMap<>();
        meta.put("categories", Category.values());
        meta.put("statuses", ComplaintStatus.values());
        meta.put("priorities", Priority.values());
        meta.put("departments", departmentRepository.findAll());
        return ResponseEntity.ok(meta);
    }

    // ==================== Authentication ====================
    @PostMapping("/auth/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Email and password are required."));
        }

        Optional<User> userOpt = userRepository.findByEmail(email.trim().toLowerCase());
        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Invalid email or password."));
        }

        User user = userOpt.get();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "user", mapUser(user)
        ));
    }

    @PostMapping("/auth/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegistrationForm form) {
        if (userService.emailTaken(form.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("success", false, "message", "An account with this email already exists."));
        }

        User registered = userService.registerStudent(form);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Student account registered successfully.",
                "user", mapUser(registered)
        ));
    }

    // ==================== Complaints ====================
    @GetMapping("/complaints")
    public ResponseEntity<List<ComplaintDto>> getComplaints(
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) ComplaintStatus status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) Long deptId,
            @RequestParam(required = false) String keyword
    ) {
        List<Complaint> results = complaintService.search(studentId, category, status, priority, deptId, keyword);
        return ResponseEntity.ok(results.stream().map(this::mapComplaint).collect(Collectors.toList()));
    }

    @GetMapping("/complaints/{id}")
    public ResponseEntity<Map<String, Object>> getComplaintDetails(@PathVariable Long id) {
        try {
            Complaint complaint = complaintService.get(id);
            List<StatusLog> history = complaintService.history(complaint);
            return ResponseEntity.ok(Map.of(
                    "complaint", mapComplaint(complaint),
                    "history", history.stream().map(this::mapStatusLog).collect(Collectors.toList())
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping(value = "/complaints", consumes = {"multipart/form-data"})
    public ResponseEntity<Map<String, Object>> submitComplaintWithFile(
            @RequestParam("studentId") Long studentId,
            @RequestParam("category") Category category,
            @RequestParam("location") String location,
            @RequestParam("description") String description,
            @RequestParam(value = "priority", defaultValue = "MEDIUM") Priority priority,
            @RequestParam(value = "evidence", required = false) MultipartFile evidence
    ) {
        User student = userRepository.findById(studentId).orElse(null);
        if (student == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Valid student ID is required."));
        }

        ComplaintForm form = new ComplaintForm();
        form.setCategory(category);
        form.setLocation(location);
        form.setDescription(description);
        form.setPriority(priority);
        form.setEvidence(evidence);

        Complaint saved = complaintService.submit(form, student);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "complaint", mapComplaint(saved)
        ));
    }

    @PostMapping(value = "/complaints/json", consumes = {"application/json"})
    public ResponseEntity<Map<String, Object>> submitComplaintJson(@RequestBody Map<String, Object> payload) {
        Long studentId = Long.valueOf(payload.get("studentId").toString());
        User student = userRepository.findById(studentId).orElse(null);
        if (student == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Valid student ID is required."));
        }

        ComplaintForm form = new ComplaintForm();
        form.setCategory(Category.valueOf(payload.get("category").toString()));
        form.setLocation(payload.get("location").toString());
        form.setDescription(payload.get("description").toString());
        if (payload.containsKey("priority")) {
            form.setPriority(Priority.valueOf(payload.get("priority").toString()));
        } else {
            form.setPriority(Priority.MEDIUM);
        }

        Complaint saved = complaintService.submit(form, student);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "complaint", mapComplaint(saved)
        ));
    }

    // ==================== Actions (Admin / Dept) ====================
    @PostMapping("/complaints/{id}/assign")
    public ResponseEntity<Map<String, Object>> assignDepartment(
            @PathVariable Long id,
            @RequestBody Map<String, Long> payload
    ) {
        Long deptId = payload.get("departmentId");
        Long adminId = payload.get("adminId");

        User admin = adminId != null ? userRepository.findById(adminId).orElse(null) : null;
        Department dept = departmentRepository.findById(deptId).orElse(null);
        if (dept == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Department not found."));
        }

        Complaint updated = complaintService.assignDepartment(id, dept, admin);
        return ResponseEntity.ok(Map.of("success", true, "complaint", mapComplaint(updated)));
    }

    @PostMapping("/complaints/{id}/priority")
    public ResponseEntity<Map<String, Object>> updatePriority(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload
    ) {
        Priority priority = Priority.valueOf(payload.get("priority").toString());
        Long adminId = payload.containsKey("adminId") && payload.get("adminId") != null
                ? Long.valueOf(payload.get("adminId").toString())
                : null;
        User admin = adminId != null ? userRepository.findById(adminId).orElse(null) : null;

        Complaint updated = complaintService.setPriority(id, priority, admin);
        return ResponseEntity.ok(Map.of("success", true, "complaint", mapComplaint(updated)));
    }

    @PostMapping("/complaints/{id}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload
    ) {
        ComplaintStatus newStatus = ComplaintStatus.valueOf(payload.get("status").toString());
        String remarks = payload.getOrDefault("remarks", "").toString();
        Long userId = payload.containsKey("userId") && payload.get("userId") != null
                ? Long.valueOf(payload.get("userId").toString())
                : null;
        User user = userId != null ? userRepository.findById(userId).orElse(null) : null;

        Complaint updated = complaintService.updateStatus(id, newStatus, remarks, user);
        return ResponseEntity.ok(Map.of("success", true, "complaint", mapComplaint(updated)));
    }

    // ==================== Admin Stats & Management ====================
    @GetMapping("/admin/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("submittedCount", complaintService.countByStatus(ComplaintStatus.SUBMITTED));
        stats.put("assignedCount", complaintService.countByStatus(ComplaintStatus.ASSIGNED));
        stats.put("inProgressCount", complaintService.countByStatus(ComplaintStatus.IN_PROGRESS));
        stats.put("resolvedCount", complaintService.countByStatus(ComplaintStatus.RESOLVED));
        stats.put("closedCount", complaintService.countByStatus(ComplaintStatus.CLOSED));
        stats.put("totalCount", complaintRepository.count());
        stats.put("departmentStats", complaintService.departmentWorkStatus());
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/admin/department-users")
    public ResponseEntity<Map<String, Object>> createDepartmentUser(@RequestBody DepartmentUserForm form) {
        Department dept = departmentRepository.findById(form.getDepartmentId()).orElse(null);
        if (dept == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Department not found."));
        }
        if (userService.emailTaken(form.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("success", false, "message", "An account with this email already exists."));
        }

        User staff = userService.createDepartmentStaff(form, dept);
        return ResponseEntity.ok(Map.of("success", true, "user", mapUser(staff)));
    }

    @GetMapping("/admin/department-users")
    public ResponseEntity<List<UserDto>> getDepartmentUsers() {
        return ResponseEntity.ok(userService.allDepartmentStaff().stream().map(this::mapUser).collect(Collectors.toList()));
    }
}

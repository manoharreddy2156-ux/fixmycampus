package app.service;

import app.dto.ComplaintForm;
import app.dto.DepartmentWorkStatus;
import app.model.*;
import app.repository.ComplaintRepository;
import app.repository.DepartmentRepository;
import app.repository.StatusLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Class-level @Transactional matters here: several methods below (submit,
 * assignDepartment, setPriority, updateStatus, updateStatusByDepartment) each
 * save the Complaint and then write a StatusLog entry as two separate calls.
 * Without a transaction wrapping both, a failure between them could leave a
 * complaint saved with no matching history row.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final StatusLogRepository statusLogRepository;
    private final DepartmentRepository departmentRepository;
    private final FileStorageService fileStorageService;

    /** Student reports a new issue -> status starts at SUBMITTED. */
    public Complaint submit(ComplaintForm form, User student) {
        Complaint complaint = new Complaint();
        complaint.setStudent(student);
        complaint.setCategory(form.getCategory());
        complaint.setLocation(form.getLocation());
        complaint.setDescription(form.getDescription());
        complaint.setPriority(form.getPriority());
        complaint.setStatus(ComplaintStatus.SUBMITTED);
        complaint.setImagePath(fileStorageService.store(form.getEvidence()));

        Complaint saved = complaintRepository.save(complaint);
        logStatus(saved, student, ComplaintStatus.SUBMITTED, "Complaint submitted by student.");
        return saved;
    }

    public List<Complaint> myComplaints(User student) {
        return complaintRepository.findByStudentOrderByDateReportedDesc(student);
    }

    public List<Complaint> search(Long studentId, Category category, ComplaintStatus status,
                                   Priority priority, Long deptId, String keyword) {
        String likeKeyword = (keyword == null || keyword.isBlank())
                ? null
                : "%" + keyword.trim().toLowerCase() + "%";
        return complaintRepository.search(studentId, category, status, priority, deptId, likeKeyword);
    }

    public Complaint get(Long id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Complaint not found: " + id));
    }

    public List<StatusLog> history(Complaint complaint) {
        return statusLogRepository.findByComplaintOrderByUpdatedOnAsc(complaint);
    }

    /** Admin routes the ticket to a department -> status moves to ASSIGNED. */
    public Complaint assignDepartment(Long complaintId, Department department, User admin) {
        Complaint complaint = get(complaintId);
        complaint.setDepartment(department);
        if (complaint.getStatus() == ComplaintStatus.SUBMITTED) {
            complaint.setStatus(ComplaintStatus.ASSIGNED);
        }
        Complaint saved = complaintRepository.save(complaint);
        logStatus(saved, admin, saved.getStatus(), "Assigned to " + department.getName() + ".");
        return saved;
    }

    public Complaint setPriority(Long complaintId, Priority priority, User admin) {
        Complaint complaint = get(complaintId);
        complaint.setPriority(priority);
        Complaint saved = complaintRepository.save(complaint);
        logStatus(saved, admin, saved.getStatus(), "Priority changed to " + priority + ".");
        return saved;
    }

    /** Moves a complaint forward through SUBMITTED -> ASSIGNED -> IN_PROGRESS -> RESOLVED -> CLOSED. */
    public Complaint updateStatus(Long complaintId, ComplaintStatus newStatus, String remarks, User admin) {
        Complaint complaint = get(complaintId);
        complaint.setStatus(newStatus);
        Complaint saved = complaintRepository.save(complaint);
        logStatus(saved, admin, newStatus, remarks);
        return saved;
    }

    public long countByStatus(ComplaintStatus status) {
        return complaintRepository.countByStatus(status);
    }

    /**
     * Complaints currently sitting in the queue of one department - this is what
     * backs a department-staff account's own dashboard.
     */
    public List<Complaint> forDepartment(Long departmentId) {
        return complaintRepository.search(null, null, null, null, departmentId, null);
    }

    /**
     * Department staff can move a ticket they own to IN_PROGRESS or RESOLVED -
     * never CLOSED (that stays an admin/student confirmation step) and never on
     * a complaint assigned to a different department.
     */
    public Complaint updateStatusByDepartment(Long complaintId, ComplaintStatus newStatus,
                                               String remarks, User deptStaff) {
        Complaint complaint = get(complaintId);

        if (complaint.getDepartment() == null
                || deptStaff.getDepartment() == null
                || !complaint.getDepartment().getId().equals(deptStaff.getDepartment().getId())) {
            throw new IllegalArgumentException("This complaint is not assigned to your department.");
        }
        if (newStatus != ComplaintStatus.IN_PROGRESS && newStatus != ComplaintStatus.RESOLVED) {
            throw new IllegalArgumentException("Department staff can only set In Progress or Resolved.");
        }

        complaint.setStatus(newStatus);
        Complaint saved = complaintRepository.save(complaint);
        logStatus(saved, deptStaff, newStatus, remarks);
        return saved;
    }

    /**
     * One row per department: how many of its complaints are Assigned, In Progress,
     * Resolved and Closed. This is what the admin dashboard's "Department Work
     * Status" table reads - a bird's-eye view of which teams are keeping up and
     * which have a backlog building.
     */
    public List<DepartmentWorkStatus> departmentWorkStatus() {
        return departmentRepository.findAll().stream()
                .map(dept -> new DepartmentWorkStatus(
                        dept.getId(),
                        dept.getName(),
                        complaintRepository.countByDepartmentIdAndStatus(dept.getId(), ComplaintStatus.ASSIGNED),
                        complaintRepository.countByDepartmentIdAndStatus(dept.getId(), ComplaintStatus.IN_PROGRESS),
                        complaintRepository.countByDepartmentIdAndStatus(dept.getId(), ComplaintStatus.RESOLVED),
                        complaintRepository.countByDepartmentIdAndStatus(dept.getId(), ComplaintStatus.CLOSED)
                ))
                .toList();
    }

    private void logStatus(Complaint complaint, User actor, ComplaintStatus status, String remarks) {
        statusLogRepository.save(new StatusLog(complaint, actor, status, remarks));
    }
}

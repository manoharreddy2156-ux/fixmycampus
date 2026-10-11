package app.repository;

import app.model.Complaint;
import app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    List<Complaint> findByStudentOrderByDateReportedDesc(User student);

    /**
     * One filter query backs both the student's "my complaints" search and the
     * admin's campus-wide search - any parameter left null is simply ignored.
     * studentId is null for the admin view (search across everyone).
     */
    @Query("""
            SELECT c FROM Complaint c
            WHERE (:studentId IS NULL OR c.student.id = :studentId)
              AND (:category IS NULL OR c.category = :category)
              AND (:status IS NULL OR c.status = :status)
              AND (:priority IS NULL OR c.priority = :priority)
              AND (:deptId IS NULL OR c.department.id = :deptId)
              AND (:keyword IS NULL OR LOWER(c.location) LIKE %:keyword%
                                      OR LOWER(c.description) LIKE %:keyword%)
            ORDER BY c.dateReported DESC
            """)
    List<Complaint> search(@Param("studentId") Long studentId,
                            @Param("category") app.model.Category category,
                            @Param("status") app.model.ComplaintStatus status,
                            @Param("priority") app.model.Priority priority,
                            @Param("deptId") Long deptId,
                            @Param("keyword") String keyword);

    long countByStatus(app.model.ComplaintStatus status);

    /** Backs the admin dashboard's per-department work-status breakdown. */
    long countByDepartmentIdAndStatus(Long departmentId, app.model.ComplaintStatus status);
}

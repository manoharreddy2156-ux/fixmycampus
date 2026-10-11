package app.repository;

import app.model.Complaint;
import app.model.StatusLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StatusLogRepository extends JpaRepository<StatusLog, Long> {
    List<StatusLog> findByComplaintOrderByUpdatedOnAsc(Complaint complaint);
}

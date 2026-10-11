package app.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * One row per status change on a complaint - this is what lets both the
 * student and the admin see a full, timestamped history of a ticket
 * instead of just its current state.
 */
@Entity
@Table(name = "status_logs")
@Getter
@Setter
@NoArgsConstructor
public class StatusLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaint complaint;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "updated_by", nullable = false)
    private User updatedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComplaintStatus status;

    private String remarks;

    @Column(nullable = false, updatable = false)
    private LocalDateTime updatedOn;

    @PrePersist
    void onCreate() {
        this.updatedOn = LocalDateTime.now();
    }

    public StatusLog(Complaint complaint, User updatedBy, ComplaintStatus status, String remarks) {
        this.complaint = complaint;
        this.updatedBy = updatedBy;
        this.status = status;
        this.remarks = remarks;
    }
}

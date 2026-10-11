package app.model;

/**
 * The shared lifecycle every complaint moves through:
 * SUBMITTED -> ASSIGNED -> IN_PROGRESS -> RESOLVED -> CLOSED
 */
public enum ComplaintStatus {
    SUBMITTED,
    ASSIGNED,
    IN_PROGRESS,
    RESOLVED,
    CLOSED
}

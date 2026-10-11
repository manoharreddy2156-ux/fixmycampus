package app.dto;

/**
 * One row of the admin dashboard's "Department Work Status" table - how many
 * complaints currently sit in each stage for one department. SUBMITTED isn't
 * counted here since an unassigned complaint doesn't belong to any department yet.
 */
public record DepartmentWorkStatus(
        Long departmentId,
        String departmentName,
        long assigned,
        long inProgress,
        long resolved,
        long closed
) {
    public long total() {
        return assigned + inProgress + resolved + closed;
    }

    public long openCount() {
        return assigned + inProgress;
    }
}

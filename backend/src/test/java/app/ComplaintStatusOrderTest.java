package app;

import app.model.ComplaintStatus;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;

/**
 * A plain unit test (no Spring context, no database) just to confirm the five
 * lifecycle stages stay declared in the documented order:
 * Submitted -> Assigned -> In Progress -> Resolved -> Closed.
 *
 * Add @SpringBootTest-based tests for the services/controllers once a test
 * database (or an in-memory one, e.g. H2) is wired up in a test profile.
 */
class ComplaintStatusOrderTest {

    @Test
    void lifecycleStagesAreInExpectedOrder() {
        ComplaintStatus[] expected = {
                ComplaintStatus.SUBMITTED,
                ComplaintStatus.ASSIGNED,
                ComplaintStatus.IN_PROGRESS,
                ComplaintStatus.RESOLVED,
                ComplaintStatus.CLOSED
        };
        assertArrayEquals(expected, ComplaintStatus.values());
    }
}

package app.dto;

import app.model.Category;
import app.model.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class ComplaintForm {

    @NotNull(message = "Please choose a category")
    private Category category;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Please describe the issue")
    private String description;

    @NotNull(message = "Please set a priority")
    private Priority priority = Priority.MEDIUM;

    /** Optional - a student can submit without a photo. */
    private MultipartFile evidence;
}

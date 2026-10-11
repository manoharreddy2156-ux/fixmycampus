package app.controller;

import app.dto.ComplaintForm;
import app.model.Category;
import app.model.ComplaintStatus;
import app.model.Priority;
import app.model.User;
import app.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/student")
@RequiredArgsConstructor
public class StudentController {

    private final ComplaintService complaintService;

    /** Dashboard: every complaint this student has filed, newest first. */
    @GetMapping("/dashboard")
    public String dashboard(@AuthenticationPrincipal User student, Model model) {
        model.addAttribute("complaints", complaintService.myComplaints(student));
        model.addAttribute("categories", Category.values());
        model.addAttribute("statuses", ComplaintStatus.values());
        model.addAttribute("priorities", Priority.values());
        return "student/dashboard";
    }

    /** Search/filter within the student's own complaints only. */
    @GetMapping("/complaints")
    public String search(@AuthenticationPrincipal User student,
                          @RequestParam(required = false) Category category,
                          @RequestParam(required = false) ComplaintStatus status,
                          @RequestParam(required = false) Priority priority,
                          @RequestParam(required = false) String keyword,
                          Model model) {

        model.addAttribute("complaints",
                complaintService.search(student.getId(), category, status, priority, null, keyword));
        model.addAttribute("categories", Category.values());
        model.addAttribute("statuses", ComplaintStatus.values());
        model.addAttribute("priorities", Priority.values());
        return "student/dashboard";
    }

    @GetMapping("/complaints/new")
    public String newComplaintForm(Model model) {
        model.addAttribute("complaintForm", new ComplaintForm());
        model.addAttribute("categories", Category.values());
        model.addAttribute("priorities", Priority.values());
        return "student/report-form";
    }

    @PostMapping("/complaints/new")
    public String submitComplaint(@AuthenticationPrincipal User student,
                                   @Valid @ModelAttribute ComplaintForm complaintForm,
                                   BindingResult bindingResult,
                                   Model model) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("categories", Category.values());
            model.addAttribute("priorities", Priority.values());
            return "student/report-form";
        }
        complaintService.submit(complaintForm, student);
        return "redirect:/student/dashboard";
    }

    /** Full lifecycle history for one of the student's own complaints. */
    @GetMapping("/complaints/{id}")
    public String viewComplaint(@AuthenticationPrincipal User student, @PathVariable Long id, Model model) {
        var complaint = complaintService.get(id);
        if (!complaint.getStudent().getId().equals(student.getId())) {
            return "redirect:/student/dashboard";
        }
        model.addAttribute("complaint", complaint);
        model.addAttribute("history", complaintService.history(complaint));
        return "student/complaint-detail";
    }
}

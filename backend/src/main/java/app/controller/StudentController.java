package app.controller;

import app.dto.ComplaintForm;
import app.model.Category;
import app.model.ComplaintStatus;
import app.model.Priority;
import app.model.User;
import app.repository.UserRepository;
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
    private final UserRepository userRepository;

    /** Dashboard: every complaint this student has filed, newest first. */
    @GetMapping("/dashboard")
    public String dashboard(@AuthenticationPrincipal User student, Model model) {
        if (student == null) {
            return "redirect:/login";
        }
        User currentStudent = userRepository.findById(student.getId()).orElse(student);
        model.addAttribute("complaints", complaintService.myComplaints(currentStudent));
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
        if (student == null) {
            return "redirect:/login";
        }
        model.addAttribute("complaints",
                complaintService.search(student.getId(), category, status, priority, null, keyword));
        model.addAttribute("categories", Category.values());
        model.addAttribute("statuses", ComplaintStatus.values());
        model.addAttribute("priorities", Priority.values());
        return "student/dashboard";
    }

    @GetMapping("/complaints/new")
    public String newComplaintForm(@AuthenticationPrincipal User student, Model model) {
        if (student == null) {
            return "redirect:/login";
        }
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
        if (student == null) {
            return "redirect:/login";
        }
        if (bindingResult.hasErrors()) {
            model.addAttribute("categories", Category.values());
            model.addAttribute("priorities", Priority.values());
            return "student/report-form";
        }
        User currentStudent = userRepository.findById(student.getId()).orElse(student);
        complaintService.submit(complaintForm, currentStudent);
        return "redirect:/student/dashboard";
    }

    /** Full lifecycle history for one of the student's own complaints. */
    @GetMapping("/complaints/{id}")
    public String viewComplaint(@AuthenticationPrincipal User student, @PathVariable Long id, Model model) {
        if (student == null) {
            return "redirect:/login";
        }
        var complaint = complaintService.get(id);
        if (complaint == null || complaint.getStudent() == null || !complaint.getStudent().getId().equals(student.getId())) {
            return "redirect:/student/dashboard";
        }
        model.addAttribute("complaint", complaint);
        model.addAttribute("history", complaintService.history(complaint));
        return "student/complaint-detail";
    }
}


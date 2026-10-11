package app.controller;

import app.dto.DepartmentUserForm;
import app.model.*;
import app.repository.DepartmentRepository;
import app.service.ComplaintService;
import app.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ComplaintService complaintService;
    private final DepartmentRepository departmentRepository;
    private final UserService userService;

    /** Campus-wide overview: open vs resolved counts, plus the full complaint list. */
    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        model.addAttribute("complaints", complaintService.search(null, null, null, null, null, null));
        addDashboardModel(model);
        return "admin/dashboard";
    }

    /** Search/filter across every complaint on campus - same view, filtered list. */
    @GetMapping("/complaints")
    public String search(@RequestParam(required = false) Category category,
                          @RequestParam(required = false) ComplaintStatus status,
                          @RequestParam(required = false) Priority priority,
                          @RequestParam(required = false) Long deptId,
                          @RequestParam(required = false) String keyword,
                          Model model) {
        model.addAttribute("complaints",
                complaintService.search(null, category, status, priority, deptId, keyword));
        addDashboardModel(model);
        return "admin/dashboard";
    }

    /**
     * Everything admin/dashboard.html needs besides the complaint list itself -
     * shared by both routes above so the filter dropdowns, status counters and
     * department work-status table never silently go missing on one of them.
     */
    private void addDashboardModel(Model model) {
        model.addAttribute("departments", departmentRepository.findAll());
        model.addAttribute("categories", Category.values());
        model.addAttribute("statuses", ComplaintStatus.values());
        model.addAttribute("priorities", Priority.values());

        model.addAttribute("submittedCount", complaintService.countByStatus(ComplaintStatus.SUBMITTED));
        model.addAttribute("assignedCount", complaintService.countByStatus(ComplaintStatus.ASSIGNED));
        model.addAttribute("inProgressCount", complaintService.countByStatus(ComplaintStatus.IN_PROGRESS));
        model.addAttribute("resolvedCount", complaintService.countByStatus(ComplaintStatus.RESOLVED));
        model.addAttribute("closedCount", complaintService.countByStatus(ComplaintStatus.CLOSED));
        model.addAttribute("departmentStats", complaintService.departmentWorkStatus());
    }

    @GetMapping("/complaints/{id}")
    public String viewComplaint(@PathVariable Long id, Model model) {
        var complaint = complaintService.get(id);
        model.addAttribute("complaint", complaint);
        model.addAttribute("history", complaintService.history(complaint));
        model.addAttribute("departments", departmentRepository.findAll());
        model.addAttribute("statuses", ComplaintStatus.values());
        model.addAttribute("priorities", Priority.values());
        return "admin/complaint-detail";
    }

    @PostMapping("/complaints/{id}/assign")
    public String assign(@AuthenticationPrincipal User admin, @PathVariable Long id,
                          @RequestParam Long departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new IllegalArgumentException("Department not found"));
        complaintService.assignDepartment(id, department, admin);
        return "redirect:/admin/complaints/" + id;
    }

    @PostMapping("/complaints/{id}/priority")
    public String priority(@AuthenticationPrincipal User admin, @PathVariable Long id,
                            @RequestParam Priority priority) {
        complaintService.setPriority(id, priority, admin);
        return "redirect:/admin/complaints/" + id;
    }

    @PostMapping("/complaints/{id}/status")
    public String status(@AuthenticationPrincipal User admin, @PathVariable Long id,
                          @RequestParam ComplaintStatus status,
                          @RequestParam(required = false) String remarks) {
        complaintService.updateStatus(id, status, remarks, admin);
        return "redirect:/admin/complaints/" + id;
    }

    // ---------- Department staff accounts (admin-created, not self-registered) ----------

    @GetMapping("/department-users")
    public String departmentUsers(Model model) {
        model.addAttribute("staff", userService.allDepartmentStaff());
        model.addAttribute("departments", departmentRepository.findAll());
        model.addAttribute("departmentUserForm", new DepartmentUserForm());
        return "admin/department-users";
    }

    @PostMapping("/department-users")
    public String createDepartmentUser(@Valid @ModelAttribute DepartmentUserForm departmentUserForm,
                                        BindingResult bindingResult,
                                        Model model) {
        if (userService.emailTaken(departmentUserForm.getEmail())) {
            bindingResult.rejectValue("email", "duplicate", "An account with this email already exists");
        }
        if (bindingResult.hasErrors()) {
            model.addAttribute("staff", userService.allDepartmentStaff());
            model.addAttribute("departments", departmentRepository.findAll());
            return "admin/department-users";
        }

        Department department = departmentRepository.findById(departmentUserForm.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Department not found"));
        userService.createDepartmentStaff(departmentUserForm, department);
        return "redirect:/admin/department-users";
    }
}

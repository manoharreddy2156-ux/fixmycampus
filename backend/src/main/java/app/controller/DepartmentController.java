package app.controller;

import app.model.ComplaintStatus;
import app.model.Department;
import app.model.User;
import app.repository.UserRepository;
import app.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

/**
 * The queue for one department's staff - only complaints assigned to their own
 * department are visible, and they can only move a ticket to IN_PROGRESS or
 * RESOLVED (enforced in ComplaintService.updateStatusByDepartment).
 */
@Controller
@RequestMapping("/department")
@RequiredArgsConstructor
public class DepartmentController {

    private final ComplaintService complaintService;
    private final UserRepository userRepository;

    @GetMapping("/dashboard")
    public String dashboard(@AuthenticationPrincipal User deptStaff, Model model) {
        if (deptStaff == null) {
            return "redirect:/login";
        }
        User staff = userRepository.findById(deptStaff.getId()).orElse(deptStaff);
        Department dept = staff.getDepartment();
        if (dept == null) {
            model.addAttribute("department", new Department(null, "Unassigned", "N/A"));
            model.addAttribute("complaints", Collections.emptyList());
            return "department/dashboard";
        }
        model.addAttribute("department", dept);
        model.addAttribute("complaints", complaintService.forDepartment(dept.getId()));
        return "department/dashboard";
    }

    @GetMapping("/complaints/{id}")
    public String viewComplaint(@AuthenticationPrincipal User deptStaff, @PathVariable Long id, Model model) {
        if (deptStaff == null) {
            return "redirect:/login";
        }
        User staff = userRepository.findById(deptStaff.getId()).orElse(deptStaff);
        if (staff.getDepartment() == null) {
            return "redirect:/department/dashboard";
        }
        var complaint = complaintService.get(id);
        if (complaint == null || complaint.getDepartment() == null
                || !complaint.getDepartment().getId().equals(staff.getDepartment().getId())) {
            return "redirect:/department/dashboard";
        }
        model.addAttribute("complaint", complaint);
        model.addAttribute("history", complaintService.history(complaint));
        return "department/complaint-detail";
    }

    @PostMapping("/complaints/{id}/status")
    public String updateStatus(@AuthenticationPrincipal User deptStaff, @PathVariable Long id,
                                @RequestParam ComplaintStatus status,
                                @RequestParam(required = false) String remarks,
                                Model model) {
        if (deptStaff == null) {
            return "redirect:/login";
        }
        User staff = userRepository.findById(deptStaff.getId()).orElse(deptStaff);
        try {
            complaintService.updateStatusByDepartment(id, status, remarks, staff);
        } catch (IllegalArgumentException e) {
            // Ownership/status-transition guard tripped - send them back to their own queue
            // rather than exposing a stack trace; this shouldn't normally happen since the
            // template only offers valid options, but the service-side check is the real guard.
        }
        return "redirect:/department/complaints/" + id;
    }
}


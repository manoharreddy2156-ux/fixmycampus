package app.controller;

import app.dto.RegistrationForm;
import app.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @GetMapping("/register")
    public String registerForm(Model model) {
        model.addAttribute("registrationForm", new RegistrationForm());
        return "register";
    }

    @PostMapping("/register")
    public String register(@Valid @ModelAttribute RegistrationForm registrationForm,
                            BindingResult bindingResult,
                            Model model) {

        if (userService.emailTaken(registrationForm.getEmail())) {
            bindingResult.rejectValue("email", "duplicate", "An account with this email already exists");
        }

        if (bindingResult.hasErrors()) {
            return "register";
        }

        userService.registerStudent(registrationForm);
        model.addAttribute("registered", true);
        return "login";
    }
}

package com.example.webjpademoapplicationsecondtry.controller;

import com.example.webjpademoapplicationsecondtry.dtos.*;
import com.example.webjpademoapplicationsecondtry.entity.AppUser;
import com.example.webjpademoapplicationsecondtry.entity.Request;
import com.example.webjpademoapplicationsecondtry.entity.Ride;
import com.example.webjpademoapplicationsecondtry.security.PasswordHashing;
import com.example.webjpademoapplicationsecondtry.service.EmailService;
import com.example.webjpademoapplicationsecondtry.service.PreferenceService;
import com.example.webjpademoapplicationsecondtry.service.RequestService;
import com.example.webjpademoapplicationsecondtry.service.AppUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/user")
public class AppUserController {
    private final AppUserService appUserService;

    private final PasswordHashing passwordHashing;

    private final RequestService requestService;

    private final EmailService emailService;

    private final PreferenceService preferenceService;

    @Autowired
    public AppUserController(AppUserService appUserService, PasswordHashing passwordHashing, RequestService requestService, EmailService emailService, PreferenceService preferenceService) {
        this.appUserService = appUserService;
        this.passwordHashing = passwordHashing;
        this.requestService = requestService;
        this.emailService = emailService;
        this.preferenceService = preferenceService;
    }

    @GetMapping
    public ResponseEntity<List<AppUser>> findAllUser(@RequestHeader(name = "Authorization") String token){
        // System.out.println(token);
        return appUserService.findAllUser(token);
    }

    @GetMapping("/statistics")
    public ResponseEntity<List<AppUser>> findUserRegisteredBefore(@RequestHeader(name = "Authorization") String token, @RequestParam String period){
        return appUserService.findUserByDate(period, token);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppUser> findUserById(@RequestHeader(name = "Authorization") String token, @PathVariable("id") UUID id){
        return appUserService.findUserById(id, token);
    }

    @GetMapping("/{id}/request")
    public ResponseEntity<Set<Request>> findUserRequests(@RequestHeader(name = "Authorization") String token, @PathVariable("id") UUID id){
        return appUserService.findUserRequests(id, token);
    }

    @GetMapping("/{id}/ride")
    public ResponseEntity<Set<Ride>> findUserRides(@RequestHeader(name = "Authorization") String token, @PathVariable("id") UUID id){
        return appUserService.findUserRides(id, token);
    }
    @PostMapping()
    public ResponseEntity<String> saveUser(@RequestBody AppUserRegisterDto appUser){
        return appUserService.saveUser(appUser, passwordHashing, emailService);
    }

    @PostMapping("/verify-email")
    public ResponseEntity<String> verifyUserEmail(@RequestBody VerifyEmailDto verifyEmailDto){
        return appUserService.verifyUserEmail(verifyEmailDto);
    }

    @PostMapping("/send-reset-password-code")
    public ResponseEntity<String> sendResetPasswordCode(@RequestBody String email){
        return appUserService.sendResetPasswordCode(email, emailService);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String>  forgetPassword(@RequestBody ForgetPasswordDto forgetPasswordDto){
        return appUserService.resetPassword(forgetPasswordDto, passwordHashing);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AppUserLoginDto userLoginDto){
        return appUserService.login(userLoginDto.getUsername(), userLoginDto.getPassword(), passwordHashing);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppUser> updateUser(@RequestHeader(name = "Authorization") String token, @RequestBody AppUserEditDto appUserEditDto, @PathVariable("id")UUID id){
        return appUserService.updateUser(appUserEditDto, id, token, passwordHashing, emailService);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@RequestHeader(name = "Authorization") String token, @PathVariable("id") UUID id){
        return appUserService.deleteUserById(token, id, requestService, preferenceService);
    }

}

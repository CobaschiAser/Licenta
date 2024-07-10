package com.example.webjpademoapplicationsecondtry.service;

import com.example.webjpademoapplicationsecondtry.dtos.AppUserEditDto;
import com.example.webjpademoapplicationsecondtry.dtos.AppUserRegisterDto;
import com.example.webjpademoapplicationsecondtry.dtos.ForgetPasswordDto;
import com.example.webjpademoapplicationsecondtry.dtos.VerifyEmailDto;
import com.example.webjpademoapplicationsecondtry.entity.AppUser;
import com.example.webjpademoapplicationsecondtry.entity.Request;
import com.example.webjpademoapplicationsecondtry.entity.Ride;
import com.example.webjpademoapplicationsecondtry.security.PasswordHashing;
import org.springframework.http.ResponseEntity;
/*import org.springframework.security.core.userdetails.User;*/

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface AppUserService {
    public ResponseEntity<List<AppUser>> findAllUser(String token);

    public ResponseEntity<List<AppUser>> findUserByDate(String period, String token);

    public ResponseEntity<AppUser> findUserById(UUID id, String token);

    public ResponseEntity<Set<Request>> findUserRequests(UUID userId, String token);

    public ResponseEntity<Set<Ride>> findUserRides(UUID userId, String token);

    public ResponseEntity<String> login(String username, String password, PasswordHashing passwordHashing);

    public ResponseEntity<String> saveUser(AppUserRegisterDto appUser, PasswordHashing passwordHashing, EmailService emailService);

    public ResponseEntity<AppUser> updateUser(AppUserEditDto appUserEditDto, UUID id, String token, PasswordHashing passwordHashing, EmailService emailService);

    public ResponseEntity<String> verifyUserEmail(VerifyEmailDto verifyEmailDto);

    public ResponseEntity<String> resetPassword(ForgetPasswordDto forgetPasswordDto, PasswordHashing passwordHashing);

    public ResponseEntity<String> sendResetPasswordCode(String email, EmailService emailService);
    public ResponseEntity<String> deleteUserById(String token, UUID id, RequestService requestService, PreferenceService preferenceService);
}

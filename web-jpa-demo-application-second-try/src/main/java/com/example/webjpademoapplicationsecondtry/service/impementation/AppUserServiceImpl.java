package com.example.webjpademoapplicationsecondtry.service.impementation;

import com.example.webjpademoapplicationsecondtry.dtos.AppUserEditDto;
import com.example.webjpademoapplicationsecondtry.dtos.AppUserRegisterDto;
import com.example.webjpademoapplicationsecondtry.dtos.ForgetPasswordDto;
import com.example.webjpademoapplicationsecondtry.dtos.VerifyEmailDto;
import com.example.webjpademoapplicationsecondtry.entity.AppUser;
import com.example.webjpademoapplicationsecondtry.entity.Request;
import com.example.webjpademoapplicationsecondtry.entity.Ride;
import com.example.webjpademoapplicationsecondtry.exception.NotFoundException;
import com.example.webjpademoapplicationsecondtry.utils.JwtUtil;
import com.example.webjpademoapplicationsecondtry.utils.PeriodConverter;
import com.example.webjpademoapplicationsecondtry.repository.AppUserRepository;
import com.example.webjpademoapplicationsecondtry.security.PasswordHashing;
import com.example.webjpademoapplicationsecondtry.service.EmailService;
import com.example.webjpademoapplicationsecondtry.service.PreferenceService;
import com.example.webjpademoapplicationsecondtry.service.RequestService;
import com.example.webjpademoapplicationsecondtry.service.AppUserService;
import org.apache.tomcat.util.http.parser.HttpParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.authority.AuthorityUtils;
// import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.SQLOutput;
import java.time.LocalDateTime;
import java.util.*;


@Service
public class AppUserServiceImpl implements AppUserService {
    private final AppUserRepository appUserRepository;

    private static final Logger logger = LoggerFactory.getLogger(AppUserServiceImpl.class);


    @Autowired
    public AppUserServiceImpl(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }


    @Override
    public ResponseEntity<List<AppUser>> findAllUser(String token) {

        if (!JwtUtil.isAuthorizedAdmin(token)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }

        List<AppUser> appUsers = appUserRepository.findAll();

        if(appUsers.isEmpty()) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(appUsers, HttpStatus.OK);
        }

    }

    @Override
    public ResponseEntity<List<AppUser>> findUserByDate(String period, String token) {
        Date date = PeriodConverter.convertPeriodToDate(period);
        //List<AppUser> foundUsers = appUserRepository.findUserRegisteredBefore(date);

        if (!JwtUtil.isAuthorizedAdmin(token)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }

        List<AppUser> foundUsers = this.userRegisteredBefore(date);
        return new ResponseEntity<>(foundUsers, HttpStatus.OK);
    }


    @Override
    public ResponseEntity<AppUser> findUserById(UUID id, String token) {

        if (!JwtUtil.isAuthorizedUser(token, id)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }

        AppUser user = appUserRepository.findUserById(id);

        if (user == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(user, HttpStatus.OK);


    }

    @Override
    public ResponseEntity<Set<Request>> findUserRequests(UUID uuid, String token){

        if (!JwtUtil.isAuthorizedUser(token, uuid)) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        AppUser appUser = appUserRepository.findUserById(uuid);

        if (appUser == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        /*if(appUser.getRequests().isEmpty()){
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }*/
        return new ResponseEntity<>(appUser.getRequests(), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Set<Ride>> findUserRides(UUID uuid, String token) {

        if (!JwtUtil.isAuthorizedUser(token, uuid)) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        AppUser appUser = appUserRepository.findUserById(uuid);

        if (appUser == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        /*if(appUser.getRides().isEmpty()){
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }*/

        return new ResponseEntity<>(appUser.getRides(), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> login(String username, String password, PasswordHashing passwordHashing) {
        try {
            logger.info("Attempting to log in user: {}", username);
            String salt = appUserRepository.getSalt(username);
            logger.info("Salt: {}", salt);
            AppUser appUser = null;
            if (salt != null) {
                appUser = appUserRepository.login(username, passwordHashing.hashString(password, salt));
            }
            if (appUser != null) {
                if (appUser.getVerificated()) {
                    UUID authenticationToken = UUID.randomUUID();
                    appUser.setAuthenticationToken(authenticationToken);
                    appUserRepository.save(appUser);
                    String token = JwtUtil.generateToken(authenticationToken.toString(), appUser.getIsAdmin(), appUser.getUsername(), appUser.getId().toString());
                    return new ResponseEntity<>(token, HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(null, HttpStatus.LOCKED);
                }
            }
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            logger.error("An error occurred during login", e);
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String>  resetPassword(ForgetPasswordDto forgetPasswordDto, PasswordHashing passwordHashing){
        String email = forgetPasswordDto.getEmail();
        String newPassword = forgetPasswordDto.getNewPassword();
        String resetPasswordCode = forgetPasswordDto.getResetPasswordCode();
        AppUser appUser = appUserRepository.findUserByEmail(email);
        if (appUser == null) {
            return new ResponseEntity<>("401 Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        if (!appUser.getVerificated()) {
            return new ResponseEntity<>("405 Method Not Allowed", HttpStatus.METHOD_NOT_ALLOWED);
        }
        if (appUser.getPasswordCode() == null) {
            return new ResponseEntity<>("404 Not Found.", HttpStatus.NOT_FOUND);
        }
        if (appUser.getPasswordCode().compareTo(resetPasswordCode) != 0) {
            return new ResponseEntity<>("409 Conflict.", HttpStatus.CONFLICT);
        }
        try {
            appUser.setPassword(passwordHashing.hashString(newPassword, appUser.getSalt()));
            appUser.setPasswordCode(null);
            appUserRepository.save(appUser);
            return new ResponseEntity<>("Success", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Override
    public ResponseEntity<String> sendResetPasswordCode(String email, EmailService emailService){
        email = email.replace("\"", "");
        System.out.println(email);
        AppUser appUser = appUserRepository.findUserByEmail(email);
        if (appUser == null) {
            return new ResponseEntity<>("401 Unauthorized", HttpStatus.UNAUTHORIZED);
        }
        if (!appUser.getVerificated()) {
            return new ResponseEntity<>("409 Conflict.", HttpStatus.CONFLICT);
        }
        // generate passwordCode;
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 5; i++) {
            sb.append(random.nextInt(10));
        }
        String randomString = sb.toString();
        appUser.setPasswordCode(randomString);
        this.appUserRepository.save(appUser);

        // send email with password code to user
        String body = "In order to reset your password, please introduce this password code in specified section. \n " +
                "Password code is:" + "  " + appUser.getPasswordCode();
        String subject = "RESET PASSWORD CODE";
        emailService.sendEmail(email, subject, body);
        return new ResponseEntity<>("Password code successfully sent", HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> verifyUserEmail(VerifyEmailDto verifyEmailDto){
        String email = verifyEmailDto.getEmail();
        String verificationCode = verifyEmailDto.getVerificationCode();

        AppUser appUser = appUserRepository.findUserByEmail(email);
        if (appUser == null) {
            return new ResponseEntity<>("No user with given email", HttpStatus.UNAUTHORIZED);
        }
        if (appUser.getVerificated()) {
            return new ResponseEntity<>("Already verified", HttpStatus.CONFLICT);
        }
        if (appUser.getVerificationCode().compareTo(verificationCode) != 0) {
            return new ResponseEntity<>("Incorrect verification code", HttpStatus.NOT_FOUND);
        }
        // verify email
        appUser.setVerificated(true);
        this.appUserRepository.save(appUser);
        return new ResponseEntity<>("Success", HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> saveUser(AppUserRegisterDto appUserRegisterDto, PasswordHashing passwordHashing, EmailService emailService) {
        try {
            AppUser byUsername = appUserRepository.findUserByUsername(appUserRegisterDto.getUsername());
            AppUser byEmail = appUserRepository.findUserByEmail(appUserRegisterDto.getEmail());
            if(byUsername != null || byEmail != null) {
                return new ResponseEntity<>("Invalid username or email address", HttpStatus.CONFLICT);
            }
            AppUser appUser = new AppUser(appUserRegisterDto);
            // set salt and password
            appUser.setSalt(passwordHashing.generateSalt());
            appUser.setPassword(passwordHashing.hashString(appUser.getPassword(), appUser.getSalt()));
            // set verification code - 5 random digits
            String verificationCode = this.generateVerificationCode();
            appUser.setVerificationCode(verificationCode);
            // set the registrationDate as current date
            LocalDateTime currentDayTime = LocalDateTime.now();
            java.sql.Date currentDate = java.sql.Date.valueOf(currentDayTime.toLocalDate());
            appUser.setRegistrationDate(currentDate);
            // save the user
            // System.out.println(appUser.getVerificationCode());
            appUserRepository.save(appUser);
            System.out.println("Successfully saved user");


            // send verification code by email
            String body = "We are so happy you chose to use out App. Please introduce this verification code in specified section. \n " +
                    "Verification code is:" + "  " + appUser.getVerificationCode();
            String subject = "EMAIL VERIFICATION";
            emailService.sendEmail(appUser.getEmail(), subject, body);

            return new ResponseEntity<>("User successfully Created", HttpStatus.OK);
        } catch (Exception e) {
            logger.error("An error occurred during register", e);
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Override
    public ResponseEntity<AppUser> updateUser(AppUserEditDto appUserEditDto, UUID id, String token, PasswordHashing passwordHashing, EmailService emailService) { // make it in function of id
        try {

            if (!JwtUtil.isAuthorizedUser(token, id)) {
                return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
            }

            AppUser toModifyAppUser = appUserRepository.findUserById(id);
            if(toModifyAppUser == null) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
            AppUser byEmail = appUserRepository.findUserByEmail(appUserEditDto.getEmail());
            if(byEmail != null && byEmail != toModifyAppUser){
                return new ResponseEntity<>(null, HttpStatus.CONFLICT);
            }


            AppUser byUsername = appUserRepository.findUserByUsername(appUserEditDto.getUsername());
            if(byUsername != null && byUsername != toModifyAppUser){
                return new ResponseEntity<>(null, HttpStatus.CONFLICT);
            }
            // set toModifyUser according to new attributes value
            toModifyAppUser.setName(appUserEditDto.getName());
            boolean sameEmail = toModifyAppUser.getEmail().compareTo(appUserEditDto.getEmail()) == 0;
            toModifyAppUser.setEmail(appUserEditDto.getEmail());
            toModifyAppUser.setUsername(appUserEditDto.getUsername());

            if (!sameEmail) {
                String newVerificationCode = this.generateVerificationCode();
                toModifyAppUser.setVerificationCode(newVerificationCode);
                toModifyAppUser.setVerificated(false);
                String body = "You successfully changed the email address. Please introduce this verification code in specified section. \n " +
                        "Verification code is:" + "  " + newVerificationCode;
                String subject = "EMAIL VERIFICATION";
                emailService.sendEmail(appUserEditDto.getEmail(), subject, body);
            }
            AppUser modifiedUser = appUserRepository.save(toModifyAppUser);
            return new ResponseEntity<>(modifiedUser, HttpStatus.OK);
        }catch(Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> deleteUserById(String token, UUID id, RequestService requestService, PreferenceService preferenceService) {

        if (!JwtUtil.isAuthorizedUser(token, id)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }

        AppUser appUser = appUserRepository.findUserById(id);

        if (appUser == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        Set<Request> copyRequests = new HashSet<>(appUser.getRequests());
        for(Request r : copyRequests) {
            requestService.deleteOnlyRequest(r.getId(), preferenceService);
        }
        appUserRepository.deleteById(id);
        return new ResponseEntity<>("Successfully deleted", HttpStatus.OK);
    }

    private String generateVerificationCode() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 5; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }
    private List<AppUser> userRegisteredBefore(Date date){
        List<AppUser> allUser = appUserRepository.findAll();
        List<AppUser> found = new ArrayList<>();
        for (AppUser appUser : allUser) {
            if (!(appUser.getRegistrationDate().before(date) || !appUser.getRegistrationDate().after(date))) {
                found.add(appUser);
            }
        }
        return found;
    }
}

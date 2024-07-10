package services;

import com.example.webjpademoapplicationsecondtry.dtos.AppUserEditDto;
import com.example.webjpademoapplicationsecondtry.dtos.AppUserRegisterDto;
import com.example.webjpademoapplicationsecondtry.dtos.ForgetPasswordDto;
import com.example.webjpademoapplicationsecondtry.dtos.VerifyEmailDto;
import com.example.webjpademoapplicationsecondtry.entity.AppUser;
import com.example.webjpademoapplicationsecondtry.entity.Request;
import com.example.webjpademoapplicationsecondtry.repository.AppUserRepository;
import com.example.webjpademoapplicationsecondtry.security.PasswordHashing;
import com.example.webjpademoapplicationsecondtry.service.impementation.AppUserServiceImpl;
import com.example.webjpademoapplicationsecondtry.service.impementation.EmailServiceImpl;
import com.example.webjpademoapplicationsecondtry.utils.JwtUtil;
import org.assertj.core.api.Assertions;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.MockedStatic;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.Set;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;

public class AppUserServiceTest {


    @Mock
    JavaMailSender emailSender;
    @Mock
    AppUserRepository appUserRepository;

    @Mock
    JwtUtil jwtutil;
    @InjectMocks
    AppUserServiceImpl appUserService;


    @InjectMocks
    EmailServiceImpl emailService;

    private AppUser appUser;

    private AppUser other;

    private VerifyEmailDto verifyEmailDto;
    private PasswordHashing passwordHashing;

    private AppUserRegisterDto appUserRegisterDto;

    private ForgetPasswordDto forgetPasswordDto;

    private AppUserEditDto appUserEditDto;

    private String token;


    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        this.other = new AppUser();
        this.other.setEmail("other@gmail.com");
        this.appUser = new AppUser();
        this.appUser.setUsername("test_user");
        this.appUser.setPassword("12345");
        this.appUser.setEmail("selfdrive2026@gmail.com");
        this.appUser.setVerificationCode("44959");
        this.appUser.setPasswordCode("11111");
        this.appUser.setIsAdmin(0);
        this.appUser.setId(UUID.fromString("913338ec-3626-4c1e-9e88-bb28759ebad3"));
        this.appUser.setSalt("ls�����Vč�\"");
        this.appUser.setVerificated(true);
        this.passwordHashing = new PasswordHashing();
        this.verifyEmailDto = new VerifyEmailDto(appUser.getEmail(), appUser.getVerificationCode());
        this.appUserRegisterDto = new AppUserRegisterDto(appUser.getName(), appUser.getEmail(), appUser.getUsername(), appUser.getPassword(), appUser.getPassword());
        this.forgetPasswordDto = new ForgetPasswordDto(appUser.getEmail(), appUser.getPasswordCode(), "new_password", "new_password");
        this.token = "token";
        this.appUserEditDto = new AppUserEditDto(appUser.getName(), appUser.getEmail(), appUser.getUsername(), appUser.getPassword(), "newPassword", "newPassword");
    }

    @Test
    public void whenLoginIsCalled_WithValidValues_ThenReturnCorrectResponse() throws NoSuchAlgorithmException, InvalidKeySpecException {
        // Arrange
        String hashedPassword = passwordHashing.hashString("12345", appUser.getSalt());

        Mockito.when(appUserRepository.login(appUser.getUsername(), hashedPassword)).thenReturn(appUser);
        Mockito.when(appUserRepository.getSalt(appUser.getUsername())).thenReturn(appUser.getSalt());

        // Act
        ResponseEntity<String> appUserLoggedIn = appUserService.login(appUser.getUsername(), appUser.getPassword(), passwordHashing);
        System.out.println(appUserLoggedIn);
        // Assert
        Assertions.assertThat(appUserLoggedIn).isNotNull();
        Assertions.assertThat(appUserLoggedIn.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void whenLoginIsCalled_WithInvalidValues_ThenReturnIncorrectResponse() throws NoSuchAlgorithmException, InvalidKeySpecException {
        // Arrange
        String hashedPassword = passwordHashing.hashString("12345", appUser.getSalt());

        Mockito.when(appUserRepository.login(appUser.getUsername(), hashedPassword)).thenReturn(appUser);
        Mockito.when(appUserRepository.getSalt(appUser.getUsername())).thenReturn(appUser.getSalt());

        // Act
        ResponseEntity<String> appUserLoggedIn = appUserService.login("bad_username", "bad_password", passwordHashing);
        System.out.println(appUserLoggedIn);
        // Assert
        Assertions.assertThat(appUserLoggedIn).isNotNull();
        Assertions.assertThat(appUserLoggedIn.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    public void whenVerifyEmailIsCalled_WithValidValues_ThenReturnCorrectResponse(){
        // Arrange
        appUser.setVerificated(false);
        Mockito.when(appUserRepository.findUserByEmail(appUser.getEmail())).thenReturn(appUser);

        // Act
        ResponseEntity<String> verifiedEmail = appUserService.verifyUserEmail(verifyEmailDto);

        // Assert
        Assertions.assertThat(verifiedEmail).isNotNull();
        Assertions.assertThat(verifiedEmail.getStatusCode()).isEqualTo(HttpStatus.OK);
        appUser.setVerificated(true);
    }

    @Test
    public void whenVerifyEmailIsCalled_WithWrongCode_ThenReturnNotFoundResponse() {
        // Arrange
        appUser.setVerificated(false);
        Mockito.when(appUserRepository.findUserByEmail(appUser.getEmail())).thenReturn(appUser);

        // Act
        ResponseEntity<String> verifiedEmail = appUserService.verifyUserEmail(new VerifyEmailDto(appUser.getEmail(), "wrong-code"));

        // Assert
        Assertions.assertThat(verifiedEmail).isNotNull();
        Assertions.assertThat(verifiedEmail.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        appUser.setVerificated(true);
    }

    @Test
    public void whenVerifyEmailIsCalled_WithWrongEmail_ThenReturnNotFoundResponse() {
        // Arrange
        appUser.setVerificated(false);
        Mockito.when(appUserRepository.findUserByEmail(appUser.getEmail())).thenReturn(appUser);

        // Act
        ResponseEntity<String> verifiedEmail = appUserService.verifyUserEmail(new VerifyEmailDto("wrong-email", appUser.getVerificationCode()));

        // Assert
        Assertions.assertThat(verifiedEmail).isNotNull();
        Assertions.assertThat(verifiedEmail.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        appUser.setVerificated(true);
    }

    @Test
    public void whenVerifyEmailIsCalled_WithValidValues_AlreadyVerified_ThenReturnConflictResponse() {
        // Arrange
        Mockito.when(appUserRepository.findUserByEmail(appUser.getEmail())).thenReturn(appUser);

        // Act
        ResponseEntity<String> verifiedEmail = appUserService.verifyUserEmail(verifyEmailDto);

        // Assert
        Assertions.assertThat(verifiedEmail).isNotNull();
        Assertions.assertThat(verifiedEmail.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
    }


    @Test
    public void whenSaveAppUserIsCalled_WithValidValues_ThenReturnCorrectResponse() {
        //Arrange
        doNothing().when(emailSender).send(any(SimpleMailMessage.class));

        // Act
        ResponseEntity<String> saveUser = appUserService.saveUser(appUserRegisterDto, passwordHashing, emailService);

        // Assert
        Assertions.assertThat(saveUser).isNotNull();
        Assertions.assertThat(saveUser.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void whenSaveAppUserIsCalled_WithTakenEmailOrUsername_ThenReturnConflictResponse() {
        //Arrange
        Mockito.when(appUserRepository.findUserByEmail(appUser.getEmail())).thenReturn(appUser);
        doNothing().when(emailSender).send(any(SimpleMailMessage.class));

        // Act
        ResponseEntity<String> saveUser = appUserService.saveUser(appUserRegisterDto, passwordHashing, emailService);

        // Assert
        Assertions.assertThat(saveUser).isNotNull();
        Assertions.assertThat(saveUser.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
    }


    @Test
    public void whenSendResetPasswordCodeIsCalled_withValidEmail_Verified_ThenReturnCorrectResponse() {
        //Arrange
        Mockito.when(appUserRepository.findUserByEmail(appUser.getEmail())).thenReturn(appUser);
        doNothing().when(emailSender).send(any(SimpleMailMessage.class));

        // Act
        ResponseEntity<String> sendCode = appUserService.sendResetPasswordCode(appUser.getEmail(), emailService);

        // Assert
        Assertions.assertThat(sendCode).isNotNull();
        Assertions.assertThat(sendCode.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void whenSendResetPasswordCodeIsCalled_withInvalidEmail_ThenReturnIncorrectResponse() {
        //Arrange
        appUser.setVerificated(false);
        Mockito.when(appUserRepository.findUserByEmail(appUser.getEmail())).thenReturn(appUser);
        doNothing().when(emailSender).send(any(SimpleMailMessage.class));

        // Act
        ResponseEntity<String> sendCode = appUserService.sendResetPasswordCode(appUser.getEmail(), emailService);

        // Assert
        Assertions.assertThat(sendCode).isNotNull();
        Assertions.assertThat(sendCode.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        appUser.setVerificated(true);
    }

    @Test
    public void whenSendResetPasswordCodeIsCalled_withValidEmail_Unverified_ThenReturnIncorrectResponse() {
        //Arrange

        // Act
        ResponseEntity<String> sendCode = appUserService.sendResetPasswordCode(appUser.getEmail(), emailService);

        // Assert
        Assertions.assertThat(sendCode).isNotNull();
        Assertions.assertThat(sendCode.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    public void whenResetPasswordIsCalled_InvalidEmail_ThenReturnUnauthorizedResponse() {
        //Arrange

        doNothing().when(emailSender).send(any(SimpleMailMessage.class));

        // Act
        ResponseEntity<String> resetPassword = appUserService.resetPassword(forgetPasswordDto, passwordHashing);

        // Assert
        Assertions.assertThat(resetPassword).isNotNull();
        Assertions.assertThat(resetPassword.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    public void whenResetPasswordIsCalled_validEmail_ThenReturnCorrectResponse() {
        //Arrange
        Mockito.when(appUserRepository.findUserByEmail(appUser.getEmail())).thenReturn(appUser);
        doNothing().when(emailSender).send(any(SimpleMailMessage.class));

        // Act
        ResponseEntity<String> resetPassword = appUserService.resetPassword(forgetPasswordDto, passwordHashing);

        // Assert
        Assertions.assertThat(resetPassword).isNotNull();
        Assertions.assertThat(resetPassword.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void whenResetPasswordIsCalled_InvalidEmail_ThenReturnIncorrectResponse() {
        //Arrange

        doNothing().when(emailSender).send(any(SimpleMailMessage.class));

        // Act
        ResponseEntity<String> sendCode = appUserService.sendResetPasswordCode(appUser.getEmail(), emailService);

        // Assert
        Assertions.assertThat(sendCode).isNotNull();
        Assertions.assertThat(sendCode.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }


    @Test
    public void whenEditAppUserIsCalled_ValidValues_ThenReturnCorrectResponse() {
        // Arrange
        doNothing().when(emailSender).send(any(SimpleMailMessage.class));
        Mockito.when(appUserRepository.findUserById(appUser.getId())).thenReturn(appUser);
        Mockito.when(appUserRepository.save(any(AppUser.class))).thenReturn(appUser);

        try (MockedStatic<JwtUtil> mockedJwtUtil = Mockito.mockStatic(JwtUtil.class)) {
            // Arrange
            mockedJwtUtil.when(() -> JwtUtil.isAuthorizedUser(token, appUser.getId())).thenReturn(true);

            // Act
            ResponseEntity<AppUser> editedUser = appUserService.updateUser(appUserEditDto, appUser.getId(), token, passwordHashing, emailService);

            // Assert
            Assertions.assertThat(editedUser).isNotNull();
            Assertions.assertThat(editedUser.getStatusCode()).isEqualTo(HttpStatus.OK);
            Assertions.assertThat(editedUser.getBody()).isEqualTo(appUser);  // Optional: check if the returned user is as expected
        }
    }

    @Test
    public void whenEditAppUserIsCalled_InvalidValues_ThenReturnConflictResponse() {
        // Arrange
        doNothing().when(emailSender).send(any(SimpleMailMessage.class));
        Mockito.when(appUserRepository.findUserById(appUser.getId())).thenReturn(appUser);
        Mockito.when(appUserRepository.save(any(AppUser.class))).thenReturn(appUser);
        Mockito.when(appUserRepository.findUserByEmail(other.getEmail())).thenReturn(other);

        appUserEditDto.setEmail(other.getEmail());

        try (MockedStatic<JwtUtil> mockedJwtUtil = Mockito.mockStatic(JwtUtil.class)) {
            // Arrange
            mockedJwtUtil.when(() -> JwtUtil.isAuthorizedUser(token, appUser.getId())).thenReturn(true);

            // Act
            ResponseEntity<AppUser> editedUser = appUserService.updateUser(appUserEditDto, appUser.getId(), token, passwordHashing, emailService);

            // Assert
            Assertions.assertThat(editedUser).isNotNull();
            Assertions.assertThat(editedUser.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        }
    }

    @Test
    public void whenGetUserRequestsIsCalled_validValues_ThenReturnCorrectResponse() {
        // Arrange

        Mockito.when(appUserRepository.findUserById(appUser.getId())).thenReturn(appUser);

        try (MockedStatic<JwtUtil> mockedJwtUtil = Mockito.mockStatic(JwtUtil.class)) {
            // Arrange
            mockedJwtUtil.when(() -> JwtUtil.isAuthorizedUser(token, appUser.getId())).thenReturn(true);

            // Act
            ResponseEntity<Set<Request>> userRequests = appUserService.findUserRequests(appUser.getId(), token);

            // Assert
            Assertions.assertThat(userRequests).isNotNull();
            Assertions.assertThat(userRequests.getStatusCode()).isEqualTo(HttpStatus.OK);
        }
    }

    @Test
    public void whenGetUserRequestsIsCalled_badToken_ThenReturnUnauthorizedResponse() {
        // Arrange

        Mockito.when(appUserRepository.findUserById(appUser.getId())).thenReturn(appUser);

        try (MockedStatic<JwtUtil> mockedJwtUtil = Mockito.mockStatic(JwtUtil.class)) {
            // Arrange
            mockedJwtUtil.when(() -> JwtUtil.isAuthorizedUser(token, appUser.getId())).thenReturn(false);

            // Act
            ResponseEntity<Set<Request>> userRequests = appUserService.findUserRequests(appUser.getId(), token);

            // Assert
            Assertions.assertThat(userRequests).isNotNull();
            Assertions.assertThat(userRequests.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        }
    }



    @After
    public void tearDown() {
        appUser = null;
        passwordHashing = null;
        verifyEmailDto = null;
        appUserRegisterDto = null;
        forgetPasswordDto = null;
        appUserEditDto = null;
        token = null;
    }
}

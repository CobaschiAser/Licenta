package com.example.webjpademoapplicationsecondtry.dtos;

public class VerifyEmailDto {
    private String email;
    private String verificationCode;

    public VerifyEmailDto(String email, String verificationCode){
        this.email = email;
        this.verificationCode = verificationCode;
    }

    public String getEmail() {
        return this.email;
    }

    public String getVerificationCode() {
        return this.verificationCode;
    }
}

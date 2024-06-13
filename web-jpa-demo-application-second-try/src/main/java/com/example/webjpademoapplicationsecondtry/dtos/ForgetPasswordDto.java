package com.example.webjpademoapplicationsecondtry.dtos;

public class ForgetPasswordDto {
    private String email;
    private String resetPasswordCode;
    private String newPassword;

    private String confirmNewPassword;

    public ForgetPasswordDto(String email, String resetPasswordCode, String newPassword, String confirmNewPassword){
        this.email = email;
        this.resetPasswordCode = resetPasswordCode;
        this.newPassword = newPassword;
        this.confirmNewPassword = confirmNewPassword;
    }

    public String getEmail(){
        return this.email;
    }

    public String getResetPasswordCode(){
        return this.resetPasswordCode;
    }

    public String getNewPassword(){
        return this.newPassword;
    }

}

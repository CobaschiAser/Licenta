package com.example.webjpademoapplicationsecondtry.error;

public class ErrorResponse {
    private String message;
    public ErrorResponse(String message){
        this.message = message;
    }
    public String getMessage(){
        return this.message;
    }
}

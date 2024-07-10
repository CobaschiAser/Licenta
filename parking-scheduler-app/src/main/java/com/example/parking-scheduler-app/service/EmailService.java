package com.example.webjpademoapplicationsecondtry.service;

import org.springframework.stereotype.Service;

public interface EmailService {

    void sendEmail(String to, String subject, String body);

}

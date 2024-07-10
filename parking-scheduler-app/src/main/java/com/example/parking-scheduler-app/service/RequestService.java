package com.example.webjpademoapplicationsecondtry.service;

import com.example.webjpademoapplicationsecondtry.entity.Request;
import org.springframework.http.ResponseEntity;

import java.sql.Date;
import java.util.List;
import java.util.UUID;

public interface RequestService {
    public ResponseEntity<Request> findRequestById(String token, Long id);

    public List<Request> findAllRequest();

    public List<Request> findRequestByDate(Date date);


    public ResponseEntity<Request> saveRequest(String token, Request request, UUID userId, VehicleService vehicleService, PreferenceService preferenceService);

    public Request updateRequest(String token, Request request, Long id, VehicleService vehicleService, PreferenceService preferenceService);
    public void deleteRequestById(Long id, PreferenceService preferenceService);

    //public void safeDeleteRequest(Long id);

    public void deleteOnlyRequest(Long id, PreferenceService preferenceService);

    public void startRequest(String token, Long id);

    public void finishRequest(String token, Long id);
    



}

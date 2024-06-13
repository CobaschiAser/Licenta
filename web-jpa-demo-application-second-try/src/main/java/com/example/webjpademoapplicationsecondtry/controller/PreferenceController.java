package com.example.webjpademoapplicationsecondtry.controller;

import com.example.webjpademoapplicationsecondtry.entity.Parking;
import com.example.webjpademoapplicationsecondtry.entity.Preference;
import com.example.webjpademoapplicationsecondtry.service.PreferenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/preference")
public class PreferenceController {
    @Autowired
    private final PreferenceService preferenceService;

    public PreferenceController(PreferenceService preferenceService) {
        this.preferenceService = preferenceService;
    }

    @GetMapping("/{uuid}")
    public ResponseEntity<Preference> findUserPreference(@RequestHeader(name = "Authorization") String token, @PathVariable UUID uuid){
        return preferenceService.getPreferenceByUserUUID(token, uuid);
    }

}

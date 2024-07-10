package com.example.webjpademoapplicationsecondtry.service;

import com.example.webjpademoapplicationsecondtry.entity.Preference;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

public interface PreferenceService {
    public ResponseEntity<Preference> getPreferenceByUserUUID(String token, UUID userUUID);

    public ResponseEntity<Preference> savePreference(UUID userUUID);

    //public ResponseEntity<Preference> updatePreference(UUID userUUID);
}

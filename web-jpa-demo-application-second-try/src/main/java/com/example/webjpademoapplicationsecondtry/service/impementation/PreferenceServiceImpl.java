package com.example.webjpademoapplicationsecondtry.service.impementation;

import com.example.webjpademoapplicationsecondtry.entity.Preference;
import com.example.webjpademoapplicationsecondtry.entity.Request;
import com.example.webjpademoapplicationsecondtry.repository.PreferenceRepository;
import com.example.webjpademoapplicationsecondtry.repository.RequestRepository;
import com.example.webjpademoapplicationsecondtry.service.PreferenceService;
import com.example.webjpademoapplicationsecondtry.utils.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class PreferenceServiceImpl implements PreferenceService {

    private final PreferenceRepository preferenceRepository;

    private final RequestRepository requestRepository;


    public PreferenceServiceImpl(PreferenceRepository preferenceRepository, RequestRepository requestRepository) {
        this.preferenceRepository = preferenceRepository;
        this.requestRepository = requestRepository;
    }

    @Override
    public ResponseEntity<Preference> getPreferenceByUserUUID(String token, UUID userUUID) {

        if (!JwtUtil.isAuthorizedUser(token, userUUID)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }

        Preference preference = preferenceRepository.getPreferenceByUserUUID(userUUID);
        if (preference == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(preference, HttpStatus.OK);
        }
    }


    @Override
    public ResponseEntity<Preference> savePreference(UUID userUUID) {
        List<Request> userRequests = requestRepository.findRequestByUserUUID(userUUID);

        if (userRequests.isEmpty()) {
            Preference preference = preferenceRepository.getPreferenceByUserUUID(userUUID);
            preferenceRepository.deleteById(preference.getId());
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        Map<String, Integer> departureFrequency = new HashMap<>();
        Map<String, Integer> arrivalFrequency = new HashMap<>();
        Map<String, Integer> vehicleTypeFrequency = new HashMap<>();

        for (Request request : userRequests) {

            String departure = request.getDeparture();
            departureFrequency.put(departure, departureFrequency.getOrDefault(departure, 0) + 1);

            String arrival = request.getArrival();
            arrivalFrequency.put(arrival, arrivalFrequency.getOrDefault(arrival, 0) + 1);

            String vehicleType = request.getVehicleType();
            vehicleTypeFrequency.put(vehicleType, vehicleTypeFrequency.getOrDefault(vehicleType, 0) + 1);
        }

        String mostFreqDeparture = this.getMaxFreqKey(departureFrequency);
        String mostFreqArrival = this.getMaxFreqKey(arrivalFrequency);
        String mostFreqVehicleType = this.getMaxFreqKey(vehicleTypeFrequency);

        Preference preference = preferenceRepository.getPreferenceByUserUUID(userUUID);
        if (preference == null) {
            Preference newPreference = new Preference(mostFreqDeparture, mostFreqArrival, mostFreqVehicleType, userUUID);
            preferenceRepository.save(newPreference);
            return new ResponseEntity<>(newPreference, HttpStatus.OK);
        } else {
            preference.setDeparture(mostFreqDeparture);
            preference.setArrival(mostFreqArrival);
            preference.setVehicleType(mostFreqVehicleType);
            preferenceRepository.save(preference);
            return new ResponseEntity<>(preference, HttpStatus.OK);
        }

    }

    private String getMaxFreqKey(Map<String, Integer> fromMap) {
        int maxFrequency = 0;
        String result = null;

        for (Map.Entry<String, Integer> entry : fromMap.entrySet()) {
            if (entry.getValue() > maxFrequency) {
                maxFrequency = entry.getValue();
                result = entry.getKey();
            }
        }
        return result;
    }

}

package com.example.webjpademoapplicationsecondtry.service;

import com.example.webjpademoapplicationsecondtry.entity.Move;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface RebalancingService {

    public ResponseEntity<Map<String, Long>> findMovesByParking(String token, Long parkingId);
    public ResponseEntity<List<Move>> rebalance(String token, String period, ParkingService parkingService, VehicleService vehicleService);
}

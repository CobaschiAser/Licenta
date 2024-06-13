package com.example.webjpademoapplicationsecondtry.controller;

import com.example.webjpademoapplicationsecondtry.entity.Move;
import com.example.webjpademoapplicationsecondtry.service.ParkingService;
import com.example.webjpademoapplicationsecondtry.service.RebalancingService;
import com.example.webjpademoapplicationsecondtry.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/rebalancing")

public class RebalancingController {

    @Autowired
    private final RebalancingService rebalancingService;

    @Autowired
    private final ParkingService parkingService;

    @Autowired
    private final VehicleService vehicleService;

    public RebalancingController(RebalancingService rebalancingService, ParkingService parkingService, VehicleService vehicleService) {
        this.rebalancingService = rebalancingService;
        this.parkingService = parkingService;
        this.vehicleService = vehicleService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Long>> findMovesByParking(@RequestHeader(name = "authorization") String token, @RequestParam String parkingId) {
        Long newId = Long.parseLong(parkingId);
        return rebalancingService.findMovesByParking(token, newId);
    }

    @PostMapping
    public ResponseEntity<List<Move>> rebalance(@RequestHeader(name = "authorization") String token, @RequestParam String period) {
        return rebalancingService.rebalance(token, period, parkingService, vehicleService);
    }


}

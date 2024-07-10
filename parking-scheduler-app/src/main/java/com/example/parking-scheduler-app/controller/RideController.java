package com.example.webjpademoapplicationsecondtry.controller;

import com.example.webjpademoapplicationsecondtry.entity.Request;
import com.example.webjpademoapplicationsecondtry.entity.Ride;
import com.example.webjpademoapplicationsecondtry.service.RideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/ride")
public class RideController {
    @Autowired
    private final RideService rideService;

    public RideController(RideService rideService) {
        this.rideService = rideService;
    }


    @GetMapping
    public List<Ride> findAllRides(){
        return rideService.findAllRide();
    }


    @GetMapping("/{id}")
    public ResponseEntity<Ride> findRideById(@RequestHeader(name = "Authorization") String token, @PathVariable ("id") String id){
        Long longId = Long.parseLong(id);
        return rideService.findRideById(token, longId);
    }

    @PostMapping("/estimate-price")
    public ResponseEntity<Double> estimatePrice(@RequestHeader(name = "Authorization") String token, @RequestBody Request request){
        System.out.println("HERE");
        return rideService.estimatePrice(token, request);
    }

}

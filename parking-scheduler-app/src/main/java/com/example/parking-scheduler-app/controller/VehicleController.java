package com.example.webjpademoapplicationsecondtry.controller;

import com.example.webjpademoapplicationsecondtry.entity.Vehicle;
import com.example.webjpademoapplicationsecondtry.service.ParkingService;
import com.example.webjpademoapplicationsecondtry.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/vehicle")
public class VehicleController {
    private final VehicleService vehicleService;

    private final ParkingService parkingService;


    @Autowired
    public VehicleController(VehicleService vehicleService, ParkingService parkingService) {
        this.vehicleService = vehicleService;
        this.parkingService = parkingService;
    }

    @GetMapping
    public ResponseEntity<List<Vehicle>> findAllVehicle(@RequestHeader(name = "Authorization") String token){
        return vehicleService.findAllVehicle(token);
    }


    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Integer>> getVehicleStatistics(@RequestHeader(name = "Authorization") String token, @RequestParam  String criteria) {
        return vehicleService.getVehicleStatistics(criteria, token);
    }

    @GetMapping("/can-be-added")
    public ResponseEntity<List<Vehicle>> getVehiclesCanBeAdded(@RequestHeader(name = "Authorization") String token) {
        return vehicleService.getVehiclesCanBeAdded(token);
    }

    @GetMapping("/can-be-removed")
    public ResponseEntity<List<Vehicle>> getVehiclesCanBeRemoved(@RequestHeader(name = "Authorization") String token, @RequestParam String parkingId) {
        Long id = Long.parseLong(parkingId);
        return vehicleService.getVehiclesCanBeRemoved(token, id);
    }

    @GetMapping("/all-after-request")
    public ResponseEntity<List<Vehicle>> getVehiclesAfterRequest(@RequestHeader(name = "Authorization") String token, @RequestParam String parkingId) {
        Long id = Long.parseLong(parkingId);
        return vehicleService.getVehiclesAfterRequest(token, id);
    }

    @GetMapping("/available-in-departure")
    public ResponseEntity<List<Vehicle>> availableVehicle(@RequestHeader(name = "Authorization") String token, @RequestParam String departure, @RequestParam String date, @RequestParam Integer startHour, @RequestParam String vehicleType){
        System.out.println(date);
        Date convertedDate = Date.valueOf(date);
        System.out.println(convertedDate);
        return vehicleService.willBeInDeparture(token, departure, convertedDate, startHour, vehicleType);
    }

    @GetMapping("/available-in-departure-update")
    public ResponseEntity<List<Vehicle>> availableVehicleUpdate(@RequestHeader(name = "Authorization") String token, @RequestParam String departure, @RequestParam String date, @RequestParam Integer startHour,@RequestParam Long initialVehicleId, @RequestParam String vehicleType){
        Date convertedDate = Date.valueOf(date);
        return vehicleService.willBeInDepartureUpdate(token, departure, convertedDate, startHour,initialVehicleId, vehicleType);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> findVehicleById(@RequestHeader(name = "Authorization") String token, @PathVariable("id") Long id) {

        return vehicleService.findVehicleById(id, token);
    }

    @PostMapping
    public ResponseEntity<Vehicle> saveVehicle(@RequestHeader(name = "Authorization") String token, @RequestBody Vehicle vehicle){
        return vehicleService.saveVehicle(token, vehicle);
    }

    @PostMapping("/all")
    public List<Vehicle> saveAllVehicle(@RequestBody List<Vehicle> vehicles) {
        return vehicleService.saveAllVehicle(vehicles);
    }



    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> update(@RequestHeader(name = "Authorization") String token, @RequestBody Vehicle vehicle, @PathVariable("id") Long id){
        return vehicleService.updateVehicle(token, vehicle, id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteVehicleById(@RequestHeader(name = "Authorization") String token, @PathVariable("id") Long id){
        return vehicleService.deleteVehicleById(id, token, parkingService);
    }



}

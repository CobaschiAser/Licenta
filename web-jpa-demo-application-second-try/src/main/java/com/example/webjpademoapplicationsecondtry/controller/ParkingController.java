package com.example.webjpademoapplicationsecondtry.controller;

import com.example.webjpademoapplicationsecondtry.dtos.ParkingDto;
import com.example.webjpademoapplicationsecondtry.entity.Parking;
import com.example.webjpademoapplicationsecondtry.entity.Vehicle;
import com.example.webjpademoapplicationsecondtry.service.ParkingService;
import com.example.webjpademoapplicationsecondtry.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/parking")
public class ParkingController {
    @Autowired
    private final ParkingService parkingService;

    @Autowired
    private final VehicleService vehicleService;

    public ParkingController(ParkingService parkingService, VehicleService vehicleService) {
        this.parkingService = parkingService;
        this.vehicleService = vehicleService;
    }


    @GetMapping
    public ResponseEntity<List<Parking>> findAllParking(@RequestHeader(name = "Authorization") String token){
        return parkingService.findAllParking(token);
    }

    @GetMapping("/hierarchy")
    public ResponseEntity<Map<String, Long>> getParkingHierarchy(@RequestHeader(name = "Authorization") String token, @RequestParam String period) {
        return parkingService.findParkingNameHierarchy(token, period);
    }

    @GetMapping("/statistics")
    public ResponseEntity<List<Long>> getParkingsStatistics(@RequestHeader(name = "Authorization") String token, @RequestParam String all, @RequestParam String id, @RequestParam String period){
        Integer newAll = Integer.parseInt(all);
        Long newId = Long.parseLong(id);
        return parkingService.findParkingStatistics(token, newAll, newId, period);
    }

    // TODO make this secure
    @GetMapping("/getByVehicle/{id}")
    public ResponseEntity<Parking> findParkingByVehicleId(@PathVariable("id") Long id){
        return parkingService.findParkingByVehicleId(id);
    }

    @GetMapping("/byId/{id}")
    public ResponseEntity<Parking> findParkingById(@RequestHeader(name = "Authorization") String token, @PathVariable("id") Long id){
        return parkingService.findParkingById(token, id);
    }

    @GetMapping("/byName/{name}")
    public ResponseEntity<Parking> findParkingByName(@RequestHeader(name = "Authorization") String token, @PathVariable("name") String name){
        return parkingService.findParkingByName(token, name);
    }

    @GetMapping("/{id}/vehicles")
    public ResponseEntity<List<Vehicle>> findVehicleByParking(@RequestHeader(name = "Authorization") String token, @PathVariable("id") Long id){
        return parkingService.findVehicleByParking(token, id);
    }
    @PostMapping
    public ResponseEntity<Parking> saveParking(@RequestHeader(name = "Authorization") String token, @RequestBody ParkingDto parking){
        return parkingService.saveParking(token, parking);
    }

    @PostMapping("/all")
    public ResponseEntity<List<Parking>> saveParking(@RequestHeader(name = "Authorization") String token, @RequestBody List<ParkingDto> parkings){
        return parkingService.saveParking(token, parkings);
    }

    @PutMapping("/{parkingId}/addVehicle/{vehicleId}")
    public ResponseEntity<String> addVehicle(@RequestHeader(name = "Authorization") String token, @PathVariable("parkingId") String parkingId, @PathVariable("vehicleId") String vehicleId){
        Long newParkingId = Long.parseLong(parkingId);
        Long newVehicleId = Long.parseLong(vehicleId);
        return parkingService.addVehicleToParking(token, newParkingId, newVehicleId);
    }

    @PutMapping("/{parkingId}/removeVehicle/{vehicleId}")
    public ResponseEntity<String> removeVehicle(@RequestHeader(name="authorization") String token, @PathVariable("parkingId") String parkingId, @PathVariable("vehicleId") String vehicleId){
        Long newParkingId = Long.parseLong(parkingId);
        Long newVehicleId = Long.parseLong(vehicleId);
        return parkingService.removeVehicleFromParking(token, newParkingId, newVehicleId, vehicleService);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Parking> update(@RequestHeader(name = "Authorization") String token, @RequestBody ParkingDto parkingDto, @PathVariable("id") Long id){
        return parkingService.updateParking(token, parkingDto, id);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteParkingById(@RequestHeader(name = "Authorization") String token, @PathVariable("id") Long id){
        return parkingService.deleteParkingById(token, id);
    }

}

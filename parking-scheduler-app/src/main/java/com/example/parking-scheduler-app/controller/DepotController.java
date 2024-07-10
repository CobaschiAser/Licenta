package com.example.webjpademoapplicationsecondtry.controller;

import com.example.webjpademoapplicationsecondtry.entity.Depot;
import com.example.webjpademoapplicationsecondtry.entity.Vehicle;
import com.example.webjpademoapplicationsecondtry.service.DepotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/depot")
public class DepotController {

    private final DepotService depotService;

    @Autowired
    public DepotController(DepotService depotService) {
        this.depotService = depotService;
    }

    @GetMapping
    public ResponseEntity<Depot> findDepot(@RequestHeader(name = "Authorization") String token) {
        return depotService.getDepot(token);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Depot> findDepotById(@RequestHeader(name = "Authorization") String token, @PathVariable("id") Long id) {
        return depotService.getDepotById(token, id);
    }

    @GetMapping("/vehicle")
    public ResponseEntity<List<Vehicle>> findDepotVehicles(@RequestHeader(name = "Authorization") String token) {
        return depotService.getDepotVehicles(token);
    }

    @GetMapping("/{id}/vehicle")
    public ResponseEntity<List<Vehicle>> findDepotVehiclesById(@RequestHeader(name = "Authorization") String token, @PathVariable("id") Long id) {
        return depotService.getDepotVehiclesById(token, id);
    }


}

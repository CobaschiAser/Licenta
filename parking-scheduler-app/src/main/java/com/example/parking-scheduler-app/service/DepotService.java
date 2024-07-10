package com.example.webjpademoapplicationsecondtry.service;

import com.example.webjpademoapplicationsecondtry.entity.Depot;
import org.springframework.http.ResponseEntity;
import com.example.webjpademoapplicationsecondtry.entity.Vehicle;

import java.util.List;

public interface DepotService {


    public ResponseEntity<Depot> getDepot(String token);

    public ResponseEntity<Depot> getDepotById(String token , Long depotId);
    public ResponseEntity<List<Vehicle>> getDepotVehicles(String token);
    public ResponseEntity<List<Vehicle>> getDepotVehiclesById(String token, Long depotId);
}

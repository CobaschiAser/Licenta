package com.example.webjpademoapplicationsecondtry.service;


import com.example.webjpademoapplicationsecondtry.entity.Vehicle;
import io.swagger.models.Response;
import org.springframework.http.ResponseEntity;

import java.sql.Date;
import java.util.List;
import java.util.Map;

public interface VehicleService {
    public ResponseEntity<List<Vehicle>> findAllVehicle(String token);

    public ResponseEntity<List<Vehicle>> getVehiclesCanBeAdded(String token);

    public ResponseEntity<List<Vehicle>> getVehiclesCanBeRemoved(String token, Long parkingId);

    public ResponseEntity<List<Vehicle>> getVehiclesAfterRequest(String token, Long parkingId);

    public  ResponseEntity<List<Vehicle>> willBeInDeparture(String token, String departure, Date date, Integer startHour, String vehicleType);

    public ResponseEntity<List<Vehicle>> willBeInDepartureUpdate(String token, String departure, Date date, Integer startHour,Long initialVehicleId, String vehicleType);

    public ResponseEntity<Map<String,Integer>> getVehicleStatistics(String criteria, String token);
    public ResponseEntity<Vehicle> findVehicleById(Long id, String token);

    public ResponseEntity<Vehicle> saveVehicle(String token, Vehicle vehicle);

    public List<Vehicle> saveAllVehicle(List<Vehicle> vehicleEntities);

    public ResponseEntity<Vehicle> updateVehicle(String token, Vehicle vehicle, Long id);

    public ResponseEntity<String> deleteVehicleById(Long id, String token, ParkingService parkingService);

}

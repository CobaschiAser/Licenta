package com.example.webjpademoapplicationsecondtry.service;

import com.example.webjpademoapplicationsecondtry.dtos.ParkingDto;
import com.example.webjpademoapplicationsecondtry.entity.Parking;
import com.example.webjpademoapplicationsecondtry.entity.Vehicle;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface ParkingService {
    public ResponseEntity<List<Parking>> findAllParking(String token);
    public ResponseEntity<Parking> findParkingById(String token, Long id);

    public ResponseEntity<List<Long>> findParkingStatistics(String token, Integer all, Long id, String period);


    public ResponseEntity<Map<Long, Long>> findParkingHierarchy(String token, String period);

    public ResponseEntity<Map<String, Long>> findParkingNameHierarchy(String token, String period);
    public ResponseEntity<List<Parking>> findParkingByPage(Integer page);

    public ResponseEntity<Integer> getNumberOfPages();

    public ResponseEntity<Parking> findParkingByName(String token, String name);
    public ResponseEntity<Parking> findParkingByVehicleId(Long id);

    public ResponseEntity<List<Vehicle>> findVehicleByParking(String token, Long parkingId);
    public ResponseEntity<Parking> saveParking(String token, ParkingDto parkingDto);

    public ResponseEntity<List<Parking>> saveParking(String token, List<ParkingDto> parkings);

    public ResponseEntity<Parking> updateParking(String token, ParkingDto parkingDto, Long id);

    public ResponseEntity<String> deleteParkingById(String token, Long id);

    public boolean checkFreeSpace(Parking parking);

    public ResponseEntity<String> addVehicleToParking(String token, Long parkingId, Long vehicleId);

    public ResponseEntity<String> removeVehicleFromParking(String token, Long parkingId, Long vehicleId, VehicleService vehicleService);
}

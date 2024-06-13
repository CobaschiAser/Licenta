package com.example.webjpademoapplicationsecondtry.service.impementation;

import com.example.webjpademoapplicationsecondtry.entity.Depot;
import com.example.webjpademoapplicationsecondtry.entity.Parking;
import com.example.webjpademoapplicationsecondtry.entity.Request;
import com.example.webjpademoapplicationsecondtry.entity.Vehicle;
import com.example.webjpademoapplicationsecondtry.repository.DepotRepository;
import com.example.webjpademoapplicationsecondtry.repository.ParkingRepository;
import com.example.webjpademoapplicationsecondtry.repository.RequestRepository;
import com.example.webjpademoapplicationsecondtry.repository.VehicleRepository;
import com.example.webjpademoapplicationsecondtry.service.ParkingService;
import com.example.webjpademoapplicationsecondtry.service.VehicleService;
import com.example.webjpademoapplicationsecondtry.utils.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.*;

@Service
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    private final RequestRepository requestRepository;

    private final ParkingRepository parkingRepository;

    private final DepotRepository depotRepository;

    public VehicleServiceImpl(VehicleRepository vehicleRepository, RequestRepository requestRepository, ParkingRepository parkingRepository, DepotRepository depotRepository) {
        this.vehicleRepository = vehicleRepository;
        this.requestRepository = requestRepository;
        this.parkingRepository = parkingRepository;
        this.depotRepository = depotRepository;
    }


    @Override
    public ResponseEntity<List<Vehicle>> findAllVehicle(String token) {
        if (!JwtUtil.isValidToken(token)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }
        List<Vehicle> vehicles = vehicleRepository.findAll();
        return new ResponseEntity<>(vehicles, HttpStatus.OK);
    }


    @Override
    public ResponseEntity<List<Vehicle>> getVehiclesCanBeAdded(String token) {
        if (!JwtUtil.isAuthorizedAdmin(token)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }
        List<Vehicle> vehicles = vehicleRepository.findVehicleWithNullParking();
        vehicles.removeIf(vehicle -> !requestRepository.findActiveRequestWithVehicle(vehicle.getId()).isEmpty());
        return new ResponseEntity<>(vehicles, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<Vehicle>> getVehiclesCanBeRemoved(String token, Long parkingId) {
        if (!JwtUtil.isAuthorizedAdmin(token)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }
        List<Vehicle> vehicles = vehicleRepository.findVehicleByParkingId(parkingId);
        List<Vehicle> canBeRemoved = new ArrayList<>();
        for (Vehicle vehicle : vehicles) {
            if (requestRepository.findActiveRequestWithVehicle(vehicle.getId()) == null) {
                System.out.println("Null list");
            }
            if (requestRepository.findActiveRequestWithVehicle(vehicle.getId()).isEmpty()) {
                canBeRemoved.add(vehicle);
            }
        }
        return new ResponseEntity<>(canBeRemoved, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<Vehicle>> getVehiclesAfterRequest(String token, Long parkingId) {
        if (!JwtUtil.isAuthorizedAdmin(token)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }
        List<Vehicle> allVehicles = vehicleRepository.findAll();
        List<Vehicle> vehicles = vehicleRepository.findVehicleByParkingId(parkingId);
        for (Vehicle vehicle : allVehicles) {
            List<Request> requests = requestRepository.findActiveRequestWithVehicle(vehicle.getId());
            for (Request request : requests) {
                Parking departureParking = parkingRepository.findParkingByName(request.getDeparture());
                if (parkingId == departureParking.getId()) {
                    vehicles.remove(vehicle);
                }
                Parking arrivalParking = parkingRepository.findParkingByName(request.getArrival());
                if (parkingId == arrivalParking.getId()) {
                    vehicles.add(vehicle);
                }
            }
        }

        return new ResponseEntity<>(vehicles, HttpStatus.OK);
    }
    @Override
    public ResponseEntity<Vehicle> findVehicleById(Long id, String token) {

        if (!JwtUtil.isValidToken(token)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }

        Vehicle vehicle = vehicleRepository.findVehicleById(id);

        return new ResponseEntity<>(vehicle, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Map<String,Integer>> getVehicleStatistics(String criteria, String token){

        if (!JwtUtil.isValidToken(token)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }

        Map<String, Integer> results = new HashMap<>();
        switch (criteria){
            case "fabricationYear":
                results = this.getVehicleStatisticsFabricationYear();
                break;
            case "type":
                results = this.getVehicleStatisticsVehicleType();
                break;
            case "currentParking":
                results = this.getVehicleStatisticsCurrentParking();
                break;
            default:
                break;
        }
        return new ResponseEntity<>(results, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Vehicle> saveVehicle(String token, Vehicle vehicle) {

        if (!JwtUtil.isAuthorizedAdmin(token)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }

        Depot depot = depotRepository.findDepot();
        if (depot.getCurrentCapacity() == depot.getMaxCapacity()) {
            return new ResponseEntity<>(null, HttpStatus.CONFLICT);
        }
        depot.addVehicle(vehicle);
        depot.setCurrentCapacity(depot.getCurrentCapacity() + 1);
        depotRepository.save(depot);

        vehicle.setCurrentDepot(depot);
        Vehicle newVehicle = vehicleRepository.save(vehicle);

        return new ResponseEntity<>(newVehicle, HttpStatus.OK);
    }

    @Override
    public List<Vehicle> saveAllVehicle(List<Vehicle> vehicleList){
        return vehicleRepository.saveAll(vehicleList);
    }
    @Override
    public ResponseEntity<Vehicle> updateVehicle(String token, Vehicle vehicle, Long id) {

        if (!JwtUtil.isAuthorizedAdmin(token)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }

        Vehicle toModifyVehicle = vehicleRepository.findVehicleById(id);

        if (toModifyVehicle == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        toModifyVehicle.setPriceComfort(vehicle.getPriceComfort());
        toModifyVehicle.setPriceTime(vehicle.getPriceTime());
        toModifyVehicle.setPriceDistance(vehicle.getPriceDistance());

        return new ResponseEntity<>(vehicleRepository.save(toModifyVehicle), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> deleteVehicleById(Long vehicleId, String token, ParkingService parkingService) {

        if (!JwtUtil.isAuthorizedAdmin(token)) {
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        Vehicle vehicle = vehicleRepository.findVehicleById(vehicleId);
        if (vehicle == null) {
            return new ResponseEntity<>("Not found", HttpStatus.NOT_FOUND);
        }
        List<Request> unsolvedRequest = requestRepository.findUnsolvedRequestWithVehicle(vehicleId);
        if (!unsolvedRequest.isEmpty()) {
            return new ResponseEntity<>("Vehicle is busy", HttpStatus.CONFLICT);
        }
        Parking parking = vehicle.getCurrentParking();
        if (parking != null) {
            parkingService.removeVehicleFromParking(token, parking.getId(), vehicleId, this);
        }
        vehicleRepository.deleteById(vehicleId);
        return new ResponseEntity<>("Successfully deleted", HttpStatus.OK);
        //if(!vehicle.isBusy()) {
            //Parking parking = vehicle.getCurrentParking();
            //if (parking != null) {
                //parkingService.removeVehicleFromParking(parking.getId(), vehicleId);
           // }
            //vehicleRepository.deleteById(vehicleId);
        //}else {
            //throw new AlreadyBusyException("You cannot delete a vehicle that is busy");
        //}
    }

    @Override
    public  ResponseEntity<List<Vehicle>> willBeInDeparture(String token, String departure, Date date, Integer startHour, String vehicleType){

        if (!JwtUtil.isValidToken(token)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }

        List<Vehicle> allVehicle = vehicleRepository.findVehicleByType(vehicleType);
        List<Vehicle> result = new ArrayList<>();

        for(Vehicle vehicle: allVehicle) {
            // requests that vehicle is involved in that day ordered by startHour
            List<Request> requests = requestRepository.findByDateVehicle(vehicle.getId());

            String lastParkingName = null;
            // last request committed that day until that moment

            Request lastRequest = null;
            if(requests != null && !requests.isEmpty()) {
                lastRequest = requests.get(requests.size() - 1);
            }
            // For the moment, allow to create a new Request only if it's the last on the day until that moment

            // if no requests with that vehicle, simply add it to results
            if(lastRequest == null){
                if(vehicle.getCurrentParking() != null) {
                    lastParkingName = vehicle.getCurrentParking().getName();
                }
                if(Objects.equals(lastParkingName, departure)) {
                    result.add(vehicle);
                }
                continue;
            }

            if(lastRequest.getDate().compareTo(date) > 0){
                continue;
            }

            // if lastRequest was finished, change the lastParkingName
            if(lastRequest.getSolved()) {
                lastParkingName = lastRequest.getArrival();
                if(lastRequest.getDate().compareTo(date) < 0 && Objects.equals(lastParkingName, departure)) {
                    result.add(vehicle);
                } else if(lastRequest.getDate().compareTo(date) == 0){
                    if(lastRequest.getEndHour() < startHour && Objects.equals(lastParkingName, departure)){
                        result.add(vehicle);
                    }
                }
            }
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<Vehicle>> willBeInDepartureUpdate(String token, String departure, Date date, Integer startHour,Long initialVehicleId, String vehicleType){
        // System.out.println("Here " + token);
        if (!JwtUtil.isValidToken(token)) {
            // System.out.println(token);
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }

        List<Vehicle> willBe = this.willBeInDeparture(token, departure, date, startHour, vehicleType).getBody();
        Vehicle initialVehicle = vehicleRepository.findVehicleById(initialVehicleId);
        if (initialVehicle.getType().compareTo(vehicleType) == 0 && departure.compareTo(initialVehicle.getCurrentParking().getName()) == 0) {
            willBe.add(initialVehicle);
        }
        return new ResponseEntity<>(willBe, HttpStatus.OK);
    }

    private Map<String, Integer> getVehicleStatisticsFabricationYear(){
        Map<String, Integer> results = new HashMap<>();
        List<Vehicle> vehicles = vehicleRepository.findAll();
        for (Vehicle vehicle : vehicles) {
            int fabricationYear = vehicle.getFabricationYear();
            String year = Integer.toString(fabricationYear);
            results.put(year, results.getOrDefault(year, 0) + 1);
        }
        return results;
    }

    private Map<String, Integer> getVehicleStatisticsVehicleType(){
        Map<String, Integer> results = new HashMap<>();
        List<Vehicle> vehicles = vehicleRepository.findAll();
        for (Vehicle vehicle : vehicles) {
            String type = vehicle.getType();
            results.put(type, results.getOrDefault(type, 0) + 1);
        }
        return results;
    }

    private Map<String, Integer> getVehicleStatisticsCurrentParking() {
        Map<String, Integer> results = new HashMap<>();
        List<Vehicle> vehicles = vehicleRepository.findAll();
        for (Vehicle vehicle : vehicles) {
            Parking currentParking = vehicle.getCurrentParking();
            if (currentParking != null) {
                String name = currentParking.getName();
                results.put(name, results.getOrDefault(name, 0) + 1);
            } else {
                final String noParking = "Depot or in running";
                results.put(noParking, results.getOrDefault(noParking, 0) + 1);
            }
        }
        return results;
    }

}

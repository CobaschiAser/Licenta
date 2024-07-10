package com.example.webjpademoapplicationsecondtry.service.impementation;

import com.example.webjpademoapplicationsecondtry.entity.*;
import com.example.webjpademoapplicationsecondtry.exception.AlreadyBusyException;
import com.example.webjpademoapplicationsecondtry.exception.NotFoundException;
import com.example.webjpademoapplicationsecondtry.repository.*;
import com.example.webjpademoapplicationsecondtry.service.PreferenceService;
import com.example.webjpademoapplicationsecondtry.service.RequestService;
import com.example.webjpademoapplicationsecondtry.service.VehicleService;
import com.example.webjpademoapplicationsecondtry.utils.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class RequestServiceImpl implements RequestService {

    private final RequestRepository requestRepository;
    private final AppUserRepository appUserRepository;

    private final ParkingRepository parkingRepository;

    private final VehicleRepository vehicleRepository;


    public RequestServiceImpl(RequestRepository requestRepository, AppUserRepository appUserRepository, ParkingRepository parkingRepository, VehicleRepository vehicleRepository, RideRepository rideRepository) {
        this.requestRepository = requestRepository;
        this.appUserRepository = appUserRepository;
        this.parkingRepository = parkingRepository;
        this.vehicleRepository = vehicleRepository;
    }
    @Override
    public List<Request> findAllRequest(){
        return requestRepository.findAll();
    }
    @Override
    public ResponseEntity<Request> findRequestById(String token, Long id) {
        try{

            if (!JwtUtil.isValidToken(token)) {
                return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
            }
            Request request = this.requestRepository.findRequestById(id);

            if (!JwtUtil.isAuthorizedUser(token, request.getOwner().getId())) {
                return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
            }

            return new ResponseEntity<>(request, HttpStatus.OK);

        }catch(Exception e){
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Override
    public List<Request> findRequestByDate(Date date){
        if(requestRepository.findRequestByDate(date).isEmpty()){
            throw new NotFoundException("There is no request with date: " + date);
        }
        return requestRepository.findRequestByDate(date);
    }
    @Override
    public ResponseEntity<Request> saveRequest(String token, Request request, UUID userId, VehicleService vehicleService, PreferenceService preferenceService) {

        if (!JwtUtil.isAuthorizedUser(token, userId)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }

        // establish the owner
        AppUser owner = checkAndGetUser(userId);

        // extract temporal information
        Date date = request.getDate();
        Integer startHour = request.getStartHour();
        Integer endHour = request.getEndHour();

        // validate temporal information
        checkValidDate(date, startHour, endHour);

        // extract departure-arrival information
        String departure = request.getDeparture();
        String arrival = request.getArrival();
        Parking departureParking = checkAndGetParking(departure);
        Parking arrivalParking   = checkAndGetParking(arrival);

        // extract vehicle information
        Long vehicleId = request.getVehicleId();
        Vehicle vehicle = checkAndGetVehicle(vehicleId);
        String vehicleType = request.getVehicleType();
        // check if the vehicle will be in Departure at startHour on given date

        // from the design, we know that each vehicle from willBeInDeparture has no request after this that I want to create
        // it is mandatory(at least for the moment) otherwise: how can I grant that other client will make a ride that brings the vehicle back?
        // also there are included vehicles that are not assigned to any request
        List<Vehicle> canBeTaken = this.willBeInDeparture(token, departure ,date, startHour, vehicleType, vehicleService);
        if(!canBeTaken.contains(vehicle)){
            throw new NotFoundException("Cannot create this request. The car specified will not be here at that time.");
        }
        System.out.println(canBeTaken.size());
        // now I know that vehicle is here and free to get the request.
        // let's verify that arrival can receive it

        List<Vehicle> areAlreadyThere = this.willBeInArrival(arrival, date, endHour);
        System.out.println(areAlreadyThere.size());
        if(arrivalParking.getMaxCapacity() - areAlreadyThere.size() < 1){
            throw new NotFoundException("Cannot create this request. There is no free space in specified arrival at that time.");
        }

        request.setOwner(owner);
        request.setSolved(false);
        request.setStarted(false);

        owner.addRequest(request);
        appUserRepository.save(owner);

        //vehicle.setBusy(true);
        vehicleRepository.save(vehicle);

        //arrivalParking.setReservedCapacity(arrivalParking.getReservedCapacity() + 1);
        parkingRepository.save(arrivalParking);

        Request newRequest = requestRepository.save(request);
        preferenceService.savePreference(userId);
        return new ResponseEntity<>(newRequest, HttpStatus.OK);
    }

    private List<Vehicle> willBeInDeparture(String token, String departure, Date date, Integer startHour, String vehicleType, VehicleService vehicleService){
        return vehicleService.willBeInDeparture(token, departure, date, startHour, vehicleType).getBody();
    }

    private List<Vehicle> willBeInDepartureUpdate(String token, String departure, Date date, Integer startHour,Long initialVehicleId, String vehicleType, VehicleService vehicleService) {
        return vehicleService.willBeInDepartureUpdate(token, departure, date, startHour, initialVehicleId, vehicleType).getBody();
    }

    private List<Vehicle> willBeInArrival(String arrival, Date date, Integer endHour){
        List<Vehicle> allVehicle = vehicleRepository.findAll();
        List<Vehicle> result = new ArrayList<>();

        for(Vehicle vehicle: allVehicle) {
            List<Request> requests = requestRepository.findByDateVehicle(vehicle.getId());

            boolean beThere = false;

            if(vehicle.getCurrentParking() != null) {
                String lastParkingName = vehicle.getCurrentParking().getName();
                // last request committed that day until that moment
                beThere = Objects.equals(lastParkingName, arrival);
            }
            for(Request request: requests){
                beThere = request.getDate().compareTo(date) <= 0 && request.getEndHour() < endHour && Objects.equals(request.getArrival(), arrival) && request.getStarted();
            }
            if(beThere){
                result.add(vehicle);
            }
        }
        return result;
    }

    @Override
    public Request updateRequest(String token, Request request, Long id, VehicleService vehicleService, PreferenceService preferenceService) {
        // take the request we want to modify
        // System.out.println(token);
        Request requestToModify = this.requestRepository.findRequestById(id);
        // System.out.println("Before if");
        if(!requestToModify.getStarted()) {
            // System.out.println("In if");
            requestToModify.setDeparture(request.getDeparture());
            //requestToModify.setOwner(request.getOwner());
            // validate correct temporal information
            checkValidDate(request.getDate(), request.getStartHour(), request.getEndHour());
            requestToModify.setDate(request.getDate());
            requestToModify.setStartHour(request.getStartHour());
            requestToModify.setEndHour(request.getEndHour());

            Parking initialArrivalParking = checkAndGetParking(requestToModify.getArrival());
            Vehicle initialVehicle = checkAndGetVehicle(requestToModify.getVehicleId());

            Parking arrivalParking = checkAndGetParking(request.getArrival());
            requestToModify.setArrival(request.getArrival());
            Vehicle vehicle = checkAndGetVehicle(request.getVehicleId());
            requestToModify.setVehicleId(request.getVehicleId());
            requestToModify.setVehicleType(request.getVehicleType());
            // check for busy new vehicle
            // System.out.println("Before");
            List<Vehicle> canBeTaken = this.willBeInDepartureUpdate(token, request.getDeparture(), request.getDate(), request.getStartHour(), initialVehicle.getId(), request.getVehicleType(), vehicleService);
            // System.out.println("After");
            //canBeTaken.add(initialVehicle);
            if(!canBeTaken.contains(vehicle)){
                throw new NotFoundException("Cannot create this request. The car specified will not be here at that time.");
            }
            System.out.println(canBeTaken.size());
            // now I know that vehicle is here and free to get the request.
            // let's verify that arrival can receive it

            List<Vehicle> areAlreadyThere = this.willBeInArrival(request.getArrival(), request.getDate(), request.getEndHour());
            System.out.println(areAlreadyThere.size());
            if(arrivalParking.getMaxCapacity() - areAlreadyThere.size() < 1){
                throw new NotFoundException("Cannot create this request. There is no free space in specified arrival at that time.");
            }

            requestToModify.getOwner().removeRequest(requestRepository.findById(id).get());
            requestToModify.getOwner().addRequest(requestToModify);
            Request updatedRequest = requestRepository.save(requestToModify);
            preferenceService.savePreference(requestToModify.getOwner().getId());
            return updatedRequest;
        }else {
            throw new AlreadyBusyException("You cannot update a request that was already started");
        }
    }

    @Override
    public void deleteRequestById(Long id, PreferenceService preferenceService) {
        Request request = this.requestRepository.findRequestById(id);
        if(!request.getStarted()) {
            this.deleteOnlyRequest(id, preferenceService);
        }else {
            //this.deleteOnlyRequest(id);
            throw new AlreadyBusyException("You cannot delete a request that was already started");
        }
    }

    @Override
    public void deleteOnlyRequest(Long id, PreferenceService preferenceService){
        Request request = this.requestRepository.findRequestById(id);
        AppUser owner = request.getOwner();
        owner.removeRequest(request);
        appUserRepository.save(owner);
        requestRepository.deleteById(id);
        preferenceService.savePreference(owner.getId());
    }

    @Override
    public void startRequest(String token, Long id){

        if (!JwtUtil.isValidToken(token)) {
            return;
        }

        Request request = this.requestRepository.findRequestById(id);
        request.setStarted(true);
        requestRepository.save(request);
        Parking departure = this.checkAndGetParking(request.getDeparture());
        Vehicle vehicle = this.checkAndGetVehicle(request.getVehicleId());
        departure.setCurrentCapacity(departure.getCurrentCapacity() - 1);
        departure.removeVehicle(vehicle);
        parkingRepository.save(departure);
        vehicle.setCurrentParking(null); // in transit
        vehicleRepository.save(vehicle);
    }

    @Override
    public void finishRequest(String token, Long id){
        if (!JwtUtil.isValidToken(token)) {
            return;
        }
        Request request = this.requestRepository.findRequestById(id);
        if(request.getStarted()) {
            request.setSolved(true);
            requestRepository.save(request);
            Parking departure = this.checkAndGetParking(request.getDeparture());
            Parking arrival = this.checkAndGetParking(request.getArrival());
            Vehicle vehicle = this.checkAndGetVehicle(request.getVehicleId());
            arrival.setCurrentCapacity(arrival.getCurrentCapacity() + 1);
            arrival.addVehicle(vehicle);
            parkingRepository.save(arrival);
            vehicle.setCurrentParking(arrival);
            double dist = Math.sqrt((departure.getX() - arrival.getX()) *(departure.getX() - arrival.getX()) + (departure.getY() - arrival.getY()) *(departure.getY() - arrival.getY()));
            vehicle.setCurrentAutonomy(vehicle.getCurrentAutonomy() + dist);
            vehicleRepository.save(vehicle);
        }else {
            throw new NotFoundException("Cannot finish a request that was not started.");
        }
    }

    // useful function to check data
    public void checkValidDate(Date date, Integer startHour, Integer endHour){
        LocalDateTime currentDayTime = LocalDateTime.now().plusDays(0);
        java.sql.Date currentDate = java.sql.Date.valueOf(currentDayTime.toLocalDate());
        if(date.before(currentDate)){
            throw new AlreadyBusyException("Cannot create this request for a previous date");
        }

        if(startHour >= endHour){
            throw new AlreadyBusyException("Cannot create this request with an earlier endHour than startHour");
        }
    }

    public Parking checkAndGetParking(String name) {
        Parking departureParking = parkingRepository.findParkingByName(name);
        if (departureParking == null) {
            throw new NotFoundException("Cannot create this request. There is no parking with name: " + name);
        }
        return departureParking;
    }

   public Vehicle checkAndGetVehicle(Long vehicleId){
       return vehicleRepository.findById(vehicleId).orElseThrow(
               () -> new NotFoundException("Cannot create this request. There is no vehicle with id: " + vehicleId)
       );
   }

   public AppUser checkAndGetUser(UUID uuid){
       return appUserRepository.findById(uuid).orElseThrow(
               () -> new NotFoundException("Cannot create this request. There is no user with specified id: " +uuid)
       );
   }

}

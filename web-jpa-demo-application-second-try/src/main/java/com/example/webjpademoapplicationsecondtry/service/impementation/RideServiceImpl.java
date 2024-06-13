package com.example.webjpademoapplicationsecondtry.service.impementation;

import com.example.webjpademoapplicationsecondtry.entity.*;
import com.example.webjpademoapplicationsecondtry.exception.NotFoundException;
import com.example.webjpademoapplicationsecondtry.repository.*;
import com.example.webjpademoapplicationsecondtry.service.RideService;
import com.example.webjpademoapplicationsecondtry.utils.DistanceConverter;
import com.example.webjpademoapplicationsecondtry.utils.JwtUtil;
import io.jsonwebtoken.Jwt;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;
import java.util.UUID;

@Service
public class RideServiceImpl implements RideService {

    private final RequestRepository requestRepository;
    private final ParkingRepository parkingRepository;
    private final VehicleRepository vehicleRepository;

    private final ParkingFluxRepository parkingFluxRepository;

    private final RideRepository rideRepository;

    private final AppUserRepository appUserRepository;


    public RideServiceImpl(RideRepository rideRepository, AppUserRepository appUserRepository, RequestRepository requestRepository, ParkingRepository parkingRepository, VehicleRepository vehicleRepository, ParkingFluxRepository parkingFluxRepository) {
        this.rideRepository = rideRepository;
        this.requestRepository = requestRepository;
        this.parkingRepository = parkingRepository;
        this.vehicleRepository = vehicleRepository;
        this.parkingFluxRepository = parkingFluxRepository;
        this.appUserRepository = appUserRepository;
    }

    @Override
    public ResponseEntity<Ride> findRideById(String token, Long id) {

        if (!JwtUtil.isValidToken(token)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }

        Ride ride = rideRepository.findRideById(id);
        return new ResponseEntity<>(ride, HttpStatus.OK);
    }

    @Override
    public List<Ride> findAllRide() {
        return rideRepository.findAll();
    }

    @Override
    public List<Ride> findRideByDate(Date date) {
        if(rideRepository.findRideByDate(date).isEmpty()){
            throw new NotFoundException("There is no ride with date: " + date);
        }
        return rideRepository.findRideByDate(date);
    }

    @Override
    public Ride saveRide(Long id) {
       Request r = requestRepository.findById(id).orElseThrow(
               () -> new NotFoundException("There is no request with id given. Impossible to create the ride")
       );

       Date date = r.getDate();
       Integer startHour = r.getStartHour();
       Integer endHour = r.getEndHour();
       String departure = r.getDeparture();
       String arrival = r.getArrival();
       Long vehicleId = r.getVehicleId();
       AppUser owner = r.getOwner();

       Parking departureParking = parkingRepository.findParkingByName(departure);
       Parking arrivalParking = parkingRepository.findParkingByName(arrival);
       Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow(
               () -> new NotFoundException("There is no vehicle with id: "+ vehicleId)
       );


       // update parkingFluxes of implied Parkings(departure and arrival)
        ParkingFlux parkingFluxFromDeparture = parkingFluxRepository.findParkingFluxByDateAndParking(date, departureParking);
        if (parkingFluxFromDeparture == null) {
            parkingFluxFromDeparture = new ParkingFlux(date, (long)0, (long)0, departureParking);
            parkingFluxRepository.save(parkingFluxFromDeparture);
        }
        parkingFluxFromDeparture.setOutput(parkingFluxFromDeparture.getOutput() + 1);
        parkingFluxRepository.save(parkingFluxFromDeparture);

        ParkingFlux parkingFluxFromArrival = parkingFluxRepository.findParkingFluxByDateAndParking(date, arrivalParking);
        if (parkingFluxFromArrival == null) {
            parkingFluxFromArrival = new ParkingFlux(date, (long)0, (long)0, arrivalParking);
            parkingFluxRepository.save(parkingFluxFromArrival);
        }
        parkingFluxFromArrival.setInput(parkingFluxFromArrival.getInput() + 1);
        parkingFluxRepository.save(parkingFluxFromArrival);

        //r.setSolved(true);
        //requestRepository.save(r);

        // double dist = Math.sqrt((departureParking.getX() - arrivalParking.getX()) *(departureParking.getX() - arrivalParking.getX()) + (departureParking.getY() - arrivalParking.getY()) *(departureParking.getY() - arrivalParking.getY()));
        double dist = DistanceConverter.calculateDistance(departureParking.getX(), departureParking.getY(), arrivalParking.getX(), arrivalParking.getY());

        double price_0 = vehicle.getPriceComfort();
        double price_1 = vehicle.getPriceTime();
        double price_2 = vehicle.getPriceDistance();

        Ride resultedRide = new Ride(
                    dist,
                    price_0 * vehicle.getComfort() + price_1 * (endHour - startHour) + price_2 * dist,
                    date,
                    startHour,
                    endHour,
                    departure,
                    arrival,
                    vehicle.getId(),
                    owner
        );
        rideRepository.save(resultedRide);
        return  resultedRide;
    }


    public AppUser checkAndGetUser(UUID uuid){
        return appUserRepository.findById(uuid).orElseThrow(
                () -> new NotFoundException("Cannot create this request. There is no user with specified id: " +uuid)
        );
    }

    @Override
    public ResponseEntity<Double> estimatePrice(String token, Request request){

        System.out.println("Before");
        if (!JwtUtil.isValidToken(token)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }
        System.out.println("After");
        Integer startHour = request.getStartHour();
        Integer endHour = request.getEndHour();
        String departure = request.getDeparture();
        String arrival = request.getArrival();
        Long vehicleId = request.getVehicleId();
        AppUser owner = request.getOwner();

        Parking departureParking = parkingRepository.findParkingByName(departure);
        Parking arrivalParking = parkingRepository.findParkingByName(arrival);
        Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow(
                () -> new NotFoundException("There is no vehicle with id: "+ vehicleId)
        );

        // double dist = Math.sqrt((departureParking.getX() - arrivalParking.getX()) *(departureParking.getX() - arrivalParking.getX()) + (departureParking.getY() - arrivalParking.getY()) *(departureParking.getY() - arrivalParking.getY()));
        double dist = DistanceConverter.calculateDistance(departureParking.getX(), departureParking.getY(), arrivalParking.getX(), arrivalParking.getY());

        double price_0 = vehicle.getPriceComfort();
        double price_1 = vehicle.getPriceTime();
        double price_2 = vehicle.getPriceDistance();

        double estimatedPrice = price_0 * vehicle.getComfort() + price_1 * (endHour - startHour) + price_2 * dist;
        return  new ResponseEntity<>(estimatedPrice, HttpStatus.OK);
    }

}

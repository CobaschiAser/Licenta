package com.example.webjpademoapplicationsecondtry.controller;

import com.example.webjpademoapplicationsecondtry.utils.InputDate;
import com.example.webjpademoapplicationsecondtry.entity.Request;
import com.example.webjpademoapplicationsecondtry.service.PreferenceService;
import com.example.webjpademoapplicationsecondtry.service.RequestService;
import com.example.webjpademoapplicationsecondtry.service.RideService;
import com.example.webjpademoapplicationsecondtry.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/request")
public class RequestController {

    @Autowired
    private final RequestService requestService;

    @Autowired
    private final RideService rideService;

    @Autowired
    private final VehicleService vehicleService;

    @Autowired
    private final PreferenceService preferenceService;

    public RequestController(RequestService requestService, RideService rideService, VehicleService vehicleService, PreferenceService preferenceService) {
        this.requestService = requestService;
        this.rideService = rideService;
        this.vehicleService = vehicleService;
        this.preferenceService = preferenceService;
    }

    @GetMapping
    public List<Request> findAllRequest(){
        return requestService.findAllRequest();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Request> findRequestById(@RequestHeader(name = "Authorization") String token, @PathVariable("id") Long id){
        return requestService.findRequestById(token, id);
    }

    @GetMapping("/by-date")
    public List<Request> findRequestByDate(@RequestBody InputDate date){
        Date sqlDate = Date.valueOf(date.getYear() + "-" + date.getMonth() + "-" + date.getDay());
        return requestService.findRequestByDate(sqlDate);
    }

    @PostMapping("/{uuid}")
    public ResponseEntity<Request> saveRequest(@RequestHeader(name = "Authorization") String token, @RequestBody Request request,@PathVariable("uuid") UUID uuid){
        return requestService.saveRequest(token, request, uuid, vehicleService, preferenceService);
    }

    @PostMapping("/{id}/start")
    public void startRequest(@RequestHeader(name = "authorization") String token, @PathVariable("id") Long id){
        requestService.startRequest(token, id);
    }

    @PostMapping("{id}/finish")
    public void finishRequest(@RequestHeader(name = "authorization") String token, @PathVariable("id") Long id){

        requestService.finishRequest(token, id);
        rideService.saveRide(id);
    }

    @PutMapping("/{id}")
    public Request modifyRequest(@RequestHeader(name = "Authorization") String token, @RequestBody Request request, @PathVariable("id") Long id){
        // System.out.println("Controller token " + token);
        return requestService.updateRequest(token, request, id, vehicleService, preferenceService);
    }

    @DeleteMapping("/{id}")
    public void deleteRequestById(@PathVariable("id") Long id){
        requestService.deleteRequestById(id, preferenceService);
    }

}

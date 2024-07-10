package com.example.webjpademoapplicationsecondtry.service.impementation;

import com.example.webjpademoapplicationsecondtry.entity.Depot;
import com.example.webjpademoapplicationsecondtry.entity.Vehicle;
import com.example.webjpademoapplicationsecondtry.repository.DepotRepository;
import com.example.webjpademoapplicationsecondtry.service.DepotService;
import com.example.webjpademoapplicationsecondtry.utils.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepotServiceImpl implements DepotService {

    private final DepotRepository depotRepository;

    public DepotServiceImpl(DepotRepository depotRepository) {
        this.depotRepository = depotRepository;
    }

    @Override
    public ResponseEntity<Depot> getDepot(String token) {
        if(!JwtUtil.isValidToken(token)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }
        Depot depot = depotRepository.findDepot();
        if (depot == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(depot, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Depot> getDepotById(String token, Long depotId) {
        if (!JwtUtil.isValidToken(token)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }
        Depot depot = depotRepository.findDepotById(depotId);
        if (depot == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(depot, HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<Vehicle>> getDepotVehicles(String token) {
        if (!JwtUtil.isValidToken(token)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }
        Depot depot = depotRepository.findDepot();
        if (depot == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(depot.getVehicles(), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<Vehicle>> getDepotVehiclesById(String token, Long depotId) {
        if (!JwtUtil.isValidToken(token)) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }
        Depot depot = depotRepository.findDepotById(depotId);
        if (depot == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(depot.getVehicles(), HttpStatus.OK);
    }



}

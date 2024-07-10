package com.example.webjpademoapplicationsecondtry.service.impementation;

import com.example.webjpademoapplicationsecondtry.entity.ParkingFlux;
import com.example.webjpademoapplicationsecondtry.repository.ParkingFluxRepository;
import com.example.webjpademoapplicationsecondtry.service.ParkingFluxService;
import org.springframework.stereotype.Service;

@Service
public class ParkingFluxServiceImpl implements ParkingFluxService {

    private final ParkingFluxRepository parkingFluxRepository;

    public ParkingFluxServiceImpl(ParkingFluxRepository parkingFluxRepository) {
        this.parkingFluxRepository = parkingFluxRepository;
    }

    @Override
    public ParkingFlux saveParkingFlux(ParkingFlux parkingFlux) {
        return parkingFluxRepository.save(parkingFlux);
    }
}

package com.example.webjpademoapplicationsecondtry.repository;

import com.example.webjpademoapplicationsecondtry.entity.Parking;
import com.example.webjpademoapplicationsecondtry.entity.ParkingFlux;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public interface ParkingFluxRepository extends JpaRepository<ParkingFlux, Long> {
    @Query("SELECT p FROM ParkingFlux p WHERE p.date = :date AND p.myParking = :myParking")
    ParkingFlux findParkingFluxByDateAndParking(@Param("date")Date date, @Param("myParking")Parking myParking);

    @Query("SELECT p FROM ParkingFlux p WHERE p.myParking.id=:parkingId")
    List<ParkingFlux> findByParkingId(@Param("parkingId") Long parkingId);

}

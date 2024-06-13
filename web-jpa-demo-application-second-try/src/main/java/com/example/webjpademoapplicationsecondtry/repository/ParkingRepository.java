package com.example.webjpademoapplicationsecondtry.repository;

import com.example.webjpademoapplicationsecondtry.entity.Parking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;

@Repository
public interface ParkingRepository extends JpaRepository<Parking,Long> {
    @Query("SELECT p FROM Parking p JOIN p.vehicles v WHERE v.id = :vehicleId")
    Parking findParkingByVehicleId(@Param("vehicleId") Long vehicleId);

    @Query("SELECT p FROM Parking p WHERE p.name = :name")
    Parking findParkingByName(@Param("name") String name);

    @Query("SELECT p FROM Parking p WHERE p.x = :x AND p.y = :y")
    Parking findParkingByCoord(@Param("x") Double x, @Param("y") Double y);

    @Query("SELECT p FROM Parking p WHERE p.id=:id")
    Parking findParkingById(@Param("id") Long id);

}

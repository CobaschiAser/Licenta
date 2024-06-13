package com.example.webjpademoapplicationsecondtry.repository;

import com.example.webjpademoapplicationsecondtry.entity.Parking;
import com.example.webjpademoapplicationsecondtry.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;
import java.util.Optional;


@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    @Query("SELECT v FROM Vehicle v WHERE v.type = :type")
    public List<Vehicle> findVehicleByType(@Param("type") String type);

    @Query("SELECT v FROM Vehicle v WHERE v.id = :id")
    public Vehicle findVehicleById(@Param("id") Long id);

    @Query("SELECT v FROM Vehicle v WHERE v.currentParking = null ")
    public List<Vehicle> findVehicleWithNullParking();

    @Query("SELECT v FROM Vehicle v WHERE v.currentParking.id =:parkingId")
    public List<Vehicle> findVehicleByParkingId(@Param("parkingId") Long parkingId);

    // Pt depou
    /*
    @Query("SELECT v FROM Vehicle v JOIN parking_vehicle pv ON v.id = pv.vehicle_id WHERE pv.parking_id = :parkingId")
    public List<Vehicle> findVehicleByParkingId(@Param("parkingId") Long parkingId);
    */
}

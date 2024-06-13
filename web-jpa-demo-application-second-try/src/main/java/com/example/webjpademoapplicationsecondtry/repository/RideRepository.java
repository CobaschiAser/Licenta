package com.example.webjpademoapplicationsecondtry.repository;

import com.example.webjpademoapplicationsecondtry.entity.Request;
import com.example.webjpademoapplicationsecondtry.entity.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {

    @Query("SELECT r FROM Ride r WHERE r.date = :date")
    List<Ride> findRideByDate(@Param("date") Date date);

    @Query("SELECT r FROM Ride r WHERE r.id = :id")
    Ride findRideById(@Param("id") Long id);
}

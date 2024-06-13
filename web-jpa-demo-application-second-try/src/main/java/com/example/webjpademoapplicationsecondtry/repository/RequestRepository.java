package com.example.webjpademoapplicationsecondtry.repository;

import com.example.webjpademoapplicationsecondtry.entity.Parking;
import com.example.webjpademoapplicationsecondtry.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;
import java.util.UUID;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
    @Query("SELECT r FROM Request r WHERE r.date = :date")
    List<Request> findRequestByDate(@Param("date") Date date);

    @Query("SELECT r FROM Request r WHERE r.owner.id = :id")
    List<Request> findRequestByUser(@Param("id") Long id);

    @Query("SELECT r FROM Request r WHERE r.vehicleId = :vehicleId AND r.started AND not r.solved ORDER BY r.date,r.startHour")
    List<Request> findByDateVehicle(@Param("vehicleId") Long vehicleId);

    @Query("SELECT r FROM Request r WHERE r.id = :id")
    Request findRequestById(@Param("id") Long id);

    @Query("SELECT r FROM Request r WHERE r.owner.id =:userUUID")
    List<Request> findRequestByUserUUID(@Param("userUUID") UUID userUUID);

    @Query("SELECT r FROM Request r WHERE r.departure =:name OR r.arrival=:name")
    List<Request> findRequestByParking(@Param("name") String name);

    @Query("SELECT r FROM Request r WHERE r.id =:vehicleId AND NOT r.solved")
    List<Request> findUnsolvedRequestWithVehicle(@Param("vehicleId") Long vehicleId);

    @Query("SELECT r FROM Request r WHERE r.id =:vehicleId AND r.started AND NOT r.solved")
    List<Request> findActiveRequestWithVehicle(@Param("vehicleId") Long vehicleId);
}

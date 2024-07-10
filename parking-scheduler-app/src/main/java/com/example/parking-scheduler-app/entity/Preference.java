package com.example.webjpademoapplicationsecondtry.entity;


import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name="preference",uniqueConstraints = {
        @UniqueConstraint(columnNames = "user_uuid")})

public class Preference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "departure")
    private String departure;

    @Column(name = "arrival")
    private String arrival;

    @Column(name = "vehicle_type")
    private String vehicleType;

    @Column(name = "user_uuid")
    private UUID userUUID;


    public Preference(){}

    public Preference(Long id, String departure, String arrival, String vehicleType, UUID userUUID){
        this.id = id;
        this.departure = departure;
        this.arrival = arrival;
        this.vehicleType = vehicleType;
        this.userUUID = userUUID;
    }
    public Preference(String departure, String arrival, String vehicleType, UUID userUUID){
        this.departure = departure;
        this.arrival = arrival;
        this.vehicleType = vehicleType;
        this.userUUID = userUUID;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDeparture() {
        return departure;
    }

    public void setDeparture(String departure) {
        this.departure = departure;
    }

    public String getArrival() {
        return arrival;
    }

    public void setArrival(String arrival) {
        this.arrival = arrival;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public UUID getUserUUID() {
        return userUUID;
    }

    public void setUserUUID(UUID userUUID) {
        this.userUUID = userUUID;
    }
}

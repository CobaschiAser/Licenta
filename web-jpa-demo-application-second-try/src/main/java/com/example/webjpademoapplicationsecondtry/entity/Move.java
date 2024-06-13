package com.example.webjpademoapplicationsecondtry.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "move")
public class Move {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "from_parking")
    private String from;

    @Column(name = "to_parking")
    private String to;

    @Column(name = "vehicle_id")
    private Long vehicleId;


    public Move() {

    }
    public Move(Long id, String from, String to, Long vehicleId) {
        this.id = id;
        this.from = from;
        this.to = to;
        this.vehicleId = vehicleId;
    }

    public Move(String from, String to, Long vehicleId) {
        this.from = from;
        this.to = to;
        this.vehicleId = vehicleId;
    }


    public Long getId() {
        return id;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }
}

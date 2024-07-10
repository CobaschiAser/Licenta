package com.example.webjpademoapplicationsecondtry.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.sql.Date;

@Entity
@Table(name = "request")
public class Request {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Temporal(TemporalType.DATE)
    @Column(name = "date")
    private Date date;
    @Column(name = "departure")
    private String departure;

    @Column(name = "arrival")
    private String arrival;

    @Column(name = "vehicle_type")
    private String vehicleType;

    @Column(name = "vehicle_id")
    private Long vehicleId;

    @Column(name = "solved")
    private Boolean solved;

    @Column(name = "started")
    private Boolean started;

    @Column(name = "start-hour")
    private Integer startHour;

    @Column(name = "end-hour")
    private Integer endHour;
    @ManyToOne
    @JoinTable(
            name = "user_request",
            joinColumns = @JoinColumn(name = "request_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonBackReference
    private AppUser owner;

    public Request(Long id, Date date, Integer startHour, Integer endHour, String departure, String arrival, String vehicleType, Long vehicleId, AppUser owner) {
        this.id = id;
        this.date = date;
        this.startHour = startHour;
        this.endHour = endHour;
        this.departure = departure;
        this.arrival = arrival;
        this.vehicleType = vehicleType;
        this.vehicleId = vehicleId;
        this.owner = owner;
        this.solved = false;
        this.started = false;
    }

    public Request(Date date, Integer startHour, Integer endHour, String departure, String arrival,String vehicleType, Long vehicleId, AppUser owner) {
        this.date = date;
        this.startHour = startHour;
        this.endHour = endHour;
        this.departure = departure;
        this.arrival = arrival;
        this.vehicleType = vehicleType;
        this.vehicleId = vehicleId;
        this.owner = owner;
        this.solved = false;
        this.started = false;
    }

    public Request(Date date, Integer startHour, Integer endHour, String departure, String arrival, String vehicleType, Long vehicleId) {
        this.date = date;
        this.startHour = startHour;
        this.endHour = endHour;
        this.departure = departure;
        this.arrival = arrival;
        this.vehicleType = vehicleType;
        this.vehicleId = vehicleId;
        this.solved = false;
        this.started = false;
    }

    public Request() {

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
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

    public String getVehicleType(){ return vehicleType;}

    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType;}
    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public AppUser getOwner() {
        return owner;
    }

    public void setOwner(AppUser owner) {
        this.owner = owner;
    }

    public Boolean getSolved() {
        return solved;
    }

    public void setSolved(Boolean solved) {
        this.solved = solved;
    }

    public Integer getStartHour() {
        return startHour;
    }

    public void setStartHour(Integer startHour) {
        this.startHour = startHour;
    }

    public Integer getEndHour() {
        return endHour;
    }

    public void setEndHour(Integer endHour) {
        this.endHour = endHour;
    }

    public Boolean getStarted() {
        return started;
    }

    public void setStarted(Boolean started) {
        this.started = started;
    }
}


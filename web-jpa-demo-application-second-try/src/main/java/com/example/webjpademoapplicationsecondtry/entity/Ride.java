package com.example.webjpademoapplicationsecondtry.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.sql.Date;

@Entity
@Table(name = "ride")
public class Ride {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "distance")
    private Double distance;

    @Column(name = "price")
    private Double price;

    @Temporal(TemporalType.DATE)
    @Column(name = "date")
    private Date date;

    @Column(name = "startHour")
    private Integer startHour;

    @Column(name = "endHour")
    private Integer endHour;
    @Column(name = "departure")
    private String departure;

    @Column(name = "arrival")
    private String arrival;

    @Column(name = "vehicleId")
    private Long vehicleId;


    @ManyToOne
    @JoinTable(
            name = "user_ride",
            joinColumns = @JoinColumn(name = "ride_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonBackReference
    private AppUser author;

    public Ride(){}

    public Ride(Long id, Double distance, Double price, Date date, Integer startHour, Integer endHour, String departure, String arrival, Long vehicleId, AppUser author) {
        this.id = id;
        this.distance = distance;
        this.price = price;
        this.date = date;
        this.startHour = startHour;
        this.endHour = endHour;
        this.departure = departure;
        this.arrival = arrival;
        this.vehicleId = vehicleId;
        this.author = author;
    }

    public Ride( Double distance, Double price, Date date, Integer startHour, Integer endHour, String departure, String arrival, Long vehicleId, AppUser author) {
        this.distance = distance;
        this.price = price;
        this.date = date;
        this.startHour = startHour;
        this.endHour = endHour;
        this.departure = departure;
        this.arrival = arrival;
        this.vehicleId = vehicleId;
        this.author = author;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getDistance() {
        return distance;
    }

    public void setDistance(Double distance) {
        this.distance = distance;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
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

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public AppUser getAuthor() {
        return author;
    }

    public void setAuthor(AppUser author) {
        this.author = author;
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
}

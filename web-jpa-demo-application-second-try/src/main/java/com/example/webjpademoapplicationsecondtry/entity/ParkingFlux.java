package com.example.webjpademoapplicationsecondtry.entity;

import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.Date;

@Entity
@Table(name = "flux_parking")
public class ParkingFlux {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Temporal(TemporalType.DATE)
    @Column(name = "date")
    private Date date;

    @Column(name = "input")
    private Long input;

    @Column(name = "output")
    private Long output;


    @ManyToOne
    @JoinColumn(name = "parking_id")
    private Parking myParking;

    public ParkingFlux(Long id, Date date, Long input, Long output, Parking myParking) {
        this.id = id;
        this.date = date;
        this.input = input;
        this.output = output;
        this.myParking = myParking;
    }

    public ParkingFlux(Date date, Long input, Long output, Parking myParking) {
        this.date = date;
        this.input = input;
        this.output = output;
        this.myParking = myParking;
    }

    public ParkingFlux() {

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

    public Long getInput() {
        return input;
    }

    public void setInput(Long input) {
        this.input = input;
    }

    public Long getOutput() {
        return output;
    }

    public void setOutput(Long output) {
        this.output = output;
    }

    public void setMyParking(Parking parking){
        this.myParking = parking;
    }
}

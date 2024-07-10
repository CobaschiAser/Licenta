package com.example.webjpademoapplicationsecondtry.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "vehicle",uniqueConstraints = {
        @UniqueConstraint(columnNames = "number_plate")
})
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "make")
    private String brand;

    @Column(name = "model")
    private String model;

    @Column(name = "type")
    private String type;

    @Column(name = "fabrication_year")
    private int fabricationYear;

    @Column(name = "comfort")
    private int comfort;

    @Column(name = "max_autonomy")
    private double maxAutonomy;

    @Column(name = "current_autonomy")
    private double currentAutonomy;
    @Column(name ="price_comfort")
    private double priceComfort;

    @Column(name ="price_time")
    private double priceTime;

    @Column(name="price_distance")
    private double priceDistance;

    @Column(name="number_plate")
    private String numberPlate;

    @ManyToOne
    @JoinTable(
            name = "parking_vehicle",
            joinColumns = @JoinColumn(name = "vehicle_id"),
            inverseJoinColumns = @JoinColumn(name = "parking_id")
    )
    @JsonBackReference
    private Parking currentParking = null;

    @ManyToOne
    @JoinTable(
            name = "depot_vehicle",
            joinColumns = @JoinColumn(name = "vehicle_id"),
            inverseJoinColumns = @JoinColumn(name = "depot_id")
    )
    @JsonBackReference
    private Depot currentDepot = null;
    public Vehicle(){}

    public Vehicle(Long id, String numberPlate, String brand, String model, String type, int fabricationYear, int comfort, int seat, double maxAutonomy, double priceComfort, double priceTime, double priceDistance) {
        this.id = id;
        this.numberPlate = numberPlate;
        this.brand = brand;
        this.model = model;
        this.type = type;
        this.fabricationYear = fabricationYear;
        this.comfort = comfort;
        this.maxAutonomy = maxAutonomy;
        this.priceComfort = priceComfort;
        this.priceTime = priceTime;
        this.priceDistance = priceDistance;
        }

    public Vehicle(String numberPlate, String brand, String model, String type, int fabricationYear, int comfort, int seat, double maxAutonomy, double priceComfort, double priceTime, double priceDistance) {
        this.numberPlate = numberPlate;
        this.brand = brand;
        this.model = model;
        this.type = type;
        this.fabricationYear = fabricationYear;
        this.comfort = comfort;
        this.maxAutonomy = maxAutonomy;
        this.priceComfort = priceComfort;
        this.priceTime = priceTime;
        this.priceDistance = priceDistance;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public int getFabricationYear() {
        return fabricationYear;
    }

    public void setFabricationYear(int fabricationYear) {
        this.fabricationYear = fabricationYear;
    }

    public int getComfort() {
        return comfort;
    }

    public void setComfort(int comfort) {
        this.comfort = comfort;
    }

    public double getMaxAutonomy() {
        return maxAutonomy;
    }

    public void setMaxAutonomy(double maxAutonomy) {
        this.maxAutonomy = maxAutonomy;
    }

    public double getCurrentAutonomy() {
        return currentAutonomy;
    }

    public void setCurrentAutonomy(double currentAutonomy) {
        this.currentAutonomy = currentAutonomy;
    }

    public double getPriceComfort() {
        return priceComfort;
    }

    public void setPriceComfort(double priceComfort) {
        this.priceComfort = priceComfort;
    }

    public double getPriceTime() {
        return priceTime;
    }

    public void setPriceTime(double priceTime) {
        this.priceTime = priceTime;
    }

    public double getPriceDistance() {
        return priceDistance;
    }

    public void setPriceDistance(double priceDistance) {
        this.priceDistance = priceDistance;
    }

    public void setCurrentParking(Parking parking){
        this.currentParking = parking;
    }

    public Parking getCurrentParking(){
        return this.currentParking;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getNumberPlate() { return this.numberPlate;}

    public void setNumberPlate(String numberPlate) {
        this.numberPlate = numberPlate;
    }

    public Depot getCurrentDepot() {
        return currentDepot;
    }

    public void setCurrentDepot(Depot currentDepot) {
        this.currentDepot = currentDepot;
    }
}

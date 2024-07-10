package com.example.webjpademoapplicationsecondtry.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "depot",uniqueConstraints = {
        @UniqueConstraint(columnNames = "name"),
        @UniqueConstraint(columnNames = {"x_coordinate", "y_coordinate"})
})
public class Depot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "x_coordinate")
    private Double x;

    @Column(name = "y_coordinate")
    private Double y;

    @Column(name = "max_capacity")
    private int maxCapacity;

    @Column(name = "current_capacity")
    private int currentCapacity;

    @OneToMany(mappedBy = "currentDepot",cascade = CascadeType.ALL)
    private List<Vehicle> vehicles = new ArrayList<>();

    public Depot(){}

    public Depot(Long id, String name, Double x, Double y, int maxCapacity, int currentCapacity, List<Vehicle> vehicles) {
        this.id = id;
        this.name = name;
        this.x = x;
        this.y = y;
        this.maxCapacity = maxCapacity;
        this.currentCapacity = currentCapacity;
        this.vehicles = vehicles;
    }
    public Depot(String name, Double x, Double y, int maxCapacity, int currentCapacity, List<Vehicle> vehicles) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.maxCapacity = maxCapacity;
        this.currentCapacity = currentCapacity;
        this.vehicles = vehicles;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getX() {
        return x;
    }

    public void setX(Double x) {
        this.x = x;
    }

    public Double getY() {
        return y;
    }

    public void setY(Double y) {
        this.y = y;
    }

    public int getMaxCapacity() {
        return maxCapacity;
    }

    public void setMaxCapacity(int maxCapacity) {
        this.maxCapacity = maxCapacity;
    }

    public int getCurrentCapacity() {
        return currentCapacity;
    }

    public void setCurrentCapacity(int currentCapacity) {
        this.currentCapacity = currentCapacity;
    }

    public void addVehicle(Vehicle vehicle) {
        this.vehicles.add(vehicle);
    }

    public void removeVehicle(Vehicle vehicle) {
        this.vehicles.remove(vehicle);
    }

    public List<Vehicle> getVehicles() {
        return this.vehicles;
    }
}

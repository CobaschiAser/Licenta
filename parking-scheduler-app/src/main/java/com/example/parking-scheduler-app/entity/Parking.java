package com.example.webjpademoapplicationsecondtry.entity;

import com.example.webjpademoapplicationsecondtry.dtos.ParkingDto;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "parking",uniqueConstraints = {
        @UniqueConstraint(columnNames = "name"),
        @UniqueConstraint(columnNames = {"x_coordinate", "y_coordinate"})
})
public class Parking {

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


    @OneToMany(mappedBy = "myParking", cascade = CascadeType.ALL)
    private Set<ParkingFlux> flux = new HashSet<>();

    @OneToMany(mappedBy = "currentParking",cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Vehicle> vehicles = new ArrayList<>();

    public Parking(){}
    public Parking(Long id, String name, Double x, Double y, int maxCapacity, int currentCapacity) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.name = name;
        this.maxCapacity = maxCapacity;
        this.currentCapacity = currentCapacity;
        //this.reservedCapacity = 0;
    }

    public Parking(String name, Double x, Double y, int maxCapacity, int currentCapacity) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.maxCapacity = maxCapacity;
        this.currentCapacity = currentCapacity;
        //this.reservedCapacity = 0;
    }

    public Parking(ParkingDto parkingDto){
        this.name = parkingDto.getName();
        this.x = parkingDto.getX();
        this.y = parkingDto.getY();
        this.maxCapacity = parkingDto.getMaxCapacity();
        this.currentCapacity = 0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setX(Double x){
        this.x = x;
    }

    public Double getX(){
        return this.x;
    }

    public void setY(Double y){
        this.y = y;
    }

    public Double getY(){
        return this.y;
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

    public List<Vehicle> getVehicles(){
        return this.vehicles;
    }
    public void addVehicle(Vehicle v){
        this.vehicles.add(v);
    }

    public void removeVehicle(Vehicle v){
        this.vehicles.remove(v);
    }
}

package com.example.webjpademoapplicationsecondtry.dtos;

public class ParkingDto {

    private String name;
    private Double x;
    private Double y;
    private int maxCapacity;

    public ParkingDto(String name, Double x, Double y, int maxCapacity) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.maxCapacity = maxCapacity;
    }

    public String getName() {
        return name;
    }

    public Double getX() {
        return x;
    }

    public Double getY() {
        return y;
    }

    public int getMaxCapacity() {
        return maxCapacity;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setX(Double x) {
        this.x = x;
    }

    public void setY(Double y) {
        this.y = y;
    }
}

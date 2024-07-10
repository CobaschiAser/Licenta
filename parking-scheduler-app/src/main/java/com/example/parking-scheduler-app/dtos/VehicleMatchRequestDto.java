package com.example.webjpademoapplicationsecondtry.dtos;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

import java.sql.Date;
public class VehicleMatchRequestDto {
    private String departure;
    private Date date;

    private Integer startHour;

    public VehicleMatchRequestDto(){}
    public VehicleMatchRequestDto(String departure, Date date, Integer startHour) {
        this.departure = departure;
        this.date = date;
        this.startHour = startHour;
    }

    public String getDeparture() {
        return departure;
    }

    public void setDeparture(String departure) {
        this.departure = departure;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Integer getStartHour() {
        return startHour;
    }

    public void setStartHour(Integer startHour) {
        this.startHour = startHour;
    }
}

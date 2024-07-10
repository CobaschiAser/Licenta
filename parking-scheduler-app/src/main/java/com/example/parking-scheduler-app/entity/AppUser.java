package com.example.webjpademoapplicationsecondtry.entity;


import com.example.webjpademoapplicationsecondtry.dtos.AppUserEditDto;
import com.example.webjpademoapplicationsecondtry.dtos.AppUserRegisterDto;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.sql.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "app_user",uniqueConstraints = {
        @UniqueConstraint(columnNames = "username"),
        @UniqueConstraint(columnNames = "email")
})

public class AppUser {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @Column(name = "admin")
    private Integer isAdmin;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "username")
    private String username;


    @Column(name = "password")
    private String password;

    @Column(name = "salt")
    private String salt = null;

    @Column(name = "token")
    private UUID authenticationToken = null;

    @Column(name ="verification-code")
    private String verificationCode = null;

    @Column(name = "password-code")
    private String passwordCode = null;

    @Column(name = "verificated")
    private Boolean verificated = false;

    @Temporal(TemporalType.DATE)
    @Column(name = "registration-date")
    private Date registrationDate;

    @OneToMany(mappedBy = "owner",cascade = CascadeType.ALL)
    @JsonManagedReference
    private Set<Request> requests = new HashSet<>();

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Set<Ride> rides = new HashSet<>();

    public AppUser(){}

    public AppUser(UUID id, String name, String email, String username, String password) {
        this.id = id;
        this.isAdmin = 0;
        this.name = name;
        this.email = email;
        this.username = username;
        this.password = password;
    }

    public AppUser(String name, String email, String username, String password) {
        this.isAdmin = 0;
        this.name = name;
        this.email = email;
        this.username = username;
        this.password = password;
    }

    public AppUser(AppUserRegisterDto appUserRegisterDto){
        this.isAdmin = 0;
        this.name = appUserRegisterDto.getName();
        this.email = appUserRegisterDto.getEmail();
        this.username = appUserRegisterDto.getUsername();
        this.password = appUserRegisterDto.getPassword();
    }

    public AppUser(AppUserEditDto appUserEditDto){
        this.name = appUserEditDto.getName();
        this.email = appUserEditDto.getEmail();
        this.username = appUserEditDto.getUsername();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setSalt(String salt){
        this.salt = salt;
    }

    public String getSalt(){
        return this.salt;
    }

    public Set<Request> getRequests() {
        return requests;
    }

    public void setRequests(Set<Request> requests) {
        this.requests = requests;
    }

    public Set<Ride> getRides() {
        return rides;
    }

    public void setRides(Set<Ride> rides) {
        this.rides = rides;
    }

    public void addRequest(Request request){
        this.requests.add(request);
    }

    public void addRide(Ride ride){
        this.rides.add(ride);
    }

    public void removeRequest(Request request){
        this.requests.remove(request);
    }

    public void removeRide(Ride ride){
        this.rides.remove(ride);
    }

    public UUID getAuthenticationToken() {
        return authenticationToken;
    }

    public void setAuthenticationToken(UUID authenticationToken) {
        this.authenticationToken = authenticationToken;
    }

    public String getVerificationCode() { return this.verificationCode;}

    public void setVerificationCode(String verificationCode) { this.verificationCode = verificationCode;}

    public Boolean getVerificated(){ return this.verificated;}

    public void setVerificated(Boolean verificated) { this.verificated = verificated;}

    public String getPasswordCode() { return this.passwordCode;}

    public void setPasswordCode(String passwordCode) { this.passwordCode = passwordCode;}

    public Date getRegistrationDate() {
        return this.registrationDate;
    }

    public void setRegistrationDate(Date registrationDate) {
        this.registrationDate = registrationDate;
    }

    public Integer getIsAdmin(){
        return this.isAdmin;
    }

    public void setIsAdmin(Integer isAdmin) {
        this.isAdmin = isAdmin;
    }
 }

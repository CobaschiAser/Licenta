package com.example.webjpademoapplicationsecondtry.repository;

import com.example.webjpademoapplicationsecondtry.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, UUID> {

    @Query("SELECT u FROM AppUser u WHERE u.email =:emailAddress")

    public AppUser findUserByEmail(@Param("emailAddress") String email);

    @Query("SELECT u FROM AppUser u WHERE u.username =:username")
    public AppUser findUserByUsername(@Param("username") String username);

    @Query("SELECT u FROM AppUser u WHERE u.id = :uuid")
    public AppUser findUserById(@Param("uuid") UUID uuid);
    @Query("SELECT u FROM AppUser u WHERE u.username=:username AND u.password=:password")
    public AppUser login(@Param("username") String username, @Param("password") String password);

    @Query("SELECT u.salt FROM AppUser u WHERE u.username=:username")
    public String getSalt(@Param("username") String username);

    Optional<AppUser> findUserByAuthenticationToken(UUID authenticationToken);
    @Query("SELECT u FROM AppUser u WHERE u.registrationDate>:date ")
    public List<AppUser> findUserRegisteredBefore(@Param("date") Date date);

}

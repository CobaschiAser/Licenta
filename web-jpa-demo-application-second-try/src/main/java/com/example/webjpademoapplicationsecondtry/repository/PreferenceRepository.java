package com.example.webjpademoapplicationsecondtry.repository;

import com.example.webjpademoapplicationsecondtry.entity.Preference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PreferenceRepository extends JpaRepository<Preference, Long> {
    @Query("SELECT p FROM Preference p WHERE p.userUUID = :userUUID")
    Preference getPreferenceByUserUUID(@Param("userUUID") UUID userUUID);
}

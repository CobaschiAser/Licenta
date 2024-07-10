package com.example.webjpademoapplicationsecondtry.repository;

import com.example.webjpademoapplicationsecondtry.entity.Depot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface DepotRepository extends JpaRepository<Depot, Long> {

    @Query("SELECT d FROM Depot d ORDER BY d.id ASC LIMIT 1")
    public Depot findDepot();

    @Query("SELECT d FROM Depot d WHERE d.id =: depotId")
    public Depot findDepotById(@Param("depotId") Long depotId);
}

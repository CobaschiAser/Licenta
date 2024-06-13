package com.example.webjpademoapplicationsecondtry.repository;

import com.example.webjpademoapplicationsecondtry.entity.AppUser;
import com.example.webjpademoapplicationsecondtry.entity.Move;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface MoveRepository extends JpaRepository<Move, Long> {

    @Query("SELECT m FROM Move m where m.from =:fromParking AND m.to =:toParking")
    public List<Move> findMovesByParkings(@Param("fromParking") String fromParking, @Param("toParking") String toParking);
}


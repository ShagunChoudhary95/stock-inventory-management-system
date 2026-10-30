package com.HCL.Stock.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.HCL.Stock.entity.Location;

public interface LocationRepository extends JpaRepository<Location, Long> {

}
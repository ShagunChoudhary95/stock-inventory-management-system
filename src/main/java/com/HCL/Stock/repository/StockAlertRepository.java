package com.HCL.Stock.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.HCL.Stock.entity.StockAlert;

public interface StockAlertRepository extends JpaRepository<StockAlert, Long> {

}
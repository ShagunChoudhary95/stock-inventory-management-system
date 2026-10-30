package com.HCL.Stock.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.HCL.Stock.entity.StockTransfer;

public interface StockTransferRepository extends JpaRepository<StockTransfer, Long> {

}
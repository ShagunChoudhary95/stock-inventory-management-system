package com.HCL.Stock.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.HCL.Stock.entity.SalesOrder;

public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {

}
package com.HCL.Stock.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.HCL.Stock.entity.Supplier;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {

}
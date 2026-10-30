package com.HCL.Stock.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.HCL.Stock.entity.Inventory;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

}
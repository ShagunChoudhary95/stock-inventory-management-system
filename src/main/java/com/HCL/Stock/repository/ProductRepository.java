package com.HCL.Stock.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.HCL.Stock.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

}
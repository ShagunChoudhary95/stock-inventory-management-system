package com.HCL.Stock.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.HCL.Stock.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}
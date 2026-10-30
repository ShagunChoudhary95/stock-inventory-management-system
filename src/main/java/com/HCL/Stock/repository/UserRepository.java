package com.HCL.Stock.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.HCL.Stock.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

}
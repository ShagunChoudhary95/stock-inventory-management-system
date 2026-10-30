package com.HCL.Stock.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping({"/", "/products-page", "/categories-page", "/suppliers-page", "/locations-page", "/inventory-page", "/purchase-orders-page", "/sales-orders-page", "/stock-transfers-page", "/stock-alerts-page", "/users-page"})
    public String index() {
        return "index";
    }
}
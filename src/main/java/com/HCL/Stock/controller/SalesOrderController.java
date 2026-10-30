package com.HCL.Stock.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.HCL.Stock.entity.SalesOrder;
import com.HCL.Stock.service.SalesOrderService;

@RestController
@RequestMapping("/sales-orders")
public class SalesOrderController {

    private final SalesOrderService salesOrderService;

    public SalesOrderController(SalesOrderService salesOrderService) {
        this.salesOrderService = salesOrderService;
    }

    @PostMapping
    public SalesOrder addSalesOrder(@RequestBody SalesOrder salesOrder) {
        return salesOrderService.addSalesOrder(salesOrder);
    }

    @GetMapping
    public List<SalesOrder> getAllSalesOrders() {
        return salesOrderService.getAllSalesOrders();
    }

    @GetMapping("/{id}")
    public SalesOrder getSalesOrderById(@PathVariable Long id) {
        return salesOrderService.getSalesOrderById(id);
    }

    @PutMapping("/{id}")
    public SalesOrder updateSalesOrder(
            @PathVariable Long id,
            @RequestBody SalesOrder salesOrder) {
        return salesOrderService.updateSalesOrder(id, salesOrder);
    }

    @DeleteMapping("/{id}")
    public String deleteSalesOrder(@PathVariable Long id) {
        return salesOrderService.deleteSalesOrder(id);
    }
}
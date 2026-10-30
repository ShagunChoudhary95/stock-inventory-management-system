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

import com.HCL.Stock.entity.StockAlert;
import com.HCL.Stock.service.StockAlertService;

@RestController
@RequestMapping("/stock-alerts")
public class StockAlertController {

    private final StockAlertService stockAlertService;

    public StockAlertController(StockAlertService stockAlertService) {
        this.stockAlertService = stockAlertService;
    }

    @PostMapping
    public StockAlert addStockAlert(@RequestBody StockAlert stockAlert) {
        return stockAlertService.addStockAlert(stockAlert);
    }

    @GetMapping
    public List<StockAlert> getAllStockAlerts() {
        return stockAlertService.getAllStockAlerts();
    }

    @GetMapping("/{id}")
    public StockAlert getStockAlertById(@PathVariable Long id) {
        return stockAlertService.getStockAlertById(id);
    }

    @PutMapping("/{id}")
    public StockAlert updateStockAlert(
            @PathVariable Long id,
            @RequestBody StockAlert stockAlert) {
        return stockAlertService.updateStockAlert(id, stockAlert);
    }

    @DeleteMapping("/{id}")
    public String deleteStockAlert(@PathVariable Long id) {
        return stockAlertService.deleteStockAlert(id);
    }
}
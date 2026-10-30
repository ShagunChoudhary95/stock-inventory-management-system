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

import com.HCL.Stock.entity.StockTransfer;
import com.HCL.Stock.service.StockTransferService;

@RestController
@RequestMapping("/stock-transfers")
public class StockTransferController {

    private final StockTransferService stockTransferService;

    public StockTransferController(StockTransferService stockTransferService) {
        this.stockTransferService = stockTransferService;
    }

    @PostMapping
    public StockTransfer addStockTransfer(
            @RequestBody StockTransfer stockTransfer) {
        return stockTransferService.addStockTransfer(stockTransfer);
    }

    @GetMapping
    public List<StockTransfer> getAllStockTransfers() {
        return stockTransferService.getAllStockTransfers();
    }

    @GetMapping("/{id}")
    public StockTransfer getStockTransferById(
            @PathVariable Long id) {
        return stockTransferService.getStockTransferById(id);
    }

    @PutMapping("/{id}")
    public StockTransfer updateStockTransfer(
            @PathVariable Long id,
            @RequestBody StockTransfer stockTransfer) {
        return stockTransferService.updateStockTransfer(id, stockTransfer);
    }

    @DeleteMapping("/{id}")
    public String deleteStockTransfer(@PathVariable Long id) {
        return stockTransferService.deleteStockTransfer(id);
    }
}
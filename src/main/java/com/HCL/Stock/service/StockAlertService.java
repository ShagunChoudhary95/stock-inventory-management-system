package com.HCL.Stock.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.HCL.Stock.entity.StockAlert;
import com.HCL.Stock.repository.StockAlertRepository;

@Service
public class StockAlertService {

    private final StockAlertRepository stockAlertRepository;

    public StockAlertService(StockAlertRepository stockAlertRepository) {
        this.stockAlertRepository = stockAlertRepository;
    }

    public StockAlert addStockAlert(StockAlert stockAlert) {
        return stockAlertRepository.save(stockAlert);
    }

    public List<StockAlert> getAllStockAlerts() {
        return stockAlertRepository.findAll();
    }

    public StockAlert getStockAlertById(Long id) {
        return stockAlertRepository.findById(id).orElse(null);
    }

    public StockAlert updateStockAlert(Long id, StockAlert stockAlert) {

        StockAlert existing = stockAlertRepository.findById(id).orElse(null);

        if (existing != null) {
            existing.setProductId(stockAlert.getProductId());
            existing.setLocationId(stockAlert.getLocationId());
            existing.setCurrentStock(stockAlert.getCurrentStock());
            existing.setMinimumStock(stockAlert.getMinimumStock());
            existing.setAlertType(stockAlert.getAlertType());
            existing.setStatus(stockAlert.getStatus());

            return stockAlertRepository.save(existing);
        }

        return null;
    }

    public String deleteStockAlert(Long id) {

        if (stockAlertRepository.existsById(id)) {
            stockAlertRepository.deleteById(id);
            return "Stock Alert deleted successfully";
        }

        return "Stock Alert not found";
    }
}
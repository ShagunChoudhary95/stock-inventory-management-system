package com.HCL.Stock.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.HCL.Stock.entity.StockTransfer;
import com.HCL.Stock.repository.StockTransferRepository;

@Service
public class StockTransferService {

    private final StockTransferRepository stockTransferRepository;

    public StockTransferService(StockTransferRepository stockTransferRepository) {
        this.stockTransferRepository = stockTransferRepository;
    }

    public StockTransfer addStockTransfer(StockTransfer stockTransfer) {
        return stockTransferRepository.save(stockTransfer);
    }

    public List<StockTransfer> getAllStockTransfers() {
        return stockTransferRepository.findAll();
    }

    public StockTransfer getStockTransferById(Long id) {
        return stockTransferRepository.findById(id).orElse(null);
    }

    public StockTransfer updateStockTransfer(Long id, StockTransfer stockTransfer) {

        StockTransfer existing = stockTransferRepository.findById(id).orElse(null);

        if (existing != null) {
            existing.setProductId(stockTransfer.getProductId());
            existing.setFromLocationId(stockTransfer.getFromLocationId());
            existing.setToLocationId(stockTransfer.getToLocationId());
            existing.setQuantity(stockTransfer.getQuantity());
            existing.setStatus(stockTransfer.getStatus());

            return stockTransferRepository.save(existing);
        }

        return null;
    }

    public String deleteStockTransfer(Long id) {

        if (stockTransferRepository.existsById(id)) {
            stockTransferRepository.deleteById(id);
            return "Stock Transfer deleted successfully";
        }

        return "Stock Transfer not found";
    }
}
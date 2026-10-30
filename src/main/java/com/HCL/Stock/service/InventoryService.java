package com.HCL.Stock.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.HCL.Stock.entity.Inventory;
import com.HCL.Stock.repository.InventoryRepository;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    public Inventory addInventory(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    public Inventory getInventoryById(Long id) {
        return inventoryRepository.findById(id).orElse(null);
    }

    public Inventory updateInventory(Long id, Inventory inventory) {

        Inventory existing = inventoryRepository.findById(id).orElse(null);

        if (existing != null) {
            existing.setProductId(inventory.getProductId());
            existing.setLocationId(inventory.getLocationId());
            existing.setQuantity(inventory.getQuantity());
            existing.setMinimumStock(inventory.getMinimumStock());

            return inventoryRepository.save(existing);
        }

        return null;
    }

    public String deleteInventory(Long id) {

        if (inventoryRepository.existsById(id)) {
            inventoryRepository.deleteById(id);
            return "Inventory deleted successfully";
        }

        return "Inventory not found";
    }
}
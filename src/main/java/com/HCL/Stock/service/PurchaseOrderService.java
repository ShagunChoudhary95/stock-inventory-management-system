package com.HCL.Stock.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.HCL.Stock.entity.PurchaseOrder;
import com.HCL.Stock.repository.PurchaseOrderRepository;

@Service
public class PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;

    public PurchaseOrderService(PurchaseOrderRepository purchaseOrderRepository) {
        this.purchaseOrderRepository = purchaseOrderRepository;
    }

    public PurchaseOrder addPurchaseOrder(PurchaseOrder purchaseOrder) {
        return purchaseOrderRepository.save(purchaseOrder);
    }

    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll();
    }

    public PurchaseOrder getPurchaseOrderById(Long id) {
        return purchaseOrderRepository.findById(id).orElse(null);
    }

    public PurchaseOrder updatePurchaseOrder(Long id, PurchaseOrder purchaseOrder) {

        PurchaseOrder existing = purchaseOrderRepository.findById(id).orElse(null);

        if (existing != null) {
            existing.setSupplierId(purchaseOrder.getSupplierId());
            existing.setProductId(purchaseOrder.getProductId());
            existing.setLocationId(purchaseOrder.getLocationId());
            existing.setQuantity(purchaseOrder.getQuantity());
            existing.setTotalAmount(purchaseOrder.getTotalAmount());
            existing.setStatus(purchaseOrder.getStatus());

            return purchaseOrderRepository.save(existing);
        }

        return null;
    }

    public String deletePurchaseOrder(Long id) {

        if (purchaseOrderRepository.existsById(id)) {
            purchaseOrderRepository.deleteById(id);
            return "Purchase Order deleted successfully";
        }

        return "Purchase Order not found";
    }
}
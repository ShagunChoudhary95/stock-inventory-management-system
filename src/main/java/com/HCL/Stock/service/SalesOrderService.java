package com.HCL.Stock.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.HCL.Stock.entity.SalesOrder;
import com.HCL.Stock.repository.SalesOrderRepository;

@Service
public class SalesOrderService {

    private final SalesOrderRepository salesOrderRepository;

    public SalesOrderService(SalesOrderRepository salesOrderRepository) {
        this.salesOrderRepository = salesOrderRepository;
    }

    public SalesOrder addSalesOrder(SalesOrder salesOrder) {
        return salesOrderRepository.save(salesOrder);
    }

    public List<SalesOrder> getAllSalesOrders() {
        return salesOrderRepository.findAll();
    }

    public SalesOrder getSalesOrderById(Long id) {
        return salesOrderRepository.findById(id).orElse(null);
    }

    public SalesOrder updateSalesOrder(Long id, SalesOrder salesOrder) {

        SalesOrder existing = salesOrderRepository.findById(id).orElse(null);

        if (existing != null) {
            existing.setUserId(salesOrder.getUserId());
            existing.setProductId(salesOrder.getProductId());
            existing.setLocationId(salesOrder.getLocationId());
            existing.setQuantity(salesOrder.getQuantity());
            existing.setTotalAmount(salesOrder.getTotalAmount());
            existing.setStatus(salesOrder.getStatus());

            return salesOrderRepository.save(existing);
        }

        return null;
    }

    public String deleteSalesOrder(Long id) {

        if (salesOrderRepository.existsById(id)) {
            salesOrderRepository.deleteById(id);
            return "Sales Order deleted successfully";
        }

        return "Sales Order not found";
    }
}
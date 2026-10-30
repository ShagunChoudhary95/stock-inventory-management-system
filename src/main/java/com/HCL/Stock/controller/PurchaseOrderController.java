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

import com.HCL.Stock.entity.PurchaseOrder;
import com.HCL.Stock.service.PurchaseOrderService;

@RestController
@RequestMapping("/purchase-orders")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    public PurchaseOrderController(PurchaseOrderService purchaseOrderService) {
        this.purchaseOrderService = purchaseOrderService;
    }

    @PostMapping
    public PurchaseOrder addPurchaseOrder(
            @RequestBody PurchaseOrder purchaseOrder) {
        return purchaseOrderService.addPurchaseOrder(purchaseOrder);
    }

    @GetMapping
    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderService.getAllPurchaseOrders();
    }

    @GetMapping("/{id}")
    public PurchaseOrder getPurchaseOrderById(
            @PathVariable Long id) {
        return purchaseOrderService.getPurchaseOrderById(id);
    }

    @PutMapping("/{id}")
    public PurchaseOrder updatePurchaseOrder(
            @PathVariable Long id,
            @RequestBody PurchaseOrder purchaseOrder) {
        return purchaseOrderService.updatePurchaseOrder(id, purchaseOrder);
    }

    @DeleteMapping("/{id}")
    public String deletePurchaseOrder(@PathVariable Long id) {
        return purchaseOrderService.deletePurchaseOrder(id);
    }
}
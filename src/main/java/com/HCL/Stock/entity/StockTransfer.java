package com.HCL.Stock.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class StockTransfer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;
    private Long fromLocationId;
    private Long toLocationId;
    private int quantity;
    private String status;

    public StockTransfer() {
    }

    public StockTransfer(Long id, Long productId,
                         Long fromLocationId, Long toLocationId,
                         int quantity, String status) {
        this.id = id;
        this.productId = productId;
        this.fromLocationId = fromLocationId;
        this.toLocationId = toLocationId;
        this.quantity = quantity;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long getFromLocationId() {
        return fromLocationId;
    }

    public void setFromLocationId(Long fromLocationId) {
        this.fromLocationId = fromLocationId;
    }

    public Long getToLocationId() {
        return toLocationId;
    }

    public void setToLocationId(Long toLocationId) {
        this.toLocationId = toLocationId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
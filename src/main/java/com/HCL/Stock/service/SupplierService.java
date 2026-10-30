package com.HCL.Stock.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.HCL.Stock.entity.Supplier;
import com.HCL.Stock.repository.SupplierRepository;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    // CREATE
    public Supplier addSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    // READ ALL
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    // READ BY ID
    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id).orElse(null);
    }

    // UPDATE
    public Supplier updateSupplier(Long id, Supplier supplier) {

        Supplier existing = supplierRepository.findById(id).orElse(null);

        if (existing != null) {

            existing.setName(supplier.getName());
            existing.setEmail(supplier.getEmail());
            existing.setPhone(supplier.getPhone());
            existing.setAddress(supplier.getAddress());
            existing.setContactPerson(supplier.getContactPerson());

            return supplierRepository.save(existing);
        }

        return null;
    }

    // DELETE
    public String deleteSupplier(Long id) {

        if (supplierRepository.existsById(id)) {

            supplierRepository.deleteById(id);

            return "Supplier deleted successfully";
        }

        return "Supplier not found";
    }
}
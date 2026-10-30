package com.HCL.Stock.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.HCL.Stock.entity.Product;
import com.HCL.Stock.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product updateProduct(Long id, Product product) {

        Product existingProduct = productRepository.findById(id).orElse(null);

        if (existingProduct != null) {

            existingProduct.setName(product.getName());
            existingProduct.setSymbol(product.getSymbol());
            existingProduct.setPrice(product.getPrice());
            existingProduct.setQuantity(product.getQuantity());

            return productRepository.save(existingProduct);
        }

        return null;
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
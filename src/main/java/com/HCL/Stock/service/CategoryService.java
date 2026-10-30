package com.HCL.Stock.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.HCL.Stock.entity.Category;
import com.HCL.Stock.repository.CategoryRepository;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Category addCategory(Category category) {
        return categoryRepository.save(category);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    public Category updateCategory(Long id, Category category) {

        Category existing = categoryRepository.findById(id).orElse(null);

        if (existing != null) {

            existing.setName(category.getName());
            existing.setDescription(category.getDescription());

            return categoryRepository.save(existing);
        }

        return null;
    }

    public String deleteCategory(Long id) {

        if (categoryRepository.existsById(id)) {

            categoryRepository.deleteById(id);

            return "Category deleted successfully";
        }

        return "Category not found";
    }
}
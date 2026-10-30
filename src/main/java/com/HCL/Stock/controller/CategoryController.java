package com.HCL.Stock.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.HCL.Stock.entity.Category;
import com.HCL.Stock.service.CategoryService;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public Category addCategory(@RequestBody Category category) {
        return categoryService.addCategory(category);
    }

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/{id}")
    public Category getCategoryById(@PathVariable Long id) {
        return categoryService.getCategoryById(id);
    }

    @PutMapping("/{id}")
    public Category updateCategory(
            @PathVariable Long id,
            @RequestBody Category category) {

        return categoryService.updateCategory(id, category);
    }

    @DeleteMapping("/{id}")
    public String deleteCategory(@PathVariable Long id) {
        return categoryService.deleteCategory(id);
    }
}
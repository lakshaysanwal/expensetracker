package com.expensetracker.controller;

import com.expensetracker.model.Expense;
import com.expensetracker.model.User;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username).orElseThrow();
    }

    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseRepository.findByUser(getCurrentUser());
    }

    @PostMapping
    public Expense createExpense(@RequestBody Expense expense) {
        expense.setUser(getCurrentUser());
        return expenseRepository.save(expense);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable Long id) {
        Optional<Expense> expense = expenseRepository.findById(id);
        User currentUser = getCurrentUser();
        
        if (expense.isPresent() && expense.get().getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.ok(expense.get());
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        Optional<Expense> expense = expenseRepository.findById(id);
        User currentUser = getCurrentUser();

        if (expense.isPresent() && expense.get().getUser().getId().equals(currentUser.getId())) {
            expenseRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @RequestBody Expense updatedExpense) {
        User currentUser = getCurrentUser();
        return expenseRepository.findById(id)
                .filter(expense -> expense.getUser().getId().equals(currentUser.getId()))
                .map(expense -> {
                    expense.setTitle(updatedExpense.getTitle());
                    expense.setAmount(updatedExpense.getAmount());
                    expense.setCategory(updatedExpense.getCategory());
                    expense.setDate(updatedExpense.getDate());
                    expense.setType(updatedExpense.getType());
                    expense.setReceipt(updatedExpense.getReceipt());
                    Expense saved = expenseRepository.save(expense);
                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}

package com.docs.service;

import com.docs.model.User;

import java.util.List;

public interface UserService {
    boolean existsByUsername(String username);

    public User saveUser(User user);

    public List<User> getAllUsers();

    public boolean checkPassword(User user, String rawPassword);

    public User login(String username, String password);

    // public User authenticateUser(String username, String password);
}
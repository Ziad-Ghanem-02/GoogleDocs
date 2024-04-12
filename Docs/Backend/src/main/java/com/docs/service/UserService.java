package com.docs.service;

import com.docs.model.User;

import java.util.List;

public interface UserService {
    boolean existsByUsername(String username);

    boolean existsById(String username);

    public User saveUser(User user);

    public List<User> getAllUsers();

    public boolean checkPassword(User user, String rawPassword);

    public String login(String username, String password);

    List<User> getUsersById(List<String> ids);

    User getUserByUsername(String username);

    // public User authenticateUser(String username, String password);
}
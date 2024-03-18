package com.docs.service;

import com.docs.model.User;

import java.util.List;

public interface UserService {
    public User saveUser(User user);

    public List<User> getAllUsers();
}
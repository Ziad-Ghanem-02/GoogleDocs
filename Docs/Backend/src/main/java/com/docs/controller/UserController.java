package com.docs.controller;

import com.docs.model.User;
import com.docs.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/auth")
@CrossOrigin
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<String> add(@RequestBody User user) {
        if (userService.existsByUsername(user.getUsername())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Username already exists");
        }

        try {
            userService.saveUser(user);
            return new ResponseEntity<String>("User created successfuly", HttpStatus.OK);
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Unable to create user", e);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user) {
        String jwtToken = userService.login(user.getUsername(), user.getPassword());
        if (jwtToken != null) {
            return new ResponseEntity<String>(jwtToken, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping("/getAll")
    public List<User> list() {
        return userService.getAllUsers();
    }
}
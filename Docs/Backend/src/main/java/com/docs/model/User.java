package com.docs.model;

import java.util.Collection;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import lombok.Data;

@Data
@Document(collection = "users")
public class User implements UserDetails {
    @Id
    private String id;
    private String username;
    private String password;

    public User() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Override
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @Override
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        // BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        this.password = password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // No need to have roles enum
        // We don't have roles in this project
        return List.of(new SimpleGrantedAuthority("user"));
    }

    @Override
    public boolean isAccountNonExpired() {
        // This is used when using sessions (but we are using jwt)
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        // This is used when using sessions (but we are using jwt)
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        // This is used when using sessions (but we are using jwt)
        return true;
    }

    @Override
    public boolean isEnabled() {
        // No need to check if user is enabled in this project
        // Usually we have to fetch user from database and check if user is enabled,
        // blabla bla
        return true;
    }

    public Object orElseThrow(Object object) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'orElseThrow'");
    }
}
package com.docs.repository;

import com.docs.model.User;
import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    User findByUsername(String username);

    Optional<User> findById(String id);

    boolean existsByUsername(String username);
}
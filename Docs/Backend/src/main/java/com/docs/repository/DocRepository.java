package com.docs.repository;

import com.docs.model.Doc;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface DocRepository extends MongoRepository<Doc, String> {
    Optional<Doc> findByTitle(String title);

    boolean existsByTitle(String title);
}
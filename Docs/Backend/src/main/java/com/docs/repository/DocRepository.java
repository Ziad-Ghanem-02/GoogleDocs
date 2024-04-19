package com.docs.repository;

import com.docs.model.Doc;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface DocRepository extends MongoRepository<Doc, String> {
    Optional<Doc> findByTitle(String title);

    @Query("{ $or: [ { 'ownerID': ?0 }, { 'editors': ?0 }, { 'viewers': ?0 } ] }")
    List<Doc> findByUserId(String userId);

    boolean existsByTitle(String title);
}
package com.codecool.springtodomvc.repository;

import com.codecool.springtodomvc.entity.Status;
import com.codecool.springtodomvc.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {

    List<Todo> getAllByStatus(@Param("status") Status status);
    List<Todo> getAllByStatus(@Param("status") String status);


}

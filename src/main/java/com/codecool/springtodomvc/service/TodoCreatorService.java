package com.codecool.springtodomvc.service;

import com.codecool.springtodomvc.entity.Status;
import com.codecool.springtodomvc.entity.Todo;
import org.springframework.stereotype.Service;

@Service
public class TodoCreatorService {

    public Todo createTodo(String title) {
        Todo todo = Todo.builder()
                .title(title)
                .status(Status.ACTIVE)
                .build();
        return todo;
    }

}

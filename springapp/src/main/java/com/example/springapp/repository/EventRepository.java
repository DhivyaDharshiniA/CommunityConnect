package com.example.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.springapp.entity.Event;
import com.example.springapp.entity.User;

import java.util.*;



public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByCreatedBy(User user);
//    List<Event> findByRegisteredUsersContains(User user);
}
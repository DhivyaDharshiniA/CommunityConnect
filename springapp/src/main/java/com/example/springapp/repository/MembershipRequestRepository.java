//package com.example.springapp.repository;
//
//import com.example.springapp.entity.MembershipRequest;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//import java.util.Optional;
//
//@Repository
//public interface MembershipRequestRepository extends JpaRepository<MembershipRequest, Long> {
//
//    // Check duplicate request
//    Optional<MembershipRequest> findByUserEmailAndNgoId(String userEmail, Long ngoId);
//
//
//    List<MembershipRequest> findByNgoId(Long ngoId);
//
//    List<MembershipRequest> findByNgoIdAndStatus(Long ngoId, String status);
//
//}

package com.example.springapp.repository;

import com.example.springapp.entity.MembershipRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MembershipRequestRepository extends JpaRepository<MembershipRequest, Long> {

    Optional<MembershipRequest> findByUserEmailAndNgo_Id(String userEmail, Long ngoId);

    List<MembershipRequest> findByNgo_Id(Long ngoId);

    List<MembershipRequest> findByNgo_IdAndStatus(Long ngoId, String status);
}
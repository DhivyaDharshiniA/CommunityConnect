package com.example.springapp.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String donorName;
    private String donorEmail;

    private Double amount;
    private String paymentMethod;

    private LocalDateTime donatedAt;

    @ManyToOne
    @JoinColumn(name="help_request_id")
    @JsonBackReference
    private HelpRequest helpRequest;

    public Donation(){
        this.donatedAt = LocalDateTime.now();
    }

    public Long getId(){ return id; }
    public void setId(Long id){ this.id=id; }

    public String getDonorName(){ return donorName; }
    public void setDonorName(String donorName){ this.donorName=donorName; }

    public String getDonorEmail(){ return donorEmail; }
    public void setDonorEmail(String donorEmail){ this.donorEmail=donorEmail; }

    public Double getAmount(){ return amount; }
    public void setAmount(Double amount){ this.amount=amount; }

    public String getPaymentMethod(){ return paymentMethod; }
    public void setPaymentMethod(String paymentMethod){ this.paymentMethod=paymentMethod; }

    public LocalDateTime getDonatedAt(){ return donatedAt; }
    public void setDonatedAt(LocalDateTime donatedAt){ this.donatedAt=donatedAt; }

    public HelpRequest getHelpRequest(){ return helpRequest; }
    public void setHelpRequest(HelpRequest helpRequest){ this.helpRequest=helpRequest; }
}
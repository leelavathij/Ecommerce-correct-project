package com.luv2code.ecommerce.entity;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="Country")
@Getter
@Setter
public class Country {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="id")
	public int Id;
	
	@Column(name="code")
	public String code;
	
	@Column(name="name")
	public String name;
	
	@OneToMany(mappedBy="country")
	@JsonIgnore
	private List<State> states;


}

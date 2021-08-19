package com.luv2code.ecommerce.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;

import com.luv2code.ecommerce.entity.Country;
import com.luv2code.ecommerce.entity.Product;
import com.luv2code.ecommerce.entity.ProductCategory;
import com.luv2code.ecommerce.entity.State;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer{
	
	public EntityManager entityManager;
	@Autowired
	public MyDataRestConfig(EntityManager theEntityManager)
	{
		entityManager = theEntityManager;
	}

	@Override
	public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
		HttpMethod[] theUnsupportedActions = {HttpMethod.PUT,HttpMethod.POST,HttpMethod.DELETE};
		
		//disable http methods for product class :put,post,delete
		disableHttpMethods(Product.class,config, theUnsupportedActions);
		
		//disable http methods for product category class :put,post,delete
		disableHttpMethods(ProductCategory.class,config, theUnsupportedActions);
		
		//disable http methods for Country class:put,post,delete
		disableHttpMethods(Country.class,config, theUnsupportedActions);
		
		//disable http methods for States class:put,post,delete
		disableHttpMethods(State.class,config, theUnsupportedActions);
		
		exposeIds(config);
	}

	private void disableHttpMethods(Class theClass,RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
		config.getExposureConfiguration()
		.forDomainType(theClass)
		.withItemExposure((metadata,httpMethods)->httpMethods.disable(theUnsupportedActions))
		.withCollectionExposure((metadata,httpMethods)->httpMethods.disable(theUnsupportedActions));
	}
	
	private void exposeIds(RepositoryRestConfiguration config)
	{
		Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();
		
		List<Class<?>> entityClasses = new ArrayList<>();
		
		for(EntityType<?> tempEntityType:entities)
		{
			entityClasses.add(tempEntityType.getJavaType());
		}
		Class<?>[] domainType = entityClasses.toArray(new Class[0]);
		config.exposeIdsFor(domainType);
	}
	
	

}

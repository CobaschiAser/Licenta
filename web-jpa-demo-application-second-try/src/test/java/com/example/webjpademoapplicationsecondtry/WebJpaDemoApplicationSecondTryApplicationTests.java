package com.example.webjpademoapplicationsecondtry;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.springframework.boot.test.context.SpringBootTest;
import services.AppUserServiceTest;
import services.ParkingServiceTest;

@RunWith(Suite.class)
@Suite.SuiteClasses({
		AppUserServiceTest.class,
		ParkingServiceTest.class
})

@SpringBootTest
public class WebJpaDemoApplicationSecondTryApplicationTests {


	@Test
	public void contextLoads() {
	}

}

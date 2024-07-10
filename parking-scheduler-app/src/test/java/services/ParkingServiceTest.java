package services;

import com.example.webjpademoapplicationsecondtry.dtos.ParkingDto;
import com.example.webjpademoapplicationsecondtry.entity.Parking;
import com.example.webjpademoapplicationsecondtry.entity.Request;
import com.example.webjpademoapplicationsecondtry.entity.Vehicle;
import com.example.webjpademoapplicationsecondtry.repository.ParkingRepository;
import com.example.webjpademoapplicationsecondtry.repository.RequestRepository;
import com.example.webjpademoapplicationsecondtry.repository.VehicleRepository;
import com.example.webjpademoapplicationsecondtry.service.impementation.ParkingServiceImpl;
import com.example.webjpademoapplicationsecondtry.service.impementation.VehicleServiceImpl;
import com.example.webjpademoapplicationsecondtry.utils.JwtUtil;
import org.assertj.core.api.Assertions;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;


public class ParkingServiceTest {

    @Mock
    ParkingRepository parkingRepository;

    @Mock
    VehicleRepository vehicleRepository;
    @Mock
    RequestRepository requestRepository;

    @InjectMocks
    ParkingServiceImpl parkingService;

    @InjectMocks
    VehicleServiceImpl vehicleService;

    @Mock
    JwtUtil jwtutil;

    private Parking parking;

    private Parking other;

    private Vehicle vehicleToAdd;

    private String token;

    private ParkingDto parkingDto;

    private ParkingDto editParkingDto;


    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        token = "token";
        parkingDto = new ParkingDto("Test_parking", 12.00, 13.45, 10);
        editParkingDto = new ParkingDto("Edit_parking", 13.00, 14.23, 11);
        parking = new Parking(parkingDto);
        other = new Parking();
        other.setName("taken");
        other.setX(12.00);
        other.setY(24.00);

        vehicleToAdd = new Vehicle();
        vehicleToAdd.setId((long)1);
        vehicleToAdd.setCurrentParking(null);

    }

    @Test
    public void whenSaveParkingIsCalled_WithValidValues_ThenReturnCorrectResponse() {

        try (MockedStatic<JwtUtil> mockedJwtUtil = Mockito.mockStatic(JwtUtil.class)) {
            // Arrange
            mockedJwtUtil.when(() -> JwtUtil.isAuthorizedAdmin(token)).thenReturn(true);

            // Act
            ResponseEntity<Parking> saveParking = parkingService.saveParking(token, parkingDto);

            // Assert
            Assertions.assertThat(saveParking).isNotNull();
            Assertions.assertThat(saveParking.getStatusCode()).isEqualTo(HttpStatus.OK);
            Assertions.assertThat(saveParking.getBody()).isEqualToComparingFieldByField(parking);

        }

    }

    @Test
    public void whenSaveParkingIsCalled_WithWrongToken_ThenReturnUnauthorizedResponse() {

        try (MockedStatic<JwtUtil> mockedJwtUtil = Mockito.mockStatic(JwtUtil.class)) {
            // Arrange
            mockedJwtUtil.when(() -> JwtUtil.isAuthorizedAdmin(token)).thenReturn(false);

            // Act
            ResponseEntity<Parking> editParking = parkingService.updateParking(token, editParkingDto, parking.getId());

            // Assert
            Assertions.assertThat(editParking).isNotNull();
            Assertions.assertThat(editParking.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);

        }

    }


    @Test
    public void whenEditParkingIsCalled_WithValidValues_ThenReturnCorrectResponse() {

        Mockito.when(parkingRepository.findParkingById(parking.getId())).thenReturn(parking);

        try (MockedStatic<JwtUtil> mockedJwtUtil = Mockito.mockStatic(JwtUtil.class)) {
            // Arrange
            mockedJwtUtil.when(() -> JwtUtil.isAuthorizedAdmin(token)).thenReturn(true);

            // Act
            ResponseEntity<Parking> editParking = parkingService.updateParking(token, editParkingDto, parking.getId());

            // Assert
            Assertions.assertThat(editParking).isNotNull();
            Assertions.assertThat(editParking.getStatusCode()).isEqualTo(HttpStatus.OK);
            Assertions.assertThat(editParking.getBody()).isEqualToComparingOnlyGivenFields(editParkingDto, "name", "x", "y", "maxCapacity");

        }

    }

    @Test
    public void whenEditParkingIsCalled_WithWrongId_ThenReturnNotFoundResponse() {

        try (MockedStatic<JwtUtil> mockedJwtUtil = Mockito.mockStatic(JwtUtil.class)) {
            // Arrange
            mockedJwtUtil.when(() -> JwtUtil.isAuthorizedAdmin(token)).thenReturn(true);

            // Act
            ResponseEntity<Parking> editParking = parkingService.updateParking(token, editParkingDto, parking.getId());

            // Assert
            Assertions.assertThat(editParking).isNotNull();
            Assertions.assertThat(editParking.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        }

    }

    @Test
    public void whenEditParkingIsCalled_WithTakenName_ThenReturnConflictResponse() {

        Mockito.when(parkingRepository.findParkingById(parking.getId())).thenReturn(parking);
        Mockito.when(parkingRepository.findParkingByName(other.getName())).thenReturn(other);


        try (MockedStatic<JwtUtil> mockedJwtUtil = Mockito.mockStatic(JwtUtil.class)) {
            // Arrange
            mockedJwtUtil.when(() -> JwtUtil.isAuthorizedAdmin(token)).thenReturn(true);
            editParkingDto.setName(other.getName());

            // Act

            ResponseEntity<Parking> editParking = parkingService.updateParking(token, editParkingDto, parking.getId());

            editParkingDto.setName(parking.getName());
            // Assert
            Assertions.assertThat(editParking).isNotNull();
            Assertions.assertThat(editParking.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        }

    }

    @Test
    public void whenEditParkingIsCalled_WithTakenCoordinates_ThenReturnConflictResponse() {
        Mockito.when(parkingRepository.findParkingById(parking.getId())).thenReturn(parking);
        Mockito.when(parkingRepository.findParkingByCoord(other.getX(), other.getY())).thenReturn(other);

        try (MockedStatic<JwtUtil> mockedJwtUtil = Mockito.mockStatic(JwtUtil.class)) {
            // Arrange
            mockedJwtUtil.when(() -> JwtUtil.isAuthorizedAdmin(token)).thenReturn(true);
            editParkingDto.setX(other.getX());
            editParkingDto.setY(other.getY());
            // Act
            ResponseEntity<Parking> editParking = parkingService.updateParking(token, editParkingDto, parking.getId());

            editParkingDto.setX(parking.getX());
            editParkingDto.setY(parking.getY());
            // Assert
            Assertions.assertThat(editParking).isNotNull();
            Assertions.assertThat(editParking.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        }

    }

    @Test
    public void whenDeleteParkingIsCalled_WithValidValues_ThenReturnCorrectResponse() {
        Mockito.when(parkingRepository.findParkingById(parking.getId())).thenReturn(parking);

        try (MockedStatic<JwtUtil> mockedJwtUtil = Mockito.mockStatic(JwtUtil.class)) {
            // Arrange
            mockedJwtUtil.when(() -> JwtUtil.isAuthorizedAdmin(token)).thenReturn(true);

            // Act
            ResponseEntity<String> deleteParking = parkingService.deleteParkingById(token, parking.getId());

            // Assert
            Assertions.assertThat(deleteParking).isNotNull();
            Assertions.assertThat(deleteParking.getBody()).isEqualTo("Ok");
            Assertions.assertThat(deleteParking.getStatusCode()).isEqualTo(HttpStatus.OK);
        }
    }

    @Test
    public void whenDeleteParkingIsCalled_WithInvalidValues_ThenReturnNotFoundResponse() {

        try (MockedStatic<JwtUtil> mockedJwtUtil = Mockito.mockStatic(JwtUtil.class)) {
            // Arrange
            mockedJwtUtil.when(() -> JwtUtil.isAuthorizedAdmin(token)).thenReturn(true);

            // Act
            ResponseEntity<String> deleteParking = parkingService.deleteParkingById(token, parking.getId());

            // Assert
            Assertions.assertThat(deleteParking).isNotNull();
            Assertions.assertThat(deleteParking.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        }

    }

    @Test
    public void whenAddVehicleToParkingIsCalled_WithValidValues_ThenReturnCorrectResponse() {
        Mockito.when(parkingRepository.findParkingById(parking.getId())).thenReturn(parking);
        Mockito.when(vehicleRepository.findVehicleById(vehicleToAdd.getId())).thenReturn(vehicleToAdd);

        try (MockedStatic<JwtUtil> mockedJwtUtil = Mockito.mockStatic(JwtUtil.class)) {
            // Arrange
            mockedJwtUtil.when(() -> JwtUtil.isAuthorizedAdmin(token)).thenReturn(true);

            int initialCapacity = parking.getCurrentCapacity();
            // Act
            ResponseEntity<String> addVehicle = parkingService.addVehicleToParking(token, parking.getId(), vehicleToAdd.getId());

            // Assert
            Assertions.assertThat(addVehicle).isNotNull();
            Assertions.assertThat(parking.getCurrentCapacity()).isEqualTo(initialCapacity + 1);
            Assertions.assertThat(vehicleToAdd.getCurrentParking()).isEqualToComparingFieldByField(parking);
            Assertions.assertThat(addVehicle.getStatusCode()).isEqualTo(HttpStatus.OK);
        }
    }

    @Test
    public void whenAddVehicleToParkingIsCalled_WithInvalidValues_ThenReturnNotFoundResponse() {
        Mockito.when(parkingRepository.findParkingById(parking.getId())).thenReturn(parking);

        try (MockedStatic<JwtUtil> mockedJwtUtil = Mockito.mockStatic(JwtUtil.class)) {
            // Arrange
            mockedJwtUtil.when(() -> JwtUtil.isAuthorizedAdmin(token)).thenReturn(true);

            int initialCapacity = parking.getCurrentCapacity();
            // Act
            ResponseEntity<String> addVehicle = parkingService.addVehicleToParking(token, parking.getId(), vehicleToAdd.getId());

            // Assert
            Assertions.assertThat(addVehicle).isNotNull();
            Assertions.assertThat(addVehicle.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        }
    }

    @Test
    public void whenRemoveVehicleFromParkingIsCalled_WithValidValues_ThenReturnCorrectResponse() {
        Mockito.when(parkingRepository.findParkingById(parking.getId())).thenReturn(parking);
        Mockito.when(vehicleRepository.findVehicleById(vehicleToAdd.getId())).thenReturn(vehicleToAdd);
        Mockito.when(parkingRepository.findParkingByVehicleId(vehicleToAdd.getId())).thenReturn(parking);
        List<Request> activeRequests = new ArrayList<>();
        Mockito.when(requestRepository.findActiveRequestWithVehicle(vehicleToAdd.getId())).thenReturn(activeRequests);
        List<Vehicle> vehicles = new ArrayList<>();
        vehicles.add(vehicleToAdd);
        Mockito.when(vehicleRepository.findVehicleByParkingId(parking.getId())).thenReturn(vehicles);


        try (MockedStatic<JwtUtil> mockedJwtUtil = Mockito.mockStatic(JwtUtil.class)) {
            // Arrange
            mockedJwtUtil.when(() -> JwtUtil.isAuthorizedAdmin(token)).thenReturn(true);

            int initialCapacity = parking.getCurrentCapacity();
            // Act
            ResponseEntity<String> removeVehicle = parkingService.removeVehicleFromParking(token, parking.getId(), vehicleToAdd.getId(), vehicleService);

            // Assert
            Assertions.assertThat(removeVehicle).isNotNull();
            Assertions.assertThat(parking.getCurrentCapacity()).isEqualTo(initialCapacity - 1);
            Assertions.assertThat(vehicleToAdd.getCurrentParking()).isEqualTo(null);
            Assertions.assertThat(removeVehicle.getStatusCode()).isEqualTo(HttpStatus.OK);
        }
    }

    @Test
    public void whenRemoveVehicleFromParkingIsCalled_WithInvalidValues_ThenReturnNotFoundResponse() {
        Mockito.when(parkingRepository.findParkingById(parking.getId())).thenReturn(parking);
        Mockito.when(vehicleRepository.findVehicleById(vehicleToAdd.getId())).thenReturn(vehicleToAdd);
        Mockito.when(parkingRepository.findParkingByVehicleId(vehicleToAdd.getId())).thenReturn(parking);
        List<Request> activeRequests = new ArrayList<>();
        Mockito.when(requestRepository.findActiveRequestWithVehicle(vehicleToAdd.getId())).thenReturn(activeRequests);
        List<Vehicle> vehicles = new ArrayList<>();
        vehicles.add(vehicleToAdd);
        Mockito.when(vehicleRepository.findVehicleByParkingId(parking.getId())).thenReturn(vehicles);


        try (MockedStatic<JwtUtil> mockedJwtUtil = Mockito.mockStatic(JwtUtil.class)) {
            // Arrange
            mockedJwtUtil.when(() -> JwtUtil.isAuthorizedAdmin(token)).thenReturn(true);

            int initialCapacity = parking.getCurrentCapacity();
            // Act
            ResponseEntity<String> removeVehicle = parkingService.removeVehicleFromParking(token, parking.getId(), (long)100, vehicleService);

            // Assert
            Assertions.assertThat(removeVehicle).isNotNull();
            Assertions.assertThat(removeVehicle.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        }
    }


    @After
    public void tearDown() {
        parking = null;
        token = null;
        parkingDto = null;
        editParkingDto = null;
        other = null;
    }

}

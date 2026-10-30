package com.HCL.Stock.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.HCL.Stock.entity.Location;
import com.HCL.Stock.repository.LocationRepository;

@Service
public class LocationService {

    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public Location addLocation(Location location) {
        return locationRepository.save(location);
    }

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    public Location getLocationById(Long id) {
        return locationRepository.findById(id).orElse(null);
    }

    public Location updateLocation(Long id, Location location) {

        Location existing = locationRepository.findById(id).orElse(null);

        if (existing != null) {
            existing.setName(location.getName());
            existing.setAddress(location.getAddress());
            existing.setCity(location.getCity());
            existing.setState(location.getState());
            existing.setPincode(location.getPincode());

            return locationRepository.save(existing);
        }

        return null;
    }

    public String deleteLocation(Long id) {

        if (locationRepository.existsById(id)) {
            locationRepository.deleteById(id);
            return "Location deleted successfully";
        }

        return "Location not found";
    }
}
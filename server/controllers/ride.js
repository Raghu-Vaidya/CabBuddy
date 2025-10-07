import Ride from "../models/Ride.js"
import User from "../models/User.js"; 

export const getRide = async (req, res, next) => {
  try{
    const ride = await Ride.findById(req.params.id).populate('creator', 'name age stars rating profile ridesCreated createdAt').lean(); 
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    res.status(200).json(ride); 
  }catch(err){
    next(err);
  }
}

export const getAllRides = async (req, res, next) => {
  try{
    const rides = await Ride.find().populate('creator', 'name stars').lean(); 
    res.status(200).json(rides); 
  }catch(err){
    next(err);
  }
}

export const findRides = async (req, res, next) => {
  try {
    const { from, to, seat, date, sort, departure } = req.query;
    console.log('SEARCH QUERY:', req.query);
    if (!from || !to || !seat || !date) {
      return res.status(400).json({ message: 'Please provide all the details' });
    }
    const searchDate = new Date(date);
    searchDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(searchDate.getTime() + 24 * 60 * 60 * 1000);

    // Departure time filter
    let departureFilters = [];
    if (departure) {
      const depArr = Array.isArray(departure) ? departure : departure.split(',');
      depArr.forEach((d) => {
        if (d === 'departure_before_six_am') {
          departureFilters.push({
            startTime: { $gte: searchDate.toISOString(), $lt: new Date(searchDate.getTime() + 6 * 60 * 60 * 1000).toISOString() }
          });
        } else if (d === 'departure_six_to_noon') {
          departureFilters.push({
            startTime: { $gte: new Date(searchDate.getTime() + 6 * 60 * 60 * 1000).toISOString(), $lt: new Date(searchDate.getTime() + 12 * 60 * 60 * 1000).toISOString() }
          });
        } else if (d === 'departure_noon_to_six') {
          departureFilters.push({
            startTime: { $gte: new Date(searchDate.getTime() + 12 * 60 * 60 * 1000).toISOString(), $lt: new Date(searchDate.getTime() + 18 * 60 * 60 * 1000).toISOString() }
          });
        }
      });
    }

    let filter = {
      'origin.place': new RegExp(from, 'i'),
      'destination.place': new RegExp(to, 'i'),
      'availableSeats': { $gte: Number(seat) },
      'startTime': { $gte: searchDate.toISOString(), $lt: nextDay.toISOString() }
    };
    if (departureFilters.length > 0) {
      filter = { ...filter, $or: departureFilters };
    }

    // Sorting
    let sortOption = { startTime: 1 };
    if (sort === 'Price') sortOption = { price: 1 };
    if (sort === 'Shortest ride') sortOption = { endTime: 1 };


    const rides = await Ride.find(filter)
      .populate('creator', 'name profilePicture stars')
      .sort(sortOption)
      .lean();

    res.status(200).json({ success: true, rides });
  } catch (err) {

    next(err);
  }
}

export const joinRide = async (req, res, next) =>{
  try{
    const ride = await Ride.findById(req.params.id);

    if (ride.passengers.includes(req.user.id)) {
      res.status(400).json('You already joined this ride!');
    }
    if (ride.passengers.length >= ride.availableSeats) {
      res.status(400).json('Ride is full!');
    }

    await Ride.updateOne(
      { _id: ride._id },
      { $push: { passengers: req.user.id }, $inc: { availableSeats: -1 } }
    ),
    await User.updateOne(
      { _id: req.user.id },
      { $push: { ridesJoined: ride._id } }
    ),

    res.status(200).json({ message: 'Successfully joined the ride!' });
  }catch(err){
    next(err);
  }
}

export const createRide = async (req, res, next) =>{
  try{
    const newRide = new Ride({...req.body, creator: req.user.id});
    await newRide.save()
    await User.findByIdAndUpdate(req.user.id, { $push: { ridesCreated: newRide._id } });
    res.status(201).json(newRide)
  }catch(err){
    next(err);
  }
}

export const updateRide = async(req, res, next) => {
  try{
    const { ...details } = req.body;
    const ride = await Ride.findByIdAndUpdate(
      req.params.id,
      {
        $set: details,
      },
      {new:true}    
    )
    res.status(200).json({success: true, ride})
  }catch(err){
    next(err)
  }
}

export const deleteRide = async(req, res, next) => {
  try{
    await Ride.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate( req.user.id, { $pull: { ridesCreated: req.params.id } })
    res.status(200).send("ride has been deleted");
  }catch(err){
    next(err)
  }
}

export const toggleLocationSharing = async(req, res, next) => {
  try{
    const ride = await Ride.findById(req.params.id);
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    if (ride.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the driver can toggle location sharing' });
    }
    
    const updatedRide = await Ride.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          'locationSharing.enabled': !ride.locationSharing.enabled,
          'locationSharing.driverLocation': null 
        }
      },
      { new: true }
    );
    
    // Emit location sharing status change to all passengers
    const io = req.app.get('io');
    if (io) {
      io.to(`ride-${req.params.id}`).emit('location-sharing-status-change', {
        enabled: updatedRide.locationSharing.enabled
      });
    }
    
    res.status(200).json({ 
      success: true, 
      locationSharingEnabled: updatedRide.locationSharing.enabled 
    });
  }catch(err){
    next(err)
  }
}

export const updateDriverLocation = async(req, res, next) => {
  try{
    const { latitude, longitude } = req.body;
    const ride = await Ride.findById(req.params.id);
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    if (ride.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the driver can update location' });
    }
    
    if (!ride.locationSharing.enabled) {
      return res.status(400).json({ message: 'Location sharing is not enabled for this ride' });
    }
    
    const updatedRide = await Ride.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          'locationSharing.driverLocation': {
            latitude,
            longitude,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );
    
    // Emit location update to all passengers in the ride
    const io = req.app.get('io');
    if (io) {
      io.to(`ride-${req.params.id}`).emit('driver-location-update', {
        latitude,
        longitude,
        timestamp: updatedRide.locationSharing.driverLocation.timestamp
      });
    }
    
    res.status(200).json({ 
      success: true, 
      location: updatedRide.locationSharing.driverLocation 
    });
  }catch(err){
    next(err)
  }
}

export const getDriverLocation = async(req, res, next) => {
  try{
    const ride = await Ride.findById(req.params.id);
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    if (!ride.passengers.includes(req.user.id) && ride.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only passengers and driver can view location' });
    }
    
    if (!ride.locationSharing.enabled) {
      return res.status(400).json({ message: 'Location sharing is not enabled for this ride' });
    }
    
    res.status(200).json({ 
      success: true, 
      locationSharingEnabled: ride.locationSharing.enabled,
      driverLocation: ride.locationSharing.driverLocation 
    });
  }catch(err){
    next(err)
  }
}
import React, { Component } from 'react';
import DatePicker from 'react-date-picker';
import Swal from 'sweetalert2';

import PassengerDetails from '../../components/passengerDetails/PassengerDetails';
import './Booking.css';


class Booking extends Component {
    constructor(props) {
        super(props);
        this.state = {
            departureDate: null,
            returnDate: null,
            source: '',
            destination: '',
            numberOfTravellers: 1,
            tripType: 'One-way',
            errorMsg: '',
            locations: ['Bangalore(BLR)', 'San Francisco(SFO)'],
            currentPage: 'flightDetails',
            bookedSeatsDetails: [],
            totalAvailableSeats: 12,
            passengerDetails: []
        }
    }

    checkSeatAvailability = () => {
        try {
            const _this = this.state;
            this.setState({ errorMsg: '' });
            if (this.validFormEntry() && this.seatStatus()) {
                const passengerDetails = [];
                for (let i = 0; i < _this.numberOfTravellers; i++) {
                    const passengerObj = {
                        bookingId: new Date().getTime() + i,
                        firstName: '',
                        middleName: '',
                        lastName: '',
                        gender: '',
                        dob: '',
                        passportNo: ''
                    }
                    passengerDetails.push(passengerObj)
                }
                this.setState({ currentPage: 'passengerDetails', passengerDetails, errorMsg: '' });
            }
        }
        catch (ex) {
            console.log(ex)
        }
    }

    validFormEntry = () => {
        try {
            const _this = this.state;
            if (_this.source === '' || _this.destination === '' || _this.departureDate === null || _this.departureDate === '') {
                this.setState({ errorMsg: 'All * marked fields are mandatory.' });
                return false;
            }
            else {
                if (_this.tripType === 'Round-trip' && (_this.returnDate === null || _this.returnDate === '')) {
                    this.setState({ errorMsg: 'All * marked fields are mandatory.' });
                    return false;
                }
                if (_this.source === _this.destination) {
                    this.setState({ errorMsg: "From and To can't be same." });
                    return false;
                }
                if (new Date((_this.departureDate).setHours(0, 0, 0, 0)) < new Date().setHours(0, 0, 0, 0)) {
                    this.setState({ errorMsg: "Departure can't be before today's date." });
                    return false;
                }
                if ((_this.tripType === 'Round-trip') && new Date((_this.departureDate).setHours(0, 0, 0, 0)) >= new Date((_this.returnDate).setHours(0, 0, 0, 0))) {
                    this.setState({ errorMsg: "Departure must be before return date." });
                    return false;
                }
                return true;
            }
        }
        catch (ex) {
            console.log(ex)
        }
    }

    seatStatus = () => {
        try {
            const _this = this.state;
            const availableDepartureSeat = 12 - _this.bookedSeatsDetails.filter(seat => seat.source === _this.source && seat.destination === _this.destination && (_this.departureDate).setHours(0, 0, 0, 0) === seat.date.setHours(0, 0, 0, 0)).length;
            let availableReturnSeat;
            if (_this.tripType === 'Round-trip') {
                availableReturnSeat = 12 - _this.bookedSeatsDetails.filter(seat => seat.source === _this.destination && seat.destination === _this.source && (_this.returnDate).setHours(0, 0, 0, 0) === seat.date.setHours(0, 0, 0, 0)).length;
            }
            if ((_this.departureDate).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
                this.setState({ errorMsg: "No seat is available for selected departure date." });
                return false;
            }
            if (_this.tripType === 'Round-trip' && (availableDepartureSeat < _this.numberOfTravellers || availableReturnSeat < _this.numberOfTravellers)) {
                this.setState({ errorMsg: `Number of seats available for selected dates: Departure- ${availableDepartureSeat} Return- ${availableReturnSeat}` });
                return false;
            }
            if (availableDepartureSeat < _this.numberOfTravellers) {
                this.setState({ errorMsg: `Number of seats available for selected departure date- ${availableDepartureSeat}` });
                return false;
            }
            return true;
        }
        catch (ex) {
            console.log(ex)
        }

    }

    addPassengerData = (id, property, value) => {
        try {
            const passengerDetails = this.state.passengerDetails;
            const itemIndex = passengerDetails.findIndex(passenger => passenger.bookingId === id);
            passengerDetails[itemIndex][property] = value;
            this.setState({ passengerDetails });
        }
        catch (ex) {
            console.log(ex)
        }
    }

    confirmBooking = () => {
        try {
            const _this = this.state;
            const bookedSeatsDetails = _this.bookedSeatsDetails;
            this.setState({ errorMsg: '' })
            if (this.validateBooking()) {
                let pnrNo = Math.random().toString(36).slice(2).toUpperCase();
                for (let i = 0; i < _this.passengerDetails.length; i++) {
                    const seatObj = {
                        ..._this.passengerDetails[i],
                        date: _this.departureDate,
                        source: _this.source,
                        destination: _this.destination,
                        pnrNo
                    }
                    bookedSeatsDetails.push(seatObj);
                }
                if (_this.tripType === 'Round-trip') {
                    pnrNo = Math.random().toString(36).slice(2).toUpperCase();
                    for (let i = 0; i < _this.passengerDetails.length; i++) {
                        const seatObj = {
                            ..._this.passengerDetails[i],
                            date: _this.returnDate,
                            source: _this.destination,
                            destination: _this.source,
                            pnrNo
                        }
                        bookedSeatsDetails.push(seatObj);
                    }
                }
                Swal.fire(
                    'Success!',
                    'Your ticket is booked!',
                    'success'
                )
                this.setState({
                    bookedSeatsDetails,
                    departureDate: null,
                    returnDate: null,
                    source: '',
                    destination: '',
                    numberOfTravellers: 1,
                    tripType: 'One-way',
                    errorMsg: '',
                    currentPage: 'flightDetails',
                    passengerDetails: []
                });
            }
        }
        catch (ex) {
            console.log(ex)
        }
    }

    validateBooking = () => {
        try {
            const invalidPassengerData = this.state.passengerDetails.filter((data) => data.firstName === '' || data.gender === '' || data.dob === '' || data.passportNo === '')
            if (invalidPassengerData.length > 0) {
                this.setState({ errorMsg: 'All * marked fields are mandatory.' });
                return false;
            }
            return true;
        }
        catch (ex) {
            console.log(ex)
        }
    }

    render() {
        const noOfTravellers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        const { errorMsg, departureDate, returnDate, locations, tripType, source, destination, numberOfTravellers, currentPage, passengerDetails } = this.state;
        const renderFlightForm = (
            <div className="booking-form">
                <div className="form-field">
                    <div className="trip-blk">
                        <div className={tripType === 'One-way' ? "trip-option selected-trip" : "trip-option"} onClick={() => this.setState({ tripType: 'One-way' })}>
                            <label className='trip-type'>One-way</label>
                        </div>
                        <div className={tripType === 'Round-trip' ? "trip-option selected-trip" : "trip-option"} onClick={() => this.setState({ tripType: 'Round-trip' })}>
                            <label className="trip-type">Round-trip</label>
                        </div>
                    </div>
                </div>
                <div className="form-field">
                    <div className="field-blk">
                        <label className='field-title'>From</label><label className='asterik'>*</label>
                    </div>
                    <div className="field-input">
                        <select onChange={(e) => this.setState({ source: e.target.value })} value={source}>
                            <option value=''>Select</option>
                            {locations.map((location, i) => <option value={location} key={i}>{location}</option>)}
                        </select>
                    </div>
                </div>
                <div className="form-field">
                    <div className="field-blk">
                        <label className='field-title'>To</label><label className='asterik'>*</label>
                    </div>
                    <div className="field-input">
                        <select onChange={(e) => this.setState({ destination: e.target.value })} value={destination}>
                            <option value=''>Select</option>
                            {locations.map((location, i) => <option value={location} key={i}>{location}</option>)}
                        </select>
                    </div>
                </div>
                <div className="form-field row">
                    <div className="date-blk p-r-10 col-sm-6">
                        <div className="field-blk">
                            <label className='field-title'>Departure</label><label className='asterik'>*</label>
                        </div>
                        <div className="field-input">
                            <DatePicker
                                onChange={(date) => { this.setState({ departureDate: date }) }}
                                value={departureDate}
                            />
                        </div>
                    </div>
                    <div className="date-blk p-l-10 col-sm-6">
                        <div className="field-blk">
                            <label className='field-title'>Return</label>
                            {
                                tripType === 'Round-trip' ? <label className='asterik'>*</label> : null
                            }
                        </div>
                        <div className="field-input">
                            <DatePicker
                                onChange={(date) => { this.setState({ returnDate: date }) }}
                                value={returnDate}
                                disabled={tripType === 'One-way'}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-field">
                    <div className="field-blk">
                        <label className='field-title'>No. of travellers</label><label className='asterik'>*</label>
                    </div>
                    <div className="field-input">
                        <select onChange={(e) => { this.setState({ numberOfTravellers: e.target.value }) }} value={numberOfTravellers}>
                            {noOfTravellers.map((number, i) => <option value={number} key={i}>{number}</option>)}
                        </select>
                    </div>
                </div>
                {
                    errorMsg.length > 0 ?
                        <div className="form-field">
                            <div className="error-blk">
                                <label className='errorMsg'>{errorMsg}</label>
                            </div>
                        </div>
                        :
                        null
                }
                <div className="form-field">
                    <div className="button-blk">
                        <input type="button" className="button" value="Proceed" onClick={this.checkSeatAvailability} />
                    </div>
                </div>
            </div>
        )

        const renderPassengersForm = (
            <div>
                {
                    passengerDetails.map((passenger, i) => {
                        return (
                            <PassengerDetails key={i} index={i + 1} id={passenger.bookingId} passenger={passenger} addPassengerData={this.addPassengerData} />

                        )
                    })
                }
                {errorMsg ?
                    <div className="error-blk passenger-error">
                        <label className='errorMsg'>{errorMsg}</label>
                    </div>
                    :
                    null
                }
                <div className="button-blk">
                    <input type="button" className="button" value="Proceed" onClick={this.confirmBooking} />
                </div>
            </div>
        );

        return (
            <div className="booking-section">
                {
                    currentPage === 'flightDetails' ?
                        renderFlightForm
                        :
                        renderPassengersForm
                }
            </div>
        )
    }
}

export default Booking;
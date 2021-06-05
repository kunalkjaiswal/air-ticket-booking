import React, { Component } from 'react';
import DatePicker from 'react-date-picker';

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
            bookedSeatsDetails: [{ trip: 'Departure', date: new Date('Sun Jun 06 2021 00:00:00 GMT+0530 (India Standard Time)') },
            { trip: 'Departure', date: new Date('Sun Jun 06 2021 00:00:00 GMT+0530 (India Standard Time)') },
            { trip: 'Departure', date: new Date('Sun Jun 06 2021 00:00:00 GMT+0530 (India Standard Time)') },
            { trip: 'Departure', date: new Date('Sun Jun 06 2021 00:00:00 GMT+0530 (India Standard Time)') }],
            totalAvailableSeats: 12
        }
    }

    checkSeatAvailability = () => {
        try {
            const _this = this;
            this.setState({ errorMsg: '' });
            if (this.validFormEntry() && this.seatStatus()) {
                this.setState({ currentPage: 'passengerDetails' });
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
        const _this = this.state;
        const availableDepartureSeat = 12 - _this.bookedSeatsDetails.filter(seat => seat.trip === 'Departure' && (_this.departureDate).setHours(0, 0, 0, 0) === seat.date.setHours(0, 0, 0, 0)).length;
        const availableReturnSeat = 12 - _this.bookedSeatsDetails.filter(seat => seat.trip === 'Return' && (_this.departureDate).setHours(0, 0, 0, 0) === seat.date.setHours(0, 0, 0, 0)).length;
        if ((_this.departureDate).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
            this.setState({ errorMsg: "No seat is available for selected departure date." });
            return false;
        }
        if (_this.tripType === 'Round-trip' && (availableDepartureSeat < _this.noOfTravellers || availableReturnSeat < _this.noOfTravellers)) {
            this.setState({ errorMsg: `No seat is available for selected dates: Departure-${availableDepartureSeat} Return-${availableReturnSeat}` });
            return false;
        }
        if (availableDepartureSeat < _this.noOfTravellers) {
            this.setState({ errorMsg: `No seat is available for selected departure date-${availableDepartureSeat}` });
            return false;
        }
        return true;

    }

    render() {
        const numberOfTravellers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        const { errorMsg, departureDate, returnDate, locations, tripType, source, destination, noOfTravellers, currentPage } = this.state;
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
                        <select onChange={(e) => { this.setState({ noOfTravellers: e.target.value }) }} value={noOfTravellers}>
                            {numberOfTravellers.map((number, i) => <option value={number} key={i}>{number}</option>)}
                        </select>
                    </div>
                </div>
                {
                    errorMsg ?
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
            <div className="passenger-form">

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
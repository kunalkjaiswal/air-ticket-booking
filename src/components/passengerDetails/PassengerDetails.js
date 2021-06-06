import React from 'react';
import DatePicker from 'react-date-picker';

import './PassengerDetails.css';

function PassengerDetails({ id, addPassengerData, index, passenger }) {
    return (
        <div className="passenger-section">
            <div className="passenger-title-blk">
                <label className="passenger-title">#{index} Passenger details</label>
            </div>
            <div className="passenger-data">
                <div className="row">
                    <div className='col-sm-4 input-blk'>
                        <label className="input-label">First name<label className='asterik'>*</label></label>
                        <input type='text' className='passenger-input' value={passenger.firstName} onChange={(e) => { addPassengerData(id, 'firstName', e.target.value) }} />
                    </div>
                    <div className='col-sm-4 input-blk'>
                        <label className="input-label">Middle name</label>
                        <input type='text' className='passenger-input' onChange={(e) => { addPassengerData(id, 'middleName', e.target.value) }} />
                    </div>
                    <div className='col-sm-4 input-blk'>
                        <label className="input-label">Last name</label>
                        <input type='text' className='passenger-input' onChange={(e) => { addPassengerData(id, 'lastName', e.target.value) }} />
                    </div>
                    <div className='col-sm-4 input-blk'>
                        <label className="input-label">Gender<label className='asterik'>*</label></label>
                        <select value={passenger.gender} className='passenger-input' onChange={(e) => { addPassengerData(id, 'gender', e.target.value) }}>
                            <option value=''>Select</option>
                            <option value='Male'>Male</option>
                            <option value='Female'>Female</option>
                            <option value='Other'>Other</option>
                        </select>
                    </div>
                    <div className='col-sm-4 input-blk'>
                        <label className="input-label">D.O.B<label className='asterik'>*</label></label>
                        <DatePicker
                            className='passenger-input'
                            onChange={(date) => { addPassengerData(id, 'dob', date) }}
                            value={passenger.dob}
                            maxDate={new Date()}
                        />
                    </div>
                    <div className='col-sm-4 input-blk'>
                        <label className="input-label">Passport number<label className='asterik'>*</label></label>
                        <input type='text' className='passenger-input' onChange={(e) => { addPassengerData(id, 'passportNo', e.target.value) }} />
                    </div>
                </div>
            </div>

        </div>
    );
}

export default PassengerDetails;
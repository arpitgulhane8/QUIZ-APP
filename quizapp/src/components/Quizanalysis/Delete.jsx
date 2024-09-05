import React from 'react';
import './delet.css';

function Delete({ onClose, onConfirm }) {
  return (
    <div className='delete'>
        <p className='p1'>Are you sure you want to delete this quiz?</p>
        <div className="actions">
          <button type="button" className='delete_btn' onClick={onConfirm}>Confirm Delete</button>
          <button type="button" className='cancel_btn' onClick={onClose}>Cancel</button>
        </div>
    </div>
  )
}

export default Delete;

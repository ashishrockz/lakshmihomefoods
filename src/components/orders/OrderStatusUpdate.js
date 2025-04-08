import React, { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Typography,
  Paper,
} from '@mui/material';
import { updateOrderStatus } from '../../services/order.service';

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const OrderStatusUpdate = ({ orderId, currentStatus, onSuccess, onCancel, isDialog = false }) => {
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleTrackingNumberChange = (e) => {
    setTrackingNumber(e.target.value);
  };

  const isValidStateTransition = () => {
    if (currentStatus === 'cancelled') return false;
    if (currentStatus === 'delivered' && status !== 'delivered') return false;
    if (currentStatus === 'pending' && status === 'delivered') return false;
    return true;
  };

  const showTrackingField = status === 'shipped' || status === 'delivered';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidStateTransition()) {
      setError('Invalid status transition. Please select a valid status.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        status,
        notes,
        ...(showTrackingField && trackingNumber && { tracking_number: trackingNumber }),
      };
      await updateOrderStatus(orderId, payload);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error updating order status:', error);
      setError(error.message || 'Failed to update order status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        ...(isDialog ? {} : { p: 3 }),
        ...(!isDialog && { component: Paper }),
      }}
    >
      {!isDialog && (
        <Typography variant="h6" gutterBottom>
          Update Order Status
        </Typography>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <FormControl fullWidth margin="normal">
        <InputLabel id="status-select-label">Status</InputLabel>
        <Select
          labelId="status-select-label"
          id="status-select"
          value={status}
          label="Status"
          onChange={handleStatusChange}
          disabled={loading || currentStatus === 'cancelled' || currentStatus === 'delivered'}
        >
          {statusOptions.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              disabled={
                (currentStatus === 'pending' && option.value === 'delivered') ||
                (currentStatus === 'shipped' && ['pending', 'processing'].includes(option.value)) ||
                (currentStatus === 'processing' && option.value === 'pending')
              }
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {showTrackingField && (
        <TextField
          margin="normal"
          fullWidth
          id="tracking-number"
          label="Tracking Number"
          name="trackingNumber"
          value={trackingNumber}
          onChange={handleTrackingNumberChange}
          disabled={loading}
          helperText={status === 'shipped' ? 'Required for shipped orders' : ''}
          required={status === 'shipped'}
        />
      )}

      <TextField
        margin="normal"
        fullWidth
        id="notes"
        label="Status Notes"
        name="notes"
        multiline
        rows={3}
        value={notes}
        onChange={handleNotesChange}
        disabled={loading}
        placeholder="Enter any additional notes about this status change"
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
        {onCancel && (
          <Button onClick={onCancel} disabled={loading} variant="outlined">
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || currentStatus === status || !isValidStateTransition()}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Updating...' : 'Update Status'}
        </Button>
      </Box>
    </Box>
  );
};

export default OrderStatusUpdate;
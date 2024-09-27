import React from 'react';
import { Modal } from 'antd';
import './DeleteModel.css';

const DeleteConfirmation = ({ visible, onConfirm, onCancel }) => {
  return (
    <Modal
      title="Confirm Delete"
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Delete"
      cancelText="Cancel"
    >
      <p>Are you sure you want to delete this transaction?</p>
    </Modal>
  );
};

export default DeleteConfirmation;

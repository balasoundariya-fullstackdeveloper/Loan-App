import React, { useState, useEffect } from "react";
import { Form, Input, Modal, Upload, Button, Image, message, Table, Select, DatePicker } from "antd";
import { UploadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import Spinner from "../components/Spinner";
import moment from "moment";
import DeleteConfirmation from "../components/deleteModel";
import './HomePage.css'
const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState(null); // New state for image URL
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectedate] = useState([]);
  const [editable, setEditable] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  // Table columns
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>,
    },
    { title: "Name", dataIndex: "name" },
    { title: "Amount", dataIndex: "amount" },
    {
      title: "Image",
      dataIndex: "image",
      render: (text) => (
        <img src={text} alt="Transaction" style={{ width: "100px" }} />
      ),
    },
    { title: "Description", dataIndex: "description" },
    { title: "Reference", dataIndex: "reference" },
    { title: "Place", dataIndex: "place" },
    {
      title: "Actions",
      render: (text, record) => (
        <div>
          <EditOutlined
            onClick={() => {
              setEditable(record);
              setShowModal(true);
            }}
          />
          <DeleteOutlined
            className="mx-2"
            onClick={() => {
              setRecordToDelete(record);
              setDeleteModalVisible(true);
            }}
          />
        </div>
      ),
    },
  ];

  // Image URL handler
  const handleImageChange = (info) => {
    if (info.file.status === "done") {
      const imageUrl = URL.createObjectURL(info.file.originFileObj);
      setImagePreview(imageUrl);
      setImageUrl(imageUrl); // Save the image URL
    }
  };

  // useEffect Hook
  useEffect(() => {
    const getAllTransactions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setLoading(true);
        const res = await axios.post("https://loan-app-2ol5.onrender.com/api/v1/transactions/get-transaction", {
          userid: user._id,
          frequency,
          selectedDate,
        });
        setLoading(false);
        setAllTransaction(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
        message.error("Fetch Issue with Transaction");
      }
    };
    getAllTransactions();
  }, [frequency, selectedDate]);

  // Form handling
  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      if (editable) {
        await axios.post("https://loan-app-2ol5.onrender.com/api/v1/transactions/edit-transaction", {
          payload: { ...values, userId: user._id, image: imageUrl }, // Include image URL
          transactionId: editable._id,
        });
        setLoading(false);
        message.success("Loan Transaction Details Updated Successfully");
      } else {
        await axios.post("https://loan-app-2ol5.onrender.com/api/v1/transactions/add-transaction", {
          ...values,
          userid: user._id,
          image: imageUrl, // Include image URL
        });
        setLoading(false);
        message.success("Loan Transaction Details Added Successfully");
      }
      setShowModal(false);
      setEditable(null);
    } catch (error) {
      setLoading(false);
      message.error("Failed to add Loan Transaction Details");
    }
  };

  // Delete handling
  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.post("https://loan-app-2ol5.onrender.com/api/v1/transactions/delete-transaction", {
        transactionId: recordToDelete._id,
      });
      setLoading(false);
      message.success("Loan Transaction Deleted Successfully");
      setDeleteModalVisible(false);
      setRecordToDelete(null);
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error("Unable to delete loan transaction");
    }
  };

  return (
    <Layout>
      {loading && <Spinner />}
      <div className="filters">
        <div>
          <h6>Select Filters</h6>
          <Select value={frequency} onChange={(values) => setFrequency(values)}>
            <Select.Option value="7">Last 1 Week</Select.Option>
            <Select.Option value="30">Last 1 Month</Select.Option>
            <Select.Option value="365">Last 1 Year</Select.Option>
            <Select.Option value="custom">custom</Select.Option>
          </Select>
          {frequency === "custom" && (
            <RangePicker value={selectedDate} onChange={(values) => setSelectedate(values)} />
          )}
        </div>
        <div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Add New
          </button>
        </div>
      </div>
      <div className="content" style={{ overflow: "auto", maxHeight: "400px" }}>
        <Table columns={columns} dataSource={allTransaction} pagination={{ pageSize: 10 }} />
      </div>
      <Modal
        title={editable ? "Edit Loan Details" : "Add Loan Details"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={false}
      >
        <Form layout="vertical" onFinish={handleSubmit} initialValues={editable}>
          <Form.Item label="Date" name="date">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Name" name="name">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Amount" name="amount">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Place" name="place">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Image" name="image">
            <Upload listType="picture" beforeUpload={() => false} onChange={handleImageChange}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
            {imagePreview && (
              <Image src={imagePreview} alt="Preview" style={{ marginTop: "10px", maxWidth: "100%" }} preview={{ open: true }} />
            )}
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Reference" name="reference">
            <Input type="text" />
          </Form.Item>
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary">
              SAVE
            </button>
          </div>
        </Form>
      </Modal>
      <DeleteConfirmation
        visible={deleteModalVisible}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </Layout>
  );
};

export default HomePage;

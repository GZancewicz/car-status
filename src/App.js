import React, { useState, useEffect } from 'react'
import logo from './logo.svg';
import './App.css';
import axios from "axios";
import {
  Modal, Button, Carousel,
  Container,
  Row,
  Col
} from "react-bootstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';


function App() {

  const APIURL = "https://6172edab110a740017222edc.mockapi.io/fleet"

  const [cars, setCars] = useState([])
  const [modalInfo, setModalInfo] = useState([])
  const [showModal, setShowModal] = useState(false)

  const [show, setShow] = useState(false)
  const handleClose = () => {
    setShow(false)
    setUpdates(updates + 1)
  }
  const handleShow = () => setShow(true)

  const [updates, setUpdates] = useState(0)

  const getCarData = async () => {
    try {
      const data = await axios.get(APIURL)
      setCars(data.data)
    } catch (error) {
      console.log(error)
    }
  }

  async function ResetCarStatus(car) {
    if (car.status === "Broken Down") {
      car.status = "Idle"
    } else {
      if (car.status === "Idle") {
        car.status = "En Route"
      } else {
        car.status = "Broken Down"
      }
    }
    await axios.put(APIURL + '/' + car.id, car)
    handleClose()
  }

  useEffect(() => {
    setCars(getCarData())
  }, [updates])

  const columns = [
    { dataField: "vin", text: "Car VIN" },
    { dataField: "status", text: "Status"}
  ]

  const rowEvents = {
    onClick: (e, row) => {
      console.log(row)
      setModalInfo(row)
      toggleTrueFalse()
    }
  }

  const toggleTrueFalse = () => {
    setShowModal(handleShow)
  }

  const ModalContent = () => {
    return (
      <Modal show={show} onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title>Car VIN {modalInfo.vin}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            <ol>Status: {modalInfo.status}</ol>
            <ol>Latitude: {modalInfo.lat}</ol>
            <ol>Longitude: {modalInfo.lon}</ol>
            <ol>
              <Button type="submit" onClick={() => ResetCarStatus(modalInfo)}>
                Toggle Status
              </Button></ol>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  return (
    <div className="App">
      <Container>
        <Row>
          <Col>
            <Row>
            <h3>Car Status</h3>
            </Row>
            <Row>
            <BootstrapTable
              keyField="vin"
              data={cars}
              columns={columns}
              pagination={paginationFactory()}
              rowEvents={rowEvents}
            />
            </Row>
            { show ? <ModalContent /> : null }
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;

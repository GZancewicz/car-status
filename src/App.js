import React, { useState, useEffect } from 'react'

import './App.css';
import axios from "axios";
import {
  Modal, Button,
  Container,
  Row,
  Col,
  ButtonGroup,
  ToggleButton
} from "react-bootstrap";
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker
} from "react-google-maps"



const GOOGLE_MAPS_URL = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAhEBULbR-9Y-GpafIc_twpyNMDCqXn8R0'
const APIURL = "https://6174019a110a740017223221.mockapi.io/fleet"

function StatusIcon(car) {
  if (car.status === "Idle") {
    return ("http://maps.google.com/mapfiles/ms/icons/yellow-dot.png")
  } else {
    if (car.status === "En Route") {
      return ("http://maps.google.com/mapfiles/ms/icons/green-dot.png")
    } else {
      return ("http://maps.google.com/mapfiles/ms/icons/red-dot.png")
    }
  }
}



function App() {



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

  useEffect(() => {
    setCars(getCarData())
  }, [updates])

  const columns = [
    { dataField: "vin", text: "Car VIN" },
    { dataField: "status", text: "Status" },
    { dataField: "lat", text: "lat" },
    { dataField: "lon", text: "lon" }
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

  async function StatusToggle(e, car) {
    car.status = e.currentTarget.value
    await axios.put(APIURL + '/' + car.id, car)
    handleClose()
  }

  function StatusToggleButtons(car) {


    const radios = [
      { name: 'En Route', value: 'En Route' },
      { name: 'Idle', value: 'Idle' },
      { name: 'Broken Down', value: 'Broken Down' },
    ];

    return (
      <>
        <ButtonGroup>
          {radios.map((radio, idx) => (
            <ToggleButton
              key={idx}
              id={`radio-${idx}`}
              type="radio"
              variant={idx % 2 ? 'outline-success' : 'outline-danger'}
              name="radio"
              value={radio.value}
              checked={car.status === radio.value}
              onChange={(e) => StatusToggle(e, car)}
            >
              {radio.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </>
    );
  }

  const ModalContent = () => {
    return (
      <Modal show={show} onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title>Car VIN {modalInfo.vin}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul>
            <ol>Latitude: {modalInfo.lat}</ol>
            <ol>Longitude: {modalInfo.lon}</ol>
          </ul>
          {StatusToggleButtons(modalInfo)}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close </Button>
        </Modal.Footer>
      </Modal>
    )
  }


  function Map() {

    const [selectedCar, setSelectedCar] = useState(null);
    const [show, setShow] = useState(false);


    return (
      <GoogleMap defaultZoom={16}
        defaultCenter={{ lat: 33.020028, lng: -96.704167 }}
      >
        {Array.from(cars).map(car => (
          <Marker
            key={car.vin}
            position={{
              lat: Number(car.lat),
              lng: Number(car.lon)
            }}
            icon={{
              url: StatusIcon(car)
            }}
            onClick={() => {
              setSelectedCar(car);
              setModalInfo(car);
              toggleTrueFalse();
            }}
          >
          </Marker>
        ))}




      </GoogleMap>
    )

  }

  const WrappedMap = withScriptjs(withGoogleMap(Map));

  return (
    <div className="App" style={{ padding: '20px' }}>
      <Container>
        <Row></Row>
        <Row>
          <Col>
            <Row>

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
            {show ? <ModalContent /> : null}
          </Col>
          <Col>
            <div >
              <WrappedMap
                googleMapURL={GOOGLE_MAPS_URL}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `400px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
              /></div></Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;

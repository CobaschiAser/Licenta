import logo from '../../logo.svg';
import '../../css/ItemList.css';
import React, { useState, useEffect } from 'react';
import {Link, useHistory, useLocation} from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import AppNavbar from "../AppNavbarBeforeLogin";
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from "@react-google-maps/api";
import AppFooter from "../AppFooter";
import {jwtDecode} from "jwt-decode";
import MyNavbar from "../MyNavbar";
import {CENTER, GOOGLE_MAP_KEY} from "../../constants/constants";

const ParkingList = () => {

    const [jwt, setJwt] = useState(localStorage.getItem('jwt') ? jwtDecode(localStorage.getItem('jwt')) : '');

    const [error, setError] = useState(false);

    useEffect(() => {
        if (jwt === '') {
            setError(true);
            window.location.href = '/error';
        }

    }, [jwt])

    const [page, setPage] = useState(1);

    const location = useLocation();

    const history = useHistory();

    const searchParams = new URLSearchParams(location.search);

    const pageFromUrl = searchParams.get('page');

    const handleViewParkingVehicles = (id) => {
        window.location.href = `/parking/${id}/vehicles`;
    }

    useEffect(() =>{
        if (!isNaN(parseInt(pageFromUrl, 10))) {
            setPage(parseInt(pageFromUrl, 10));
        } else {
            history.replace(`/parking/?page=1`);
            setPage(1);
        }
    },[pageFromUrl])

    const [clients, setClients] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(2);
    const [sortBy, setSortBy] = useState(localStorage.getItem('parkingListSortBy') || 'name');
    const [order, setOrder] = useState(localStorage.getItem('parkingListOrder') || 'asc');
    const [searchBy, setSearchBy] = useState(localStorage.getItem('parkingListSearchBy') || 'id');
    const [searchValue, setSearchValue] = useState(localStorage.getItem('parkingListSearchValue') || '');
    const [selectedParking, setSelectedParking] = useState(null);

    const center = CENTER;
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAP_KEY,
    });



    const HighlightSubstring = ({ text, substring }) => {
        const parts = text.split(new RegExp(`(${substring})`, 'gi'));
        return (
            <span>
                {parts.map((part, index) => (
                    <span key={index} className={part.toLowerCase() === substring.toLowerCase() ? 'highlight' : ''}>
                        {part}
                    </span>
                ))}
            </span>
        );
    };

    const togglePreviousPage = () => {
        history.push(`/parking?page=${page - 1}`)
        setPage((prevPage) => Math.max(prevPage - 1, 1));
        // window.location.href = `/parking?page=${page - 1}`;
        // history.replace(`/parking?page=${page - 1}`);

    }

    const toggleNextPage = () => {
        history.push(`/parking?page=${page + 1}`)
        setPage((prevPage) => Math.min(prevPage + 1, totalPages));
        // window.location.href = `/parking?page=${page + 1}`;
        // history.replace(`/parking?page=${page + 1}`)
    }

    const redirectToCreateParking = () => {
        window.location.href = `/parking/create`;
    }

    const redirectToViewParking = (id) => {
        window.location.href = `/parking/${id}`;
    }

    const redirectToEditParking = (id) => {
        window.location.href = `/parking/${id}/edit`
    }

    const handleSortChange = (event) => {
        const { value } = event.target;
        setSortBy(value);
        localStorage.setItem('parkingListSortBy', value);
    }

    const handleOrderChange = (event) => {
        const { value } = event.target;
        setOrder(value);
        localStorage.setItem('parkingListOrder', value);
    }

    const handleSearchChange = (event) => {
        const { value } = event.target;
        setSearchBy(value);
        localStorage.setItem('parkingListSearchBy', value);
    }

    const handleSearchValueChange = (event) => {
        const { value } = event.target;
        setSearchValue(value);
        localStorage.setItem('parkingListSearchValue', value);
    }

    const remove = async (id) => {
        await fetch(`/parking/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`

            }
        }).then(() => {
            let updatedClients = clients.filter(i => i.id !== id);
            setClients(updatedClients);
        });
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/parking`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                })
                const body = await response.json();
                console.log('Response:', body);
                setClients(body);
                // Verifică dacă există un filtru activ
                if (searchValue !== '') {
                    // Aplică filtrarea pentru a obține numărul de elemente după filtrare
                    const filteredClients = body.filter(client => {
                        return client[searchBy].toString().toLowerCase().includes(searchValue.toLowerCase());
                    });

                    // Calculează numărul de pagini bazat pe numărul de elemente după filtrare
                    const filteredClientsSize = filteredClients.length;
                    setTotalPages(Math.ceil(filteredClientsSize / pageSize));
                } else {
                    // Calculează numărul de pagini bazat pe numărul total de elemente
                    const clientsSize = body.length;
                    setTotalPages(Math.ceil(clientsSize / pageSize));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [page, pageSize, searchBy, searchValue]);

    useEffect(() => {
        if ((page > totalPages && totalPages > 0) || page <= 0) {
            // window.location.href = `/parking?page=1`;
            // history.replace(`/parking?page=1`)
            setPage(1);
            history.push(`/parking?page=1`)
        }
    }, [page, totalPages]);

    const sortedClients = [...clients].sort((a, b) => {
        const firstValue = a[sortBy];
        const secondValue = b[sortBy];

        if (sortBy === 'name') {
            return order === 'asc' ? firstValue.localeCompare(secondValue) : secondValue.localeCompare(firstValue);
        } else {
            return order === 'asc' ? firstValue - secondValue : secondValue - firstValue;
        }
    });

    const filteredParkings = searchValue !== '' ? sortedClients.filter(client => {
        return client[searchBy].toString().toLowerCase().includes(searchValue.toLowerCase());
    }) : sortedClients;


    console.log(page);
    const startIndex = (page <= totalPages) ? ((page - 1) * pageSize) : 0;
    const endIndex = (page <= totalPages) ? (page * pageSize) : pageSize;
    const parkingsForPage = filteredParkings.slice(startIndex, endIndex);

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    console.log(parkingsForPage);

    if (error) {
        return (
            <div>Error..</div>
        )
    }

    return (
        <div style={{display:"flex", flexDirection: "column", minHeight:"100vh"}}>
            <MyNavbar/>
            <div style={{ display: 'flex', minHeight:"85vh"}}>
                <div style={{ flex: 2, position: 'relative', border: '1px solid black' }}>
                    <div style={{ padding: '10px' }}>
                        <Container className="mt-5">
                            <div className="text-center">
                                <h2 className="mb-4 text-center">Parking List</h2>
                                <button onClick={redirectToCreateParking} className="mb-4 text-center">New Parking</button>
                            </div>
                            <div className="sorting-section">
                                <select value={sortBy} onChange={handleSortChange}>
                                    <option value="name">Sort by Name</option>
                                    <option value="maxCapacity">Sort by Max Capacity</option>
                                </select>
                                <select value={order} onChange={handleOrderChange}>
                                    <option value="asc">Ascending</option>
                                    <option value="desc">Descending</option>
                                </select>
                            </div>
                            <div className="searching-section" style={{ marginTop: "2vh" }}>
                                <select value={searchBy} onChange={handleSearchChange}>
                                    <option value="id">Search by Id</option>
                                    <option value="name">Search by Name</option>
                                </select>
                                <input type="text" value={searchValue} onChange={handleSearchValueChange} placeholder={searchValue !== '' ? searchValue : "Search..."}/>
                            </div>
                            <table className="table" style={{ marginTop: "1vh" , minHeight: "25vh"}}>
                                <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Max Capacity</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {parkingsForPage.map((client) => (
                                    <tr key={client.id}>
                                        <td>
                                            {searchValue !== '' && searchBy === 'id' ? (
                                                <HighlightSubstring text={client.id.toString()} substring={searchValue} />
                                            ) : (
                                                client.id
                                            )}
                                        </td>
                                        <td>
                                            {searchValue !== '' && searchBy === 'name' ? (
                                                <HighlightSubstring text={client.name} substring={searchValue} />
                                            ) : (
                                                client.name
                                            )}
                                        </td>
                                        <td>
                                            {client.maxCapacity}
                                        </td>
                                        <td>
                                            <Button onClick={() => redirectToViewParking(client.id)} className="btn btn-info mr-2">View</Button>
                                            {jwt['isAdmin'] === '1' && <Button onClick={() => redirectToEditParking(client.id)} className="btn btn-warning mr-2">Edit</Button>}
                                            {jwt['isAdmin'] === '1' && <Button className="btn btn-danger" onClick={() => remove(client.id)}>Delete</Button>}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <div className="pagination">
                                {page > 1 && (
                                    <Button className="btn btn-primary" onClick={togglePreviousPage}>
                                        Previous
                                    </Button>
                                )}
                                {page < totalPages && (
                                    <Button className="btn btn-primary" onClick={toggleNextPage}>
                                        Next
                                    </Button>
                                )}
                            </div>
                        </Container>
                    </div>
                </div>
                <div style={{ flex: 2, position: 'relative', border: '1px solid black' }}>
                    <div style={{ position: 'absolute', top: '10px', bottom: '10px', left: '10px', right: '10px', border: '1px solid black', overflow: 'hidden' }}>
                        <GoogleMap center={center} zoom={12} mapContainerStyle={{ width: '100%', height: '100%', border: '3px solid black', overflow: 'hidden' }}>
                            {parkingsForPage.map(parking => (
                                <Marker key={parking.id} position={{ lat: parking.x, lng: parking.y }} onClick={() => setSelectedParking(parking)} />
                            ))}
                            {selectedParking && (
                                <InfoWindow
                                    position={{ lat: selectedParking.x, lng: selectedParking.y }}
                                    onCloseClick={() => setSelectedParking(null)}
                                >
                                    <div>
                                        <p>{selectedParking.name}</p>
                                        <p>Current capacity: {selectedParking.currentCapacity}</p>
                                        <p>Max capacity: {selectedParking.maxCapacity}</p>
                                        {selectedParking.vehicles.length !== 0 && <Button variant="secondary" type="button" style={{borderColor: 'black', borderWidth: '2px'}} onClick={() => handleViewParkingVehicles(selectedParking.id)}>
                                            View Vehicles
                                        </Button>}
                                    </div>
                                </InfoWindow>
                            )}
                        </GoogleMap>
                    </div>
                </div>
            </div>
            <AppFooter/>
        </div>
    );
}

export default ParkingList;

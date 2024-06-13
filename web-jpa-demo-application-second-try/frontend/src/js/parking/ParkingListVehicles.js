import React, { useState, useEffect } from 'react';
import { Button, Container } from 'reactstrap';
import AppNavbar from "../AppNavbarBeforeLogin";
import AppFooter from "../AppFooter";
import {useHistory, useLocation} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import MyNavbar from "../MyNavbar";

const ParkingListVehicles = ({ parkingId }) => {

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

    useEffect(() =>{
        if (!isNaN(parseInt(pageFromUrl, 10))) {
            setPage(parseInt(pageFromUrl, 10));
        } else {
            history.replace(`/parking/${parkingId}/vehicles?page=1`);
            setPage(1);
        }
    },[pageFromUrl])
    console.log(page);

    const [clients, setClients] = useState([]);
    const [parking, setParking] = useState(null);

    const [totalPages, setTotalPages] = useState(0);

    const [pageSize, setPageSize] = useState(2);

    const [sortBy, setSortBy] = useState(localStorage.getItem('parkingListVehiclesSortBy' + parkingId.toString()) || 'fabricationYear');

    const [order, setOrder] = useState(localStorage.getItem('parkingListVehiclesOrder' + parkingId.toString()) || 'asc');

    const [searchBy, setSearchBy] = useState(localStorage.getItem('parkingListVehiclesSearchBy' + parkingId.toString()) || 'id');

    const [searchValue, setSearchValue] = useState(localStorage.getItem('parkingListVehiclesSearchValue' + parkingId.toString()) || '');

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
        // window.location.href =  `/parking/${parkingId}/vehicles?page=${page-1}`;
        history.push(`/parking/${parkingId}/vehicles?page=${page - 1}`)
        setPage((prevPage) => Math.max(prevPage - 1, 1));
    }

    const toggleNextPage = () => {
        // window.location.href =  `/parking/${parkingId}/vehicles?page=${page+1}`;
        history.push(`/parking/${parkingId}/vehicles?page=${page + 1}`)
        setPage((prevPage) => Math.min(prevPage + 1, totalPages));
    }
    const redirectToViewVehicle = (id) => {
        window.location.href = `/vehicle/${id}`;
    }

    const redirectToEditVehicle = (id) => {
        window.location.href = `/vehicle/${id}/edit`;
    }

    const handleSortChange = (event) => {
        const { value } = event.target;
        setSortBy(value);
        localStorage.setItem('parkingListVehiclesSortBy' + parkingId.toString(), value);
    }

    // Function to handle sorting order change
    const handleOrderChange = (event) => {
        const { value } = event.target;
        setOrder(value);
        localStorage.setItem('parkingListVehiclesOrder' + parkingId.toString(), value);
    }

    const handleSearchChange = (event) => {
        const { value } = event.target;
        setSearchBy(value);
        localStorage.setItem('parkingListVehiclesSearchBy' + parkingId.toString(), value);
    }

    const handleSearchValueChange = (event) => {
        const { value } = event.target;
        setSearchValue(value);
        localStorage.setItem('parkingListVehiclesSearchValue' + parkingId.toString(), value);
    }

    const remove = async (id) => {
        await fetch(`/vehicle/${id}`, {
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
                const response = await fetch(`http://localhost:2810/parking/${parkingId}/vehicles`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                });
                const responseParking = await fetch(`http://localhost:2810/parking/byId/${parkingId}`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                });
                const body = await response.json();
                const bodyParking = await responseParking.json();
                console.log('Response:', body);
                console.log('Response Parking:', bodyParking);
                setClients(body);
                setParking(bodyParking);
                // Verifică dacă există un filtru activ
                if (searchValue !== '') {
                    // Aplică filtrarea pentru a obține numărul de elemente după filtrare
                    const filteredClients = body.filter(client => {
                        console.log(client[searchBy]);
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
                console.log(totalPages);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [parkingId, page, pageSize, searchBy, searchValue]);

    useEffect(() => {
        if ((page > totalPages && totalPages > 0) || page <= 0) {
            // window.location.href = `/parking?page=1`;
            // history.replace(`/parking?page=1`)
            setPage(1);
            history.push(`/parking/${parkingId}/vehicles?page=1`)
        }
    }, [page, totalPages]);

    const sortedClients = [...clients].sort((a, b) => {
        const firstValue = a[sortBy];
        const secondValue = b[sortBy];

        //if (sortBy === 'fabricationYear') {
        if (order === 'asc') {
            return firstValue - secondValue;
        } else {
            return secondValue - firstValue;
        }
        //}
        /*else {
            if (order === 'asc') {
                return firstValue - secondValue;
            } else {
                return secondValue - firstValue;
            }
        }*/
    });

    const filteredVehicles = searchValue !== '' ? sortedClients.filter(client => {
        return client[searchBy].toString().toLowerCase().includes(searchValue.toLowerCase());
    }) : sortedClients;


    const startIndex = (page <= totalPages) ? ((page - 1) * pageSize) : 0;
    const endIndex = (page <= totalPages) ? (page * pageSize) : pageSize;
    const vehiclesForPage = filteredVehicles.slice(startIndex, endIndex);

    console.log(vehiclesForPage);

    if (error) {
        return (
            <div>Error..</div>
        )
    }

    return (
        <div style={{display:"flex", flexDirection: "column", minHeight:"100vh"}}>
            <MyNavbar/>
            <Container className="mt-5" style={{flex:1, marginBottom: '7vh'}}>
                <h2 className="mb-4 text-center">Vehicles of parking {parking ? parking.name : ''}</h2>
                <div className="sorting-and-searching-section" style={{display: "flex", justifyContent: "space-between"}}>
                    <div className="sorting-section">
                        <select value={sortBy} onChange={handleSortChange}>
                            <option value="numberPlate">Sort by Number Plate</option>
                            <option value="fabricationYear">Sort by Fabrication Year</option>
                            <option value="maxAutonomy">Sort by Max Autonomy</option>
                        </select>
                        <select value={order} onChange={handleOrderChange}>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                    <div className="searching-section">
                        <select value={searchBy} onChange={handleSearchChange}>
                            <option value="id">Search by Id</option>
                            <option value="brand">Search by Make</option>
                            <option value="numberPlate">Search by Number Plate</option>
                        </select>
                        <input type="text" value={searchValue} onChange={handleSearchValueChange} placeholder="Search..." />
                    </div>
                </div>
                <table className="table" style={{minHeight: "40vh"}}>
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Number Plate</th>
                        <th>Make</th>
                        <th>Model</th>
                        <th>Fabrication Year</th>
                        <th>Max Autonomy</th>
                    </tr>
                    </thead>
                    <tbody>
                    {vehiclesForPage.map((client) => (
                        <tr key={client.id}>
                            <td>
                                {searchValue !== '' && searchBy === 'id' ? (
                                    <HighlightSubstring text={client.id.toString()} substring={searchValue} />
                                ) : (
                                    client.id
                                )}
                            </td>
                            <td>
                                {searchValue !== '' && searchBy === 'numberPlate' ? (
                                    <HighlightSubstring text={client.numberPlate} substring={searchValue} />
                                ) : (
                                    client.numberPlate
                                )}
                            </td>
                            <td>
                                {searchValue !== '' && searchBy === 'brand' ? (
                                    <HighlightSubstring text={client.brand} substring={searchValue} />
                                ) : (
                                    client.brand
                                )}
                            </td>
                            <td>{client.model}</td>
                            <td>{client.fabricationYear}</td>
                            <td>{client.maxAutonomy}</td>
                            <td>

                                    <Button onClick={() => redirectToViewVehicle(client.id)} className="btn btn-info mr-2">View</Button>
                                    {jwt['isAdmin'] === '1' && <Button onClick={() => redirectToEditVehicle(client.id)} className="btn btn-warning mr-2">Edit</Button>}
                                    {jwt['isAdmin'] === '1' && <Button onClick={() => remove(client.id)} className="btn btn-danger">Delete</Button>}

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
            <AppFooter/>
        </div>
    );
}

export default ParkingListVehicles;


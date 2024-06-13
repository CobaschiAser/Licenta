import logo from '../../logo.svg';
import '../../css/ItemList.css';
import React, { useState, useEffect } from 'react';
import {Link, useHistory, useLocation} from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import AppNavbar from "../AppNavbarBeforeLogin";
import AppFooter from "../AppFooter";
import {jwtDecode} from "jwt-decode";
import MyNavbar from "../MyNavbar";



const VehicleList = () => {

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
            history.replace(`/vehicle/?page=1`);
            setPage(1);
        }
    },[pageFromUrl])

    const [clients, setClients] = useState([]);

    const [totalPages, setTotalPages] = useState(0);

    const [pageSize, setPageSize] = useState(2);

    const [sortBy, setSortBy] = useState(localStorage.getItem('vehicleListSortBy') || 'numberPlate');

    const [order, setOrder] = useState(localStorage.getItem('vehicleListOrder') || 'asc');

    const [searchBy, setSearchBy] = useState(localStorage.getItem('vehicleListSearchBy') || 'id');

    const [searchValue, setSearchValue] = useState(localStorage.getItem('vehicleListSearchValue') || '');

    //const [vehiclesForPage, setVehiclesForPage] = useState([]);

    const togglePreviousPage = () => {
        history.push(`/vehicle?page=${page-1}`)
        setPage((prevPage) => Math.max(prevPage - 1, 1));
        // window.location.href =  `/vehicle?page=${page-1}`;
    }

    const toggleNextPage = () => {
        history.push(`/vehicle?page=${page + 1}`)
        setPage((prevPage) => Math.min(prevPage + 1, totalPages));
        // window.location.href =  `/vehicle?page=${page+1}`;
    }
    const redirectToCreateVehicle = () => {
        window.location.href = `/vehicle/create`;
    }

    const redirectToViewVehicle = (id) => {
        window.location.href = `/vehicle/${id}`;
    }

    const redirectToEditVehicle = (id) => {
        window.location.href = `/vehicle/${id}/edit`
    }

    const handleSortChange = (event) => {
        const { value } = event.target;
        setSortBy(value);
        localStorage.setItem('vehicleListSortBy', value);
    }

    // Function to handle sorting order change
    const handleOrderChange = (event) => {
        const { value } = event.target;
        setOrder(value);
        localStorage.setItem('vehicleListOrder', value);
    }

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

    const handleSearchChange = (event) => {
        const {value} = event.target;
        setSearchBy(value);
        localStorage.setItem('vehicleListSearchBy', value);
    }

    const handleSearchValueChange = (event) => {
        const {value} = event.target;
        setSearchValue(value);
        localStorage.setItem('vehicleListSearchValue', value);
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
                const response = await fetch('http://localhost:2810/vehicle', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                });
                const body = await response.json();
                console.log('Response:', body);
                setClients(body);
                if (searchValue !== '') {
                    const filteredClients = body.filter(client => {
                        return client[searchBy].toString().toLowerCase().includes(searchValue.toLowerCase());
                    });
                    const filteredClientsSize = filteredClients.length;
                    setTotalPages(Math.ceil(filteredClientsSize / pageSize));
                } else {
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
        // Redirect to the first page if the requested page number exceeds the total pages
        if ((page > totalPages && totalPages > 0) || page < 1) {
            setPage(1);
            history.push(`/vehicle?page=1`)
            // window.location.href = '/vehicle?page=1';
        }
    }, [page, totalPages]);

    const sortedClients = [...clients].sort((a, b) => {
        const firstValue = a[sortBy];
        const secondValue = b[sortBy];

        if (sortBy === 'numberPlate') {
            if (order === 'asc') {
                return firstValue.localeCompare(secondValue);
            } else {
                return secondValue.localeCompare(firstValue);
            }
        } else {
            if (order === 'asc') {
                return firstValue - secondValue;
            } else {
                return secondValue - firstValue;
            }
        }

    });

    const filteredVehicles = searchValue !== '' ? sortedClients.filter(client => {
        return client[searchBy].toString().toLowerCase().includes(searchValue.toLowerCase());
    }) : sortedClients;


    const startIndex = (page <= totalPages) ? ((page - 1) * pageSize) : 0;
    const endIndex = (page <= totalPages) ? (page * pageSize) : pageSize;
    const vehiclesForPage = filteredVehicles.slice(startIndex, endIndex);

    if (error) {
        return (
            <div>Error..</div>
        )
    }

    return (
        <div style={{minHeight:'100vh', display:'flex', flexDirection: 'column'}}>
            <MyNavbar/>
            <Container className="mt-5">
                <div className="text-center">
                    <h2 className="mb-4 text-center">Vehicle List</h2>
                    <button onClick={redirectToCreateVehicle} className="mb-4 text-center">New Vehicle</button>
                </div>
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
                <table className="table" style={{marginTop:'1vh', minHeight: '25vh'}}>
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
            <AppFooter/>
        </div>
    );
}

export default VehicleList;

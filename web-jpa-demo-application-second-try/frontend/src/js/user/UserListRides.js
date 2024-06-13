import logo from '../../logo.svg';
import React, {Component, useEffect, useState} from 'react';
import {Link, useHistory, useLocation} from 'react-router-dom';
import {Button, Container} from 'reactstrap';
import '../../css/ItemList.css';
import AppNavbar from "../AppNavbarBeforeLogin";
import AppFooter from "../AppFooter";
import {jwtDecode} from "jwt-decode";
import MyNavbar from "../MyNavbar";


const UserListRides = ({ userId }) => {
    const [jwt, setJwt] = useState(localStorage.getItem('jwt') ? jwtDecode(localStorage.getItem('jwt')) : '');
    const [error, setError] = useState(false);

    useEffect(() => {
        if (jwt !== '' && jwt['isAdmin'] === '0' && jwt['uuid'] !== userId) {
            setError(true);
            window.location.href = '/error';
        }

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
            history.replace(`/user/${userId}/ride?page=1`);
            setPage(1);
        }
    },[pageFromUrl])

    const [rides, setRides] = useState([]);

    const [user, setUser] = useState(null);

    const [totalPages, setTotalPages] = useState(0);

    const [pageSize, setPageSize] = useState(2);

    const [sortBy, setSortBy] = useState(localStorage.getItem('userListsRidesSortBy' + userId.toString()) || 'date');

    const [order, setOrder] = useState(localStorage.getItem('userListsRidesOrder' + userId.toString()) ||'asc');

    const [searchBy, setSearchBy] = useState(localStorage.getItem('userListsRidesSearchBy' + userId.toString()) ||'id');

    const [searchValue, setSearchValue] = useState(localStorage.getItem('userListsRidesSearchValue' + userId.toString()) ||'');

    const togglePreviousPage = () => {
        history.push(`/user/${userId}/ride?page=${page-1}`)
        setPage((prevPage) => Math.max(prevPage - 1, 1));
        // window.location.href =  `/user/${userId}/ride?page=${page-1}`;
    }

    const toggleNextPage = () => {
        history.push(`/user/${userId}/ride?page=${page+1}`)
        setPage((prevPage) => Math.min(prevPage + 1, totalPages));
        // window.location.href =  `/user/${userId}/ride?page=${page+1}`;
    }

    const redirectToViewRide = (id) =>{
        window.location.href = `/user/${userId}/ride/${id}/view`;
    }

    const handleSortChange = (event) => {
        const { value } = event.target;
        setSortBy(value);
        localStorage.setItem('userListsRidesSortBy' + userId.toString(), value);
    }

    // Function to handle sorting order change
    const handleOrderChange = (event) => {
        const { value } = event.target;
        setOrder(value);
        localStorage.setItem('userListsRidesOrder' + userId.toString(), value);
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
        localStorage.setItem('userListsRidesSearchBy' + userId.toString(), value);
    }

    const handleSearchValueChange = (event) => {
        const {value} = event.target;
        setSearchValue(value);
        localStorage.setItem('userListsRidesSearchValue' + userId.toString(), value);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseRide = await fetch(`http://localhost:2810/user/${userId}/ride`,{
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                } );
                const responseUser = await fetch(`http://localhost:2810/user/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                });
                const bodyRide = await responseRide.json();
                const bodyUser = await responseUser.json();
                setRides(bodyRide);
                setUser(bodyUser);
                // Verifică dacă există un filtru activ
                if (searchValue !== '') {
                    // Aplică filtrarea pentru a obține numărul de elemente după filtrare
                    const filteredClients = bodyRide.filter(client => {
                        return client[searchBy].toString().toLowerCase().includes(searchValue.toLowerCase());
                    });

                    // Calculează numărul de pagini bazat pe numărul de elemente după filtrare
                    const filteredClientsSize = filteredClients.length;
                    setTotalPages(Math.ceil(filteredClientsSize / pageSize));
                } else {
                    // Calculează numărul de pagini bazat pe numărul total de elemente
                    const clientsSize = bodyRide.length;
                    setTotalPages(Math.ceil(clientsSize / pageSize));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [userId, page, pageSize, searchBy, searchValue]);

    useEffect(() => {
        // Redirect to the first page if the requested page number exceeds the total pages
        if ((page > totalPages && totalPages > 0) || page < 1) {
            setPage(1);
            history.push(`/user/${userId}/ride?page=1`)
            // window.location.href = `/user/${userId}/ride?page=1`;
        }
    }, [page, totalPages]);

    const sortedRides = [...rides].sort((a, b) => {
        const firstValue = a[sortBy];
        const secondValue = b[sortBy];

        if (sortBy === 'date') {
            if (order === 'asc') {
                return firstValue.localeCompare(secondValue);
            } else {
                return secondValue.localeCompare(firstValue);
            }
        }
        /*else {
            if (order === 'asc') {
                return firstValue - secondValue;
            } else {
                return secondValue - firstValue;
            }
        }*/
    });

    const filteredRides = searchValue !== '' ? sortedRides.filter(client => {
        return client[searchBy].toString().toLowerCase().includes(searchValue.toLowerCase());
    }) : sortedRides;


    const startIndex = (page <= totalPages) ? ((page - 1) * pageSize) : 0;
    const endIndex = (page <= totalPages) ? (page * pageSize) : pageSize;
    const ridesForPage = filteredRides.slice(startIndex, endIndex);

   /* useEffect( () => {
        if (error || ridesForPage.length === 0) {
            window.location.href = '/error';
        }
    })*/

    if (error) {
        return(
            <div>Error..</div>
        )
    }

    return (
             <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <MyNavbar/>
                 { ridesForPage.length !== 0 &&
                     <Container className="mt-5" style={{flex:1}}>
                    <div className="text-center">
                        <h2 className="mb-4 text-center">Rides of user { user ? user.username : ''}</h2>
                    </div>

                    <div className="sorting-and-searching-section" style={{display: "flex", justifyContent: "space-between"}}>
                        <div className="sorting-section">
                            <select value={sortBy} onChange={handleSortChange}>
                                <option value="date">Sort by Date</option>
                                {/*<option value="maxAutonomy">Sort by Max Autonomy</option>*/}
                            </select>
                            <select value={order} onChange={handleOrderChange}>
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>
                        <div className="searching-section">
                            <select value={searchBy} onChange={handleSearchChange}>
                                <option value="id">Search by Id</option>
                                <option value="date">Search by Date</option>
                                <option value="departure">Search by Departure</option>
                                <option value="arrival">Search by Arrival</option>
                            </select>
                            <input type="text" value={searchValue} onChange={handleSearchValueChange} placeholder="Search..." />
                        </div>
                    </div>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Date</th>
                            <th>Departure</th>
                            <th>Arrival</th>
                        </tr>
                        </thead>
                        <tbody>
                        {ridesForPage.map((client) => (
                            <tr key={client.id}>
                                <td>
                                    {searchValue !== '' && searchBy === 'id' ? (
                                        <HighlightSubstring text={client.id.toString()} substring={searchValue} />
                                    ) : (
                                        client.id
                                    )}
                                </td>
                                <td>
                                    {searchValue !== '' && searchBy === 'date' ? (
                                        <HighlightSubstring text={client.date} substring={searchValue} />
                                    ) : (
                                        client.date
                                    )}
                                </td>
                                <td>
                                    {searchValue !== '' && searchBy === 'departure' ? (
                                        <HighlightSubstring text={client.departure} substring={searchValue} />
                                    ) : (
                                        client.departure
                                    )}
                                </td>
                                <td>
                                    {searchValue !== '' && searchBy === 'arrival' ? (
                                        <HighlightSubstring text={client.arrival} substring={searchValue} />
                                    ) : (
                                        client.arrival
                                    )}
                                </td>
                                <td>
                                    <button onClick={() => redirectToViewRide(client.id)} className="btn btn-info mr-2">View</button>
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
                </Container>}
                 {ridesForPage.length === 0 &&
                     <Container className="mt-5" style={{flex:1}}>
                         <div className="text-center">
                             <h2 className="mb-4 text-center">User { user ? user.username : ''} has no rides</h2>
                         </div>
                     </Container>
                 }
                 <AppFooter/>
            </div>
        );

}

export default UserListRides;

import logo from '../../logo.svg';
import React, {Component, useEffect, useState} from 'react';
import {Link, useHistory, useLocation} from 'react-router-dom';
import {Button, Container} from 'reactstrap';
import '../../css/ItemList.css';
import AppNavbar from "../navbar_footer/AppNavbarBeforeLogin";
import AppFooter from "../navbar_footer/AppFooter";
import {jwtDecode} from "jwt-decode";
import MyNavbar from "../navbar_footer/MyNavbar";


const UserListRequests = ({ userId }) => {

    const [jwt, setJwt] = useState(localStorage.getItem('jwt') ? jwtDecode(localStorage.getItem('jwt')) : '');
    const [error, setError] = useState(false);
    const [empty, setEmpty] = useState(false);

    useEffect(() => {
        if (jwt !== '' && jwt['isAdmin'] === '0' && jwt['uuid'] !== userId) {
            setError(true);
            console.log('1');
            window.location.href = '/error';
        }

        if (jwt === '') {
            setError(true);
            console.log('2');
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
            history.replace(`/user/${userId}/request?page=1`);
            setPage(1);
        }
    },[pageFromUrl])

    const [requests, setRequests] = useState([]);

    const [user, setUser] = useState(null);

    const [totalPages, setTotalPages] = useState(0);

    const [pageSize, setPageSize] = useState(2);

    const [sortBy, setSortBy] = useState(localStorage.getItem('userListsRequestsSortBy' + userId.toString()) || 'date');

    const [order, setOrder] = useState(localStorage.getItem('userListsRequestsOrder' + userId.toString()) || 'asc');

    const [searchBy, setSearchBy] = useState(localStorage.getItem('userListsRequestsSearchBy' + userId.toString()) || 'id');

    const [searchValue, setSearchValue] = useState(localStorage.getItem('userListsRequestsSearchValue' + userId.toString()) || '');

    const togglePreviousPage = () => {
        history.push(`/user/${userId}/request?page=${page-1}`)
        setPage((prevPage) => Math.max(prevPage - 1, 1));
        // window.location.href =  `/user/${userId}/request?page=${page-1}`;
    }

    const toggleNextPage = () => {
        history.push(`/user/${userId}/request?page=${page+1}`)
        setPage((prevPage) => Math.min(prevPage + 1, totalPages));
        // window.location.href =  `/user/${userId}/request?page=${page+1}`;
    }

    const redirectToViewRequest = (userId, id) =>{
        window.location.href = `/user/${userId}/request/${id}/view`;
    }

    const redirectToEditRequest = (userId, id) => {
        window.location.href = `/user/${userId}/request/${id}/edit`;
    }

    const handleSortChange = (event) => {
        const { value } = event.target;
        setSortBy(value);
        localStorage.setItem('userListsRequestsSortBy' + userId.toString(), value);
    }

    // Function to handle sorting order change
    const handleOrderChange = (event) => {
        const { value } = event.target;
        setOrder(value);
        localStorage.setItem('userListsRequestsOrder' + userId.toString(), value);
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
        localStorage.setItem('userListsRequestsSearchBy' + userId.toString(), value);
    }

    const handleSearchValueChange = (event) => {
        const {value} = event.target;
        setSearchValue(value);
        localStorage.setItem('userListsRequestsSearchValue' + userId.toString(), value);
    }
    const startRequest = async(userId,id) => {
        await fetch(`/request/${id}/start`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        }).then(() => {
            window.location.href = `/user/${userId}/request`
        });

    };

    const finishRequest = async (userId,id) => {
        await fetch(`/request/${id}/finish`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        }).then(() => {
            window.location.href = `/user/${userId}/request`
        });

    };
    const remove = async (id) => {
        await fetch(`/request/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwt')}`
            }
        }).then(() => {
            let updatedRequests = requests.filter(i => i.id !== id);
            setRequests(updatedRequests);
        });
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseRequests = await fetch(`http://localhost:2810/user/${userId}/request`,{
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
                const bodyRequests = await responseRequests.json();
                const bodyUser = await responseUser.json();
                setRequests(bodyRequests);
                setUser(bodyUser);
                console.log(user);
                // Verifică dacă există un filtru activ
                if (searchValue !== '') {
                    // Aplică filtrarea pentru a obține numărul de elemente după filtrare
                    const filteredClients = bodyRequests.filter(client => {
                        return client[searchBy].toString().toLowerCase().includes(searchValue.toLowerCase());
                    });

                    // Calculează numărul de pagini bazat pe numărul de elemente după filtrare
                    const filteredClientsSize = filteredClients.length;
                    setTotalPages(Math.ceil(filteredClientsSize / pageSize));
                } else {
                    // Calculează numărul de pagini bazat pe numărul total de elemente
                    const clientsSize = bodyRequests.length;
                    setTotalPages(Math.ceil(clientsSize / pageSize));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [userId, page, pageSize, searchBy, searchValue]);
    console.log(user);

    useEffect(() => {
        // Redirect to the first page if the requested page number exceeds the total pages
        if ((page > totalPages && totalPages > 0) || page < 1) {
            setPage(1);
            history.push(`/user/${userId}/request?page=1`)
            // window.location.href = `/user/${userId}/request?page=1`;
        }
    }, [page, totalPages]);


    const sortedRequests = [...requests].sort((a, b) => {
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

    const filteredRequests = searchValue !== '' ? sortedRequests.filter(client => {
        return client[searchBy].toString().toLowerCase().includes(searchValue.toLowerCase());
    }) : sortedRequests;


    const startIndex = (page <= totalPages) ? ((page - 1) * pageSize) : 0;
    const endIndex = (page <= totalPages) ? (page * pageSize) : pageSize;
    const requestsForPage = filteredRequests.slice(startIndex, endIndex);


    /*useEffect( () => {
        console.log(requestsForPage);
        if (requestsForPage !== null && requestsForPage.length === 0) {
            // console.log('HERE');
            setEmpty(true);
            // window.location.href = '/error';
        }
    },  [requestsForPage])
*/
    if (error) {
        return(
            <div>Error..</div>
        )
    }

  /*  if (empty) {
        return(
            <div>Empty..</div>
        )
    }*/

    return (
        <div style={{display:"flex", flexDirection: "column", minHeight:"100vh"}}>
            <MyNavbar/>
            {requestsForPage.length !== 0 &&
                <Container className="mt-5" style={{flex:1}}>
                <div className="text-center">
                    <h2 className="mb-4 text-center">Requests of user {user ? user.username : ''}</h2>
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
                    {requestsForPage.map((client) => (
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
                                <button onClick={() => redirectToViewRequest(userId, client.id)} className="btn btn-info mr-2">View</button>
                                {!client.started && <button onClick={() => redirectToEditRequest(userId, client.id)} className="btn btn-warning mr-2">Edit</button>}
                                {!client.started && <button className="btn btn-danger" onClick={() => remove(client.id)}>Delete</button>}
                                {!client.started && jwt['isAdmin'] === '0' && <button className="btn btn-secondary" onClick={() => startRequest(userId, client.id)}>Start Request</button> }
                                {client.started && jwt['isAdmin'] === '0' && !client.solved && <button className="btn btn-success" onClick={() => finishRequest(user.id, client.id)}>Finish Request</button> }
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
            {requestsForPage.length === 0 &&
                <Container className="mt-5" style={{flex:1}}>
                    <div className="text-center">
                        <h2 className="mb-4 text-center">User {user ? user.username : ''} has no requests</h2>
                    </div>
                </Container>}
            <AppFooter/>
        </div>
    );

}

export default UserListRequests;

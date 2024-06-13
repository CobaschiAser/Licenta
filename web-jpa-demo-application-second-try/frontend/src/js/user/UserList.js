import '../../css/ItemList.css';
import React, {useEffect, useState} from 'react';
import {Button, Container} from 'reactstrap';
import AppNavbar from "../AppNavbarBeforeLogin";
import AppFooter from "../AppFooter";
import {useHistory, useLocation} from "react-router-dom";
import MyNavbar from "../MyNavbar";
import {jwtDecode} from "jwt-decode";


const UserList = () => {
    const [page, setPage] = useState(1);

    const location = useLocation();

    const history = useHistory();

    const searchParams = new URLSearchParams(location.search);

    const pageFromUrl = searchParams.get('page');

    const [jwt, setJwt] = useState(localStorage.getItem('jwt') ? jwtDecode(localStorage.getItem('jwt')) : '');


    useEffect(() => {
        if (jwt !== '' && jwt['isAdmin'] === '0') {
            window.location.href = '/error';
        }

        if (jwt === '') {
            window.location.href = '/error';
        }

    }, [jwt])


    useEffect(() =>{
        if (!isNaN(parseInt(pageFromUrl, 10))) {
            setPage(parseInt(pageFromUrl, 10));
        } else {
            history.replace(`/user/?page=1`);
            setPage(1);
        }
    },[pageFromUrl])

    const [clients, setClients] = useState([]);

    const [totalPages, setTotalPages] = useState(0);

    const [pageSize, setPageSize] = useState(2);

    const [sortBy, setSortBy] = useState(localStorage.getItem('userListSortBy') || 'username');

    const [order, setOrder] = useState(localStorage.getItem('userListOrder') || 'asc');

    const [searchBy, setSearchBy] = useState(localStorage.getItem('userListSearchBy') || 'username');

    const [searchValue, setSearchValue] = useState(localStorage.getItem('userListSearchValue') || '');


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
        history.push(`/user?page=${page - 1}`)
        setPage((prevPage) => Math.max(prevPage - 1, 1));
        // window.location.href =  `/user?page=${page-1}`;
    }

    const toggleNextPage = () => {
        history.push(`/user?page=${page + 1}`)
        setPage((prevPage) => Math.min(prevPage + 1, totalPages));
        // window.location.href =  `/user?page=${page+1}`;
    }

    const redirectToCreateRequest = (userId) => {
        window.location.href = `/user/${userId}/create-request`;
    }

    const redirectToViewUser = (id) => {
        window.location.href = `/user/${id}/view`;
    }

    const redirectToEditUser = (id) => {
        window.location.href = `/user/${id}/edit`
    }

    const handleSearchChange = (event) => {
        const {value} = event.target;
        setSearchBy(value);
        localStorage.setItem('userListSearchBy', value);
    }

    const handleSearchValueChange = (event) => {
        const {value} = event.target;
        setSearchValue(value);
        localStorage.setItem('userListSearchValue', value);
    }
    const handleSortChange = (event) => {
        const { value } = event.target;
        setSortBy(value);
        localStorage.setItem('userListSortBy', value);
    }

    // Function to handle sorting order change
    const handleOrderChange = (event) => {
        const { value } = event.target;
        setOrder(value);
        localStorage.setItem('userListOrder', value);
    }





    const remove = async (id) => {
        await fetch(`/user/${id}`, {
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
                if (jwt !== '') {
                    const response = await fetch(`http://localhost:2810/user`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                        }
                    });
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
            history.push(`/user?page=1`)
            // window.location.href = '/user?page=1';
        }
    }, [page, totalPages]);

    // Sort clients based on selected sorting option
    const sortedClients = clients ? [...clients].sort((a, b) => {
        const firstValue = a[sortBy];
        const secondValue = b[sortBy];

        if (order === 'asc') {
            return (firstValue.localeCompare(secondValue));
        } else {
            return (secondValue.localeCompare(firstValue));
        }

    }) : [];

    const filteredUsers = searchValue !== '' ? sortedClients.filter(client => {
        return client[searchBy].toString().toLowerCase().includes(searchValue.toLowerCase());
    }) : sortedClients;


    const startIndex = (page <= totalPages) ? ((page - 1) * pageSize) : 0;
    const endIndex = (page <= totalPages) ? (page * pageSize) : pageSize;
    const usersForPage = filteredUsers.slice(startIndex, endIndex);

    return (
        <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
            <MyNavbar />
            {usersForPage.length !== 0 &&
                <Container className="mt-5">
                <div className="text-center" style={{marginBottom: '7vh'}}>
                    <h2 className="mb-4 text-center">User List</h2>
                </div>
                <div className="sorting-and-searching-section" style={{display: "flex", justifyContent: "space-between"}}>
                    <div className="sorting-section">
                        <select value={sortBy} onChange={handleSortChange}>
                            <option value="username">Sort by Username</option>
                            <option value="email">Sort by Email</option>
                            <option value="registrationDate">Sort by Registration Date</option>
                        </select>
                        <select value={order} onChange={handleOrderChange}>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                    <div className="searching-section">
                        <select value={searchBy} onChange={handleSearchChange}>
                            <option value="username">Search by Username</option>
                            <option value="email">Search by Email</option>
                            <option value="id">Search by UUID</option>
                            <option value="registrationDate">Search By Registration Date</option>
                        </select>
                        <input type="text" value={searchValue} onChange={handleSearchValueChange} placeholder="Search..." />
                    </div>
                </div>
                <table className="table">
                    <thead>
                    <tr>
                        <th>UUID</th>
                        <th>Registration Date</th>
                        <th>Username</th>
                        <th>Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {usersForPage && usersForPage.map((client) => (
                        <tr key={client.id}>
                            <td>
                                {searchValue !== '' && searchBy === 'id' ? (
                                    <HighlightSubstring text={client.id.toString()} substring={searchValue} />
                                ) : (
                                    client.id
                                )}
                            </td>
                            <td>
                                {searchValue !== '' && searchBy === 'registrationDate' ? (
                                    <HighlightSubstring text={client.registrationDate} substring={searchValue} />
                                ) : (
                                    client.registrationDate
                                )}
                            </td>
                            <td>
                                {searchValue !== '' && searchBy === 'username' ? (
                                    <HighlightSubstring text={client.username} substring={searchValue} />
                                ) : (
                                    client.username
                                )}
                            </td>
                            <td>
                                {searchValue !== '' && searchBy === 'email' ? (
                                    <HighlightSubstring text={client.email} substring={searchValue} />
                                ) : (
                                    client.email
                                )}
                            </td>
                            <td>
                                <Button onClick={() => redirectToViewUser(client.id)} className="btn btn-info mr-2">View</Button>
                                <Button onClick={() => redirectToEditUser(client.id)} className="btn btn-warning mr-2">Edit</Button>
                                <Button className="btn btn-danger" onClick={() => remove(client.id)}>Delete</Button>
                                {/*<Button className="btn btn-secondary" onClick={() => redirectToCreateRequest(client.id)}>Create Request</Button>*/}
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
            }
            {usersForPage.length === 0 &&
                <Container className="mt-5">
                    <div className="text-center" style={{marginBottom: '7vh'}}>
                        <h2 className="mb-4 text-center">There are no users registered</h2>
                    </div>
                </Container>}
            <AppFooter/>
        </div>
    );
}

export default UserList;

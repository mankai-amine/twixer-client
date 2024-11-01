import React, { useEffect, useState } from 'react';
import { Container, Table, Pagination, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Header from '../components/header';
import Sidebar from '../components/sidebar';

const AdminUserList = () => {
    const [users, setUsers] = useState([]); // Initialize as an empty array
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // For error handling

    const usersPerPage = 10;
    const apiUrl1 = `${process.env.REACT_APP_API_URL}/users/all`;
    const apiUrlBan = `${process.env.REACT_APP_API_URL}/users/status`; // Ban + Unban endpoint URL

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(apiUrl1, {
                    headers: {
                        accessToken: sessionStorage.getItem("accessToken"),
                    },
                    params: {
                        page: currentPage,
                        limit: usersPerPage,
                    },
                });
                setUsers(response.data || []);
                setTotalPages(response.data.totalPages || 1);
            } catch (error) {
                setError(`Failed to fetch users: ${error.response?.data?.error || error.message}`);
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [currentPage, apiUrl1]);

    const banUser = async (id) => {
        try {
            await axios.patch(`${apiUrlBan}/${id}/ban`, {}, {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                },
            });
            // Update the user's status locally after banning
            setUsers(users.map(user => user.id === id ? { ...user, account_status: 'banned' } : user));
        } catch (error) {
            console.error(`Failed to ban user: ${error.response?.data?.message || error.message}`);
            alert(`Failed to ban user: ${error.response?.data?.message || error.message}`);
        }
    };

    const unbanUser = async (id) => {
        try {
            await axios.patch(`${apiUrlBan}/${id}/unban`, {}, {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                },
            });
            // Update the user's status locally after unbanning
            setUsers(users.map(user => user.id === id ? { ...user, account_status: 'active' } : user));
        } catch (error) {
            console.error(`Failed to unban user: ${error.response?.data?.message || error.message}`);
            alert(`Failed to unban user: ${error.response?.data?.message || error.message}`);
        }
    };

    const handlePageChange = (page) => setCurrentPage(page);

    return (
        <div>
            <Header />
            <Container fluid className="mt-4">
                <Row>
                    {/* Sidebar Section */}
                    <Col md={3} lg={2} className="px-0">
                        <Sidebar />
                    </Col>

                    {/* Main Content Section */}
                    <Col md={9} lg={10}>
                        <h2>User List</h2>

                        {loading ? (
                            <p>Loading users...</p>
                        ) : error ? (
                            <p style={{ color: 'red' }}>{error}</p>
                        ) : (
                            <>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Bio</th>
                                            <th>Creation Date</th>
                                            <th>User Options</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length > 0 ? (
                                            users.map((user) => (
                                                <tr key={user.id}>
                                                    <td>{user.id}</td>
                                                    <td>{user.username}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.role}</td>
                                                    <td>{user.account_status}</td>
                                                    <td>{user.bio}</td>
                                                    <td>{new Date(user.creation_date).toLocaleDateString()}</td>
                                                    <td>
                                                        <Button
                                                            variant={user.account_status === 'banned' ? 'success' : 'danger'}
                                                            onClick={() => user.account_status === 'banned' ? unbanUser(user.id) : banUser(user.id)}
                                                            style={{ textAlign: 'center' }}
                                                        >
                                                            {user.account_status === 'banned' ? 'Unban' : 'Ban'}
                                                        </Button>
                                                    </td>

                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="8" style={{ textAlign: 'center' }}>
                                                    No users found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>

                                <Pagination className="justify-content-center mt-3">
                                    <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                                    {[...Array(totalPages)].map((_, i) => (
                                        <Pagination.Item
                                            key={i + 1}
                                            active={i + 1 === currentPage}
                                            onClick={() => handlePageChange(i + 1)}
                                        >
                                            {i + 1}
                                        </Pagination.Item>
                                    ))}
                                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                                    <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                                </Pagination>
                            </>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AdminUserList;
